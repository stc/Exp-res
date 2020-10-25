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

// sounds
var s1, s2;
var reverb1, reverb2;
var delay;
var pApples = [0,0]; 
var pPoison = [0,0];
var d1, d2;

// interact
var myCursor;
var down = false;
var agentarea = 100;

// game states
var GAME_STATE = ["intro","play","outro"];
var maxScore = 250;

function preload() {
  font = loadFont("assets/data/Lekton-Italic.ttf");
  s1 = loadSound("assets/data/food.mp3");
  s2 = loadSound("assets/data/sp.wav");
  d1 = loadSound("assets/data/d1.mp3");
  d2 = loadSound("assets/data/d2.mp3");
}

function setup() {
	var canvas = createCanvas(window.innerWidth,window.innerHeight);

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
  spec.num_hidden_units = 300 // number of neurons in hidden layer

  //ww = canvas.width * 0.8;
  ww = canvas.height * 0.6;
  wh = canvas.height * 0.6;
  w = new World(ww,wh);
  initStrings(0);
  
  colora = color(110,209,230);
  colorb = color(255,140,160);

  //s1.disconnect();
  //s2.disconnect();
  
  reverb1 = new p5.Reverb();
  reverb2 = new p5.Reverb();
  reverb1.process(s1,8,0.1);
  reverb2.process(s2,4,0.01);
  reverb1.amp(4); 
  reverb2.amp(1); 

  delay = new p5.Delay();
  delay.process(s1, .2, .2, 2300);
  delay.setType('pingPong'); // a stereo effect
  
  loadAgents();
}

function draw() {
	background(0);
  myCursor = createVector(mouseX,mouseY);
  
  if(GAME_STATE == "intro") {
    fill(colors.type);
    textFont(font);
    textAlign(CENTER);
    textSize(48);
    text("TOUCH TO START", width/2,height/3);
    textAlign(LEFT);


    
    
    push();
    translate((width-ww) / 2.0,(height-wh) / 3);
    for(var i=0; i<w.walls.length; i++) {
     var q = w.walls[i];
     stroke(180,60);
     line(q.p1.x,q.p1.y,q.p2.x,q.p2.y);
    }

    noStroke();
    fill(colors.type);
    textFont(font);
    textAlign(LEFT);
    textSize(20);
    text("TRY TO FEED >>", ww/8, wh/9);
    text("<< AVOID FEED", ww/1.8, wh/5.5);
    fill(colors.agent);
    ellipse(ww/2,wh/9.5,20,20);
    noFill();
    stroke(colors.agent);
    ellipse(ww/2,wh/6,20,20);
    pop();
  }

  if(GAME_STATE == "play") {
    var v = createVector(w.agents[0].p.x,w.agents[0].p.y);
    var mappedCursor = createVector(myCursor.x - (width-ww) / 2.0, myCursor.y - (height-wh) / 3);
    if(down) {
      if(mappedCursor.dist(v) < agentarea / 2) {
        noFill();
        stroke(255,150,150,100);
        ellipse(v.x + (width-ww) / 2.0, v.y + (height-wh) / 3, agentarea, agentarea);
        noStroke();
        fill(255,150,150,100);
        ellipse(myCursor.x,myCursor.y,100,100);
      } else {
        addItem(myCursor);
        fill(0,20);
        noStroke();
        ellipse(myCursor.x,myCursor.y,100,100);
      }
    }

	 var agents = w.agents;

	 w.tick();
    updateStats();
      
    push();
    translate((width-ww) / 2.0,(height-wh) / 3);
   
    // draw agents
    for(var i=0; i<agents.length; i++) {
      var a = agents[i];
      // body
      noStroke();
  	
      push();
      if(a.id == 0) {
        strokeWeight(1)
        fill(colors.agent);
        stroke(colors.agent);
      } else {
        fill(colors.agent);
        stroke(colors.agent)
        fill(0)
      }
      translate(a.op.x,a.op.y);
      rotate(a.heading);
      let ms = a.rad/2
      //rect(0-a.rad,0-a.rad/4,a.rad*2,a.rad/2);
      //rect(a.op.x-a.rad,a.op.y-a.rad/4,a.rad*2,a.rad/2);

      strokeCap(ROUND)
      strokeJoin(ROUND)
  
      translate(-a.rad*2,0);
      beginShape()
      vertex(ms*6,0)
      vertex(ms*6-ms,-ms)
      vertex(0, 0)
      vertex(ms*6-ms,ms)
      vertex(ms*6,0)
      endShape()
  
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
        fill(255,100);
        noStroke();
        ellipse( - 10, i * (wh/stringnum) + wh/stringnum * 2.0, 5, 5);
        ellipse( ww + 10, i * (wh/stringnum) + wh/stringnum * 2.0, 5, 5);
        stroke(255,20);
        strokeWeight(4);
      } else {
        strokeWeight(1);
      }
      line(0, i * (wh/stringnum) + wh/stringnum * 2.0, ww, i * (wh/stringnum) + wh/stringnum * 2);
    }

    // draw items
    for (var i=0; i< w.items.length; i++) {
      var it = w.items[i];
      var alpha = it.age;
      let s = it.rad/2;
      strokeWeight(4)
      if(it.type === 1) {
        stroke(255)
      }
      if(it.type === 2) {
        stroke(84,101,97,alpha); 
      }
      line(it.p.x,it.p.y,it.p.x + it.rad,it.p.y)

    }

    pop();

    // draw scores
    noStroke();
    fill(255,20);
    rect((width-ww) / 2.0 - width/4, (height-wh)/3 - 80, ww + width/2, 2);
    rect((width-ww) / 2.0, (height-wh)/3 - 50, (width-ww)/ 10.0, 10);
    fill(colors.agent);
    rect((width-ww) / 2.0, (height-wh)/3 - 50, map(w.agents[0].apples,0,maxScore,0,(width-ww)/ 10.0), 10);
    
    fill(255,20);
    noStroke();
    rect((width-ww) / 2.0 + ww - (width-ww)/ 10.0, (height-wh)/3 - 50, (width-ww)/ 10.0, 10);
    stroke(colors.agent)
    fill(0);
    rect((width-ww) / 2.0 + ww - (width-ww)/ 10.0, (height-wh)/3 - 50, map(w.agents[1].apples,0,maxScore,0,(width-ww)/ 10.0), 10);
    
    // make sound
    for(var i=0; i<w.agents.length; i++) {
      if(w.agents[i].apples!=pApples[i]) {
        if(s1.isLoaded()) {
          var p = pow( 2, ((36 - lastAppleY) / 12) -1 ); 
          var filterFreq = random(60, 5000);
          var filterRes = random(0.01, 3);
          delay.filter(filterFreq, filterRes);
          var delTime = random(.01, .1);
          delay.delayTime(delTime);
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
      fill(colors.type);
      noStroke();
      textFont(font);
      textAlign(CENTER);
      textSize(24);
      text("YOU MADE IT! NICELY PLAYED MUSIC...",width/2, height/2);
      fill(colors.agent);
      textSize(18);
      text("TOUCH TO PLAY AGAIN",width/2, height/2+height/8);
    } else {
      fill(colors.type);
      noStroke();
      textFont(font);
      textAlign(CENTER);
      textSize(24);
      text("AWWW... NEEDS MORE TUNING.. TRY AGAIN?",width/2, height/2);
      fill(colors.agent);
      textSize(18);
      text("TOUCH TO PLAY AGAIN",width/2, height/2+height/8);
    }
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
    if(!d1.isLooping()) {
      d1.loop();
    }

    if(!d2.isLooping()) {
      //d2.loop();
    }
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

function loadAgents() {
  w.agents = [];

  for(var k = 0; k < 2; k++) {
    var a = new Agent(k);
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.15;
    a.p = new Vec(random(ww),random(wh));
    w.agents.push(a);
    smooth_reward_history.push([]);
  }

  loadJSON( "assets/data/gameagent.json", function( data ) {
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