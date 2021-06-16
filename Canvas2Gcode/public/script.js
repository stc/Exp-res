const sketchContainer = document.getElementById("sketch-container");

const socket = io({
  transports: ["websocket"]
});

const sketch = (p) => {
  
  p.setup = () => {
    const containerPos = sketchContainer.getBoundingClientRect();
    const cnv = p.createCanvas(containerPos.width, containerPos.height);

    p.frameRate(30); //set framerate to 30, same as server
    
    // client receives data
    /*
    socket.on("shareData", (data) => {
      console.log(`client received: ${data}`);
    });
    */
  };

  p.draw = () => {
    p.background(0); 
  };

  p.keyPressed = () => {
      socket.emit("shareData", "serial-test");
  };
};

new p5(sketch, sketchContainer);
