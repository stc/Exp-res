# Canvas to GCode

Javascript app to plot shapes with a plotter (Bachin draw), using basic gcode structure. 

## Structure

Server (nodejs) is connecting to serial port automatically. User command from the UI (app.js) are bridged through websockets to send gcode to the serial port. The server can also load svg files and transfer their content to the client app for further processing.

Used npm modules: socket.io, express, svgson

## Start

Connect the plotter through USB, run `node server.js` and open the browser at `localhost:8080`

## Notes

Plotter home position is defined where the plotter drawing head stays at the moment of starting the app. Several gcode commands are inefficient atm with the Bachin Draw kit. 