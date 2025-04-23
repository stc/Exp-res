import qiskit
import numpy as np
from qiskit import transpile
from qiskit_aer import AerSimulator
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

def cccnot(circuit, c1, c2, c3, target):
    circuit.ccx(c1, c2, 0)
    circuit.ccx(c3, 0, target)
    circuit.ccx(c1, c2, 0)

def add_rule(circuit, n, timestep, position, rules):
    for rule in rules:
        if position == 0: # Cell is on the left edge
            if rule[0]:
                continue
            for i in range(1, 3):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
            circuit.ccx(
                n * timestep + position + 1,
                n * timestep + position + 2,
                n * (timestep + 1) + position + 1
            )
            for i in range(1, 3):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
        elif position == n - 1:
            if rule[2]:
                continue
            for i in range(2):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
            circuit.ccx(
                n * timestep + position,
                n * timestep + position + 1,
                n * (timestep + 1) + position + 1
            )
            for i in range(2):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
        else:
            for i in range(3):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
            cccnot(
                circuit,
                n * timestep + position,
                n * timestep + position + 1,
                n * timestep + position + 2,
                n * (timestep + 1) + position + 1
            )
            for i in range(3):
                if not rule[i]:
                    circuit.x(n * timestep + position + i)
    
def add_rules(circuit, n, m, rules):
    for i in range(m - 1):
        for j in range(n):
            add_rule(circuit, n, i, j, rules)
    for i in range(0, n * m):
        circuit.measure(i + 1, i)

n = 6
m = 10

qc = qiskit.QuantumCircuit(n * m + 1, n * m)

rule30 = [
    [True, False, False],
    [False, True, True],
    [False, True, False],
    [False, False, True]
]
rule86 = [
    [True, True, False],   
    [True, False, True],   
    [False, True, False],  
    [False, False, True],  
]
rule90 = [
    [True, True, False],
    [True, False, False],
    [False, True, True],
    [False, False, True]
]
rule101 = [
    [True, True, False],   
    [True, False, True],   
    [False, True, False],  
    [False, False, False], 
]
rule105 = [
    [True, True, False],   
    [True, False, True],   
    [False, True, False],  
    [False, False, True],  
    [False, False, False], 
]
rule150 = [
    [True, True, True],
    [True, False, False],
    [False, True, False],
    [False, False, True],
]

rule181 = [
    [True, True, True],
    [True, False, True],
    [True, False, False],
    [False, True, False],
    [False, False, False],
]

# Configure the starting cells
qc.x(4)
for i in range(n):
    # Apply Hadamard to every qubit except central qubit
    if i != 3:
        qc.h(i + 1)

# Add the rules
add_rules(qc, n, m, rule30)

# run on simulator
simulator = AerSimulator(method='matrix_product_state')
transpiled_qc = transpile(qc, simulator)
job = simulator.run(transpiled_qc, shots=1024, memory=True)
result = job.result()

# run on actual quantum circuit
#service = QiskitRuntimeService(channel="ibm_quantum", token="e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4")
#backend = service.least_busy(operational=True, simulator=False, memory=True)
#transpiled_qc = transpile(qc, backend)

#job = Sampler(backend).run([transpiled_qc], shots=1024)
#result = job.result()

counts = result.get_counts()

grid = np.zeros((m, n))
for bitstring, cnt in counts.items():
    prob = cnt / 1024
    for idx, c in enumerate(reversed(bitstring)):
        if c == '1':
            grid[idx // n, idx % n] += prob

for row in grid:
    print("[" + ', '.join(f"{cell:.2f}" for cell in row) + "]")
    