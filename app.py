import streamlit as st
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import time

from chrono_walk import (
    run_simulations_fast,
    estimate_hitting_times,
    build_cycle_transition,
    build_random_graph,
    build_grid_graph,
    simulate_walk_general,
    mixing_time
)

st.set_page_config(layout="wide")

# Custom styling
st.markdown("""
    <style>
        .main-title { font-size: 3em; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; }
        .section-header { font-size: 1.8em; color: #667eea; font-weight: bold; margin-top: 20px; }
        .info-box { background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; border-radius: 5px; margin: 10px 0; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; 
                       border-radius: 10px; text-align: center; font-weight: bold; }
        .subtitle { font-size: 1.3em; color: #764ba2; font-weight: 600; }
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">🐝 Chrono-Walk: Advanced Stochastic Simulator</div>', unsafe_allow_html=True)
st.markdown('<p style="text-align: center; color: #666; font-size: 1.1em;">Explore random walks, hitting times, and graph mixing dynamics</p>', unsafe_allow_html=True)

# Sidebar
mode = st.sidebar.selectbox(
    "📊 Select Mode",
    ["Cycle Analysis", "Animated Walk", "First Passage Time", "Graph Comparison"]
)

# =========================
# 1. CYCLE ANALYSIS
# =========================
if mode == "Cycle Analysis":
    st.markdown('<div class="section-header">🎯 Cycle Analysis</div>', unsafe_allow_html=True)
    st.markdown('<div class="info-box"><strong>What\'s happening?</strong> We run 50,000 simulations of a random walk on a cycle graph with drift. The left graph shows which nodes the walker favors, and the right shows how many steps it takes to visit all nodes.</div>', unsafe_allow_html=True)
    
    col_params = st.columns(2)
    with col_params[0]:
        n = st.slider("Number of Nodes", 5, 30, 12)
    with col_params[1]:
        beta = st.slider("Drift β (0=counterclockwise, 1=clockwise)", 0.0, 1.0, 0.5)

    last_nodes, steps, occupancy = run_simulations_fast(n, beta, 50000)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown('<p class="subtitle">Node Occupancy Distribution</p>', unsafe_allow_html=True)
        theta = np.linspace(0, 360, n)
        fig = go.Figure(go.Barpolar(
            r=occupancy,
            theta=theta,
            marker_color=occupancy,
            marker_colorscale='Plasma',
            marker_showscale=True,
            marker_colorbar=dict(title="Occupancy")
        ))
        fig.update_layout(
            title="Which nodes does the walker favor?",
            font=dict(size=12),
            height=500
        )
        st.plotly_chart(fig, width='stretch', key="cycle_polar")

    with col2:
        st.markdown('<p class="subtitle">Steps to Cover All Nodes</p>', unsafe_allow_html=True)
        fig2 = px.histogram(steps, nbins=50, 
                           title="How many steps to visit every node?",
                           labels={'value': 'Steps', 'count': 'Frequency'},
                           color_discrete_sequence=['#667eea'])
        fig2.update_layout(
            font=dict(size=12),
            height=500,
            showlegend=False,
            hovermode='x unified'
        )
        st.plotly_chart(fig2, width='stretch', key="cycle_hist")

# =========================
# 2. ANIMATED WALK
# =========================
elif mode == "Animated Walk":
    st.markdown('<div class="section-header">🎥 Real-Time Bee Movement</div>', unsafe_allow_html=True)
    st.markdown('<div class="info-box"><strong>What\'s happening?</strong> Watch a bee (red dot) randomly walk around a circular hive. Notice how drift makes it favor one direction!</div>', unsafe_allow_html=True)

    col_params = st.columns(2)
    with col_params[0]:
        n = st.slider("Number of Nodes", 5, 20, 12)
    with col_params[1]:
        beta = st.slider("Drift β", 0.0, 1.0, 0.5)

    P = build_cycle_transition(n, beta)
    steps = 200
    path = simulate_walk_general(P, steps)

    placeholder = st.empty()

    theta = np.linspace(0, 2*np.pi, n, endpoint=False)
    
    progress_bar = st.progress(0)
    frame_number = st.empty()

    for t in range(steps):
        fig = go.Figure()

        # Hive nodes
        fig.add_trace(go.Scatterpolar(
            r=[1]*n,
            theta=np.degrees(theta),
            mode='markers',
            marker=dict(size=12, color='#764ba2', opacity=0.7),
            name='Hive Nodes'
        ))

        # Current position
        fig.add_trace(go.Scatterpolar(
            r=[1],
            theta=[np.degrees(theta[path[t]])],
            mode='markers',
            marker=dict(size=20, color='#ff6b6b', symbol='star'),
            name='Bee'
        ))

        fig.update_layout(
            showlegend=True,
            height=500,
            title=f"Step {t+1}/{steps}",
            font=dict(size=12)
        )
        # Use unique key to avoid duplicate element ID error
        placeholder.plotly_chart(fig, width='stretch', key=f"animated_walk_{t}")
        progress_bar.progress((t + 1) / steps)
        frame_number.text(f"Current Node: {path[t]} | Direction: {'Clockwise ➡️' if beta > 0.5 else '⬅️ Counterclockwise' if beta < 0.5 else '🔀 Random'}")
        time.sleep(0.05)

# =========================
# 3. FIRST PASSAGE TIME
# =========================
elif mode == "First Passage Time":
    st.markdown('<div class="section-header">🧠 Hitting Time Matrix</div>', unsafe_allow_html=True)
    st.markdown('<div class="info-box"><strong>What\'s happening?</strong> This heatmap shows the average number of steps needed to reach node j starting from node i. Darker colors = faster arrival times.</div>', unsafe_allow_html=True)

    col_params = st.columns(2)
    with col_params[0]:
        n = st.slider("Number of Nodes", 5, 15, 10)
    with col_params[1]:
        beta = st.slider("Drift β (0=random, 1=biased)", 0.0, 1.0, 0.5)

    H = estimate_hitting_times(n, beta, simulations=1000)

    fig = px.imshow(H, color_continuous_scale='YlOrRd',
                    title="Average Steps to Reach Target Node (Hitting Time)",
                    labels=dict(x="Target Node", y="Starting Node"),
                    height=600)
    fig.update_layout(font=dict(size=12))
    st.plotly_chart(fig, width='stretch', key="hitting_time")

# =========================
# 4. GRAPH COMPARISON
# =========================
elif mode == "Graph Comparison":
    st.markdown('<div class="section-header">🧪 Graph Type Comparison</div>', unsafe_allow_html=True)
    st.markdown('<div class="info-box"><strong>What\'s happening?</strong> We compare how quickly random walks mix on three different graph types. <strong>Mixing time</strong> measures how fast the walker forgets its starting position. Lower = faster mixing.</div>', unsafe_allow_html=True)

    col_params = st.columns(2)
    with col_params[0]:
        n = st.slider("Graph Size", 5, 20, 10)
    with col_params[1]:
        num_trials = st.number_input("Number of Trials (for averaging)", 1, 10, 3)

    # Calculate mixing times across multiple trials
    mix_times_cycle = []
    mix_times_random = []
    mix_times_grid = []
    
    status = st.info("Computing mixing times... this may take a moment")
    
    for trial in range(num_trials):
        P_cycle = build_cycle_transition(n, 0.5)
        P_random = build_random_graph(n, p=0.4)
        P_grid = build_grid_graph(int(np.sqrt(n)))

        mix_times_cycle.append(mixing_time(P_cycle))
        mix_times_random.append(mixing_time(P_random))
        mix_times_grid.append(mixing_time(P_grid))
    
    status.empty()

    avg_cycle = np.mean(mix_times_cycle)
    avg_random = np.mean(mix_times_random)
    avg_grid = np.mean(mix_times_grid)

    fig = px.bar(
        x=["🔵 Cycle", "🎲 Random", "⊞ Grid"],
        y=[avg_cycle, avg_random, avg_grid],
        title="Graph Mixing Time Comparison (Lower = Faster Mixing)",
        labels={"x": "Graph Type", "y": "Mixing Time"},
        color=["#667eea", "#764ba2", "#ee5a6f"],
        color_discrete_sequence=["#667eea", "#764ba2", "#ee5a6f"]
    )
    fig.update_layout(
        font=dict(size=12),
        height=500,
        showlegend=False,
        hovermode='x unified'
    )
    st.plotly_chart(fig, width='stretch', key="mixing_comparison")
    
    # Display detailed stats
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f'<div class="metric-card">🔵 Cycle<br>{avg_cycle:.2f}</div>', unsafe_allow_html=True)
    with col2:
        st.markdown(f'<div class="metric-card">🎲 Random<br>{avg_random:.2f}</div>', unsafe_allow_html=True)
    with col3:
        st.markdown(f'<div class="metric-card">⊞ Grid<br>{avg_grid:.2f}</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("**📊 Interpretation:**")
    fastest = min(avg_cycle, avg_random, avg_grid)
    if fastest == avg_cycle:
        st.success("✅ Cycle graphs mix **fastest**! Regular structure helps the walker explore efficiently.")
    elif fastest == avg_random:
        st.success("✅ Random graphs mix **fastest**! Chaos helps mixing - random edges connect distant parts.")
    else:
        st.success("✅ Grid graphs mix **fastest**! 2D structure provides good connectivity.")