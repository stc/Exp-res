//const { listenerCount } = require("events");

const socket = io({
  transports: ["websocket"]
});

let serialIn = "";

let lines = [];

socket.on("serialIn", (data) => {
  serialIn = data;
  if(poll) {
    pollGCODE();
  }
});

let sketch = (p) => {
  let g;
  let lines = [];
  let linesScreen = [];
  
  p.preload = () => {
    recordCanvas(400,800,100,200);
    
  };


  p.setup = () => {
    p.createCanvas(400,800);
    addScreenPositionFunction(p);
    for(let i=0;i<10;i++) {
      lines.push(p.createVector(0,0));
      linesScreen.push(p.createVector(0,0));
    }
  
  p.draw = () => {
    p.background(200); 
    p.stroke(0);
    p.noFill();

    beginRecord();
    
    for(let i=0;i<10;i++) {
      p.stroke(0);
      p.push();
      p.rotate(i/50);
      p.translate(i*30,p.height/2);
      
      p.rect(lines[i].x,lines[i].y,5,50);
      linesScreen[i] = p.screenPosition(lines[i]);
      p.pop();
    }
    
    for(let i=0;i<10;i++) {
      p.stroke(255,0,0);
      p.ellipse(linesScreen[i].x,linesScreen[i].y,10,10);
    }
    /*
    // draw shapes here
    p.line(0,0,p.width,p.height);
    p.line(p.width,0,0,p.height);
    
    p.line(0,0,p.width,0);
    p.line(p.width,0,p.width,p.height);
    p.line(p.width,p.height,0,p.height);
    p.line(0,p.height,0,0);
    */
    endRecord();
  }

  p.keyPressed = function() {
      if(p.key==' ') {
        sendHELP();
      } else if(p.key=='h') {
        sendHOME();
      } else if(p.keyCode === p.LEFT_ARROW) {
        sendMOVEDIR(0);
      } else if(p.keyCode === p.UP_ARROW) {
        sendMOVEDIR(1);
      } else if(p.keyCode === p.RIGHT_ARROW) {
        sendMOVEDIR(2);
      } else if(p.keyCode === p.DOWN_ARROW) {
        sendMOVEDIR(3);
      } else if(p.key == 'd') {
        downloadGCode("output.gcode",gcode);
      } else if(p.key == 'p') {
        sendGCODE(gcode);
      } else if(p.key == 'a') {
        sendPENUP();
      } else if(p.key == 's') {
        sendPENDOWN();
      } else if(p.key == 'u') {
        sendUNLOCK();
      } else if(p.key == 'l') {
        sendLOCK();
      }
  }
}};



function downloadGCode(filename, content) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

new p5(sketch);
