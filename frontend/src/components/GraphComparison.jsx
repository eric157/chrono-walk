import React, { useState, useMemo } from 'react'
import Plot from 'react-plotly.js'
import {
  buildCycleTransition,
  buildRandomGraph,
  buildGridGraph,
  mixingTime
} from '../utils/algorithms'

export function GraphComparison() {
  const [n, setN] = useState(10)
  const [numTrials, setNumTrials] = useState(3)
  const [isComputing, setIsComputing] = useState(false)
  
  const results = useMemo(() => {
    setIsComputing(true)
    
    const mixTimesCycle = []
    const mixTimesRandom = []
    const mixTimesGrid = []
    
    for (let trial = 0; trial < numTrials; trial++) {
      const P_cycle = buildCycleTransition(n, 0.5)
      const P_random = buildRandomGraph(n, 0.4)
      const P_grid = buildGridGraph(Math.floor(Math.sqrt(n)))
      
      mixTimesCycle.push(mixingTime(P_cycle))
      mixTimesRandom.push(mixingTime(P_random))
      mixTimesGrid.push(mixingTime(P_grid))
    }
    
    const avgCycle = mixTimesCycle.reduce((a, b) => a + b, 0) / numTrials
    const avgRandom = mixTimesRandom.reduce((a, b) => a + b, 0) / numTrials
    const avgGrid = mixTimesGrid.reduce((a, b) => a + b, 0) / numTrials
    
    setIsComputing(false)
    
    return {
      avgCycle: Math.min(avgCycle, 1000),
      avgRandom: Math.min(avgRandom, 1000),
      avgGrid: Math.min(avgGrid, 1000)
    }
  }, [n, numTrials])
  
  const fastest = Math.min(results.avgCycle, results.avgRandom, results.avgGrid)
  const fastestName = fastest === results.avgCycle ? 'Cycle' : fastest === results.avgRandom ? 'Random' : 'Grid'
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="section-header">🧪 Graph Type Comparison</h2>
      <div className="info-box">
        <strong>What's happening?</strong> We compare how quickly random walks mix on three different graph types. 
        <strong>Mixing time</strong> measures how fast the walker forgets its starting position. Lower = faster mixing.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="slider-container">
          <label className="slider-label">Graph Size: {n}</label>
          <input
            type="range"
            min="5"
            max="20"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            disabled={isComputing}
            className="w-full"
          />
        </div>
        
        <div className="slider-container">
          <label className="slider-label">Number of Trials: {numTrials}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={numTrials}
            onChange={(e) => setNumTrials(parseInt(e.target.value))}
            disabled={isComputing}
            className="w-full"
          />
        </div>
      </div>
      
      {isComputing && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-500">
          <p className="text-lg font-semibold text-gray-800">Computing mixing times...</p>
        </div>
      )}
      
      <Plot
        data={[{
          x: ['🔵 Cycle', '🎲 Random', '⊞ Grid'],
          y: [results.avgCycle, results.avgRandom, results.avgGrid],
          type: 'bar',
          marker: {
            color: ['#667eea', '#764ba2', '#ee5a6f']
          }
        }]}
        layout={{
          title: 'Graph Mixing Time Comparison (Lower = Faster Mixing)',
          xaxis: { title: 'Graph Type' },
          yaxis: { title: 'Mixing Time' },
          height: 500,
          font: { size: 12 },
          showlegend: false,
          margin: { l: 50, r: 50, t: 50, b: 50 },
          hovermode: 'x unified'
        }}
        config={{ responsive: true, displayModeBar: true }}
      />
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="metric-card">
          🔵 Cycle<br/>{results.avgCycle.toFixed(2)}
        </div>
        <div className="metric-card">
          🎲 Random<br/>{results.avgRandom.toFixed(2)}
        </div>
        <div className="metric-card">
          ⊞ Grid<br/>{results.avgGrid.toFixed(2)}
        </div>
      </div>
      
      <div className="mt-8 bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
        <h4 className="font-bold text-green-800 mb-2">📊 Interpretation:</h4>
        <p className="text-gray-800">
          ✅ <strong>{fastestName} graphs mix fastest!</strong>
          {fastestName === 'Cycle' && ' Regular structure helps the walker explore efficiently.'}
          {fastestName === 'Random' && ' Chaos helps mixing - random edges connect distant parts.'}
          {fastestName === 'Grid' && ' 2D structure provides good connectivity.'}
        </p>
      </div>
    </div>
  )
}
