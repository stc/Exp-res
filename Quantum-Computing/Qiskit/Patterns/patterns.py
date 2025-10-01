from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Parameters
n = 25       # number of qubits (cells)
layers = 50  # number of time steps
shots = 1    # we measure 1 shot per layer to build CA grid

# Initialize circuit
qc = QuantumCircuit(n, n)

# Function to convert binary string to ASCII
def binary_to_ascii(binary_string):
    return ''.join('█' if bit=='1' else ' ' for bit in binary_string)

# Store ASCII rows
ca_rows = []

# Start with first qubit in |1> to seed CA, others in |0>
qc.x(0)

sim = AerSimulator()

for layer in range(layers):
    # Apply Hadamards to create superposition for interactions
    for i in range(n):
        qc.h(i)
    
    # CNOTs like Rule 90 neighborhood interaction
    for i in range(n-1):
        qc.cx(i, i+1)
    for i in range(1, n):
        qc.cx(i, i-1)
    
    # Measure the qubits
    qc.measure(range(n), range(n))
    
    # Transpile and run
    qc_t = transpile(qc, sim)
    result = sim.run(qc_t, shots=shots).result()
    counts = result.get_counts()
    
    # Extract the binary string and store row
    measured_pattern = list(counts.keys())[0]
    ca_rows.append(binary_to_ascii(measured_pattern))
    
    # Reset classical bits and qubits for next layer
    qc.data.clear()
    qc = QuantumCircuit(n, n)
    for i, bit in enumerate(measured_pattern):
        if bit == '1':
            qc.x(i)

# Print the cellular automaton ASCII grid
print("Quantum-inspired Cellular Automaton:")
for row in ca_rows:
    print(row)