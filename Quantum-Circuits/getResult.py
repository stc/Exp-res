from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService(
    channel='ibm_quantum',
    instance='ibm-q/open/main',
    token='e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4'
)

#random-hex results
job = service.job('cwd30n22802g008m6nfg')

# bell-state results
# job = service.job('cw9t34c2802g0081nvq0')
# job = service.job('cwabsrqjyrs0008h1b4g')

# binary-random results
# job = service.job('cwabp899ezk00085nz50')

job_result = job.result()
memory = job_result.get_memory()
shots_array = []

for i, shot in enumerate(memory):
    shots_array.append(shot)

print(shots_array)