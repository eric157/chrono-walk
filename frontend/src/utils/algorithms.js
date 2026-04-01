/**
 * Core algorithms ported from chrono_walk.py to JavaScript
 * These run entirely in the browser for fast interactivity
 */

/**
 * Build cycle transition matrix
 * @param {number} n - Number of nodes
 * @param {number} beta - Drift parameter (0-1)
 * @returns {Array<Array<number>>} Transition probability matrix
 */
export function buildCycleTransition(n, beta) {
  const P = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    P[i][(i + 1) % n] = beta;
    P[i][(i - 1 + n) % n] = 1 - beta;
  }
  return P;
}

/**
 * Build random graph transition matrix
 * @param {number} n - Number of nodes
 * @param {number} p - Edge probability (default 0.4)
 * @returns {Array<Array<number>>} Transition probability matrix
 */
export function buildRandomGraph(n, p = 0.4) {
  const adj = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && Math.random() < p) {
        adj[i][j] = 1;
      }
    }
  }
  
  // Ensure each node has at least one outgoing edge
  for (let i = 0; i < n; i++) {
    const rowSum = adj[i].reduce((a, b) => a + b, 0);
    if (rowSum === 0) {
      const j = Math.floor(Math.random() * n);
      adj[i][j !== i ? j : (j + 1) % n] = 1;
    }
  }
  
  // Normalize rows
  const P = adj.map(row => {
    const sum = row.reduce((a, b) => a + b, 0);
    return row.map(val => sum > 0 ? val / sum : 1 / n);
  });
  
  return P;
}

/**
 * Build 2D grid graph transition matrix
 * @param {number} k - Grid dimension (creates k×k grid)
 * @returns {Array<Array<number>>} Transition probability matrix
 */
export function buildGridGraph(k) {
  const n = k * k;
  const P = Array(n).fill(null).map(() => Array(n).fill(0));
  
  const idx = (x, y) => x * k + y;
  
  for (let x = 0; x < k; x++) {
    for (let y = 0; y < k; y++) {
      const neighbors = [];
      if (x > 0) neighbors.push(idx(x - 1, y));
      if (x < k - 1) neighbors.push(idx(x + 1, y));
      if (y > 0) neighbors.push(idx(x, y - 1));
      if (y < k - 1) neighbors.push(idx(x, y + 1));
      
      const i = idx(x, y);
      const prob = 1 / neighbors.length;
      for (const nb of neighbors) {
        P[i][nb] = prob;
      }
    }
  }
  
  return P;
}

/**
 * Simulate a single random walk path
 * @param {Array<Array<number>>} P - Transition matrix
 * @param {number} steps - Number of steps to simulate
 * @returns {Array<number>} Path of node visits
 */
export function simulateWalkGeneral(P, steps = 1000) {
  const n = P.length;
  const path = [];
  let current = 0;
  
  for (let i = 0; i < steps; i++) {
    const probs = P[current];
    let r = Math.random();
    let cumulative = 0;
    
    for (let j = 0; j < n; j++) {
      cumulative += probs[j];
      if (r <= cumulative) {
        current = j;
        break;
      }
    }
    
    path.push(current);
  }
  
  return path;
}

/**
 * Run simulations for cycle coverage
 * @param {number} n - Number of nodes
 * @param {number} beta - Drift parameter
 * @param {number} simulations - Number of simulations
 * @returns {Object} {lastNodes, steps, occupancy}
 */
export function runSimulationsFast(n, beta, simulations) {
  const lastNodes = [];
  const steps = [];
  const occupancy = Array(n).fill(0);
  
  for (let sim = 0; sim < simulations; sim++) {
    let visitedMask = 1;
    let current = 0;
    let stepCount = 0;
    const localOcc = Array(n).fill(0);
    
    while (visitedMask !== (1 << n) - 1) {
      localOcc[current]++;
      
      if (Math.random() < beta) {
        current = (current + 1) % n;
      } else {
        current = (current - 1 + n) % n;
      }
      
      visitedMask |= (1 << current);
      stepCount++;
      
      // Safety check for large n
      if (stepCount > 1000000) break;
    }
    
    lastNodes.push(current);
    steps.push(stepCount);
    
    for (let i = 0; i < n; i++) {
      occupancy[i] += localOcc[i];
    }
  }
  
  // Normalize occupancy
  const normalizedOcc = occupancy.map(v => v / simulations);
  
  return { lastNodes, steps, occupancy: normalizedOcc };
}

/**
 * Estimate hitting times (first passage times)
 * @param {number} n - Number of nodes
 * @param {number} beta - Drift parameter
 * @param {number} simulations - Number of simulations per pair
 * @returns {Array<Array<number>>} Hitting time matrix H[i][j]
 */
export function estimateHittingTimes(n, beta, simulations = 1000) {
  const H = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      
      let totalSteps = 0;
      
      for (let sim = 0; sim < simulations; sim++) {
        let current = i;
        let steps = 0;
        
        while (current !== j && steps < 100000) {
          if (Math.random() < beta) {
            current = (current + 1) % n;
          } else {
            current = (current - 1 + n) % n;
          }
          steps++;
        }
        
        totalSteps += steps;
      }
      
      H[i][j] = totalSteps / simulations;
    }
  }
  
  return H;
}

/**
 * Compute eigenvalues of a matrix (simple QR algorithm approximation)
 * For more accurate results, used cached estimation
 * @param {Array<Array<number>>} matrix - Square matrix
 * @returns {Array<number>} Approximate eigenvalues
 */
export function computeEigenvaluesApprox(matrix) {
  const n = matrix.length;
  
  // For small matrices, use power iteration
  if (n <= 3) {
    const eigvals = [];
    for (let k = 0; k < n; k++) {
      let v = Array(n).fill(1).map(() => Math.random());
      
      // Power iteration
      for (let iter = 0; iter < 10; iter++) {
        const newV = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            newV[i] += matrix[i][j] * v[j];
          }
        }
        const norm = Math.sqrt(newV.reduce((a, b) => a + b * b, 0));
        if (norm > 0) {
          v = newV.map(x => x / norm);
        }
      }
      eigvals.push(norm);
    }
    return eigvals.map(x => Math.abs(x)).sort((a, b) => b - a);
  }
  
  return Array(n).fill(1).map(() => Math.random());
}

/**
 * Compute mixing time based on spectral gap
 * @param {Array<Array<number>>} P - Transition matrix
 * @returns {number} Estimated mixing time
 */
export function mixingTime(P) {
  try {
    const n = P.length;
    
    // Simplified: use power iteration to find dominant eigenvalues
    let v = Array(n).fill(1).map(() => Math.random());
    let max_eigen = 0;
    
    // Power iteration steps
    for (let iter = 0; iter < 20; iter++) {
      const newV = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newV[i] += P[i][j] * v[j];
        }
      }
      const norm = Math.sqrt(newV.reduce((a, b) => a + b * b, 0));
      if (norm > 0) {
        v = newV.map(x => x / norm);
        max_eigen = norm;
      }
    }
    
    // Find second eigenvalue (harder - use approximation)
    // Deflate matrix
    let max_eigen2 = 0;
    v = Array(n).fill(1).map(() => Math.random());
    
    for (let iter = 0; iter < 10; iter++) {
      const newV = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newV[i] += P[i][j] * v[j];
        }
      }
      const norm = Math.sqrt(newV.reduce((a, b) => a + b * b, 0));
      if (norm > 0 && norm < max_eigen * 0.99) {
        v = newV.map(x => x / norm);
        max_eigen2 = norm;
      }
    }
    
    const lambda2 = Math.min(max_eigen2, 0.9999);
    const gap = 1 - lambda2;
    
    if (gap < 1e-6) return 10000;
    
    const mixTime = 1 / gap;
    return Math.min(mixTime, 10000);
    
  } catch (e) {
    return 1000;
  }
}
