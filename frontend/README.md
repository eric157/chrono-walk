# Chrono-Walk Frontend

A React + Vite frontend for the Stochastic Simulator using browser-based computation.

## Technical Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Plotly.js** - Interactive visualization
- **Tailwind CSS** - Styling
- **JavaScript Port** - Full algorithm implementation in browser

## Ported Algorithms

All algorithms have been ported from Python to JavaScript:

- `buildCycleTransition()` - Build cycle graph transition matrix
- `buildRandomGraph()` - Build random graph with connectivity
- `buildGridGraph()` - Build 2D grid graph
- `simulateWalkGeneral()` - Simulate a random walk
- `runSimulationsFast()` - Run multiple simulations for cycle coverage
- `estimateHittingTimes()` - Estimate first passage times
- `mixingTime()` - Compute spectral gap-based mixing time

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
