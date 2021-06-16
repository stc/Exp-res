let serial;
let port = "/dev/tty.usbserial-1440";
let moveSpeed = 7000;
let moveDist = 10;

function initSerial() {
  serial = new p5.SerialPort();
  let portlist = serial.list();
  serial.on('data', gotData);
  serial.on('open', gotOpen);
  serial.on('error', serialError);
  serial.on('list', gotList);
  serial.open(port, { baudRate: 115200 });
  serial.clear();
}

let gline = 0;
let glines = {};
let gindex = -1;
let writeGCODE = false;

function sendGCODE(g) {
  glines = g.split("\n");
  console.log("gcode length: " + glines.length);
  gindex = 0;
  console.log("sending");
  serial.write("F5000\n");
}

function sendHOME() {
  console.log("HOME");
  serial.write("G28\n");
}

function sendZERO() {
  console.log("Reset zero position"); 
  serial.write("G10 P0 L20 X0 Y0 Z0\n");
}

function sendMOVEDIR(dir) {
  if(dir == 0) {
    console.log("moving ←");
    serial.write("$J=G21G91X-" + moveDist + "F" + moveSpeed + "\n");
  } else if(dir == 1) {
    console.log("moving ↑")
    serial.write("$J=G21G91Y" + moveDist + "F" + moveSpeed + "\n");
  } else if(dir == 2) {
    console.log("moving →");
    serial.write("$J=G21G91X" + moveDist + "F" + moveSpeed + "\n");
  } else if(dir == 3) {
    console.log("moving ↓");
    serial.write("$J=G21G91Y-"  + moveDist + "F" + moveSpeed + "\n");
  }
}
function gotList(thelist) {
  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("opened serial port");
  //serial.write("E2\n");
  //serial.write("F5000\n");
  //serial.write("S0 M3\n");
  //serial.write("S1000 M3\n");
}

function gotData() {
  let stin = serial.readStringUntil("\n")
  console.log("in: " + stin);

  //let inb = serial.readBytes();
  //console.log("in bytes: " + inb);
  
  if (stin.indexOf("Grbl") != -1) {
    //writeGCODE = true;
    //serial.write("E2\n");
    //serial.write("F5000\n");
    //serial.write("S0 M3\n");
    //serial.write("S1000 M3\n");
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