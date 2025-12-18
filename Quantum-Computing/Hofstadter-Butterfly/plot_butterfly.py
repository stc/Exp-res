# --- external imports
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
from math import gcd
import matplotlib.ticker as ticker
# --- internal imports
from HT.models.hofstadter import Hofstadter

q = 199
nphi_list = []
E_list = []

for p in tqdm(range(1, q), desc="Butterfly Construction", ascii=True):
    # construct model
    # model = Hofstadter(p, q, lat="square")
    # model = Hofstadter(p, q, lat="triangular")
    model = Hofstadter(p, q, lat="kagome")
    
    # define flux density
    if gcd(p, q) != 1:  # nphi must be a coprime fraction
        continue
    nphi = p/q
    # diagonalize Hamiltonian
    ham = model.hamiltonian(np.array([0, 0]))
    M = len(ham)
    nphi_list.append([nphi] * M)
    lmbda = np.sort(np.linalg.eigvalsh(ham))
    E_list.append(lmbda)

fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111)
nphi_list = list(np.concatenate(nphi_list).ravel())
E_list = list(np.concatenate(E_list).ravel())

# Use horizontal line marker
ax.scatter(nphi_list, E_list, s=5, marker='_', linewidths=0.5)

ax.set_ylabel('$E$')
ax.set_xlabel('$phi$')
ax.xaxis.set_major_formatter(ticker.FormatStrFormatter('$%g$'))
ax.yaxis.set_major_formatter(ticker.FormatStrFormatter('$%g$'))

# Save as SVG
plt.savefig('hofstadter_butterfly_kagome.svg', format='svg', bbox_inches='tight')
print("Plot saved as hofstadter_butterfly.svg")

# Optionally also display it
# plt.show()