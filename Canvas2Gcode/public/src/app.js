const socket = io({
  transports: ["websocket"]
});

let serialIn = "";

socket.on("serialIn", (data) => {
  serialIn = data;
  if(poll) {
    pollGCODE();
  }
  console.log(serialIn);
});

socket.on("svgObj", (data) => {
  console.log(`svg object loaded with elements:\n${data}`);
});

let sketch = (p) => {
  
  p.preload = () => {
    recordCanvas(400,800,200,400);
  };

  p.setup = () => {
    p.createCanvas(400,800);
    addScreenPositionFunction(p);

    // prepare shapes to draw
    setupPlotShapes(p);
  }
  p.draw = () => {
    p.background(230); 
    p.stroke(0);
    p.noFill();

    beginRecord(); 
    
    // draw shapes, hook canvas drawing functions
    //drawPlotShapes(p);
    drawPlotCalib(p);

    endRecord();
  }

  p.keyPressed = function() {
      if(p.key==' ') {
        sendZERO();
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
