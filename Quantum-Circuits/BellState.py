from qiskit import QuantumCircuit
from qiskit.quantum_info import SparsePauliOp
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
from qiskit_ibm_runtime import EstimatorV2 as Estimator
 
# Create a new circuit with two qubits and 2 classical bits
qc = QuantumCircuit(2,2) 
 
# Add a Hadamard gate to qubit 0
qc.h(0)
 
# Perform a controlled-X gate on qubit 1, controlled by qubit 0
qc.cx(0, 1)

# Measures qubit 1 and puts the result in bit 0
# qc.measure(1,0)

# measuring all 
qc.measure_all()
 
# visualize circuit
print(qc)