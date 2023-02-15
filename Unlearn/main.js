/*

Unlearn
Agoston Nagy
2023


*/

let directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 0.5], [1, -0.5], [-1, 0.5], [-1, -0.5]];
let magnitude;

let initPos;
let positions = [];
let jumps = [];
let margin;

// GUI
let controller = function () {
  this.layer_1 = true;
  this.layer_2 = true;
  this.generate = function(){};
  this.length = 20;
  this.save = function(){};
}
let panel = new controller();

function setup() {
  createCanvas(800, 800, SVG);
  let gui = new dat.GUI();
  gui.add(panel, 'layer_1').onChange(function(){ drawFrame()});
  gui.add(panel, 'layer_2').onChange(function(){ drawFrame()});
  gui.add(panel,'generate').onChange(function() { generate(); drawFrame(); });
  gui.add(panel,'save').onChange(function() { save("unlearn.svg")});
  let ns = gui.add(panel, 'length', 1, 100).onChange(function (value) {
    // call func here
  });
  
  magnitude = width / 200;
  margin = width / 10;
  generate();
}

function draw() {
  clear();
  drawFrame();
  noLoop();
}

const drawFrame = () => {
  clear();
  for (let i = 0; i < positions.length; i++) {
    if (i > 0) {
      if (jumps[i - 1]) {
        if(panel.layer_1) {
          stroke(255, 0, 0);
          line(positions[i - 1].x, positions[i - 1].y, positions[i].x, positions[i].y);
        }
      } else {
        if(panel.layer_2) {
          stroke(0);
          line(positions[i - 1].x, positions[i - 1].y, positions[i].x, positions[i].y);
        }
      }
    }
  }
}

const generate = () => {
  positions = [];
  jumps = [];
  initPos = createVector(width / 2, height / 2);
  positions.push(createVector(initPos.x, initPos.y));
  
  for (let i = 0; i < 5000; i++) {
    let dir = [];
    let mg = magnitude * 1//random([1,2,4]);
    let jmp = false;

    if (i % 100 == 0) {
      mg += random([width / 12, width / 6, width / 3]);
      let rnd = random([2, 3, 4, 5, 6, 7]);
      dir = directions[rnd];
      jmp = true;
    } else {
      let rnd = random([4, 5, 6, 7]);
      dir = directions[rnd];
    }
    let nx = positions[positions.length - 1].x + dir[0] * mg;
    let ny = positions[positions.length - 1].y + dir[1] * mg;
    if (nx > margin && nx < width - margin && ny > margin && ny < height - margin) {
      let next = createVector(nx, ny);
      positions.push(next);
      jumps.push(jmp);
    }
  }
}