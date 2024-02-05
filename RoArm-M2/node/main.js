import HttpBridge from './HttpBridge.js';
import readline from 'readline';

const httpBridge = new HttpBridge();
httpBridge.wristMode();

// interact
readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
}
process.stdin.on('keypress', (chunk, key) => {
    console.log(key.name);
    if(key && key.name == 'space') {
        httpBridge.moveInit();
    }
    if(key && key.name == 'q') {
        httpBridge.wristMode();
    }
    if(key && key.name == 'g') {
        httpBridge.getData();
    }

    if(key && key.name == '0') {
        httpBridge.moveWristUp();
    }

    if(key && key.name == '1') {
        httpBridge.moveRect(0);
    }

    if(key && key.name == '2') {
        httpBridge.moveRect(1);
    }

    if(key && key.name == '3') {
        httpBridge.moveRect(2);
    }

    if(key && key.name == '4') {
        httpBridge.moveRect(3);
    }

    if(key && key.name == 'a') {
        httpBridge.moveRectDown(0);
    }

    if(key && key.name == 's') {
        httpBridge.moveRectDown(1);
    }

    if(key && key.name == 'd') {
        httpBridge.moveRectDown(2);
    }

    if(key && key.name == 'f') {
        httpBridge.moveRectDown(3);
    }
    
    if(key && key.name == 'escape') {
        process.exit();
    }
});