function initStrings(scaleSelect) {
  activestrings = [];

  let scales = [
                [1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0],
                [1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0],
                [1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0],
                [1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0]
  ]

  for(let i=0; i<scales[scaleSelect].length; i++) {
    activestrings.push(scales[scaleSelect][i]);
  }
}

const colors = {
  bg: [0, 8, 10],
  wires: [255,20],
  agent: [218, 90, 51],
  positive_food: [255, 255, 255],
  negative_food: [46, 42, 21],
  type: [64, 80, 85, 220],
  type_contrast: [164,180,185,220],
  touch: [255, 150, 150, 100]
}

// Tonejs components

let r1 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.06
}).toDestination();

let r2 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.01
}).toDestination();

const drone = new Tone.Player("assets/data/drone-bg-constant-bit.mp3").toDestination();
drone.loop = true;
drone.autostart = true;
drone.fadeOut = 1;

var feedbackDelay1 = new Tone.FeedbackDelay(0.2, 0.8).connect(r1);
let fm1 = new Tone.FMSynth({
  "harmonicity": 8,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.01,
    "decay": 0.02,
    "sustain": 0.05,
    "release": 0.8
  },
  "modulation": {
    "type": "sine"
  },
  "modulationEnvelope": {
    "attack": 0.001,
    "decay": 0.02,
    "sustain": 0.03,
    "release": 0.6
  },

}).toDestination();
fm1.connect(feedbackDelay1);
fm1.volume.value = -8;

var feedbackDelay2 = new Tone.FeedbackDelay(0.2, 0.8).connect(r2);
let fm2 = new Tone.FMSynth({
  "harmonicity": 8,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.1,
    "decay": 0.2,
    "sustain": 0.3,
    "release": 0.4
  },
  "modulation": {
    "type": "square"
  },
  "modulationEnvelope": {
    "attack": 0.01,
    "decay": 0.1,
    "sustain": 0.2,
    "release": 0.4
  },

}).toDestination();
fm2.connect(feedbackDelay2);
fm2.volume.value = -20;

let poisonSynth = new Tone.MembraneSynth().toDestination();
poisonSynth.volume.value = -28;


// app utilities
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

function generatePoisons() {
  let sel = floor(random(4));
  if(sel == 0) {
    for(let i=0; i<stringnum; i++) {
      let p = width/2;
      var nx = p - (width - ww) / 2.0;
      var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
      newit.v = new Vec(0, 0);
      w.items.push(newit);    
    }
  } else if(sel == 1) {
    for(let i=0; i<stringnum; i++) {
      let p = width/2 + sin(i*0.1) * ww/2.5;
      var nx = p - (width - ww) / 2.0;
      var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
      newit.v = new Vec(0, 0);
      w.items.push(newit); 
    }   
  } else if(sel == 2){
    for(let i=0; i<stringnum; i++) {
      let p = width/2 + sin(i*0.1) * ww/4;
      var nx = p - (width - ww) / 2.0;
      var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
      newit.v = new Vec(0, 0);
      w.items.push(newit);   
    } 
    for(let i=0; i<stringnum; i++) {
      let p = width/2 + cos(i*0.1) * ww/4;
      var nx = p - (width - ww) / 2.0;
      var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
      newit.v = new Vec(0, 0);
      w.items.push(newit);   
    } 
  } else {
      // add no items
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
      a.p = new Vec(0, wh/2);
      t1.setPerception(a.eyes[0].max_range);
      t1.setReflex(a.speed);
    } else {
      a.p = new Vec(ww,wh/2);
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