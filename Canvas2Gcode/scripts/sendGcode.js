// todo: fix sending
let serial;
let options = {
  baudRate: 115200
};

function initSerial(port) {
  serial = new p5.SerialPort();
  serial.on('data', gotData);
  serial.on('open', gotOpen);
  serial.on('error', serialError);
  serial.open(port, options);
  serial.clear();
}

let gline = 0;
let glines = {};
let gindex = -1;
let writeGCODE = false;

function sendGCODE(g, port) {
  initSerial(port);
  glines = g.split("\n");
  //print(glines.length);
  gindex = 0;
  //serial.write(g);
}

function gotOpen() {
  print("open");
}

function gotData() {
  let stin = serial.readStringUntil("\n")
  console.log("in: " + stin);

  if (stin.indexOf("Grbl") != -1) {
    //writeGCODE = true;
    //serial.write("E2\n");
    //serial.write("F5000\n");
    //serial.write("S0 M3\n");
    //serial.write("S1000 M3\n");
    //serial.write(g);
  } 
  /*else if (stin.indexOf("ok") != -1 && gindex < glines.length && gindex > -1) {
    serial.write(glines[gindex] + "\n");
    print(glines[gindex]);
    gindex++;
  }
  */
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}