# Architecture

## Project Structure
```
chrono-walk/
├── frontend/              # React + Vite (Browser-based)
│   ├── src/
│   │   ├── components/    # 4 visualization components
│   │   ├── utils/         # JS algorithms
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # FastAPI (Optional)
│   ├── main.py           # API server
│   └── chrono_walk.py    # Algorithms
│
├── app.py                # Original Streamlit app
├── README.md
└── LICENSE
```

## Technology Stack

- **Frontend**: React 18, Vite, Plotly.js, Tailwind CSS
- **Backend**: FastAPI, NumPy, Numba
- **Deployment**: GitHub Pages, GitHub Actions
- **Original**: Python, Streamlit

## Algorithms Ported to JavaScript

All core algorithms run in the browser:
- Cycle graph simulations
- Random walk paths
- Hitting time matrices
- Mixing time analysis

No server needed for basic usage!
