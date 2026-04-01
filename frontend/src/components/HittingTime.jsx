import React, { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import { estimateHittingTimes } from '../utils/algorithms'

export function HittingTime() {
  const [n, setN] = useState(10)
  const [beta, setBeta] = useState(0.5)
  
  const H = useMemo(() => {
    return estimateHittingTimes(n, beta, 500)
  }, [n, beta])
  
  // Create heatmap data
  const z = H
  const x = Array.from({ length: n }, (_, i) => i)
  const y = Array.from({ length: n }, (_, i) => i)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="section-header">🧠 Hitting Time Matrix</h2>
      <div className="info-box">
        <strong>What's happening?</strong> This heatmap shows the average number of steps needed to reach node j 
        starting from node i. Darker colors = faster arrival times. Red = slower.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="slider-container">
          <label className="slider-label">Number of Nodes: {n}</label>
          <input
            type="range"
            min="5"
            max="15"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="slider-container">
          <label className="slider-label">Drift β (0=random, 1=biased): {beta.toFixed(2)}</label>
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
      
      <Plot
        data={[{
          z: z,
          x: x,
          y: y,
          type: 'heatmap',
          colorscale: 'YlOrRd',
          colorbar: { title: 'Steps' }
        }]}
        layout={{
          title: 'Average Steps to Reach Target Node (Hitting Time)',
          xaxis: { title: 'Target Node' },
          yaxis: { title: 'Starting Node' },
          height: 600,
          font: { size: 12 },
          margin: { l: 80, r: 80, t: 80, b: 80 }
        }}
        config={{ responsive: true, displayModeBar: true }}
      />
    </div>
  )
}
