import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { buildCycleTransition, simulateWalkGeneral } from '../utils/algorithms'

export function AnimatedWalk() {
  const [n, setN] = useState(12)
  const [beta, setBeta] = useState(0.5)
  const [isRunning, setIsRunning] = useState(false)
  const [frameIndex, setFrameIndex] = useState(0)
  const [path, setPath] = useState([])
  const [totalFrames, setTotalFrames] = useState(200)
  
  useEffect(() => {
    const P = buildCycleTransition(n, beta)
    const newPath = simulateWalkGeneral(P, totalFrames)
    setPath(newPath)
    setFrameIndex(0)
  }, [n, beta, totalFrames])
  
  useEffect(() => {
    if (!isRunning || frameIndex >= path.length) {
      setIsRunning(false)
      return
    }
    
    const timer = setTimeout(() => {
      setFrameIndex(frameIndex + 1)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [isRunning, frameIndex, path])
  
  const theta = Array.from({ length: n }, (_, i) => (i * 360 / n))
  const currentNodeTheta = path.length > 0 ? theta[path[frameIndex]] : 0
  
  const directionText = beta > 0.6 ? '🟢 Clockwise ➡️' : beta < 0.4 ? '⬅️ Counterclockwise 🟢' : '🟡 Random 🔀'
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="section-header">🎥 Real-Time Bee Movement</h2>
      <div className="info-box">
        <strong>What's happening?</strong> Watch a bee (red star) randomly walk around a circular hive. 
        Notice how drift makes it favor one direction!
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="slider-container">
          <label className="slider-label">Number of Nodes: {n}</label>
          <input
            type="range"
            min="5"
            max="20"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>
        
        <div className="slider-container">
          <label className="slider-label">Drift β: {beta.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            disabled={isRunning}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg transition"
        >
          {isRunning ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          onClick={() => setFrameIndex(0)}
          className="px-6 py-2 bg-gray-400 text-white font-bold rounded-lg hover:bg-gray-500 transition"
        >
          🔄 Reset
        </button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
        <p className="text-lg font-semibold text-gray-800">
          Frame: {frameIndex + 1}/{path.length} | Current Node: {path.length > 0 ? path[frameIndex] : 'N/A'} | {directionText}
        </p>
      </div>
      
      <div className="progress-bar mb-4">
        <div className="progress-fill" style={{ width: `${(frameIndex / path.length) * 100}%` }}></div>
      </div>
      
      <Plot
        data={[
          {
            r: Array(n).fill(1),
            theta: theta,
            type: 'scatterpolar',
            mode: 'markers',
            marker: { size: 12, color: '#764ba2', opacity: 0.7 },
            name: 'Hive Nodes'
          },
          {
            r: [1],
            theta: [currentNodeTheta],
            type: 'scatterpolar',
            mode: 'markers',
            marker: { size: 20, color: '#ff6b6b', symbol: 'star' },
            name: 'Bee'
          }
        ]}
        layout={{
          title: `Step ${frameIndex + 1}/${path.length}`,
          height: 500,
          font: { size: 12 },
          margin: { l: 50, r: 50, t: 50, b: 50 },
          showlegend: true
        }}
        config={{ responsive: true, displayModeBar: false }}
      />
    </div>
  )
}
