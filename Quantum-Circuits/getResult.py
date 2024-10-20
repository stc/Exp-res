from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService(
    channel='ibm_quantum',
    instance='ibm-q/open/main',
    token='e97cb70abdf2b346d87c00cbdf142528e7fcc8f07eb6dadc49e3318e8c5346b95494e2612ecb020af0c76dc410804251ba12eb1bad49e2110e5c86cb7b28bff4'
)
# bell-state results
#job = service.job('cw9t34c2802g0081nvq0')

# binary-random results
job = service.job('cwabp899ezk00085nz50')
job_result = job.result()
memory = job_result.get_memory()

shots_array = []
# Loop through each shot in the BitArray and print the results
for i, shot in enumerate(memory):
    # Convert the bitstring to a list of integers if needed
    # bit_array = [int(bit) for bit in shot]
    shots_array.append(shot)

print(shots_array)


"""
all_shots = []
for bitstring, count in counts.items():
    # Convert the bitstring to a list of integers
    bit_array = [int(bit) for bit in bitstring]
    # Repeat each bitstring for the number of times it occurred
    all_shots.extend([bit_array] * count)

# Loop through each shot
for i, shot in enumerate(all_shots):
    print(f"Shot {i+1}: {shot}")
"""