const socket = io({
  transports: ["websocket"]
});

const sketch = (p) => {
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
      socket.emit("send", "$$\n");
  };
};

new p5(sketch);
