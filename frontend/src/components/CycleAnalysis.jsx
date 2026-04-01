import React, { useState, useMemo, useRef, useEffect } from 'react'
import Plotly from 'plotly.js-dist-min'
import { runSimulationsFast } from '../utils/algorithms'

export function CycleAnalysis() {
  const [n, setN] = useState(12)
  const [beta, setBeta] = useState(0.5)
  const polarRef = useRef(null)
  const histRef = useRef(null)
  
  const { occupancy, steps } = useMemo(() => {
    return runSimulationsFast(n, beta, 50000)
  }, [n, beta])
  
  const theta = Array.from({ length: n }, (_, i) => i * 360 / n)
  const histData = steps.slice(0, 1000) // Sample for histogram
  
  useEffect(() => {
    if (polarRef.current) {
      const data = [{
        r: occupancy,
        theta: theta,
        type: 'barpolar',
        marker: {
          color: occupancy,
          colorscale: 'Plasma',
          showscale: true,
          colorbar: { title: 'Occupancy' }
        }
      }]
      const layout = {
        title: 'Which nodes does the walker favor?',
        height: 500,
        font: { size: 12 },
        margin: { l: 50, r: 50, t: 50, b: 50 }
      }
      Plotly.newPlot(polarRef.current, data, layout, { responsive: true })
    }
  }, [occupancy, theta])
  
  useEffect(() => {
    if (histRef.current) {
      const data = [{
        x: histData,
        type: 'histogram',
        nbinsx: 50,
        marker: { color: '#667eea' },
        name: 'Frequency'
      }]
      const layout = {
        title: 'How many steps to visit every node?',
        xaxis: { title: 'Steps' },
        yaxis: { title: 'Frequency' },
        height: 500,
        font: { size: 12 },
        showlegend: false,
        margin: { l: 50, r: 50, t: 50, b: 50 },
        hovermode: 'x unified'
      }
      Plotly.newPlot(histRef.current, data, layout, { responsive: true })
    }
  }, [histData])
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="section-header">🎯 Cycle Analysis</h2>
      <div className="info-box">
        <strong>What's happening?</strong> We run 50,000 simulations of a random walk on a cycle graph with drift. 
        The left graph shows which nodes the walker favors, and the right shows how many steps it takes to visit all nodes.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="slider-container">
          <label className="slider-label">Number of Nodes: {n}</label>
          <input
            type="range"
            min="5"
            max="30"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="slider-container">
          <label className="slider-label">
            Drift β (0=counterclockwise, 1=clockwise): {beta.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="subtitle">Node Occupancy Distribution</h3>
          <div ref={polarRef}></div>
        </div>
        
        <div>
          <h3 className="subtitle">Steps to Cover All Nodes</h3>
          <div ref={histRef}></div>
        </div>
      </div>
    </div>
  )
}
