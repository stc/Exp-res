import { XMLHttpRequest } from "xmlhttprequest";
import { armConfig } from "./Utils.js";
import { armCommands } from "./Utils.js";

export default class HttpBridge {
  constructor() {
  }
  
  wristMode() {
    this.sendRequest( armCommands.setWristMode );
    this.sendRequest( armCommands.setWristParams );
  }
  
  moveInit() {
    this.sendRequest( armCommands.moveInit );
  }
  
  moveWristUp() {
    this.sendRequest( armCommands.moveWristUp );
  }
  getData() {
    this.sendRequest( armCommands.getData );
  }

  sendRequest( msg ) {
    let url = `http://${armConfig.ip_addr}/js?json=`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonResponse = JSON.parse(this.responseText);
        console.log(jsonResponse);
      }
    };
    xhttp.open("GET", url + msg, true);
    xhttp.send();
  }
}