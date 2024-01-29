const http = require('http');

let ip_addr = "192.168.4.1"
//let cmd = `{"T":105}` // servo feedback
let cmd = `{"T":100}` // go init position 

http.get(`http://${ip_addr}/js?json=${cmd}`, (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    console.log(JSON.parse(data));
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});