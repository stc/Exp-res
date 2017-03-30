var agentView = false;

// world ticking
var w; // global world object
var ww, wh;
var smooth_reward_history = []; // [][];
var smooth_reward = [];

// agent parameters for finetuning
var spec = {};

// display info-text
var font;
var agentEps = "";
var stats = {};

// sounds
var s1, s2;
var reverb;
var pApples = [0,0,0]; 
var pPoison = [0,0,0];

// interact
var p1, p2, p3, p4, myCursor;

function preload() {
  font = loadFont("assets/Lekton-Italic.ttf");
  s1 = loadSound("assets/food.wav");
  s2 = loadSound("assets/poison.wav");
}

function setup() {
	var canvas = createCanvas(window.innerWidth,window.innerHeight / 1.5);
	
	spec.update = 'qlearn'; // qlearn | sarsa
  spec.gamma = 0.9; // discount factor, [0, 1)
  spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.005; // value function learning rate
  spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
  spec.experience_size = 10000; // size of experience
  spec.learning_steps_per_iteration = 5;
  spec.tderror_clamp = 1.0; // for robustness
  spec.num_hidden_units = 100 // number of neurons in hidden layer

  ww = canvas.width * 0.8;
  wh = canvas.height * 0.6;
  w = new World(ww,wh);
  w.agents = [];
  for(var k = 0; k < 1; k++) {
  	var a = new Agent();
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.15;
    agentEps = a.epsilon.toFixed(2);
    w.agents.push(a);
    smooth_reward_history.push([]);
  }

  reverb = new p5.Reverb();
  reverb.process(s1,3,2);

  p1 = createVector((width-ww) / 2.0,height-100);
  p2 = createVector((width-ww) / 2.0,height-80);
  p3 = createVector((width-ww) / 2.0,height-60);
  p4 = createVector((width-ww) / 2.0,height-40);
}

function draw() {
	background(0,114,138);
  myCursor = createVector(mouseX,mouseY);
	var agents = w.agents;

	w.tick();
  updateStats();
      
  push();
  translate((width-ww) / 2.0,(height-wh) / 3);
  // draw walls
  for(var i=0; i<w.walls.length; i++) {
  	var q = w.walls[i];
  	stroke(180);
  	//line(q.p1.x,q.p1.y,q.p2.x,q.p2.y);
  }

  // draw agents
  for(var i=0; i<agents.length; i++) {
  	var a = agents[i];
  	// body
  	noStroke();
  	fill(110,209,230);
  	//ellipse(a.op.x,a.op.y, a.rad,a.rad);
    push();
    translate(a.op.x,a.op.y);
    rotate(a.heading);
    rect(0-a.rad,0-a.rad/4,a.rad*2,a.rad/2);
    //rect(a.op.x-a.rad,a.op.y-a.rad/4,a.rad*2,a.rad/2);
    pop();
  	// sight
  	for( var j = 0; j < a.eyes.length; j++) {
  		var e = a.eyes[j];
  		var sr = e.sensed_proximity;
  		if(e.sensed_type === -1 || e.sensed_type === 0) {
  			stroke(180,30); // wall or nothing
  		}
  		if(e.sensed_type === 1) { stroke(255, 50); } // food
  		if(e.sensed_type === 2) { stroke(0,50); } // poison
  		line(a.op.x,a.op.y,a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
  	}
  }

  // draw strings
  for(var i=0; i< stringnum; i++) {
    
    if(activestrings[i]==1) {
      fill(255);
      noStroke();
      ellipse( - 10, i * (wh/stringnum) + wh/stringnum * 2.0, 5, 5);
      ellipse( ww + 10, i * (wh/stringnum) + wh/stringnum * 2.0, 5, 5);
      stroke(255,30);
      strokeWeight(4);
    } else {
      strokeWeight(1);
      stroke(255,30);
    }
    line(0, i * (wh/stringnum) + wh/stringnum * 2.0, ww, i * (wh/stringnum) + wh/stringnum * 2);
  }

  // draw items
  for (var i=0; i< w.items.length; i++) {
  	var it = w.items[i];
    //var d = map(dist(it.p.x,it.p.y,width/2,it.p.y),0,width/2,255,0);
  	var alpha = it.age;
    if(it.type === 1) stroke(255, alpha);
  	if(it.type === 2) stroke(0, alpha);
  	//noStroke();
  	//ellipse(it.p.x,it.p.y,it.rad,it.rad);
    //rect(it.p.x-it.rad,it.p.y-it.rad/4,it.rad*2,it.rad/2);
    strokeWeight(4);
    line(it.p.x,it.p.y,it.p.x+it.rad,it.p.y);
  }

  pop();

  // draw info
  fill(220);
  noStroke();
  textFont(font);
  textSize(12);
  //text("epsilon: " + agentEps, 15,height - 10);
  for(var i=0; i<w.agents.length; i++) {
    text(stats[i], (width-ww) / 2.0 + i * 250, (height-wh) / 3 - 5);
  }
  // interact
  stroke(220);
  if(p1.dist(myCursor)<10) {
    fill(255);
  } else {
    noFill();
  }
  rect(p1.x-5,p1.y-5, 10, 10);
  noStroke();
  fill(220);
  text("click to change to pretrained agents", p1.x + 15, p1.y + 3);

  stroke(220);
  if(p2.dist(myCursor)<10) {
    fill(255);
  } else {
    noFill();
  }
  rect(p2.x-5,p2.y-5, 10, 10);
  noStroke();
  fill(220);
  text("click to reset agents", p2.x + 15, p2.y + 3);

  stroke(220);
  if(p3.dist(myCursor)<10) {
    fill(255);
  } else {
    noFill();
  }
  rect(p3.x-5,p3.y-5, 10, 10);
  noStroke();
  fill(220);
  text("click add an agent", p3.x + 15, p3.y + 3);

  stroke(220);
  if(p4.dist(myCursor)<10) {
    fill(255);
  } else {
    noFill();
  }
  rect(p4.x-5,p4.y-5, 10, 10);
  noStroke();
  fill(220);
  text("click to remove an agent", p4.x + 15, p4.y + 3);

  for(var i=0; i<w.agents.length; i++) {
    if(w.agents[i].apples!=pApples[i]) {
      if(s1.isLoaded()) {
        s1.rate((1-lastAppleY) * 4);
      }
      s1.play();
    }
    if(w.agents[i].poison!=pPoison[i]) {
      if(s2.isLoaded())s2.rate(random(2)+1);
      s2.play();
    }
    pApples[i] = w.agents[i].apples;
    pPoison[i] = w.agents[i].poison;
  }
}

function mousePressed() {
  if(myCursor.dist(p1)<10) {
    loadAgents();
  }
  if(myCursor.dist(p2)<10) {
    resetAgents();
  }
  if(myCursor.dist(p3)<10) {
    addAgent();
  }
  if(myCursor.dist(p4)<10) {
    removeAgent();
  }
}

function updateStats() {
	for(var i=0; i<w.agents.length; i++) {
  	stats[i] = "Player " + (i+1) + ": " + w.agents[i].apples + " food, " + w.agents[i].poison + " poison";
  }
}
/*
function resetAgent() {
	var brain = new RL.DQNAgent(env, spec);
  w.agents[0].brain = brain;
}
*/
function resetAgents() {
  var brain = new RL.DQNAgent(env, spec);
  for(var i=0; i<w.agents.length; i++) {
    w.agents[i].brain = brain;
  }
}

function addAgent() {
  if(w.agents.length<3) {
    var a = new Agent();
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.15;
    agentEps = a.epsilon.toFixed(2);
    w.agents.push(a);
    smooth_reward_history.push([]);
  }
}

function removeAgent() {
  if(w.agents.length>0) {
    w.agents.pop();
  }
}
/*
function loadAgent() {
  loadJSON( "assets/stringagent.json", function( data ) {
  	var agent = w.agents[0].brain;
    agent.fromJSON(data); // corss your fingers...
    // set epsilon to be much lower for more optimal behavior
    agent.epsilon = 0.05;
    agentEps = agent.epsilon.toFixed(2);
    // kill learning rate to not learn
    agent.alpha = 0;
  });
}
*/

function loadAgents() {
  loadJSON( "assets/stringagent.json", function( data ) {
    for(var i=0; i<w.agents.length; i++) {
      var agent = w.agents[i].brain;
      agent.fromJSON(data); // corss your fingers...
      // set epsilon to be much lower for more optimal behavior
      agent.epsilon = 0.05;
      agentEps = agent.epsilon.toFixed(2);
      // kill learning rate to not learn
      agent.alpha = 0;
    }
  });
}

function saveAgent() {
	var brain = w.agents[0].brain;
}