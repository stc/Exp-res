let font;
let playheads = Array(12).fill(0);
let playbacks = Array(12).fill(false);

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

let gfx;
let mShader;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gfx = createGraphics(width,height);
  mShader = createShader(vert, frag);
	shader(mShader);
	mShader.setUniform("uColor", [0.8,0.8,0.8]);
}

function draw() {
  background(bgCol);
  gfx.background(bgCol);

  if(playbacks[0]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[0]<10) {
        for(let i=0; i<r_30_binary[playheads[0]].length; i++) {
          let value = r_30_binary[playheads[0]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[0]++;
      } else {
        playbacks[0] = false;
        playbacks[1] = true;
      }
    }
  }

  if(playbacks[1]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[1]<10) {
        console.log("play " + averageByIndex(r_30_simulator));
        for(let i=0; i<r_30_simulator[playheads[1]].length; i++) {
          let value = r_30_simulator[playheads[1]][i];
          playWithADSR(i, value * 0.1);
        }
        playheads[1]++;
      } else {
        playbacks[1] = false;
        playbacks[2] = true;
      }
    }
  }

  if(playbacks[2]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[2]<10) {
        for(let i=0; i<r_90_binary[playheads[2]].length; i++) {
          let value = r_90_binary[playheads[2]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[2]++;
      } else {
        playbacks[2] = false;
        playbacks[3] = true;
      }
    }
  }

  if(playbacks[3]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[3]<10) {
        playheads[3]++;
      } else {
        playbacks[3] = false;
        playbacks[4] = true;
      }
    }
  }

  if(playbacks[4]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[4]<10) {
        for(let i=0; i<r_101_binary[playheads[4]].length; i++) {
          let value = r_101_binary[playheads[4]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[4]++;
      } else {
        playbacks[4] = false;
        playbacks[5] = true;
      }
    }
  }

  if(playbacks[5]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[5]<10) {
        playheads[5]++;
      } else {
        playbacks[5] = false;
        playbacks[6] = true;
      }
    }
  }

  if(playbacks[6]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[6]<10) {
        for(let i=0; i<r_101_binary[playheads[6]].length; i++) {
          let value = r_101_binary[playheads[6]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[6]++;
      } else {
        playbacks[6] = false;
        playbacks[7] = true;
      }
    }
  }

  if(playbacks[7]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[7]<10) {
        playheads[7]++;
      } else {
        playbacks[7] = false;
        playbacks[8] = true;
      }
    }
  }
  if(playbacks[8]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[8]<10) {
        for(let i=0; i<r_150_binary[playheads[8]].length; i++) {
          let value = r_150_binary[playheads[8]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[8]++;
      } else {
        playbacks[8] = false;
        playbacks[9] = true;
      }
    }
  }

  if(playbacks[9]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[9]<10) {
        playheads[9]++;
      } else {
        playbacks[9] = false;
        playbacks[10] = true;
      }
    }
  }

  if(playbacks[10]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[10]<10) {
        for(let i=0; i<r_181_binary[playheads[10]].length; i++) {
          let value = r_181_binary[playheads[10]][i];
          if(value > 0) {
            playWithADSR(i, 0.1);
          }
        }
        playheads[10]++;
      } else {
        playbacks[10] = false;
        playbacks[11] = true;
      }
    }
  }

  if(playbacks[11]) {
    if(frameCount%random([5,10,20])==0) {
      if(playheads[11]<10) {
        playheads[11]++;
      } else {
        playbacks[11] = false;
        
      }
    }
  }

  drawCA_Pair("RULE 30", "Q-GATE", r_30_binary, playheads[0], r_30_simulator, playheads[1],  50, 50, 10);
  drawCA_Pair("RULE 90", "Q-GATE", r_90_binary, playheads[2], r_90_simulator, playheads[3],  400, 50, 10);
  drawCA_Pair("RULE 101", "Q-GATE", r_101_binary, playheads[4], r_101_simulator, playheads[5],  50, 300, 10);
  drawCA_Pair("RULE 105", "Q-GATE", r_105_binary, playheads[6], r_105_simulator, playheads[7],  400, 300, 10);
  drawCA_Pair("RULE 150", "Q-GATE", r_150_binary, playheads[8], r_150_simulator, playheads[9],  50, 550, 10);
  drawCA_Pair("RULE 181", "Q-GATE", r_181_binary, playheads[10], r_181_simulator, playheads[11],  400, 550, 10);

  mShader.setUniform("uTexture",gfx);
  rect(-width / 2, -height / 2, width, height);
}

function mousePressed() {
  initAudio();
  playbacks[0] = true;
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
  gfx.noFill();
  
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
    }
  }
  
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
      gfx.rect(col * s * 2 + xpos + maxcol * s * 3, row * s * 2 + ypos, s*2,s*2);
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