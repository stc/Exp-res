let font;
let playhead_0 = 0;
let playhead_1 = 0;
let playhead_2 = 0;
let playhead_3 = 0;
let playback_0 = true;
let playback_1 = false;
let playback_2 = false;
let playback_3 = false;

function preload() {
  font = loadFont("IBMPlexSans-Medium.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(230);
  if(playback_0) {
    if(frameCount%10==0) {
      if(playhead_0<10) {
        playhead_0++;
      } else {
        playback_0 = false;
        playback_1 = true;
      }
    }
  }
  if(playback_1) {
    if(frameCount%20==0) {
      if(playhead_1<10) {
        playhead_1++;
      } else {
        playback_1 = false;
        playback_2 = true;
      }
    }
  }
  if(playback_2) {
    if(frameCount%10==0) {
      if(playhead_2<10) {
        playhead_2++;
      } else {
        playback_2 = false;
        playback_3 = true;
      }
    }
  }
  if(playback_3) {
    if(frameCount%20==0) {
      if(playhead_3<10) {
        playhead_3++;
      } else {
        playback_3 = false;
      }
    }
  }
  drawCA_Pair("RULE 30", "Q-GATE", r_30_binary, playhead_0, r_30_simulator, playhead_1,  50, 50, 10);
  drawCA_Pair("RULE 90", "Q-GATE", r_90_binary, playhead_2, r_90_simulator, playhead_3,  50, 300, 10);
}

function drawCA_Pair(rule, q_rule, binary_cells, binary_index, quantum_cells, quantum_index, xpos, ypos, s) {
  let maxcol = binary_cells[0].length;
  let maxrow = binary_cells.length;
  for (let row = 0; row < maxrow; row++) {
    for (let col = 0; col < maxcol; col++) {
      stroke(0, 0, 200)
      noFill();
      rect(col * s * 2 + xpos, row * s * 2 + ypos, s * 2, s * 2)
    }
  }
  for (let row = 0; row < binary_index; row++) {
    for (let col = 0; col < maxcol; col++) {
      noStroke();
      let value = map(binary_cells[row][col], 0., 1.0, 0, s*2);
      fill(0, 0, 200);
      rectMode(CENTER)
      rect(col * s * 2 + xpos, row * s * 2 + ypos, value, value);
      stroke(0, 0, 200)
      noFill();
      rect(col * s * 2 + xpos, row * s * 2 + ypos, s * 2, s * 2)
    }
  }
  for (let row = 0; row < maxrow; row++) {
    for (let col = 0; col < maxcol; col++) {
      stroke(0, 0, 200)
      noFill();
      rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, s * 2, s * 2)
    }
  }
  for (let row = 0; row < maxrow; row++) {
    for (let col = 0; col < maxcol; col++) {
      noStroke();
      let value = map(quantum_cells[row][col], 0.47, 1.0, 0, s*2);
      
      if(quantum_index>0 && quantum_index<10) {
        random([0,1]) ? fill(0, 0, 200) : fill(230);
        rectMode(CENTER)
        rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos,s,s);
      }
      fill(0, 0, 200);
      rectMode(CENTER)
      rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, value * map(quantum_index,0,10,0,1), value * map(quantum_index,0,10,0,1));
      
    }
  }

  noStroke();
  fill(0,0,200);
  textFont(font);
  textSize(14)
  text(rule, xpos - s, ypos - s * 2)
  text(q_rule, xpos - s + maxcol * s * 3, ypos - s * 2)
}

let r_30_simulator = [
  [0.50, 0.48, 0.51, 1.00, 0.49, 0.49],
  [0.73, 0.50, 0.52, 0.49, 0.26, 0.50],
  [0.88, 0.53, 0.48, 0.51, 0.48, 0.76],
  [1.00, 0.36, 0.49, 0.51, 0.49, 0.49],
  [1.00, 0.27, 0.64, 0.50, 0.50, 0.50],
  [1.00, 0.23, 0.74, 0.35, 0.73, 0.53],
  [1.00, 0.14, 0.75, 0.25, 0.65, 0.74],
  [1.00, 0.11, 0.89, 0.37, 0.64, 0.40],
  [1.00, 0.00, 1.00, 0.36, 0.60, 0.49],
  [1.00, 0.00, 1.00, 0.27, 0.64, 0.39]
]

let r_90_binary = [
  [0.00, 0.00, 0.00, 1.00, 0.00, 0.00],
  [0.00, 0.00, 1.00, 0.00, 1.00, 0.00],
  [0.00, 1.00, 0.00, 0.00, 0.00, 1.00],
  [1.00, 0.00, 1.00, 0.00, 1.00, 0.00],
  [0.00, 0.00, 0.00, 0.00, 0.00, 1.00],
  [0.00, 0.00, 0.00, 0.00, 1.00, 0.00],
  [0.00, 0.00, 0.00, 1.00, 0.00, 1.00],
  [0.00, 0.00, 1.00, 0.00, 0.00, 0.00],
  [0.00, 1.00, 0.00, 1.00, 0.00, 0.00],
  [1.00, 0.00, 0.00, 0.00, 1.00, 0.00]
]

let r_30_binary = [
  [0.00, 0.00, 0.00, 1.00, 0.00, 0.00],
  [0.00, 0.00, 1.00, 1.00, 1.00, 0.00],
  [0.00, 1.00, 1.00, 0.00, 0.00, 1.00],
  [1.00, 1.00, 0.00, 1.00, 1.00, 1.00],
  [1.00, 0.00, 0.00, 1.00, 0.00, 0.00],
  [1.00, 1.00, 1.00, 1.00, 1.00, 0.00],
  [1.00, 0.00, 0.00, 0.00, 0.00, 1.00],
  [1.00, 1.00, 0.00, 0.00, 1.00, 1.00],
  [1.00, 0.00, 1.00, 1.00, 1.00, 0.00],
  [1.00, 0.00, 1.00, 0.00, 0.00, 1.00]
]

let r_101_simulator = [
  [0.50, 0.50, 0.51, 1.00, 0.49, 0.52],
  [0.50, 0.50, 0.25, 0.51, 0.50, 0.76],
  [0.50, 0.51, 0.49, 0.50, 0.48, 0.76],
  [0.49, 0.50, 0.51, 0.51, 0.43, 0.76],
  [0.50, 0.50, 0.49, 0.38, 0.43, 0.76],
  [0.50, 0.64, 0.64, 0.39, 0.42, 0.76],
  [0.36, 0.48, 0.62, 0.38, 0.38, 0.76],
  [0.52, 0.49, 0.56, 0.25, 0.36, 0.76],
  [0.51, 0.52, 0.68, 0.33, 0.36, 0.76],
  [0.48, 0.50, 0.62, 0.38, 0.38, 0.76]
]

let r_101_binary = [
  [0.00, 0.00, 0.00, 1.00, 0.00, 0.00],
  [1.00, 1.00, 0.00, 1.00, 0.00, 1.00],
  [0.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  [0.00, 0.00, 0.00, 0.00, 0.00, 1.00],
  [1.00, 1.00, 1.00, 1.00, 0.00, 1.00],
  [0.00, 0.00, 0.00, 1.00, 1.00, 1.00],
  [1.00, 1.00, 0.00, 0.00, 0.00, 1.00],
  [0.00, 1.00, 0.00, 1.00, 0.00, 1.00],
  [0.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  [0.00, 0.00, 0.00, 0.00, 0.00, 1.00]
]

let r_90_simulator = [
  [0.52, 0.49, 0.53, 1.00, 0.49, 0.50],
  [0.49, 0.47, 0.51, 0.55, 0.50, 0.49],
  [0.47, 1.00, 0.51, 0.48, 0.53, 0.50],
  [1.00, 0.55, 0.52, 0.53, 0.51, 0.53],
  [0.55, 0.48, 0.52, 0.50, 0.51, 0.51],
  [0.48, 0.53, 0.49, 0.49, 0.52, 0.51],
  [0.53, 0.50, 0.47, 0.50, 0.52, 0.52],
  [0.50, 0.49, 1.00, 0.53, 0.49, 0.52],
  [0.49, 0.50, 0.55, 0.51, 0.47, 0.49],
  [0.50, 0.53, 0.48, 0.51, 1.00, 0.47]
]


let r_30 = [
  [0.48926, 0.47168, 0.45605, 0.47461, 0.47852],
  [0.52539, 0.11719, 0.49121, 0.49121, 0.50879],
  [0.53906, 0.49512, 0.72852, 0.55859, 0.49414],
  [0.49316, 0.48145, 0.53223, 0.45996, 0.49121],
  [0.49902, 0.63184, 0.48535, 0.46191, 0.50293],
]