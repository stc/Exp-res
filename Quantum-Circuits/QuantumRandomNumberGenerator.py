from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# Create a quantum circuit with 1 qubit and 1 classical bit
qc = QuantumCircuit(1, 1)

# Apply a Hadamard gate to create a superposition state
qc.h(0)

# Measure the qubit
qc.measure(0, 0)

# Initialize the AerSimulator
simulator = AerSimulator()

# Transpile the quantum circuit for the simulator
transpiled_qc = transpile(qc, simulator)

# Execute the transpiled circuit on the simulator with 1024 shots
job = simulator.run(transpiled_qc, shots=1024)

# Get the result
result = job.result()
counts = result.get_counts()

#plot_histogram(counts, title="Quantum Random Number Generator")
#plt.show()

print(qc)

def generate_random_bits(n):
    random_bits = []
    for _ in range(n):
        result = simulator.run(transpiled_qc, shots=1).result()
        bit = list(result.get_counts().keys())[0]
        random_bits.append(bit)
    return ''.join(random_bits)

# Generate 8 random bits
random_bits = generate_random_bits(100)
print(f"Random number sequence: {random_bits}")