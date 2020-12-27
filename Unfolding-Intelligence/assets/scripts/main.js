// world ticking
var w; // global world object
var ww, wh;
var smooth_reward_history = []; // [][];
var smooth_reward = [];

// agent parameters for finetuning
var spec = {};

// display 
var font;
var stats = {};
var colora, colorb;

var activestrings = [];

var pApples = [0, 0];
var pPoison = [0, 0];

// interact
var myCursor;
var down = false;
//var agentarea = 100;
let t1, t2;

// game states
var GAME_STATE = ["intro", "play", "outro"];
var maxScore = 30;

var trace0 = { x: 0, y: 0 };
var trace1 = { x: 0, y: 0 };
var ptrace0 = { x: 0, y: 0 };
var ptrace1 = { x: 0, y: 0 };
var gfx1, gfx2;

var canLoop;

let gfxAlpha = 0;
let pSec = 0;

function preload() {
  font = loadFont("assets/data/Lekton-Italic.ttf");
  myCursor = createVector(0,0);
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  
  spec.update = 'qlearn'; // qlearn | sarsa
  spec.gamma = 0.9; // discount factor, [0, 1)
  spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.0001; // value function learning rate
  spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
  spec.experience_size = 10000; // size of experience
  spec.learning_steps_per_iteration = 5;
  spec.tderror_clamp = 0.5; // for robustness
  spec.num_hidden_units = 300 // number of neurons in hidden layer

  //ww = canvas.width * 0.8;
  ww = canvas.height * 0.7;
  wh = canvas.height * 0.7;
  w = new World(ww, wh);
  initStrings(3);

  t1 = new Triangulum(width/2 - ww/2 - 200, height/3, 100, 0);
  t2 = new Triangulum(width/2 + ww/2 + 200, height/3, 100, 1);

  colora = color(110, 209, 230);
  colorb = color(255, 140, 160);
  loadAgents();

  gfx1 = createGraphics(ww / 4, wh / 4);
  gfx2 = createGraphics(ww / 4, wh / 4);

  gfx1.background(colors.bg);
  gfx2.background(colors.bg);

  if (!canLoop) {
    noLoop();
  }
}

function draw() {
  background(colors.bg);
  frameRate(60);

  if (GAME_STATE == "intro") {
    noStroke();

    textFont(font);
    textAlign(CENTER);
    textSize(48);
    fill(colors.agent);
    text("TOUCH TO START", width / 2, height / 3);

    fill(colors.type);
    textSize(26);
    text("VISIT ON DESKTOP FOR FULL EXPERIENCE", width / 2, height / 2 - 50);
    text("TURN ON AUDIO", width / 2, height / 2 + 50);


    textAlign(LEFT);

    stroke(255, 100);
    line(width / 4, height / 2, width / 2 + width / 4, height / 2)

    push();
    translate((width - ww) / 2.0, (height - wh) / 3);

    noStroke();
    fill(colors.type);
    textFont(font);
    textAlign(CENTER);
    textSize(20);
    text("Feed the agents & listen to their Songlines", ww/2, wh/2.5);
    fill(colors.agent);
    ellipse(ww / 2, wh / 9.5, 20, 20);
    noFill();
    stroke(colors.agent);
    ellipse(ww / 2, wh / 6, 20, 20);
    pop();
  }

  if (GAME_STATE == "play") {
    noStroke();
    fill(255,30);
    rect(t1.xp,0,1,height/2);
    rect(t2.xp,0,1,height/2);
    // draw triangulums
    t1.draw();
    t2.draw();

    var mappedCursor = createVector(myCursor.x - (width - ww) / 2.0, myCursor.y - (height - wh) / 4);
    if (down) {
      if(dist(mouseX,mouseY,pmouseX,pmouseY)>2) {
        addItem(myCursor);
      }
      
      fill(255, 20);
      noStroke();
      ellipse(myCursor.x, myCursor.y, 100, 100);
    }

    if(second()!=pSec) {
      if(second()%2==0) {
        let v = createVector(random(width), random(height));
        addItem(v);
      }
    }
    pSec = second();

    var agents = w.agents;

    w.tick();

    push();
    translate((width - ww) / 2.0, wh/20);

    // draw agents
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      // body
      noStroke();

      push();
      if (a.id == 0) {
        strokeWeight(1)
        fill(colors.agent);
        stroke(colors.agent);
      } else {
        fill(colors.agent);
        stroke(colors.agent)
        fill(colors.bg)
      }
      translate(a.op.x, a.op.y);
      if (i == 0) {
        trace0.x = a.op.x;
        trace0.y = a.op.y;
      }
      if (i == 1) {
        trace1.x = a.op.x;
        trace1.y = a.op.y;
      }
      rotate(a.heading);
      let ms = a.rad / 2
      
      strokeCap(ROUND)
      strokeJoin(ROUND)

      translate(-a.rad * 2, 0);
      beginShape()
      vertex(ms * 6, 0)
      vertex(ms * 6 - ms, -ms)
      vertex(0, 0)
      vertex(ms * 6 - ms, ms)
      vertex(ms * 6, 0)
      endShape()

      pop();
      
      // sight
      for (var j = 0; j < a.eyes.length; j++) {
        var e = a.eyes[j];
        var sr = e.sensed_proximity;
        if (e.sensed_type === -1 || e.sensed_type === 0) {
          strokeWeight(1);
          stroke(180, 30); // wall or nothing
          line(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
        }
        if (e.sensed_type === 1) { // food
          stroke(255, 100);
          linedash(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle), 3, "-");
        }
        if (e.sensed_type === 2) { // poison
          stroke(255, 50);
          line(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
        }
      }
    }

    // draw strings
    for (var i = 0; i < stringnum; i++) {
      if (activestrings[i] == 1) {
        fill(255, 100);
        noStroke();
        ellipse(-10, i * (wh / stringnum) + wh / stringnum * 2.0, 5, 5);
        ellipse(ww + 10, i * (wh / stringnum) + wh / stringnum * 2.0, 5, 5);
        stroke(255, 20);
        strokeWeight(4);
      } else {
        strokeWeight(1);
      }
      line(0, i * (wh / stringnum) + wh / stringnum * 2.0, ww, i * (wh / stringnum) + wh / stringnum * 2);
    }

    // draw items (food)
    for (var i = 0; i < w.items.length; i++) {
      var it = w.items[i];
      var coloralpha = it.age;
      let s = it.rad / 2;
      strokeWeight(4)
      if (it.type === 1) {
        stroke(255)
      }
      if (it.type === 2) {
        stroke(84, 101, 97, coloralpha);
      }
      line(it.p.x, it.p.y, it.p.x + it.rad, it.p.y)

    }

    pop();

    // make sound
    for (var i = 0; i < w.agents.length; i++) {
      if (w.agents[i].apples != pApples[i]) {
        //var p = pow( 2, ((36 - lastAppleY) / 12) -1 ); // used to trigger sample with relative pitch
        if (i == 0) { // first agent
          feedbackDelay1.set({
            delayTime: random(0.01),
            feedback: random(0.7, 0.99)
          });
          fm1.triggerAttackRelease(Tone.Midi(36 - lastAppleY + 50).toFrequency(), "128n");
        } else if (i == 1) { // second agent
          feedbackDelay2.set({
            delayTime: random(0.3),
            feedback: random(0.7, 0.99)
          });
          fm2.triggerAttackRelease(Tone.Midi(36 - lastAppleY + 48).toFrequency(), "128n");
        }

        let pitches = [0.6, 0.8, 1, 1.2];
        let rnd = floor(random(4));
        drone.set({
          playbackRate: pitches[rnd]
        });
      }
      if (w.agents[i].poison != pPoison[i]) {
        let rnd = floor(random(3));
        if (rnd == 0) {
          poisonSynth.triggerAttackRelease("C8", "8n");
        }
        if (rnd == 1) {
          poisonSynth.triggerAttackRelease("C9", "8n");
        }
        if (rnd == 2) {
          poisonSynth.triggerAttackRelease("C7", "8n");
        }
      }
      pApples[i] = w.agents[i].apples;
      pPoison[i] = w.agents[i].poison;
    }

    // draw songlines
    tint(255);
    gfx1.strokeWeight(2);
    gfx1.stroke(30, 38, 40);
    gfx1.noFill();
    gfx1.rect(1, 1, gfx1.width - 2, gfx1.height - 2);
    gfx1.strokeWeight(2);
    gfx1.stroke(255, 20);
    gfx1.line(ptrace0.x / 4, ptrace0.y / 4, trace0.x / 4, trace0.y / 4);
    image(gfx1, t1.xp - gfx1.width/2, t1.yp + gfx1.height/1.5);

    gfx2.strokeWeight(2);
    gfx2.stroke(30, 38, 40);
    gfx2.noFill();
    gfx2.rect(1, 1, gfx2.width - 2, gfx2.height - 2);
    gfx2.strokeWeight(2);
    gfx2.stroke(218, 90, 51, 20);
    gfx2.line(ptrace1.x / 4, ptrace1.y / 4, trace1.x / 4, trace1.y / 4);
    image(gfx2, t2.xp - gfx2.width/2, t2.yp + gfx2.height/1.5);

    ptrace0.x = trace0.x;
    ptrace0.y = trace0.y;
    ptrace1.x = trace1.x;
    ptrace1.y = trace1.y;

    gfxAlpha = 0;
  }

  if (GAME_STATE == "outro") {
    textFont(font);
    textSize(48);

    if (winnerID == 0) {
      fill(colors.type);
      noStroke();
      textFont(font);
      textAlign(CENTER);
      textSize(24);
      text("Great lines, true dreaming track choreography!", width / 2, height / 4);
      fill(colors.agent);
      textSize(18);
      text("TOUCH TO PLAY AGAIN", width / 2, height / 4 + 30);
    } else {
      fill(colors.type);
      noStroke();
      textFont(font);
      textAlign(CENTER);
      textSize(24);
      text("Nice songs, well crafted memory landmarks!", width / 2, height / 4);
      fill(colors.agent);
      textSize(18);
      text("TOUCH TO PLAY AGAIN", width / 2, height / 4 + 30);
    }
    tint(255,gfxAlpha);
    image(gfx1, width/2 - gfx1.width*2, t1.yp, gfx1.width*2,gfx1.height*2);
    image(gfx2, width/2, t2.yp, gfx2.width*2,gfx2.height*2);
    if(gfxAlpha<255) {
      gfxAlpha++;
    }
  }

  // check scores
  for (var i = 0; i < w.agents.length; i++) {
    if (w.agents[i].apples >= maxScore) {
      winnerID = i;
      loadAgents();
      w.items = [];
      GAME_STATE = "outro";
      fm1.triggerAttackRelease(Tone.Midi(79).toFrequency(), "128n");
      fm2.triggerAttackRelease(Tone.Midi(67).toFrequency(), "128n");
      //gameOverSynth.triggerAttackRelease("C8","8n");
      drone.stop();
    }
  }

  if (!canLoop) {
    console.log("saving canvas");
    saveCanvas(canvas, 'myCanvas', 'png');
  }
}

// URL Params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('frame')) {
  GAME_STATE = "play"
  canLoop = false;
} else {
  GAME_STATE = "intro"
  canLoop = true;
}

let firsttime = true;

function mousePressed() {
  down = true;
  myCursor = createVector(mouseX, mouseY);
  if (firsttime) {
    Tone.context.resume();
    firsttime = false;
  }

  if (GAME_STATE == "intro") {
    drone.autostart = true;
    GAME_STATE = "play";
  }
  if (GAME_STATE == "outro") {
    gfx1.background(colors.bg);
    gfx2.background(colors.bg);
    pApples = [0, 0];
    pPoison = [0, 0];
    loadAgents();
    initStrings(floor(random(4)));
    GAME_STATE = "play";
    drone.start();
  }

  if(GAME_STATE == "play") {
    if (typeof(t1) != "undefined") {
      t1.press();
    }
    if (typeof(t2) != "undefined") {
      t2.press();
    }
  }

  return false;
}

function mouseReleased() {
  myCursor = createVector(mouseX, mouseY);
  down = false;

  if(GAME_STATE == "play") {
    t1.release();
    t2.release();
  }
}

function keyPressed() {
  //gameOverSynth.triggerAttackRelease("C8", "32n");
}

function touchMoved() {
  myCursor.x = mouseX;
  myCursor.y = mouseY;
  return false;
}

function mouseMoved() {
  myCursor.x = mouseX;
  myCursor.y = mouseY;
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

function addItem(p) {
  var newitx = p.x - (width - ww) / 2.0;
  var newity = p.y - (height - wh) / 3.0;
  var index = floor(newity / wh * stringnum + 1);
  var newitt = 1; // food or poison (1 and 2)
  if (activestrings[index] == 1) {
    var newit = new Item(newitx, index * wh / stringnum + wh / stringnum * 2, newitt, index);
    w.items.push(newit);

  }
}

function resetAgents() {
  var brain = new RL.DQNAgent(env, spec);
  for (var i = 0; i < w.agents.length; i++) {
    w.agents[i].brain = brain;
  }
}

function loadAgents() {
  w.agents = [];

  for (var k = 0; k < 2; k++) {
    var a = new Agent(k);
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.0002;
    if(k==0) {
      a.p = new Vec(0, wh);
      t1.setPerception(a.eyes[0].max_range);
      t1.setReflex(a.speed);
    } else {
      a.p = new Vec(ww,wh);
      ptrace0.x = 0;
      ptrace1.x = ww;
      t2.setPerception(a.eyes[0].max_range);
      t2.setReflex(a.speed);
    }
    w.agents.push(a);
    
    smooth_reward_history = []; // [][];
    smooth_reward = [];
    smooth_reward_history.push([]);
  }

  loadJSON("assets/data/agent_trained.json", function(data) {
    for (var i = 0; i < w.agents.length; i++) {
      var agent = w.agents[i].brain;
      agent.fromJSON(data); 
    }
  });
}

function saveAgent() {
  var brain = w.agents[0].brain;
  // write out agent state to json here
  //let s = JSON.stringify(brain);
  //download(s, 'agent-state.json', 'text/plain');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

function linedash(x1, y1, x2, y2, delta, style = '-') {
  // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
  let distance = dist(x1, y1, x2, y2);
  let dashNumber = distance / delta;
  let xDelta = (x2 - x1) / dashNumber;
  let yDelta = (y2 - y1) / dashNumber;

  for (let i = 0; i < dashNumber; i += 2) {
    let xi1 = i * xDelta + x1;
    let yi1 = i * yDelta + y1;
    let xi2 = (i + 1) * xDelta + x1;
    let yi2 = (i + 1) * yDelta + y1;

    if (style == '-') { line(xi1, yi1, xi2, yi2); } else if (style == '.') { point(xi1, yi1); } else if (style == 'o') { ellipse(xi1, yi1, delta / 2); }
  }
}