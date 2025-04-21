import qiskit
from qiskit import QuantumRegister, QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

qr = QuantumRegister(6) 
cr = qiskit.ClassicalRegister(6)
circuit = QuantumCircuit(qr, cr)
circuit.h([0])
circuit.h([1])
circuit.h([2])

circuit.cx(0, 3)
circuit.cx(1, 4)
circuit.cx(2, 5)

circuit.measure_all()
print(circuit)

service = QiskitRuntimeService(channel="ibm_quantum", token="e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4")
backend = service.least_busy(operational=True, simulator=False, memory=True)
print(service.backends())

transpiled_qc = transpile(circuit, backend)
job = backend.run(transpiled_qc, shots=1000, memory=True)
result = job.result()

# analyze the results properly using the getResult script

