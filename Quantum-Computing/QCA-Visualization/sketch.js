let font;
let playhead_0 = 0;
let playhead_1 = 0;
let playhead_2 = 0;
let playhead_3 = 0;
let playhead_4 = 0;
let playhead_5 = 0;
let playback_0 = false;
let playback_1 = false;
let playback_2 = false;
let playback_3 = false;
let playback_4 = false;
let playback_5 = false;

let colr = 0;
let bgCol = 255;

const vert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vVertTexCoord;

void main() {
	vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;

	vVertTexCoord = aTexCoord;
} 
`;

const frag = `
precision highp float;

uniform sampler2D uTexture;
uniform vec3 uColor;

varying highp vec2 vVertTexCoord;

const int N = 4;

void main() {
	float brightness = texture2D(uTexture, vVertTexCoord).r;
	vec2 pos = floor(gl_FragCoord.xy / 2.0);
	
	float threshold = 0.0;
	for (int n = N; n > 0; n--) {
		float two_n = pow(2.0, float(n-1));
		vec2 p = floor(pos / two_n);
		threshold += pow(4.0, float(N - n)) * (mod(p.y, 2.0) + 2.0 * mod(p.x + p.y, 2.0));
	}
	threshold = (threshold + 1.0) / pow(4.0, float(N)) - 1e-4;
	vec3 color = brightness > threshold ? uColor : uColor * 0.2;
	gl_FragColor = vec4(color, 1.0);
}
`;

function preload() {
  font = loadFont("IBMPlexSans-Medium.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gfx = createGraphics(width,height);
  mShader = createShader(vert, frag);
	shader(mShader);
	mShader.setUniform("uColor", [0.8,0.8,0.8]);
}

let gfx;
let mShader;

function draw() {
  background(bgCol);
  gfx.background(bgCol);
  if(playback_0) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_0<10) {
        for(let i=0; i<r_30_binary[playhead_0].length; i++) {
          let value = r_30_binary[playhead_0][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playhead_0++;
      } else {
        playback_0 = false;
        playback_1 = true;
      }
    }
  }
  if(playback_1) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_1<10) {
        console.log("play " + averageByIndex(r_30_simulator));
        for(let i=0; i<r_30_simulator[playhead_1].length; i++) {
          let value = r_30_simulator[playhead_1][i];
          
          playWithADSR(i, value * 0.1);
          
        }
        playhead_1++;
      } else {
        playback_1 = false;
        playback_2 = true;
      }
    }
  }
  if(playback_2) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_2<10) {
        for(let i=0; i<r_90_binary[playhead_2].length; i++) {
          let value = r_90_binary[playhead_2][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playhead_2++;
      } else {
        playback_2 = false;
        playback_3 = true;
      }
    }
  }
  if(playback_3) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_3<10) {
        playhead_3++;
      } else {
        playback_3 = false;
        playback_4 = true;
      }
    }
  }
  if(playback_4) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_4<10) {
        for(let i=0; i<r_101_binary[playhead_4].length; i++) {
          let value = r_101_binary[playhead_4][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playhead_4++;
      } else {
        playback_4 = false;
        playback_5 = true;
      }
    }
  }
  if(playback_5) {
    if(frameCount%random([5,10,20])==0) {
      if(playhead_5<10) {
        playhead_5++;
      } else {
        playback_5 = false;
      }
    }
  }
  drawCA_Pair("RULE 30", "Q-GATE", r_30_binary, playhead_0, r_30_simulator, playhead_1,  50, 50, 10);
  drawCA_Pair("RULE 90", "Q-GATE", r_90_binary, playhead_2, r_90_simulator, playhead_3,  400, 50, 10);
  drawCA_Pair("RULE 101", "Q-GATE", r_101_binary, playhead_4, r_101_simulator, playhead_5,  50, 300, 10);

  mShader.setUniform("uTexture",gfx);
  rect(-width / 2, -height / 2, width, height);
}

function mousePressed() {
  initAudio();
  playback_0 = true;
}

function keyPressed() {
  for(let i=0; i<6; i++) {
    fadeOut();
  }
}

function drawCA_Pair(rule, q_rule, binary_cells, binary_index, quantum_cells, quantum_index, xpos, ypos, s) {
  
  let maxcol = binary_cells[0].length;
  let maxrow = binary_cells.length;
  
  gfx.stroke(colr)
  //fill(240)
  gfx.noFill();
  gfx.rectMode(CORNER)
  //rect(xpos-s,ypos-s,maxcol*s*2,maxrow*s*2);
  
  
  for (let row = 0; row < binary_index; row++) {
    for (let col = 0; col < maxcol; col++) {
      gfx.noStroke();
      let value = map(binary_cells[row][col], 0., 1.0, 0, s*2);
      gfx.fill(colr);
      gfx.rectMode(CENTER)
      gfx.rect(col * s * 2 + xpos, row * s * 2 + ypos, value, value);
    }
  }
  for (let row = 0; row < maxrow; row++) {
    for (let col = 0; col < maxcol; col++) {
      gfx.stroke(140)
      gfx.noFill();
      gfx.rectMode(CENTER)
      //rect(col * s * 2 + xpos, row * s * 2 + ypos, s * 2, s * 2)
      
    }
  }
  
  gfx.stroke(colr)
  gfx.noFill();
  gfx.rectMode(CORNER)
  //rect(xpos-s + maxcol * s * 3,ypos-s,maxcol*s*2,maxrow*s*2);
  
  if(quantum_index>0 && quantum_index<10) {
    random([0,1]) ? playWithADSR(floor(random(6)),0.05) : gfx.fill(255);
  }
  for (let row = 0; row < maxrow; row++) {
    for (let col = 0; col < maxcol; col++) {
      gfx.noStroke();
      let value = map(quantum_cells[row][col], 0.3, 1.0, 0, s*2);
      let cv = map(quantum_cells[row][col],0.4,1.0,bgCol,colr,true);
      
      if(quantum_index>0 && quantum_index<10) {
        random([0,1]) ? gfx.fill(colr) : gfx.fill(bgCol);
        gfx.rectMode(CENTER)
        gfx.rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos,s*2,s*2);
        
      }
      gfx.fill(20,map(quantum_index,0,10,0,255));
      gfx.rectMode(CENTER)
      gfx.fill(cv, map(quantum_index,0,10,0,255));
      //rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, value * map(quantum_index,0,10,0,1), value * map(quantum_index,0,10,0,1));
      
      gfx.rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, s*2,s*2);
    }
    for (let row = 0; row < maxrow; row++) {
      for (let col = 0; col < maxcol; col++) {
        gfx.stroke(140)
        gfx.strokeWeight(1)
        gfx.noFill();
        gfx.rectMode(CENTER)
        //rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, s * 2, s * 2)
      }
    }
  }

  gfx.noStroke();
  gfx.fill(colr);
  gfx.textFont(font);
  gfx.textSize(14)
  gfx.text(rule, xpos - s, ypos - s * 2)
  gfx.text(q_rule, xpos - s + maxcol * s * 3, ypos - s * 2)
}

function averageByIndex(arrays) {
  const numRows = arrays.length;
  const numCols = arrays[0].length;
  const result = new Array(numCols).fill(0);

  arrays.forEach(row => {
    row.forEach((val, i) => {
      result[i] += val;
    });
  });

  return result.map(sum => sum / numRows);
}

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