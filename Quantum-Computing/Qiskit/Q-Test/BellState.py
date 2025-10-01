from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# 1. Connect to IBM Quantum
service = QiskitRuntimeService(channel="ibm_cloud")  # or "ibm_cloud"

# 2. Get the least busy backend
backend = service.least_busy(operational=True, simulator=False)
print("Using backend:", backend.name)

# 3. Create the Bell state circuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])

# 4. Transpile the circuit for the backend
compiled = transpile(qc, backend)

# 5. Create the Sampler with the backend
sampler = Sampler(mode=backend)

# 6. Run the circuit
job = sampler.run([compiled], shots=1024)
print(f"Job ID: {job.job_id()}")
print("Waiting for results...")
result = job.result()

# 7. Extract and show results
pub_result = result[0]
counts = pub_result.data.meas.get_counts()
print("Bell state results:", counts)

# 8. Plot histogram
plot_histogram(counts)
plt.show()