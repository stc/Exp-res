from qiskit_ibm_runtime import QiskitRuntimeService
import numpy as np

service = QiskitRuntimeService(
    channel='ibm_quantum',
    instance='ibm-q/open/main',
    token='e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4'
)

#random-hex results
# job = service.job('cwd30n22802g008m6nfg')

#entangled hex results
#job = service.job('cwhqw3g40e000088xxjg')

# bell-state results
# job = service.job('cw9t34c2802g0081nvq0')
# job = service.job('cwabsrqjyrs0008h1b4g')

# binary-random results
# job = service.job('cwabp899ezk00085nz50')

# quantum walk results
num_steps = 12  # Increased to 10 qubits
num_qubits = num_steps
job = service.job('cyj83yfrta1g008vex40')
#counts = job.result()[0].data.meas.get_counts()
counts = job.result()[0].data.c.get_counts()
#counts = result.get_counts()
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

with open("quantum-walk-probabilities-IBM.txt", "w") as file:
    file.write("[\n")
    for item in prob_results:
        file.write(f"{item},\n")
    file.write("]")

'''
# query for stored states of shots
job_result = job.result()
memory = job_result.get_memory()
shots_array = []

for i, shot in enumerate(memory):
    shots_array.append(shot)

print(shots_array)
'''