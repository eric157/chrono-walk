import numpy as np
from numba import njit
import numpy.linalg as LA


# =========================
# FAST MONTE CARLO ENGINE
# =========================
@njit
def run_simulations_fast(n: int, beta: float, simulations: int):
    last_nodes = np.zeros(simulations, dtype=np.int32)
    steps_list = np.zeros(simulations, dtype=np.int32)
    occupancy = np.zeros(n, dtype=np.float64)

    for sim in range(simulations):
        visited_mask = 1
        current = 0
        steps = 0
        local_occ = np.zeros(n)

        while visited_mask != (1 << n) - 1:
            local_occ[current] += 1

            if np.random.rand() < beta:
                current = (current + 1) % n
            else:
                current = (current - 1 + n) % n

            visited_mask |= (1 << current)
            steps += 1

        last_nodes[sim] = current
        steps_list[sim] = steps
        occupancy += local_occ

    return last_nodes, steps_list, occupancy / simulations


# =========================
# TRANSITION MATRIX
# =========================
def build_cycle_transition(n, beta):
    P = np.zeros((n, n))
    for i in range(n):
        P[i, (i + 1) % n] = beta
        P[i, (i - 1) % n] = 1 - beta
    return P


# =========================
# FIRST PASSAGE TIME
# =========================
def estimate_hitting_times(n, beta, simulations=5000):
    H = np.zeros((n, n))

    for i in range(n):
        for j in range(n):
            if i == j:
                continue

            times = []

            for _ in range(simulations):
                current = i
                steps = 0

                while current != j:
                    if np.random.rand() < beta:
                        current = (current + 1) % n
                    else:
                        current = (current - 1 + n) % n
                    steps += 1

                times.append(steps)

            H[i, j] = np.mean(times)

    return H


# =========================
# MIXING TIME
# =========================
def mixing_time(P):
    """
    Compute mixing time estimate based on spectral gap.
    """
    try:
        eigvals = np.linalg.eigvals(P)
        eigvals = np.abs(eigvals)
        eigvals = np.sort(eigvals)[::-1]
        
        lambda_2 = eigvals[1] if len(eigvals) > 1 else 0
        lambda_2 = min(lambda_2, 0.9999)
        lambda_2 = max(lambda_2, 0)
        
        gap = 1 - lambda_2
        
        if gap < 1e-6:
            return 10000.0
        
        mix_time_val = 1.0 / gap
        return min(mix_time_val, 10000.0)
    except:
        return 1000.0


# =========================
# RANDOM GRAPH GENERATOR
# =========================
def build_random_graph(n, p=0.3):
    adj = (np.random.rand(n, n) < p).astype(int)
    np.fill_diagonal(adj, 0)
    
    # Ensure each node has at least one outgoing edge
    for i in range(n):
        if adj[i].sum() == 0:
            j = np.random.randint(0, n)
            while j == i:
                j = np.random.randint(0, n)
            adj[i, j] = 1
    
    P = adj.astype(float) / adj.sum(axis=1, keepdims=True)
    P[np.isnan(P)] = 1.0 / n
    
    return P


# =========================
# GRID GRAPH (2D)
# =========================
def build_grid_graph(k):
    n = k * k
    P = np.zeros((n, n))

    def idx(x, y):
        return x * k + y

    for x in range(k):
        for y in range(k):
            neighbors = []
            if x > 0: neighbors.append(idx(x-1, y))
            if x < k-1: neighbors.append(idx(x+1, y))
            if y > 0: neighbors.append(idx(x, y-1))
            if y < k-1: neighbors.append(idx(x, y+1))

            i = idx(x, y)
            for nb in neighbors:
                P[i, nb] = 1 / len(neighbors)

    return P


# =========================
# GENERIC WALK SIMULATION
# =========================
@njit
def simulate_walk_general(P, steps=1000):
    n = P.shape[0]
    current = 0
    path = np.zeros(steps, dtype=np.int32)

    for i in range(steps):
        probs = P[current]
        r = np.random.rand()
        cumulative = 0.0

        for j in range(n):
            cumulative += probs[j]
            if r <= cumulative:
                current = j
                break

        path[i] = current

    return path
