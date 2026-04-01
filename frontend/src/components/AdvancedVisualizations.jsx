/**
 * Advanced D3.js + Plotly Heatmap Visualization
 * 
 * Creates interactive heatmaps for:
 * - Node occupancy data
 * - Hitting time matrices
 * - Transition matrices
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Plot from 'react-plotly.js';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../store/slices/uiSlice';

export const AdvancedHeatmap = ({ 
  data, 
  title = 'Heatmap',
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  colorScale = 'Viridis',
  interactive = true
}) => {
  const darkMode = useSelector(selectDarkMode);
  
  // Prepare data for Plotly
  const plotData = [{
    z: data,
    type: 'heatmap',
    colorscale: colorScale,
    colorbar: {
      title: 'Value',
      thickness: 20,
      len: 0.7,
    },
    hovertemplate: '<b>Row: %{y}</b><br>Col: %{x}<br>Value: %{z:.4f}<extra></extra>',
  }];
  
  const layout = {
    title: {
      text: title,
      x: 0.5,
      xanchor: 'center',
      font: { size: 18, color: darkMode ? '#fff' : '#000' }
    },
    xaxis: {
      title: xLabel,
      side: 'bottom',
      tickfont: { color: darkMode ? '#fff' : '#000' }
    },
    yaxis: {
      title: yLabel,
      tickfont: { color: darkMode ? '#fff' : '#000' }
    },
    plot_bgcolor: darkMode ? '#1e1e1e' : '#fff',
    paper_bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
    font: { color: darkMode ? '#fff' : '#000' },
    margin: { l: 80, r: 80, t: 80, b: 80 },
    hovermode: 'closest',
  };
  
  return (
    <Plot
      data={plotData}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: interactive,
        displaylogo: false,
      }}
    />
  );
};

/**
 * D3.js Network Visualization
 * Visualizes graph structure with nodes and edges
 */
export const NetworkVisualization = ({ nodes, edges, title = 'Graph Network' }) => {
  const svgRef = useRef();
  const darkMode = useSelector(selectDarkMode);
  
  useEffect(() => {
    if (!svgRef.current || !nodes || !edges) return;
    
    const width = svgRef.current.clientWidth || 600;
    const height = svgRef.current.clientHeight || 400;
    
    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d.id)
        .distance(50))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 5));
    
    // Clear SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Add zoom behavior
    const g = svg.append('g');
    const zoom = d3.zoom()
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);
    
    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .style('stroke', darkMode ? '#888' : '#999')
      .style('stroke-width', 1.5)
      .style('stroke-opacity', 0.6);
    
    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.radius || 5)
      .style('fill', d => d.color || '#1e88e5')
      .style('stroke', darkMode ? '#fff' : '#000')
      .style('stroke-width', 1.5)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => d.label || d.id)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', darkMode ? '#fff' : '#000')
      .style('pointer-events', 'none');
    
    // Tick function
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y + 4);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Add hover tooltips
    node.append('title')
      .text(d => `Node ${d.id}\nDegree: ${d.degree || 0}`);
    
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, darkMode]);
  
  return (
    <div className="network-visualization">
      <h3>{title}</h3>
      <svg 
        ref={svgRef}
        style={{
          width: '100%',
          height: '400px',
          border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
          borderRadius: '4px',
          backgroundColor: darkMode ? '#1e1e1e' : '#fff'
        }}
      />
    </div>
  );
};

/**
 * Advanced Time Series Visualization
 * Shows statistical distributions over time
 */
export const TimeSeriesChart = ({ 
  data, 
  title = 'Time Series',
  yLabel = 'Value',
  showConfidence = true
}) => {
  const darkMode = useSelector(selectDarkMode);
  
  // Prepare traces
  const traces = [
    {
      x: data.time || data.map((_, i) => i),
      y: data.values || data,
      name: 'Mean',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#1e88e5', width: 2 },
      hovertemplate: '<b>Time: %{x}</b><br>Value: %{y:.4f}<extra></extra>',
    }
  ];
  
  // Add confidence interval if available
  if (showConfidence && data.upper && data.lower) {
    traces.push({
      x: [...data.time, ...data.time.reverse()],
      y: [...data.upper, ...data.lower.reverse()],
      fill: 'toself',
      fillcolor: 'rgba(30, 136, 229, 0.2)',
      line: { color: 'transparent' },
      name: '95% CI',
      hovertemplate: '',
    });
  }
  
  const layout = {
    title: {
      text: title,
      x: 0.5,
      xanchor: 'center',
      font: { size: 18, color: darkMode ? '#fff' : '#000' }
    },
    xaxis: { title: 'Time', tickfont: { color: darkMode ? '#fff' : '#000' } },
    yaxis: { title: yLabel, tickfont: { color: darkMode ? '#fff' : '#000' } },
    plot_bgcolor: darkMode ? '#1e1e1e' : '#fff',
    paper_bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
    font: { color: darkMode ? '#fff' : '#000' },
    hovermode: 'x unified',
  };
  
  return <Plot data={traces} layout={layout} />;
};

/**
 * Distribution Analysis Chart
 * Shows histogram with fitted curve
 */
export const DistributionChart = ({ 
  data, 
  title = 'Distribution Analysis',
  binSize = 20
}) => {
  const darkMode = useSelector(selectDarkMode);
  
  // Histogram trace
  const histogramTrace = {
    x: data,
    type: 'histogram',
    name: 'Observed',
    nbinsx: binSize,
    marker: { color: '#1e88e5', opacity: 0.7 },
  };
  
  // Calculate statistics for fitted curve
  const mean = data.reduce((a, b) => a + b) / data.length;
  const variance = data.reduce((sq, n) => sq + Math.pow(n - mean, 2)) / data.length;
  const std = Math.sqrt(variance);
  
  // Create fitted normal distribution
  const minX = mean - 4 * std;
  const maxX = mean + 4 * std;
  const xValues = d3.range(minX, maxX, (maxX - minX) / 100);
  const yValues = xValues.map(x => {
    const exp = Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
    return (1 / (std * Math.sqrt(2 * Math.PI))) * exp * data.length * (maxX - minX) / 100;
  });
  
  const curveTrace = {
    x: xValues,
    y: yValues,
    type: 'scatter',
    mode: 'lines',
    name: 'Normal Fit',
    line: { color: '#ff6f00', width: 2 },
  };
  
  const layout = {
    title: {
      text: title,
      x: 0.5,
      xanchor: 'center',
      font: { size: 18, color: darkMode ? '#fff' : '#000' }
    },
    xaxis: { title: 'Value', tickfont: { color: darkMode ? '#fff' : '#000' } },
    yaxis: { title: 'Frequency', tickfont: { color: darkMode ? '#fff' : '#000' } },
    plot_bgcolor: darkMode ? '#1e1e1e' : '#fff',
    paper_bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
    font: { color: darkMode ? '#fff' : '#000' },
    hovermode: 'x',
  };
  
  return <Plot data={[histogramTrace, curveTrace]} layout={layout} />;
};

/**
 * 3D Surface Plot for Multi-dimensional Analysis
 */
export const SurfacePlot = ({ 
  z, 
  title = '3D Surface',
  xLabel = 'X',
  yLabel = 'Y',
  zLabel = 'Z'
}) => {
  const darkMode = useSelector(selectDarkMode);
  
  const trace = [{
    z: z,
    type: 'surface',
    colorscale: 'Viridis',
    hovertemplate: `<b>${xLabel}: %{x}</b><br><b>${yLabel}: %{y}</b><br><b>${zLabel}: %{z:.4f}<extra></extra>`,
  }];
  
  const layout = {
    title: {
      text: title,
      font: { color: darkMode ? '#fff' : '#000' }
    },
    scene: {
      xaxis: { title: xLabel },
      yaxis: { title: yLabel },
      zaxis: { title: zLabel },
    },
    plot_bgcolor: darkMode ? '#1e1e1e' : '#fff',
    paper_bgcolor: darkMode ? '#2d2d2d' : '#f5f5f5',
    font: { color: darkMode ? '#fff' : '#000' },
  };
  
  return <Plot data={trace} layout={layout} />;
};

export default {
  AdvancedHeatmap,
  NetworkVisualization,
  TimeSeriesChart,
  DistributionChart,
  SurfacePlot,
};
