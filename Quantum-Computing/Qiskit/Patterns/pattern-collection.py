# quantum_patterns_qiskit.py - Updated for Qiskit 1.x
from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import QFT
from qiskit.circuit.random import random_circuit
from qiskit_aer import AerSimulator
import numpy as np
import matplotlib.pyplot as plt

# Initialize the statevector simulator
simulator = AerSimulator(method='statevector')

fig, axs = plt.subplots(3, 3, figsize=(10, 10))
axs = axs.flatten()

# 1. Bloch interference pattern (synthetic visualization)
angles = np.linspace(0, 2*np.pi, 200)
vectors = [[np.sin(a)*np.cos(a), np.sin(a)*np.sin(a), np.cos(a)] for a in angles]
v = np.array(vectors)
axs[0].scatter(v[:,0], v[:,1], c=np.abs(v[:,2]), cmap='plasma', s=10)
axs[0].set_title("Bloch interference pattern")

# 2. Hadamard–Phase–Hadamard interference
phases = np.linspace(0, 2*np.pi, 100)
probs = []
for phi in phases:
    qc = QuantumCircuit(1)
    qc.h(0)
    qc.p(phi, 0)
    qc.h(0)
    qc.save_statevector()
    result = simulator.run(qc).result()
    state = result.get_statevector()
    probs.append(np.abs(state.data)**2)
probs = np.array(probs)
axs[1].imshow(probs.T, aspect='auto', cmap='turbo', extent=[0,2*np.pi,0,1])
axs[1].set_title("Quantum interference (Hadamard–Phase–Hadamard)")

# 3. Quantum Fourier Transform pattern
n = 4
qc = QuantumCircuit(n)
qc.h(range(n))
qc.append(QFT(n), range(n))
qc.save_statevector()
# Transpile to decompose into basic gates
qc_transpiled = transpile(qc, simulator)
result = simulator.run(qc_transpiled).result()
state = result.get_statevector()
axs[2].bar(range(len(state.data)), np.abs(state.data)**2, color='cyan')
axs[2].set_title("Quantum Fourier Transform")

# 4. Quantum walk interference
steps = 6
positions = np.arange(-steps, steps+1)
distribution = np.zeros((steps, len(positions)))
for t in range(steps):
    qc = QuantumCircuit(1)
    for i in range(t):
        qc.h(0)
        qc.p(np.pi/4, 0)
    qc.save_statevector()
    result = simulator.run(qc).result()
    state = result.get_statevector()
    probs = np.abs(state.data)**2
    distribution[t, t] = probs[0]
    distribution[t, -t-1] = probs[1]
axs[3].imshow(distribution, cmap='inferno', aspect='auto')
axs[3].set_title("Quantum walk interference")

# 5. Random quantum circuit interference
intensity_map = []
for depth in range(1, 40):
    qc = random_circuit(4, depth, measure=False)
    qc.save_statevector()
    # Transpile to decompose into basic gates
    qc_transpiled = transpile(qc, simulator)
    result = simulator.run(qc_transpiled).result()
    sv = result.get_statevector()
    intensity_map.append(np.abs(sv.data)**2)
axs[4].imshow(np.array(intensity_map).T, aspect='auto', cmap='magma')
axs[4].set_title("Random quantum circuit chaos")

# 6. Multi-phase interference pattern
phi_vals = np.linspace(0, 2*np.pi, 100)
theta_vals = np.linspace(0, np.pi, 100)
I = np.zeros((len(theta_vals), len(phi_vals)))
for i, theta in enumerate(theta_vals):
    for j, phi in enumerate(phi_vals):
        qc = QuantumCircuit(1)
        qc.ry(theta, 0)
        qc.p(phi, 0)
        qc.h(0)
        qc.save_statevector()
        result = simulator.run(qc).result()
        state = result.get_statevector()
        I[i, j] = np.abs(state.data[0])**2
axs[5].imshow(I, cmap='plasma', aspect='auto')
axs[5].set_title("Multi-phase interference")

# 7. Two-qubit entangled state map
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.save_statevector()
result = simulator.run(qc).result()
state = result.get_statevector()
prob = np.abs(state.data)**2
axs[6].bar(range(4), prob, color='orange')
axs[6].set_title("Bell state amplitudes")

# 8. Phase rotation lattice
phi = np.linspace(0, 2*np.pi, 200)
theta = np.linspace(0, np.pi, 200)
Phi, Theta = np.meshgrid(phi, theta)
Z = np.sin(2*Theta) * np.cos(3*Phi)
axs[7].imshow(Z, cmap='viridis', aspect='auto')
axs[7].set_title("Phase lattice pattern")

# 9. Quantum interference diffraction (synthetic)
x = np.linspace(-3, 3, 400)
y = np.linspace(-3, 3, 400)
X, Y = np.meshgrid(x, y)
Z = np.cos(X*Y) * np.exp(-0.1*(X**2 + Y**2))
axs[8].imshow(Z, cmap='plasma', extent=(-3,3,-3,3))
axs[8].set_title("Quantum diffraction (synthetic)")

for ax in axs:
    ax.axis('off')

plt.tight_layout()
plt.savefig("quantum_patterns_qiskit_grid.png", dpi=300, bbox_inches='tight')
plt.show()