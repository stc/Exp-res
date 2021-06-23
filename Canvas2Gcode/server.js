// app & sockets
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  transports: ["websocket"] 
}); 

// serial port
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
let sport, portaddress, parser;

SerialPort.list().then(function(ports) {
  for (let p of ports) {
    if(p.path.includes("usbserial")) {
      portaddress = p.path;
      console.log(`opening serial at ${portaddress}`);
    }
  }

  sport = new SerialPort(portaddress, { baudRate: 115200}, function (err) {
    if (err) {
      return console.log('Serial Port Error >> ', err.message);
    }
  });
  parser = sport.pipe(new Readline({ delimiter: '\r\n' }))
  parser.on('data', (data) => {
    console.log(`Serial in >>> ${data}`);
  });
});

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.render("index.html");
});

http.listen(port, () => {
  console.log(`Server is active at port:${port}`);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on("send", (data) => {
    console.log(`server received: ${data} from client ${socket.id}`);
    console.log(`sending ${data} to serial output`);
    sport.write(data, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
    })
  });
});

//send shared_data every framerate to each client
/*
const frameRate = 30;
setInterval(() => {
  io.emit("shareData", share_data);
}, 1000 / frameRate);
*/