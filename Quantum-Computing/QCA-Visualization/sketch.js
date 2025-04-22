let font;
let colr = 0;
let bgCol = 255;
let gfx, mShader;

let caPairs = [];

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
  //0.0,0.0,0.8
	vec3 color = brightness > threshold ? uColor : vec3(1.0,1.0,1.0);
	gl_FragColor = vec4(color, 1.0);
}
`;

let index = 0;
let fadeColor = 0;
let canFade = false;

let unit = 10;

function preload() {
  font = loadFont("IBMPlexSans-Medium.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gfx = createGraphics(width, height);
  mShader = createShader(vert, frag);
  shader(mShader);
  
  mShader.setUniform("uColor", [0.0,0.0,0.0]);
  let margin = 80;
  caPairs = [
    new CAPair("RULE 30", "Q-GATE", r_30_binary, r_30_simulator, 50 + margin, 50 + margin, unit),
    new CAPair("RULE 90", "Q-GATE", r_90_binary, r_90_simulator, 400 + margin, 50+ margin, unit),
    new CAPair("RULE 101", "Q-GATE", r_101_binary, r_101_simulator, 50+ margin, 300+ margin, unit),
    new CAPair("RULE 105", "Q-GATE", r_105_binary, r_105_simulator, 400+ margin, 300+ margin, unit),
    new CAPair("RULE 150", "Q-GATE", r_150_binary, r_150_simulator, 50+ margin, 550+ margin, unit),
    new CAPair("RULE 181", "Q-GATE", r_181_binary, r_181_simulator, 400+ margin, 550+ margin, unit),
  ];
}

function draw() {
  background(bgCol);
  gfx.background(bgCol);

  for (let pair of caPairs) {
    pair.update();
    pair.displayCells(gfx);
  }

  if(canFade) {
    fadeColor++;
    gfx.fill(bgCol,fadeColor);
    gfx.rect(0,0,gfx.width,gfx.height*4);
  } else {

  }
  mShader.setUniform("uTexture", gfx);
  rect(-width / 2, -height / 2, width, height);

  for (let pair of caPairs) {
    push();
    translate(-width/2,-height/2);
    pair.displayLabel();
    pair.displayCorner();
    pop();
  }
}

function mousePressed() {
  initAudio();
  caPairs[index].start();
  index++;
  canFade = false;
  fadeColor = 0;
  fadeDronesIn();
  
  
}

function keyPressed() {
  if(key == "k") {
    fadeOut();
    for(ca of caPairs) {
      ca.playing = false;
      ca.next = null; // for chaining
    }
    canFade = true;
    index = 0;
  } 
  if(key == "l") {
    for(ca of caPairs) {
      ca.binaryIndex = 0;
      ca.quantumIndex = 0;
    }
  }   
}

class CAPair {
  constructor(rule, qRule, binaryData, quantumData, xpos, ypos, cellSize) {
    this.rule = rule;
    this.qRule = qRule;
    this.binary = binaryData;
    this.quantum = quantumData;
    this.x = xpos;
    this.y = ypos;
    this.s = cellSize;
    this.binaryIndex = 0;
    this.quantumIndex = 0;
    this.playing = false;
    this.next = null; // for chaining
  }

  start() {
    this.playing = true;
    changeDrones();
    changeFilterFrequency(random(500,5000))
    changeFilterQ(random(2,4))
  }

  setNext(pair) {
    this.next = pair;
  }

  update() {
    if (!this.playing) return;

    if (frameCount % random([10,10,10,5]) === 0) {
      if (this.binaryIndex < 20) {
        if(this.binaryIndex<10) {
          this.binary[this.binaryIndex].forEach((v, i) => {
          if (v > 0) playWithADSR(i, 0.5);
          });
        }
        this.binaryIndex++;
      } else if (floor(this.quantumIndex) < 10) {
        this.quantum[floor(this.quantumIndex)].forEach((v, i) => {
          //playWithADSR(i, v * 0.1);
        });
        this.quantumIndex+=0.5;
      } else {
        this.playing = false;
        if (this.next) this.next.start();
      }
    }
  }

  displayCells(g) {
    const maxCol = this.binary[0].length;
    const maxRow = this.binary.length;

    g.stroke(colr);
    g.noFill();

    for (let row = 0; row < this.binaryIndex; row++) {
      if(row<10) {
        for (let col = 0; col < maxCol; col++) {
          const val = map(this.binary[row][col], 0, 1, 0, this.s * 2);
          g.noStroke();
          g.fill(colr);
          g.rectMode(CENTER);
          g.rect(col * this.s * 2 + this.x, row * this.s * 2 + this.y, val, val);
        }
      }
    }

    if (floor(this.quantumIndex) > 0 && floor(this.quantumIndex) < 10) {
      random([0, 1]) ? playWithADSR(floor(random(6)), 0.1, { attack: 0.005, decay: 0.001, sustain: 0.005, release: 0.001, duration: 0.1 }) : g.fill(255);
    }

    for (let row = 0; row < maxRow; row++) {
      for (let col = 0; col < maxCol; col++) {
        g.noStroke();
        const val = map(this.quantum[row][col], 0.3, 1.0, 0, this.s * 2);
        const cv = map(this.quantum[row][col], 0.4, 1.0, bgCol, colr, true);

        if (floor(this.quantumIndex) > 0 && floor(this.quantumIndex) < 10) {
          random([0, 1]) ? g.fill(colr) : g.fill(bgCol);
          g.rectMode(CENTER);
          g.rect(col * this.s * 2 + this.x + maxCol * this.s * 3, row * this.s * 2 + this.y, this.s * 2, this.s * 2);
        }

        g.fill(20, map(this.quantumIndex, 0, 10, 0, 255));
        g.fill(cv, map(this.quantumIndex, 0, 10, 0, 255));
        g.rectMode(CENTER);
        g.rect(col * this.s * 2 + this.x + maxCol * this.s * 3, row * this.s * 2 + this.y, this.s * 2, this.s * 2);
      }
    }
  }
  displayLabel(){
    const maxCol = this.binary[0].length;
    noStroke();
    fill(255);
    textFont(font);
    textSize(unit);
    text(this.rule, this.x - this.s, this.y - this.s * 2);
    text(this.qRule, this.x - this.s + maxCol * this.s * 3, this.y - this.s * 2);
  }

  displayCorner(){
    const maxCol = this.binary[0].length;
    const maxRow = this.binary.length;
    noStroke();
    fill(255)
    rectMode(CENTER);
    rect(maxCol * this.s * 2 + this.x, this.y - this.s, unit, 1);
    rect(maxCol * this.s * 2 + this.x, this.y - this.s, 1, unit);
    rect(maxCol * this.s * 2 + this.x + maxCol * this.s * 3, this.y - this.s, unit, 1);
    rect(maxCol * this.s * 2 + this.x + maxCol * this.s * 3, this.y - this.s, 1, unit);
    rect(maxCol * this.s * 2 + this.x, maxRow * this.s * 2 + this.y, unit, 1);
    rect(maxCol * this.s * 2 + this.x, maxRow * this.s * 2 + this.y, 1, unit);
    rect(maxCol * this.s * 2 + this.x + maxCol * this.s * 3, maxRow * this.s * 2 + this.y, unit, 1);
    rect(maxCol * this.s * 2 + this.x + maxCol * this.s * 3, maxRow * this.s * 2 + this.y, 1, unit);
  }
}