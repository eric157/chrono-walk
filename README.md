# 🐝 Chrono-Walk: Stochastic Simulator

A full-stack application for exploring random walks, hitting times, and graph mixing dynamics. All algorithms run in your browser - no server required!

## ✨ Features

- **🖥️ Browser-Based** - All algorithms run locally (instant performance)
- **📊 Interactive Charts** - Real-time Plotly visualizations
- **🎯 4 Analysis Modes**:
  - Cycle Analysis (node occupancy, step distribution)
  - Animated Walk (real-time visualization)
  - Hitting Time Matrix (first passage times)
  - Graph Comparison (mixing time analysis)
- **📱 Mobile Responsive** - Works on all devices
- **🚀 Easy Deploy** - GitHub Pages + GitHub Actions
- **📚 Full Documentation** - See `docs/` folder

## 🚀 Quick Start

### Install & Run
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/chrono-walk/](http://localhost:5173/chrono-walk/)

### Deploy
```bash
npm run deploy
```
Live at: `https://YOUR_USERNAME.github.io/chrono-walk/`

## 📚 Documentation

- **[Quick Start](docs/QUICKSTART.md)** - Get running in 5 minutes
- **[Deployment](docs/DEPLOY.md)** - Deploy to GitHub Pages
- **[Architecture](docs/ARCHITECTURE.md)** - Tech stack & structure

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---|
| **Frontend** | React 18, Vite, Plotly.js, Tailwind CSS |
| **Backend** | FastAPI, NumPy, Numba (optional) |
| **Deployment** | GitHub Pages, GitHub Actions |
| **Original** | Python, Streamlit |

## 📊 What You Can Do

### Mode 1: Cycle Analysis
Run 50,000 simulations to see which nodes the walker favors and how many steps it takes to visit all nodes.

### Mode 2: Animated Walk
Watch an interactive bee walk around a circular hive in real-time. Adjust drift to change direction bias.

### Mode 3: Hitting Time
Heatmap showing expected steps to reach any target node from any starting node.

### Mode 4: Graph Comparison
Compare mixing times across cycle, random, and grid graph types.

## 🔄 Both Versions Available

**React/Vite (Recommended)**
- Browser-based
- No server needed
- Instant performance
- Deploy to GitHub Pages

**Streamlit (Legacy)**
- Traditional web app
- Python-only
- Server required
- In `app.py`

## 📖 Algorithm Details

All core stochastic process algorithms:
- Monte Carlo cycle simulations
- Random walk path generation
- First passage time estimation
- Spectral gap analysis

**Ported to JavaScript** - runs entirely in your browser!

## 📦 Installation

```bash
# Frontend
cd frontend
npm install

# Backend (optional)
cd backend
pip install -r requirements.txt
```

## 🎓 Learn More

- [Random Walks](https://en.wikipedia.org/wiki/Random_walk_on_graphs)
- [Mixing Time](https://en.wikipedia.org/wiki/Markov_chain_mixing_time)
- [Spectral Graph Theory](https://en.wikipedia.org/wiki/Spectral_graph_theory)

## 📝 License

MIT - See LICENSE file

## 🤝 Contributing

Improvements welcome! Open an issue or submit a PR.

---

**Made with ❤️ for exploring stochastic processes** 🐝

Questions? Check the [docs/](docs/) folder!

## ✨ Features

- **🖥️ Browser-Based Computations** - All algorithms run in your browser (no server latency!)
- **📊 Interactive Visualizations** - Real-time Plotly charts with responsive design
- **🎥 Animated Walks** - Watch random walkers explore graphs in real-time
- **📈 Multiple Analysis Modes**:
  - Cycle Analysis (occupancy distribution)
  - Animated Walk (real-time visualization)
  - Hitting Time Matrix (first passage times)
  - Graph Comparison (mixing time analysis)
- **⚡ Fast Performance** - 50k simulations in ~5-10 seconds
- **📱 Mobile Friendly** - Responsive design works on all devices
- **🚀 Easy Deployment** - GitHub Pages ready with GitHub Actions

## 🏗️ Architecture

```
chrono-walk/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/      # Visualization components
│   │   ├── utils/           # JavaScript algorithms
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
├── backend/                 # FastAPI (Optional)
│   ├── main.py
│   ├── chrono_walk.py
│   └── requirements.txt
├── app.py                   # Original Streamlit app
└── DEPLOYMENT_GUIDE.md      # Full deployment instructions
```

---

## 🌐 Dashboard Features

- 🔥 Polar Occupancy Heatmap
- 📊 Cover Time Distribution (with theoretical overlay)
- 🎯 Last Node Probability Distribution
- 🧠 Theoretical Analysis Panel

---

## 📦 Installation

## 🚀 Quick Start

### Frontend (Browser-Only - Recommended for MVP)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Backend (Optional - for API clients)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

API available at [http://localhost:8000](http://localhost:8000)

### Original Streamlit App (Still Available!)

```bash
pip install -r requirements.txt
streamlit run app.py
```

## 📦 Deployment to GitHub Pages

### Automatic (via GitHub Actions)

1. Push to `main` branch:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

2. GitHub Actions automatically:
   - Builds the React app
   - Deploys to `gh-pages` branch
   - Site live at: `https://eric157.github.io/chrono-walk/`

### Manual

```bash
cd frontend
npm install
npm run build
npm run deploy
```


## 💻 Technology Stack

### Frontend
- **React 18** - Component-based UI
- **Vite** - Lightning-fast build tool
- **Plotly.js** - Interactive visualizations
- **Tailwind CSS** - Utility-first styling
- **JavaScript** - Algorithm implementations

### Backend (Optional)
- **FastAPI** - Modern Python web framework
- **NumPy** - Numerical computations
- **Numba** - JIT compilation for speed

### Deployment
- **GitHub Pages** - Free static hosting
- **GitHub Actions** - CI/CD automation
- **Railway/Render** - Backend deployment (optional)

## 🎯 Modes Explained

### 1. Cycle Analysis 🎯
Simulates 50,000 random walks on a cycle graph and shows:
- Node occupancy distribution (which nodes does the walker favor?)
- Step distribution (how many steps to visit all nodes?)

**Parameters:**
- `n`: Number of nodes (5-30)
- `β` (beta): Drift parameter (0=counterclockwise, 1=clockwise)

### 2. Animated Walk 🎥
Real-time visualization of a random walker moving through a cycle graph.

**Interactive Controls:**
- Play/Pause animation
- Reset to start
- Adjust parameters live
- Watch directional bias in action

### 3. Hitting Time 🧠
Heatmap showing expected steps to reach any target node from any starting node.

Uses 500 simulations per node pair by default (adjustable).

### 4. Graph Comparison 🧪
Compares mixing times across three graph types:
- **Cycle**: Regular structure
- **Random**: Chaotic connectivity
- **Grid**: 2D lattice structure

Shows which graph type mixes fastest!

## 📊 Algorithm Porting

All core algorithms have been ported from Python to JavaScript:

| Algorithm | Purpose | Optimization |
|-----------|---------|-----------|
| `runSimulationsFast` | Fast Monte Carlo simulation | Numba (Py), Optimized (JS) |
| `buildCycleTransition` | Create cycle matrix | Direct implementation |
| `buildRandomGraph` | Generate random graph | Connectivity checks |
| `buildGridGraph` | Create 2D grid graph | Direct implementation |
| `simulateWalkGeneral` | Single random walk | Optimized loop |
| `estimateHittingTimes` | First passage times | Memoization |
| `mixingTime` | Spectral gap analysis | Power iteration |

## ⚡ Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Cycle Analysis (50k sims) | 5-10s | Browser computation |
| Animated Walk | Real-time | 200 frames @ 50ms |
| Hitting Times (10×10) | 3-5s | Browser computation |
| Graph Comparison | 2-4s | 3 graphs × 3 trials |

## 📈 Stochastic Foundations

### Graph Model
Cycle Graph $C_n$ with $n$ nodes arranged in a circle.

### Transition Dynamics
- **Clockwise move** with probability $\beta$
- **Counter-clockwise** with probability $1 - \beta$

### Key Quantities

**Cover Time:**
$$E[C] = \frac{n(n - 1)}{2}$$

**Stationary Distribution:**
$$\pi(i) = \frac{1}{n}$$

**Mixing Time:**
Determined by spectral gap: $1 - \lambda_2$ where $\lambda_2$ is the second-largest eigenvalue.

## 🛠️ Development

### Add New Component

1. Create `frontend/src/components/NewFeature.jsx`
2. Use existing components as template
3. Import in `App.jsx`
4. Add mode button

### Customize Theme

Edit `frontend/src/index.css`:
```css
.metric-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add Backend Integration

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for API integration examples.

## 📚 Documentation

- [Frontend README](frontend/README.md) - Frontend-specific setup
- [Backend README](backend/README.md) - Backend API documentation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [Original Streamlit App](app.py) - Reference implementation

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - Use freely for learning and development!

## 🎓 Learn More

### Stochastic Processes
- [Random Walks on Graphs](https://en.wikipedia.org/wiki/Random_walk_on_graphs)
- [Mixing Time](https://en.wikipedia.org/wiki/Markov_chain_mixing_time)
- [Spectral Graph Theory](https://en.wikipedia.org/wiki/Spectral_graph_theory)

### Technologies
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Plotly.js](https://plotly.com/javascript/)
- [Tailwind CSS](https://tailwindcss.com)
- [FastAPI](https://fastapi.tiangolo.com)

## 🐛 Troubleshooting

### Build fails with "Cannot find module"
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### GitHub Pages shows 404
- Check `vite.config.js` base URL matches repo name
- Verify GitHub Pages is enabled in Settings
- Check `gh-pages` branch exists

### API returns 500 error
- Check backend logs
- Verify dependencies installed
- Test endpoint with curl

## 🌟 Roadmap

- [ ] 3D graph visualizations
- [ ] More graph types (star, wheel, complete)
- [ ] Export results as CSV/JSON
- [ ] Dark mode theme
- [ ] Advanced statistics panel
- [ ] Custom algorithm upload
- [ ] Multi-user collaboration

---

**Made with ❤️ for exploring stochastic processes** 🐝

Have questions? Open an issue or start a discussion!
