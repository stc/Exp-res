let serial;
let port = "/dev/tty.usbserial-1410";
let options = {
  baudRate: 115200
};

function initSerial() {
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

function sendGCODE(g) {
  glines = g.split("\n");
  print("gcode length: " + glines.length);
  gindex = 0;
  console.log("sending");
  serial.write("F5000\n");
}

function gotOpen() {
  print("open");
}

function gotData() {
  let stin = serial.readStringUntil("\n")
  console.log("in: " + stin);

  if (stin.indexOf("Grbl") != -1) {
    writeGCODE = true;
    serial.write(g);
  } 
  else if (stin.indexOf("ok") != -1 && gindex < glines.length && gindex > -1) {
    serial.write(glines[gindex] + "\n");
    print(glines[gindex]);
    gindex++;
  }
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}