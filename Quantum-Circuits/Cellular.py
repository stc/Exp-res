import qiskit
from qiskit import QuantumRegister, QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram

import matplotlib.pyplot as plt
import matplotlib
import numpy as np

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


n = 10
m = 2

cirq1 = QuantumCircuit(n * m + 1, n * m)
rule90 = [
    [True, True, False],
    [True, False, False],
    [False, True, True],
    [False, False, True]
]
rule30 = [
    [True, False, False],
    [False, True, True],
    [False, True, False],
    [False, False, True]
]

# Configure the starting cells here:
cirq1.x(4)
cirq1.h(5)
for i in range(n):
    if i != 3:
        cirq1.h(i + 1)

# Add the rules
add_rules(cirq1, n, m, rule30)

print(cirq1)

shots = 1024
#job = execute(cirq1, backend=Aer.get_backend('qasm_simulator'), shots=shots)
simulator = AerSimulator()
transpiled_qc = transpile(cirq1, simulator)
job = simulator.run(transpiled_qc, shots=shots, memory=True)
#result = job.result()

results = job.result()
counts = results.get_counts()
measured_bit = max(counts, key=counts.get)

shots_array = []

for i, shot in enumerate(results.get_memory()):
    shots_array.append(shot)
    #print(shot + "\n")

grid = np.zeros((m, n))
for bitstring, cnt in counts.items():
    prob = cnt / shots
    for idx, c in enumerate(reversed(bitstring)):
        if c == '1':
            grid[idx // n, idx % n] += prob
            print(grid)     

#plt.imshow(grid, interpolation='nearest')

#plt.show()
#print(shots_array)
#plot_histogram(counts)