let data;
let cellW, cellH;
let maxQubits, timesteps;

function preload() {
  data = loadJSON("quantum_even.json"); // Change file to test other modes
}

function setup() {
  createCanvas(1200, 800);
  maxQubits = data.n_qubits;
  timesteps = data.timesteps;

  cellW = width / maxQubits;
  cellH = height / timesteps;

  console.log("Entanglement pairs sample:", data.entanglement_pairs[0]); // DEBUG
  noLoop();
}

function draw() {
  background(0);

  // === 1. DRAW PROBABILITY HEATMAP ===
  noStroke();
  for (let t = 0; t < timesteps; t++) {
    for (let q = 0; q < maxQubits; q++) {
      let p = data.probabilities[t][q];
      fill(p * 255);
      rect(q * cellW, t * cellH, cellW, cellH);
    }
  }

  // === 2. DRAW PHASE OVERLAY ===
  colorMode(HSB, 1);
  noStroke();
  for (let t = 0; t < timesteps; t++) {
    for (let q = 0; q < maxQubits; q++) {
      let phase = (data.phases[t][q] + Math.PI) / (2 * Math.PI); // normalize [-π, π] → [0,1]
      let alpha = data.probabilities[t][q];
      fill(phase, 1, 1, alpha);
      ellipse((q + 0.5) * cellW, (t + 0.5) * cellH, cellW * 0.1);
    }
  }
  colorMode(RGB, 255);

  // === 3. DRAW ENTANGLEMENT CONNECTIONS LAST ===
  for (let t = 0; t < timesteps; t++) {
    let pairs = data.entanglement_pairs[t];
    let nPairs = pairs.length;

    for (let i = 0; i < nPairs; i++) {
      let [control, target] = pairs[i];
      let offset = (i - (nPairs - 1) / 2) * cellH * 0.3;
      let y = t * cellH + offset + cellH / 2;

      // Draw bright white lines for visibility
      stroke(255, 255, 0, 255);
      strokeWeight(3);
      line(
        control * cellW + cellW / 2, y,
        target * cellW + cellW / 2, y
      );

      // Draw control marker (green)
      noStroke();
      fill(0, 255, 0);
      ellipse(control * cellW + cellW / 2, y, cellW * 0.1);

      // Draw target marker (red triangle)
      fill(255, 0, 0);
      triangle(
        target * cellW + cellW / 2, y - cellH * 0.25,
        target * cellW + cellW / 2 - cellW * 0.25, y + cellH * 0.25,
        target * cellW + cellW / 2 + cellW * 0.25, y + cellH * 0.25
      );
    }
  }

  // === 4. DRAW TITLE ===
  noStroke();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Quantum Visualization — Entanglement: ${data.entanglement_method}`, 10, 10);
}