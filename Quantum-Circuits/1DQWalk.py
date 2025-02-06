from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
import numpy as np

# Number of steps in the random walk
num_steps = 12  # Increased to 10 qubits
num_qubits = num_steps

# Create a quantum circuit
qc = QuantumCircuit(num_steps, num_steps)

# Apply Hadamard gates to initialize superposition
for i in range(num_steps):
    qc.h(i)

# Measure all qubits
qc.measure(range(num_steps), range(num_steps))

print(qc)

# Run the circuit on an actual Quantum Processor
service = QiskitRuntimeService(channel="ibm_quantum", token="e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4")
backend = service.least_busy(operational=True, simulator=False, memory=True)
transpiled_qc = transpile(qc, backend)

job = Sampler(backend).run([transpiled_qc], shots=4096)
result = job.result()
# job = backend.run([transpiled_qc], shots=4096, memory=True)
# result = job.result()

'''
# Run the circuit on a Qiskit simulator
simulator = AerSimulator()
transpiled_qc = transpile(qc, simulator)
job = simulator.run(transpiled_qc, shots=4096, memory=True)
result = job.result()

# Get counts and normalize to probabilities
counts = result.get_counts(qc)
total_shots = sum(counts.values())
probabilities = {state: count / total_shots for state, count in counts.items()}

# Convert to an array format with labels
prob_array = np.array([probabilities.get(format(i, f'0{num_qubits}b'), 0) for i in range(2**num_qubits)])

# Create a labeled array of probabilities
labeled_probabilities = [(format(i, f'0{num_qubits}b'), prob_array[i]) for i in range(len(prob_array))]

# Sort the labeled probabilities in descending order based on the probability value
sorted_labeled_probabilities = sorted(labeled_probabilities, key=lambda x: x[1], reverse=True)

prob_results = []

index = 0
# Print the labeled probabilities
for label, prob in sorted_labeled_probabilities:
    index +=1
    # print(f"Index {index} - State {label}: Probability {prob}")
    prob_results.append( [label,float(prob)] )

with open("quantum-walk-probabilities.txt", "w") as file:
    file.write("[\n")
    for item in prob_results:
        file.write(f"{item},\n")
    file.write("]")
'''