from qiskit_ibm_runtime import QiskitRuntimeService
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt

# 1. Connect to IBM Quantum
service = QiskitRuntimeService(channel="ibm_cloud")  # or "ibm_cloud"

# 2. Retrieve the job by ID
job_id = "d3e19mmlahfs73d0i120"  # Replace with your actual job ID
job = service.job(job_id)

# 3. Check job status
print(f"Job ID: {job.job_id()}")
print(f"Job Status: {job.status()}")

# 4. Get results (this will wait if job is still running)
result = job.result()

# 5. Extract counts
pub_result = result[0]

# Try different ways to get counts
try:
    counts = pub_result.data.meas.get_counts()
except AttributeError:
    try:
        counts = pub_result.data.c.get_counts()  # 'c' is default classical register name
    except AttributeError:
        # Get the first available register
        register_name = list(pub_result.data.__dict__.keys())[0]
        counts = getattr(pub_result.data, register_name).get_counts()
        print(f"Using register: {register_name}")

print("\nMeasurement counts:", counts)

# 6. Plot histogram
plot_histogram(counts)
plt.title(f"Results from Job: {job_id}")
plt.show()

# Optional: Get job metadata
print(f"\nBackend used: {job.backend()}")
print(f"Creation date: {job.creation_date()}")