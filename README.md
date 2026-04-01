# 🐝 Chrono-Walk: Stochastic Simulator

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-blue?style=for-the-badge&logo=github-pages)](https://eric157.github.io/chrono-walk/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite 5](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-3.4-3F51B5?style=flat-square)](https://plotly.com/javascript/)

**Advanced stochastic process simulator with real-time Monte Carlo visualizations**

[🚀 View Live Site](https://eric157.github.io/chrono-walk/) • [📐 Architecture](docs/ARCHITECTURE.md)

</div>

---

## 📊 Operational Modes

```
╔════════════════════════════════════════════════════════════════╗
║           🎯 Four Analysis Modes - Real-time Browser           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🎯 CYCLE ANALYSIS          📊 Algorithm: Monte Carlo (50k)   ║
║  ✓ 50,000 simulations        📈 Output: Heatmaps + PDF       ║
║  ✓ Occupancy patterns        ⏱️ Time: 5-10 seconds            ║
║  ✓ Cover distribution                                          ║
║                                                                ║
║  🎥 ANIMATED WALK            📊 Algorithm: Single simulation  ║
║  ✓ Real-time visualization   📈 Output: Path animation        ║
║  ✓ 200 frames/sec            ⏱️ Time: Real-time @ 60fps       ║
║  ✓ Interactive controls                                        ║
║                                                                ║
║  🧠 HITTING TIME             📊 Algorithm: MC integration     ║
║  ✓ First passage matrix      📈 Output: Heatmap (n×n)       ║
║  ✓ 500 trials/pair           ⏱️ Time: 3-5 seconds           ║
║  ✓ Interactive hover                                           ║
║                                                                ║
║  🧪 GRAPH COMPARISON         📊 Algorithm: Spectral gap      ║
║  ✓ 3 graph types             📈 Output: Comparison chart     ║
║  ✓ Mixing analysis           ⏱️ Time: 2-4 seconds           ║
║  ✓ Performance comparison                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

| Mode | Algorithm | Output | Time |
|------|-----------|--------|------|
| **🎯 Cycle Analysis** | Monte Carlo (50k trials) | Occupancy heatmap, cover time PDF | ⏱️ 5-10s |
| **🎥 Animated Walk** | Single walk simulation | Real-time path animation | ⚡ 60fps |
| **🧠 Hitting Time** | First passage estimation | Heatmap matrix (n×n) | ⏱️ 3-5s |
| **🧪 Graph Comparison** | Spectral gap analysis | Time series comparison | ⏱️ 2-4s |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Frontend["🖥️ <b>Frontend Layer</b>"]
        App["⚛️<br/><b>App.jsx</b><br/>(State Mgmt)"]
        C1["🎯<br/><b>CycleAnalysis</b>"]
        C2["🎥<br/><b>AnimatedWalk</b>"]
        C3["🧠<br/><b>HittingTime</b>"]
        C4["🧪<br/><b>GraphComparison</b>"]
        Utils["⚙️<br/><b>algorithms.js</b>"]
        Plotly["📊<br/><b>Plotly.js</b><br/>(D3 Charts)"]
    end
    
    subgraph Algorithms["🔬 <b>Algorithm Layer</b>"]
        Sim["📍<br/><b>simulateWalkGeneral()</b>"]
        Build["🔗<br/><b>buildCycleTransition()</b>"]
        Hit["🎯<br/><b>estimateHittingTimes()</b>"]
        Mix["🌀<br/><b>mixingTime()</b>"]
    end
    
    subgraph Compute["⚡ <b>Computation Engine</b>"]
        MC["🎲<br/><b>Monte Carlo</b><br/>Sampling"]
        Matrix["📦<br/><b>Transition</b><br/>Matrices"]
        Eigen["λ<br/><b>Spectral</b><br/>Analysis"]
    end
    
    subgraph Output["🚀 <b>Static Deployment</b>"]
        GH["☁️<br/><b>GitHub Pages</b><br/>/chrono-walk/"]
    end
    
    App --> C1
    App --> C2
    App --> C3
    App --> C4
    
    C1 --> Utils --> Sim
    C2 --> Utils --> Sim
    C3 --> Utils --> Hit
    C4 --> Utils --> Mix
    
    Sim --> MC
    Build --> Matrix
    Mix --> Eigen
    
    Utils --> Plotly
    Plotly --> GH
    
    style Frontend fill:#1e88e5,stroke:#0d47a1,color:#fff,stroke-width:3px
    style Algorithms fill:#7b1fa2,stroke:#4a148c,color:#fff,stroke-width:3px
    style Compute fill:#f57c00,stroke:#e65100,color:#fff,stroke-width:3px
    style Output fill:#00796b,stroke:#004d40,color:#fff,stroke-width:3px
    style App fill:#42a5f5,stroke:#1e88e5,color:#000,stroke-width:2px
    style C1 fill:#64b5f6,stroke:#42a5f5,color:#000,stroke-width:2px
    style C2 fill:#64b5f6,stroke:#42a5f5,color:#000,stroke-width:2px
    style C3 fill:#64b5f6,stroke:#42a5f5,color:#000,stroke-width:2px
    style C4 fill:#64b5f6,stroke:#42a5f5,color:#000,stroke-width:2px
    style Utils fill:#90caf9,stroke:#64b5f6,color:#000,stroke-width:2px
    style Plotly fill:#bbdefb,stroke:#90caf9,color:#000,stroke-width:2px
    style Sim fill:#b39ddb,stroke:#7b1fa2,color:#000,stroke-width:2px
    style Build fill:#b39ddb,stroke:#7b1fa2,color:#000,stroke-width:2px
    style Hit fill:#b39ddb,stroke:#7b1fa2,color:#000,stroke-width:2px
    style Mix fill:#b39ddb,stroke:#7b1fa2,color:#000,stroke-width:2px
    style MC fill:#ffb74d,stroke:#f57c00,color:#000,stroke-width:2px
    style Matrix fill:#ffb74d,stroke:#f57c00,color:#000,stroke-width:2px
    style Eigen fill:#ffb74d,stroke:#f57c00,color:#000,stroke-width:2px
    style GH fill:#4db8a8,stroke:#00796b,color:#000,stroke-width:2px
```

---

## 🛠️ Built With

<div align="center">

### 🎨 Frontend Stack
| Component | Technology | Badge |
|-----------|-----------|-------|
| **⚛️ UI Framework** | React 18 | ![React](https://img.shields.io/badge/-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=white) |
| **⚡ Build Tool** | Vite 5 | ![Vite](https://img.shields.io/badge/-Vite%205-646CFF?style=for-the-badge&logo=vite&logoColor=white) |
| **📊 Charts** | Plotly.js | ![Plotly](https://img.shields.io/badge/-Plotly.js-3F51B5?style=for-the-badge) |
| **🎨 Styling** | Tailwind CSS | ![Tailwind](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **📝 Language** | JavaScript | ![JavaScript](https://img.shields.io/badge/-JavaScript%20ES2020+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |

### 🔧 Backend Stack (Optional)
| Component | Technology | Badge |
|-----------|-----------|-------|
| **🚀 Framework** | FastAPI | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=for-the-badge&logo=fastapi) |
| **🔢 Computing** | NumPy + Numba | ![NumPy](https://img.shields.io/badge/-NumPy-013243?style=for-the-badge&logo=numpy) |
| **🐍 Python** | 3.8+ | ![Python](https://img.shields.io/badge/-Python%203.8+-3776AB?style=for-the-badge&logo=python&logoColor=white) |

### ☁️ Deployment Services
| Service | Purpose | Badge |
|---------|---------|-------|
| **📍 Hosting** | GitHub Pages | ![GitHub Pages](https://img.shields.io/badge/-GitHub%20Pages-222222?style=for-the-badge&logo=github) |
| **🔄 CI/CD** | GitHub Actions | ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions) |

</div>

---

## 📈 Algorithm Specifications

### 🎲 1. Random Walk Simulation

```
┌─────────────────────────────────────┐
│  Random Walk on Graph G(V, E, β)    │
├─────────────────────────────────────┤
│ 🔹 Start: Random vertex v ∈ V      │
│ 🔹 Step: Move to neighbor w ∈ N(v) │
│ 🔹 Repeat: Until condition met     │
│ 🔹 Track: All transitions          │
└─────────────────────────────────────┘
```

**Parameters:**
- 📊 Graph type: Cycle ($C_n$), Random, or Grid
- 🎯 Drift β ∈ [0, 1] (cycle only)
- ⏱️ Number of steps: configurable

**Transition probability (cycle):**
$$P(i \to i+1) = \beta, \quad P(i \to i-1) = 1-\beta$$

**Complexity:** $O(n \times \text{steps})$ per simulation

---

### 🎲 2. Monte Carlo Coverage Analysis

```
┌──────────────────────────────────────┐
│   Monte Carlo Cycle Simulation       │
├──────────────────────────────────────┤
│ 🔄 50,000 Independent Trials         │
│ 📍 Track Node Visitation Frequency   │
│ ⏰ Measure Cover Time (all visited)  │
│ 📊 Compute Occupancy Distribution    │
└──────────────────────────────────────┘
```

**Algorithm:** Run 50,000 independent simulations, track:
- Node visitation frequency
- Cover time distribution (steps to visit all nodes)
- Occupancy ratio per node

**Output visualization:**
- 🔴 Polar heatmap (node occupancy)
- 📈 Histogram (cover time distribution)
- 📋 Theoretical overlay (expected values)

**Time complexity:** $O(50000 \times n \times \text{steps})$ ≈ **5-10s** on browser

---

### 🎯 3. First Passage Time Estimation

```
┌──────────────────────────────────────┐
│   Hitting Time Matrix Computation    │
├──────────────────────────────────────┤
│ 🔹 For each (i, j) pair:             │
│   └─ Monte Carlo trials: i → j       │
│ 📊 Average all passage times         │
│ 📈 Build n × n matrix                │
└──────────────────────────────────────┘
```

**Method:** Monte Carlo integration over initial/target pairs

For each (source $i$, target $j$) pair:
$$E[T_{i \to j}] = \frac{1}{M} \sum_{k=1}^{M} t_k^{(ij)}$$

where $t_k^{(ij)}$ = steps to reach $j$ starting from $i$ in trial $k$

**Matrix output:** $n \times n$ hitting times, visualization as heatmap

---

### 🌀 4. Mixing Time & Spectral Analysis

```
┌──────────────────────────────────────┐
│   Spectral Gap Analysis              │
├──────────────────────────────────────┤
│ 🔢 Compute eigenvalues λ₁, λ₂, ...   │
│ 📐 Spectral gap: γ = 1 - λ₂         │
│ ⏱️  Mixing time: τ ≈ log(1/ε) / γ    │
│ 📊 Compare across graph types        │
└──────────────────────────────────────┘
```

**Spectral gap computation:**
$$\gamma = 1 - \lambda_2$$

where $\lambda_2$ = second-largest eigenvalue of transition matrix

**Mixing time estimate:**
$$\tau_{mix}(\epsilon) \approx \frac{\log(1/\epsilon)}{\gamma}$$

**Comparison:** Compute for cycle, random, and grid graphs

---

## 📊 Performance Metrics

```mermaid
graph LR
    A["⚡ 50k<br/>Simulations<br/>Cycle<br/>Analysis"] -->|⏱️<br/>5-10s| B["✅<br/>Cycle<br/>Analysis<br/>Complete"]
    C["🔢 10×10<br/>Matrix<br/>500<br/>trials"] -->|⏱️<br/>3-5s| D["✅<br/>Hitting<br/>Times<br/>Ready"]
    E["🎬 Animated<br/>Walk<br/>200<br/>frames"] -->|⚡<br/>Real-time| F["✨<br/>Smooth<br/>@60fps"]
    G["🧪 3 Graph<br/>Types<br/>3 trials<br/>each"] -->|⏱️<br/>2-4s| H["📈<br/>Comparison<br/>Complete"]
    
    style A fill:#1976d2,stroke:#0d47a1,color:#fff,stroke-width:3px
    style B fill:#43a047,stroke:#1b5e20,color:#fff,stroke-width:3px
    style C fill:#d32f2f,stroke:#b71c1c,color:#fff,stroke-width:3px
    style D fill:#43a047,stroke:#1b5e20,color:#fff,stroke-width:3px
    style E fill:#f57c00,stroke:#e65100,color:#fff,stroke-width:3px
    style F fill:#43a047,stroke:#1b5e20,color:#fff,stroke-width:3px
    style G fill:#7b1fa2,stroke:#4a148c,color:#fff,stroke-width:3px
    style H fill:#43a047,stroke:#1b5e20,color:#fff,stroke-width:3px
```

---

## 🧪 Algorithm Porting: Python → JavaScript

```
┌────────────────────────────────────────────────────┐
│   Algorithm Porting Comparison                     │
├─────────────────────────────┬──────────────────────┤
│ Python (NumPy/Numba)        │ JavaScript (Native)  │
├─────────────────────────────┼──────────────────────┤
│ ⚡ Numba JIT compilation    │ ⚙️ Optimized loops   │
│ 🔢 Vectorized NumPy arrays  │ 📊 Loop-based        │
│ 🚀 C-level performance      │ ✨ Readable & debug  │
│ 🧬 Complex scipy calls      │ 📦 No dependencies   │
│ ⏱️  ~1-2x faster locally    │ ✅ Direct browser    │
└─────────────────────────────┴──────────────────────┘
```

| Algorithm | Python (NumPy/Numba) | JavaScript (Native) | Porting Notes |
|-----------|:--------------------:|:-------------------:|:---------------|
| **simulateWalkGeneral()** | Numba JIT compiled 🚀 | Optimized loops ⚙️ | ~2x slower on browser |
| **runSimulationsFast()** | Vectorized NumPy 📊 | Loop-based ⚡ | Trades vectorization for simplicity |
| **buildCycleTransition()** | Scipy sparse matrix 🧬 | Dense 2D array 📦 | Small matrices (n ≤ 50) OK |
| **estimateHittingTimes()** | NumPy matrix ops 🔢 | Inline computation ✨ | On-demand calculation |
| **mixingTime()** | Power iteration 🔄 | Power iteration 🔄 | Identical algorithm |

**Trade-off Analysis:**
- 📉 Browser lacks NumPy/SciPy optimizations
- ✅ Algorithms simplified for readability vs performance
- 🎯 Acceptable: 5-10s for 50k simulations (still interactive)

---

## 🔬 Stochastic Theory

### 📊 Markov Chain Foundations

```
┌──────────────────────────────────┐
│   Irreducible Aperiodic Chain    │
├──────────────────────────────────┤
│ State space: S = {0,1,...,n-1}  │
│ All states ∈ S are reachable     │
│ No periodicity (random walk)     │
│ Unique stationary π exists       │
└──────────────────────────────────┘
```

**State space:** $S = \{0, 1, \ldots, n-1\}$ (cycle graph nodes)

**Transition matrix $P$:**
- ✅ Irreducible (all states reachable)
- ✅ Aperiodic (random walk property)
- ✅ Doubly stochastic on cycles

**Stationary distribution:** $\pi = \frac{1}{n}$ (uniform) for cycle

---

### 🎯 Key Quantities Computed

```
┌───────────────────────────────────────┐
│ Fundamental Stochastic Quantities     │
├───────────────────────────────────────┤
│ 1️⃣  Cover Time:    E[C]              │
│ 2️⃣  Hitting Time:  E[T_i→j]          │
│ 3️⃣  Mixing Time:   τ_mix(ε)         │
│ 4️⃣  Spectral Gap:  γ = 1 - λ₂       │
└───────────────────────────────────────┘
```

**1. Cover Time:** Expected time to visit all states
$$E[C] = \sum_{i=1}^{n} E[T_{0 \to U \setminus \{0,...,i-1\}}]$$
Expected number of steps to visit every node starting from node 0

**2. Hitting Time:** Expected first passage
$$E[T_{i \to j}] = \text{Expected steps from state } i \text{ to reach state } j$$
Key metric for convergence analysis

**3. Mixing Time:** Convergence to stationary distribution
$$\tau_{mix}(\epsilon) = \min\{t : d(P^t, \pi) < \epsilon\}$$

where $d$ = total variation distance between $P^t$ and $\pi$

**4. Spectral Gap:** Determines convergence rate
$$\gamma = 1 - \lambda_2 \quad \Rightarrow \quad \tau \sim \frac{\log(1/\epsilon)}{\gamma}$$

---

## 📱 Responsive Design Architecture

```mermaid
graph TB
    subgraph Desktop["🖥️ <b>Desktop</b><br/>(1024px+)"]
        D1["📊<br/><b>Mode Selector</b><br/>4-column grid"]
        D2["📈<br/><b>Visualization</b><br/>Full width"]
        D3["⚙️<br/><b>Controls</b><br/>Side</b>"]
    end
    
    subgraph Tablet["📱 <b>Tablet</b><br/>(768-1023px)"]
        T1["📊<br/><b>Mode Selector</b><br/>2-column grid"]
        T2["📈<br/><b>Visualization</b><br/>Stacked"]
        T3["⚙️<br/><b>Controls</b><br/>Below"]
    end
    
    subgraph Mobile["📱 <b>Mobile</b><br/>(<768px)"]
        M1["📊<br/><b>Mode Selector</b><br/>Single column"]
        M2["📈<br/><b>Visualization</b><br/>Full width"]
        M3["⚙️<br/><b>Controls</b><br/>Dropdown"]
    end
    
    style Desktop fill:#1e88e5,stroke:#0d47a1,color:#fff,stroke-width:3px
    style Tablet fill:#f57c00,stroke:#e65100,color:#fff,stroke-width:3px
    style Mobile fill:#d32f2f,stroke:#b71c1c,color:#fff,stroke-width:3px
    style D1 fill:#42a5f5,stroke:#1e88e5,color:#000,stroke-width:2px
    style D2 fill:#64b5f6,stroke:#42a5f5,color:#000,stroke-width:2px
    style D3 fill:#90caf9,stroke:#64b5f6,color:#000,stroke-width:2px
    style T1 fill:#ffb74d,stroke:#f57c00,color:#000,stroke-width:2px
    style T2 fill:#ffc97a,stroke:#ffb74d,color:#000,stroke-width:2px
    style T3 fill:#ffe0b2,stroke:#ffc97a,color:#000,stroke-width:2px
    style M1 fill:#ef5350,stroke:#d32f2f,color:#fff,stroke-width:2px
    style M2 fill:#e57373,stroke:#ef5350,color:#000,stroke-width:2px
    style M3 fill:#ef9a9a,stroke:#e57373,color:#000,stroke-width:2px
```

---

## 🎨 Data Visualization Strategy

### 📊 Cycle Analysis Dashboard

```
┌─────────────────────────────────────────────┐
│        Cycle Analysis Visualizations        │
├─────────────────────────────────────────────┤
│  🔴 Polar Occupancy Heatmap                │
│     └─ Angle: Node index                   │
│     └─ Color: Visitation frequency         │
│     └─ Radius: Standard deviation          │
│                                             │
│  📈 Cover Time Histogram (Log scale)       │
│     └─ X: Steps to visit all nodes         │
│     └─ Y: Frequency (log)                  │
│     └─ Red line: Theory E[C]               │
│                                             │
│  📊 Node Probability Distribution           │
│     └─ X: Nodes [0, n-1]                   │
│     └─ Y: P(last node visited)             │
│     └─ Blue: Observed, Red: Expected       │
└─────────────────────────────────────────────┘
```

**Visualizations:**
1. **🔴 Polar Occupancy Heatmap** (Plotly polar chart)
   - Angle = node index
   - Color intensity = visitation frequency
   - Radius (optional) = standard deviation

2. **📈 Cover Time Distribution** (Histogram with overlay)
   - X-axis: steps to visit all nodes (log scale)
   - Y-axis: frequency
   - 🔴 Red overlay: theoretical expectation $E[C] = \frac{n(n-1)}{2}$

3. **📊 Node Probability Distribution** (Bar chart)
   - X-axis: nodes 0 to n-1
   - Y-axis: P(last node visited)
   - 🔵 Blue bars: observed frequency
   - 🟠 Overlay: theoretical uniform P = 1/n

---

### 🧠 Hitting Time Visualization

```
┌─────────────────────────────┐
│   Hitting Time Heatmap      │
├─────────────────────────────┤
│   From\To │ 0  1  2  3...  │
│  ──────────────────────────│
│    0      │ 🟧 🟨 🟩 🟦... │
│    1      │ 🟨 🟧 🟩 🟦... │
│    2      │ 🟩 🟩 🟧 🟨... │
│    3      │ 🟦 🟦 🟨 🟧... │
│   ...     │ ...           │
│                             │
│ 🟥=High (dark)              │
│ 🟦=Low (light)              │
└─────────────────────────────┘
```

**Matrix heatmap (n × n):**
- 📍 Rows = start nodes
- 🎯 Columns = target nodes  
- 🌈 Color = expected time (log scale)
- ✨ Interactive: hover for exact values

---

### 📈 Graph Comparison Chart

```
Performance Comparison: Mixing Times
─────────────────────────────────────────────
│
│ 🟥 Random Graph       ███████████████ 
│    Slowest mixing     (random connectivity)
│
│ 🟨 Grid Graph         ████████
│    Medium mixing      (2D lattice)
│
│ 🟩 Cycle Graph        ███
│    Fastest mixing     (regular structure) 
│
└─────────────────────────────────────────────
  Mixing Time (lower = faster)
     n: 5   10   15   20   25
```

**Features:**
- ⏱️ X-axis: Number of nodes (n)
- 🕐 Y-axis: Mixing time τ
- 🟥 Red: Random graph (highest)
- 🟨 Yellow: Grid graph (medium)
- 🟩 Green: Cycle graph (lowest)

---

## 🔗 Browser Compatibility

```
╔════════════════════════════════════════════════════╗
║         Browser Compatibility Matrix              ║
╠════════════════════════════════════════════════════╣
║ Feature           │ Chrome │ Firefox │ Safari │Edge║
║───────────────────┼────────┼─────────┼────────┼────║
║ ES2020            │   ✅   │   ✅    │   ✅   │ ✅ ║
║ React 18          │   ✅   │   ✅    │   ✅   │ ✅ ║
║ Plotly.js         │   ✅   │   ✅    │   ✅   │ ✅ ║
║ WebGL (optional)  │   ✅   │   ✅    │   ⚠️    │ ✅ ║
║ Web Workers       │   ✅   │   ✅    │   ✅   │ ✅ ║
║ Local Storage     │   ✅   │   ✅    │   ✅   │ ✅ ║
╠════════════════════════════════════════════════════╣
║ ❌ IE 11 not supported (uses ES6+ syntax)          ║
╚════════════════════════════════════════════════════╝
```

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| **⚡ ES2020** | ✅ | ✅ | ✅ | ✅ |
| **⚛️ React 18** | ✅ | ✅ | ✅ | ✅ |
| **📊 Plotly.js** | ✅ | ✅ | ✅ | ✅ |
| **🎮 WebGL (optional)** | ✅ | ✅ | ⚠️ Limited | ✅ |
| **🔄 Web Workers** | ✅ | ✅ | ✅ | ✅ |
| **💾 Local Storage** | ✅ | ✅ | ✅ | ✅ |

> **ℹ️ Note:** IE 11 not supported (requires ES6+ modern JavaScript)

---

## 📖 Mathematical References

- **Lawler, G. F.** (2010). *Random Walks: A Modern Introduction*. Cambridge University Press.
- **Aldous, D. & Fill, J.** *Reversible Markov Chains and Random Walks on Graphs*. [Online]
- **Chung, F.** (1997). *Spectral Graph Theory*. CBMS Regional Conference Series.
- **Levin, D. A., Peres, Y., & Wilmer, E. L.** (2008). *Markov Chains and Mixing Times*. AMS.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

**Made with ❤️ for exploring stochastic processes** 🐝
