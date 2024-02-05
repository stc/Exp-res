import HttpBridge from './HttpBridge.js';
import readline from 'readline';

const httpBridge = new HttpBridge();


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

    if(key && key.name == '1') {
        httpBridge.moveWristUp();
    }

    if(key && key.name == 'escape') {
        process.exit();
    }
});