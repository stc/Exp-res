from qiskit_ibm_runtime import QiskitRuntimeService
import numpy as np

service = QiskitRuntimeService(
    channel='ibm_quantum',
    instance='ibm-q/open/main',
    token='e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4'
)

# job ID on IBM quantum platform
job = service.job('czjnw0ghrmy00084hxyg')

#counts = job.result()[0].data.meas.get_counts()
counts = job.result()[0].data.c.get_counts()
print(counts)

n = 5
m = 5

grid = np.zeros((m, n))
for bitstring, cnt in counts.items():
    prob = cnt / 1024
    for idx, c in enumerate(reversed(bitstring)):
        if c == '1':
            grid[idx // n, idx % n] += prob

for row in grid:
    print(' '.join(f"{cell:.2f}" for cell in row))

# save to file
with open("grid_data.txt", "w") as f:
    for row in grid:
        f.write(str([float(np.float64(round(cell, 5))) for cell in row]) + ",\n")

print("Grid saved to grid_data.txt")