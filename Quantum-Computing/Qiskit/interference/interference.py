import json
import numpy as np
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# === PARAMETERS ===
entanglement_method = "even"  # options: "nearest", "even", "skip", "random", "hybrid"
n_qubits = 12
timesteps = 40
theta = np.pi / 10
organic_mode = True

# Simulator
simulator = AerSimulator(method="matrix_product_state")

# Precompute indices for statevector
indices = np.arange(2 ** n_qubits)

# Initialize circuit
qc = QuantumCircuit(n_qubits)

# Initial superposition
for q in range(n_qubits):
    qc.h(q)

# Store probabilities, entanglement pairs, and phases
prob_matrix = np.zeros((timesteps, n_qubits))
phase_matrix = np.zeros((timesteps, n_qubits))
entanglement_pairs = [[] for _ in range(timesteps)]

# === TIME EVOLUTION ===
for t in range(timesteps):
    # Small rotations
    for q in range(n_qubits):
        theta_q = theta
        if organic_mode:
            theta_q += np.random.uniform(-0.05, 0.05)
        qc.ry(theta_q, q)

    if organic_mode:
        # Random entanglement for organic mode
        for q in range(0, n_qubits, 2):
            if np.random.rand() < 0.6:
                target = (q + 2) % n_qubits
                qc.cx(q, target)
                entanglement_pairs[t].append((q, target))
        for q in range(n_qubits):
            if np.random.rand() < 0.2:
                target = np.random.randint(0, n_qubits)
                if target != q:
                    qc.cx(q, target)
                    entanglement_pairs[t].append((q, target))
        global_phase = np.sin(2 * np.pi * t / timesteps) * np.pi / 8
        for q in range(n_qubits):
            qc.rz(global_phase / 10, q)

    else:
        # === ENTANGLEMENT MODES ===
        if entanglement_method == "nearest":
            for q in range(n_qubits - 1):
                qc.cx(q, q + 1)
                entanglement_pairs[t].append((q, q + 1))

        elif entanglement_method == "even":
            for q in range(0, n_qubits, 2):
                target = (q + 2) % n_qubits
                qc.cx(q, target)
                entanglement_pairs[t].append((q, target))
            qc.h(range(n_qubits))
            qc.cz(0, n_qubits // 2)
            qc.h(range(n_qubits))

        elif entanglement_method == "skip":
            for q in range(0, n_qubits, 3):
                target = (q + 3) % n_qubits
                qc.cx(q, target)
                entanglement_pairs[t].append((q, target))

        elif entanglement_method == "random":
            n_connections = np.random.randint(1, 4)
            for _ in range(n_connections):
                control = np.random.randint(0, n_qubits)
                target = np.random.randint(0, n_qubits)
                while target == control:
                    target = np.random.randint(0, n_qubits)
                qc.cx(control, target)
                entanglement_pairs[t].append((control, target))

        elif entanglement_method == "hybrid":
            # Nearest connections
            for q in range(n_qubits - 1):
                qc.cx(q, q + 1)
                entanglement_pairs[t].append((q, q + 1))
            # Even connections
            for q in range(0, n_qubits, 2):
                target = (q + 2) % n_qubits
                qc.cx(q, target)
                entanglement_pairs[t].append((q, target))
            qc.h(range(n_qubits))
            qc.cz(0, n_qubits // 2)
            qc.h(range(n_qubits))

    # Save statevector and extract probabilities + phases
    qc.save_statevector()
    result = simulator.run(qc).result()
    statevector = np.array(result.get_statevector())
    probs = np.abs(statevector) ** 2
    angles = np.angle(statevector)

    # Compute marginal probabilities and average phases per qubit
    for q in range(n_qubits):
        mask = ((indices >> (n_qubits - 1 - q)) & 1) == 1
        prob_matrix[t, q] = probs[mask].sum()

        # Weighted average phase for qubit q
        if probs[mask].sum() > 1e-12:
            phase_matrix[t, q] = np.angle(np.sum(statevector[mask]))
        else:
            phase_matrix[t, q] = 0.0

    qc.data.pop()  # remove save_statevector instruction

output = {
    "n_qubits": n_qubits,
    "timesteps": timesteps,
    "entanglement_method": entanglement_method,
    "probabilities": prob_matrix.tolist(),  # 2D array
    "phases": phase_matrix.tolist(),        # 2D array
    "entanglement_pairs": entanglement_pairs,  # already serializable
}

filename = f"quantum_{entanglement_method}.json"
with open(filename, "w") as f:
    json.dump(output, f, indent=2)

print(f"✅ Saved {filename}")

# === PLOTTING ===
plt.figure(figsize=(12, 9))

# Base heatmap for probabilities
# cmap = "magma"
#plt.imshow(prob_matrix, cmap="gray", aspect="auto", origin="upper", vmin=0, vmax=1)

'''
# Overlay entanglement connections
for t, pairs in enumerate(entanglement_pairs):
    n_pairs = len(pairs)
    for i, (control, target) in enumerate(pairs):
        offset = (i - (n_pairs - 1) / 2) * 0.3
        y = t + offset
        # Connection lines
        plt.plot([control, target], [y, y], color="cyan", alpha=0.5, linewidth=1)
        # Control & target markers
        plt.scatter(control, y, color="lime", s=15, marker="o", zorder=3)
        plt.scatter(target, y, color="magenta", s=15, marker="^", zorder=3)

'''

# Overlay phase markers (hue = phase, alpha = prob)
norm_phase = (phase_matrix + np.pi) / (2 * np.pi)  # map phase [-π, π] → [0,1]

# Offset phase markers slightly to the right for better visibility
x_positions = np.tile(np.arange(n_qubits), timesteps) + 0.25
y_positions = np.repeat(np.arange(timesteps), n_qubits)

plt.scatter(
    x_positions,
    y_positions,
    c=norm_phase.flatten(),
    #cmap="twilight",
    cmap="gray",
    s=12,
    alpha=0.8,
    edgecolors="none",
    zorder=4
)


plt.colorbar(label="Probability of |1>")
plt.xlabel("Qubit index")
plt.ylabel("Time step")
plt.title(f"Quantum Interference, Entanglement & Phase ({entanglement_method} mode)")
plt.tight_layout()
plt.show()