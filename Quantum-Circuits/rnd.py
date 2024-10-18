import qiskit
from qiskit import QuantumRegister, QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

def set_qubits(n: int):
    global circuit
    qr = QuantumRegister(n) # Create a quantum register of size n
    cr = qiskit.ClassicalRegister(n)
    circuit = QuantumCircuit(qr, cr)
    circuit.h(qr) # Apply Hadamard gate to qubits
    circuit.measure(qr, cr)

service = QiskitRuntimeService(channel="ibm_quantum", token="e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4")
backend = service.least_busy(operational=True, simulator=False)
print(service.backends())

set_qubits(1)

transpiled_qc = transpile(circuit, backend)

job = Sampler(backend).run([transpiled_qc], shots=1000)
result = job.result()

pub_result = result[0].data.meas.get_counts()
print(pub_result)