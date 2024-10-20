import qiskit
from qiskit import QuantumRegister, QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

qr = QuantumRegister(1)
cr = qiskit.ClassicalRegister(1)
circuit = QuantumCircuit(qr, cr)
circuit.h([0]) # Apply Hadamard gate to first qubit
circuit.measure_all()
print(circuit)

service = QiskitRuntimeService(channel="ibm_quantum", token="e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4")
backend = service.least_busy(operational=True, simulator=False, memory=True)
transpiled_qc = transpile(circuit, backend)
execute = backend.run([transpiled_qc], shots=1000, memory=True)

# job = Sampler(backend).run([transpiled_qc], shots=1000)
# result = job.result()
# memory = result.get_memory()
