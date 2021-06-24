// app & sockets
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  transports: ["websocket"] 
}); 

// svg processing idea
const { parse, stringify } = require("svgson");
let svgObj = {};
parse(`<svg><line stroke= "#bada55" x1= "70" y1= "80" x2= "250" y2= "150"> </line> </svg>`).then((json) => {
  svgObj = JSON.stringify(json, null, 2);
});
  
// serial port
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
let sport, sportaddress, sparser;

SerialPort.list().then(function(ports) {
  for (let p of ports) {
    if(p.path.includes("usbserial")) {
      sportaddress = p.path;
      console.log(`opening serial at ${sportaddress}`);
    }
  }

  sport = new SerialPort(sportaddress, { baudRate: 115200}, function (err) {
    if (err) {
      return console.log('Serial Port Error >> ', err.message);
    }
  });
  sparser = sport.pipe(new Readline({ delimiter: '\r\n' }))
  sparser.on('data', (data) => {
    io.emit("serialIn", data);
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
  
  socket.emit("svgObj", svgObj);
  
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