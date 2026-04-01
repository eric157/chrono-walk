# Data Visualization Handbook

## Overview

Chrono-Walk uses Plotly.js for interactive 3D visualizations and D3.js for custom, advanced analytics visualizations.

## Visualization Components

### 1. Heatmaps - Interactive Matrix Display

**Best for:** Occupancy patterns, hitting time matrices, transition matrices

```javascript
import { AdvancedHeatmap } from './AdvancedVisualizations';

<AdvancedHeatmap
  data={occupancyMatrix}
  title="Node Occupancy Heat Map"
  xLabel="Node Index"
  yLabel="Simulation Trial"
  colorScale="Viridis"
  interactive={true}
/>
```

**Features:**
- ✅ Hover tooltips showing exact values
- ✅ Zoom and pan controls
- ✅ Multiple color scales (Viridis, Plasma, Inferno, Magma)
- ✅ Customizable color bar
- ✅ Export as PNG

**Color Schemes:**
- `Viridis` - Perceptually uniform
- `Plasma` - Bright and contrasting
- `Inferno` - Dark to bright
- `Magma` - Purple to yellow

### 2. Network Graphs - D3.js Force-Directed Layout

**Best for:** Graph structure visualization, node relationships

```javascript
import { NetworkVisualization } from './AdvancedVisualizations';

const nodes = [
  { id: 0, label: 'Node 0', radius: 5, color: '#1e88e5', degree: 2 },
  { id: 1, label: 'Node 1', radius: 5, color: '#1e88e5', degree: 3 },
  // ...
];

const edges = [
  { source: 0, target: 1 },
  { source: 1, target: 2 },
  // ...
];

<NetworkVisualization nodes={nodes} edges={edges} title="Graph Network" />
```

**Features:**
- ✅ Force-directed layout algorithm
- ✅ Draggable nodes
- ✅ Zoom and pan
- ✅ Interactive node labels
- ✅ Collision detection

### 3. Time Series - Line Charts with Confidence Intervals

**Best for:** Evolution of metrics over time, convergence analysis

```javascript
import { TimeSeriesChart } from './AdvancedVisualizations';

const data = {
  time: [0, 1, 2, 3, 4, 5],
  values: [100, 115, 120, 125, 128, 130],
  upper: [105, 120, 125, 130, 133, 135],
  lower: [95, 110, 115, 120, 123, 125]
};

<TimeSeriesChart
  data={data}
  title="Cover Time Convergence"
  yLabel="Expected Steps"
  showConfidence={true}
/>
```

**Features:**
- ✅ Line plot with confidence bands
- ✅ Multiple series support
- ✅ Hover statistics
- ✅ Legend toggling

### 4. Distribution Analysis - Histogram with Fitted Curve

**Best for:** Cover time distribution, first passage time analysis

```javascript
import { DistributionChart } from './AdvancedVisualizations';

const coverTimes = [200, 220, 210, 215, 230, ...]; // 50k samples

<DistributionChart
  data={coverTimes}
  title="Cover Time Distribution"
  binSize={30}
/>
```

**Features:**
- ✅ Interactive histogram
- ✅ Fitted normal distribution
- ✅ Statistical annotations
- ✅ Emoji customization

### 5. 3D Surface Plots - Multidimensional Analysis

**Best for:** Parameter sensitivity analysis, interaction effects

```javascript
import { SurfacePlot } from './AdvancedVisualizations';

// Calculate mixing time surface over (n, beta) grid
const nValues = [5, 10, 15, 20, 25];
const betaValues = [0.1, 0.3, 0.5, 0.7, 0.9];
const mixingTimes = calculateMixingGrid(nValues, betaValues);

<SurfacePlot
  z={mixingTimes}
  title="Mixing Time Sensitivity"
  xLabel="Graph Size (n)"
  yLabel="Drift Parameter (β)"
  zLabel="Mixing Time"
/>
```

**Features:**
- ✅ 3D rotation and zoom
- ✅ Smooth surface rendering
- ✅ Color mapping
- ✅ Interactive exploration

## Color Scales

### Sequential Scales (Low to High)

| Scale | Best For | Example |
|-------|----------|---------|
| Viridis | Scientific data | Heat maps, distributions |
| Plasma | High contrast | Occupancy patterns |
| Inferno | Dark theme | Performance metrics |
| Magma | Publication | Academic papers |
| Blues | Conservative | Professional reports |

### Diverging Scales (Symmetric around center)

| Scale | Best For |
|-------|----------|
| RdBu | Temperature, anomalies |
| PiYG | Positive/negative |
| PRGn | Growth/decline |

## Creating Custom Visualizations

### Example: Advanced Heatmap with Annotations

```javascript
import Plot from 'react-plotly.js';

export function AnnotatedHeatmap({ matrix, x_labels, y_labels }) {
  const trace = {
    z: matrix,
    x: x_labels,
    y: y_labels,
    type: 'heatmap',
    colorscale: 'Viridis',
    hovertemplate: '<b>%{y}</b> → <b>%{x}</b><br>Time: %{z:.2f}s<extra></extra>',
    colorbar: {
      title: 'Time (s)',
      thickness: 15,
      len: 0.7,
      x: 1.02
    }
  };
  
  const layout = {
    title: 'First Passage Times',
    xaxis: { title: 'Target Node' },
    yaxis: { title: 'Start Node' },
    width: 800,
    height: 700,
    margin: { l: 100, r: 150, t: 100, b: 100 }
  };
  
  return <Plot data={[trace]} layout={layout} />;
}
```

### Example: D3.js Custom Visualization

```javascript
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function CustomVisualization({ data }) {
  const svgRef = useRef();
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    // Select/create SVG
    const svg = d3.select(svgRef.current);
    const width = 600, height = 400;
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([50, width - 50]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height - 50, 50]);
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));
    
    // Add path
    svg.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#1e88e5')
      .attr('stroke-width', 2);
    
    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height - 50})`)
      .call(d3.axisBottom(xScale));
    
    svg.append('g')
      .attr('transform', 'translate(50,0)')
      .call(d3.axisLeft(yScale));
  
  }, [data]);
  
  return <svg ref={svgRef} width="600" height="400" />;
}
```

## Performance Optimization

### 1. Data Aggregation

For large datasets, pre-aggregate before visualization:

```javascript
// ❌ Pass 50k points directly (slow rendering)
<Plot data={[{ y: allPoints }]} />

// ✅ Pre-aggregate with bins
const aggregated = aggregateData(allPoints, binSize=100);
<Plot data={[{ y: aggregated }]} />
```

### 2. Lazy Rendering

```javascript
const [visibleCharts, setVisibleCharts] = useState({});

useEffect(() => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setVisibleCharts(prev => ({
          ...prev,
          [entry.target.id]: true
        }));
      }
    });
  });
  
  document.querySelectorAll('.chart').forEach(el => observer.observe(el));
}, []);
```

### 3. Responsive Charts

```javascript
import { useResizeObserver } from './hooks';

export function ResponsiveChart({ data }) {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  useResizeObserver(containerRef, entry => {
    const { width } = entry.contentRect;
    setDimensions({
      width: width,
      height: width * 0.75 // Maintain aspect ratio
    });
  });
  
  return (
    <div ref={containerRef} className="chart-container">
      <Plot
        data={data}
        layout={{
          ...defaultLayout,
          width: dimensions.width,
          height: dimensions.height
        }}
      />
    </div>
  );
}
```

## Dark Mode Support

```javascript
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../store/slices/uiSlice';

export function Chart({ data }) {
  const darkMode = useSelector(selectDarkMode);
  
  const layout = {
    plot_bgcolor: darkMode ? '#1e1e1e' : '#fff',
    paper_bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
    font: { color: darkMode ? '#fff' : '#000' },
  };
  
  return <Plot data={data} layout={layout} />;
}
```

## Accessibility

### ARIA Labels

```javascript
<Plot
  data={data}
  layout={{
    title: 'Cover Time Distribution',
    xaxis: { title: 'Time (steps)' },
    yaxis: { title: 'Frequency' }
  }}
  config={{
    accessibility: {
      staticPlot: false,
      label: 'Interactive histogram showing cover time distribution'
    }
  }}
/>
```

### High Contrast Mode

```javascript
const highContrastTheme = {
  plot_bgcolor: '#000',
  paper_bgcolor: '#fff',
  font: { color: '#000', size: 14 },
  colorways: [
    ['#000', '#fff', '#ff0000', '#00ff00', '#0000ff']
  ]
};
```

## Export Options

```javascript
// Export as PNG
chart.downloadPlot('chart.png');

// Export as SVG
chart.downloadPlot('chart.svg');

// Export data as CSV
const csv = convertToCSV(matrix);
downloadCSV(csv, 'results.csv');

// Export as JSON
const json = JSON.stringify({ data, timestamp });
downloadJSON(json, 'results.json');
```

---

See [README.md](../README.md) for visualization gallery and examples.
