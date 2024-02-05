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

  moveRect(n) {
    if(n == 0) {
      this.sendRequest( armCommands.rectSimple_0 );
    } else if(n == 1) {
      this.sendRequest( armCommands.rectSimple_1 );
    } else if(n == 2) {
      this.sendRequest( armCommands.rectSimple_2 );
    } else if(n == 3) {
      this.sendRequest( armCommands.rectSimple_3 );
    }
  }

  moveRectDown(n) {
    if(n == 0) {
      this.sendRequest( armCommands.rectDown_0 );
    } else if(n == 1) {
      this.sendRequest( armCommands.rectDown_1 );
    } else if(n == 2) {
      this.sendRequest( armCommands.rectDown_2 );
    } else if(n == 3) {
      this.sendRequest( armCommands.rectDown_3 );
    }
  }

  moveCallback() {
    this.sendRequest( msg, logState );
  }

  getData() {
    this.sendRequest( armCommands.getData );
  }

  sendRequest( msg ) {
    let url = `http://${armConfig.ip_addr}/js?json=`;
    let xhttp = new XMLHttpRequest();
    let that = this;
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonResponse = JSON.parse(this.responseText);
        that.requestFinished(msg, jsonResponse);
      }
    };
    xhttp.open("GET", url + msg, true);
    xhttp.send();
  }

  requestFinished(in_msg, out_msg) {
    if(out_msg == null) {
      console.log("done");
    } else {
      console.log(out_msg);
    }
  }
}