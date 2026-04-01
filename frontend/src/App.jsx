import React, { useState } from 'react'
import { CycleAnalysis } from './components/CycleAnalysis'
import { AnimatedWalk } from './components/AnimatedWalk'
import { HittingTime } from './components/HittingTime'
import { GraphComparison } from './components/GraphComparison'

function App() {
  const [mode, setMode] = useState('cycle')
  
  const modes = [
    { id: 'cycle', label: 'Cycle Analysis', icon: '🎯' },
    { id: 'animated', label: 'Animated Walk', icon: '🎥' },
    { id: 'hitting', label: 'Hitting Time', icon: '🧠' },
    { id: 'comparison', label: 'Graph Comparison', icon: '🧪' }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="main-title">🐝 Chrono-Walk: Stochastic Simulator</h1>
          <p className="text-gray-700 text-lg font-medium mt-4">
            Explore random walks, hitting times, and graph mixing dynamics
          </p>
          <p className="text-gray-600 text-sm mt-2">
            ⚡ Runs entirely in your browser - No server required!
          </p>
        </div>
        
        {/* Mode Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition transform hover:scale-105 ${
                mode === m.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow hover:shadow-md border-2 border-gray-200'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="mb-8">
          {mode === 'cycle' && <CycleAnalysis />}
          {mode === 'animated' && <AnimatedWalk />}
          {mode === 'hitting' && <HittingTime />}
          {mode === 'comparison' && <GraphComparison />}
        </div>
        
        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-300">
          <p className="text-gray-600">
            Built with ⚛️ React, 📊 Plotly, and 🚀 Vite
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Algorithms ported from Python to JavaScript for browser execution
          </p>
          <p className="text-gray-500 text-sm mt-3">
            <a href="https://github.com/eric157/chrono-walk/" className="text-blue-600 hover:underline">
              View on GitHub
            </a>
          </p>
        </div>
        
      </div>
    </div>
  )
}

export default App
