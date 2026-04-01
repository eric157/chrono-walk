# Chrono-Walk Frontend

A modern React + Vite frontend for the Stochastic Simulator, deployable to GitHub Pages.

## Features

✅ **No Server Required** - Runs entirely in the browser
✅ **Interactive Visualizations** - Plotly.js charts with real-time updates
✅ **Algorithm Porting** - Full JavaScript port of Python algorithms
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Modern Stack** - React 18, Vite, Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to GitHub Pages

```bash
npm run deploy
```

This automatically builds and deploys to GitHub Pages using the `gh-pages` package.

## Project Structure

```
src/
├── components/
│   ├── CycleAnalysis.jsx      # Cycle graph simulation
│   ├── AnimatedWalk.jsx       # Real-time walk animation
│   ├── HittingTime.jsx        # Hitting time heatmap
│   └── GraphComparison.jsx    # Graph mixing comparison
├── utils/
│   └── algorithms.js          # Core algorithms (JavaScript port)
├── App.jsx                    # Main app component
├── main.jsx                   # React entry point
└── index.css                  # Tailwind + custom styles
```

## ported Algorithms

All algorithms have been ported from Python to JavaScript:

- `buildCycleTransition()` - Build cycle graph transition matrix
- `buildRandomGraph()` - Build random graph with connectivity
- `buildGridGraph()` - Build 2D grid graph
- `simulateWalkGeneral()` - Simulate a random walk
- `runSimulationsFast()` - Run multiple simulations for cycle coverage
- `estimateHittingTimes()` - Estimate first passage times
- `mixingTime()` - Compute spectral gap-based mixing time

## Customization

### Add Backend API

To use with a backend API (e.g., for heavier computations):

1. Create environment file `.env`:
```env
VITE_API_URL=http://localhost:8000
```

2. Update components to fetch from API:
```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/simulate`, {
  method: 'POST',
  body: JSON.stringify({ n, beta, simulations })
})
```

### Host on Custom Domain

Update `vite.config.js`:
```javascript
export default defineConfig({
  ...
  base: '/',  // For root domain
  // or
  base: '/my-app/',  // For subdirectory
})
```

## Performance Notes

- Browser-based computations work well for small to medium graphs (n < 30)
- Simulations run on the main thread (consider Web Workers for heavy loads)
- Caching is handled by React's `useMemo` hook
- Charts are responsive and optimized with Plotly's built-in features

## Browser Compatibility

- Chrome/Chromium: ✅
- Firefox: ✅
- Safari: ✅
- Edge: ✅
- IE 11: ❌ (not supported)

## License

MIT
