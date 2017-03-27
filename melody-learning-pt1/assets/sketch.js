var agentView = false;

// world ticking
var w; // global world object
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
var pApples, pPoison = 0;

// interact
var p1, p2, myCursor;

function preload() {
  font = loadFont("assets/Lekton-Italic.ttf");
  s1 = loadSound("assets/food.wav");
  s2 = loadSound("assets/poison.wav");
}

function setup() {
	var canvas = createCanvas(window.innerWidth,window.innerHeight / 2);
	
	spec.update = 'qlearn'; // qlearn | sarsa
  spec.gamma = 0.9; // discount factor, [0, 1)
  spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.005; // value function learning rate
  spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
  spec.experience_size = 10000; // size of experience
  spec.learning_steps_per_iteration = 5;
  spec.tderror_clamp = 1.0; // for robustness
  spec.num_hidden_units = 100 // number of neurons in hidden layer

  w = new World(canvas.width,canvas.height);
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

  p1 = createVector(20,height-35);
  p2 = createVector(20,height-50);
}

function draw() {
	background(30);
  myCursor = createVector(mouseX,mouseY);
	var agents = w.agents;

	w.tick();
  updateStats();
      
  var agent = w.agents[0];

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
  	fill(255);
  	ellipse(a.op.x,a.op.y, a.rad,a.rad);
  	// sight
  	for( var j = 0; j < a.eyes.length; j++) {
  		var e = a.eyes[j];
  		var sr = e.sensed_proximity;
  		if(e.sensed_type === -1 || e.sensed_type === 0) {
  			stroke(180,60); // wall or nothing
  		}
  		if(e.sensed_type === 1) { stroke(255); } // food
  		if(e.sensed_type === 2) { stroke(255,150,150); } // poison
  		line(a.op.x,a.op.y,a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
  	}
  }

  // draw items
  for (var i=0; i< w.items.length; i++) {
  	var it = w.items[i];
  	if(it.type === 1) fill(255);
  	if(it.type === 2) fill(255,150,150);
  	noStroke();
  	ellipse(it.p.x,it.p.y,it.rad,it.rad);
  }

  // draw info
  fill(220);
  noStroke();
  textFont(font);
  textSize(12);
  text("epsilon: " + agentEps, 15,height - 10);
  text(stats[0], 110, height - 10);

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
  text("click to load pretrained agent", p1.x + 15, height - 30);

  stroke(220);
  if(p2.dist(myCursor)<10) {
    fill(255);
  } else {
    noFill();
  }
  rect(p2.x-5,p2.y-5, 10, 10);
  noStroke();
  fill(220);
  text("click to reset agent", p2.x + 15, height - 45);

  if(w.agents[0].apples!=pApples) {
    if(s1.isLoaded())s1.rate(int(random(4))+1);
    s1.play();
  }
  if(w.agents[0].poison!=pPoison) {
    if(s2.isLoaded())s2.rate(random(2)+1);
    s2.play();
  }
  pApples = w.agents[0].apples;
  pPoison = w.agents[0].poison;
}

function mousePressed() {
  if(myCursor.dist(p1)<10) {
    loadAgent();
  }
  if(myCursor.dist(p2)<10) {
    resetAgent();
  }
}

function updateStats() {
	for(var i=0; i<w.agents.length; i++) {
  	stats[i] = "Player " + (i+1) + ": " + w.agents[i].apples + " food, " + w.agents[i].poison + " poison";
  }
}

function resetAgent() {
	var brain = new RL.DQNAgent(env, spec);
  w.agents[0].brain = brain;
}

function loadAgent() {
  loadJSON( "assets/wateragent.json", function( data ) {
  	var agent = w.agents[0].brain;
    agent.fromJSON(data); // corss your fingers...
    // set epsilon to be much lower for more optimal behavior
    agent.epsilon = 0.05;
    agentEps = agent.epsilon.toFixed(2);
    // kill learning rate to not learn
    agent.alpha = 0;
  });
}

function saveAgent() {
	var brain = w.agents[0].brain;
}