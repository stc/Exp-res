const socket = io({
  transports: ["websocket"]
});

let serialIn = "";

socket.on("serialIn", (data) => {
  serialIn = data;
  if(poll) {
    pollGCODE();
  }
});

const sketch = (p) => {
  p.preload = () => {
    recordCanvas(800,800,200,200);
  };

  p.setup = () => {
    p.createCanvas(800,800);
  };

  p.draw = () => {
    p.background(200); 
    p.stroke(0);
    p.noFill();

    beginRecord();
    
    // draw shapes here
    /*for(let i=0; i<15; i++) {
      p.ellipse( 300 + i * 10,  300, 100 + i*20, 100 + i*20);
    }*/
    
    p.line(0,0,p.width,p.height);
    p.line(p.width,0,0,p.height);
    p.line(0,0,p.width,0);
    p.line(p.width,0,p.width,p.height);
    p.line(p.width,p.height,0,p.height);
    p.line(0,p.height,0,0);
    
    //p.rect(0,0,p.width,p.height);
    
    endRecord();
  };

  p.keyPressed = () => {
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
  };
};

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
