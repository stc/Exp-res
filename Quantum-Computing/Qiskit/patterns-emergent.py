from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Parameters
n = 8       # number of qubits (width)
layers = 4  # circuit depth
shots = 64  # number of measurements (height)

# Create quantum circuit
qc = QuantumCircuit(n, n)

# Build layered circuit to produce emergent patterns
for layer in range(layers):
    # Superposition
    for i in range(n):
        qc.h(i)
    
    # Staggered entanglement
    for i in range(0, n-1, 2):
        qc.cx(i, i+1)
    for i in range(1, n-1, 2):
        qc.cx(i, i+1)
    
    # Layer-dependent phase rotations to create interference
    for i in range(n):
        qc.rz((layer+1)*0.5, i)

# Measure all qubits
qc.measure(range(n), range(n))

# Simulate
sim = AerSimulator()
qc_t = transpile(qc, sim)
result = sim.run(qc_t, shots=shots).result()
counts = result.get_counts()

# Convert counts into a 2D grid of binary strings
# We'll expand counts into a list of individual shots
measurement_rows = []
for pattern, count in counts.items():
    measurement_rows.extend([pattern] * count)

# Shuffle rows so they appear in measurement order (optional)
import random
random.shuffle(measurement_rows)

# ASCII mapping
def binary_to_ascii(binary_string):
    return ''.join('█' if bit=='1' else ' ' for bit in binary_string)

# Print the 2D ASCII grid
print("Emergent Quantum ASCII Grid:")
for row in measurement_rows:
    print(binary_to_ascii(row))