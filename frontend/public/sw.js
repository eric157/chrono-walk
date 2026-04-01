/**
 * Service Worker for Chrono-Walk PWA
 * 
 * Enables offline support, caching strategies, and background sync
 * 
 * Installation: Include in index.html:
 * <script>
 *   if ('serviceWorker' in navigator) {
 *     navigator.serviceWorker.register('/sw.js')
 *       .then(reg => console.log('SW registered'))
 *       .catch(err => console.error('SW error:', err));
 *   }
 * </script>
 */

const CACHE_NAME = 'chrono-walk-v1';
const RUNTIME_CACHE = 'chrono-walk-runtime';
const OFFLINE_PAGE = '/chrono-walk/offline.html';
const API_CACHE = 'chrono-walk-api';

// Files to cache immediately
const ASSETS_TO_CACHE = [
  '/chrono-walk/',
  '/chrono-walk/index.html',
  '/chrono-walk/main.jsx',
  '/chrono-walk/index.css',
  '/chrono-walk/manifest.json',
  '/chrono-walk/offline.html'
];

// API endpoints that benefit from caching
const API_ENDPOINTS = [
  '/api/cycle-analysis',
  '/api/hitting-times',
  '/api/mixing-time',
  '/api/graph-comparison'
];

// ============================================================================
// Install Event - Cache Assets
// ============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Activate immediately
      .catch((err) => {
        console.error('[SW] Install failed:', err);
      })
  );
});

// ============================================================================
// Activate Event - Clean Old Caches
// ============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME && 
                cacheName !== RUNTIME_CACHE && 
                cacheName !== API_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Take control of pages
  );
});

// ============================================================================
// Fetch Event - Caching Strategies
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: API Endpoints - Network First, Cache Fallback
  if (url.pathname.includes('/api/')) {
    return event.respondWith(apiStrategy(request));
  }

  // Strategy 2: Assets - Cache First, Network Fallback
  if (isAsset(url)) {
    return event.respondWith(cacheFirstStrategy(request));
  }

  // Strategy 3: HTML - Network First, Cache Fallback
  if (request.destination === 'document') {
    return event.respondWith(networkFirstStrategy(request));
  }

  // Default: Cache First
  return event.respondWith(cacheFirstStrategy(request));
});

// ============================================================================
// Caching Strategies
// ============================================================================

/**
 * Network First Strategy
 * Try network, fallback to cache, fallback to offline page
 */
async function networkFirstStrategy(request) {
  try {
    console.log('[SW] Network First:', request.url);
    const response = await fetch(request);
    
    // Cache successful response
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Fetching from cache:', request.url);
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page for document
    if (request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    
    throw error;
  }
}

/**
 * Cache First Strategy
 * Try cache, fallback to network
 */
async function cacheFirstStrategy(request) {
  try {
    const cached = await caches.match(request);
    
    if (cached) {
      console.log('[SW] Cache Hit:', request.url);
      return cached;
    }
    
    console.log('[SW] Cache Miss, fetching:', request.url);
    const response = await fetch(request);
    
    // Cache successful response
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    throw error;
  }
}

/**
 * API Strategy
 * Network first for fresh data, cache as fallback
 */
async function apiStrategy(request) {
  // Stale While Revalidate pattern
  const cached = await caches.match(request);
  
  try {
    console.log('[SW] Fetching API:', request.url);
    const response = await fetch(request, { 
      timeout: 10000 // API timeout
    });
    
    // Cache successful API response
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] API failed, using cache:', request.url);
    
    // Return cached API response if available
    if (cached) {
      return cached;
    }
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Offline - API unavailable',
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if URL is a static asset
 */
function isAsset(url) {
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
  return assetExtensions.some(ext => url.pathname.endsWith(ext));
}

// ============================================================================
// Background Sync for Offline Computations
// ============================================================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);
  
  if (event.tag === 'sync-simulations') {
    event.waitUntil(syncOfflineSimulations());
  }
});

/**
 * Sync computations that were queued offline
 */
async function syncOfflineSimulations() {
  try {
    // Retrieve queued simulations from IndexedDB
    const db = await openIndexedDB();
    const queue = await getQueuedSimulations(db);
    
    console.log('[SW] Syncing', queue.length, 'queued simulations');
    
    for (const simulation of queue) {
      try {
        const response = await fetch(simulation.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(simulation.data)
        });
        
        if (response.ok) {
          await removeFromQueue(db, simulation.id);
          
          // Notify clients of completion
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'simulation-synced',
              id: simulation.id,
              result: await response.json()
            });
          });
        }
      } catch (error) {
        console.error('[SW] Sync failed for:', simulation.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error;
  }
}

// ============================================================================
// Push Notifications
// ============================================================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Simulation complete!',
    icon: '/chrono-walk/icons/icon-192x192.png',
    badge: '/chrono-walk/icons/badge-72x72.png',
    tag: 'chrono-walk-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Results',
        icon: '/chrono-walk/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/chrono-walk/icons/dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Chrono-Walk', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === '/chrono-walk/' && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/chrono-walk/');
          }
        })
    );
  }
});

// ============================================================================
// Message Handler - Communication with Clients
// ============================================================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(RUNTIME_CACHE).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.keys().then((requests) => {
        event.ports[0].postMessage({ 
          size: requests.length,
          urls: requests.map(r => r.url)
        });
      });
    });
  }
});

// Placeholder for IndexedDB functions (implement in main app)
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('chronoWalkDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getQueuedSimulations(db) {
  return []; // Implement as needed
}

async function removeFromQueue(db, id) {
  // Implement as needed
}
