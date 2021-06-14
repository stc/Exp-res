function preload() {
  recordCanvas(200, 200, true);
}

function setup() {
  createCanvas(800, 800);
  initSerial();
  noLoop();
}

function draw() {
  beginRecord();  
  background(220);
  drawPlotShapes();
  endRecord(); 
}

function drawGCodeDebug() {
  let ggcode = gcode.split("\n");
  for (i=0; i<ggcode.length; i++) {
    ll = ggcode[i];
    if (ll.indexOf("G01") > -1) {
      coords = ll.split(" ");
      xxx = float(coords[1].replace("X", ""));
      yyy = float(coords[2].replace("Y", ""));
      
      stroke(255, 0, 0)
      ellipse(xxx, yyy, 5, 5);
    }
  }  
}

function downloadGCode(filename, content) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
  
function keyPressed() {
  if (key == 'x') {
    serial.stop();
  } else if(key == 'p') {
    sendGCODE(gcode, "/dev/cu.usbserial-1410");
  } else if(key == 'd') {
    downloadGCode("output.gcode",gcode);
  }
}
