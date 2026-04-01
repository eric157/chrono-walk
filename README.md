# 🐝 Chrono-Walk: Stochastic Simulator

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-blue?style=for-the-badge&logo=github-pages)](https://eric157.github.io/chrono-walk/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite 5](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Plotly.js](https://img.shields.io/badge/Plotly.js-3.4-3F51B5?style=flat-square)](https://plotly.com/javascript/)

**Advanced stochastic process simulator with real-time Monte Carlo visualizations**

[🚀 View Live Site](https://eric157.github.io/chrono-walk/) • [📐 Architecture](docs/ARCHITECTURE.md) • [⚙️ Execution Details](docs/DEPLOY.md)

</div>

---

## 📊 Operational Modes

| Mode | Algorithm | Output | Computation |
|------|-----------|--------|-------------|
| **🎯 Cycle Analysis** | Monte Carlo (50k trials) | Occupancy heatmap, cover time PDF | 5-10s browser |
| **🎥 Animated Walk** | Single walk simulation | Real-time path animation | 200 fps |
| **🧠 Hitting Time** | First passage estimation | Heatmap matrix | 3-5s |
| **🧪 Graph Comparison** | Spectral gap analysis | Time series comparison | 2-4s |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend: React + Vite"]
        App["App.jsx"]
        C1["CycleAnalysis"]
        C2["AnimatedWalk"]
        C3["HittingTime"]
        C4["GraphComparison"]
        Utils["algorithms.js"]
        Plotly["Plotly.js<br/>Visualizations"]
    end
    
    subgraph Algorithms["Algorithm Layer"]
        Sim["simulateWalkGeneral()"]
        Build["buildCycleTransition()"]
        Hit["estimateHittingTimes()"]
        Mix["mixingTime()"]
    end
    
    subgraph Compute["Computation"]
        MC["Monte Carlo<br/>Sampling"]
        Matrix["Transition<br/>Matrices"]
        Eigen["Spectral<br/>Analysis"]
    end
    
    subgraph Output["Static Deployment"]
        GH["GitHub Pages<br/>/chrono-walk/"]
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
    
    style Frontend fill:#e1f5ff
    style Algorithms fill:#f3e5f5
    style Compute fill:#fff3e0
    style Output fill:#e8f5e9
```

---

## 🛠️ Built With

<div align="center">

### Frontend Stack
| Component | Technology | Badge |
|-----------|-----------|-------|
| **UI Framework** | React 18 | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white) |
| **Build Tool** | Vite 5 | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Charts** | Plotly.js | ![Plotly](https://img.shields.io/badge/-Plotly.js-3F51B5?style=flat-square) |
| **Styling** | Tailwind CSS | ![Tailwind](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) |
| **Language** | JavaScript | ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) |

### Backend (Optional)
| Component | Technology | Badge |
|-----------|-----------|-------|
| **Framework** | FastAPI | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi) |
| **Computation** | NumPy + Numba | ![NumPy](https://img.shields.io/badge/-NumPy-013243?style=flat-square&logo=numpy) |
| **Python** | 3.8+ | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) |

### Deployment
| Service | Purpose | Badge |
|---------|---------|-------|
| **Hosting** | GitHub Pages | ![GitHub Pages](https://img.shields.io/badge/-GitHub%20Pages-222222?style=flat-square&logo=github) |
| **CI/CD** | GitHub Actions | ![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions) |

</div>

---

## 📈 Algorithm Specifications

### 1. Random Walk Simulation

**Parameters:**
- Graph type: Cycle ($C_n$), Random, or Grid
- Drift β ∈ [0, 1] (cycle only)
- Number of steps: configurable

**Transition probability (cycle):**
$$P(i \to i+1) = \beta, \quad P(i \to i-1) = 1-\beta$$

**Complexity:** $O(n \times \text{steps})$ per simulation

---

### 2. Monte Carlo Coverage Analysis

**Algorithm:** Run 50,000 independent simulations, track:
- Node visitation frequency
- Cover time distribution (steps to visit all nodes)
- Occupancy ratio per node

**Output visualization:**
- Polar heatmap (node occupancy)
- Histogram (cover time distribution)
- Theoretical overlay (expected values)

**Time complexity:** $O(50000 \times n \times \text{steps})$ ≈ 5-10s on browser

---

### 3. First Passage Time Estimation

**Method:** Monte Carlo integration over initial/target pairs

For each (source $i$, target $j$) pair:
$$E[T_{i \to j}] = \frac{1}{M} \sum_{k=1}^{M} t_k^{(ij)}$$

where $t_k^{(ij)}$ = steps to reach $j$ starting from $i$ in trial $k$

**Matrix output:** $n \times n$ hitting times, visualization as heatmap

---

### 4. Mixing Time & Spectral Analysis

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
    A["50k Simulations<br/>Cycle Analysis"] -->|5-10s| B["Cycle Analysis<br/>Complete"]
    C["10×10 Matrix<br/>500 trials"] -->|3-5s| D["Hitting Times<br/>Complete"]
    E["Animated Walk<br/>200 frames"] -->|Real-time| F["Smooth<br/>Animation @ 60fps"]
    G["3 Graph Types<br/>3 trials each"] -->|2-4s| H["Comparison<br/>Complete"]
    
    style A fill:#fff3e0
    style B fill:#e8f5e9
    style C fill:#fff3e0
    style D fill:#e8f5e9
    style E fill:#fff3e0
    style F fill:#e8f5e9
    style G fill:#fff3e0
    style H fill:#e8f5e9
```

---

## 🧪 Algorithm Porting: Python → JavaScript

| Algorithm | Python (NumPy/Numba) | JavaScript (Native) | Porting Notes |
|-----------|----------------------|-------------------|---------------|
| `simulateWalkGeneral()` | Numba JIT compiled | Optimized loops | ~2x slower on browser |
| `runSimulationsFast()` | Vectorized NumPy | Loop-based | Trades vectorization for simplicity |
| `buildCycleTransition()` | Scipy sparse matrix | Dense 2D array | Small matrices (n ≤ 50) |
| `estimateHittingTimes()` | NumPy matrix ops | Inline computation | On-demand calculation |
| `mixingTime()` | Power iteration | Power iteration | Identical algorithm |

**Trade-off:** Browser lacks NumPy/SciPy, so algorithms simplified for readability vs. performance.

---

## 🔬 Stochastic Theory

### Markov Chain Foundations

**State space:** $S = \{0, 1, \ldots, n-1\}$ (cycle graph nodes)

**Transition matrix $P$:**
- Irreducible (all states reachable)
- Aperiodic (random walk property)
- Doubly stochastic on cycles

**Stationary distribution:** $\pi = \frac{1}{n}$ (uniform) for cycle

---

### Key Quantities Computed

**1. Cover Time:** Expected time to visit all states
$$E[C] = \sum_{i=1}^{n} E[T_{0 \to U \setminus \{0,...,i-1\}}]$$

**2. Hitting Time:** Expected first passage
$$E[T_{i \to j}] = \text{years until leaving state } i \text{ and reaching } j$$

**3. Mixing Time:** Convergence to stationary distribution
$$\tau_{mix}(\epsilon) = \min\{t : d(P^t, \pi) < \epsilon\}$$

where $d$ = total variation distance

---

## 📱 Responsive Design Architecture

```mermaid
graph TB
    subgraph Desktop["Desktop (1024px+)"]
        D1["Mode Selector:<br/>4-column grid"]
        D2["Main Visualization:<br/>Full width"]
        D3["Controls:<br/>Side panel"]
    end
    
    subgraph Tablet["Tablet (768px-1023px)"]
        T1["Mode Selector:<br/>2-column grid"]
        T2["Main Visualization:<br/>Stacked"]
        T3["Controls:<br/>Below viz"]
    end
    
    subgraph Mobile["Mobile (<768px)"]
        M1["Mode Selector:<br/>Single column"]
        M2["Main Visualization:<br/>Full width"]
        M3["Controls:<br/>Dropdown"]
    end
    
    style Desktop fill:#c8e6c9
    style Tablet fill:#fff9c4
    style Mobile fill:#ffccbc
```

---

## 🎨 Data Visualization Strategy

### Cycle Analysis Dashboard

1. **Polar Occupancy Heatmap** (Plotly polar chart)
   - Angle = node index
   - Color = visitation frequency
   - Radius (optional) = standard deviation

2. **Cover Time Distribution** (Histogram with overlay)
   - X-axis: steps to visit all nodes
   - Y-axis: frequency (log scale)
   - Overlay: theoretical expectation $E[C] = \frac{n(n-1)}{2}$

3. **Node Probability Distribution** (Bar chart)
   - X-axis: nodes 0 to n-1
   - Y-axis: P(last node visited)
   - Theoretical: uniform P = 1/n

---

### Hitting Time Visualization

**Matrix heatmap (n × n):**
- Rows = start nodes
- Columns = target nodes
- Color = expected time (log scale)
- Interactive: hover for exact values

---

### Graph Comparison Chart

**Time series overlay:**
```
Mixing Time vs. n
┌─────────────────────────────────────┐
│ Cycle (lowest)  ─────████           │
│ Grid (medium)  ──────█████████      │
│ Random (highest)  ──████████████    │
└─────────────────────────────────────┘
     n: 5   10   15   20   25
```

---

## 🔗 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES2020 | ✅ | ✅ | ✅ | ✅ |
| React 18 | ✅ | ✅ | ✅ | ✅ |
| Plotly.js | ✅ | ✅ | ✅ | ✅ |
| WebGL (optional) | ✅ | ✅ | ⚠️ | ✅ |
| Web Workers | ✅ | ✅ | ✅ | ✅ |

**Note:** IE 11 not supported (uses ES6+ syntax)

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
