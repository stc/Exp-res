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

// sounds
var s1, s2;
var reverb1, reverb2;
var delay;
var pApples = [0,0]; 
var pPoison = [0,0];

// interact
var myCursor;
var down = false;

// game states
var GAME_STATE = ["intro","play","outro"];
var maxScore = 150;

function preload() {
  font = loadFont("assets/Lekton-Italic.ttf");
  s1 = loadSound("assets/food.wav");
  s2 = loadSound("assets/poison.wav");
}

function setup() {
	var canvas = createCanvas(window.innerWidth,window.innerHeight / 1.1);

  GAME_STATE = "intro";
	
  console.log(GAME_STATE);
	spec.update = 'qlearn'; // qlearn | sarsa
  spec.gamma = 0.9; // discount factor, [0, 1)
  spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.005; // value function learning rate
  spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
  spec.experience_size = 10000; // size of experience
  spec.learning_steps_per_iteration = 5;
  spec.tderror_clamp = 1.0; // for robustness
  spec.num_hidden_units = 100 // number of neurons in hidden layer

  //ww = canvas.width * 0.8;
  ww = canvas.height * 0.6;
  wh = canvas.height * 0.6;
  w = new World(ww,wh);
  
  colora = color(110,209,230);
  colorb = color(255,140,160);

  //s1.disconnect();
  //s2.disconnect();
  
  reverb1 = new p5.Reverb();
  reverb2 = new p5.Reverb();
  reverb1.process(s1,1,2);
  reverb2.process(s2,1,2);
  reverb1.amp(4); 
  reverb2.amp(4); 

  //delay = new p5.Delay();
  //delay.process(s1, .4, .7, 4300);
  //delay.setType('pingPong'); // a stereo effect
  
  loadAgents();
}

function draw() {
	background(0,114,138);
  myCursor = createVector(mouseX,mouseY);
  
  if(GAME_STATE == "intro") {
    fill(255,180);
    textFont(font);
    textSize(48);
    textAlign(CENTER);
    text("CLICK TO START", width/2,height/3);
    textAlign(LEFT);
  }

  if(GAME_STATE == "play") {
    if(down) {
      addItem(myCursor);
      fill(255,20);
      noStroke();
      ellipse(myCursor.x,myCursor.y,100,100);
    }

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
  	
      push();
      if(a.id == 0) {
        fill(colora);
      } else {
        fill(colorb);
      }
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
      var alpha = it.age;
      if(it.type === 1) stroke(255, 255);
      if(it.type === 2) stroke(0, alpha);
      strokeWeight(4);
      line(it.p.x,it.p.y,it.p.x+it.rad,it.p.y);
    }

    pop();

    // draw info
    noStroke();
    textFont(font);
    textSize(34);
    for(var i=0; i<w.agents.length; i++) {
      if(i==0) {
        fill(colora);
      } else {
        fill(colorb);
      }
      text(stats[i], (width-ww) / 2.0 + i * 250, (height-wh) / 3 - 5);
    }
  
    // make sound
    for(var i=0; i<w.agents.length; i++) {
      if(w.agents[i].apples!=pApples[i]) {
        if(s1.isLoaded()) {
          var p = pow( 2, (lastAppleY / 12) -1 ); 
          //var filterFreq = random(60, 5000);
          //var filterRes = random(0.01, 3);
          //delay.filter(filterFreq, filterRes);
          //var delTime = random(.01, .1);
          //delay.delayTime(delTime);

          s1.setVolume(random(0.4)+0.6);
          s1.rate(p);
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
  if(GAME_STATE == "outro") {
    textFont(font);
    textSize(48);
    
    if(winnerID == 0) {
      fill(colora);
    } else {
      fill(colorb);
    }
    ellipse(width/2 - 50,height/4-20,48,48);
    fill(255,180);
    textAlign(LEFT);
    text("WON!", width/2, height/4);
    textAlign(CENTER);
    text("CLICK TO START", width/2,height/3);
    textAlign(LEFT);
  }

  // check scores
  for(var i=0; i<w.agents.length; i++) {
    if(w.agents[i].apples >= maxScore) {
      winnerID = i;
      loadAgents();
      w.items = [];
      GAME_STATE = "outro";
    }
  }
}

function mousePressed() {
  down = true;
  if(GAME_STATE == "intro" || GAME_STATE == "outro") {
    GAME_STATE = "play";
  }
}

function mouseReleased() {
  down = false;
}

function updateStats() {
	for(var i=0; i<w.agents.length; i++) {
  	stats[i] = "+: " + w.agents[i].apples + " -: " + w.agents[i].poison;
  }
}

function addItem(p) {
  var newitx = p.x - (width-ww) / 2.0;
  var newity = p.y - (height-wh) / 3.0;//tmpy * this.H/stringnum + this.H / stringnum * 2;//randf(20, this.H-20);
  var index = floor(newity/wh*stringnum) - 2;
  var newitt = 1; // food or poison (1 and 2)
  if(activestrings[index]==1) {
    var newit = new Item(newitx, index * wh/stringnum + wh / stringnum * 2, newitt, index);
    w.items.push(newit);
  }
}

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
  loadAgents();
}

function removeAgent() {
  if(w.agents.length>0) {
    w.agents.pop();
  }
}

function loadAgents() {
  w.agents = [];

  for(var k = 0; k < 2; k++) {
    var a = new Agent(k);
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.15;
    w.agents.push(a);
    smooth_reward_history.push([]);
  }

  loadJSON( "assets/gameagent.json", function( data ) {
    for(var i=0; i<w.agents.length; i++) {
      var agent = w.agents[i].brain;
      agent.fromJSON(data); // corss your fingers...
      // set epsilon to be much lower for more optimal behavior
      agent.epsilon = 0.05;
      // kill learning rate to not learn
      agent.alpha = 0;
    }
  });
}

function saveAgent() {
	var brain = w.agents[0].brain;
  // write out to json here
}