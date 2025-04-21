import qiskit
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_aer import AerSimulator
import pqca
import random

# Create circuit
num_qubits = 3
qr = QuantumRegister(num_qubits, "q")
cr = ClassicalRegister(num_qubits, "c")
qc = QuantumCircuit(qr,cr)

def genCircuit_A( _qc ):
    _qc.h(0) # superposition
    _qc.h(1)
    _qc.h(2)
    _qc.cx(2,1) # entanglement
    _qc.cx(1,2)
    return _qc

def genCircuit_B( _qc ):
    _qc.h(0) # superposition
    _qc.h(1)
    _qc.h(2)
    _qc.cx(2,1) # entanglement
    _qc.cx(1,0)
    return _qc

def genCircuit_C( _qc ):
    _qc.h(0) # superposition
    _qc.h(1)
    _qc.h(2)
    _qc.cx(2,1) # entanglement
    _qc.cx(1,0)
    return _qc

def genCircuit_D( _qc ):
    _qc.h(0) # superposition
    _qc.h(1)
    _qc.h(2)
    _qc.cx(0,1) # entanglement
    _qc.cx(1,2)
    return _qc

def genSequence_A( _qc ):
    return [
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(1), _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(2), _qc),
        pqca.UpdateFrame(tes.shifted_by(3), _qc),
    ]

def genSequence_B( _qc ):
    return [
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(2), _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(2), _qc),
        pqca.UpdateFrame(tes.shifted_by(3), _qc),
    ]

def genSequence_C( _qc ):
    return [
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(1), _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(0), _qc),
        pqca.UpdateFrame(tes.shifted_by(0), _qc),
    ]

def genSequence_D( _qc ):
    return [
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(1), _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes, _qc),
        pqca.UpdateFrame(tes.shifted_by(0), _qc),
        pqca.UpdateFrame(tes.shifted_by(0), _qc),
    ]

# Create tessellation
cellnum = 54
tes = pqca.tessellation.one_dimensional(cellnum, num_qubits)

# Create initial state
#initial_state = [0]*cellnum
#initial_state[cellnum // 2] = 1  # Set the middle cell to 1
initial_state = [random.randint(0, 1) for _ in range(cellnum)]

simulator = AerSimulator(method="extended_stabilizer", max_memory_mb=8192)
backend = pqca.backend.qiskit(simulator)

#C & C looks emergent
automaton = pqca.Automaton(initial_state, genSequence_D( genCircuit_D( qc ) ), backend)

for _ in range(200):
    state = next(automaton)
    visual = ''
    
    for cell in state:
        visual += ' ' if cell else '█'
    print(visual)