import HttpBridge from './HttpBridge.js';
import readline from 'readline';
import { armBaseSequence } from './Utils.js';
import { armDownSequence } from './Utils.js';
import { vec2seq } from './Utils.js';

const httpBridge = new HttpBridge();
httpBridge.wristMode();

let vectors = [[0,0,0],[0,1,0]];
console.log( vec2seq( vectors ) );


// interact
readline.emitKeypressEvents(process.stdin)
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
}
process.stdin.on('keypress', (chunk, key) => {
    console.log(key.name);
    switch (key.name) {
        case 'space':
            httpBridge.moveInit();
            break;
        case 'q':
            httpBridge.wristMode();
            break;
        case 'g':
            httpBridge.getData();
            break;
        case '0':
            httpBridge.moveWristUp();
            break;
        case '1':
            httpBridge.moveRect(0);
            break;
        case '2':
            httpBridge.moveRect(1);
            break;
        case '3':
            httpBridge.moveRect(2);
            break;  
        case '4':
            httpBridge.moveRect(3);
            break;
        case 'a':
            httpBridge.moveRectDown(0);
            break;
        case 's':
            httpBridge.moveRectDown(1);
            break;
        case 'd':
            httpBridge.moveRectDown(2);
            break;
        case 'f':
            httpBridge.moveRectDown(3);
            break;
        case 'k':
            httpBridge.moveSequence( armBaseSequence );
            break;
        case 't':
            httpBridge.takePaint();
            break;
        case 'y':
            httpBridge.centerBrush();
            break;
        case 'u':
            httpBridge.moveSequence( armDownSequence );
            break;
        case 'escape':
            process.exit();    
        default:
            break;
    }
});