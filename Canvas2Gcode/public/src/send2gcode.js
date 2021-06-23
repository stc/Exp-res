// params for interacting with the grbl interface
let moveSpeed = 7000;
let drawSpeed = 7000;
let moveDist = 10;
let poll = false;

// params for constructing gcode from canvas calls
let gline = 0;
let glines = {};
let gindex = -1;

function sendHELP() {
    socket.emit("send", "$$\n");
}

function sendHOME() {
    console.log("HOME");
    socket.emit("send","G28\n");
}
  
function sendZERO() {
    console.log("Reset zero position"); 
    socket.emit("send","G10 P0 L20 X0 Y0 Z0\n");
}

function sendLOCK() {
    console.log("Locking steppers");
    socket.emit("send","$1=255"); 
}

function sendUNLOCK() {
    console.log("Unlocking steppers");
    socket.emit("send","$1=25"); 
}

function sendGCODE(g) {
    glines = g.split("\n");
    gindex = 0;
    socket.emit("send","F" + drawSpeed + "\n");
    poll = true;
}

function pollGCODE() {
    if (serialIn === "ok" && gindex < glines.length && gindex > -1) {
        socket.emit("send", glines[gindex] + "\n");
        gindex++;
    }else {
        poll = false;
    }
}

function sendMOVEDIR(dir) {
    if(dir == 0) {
      console.log("moving ←");
      socket.emit("send","$J=G21G91X-" + moveDist + "F" + moveSpeed + "\n");
    } else if(dir == 1) {
      console.log("moving ↑")
      socket.emit("send","$J=G21G91Y" + moveDist + "F" + moveSpeed + "\n");
    } else if(dir == 2) {
      console.log("moving →");
      socket.emit("send","$J=G21G91X" + moveDist + "F" + moveSpeed + "\n");
    } else if(dir == 3) {
      console.log("moving ↓");
      socket.emit("send","$J=G21G91Y-"  + moveDist + "F" + moveSpeed + "\n");
    }
}

function sendPENUP() {
    console.log("PEN_UP");
    socket.emit("send","$J=G21G91Z-10F1000\n");
}

function sendPENDOWN() {
    console.log("PEN_DOWN");
    socket.emit("send","$J=G21G91Z10F1000\n");
}
  