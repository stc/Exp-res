const socket = io({
  transports: ["websocket"]
});

let serialIn = "";

socket.on("serialIn", (data) => {
  serialIn = data;
  console.log(serialIn);
});

const sketch = (p) => {
  p.preload = () => {
    recordCanvas(p.windowWidth,p.windowHeight,100,100);
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth,p.windowHeight);
  };

  p.draw = () => {
    p.background(200); 
    p.stroke(0);
    p.noFill();
    p.rect(0,0,p.width,p.height);
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
      } else if(key == 'p') {
        sendGCODE(gcode);
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
