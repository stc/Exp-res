let armConfig = {
    "ip_addr": "192.168.4.1",
    "tip_length":190
}

let armCommands = {
    "setWristMode":'{"T":1,"mode":1}',
    "setWristParams":'{"T":2,"pos":3,"ea":0,"eb":190}',
    "getData": '{"T":105}',
    "moveInit": '{"T":100}',
    "moveWristUp": '{"T":102,"base":0,"shoulder":0,"elbow":1.57,"hand":1.57,"spd":0,"acc":10}',
    
    "rectSimple_0": '{"T":104,"x":150,"y":130,"z":-100,"t":3.2,"spd":0.25}',
    "rectSimple_1": '{"T":104,"x":400,"y":130,"z":-100,"t":3.2,"spd":0.25}',
    "rectSimple_2": '{"T":104,"x":400,"y":-130,"z":-100,"t":3.2,"spd":0.25}',
    "rectSimple_3": '{"T":104,"x":150,"y":-130,"z":-100,"t":3.2,"spd":0.25}',
    
    "rectDown_0": '{"T":104,"x":150,"y":130,"z":-150,"t":3.2,"spd":0.25}',
    "rectDown_1": '{"T":104,"x":400,"y":130,"z":-150,"t":3.2,"spd":0.25}',
    "rectDown_2": '{"T":104,"x":400,"y":-130,"z":-150,"t":3.2,"spd":0.25}',
    "rectDown_3": '{"T":104,"x":150,"y":-130,"z":-150,"t":3.2,"spd":0.25}',

    "takePaint":   '{"T":104,"x":400,"y":140,"z":-150,"t":3.2,"spd":0.25}',
    "centerBrush":   '{"T":104,"x":180,"y":0,"z":-50,"t":3.2,"spd":0.25}',
}

let armBaseSequence = [
    '{"T":104,"x":150,"y":130,"z":-100,"t":3.2,"spd":0.35}',
    '{"T":104,"x":400,"y":130,"z":-100,"t":3.2,"spd":0.25}',
    '{"T":104,"x":400,"y":-130,"z":-100,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":-130,"z":-100,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":130,"z":-100,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":130,"z":-0,"t":3.2,"spd":0.45}',
]

let armDownSequence = [
    '{"T":104,"x":150,"y":130,"z":-170,"t":3.2,"spd":0.35}',
    '{"T":104,"x":400,"y":-130,"z":-160,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":-130,"z":-160,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":130,"z":-160,"t":3.2,"spd":0.25}',
    '{"T":104,"x":150,"y":130,"z":-0,"t":3.2,"spd":0.45}',
]

const vec2seq = ( vectors ) => {
    let sequence = "";
    for(let v of vectors) {
        sequence += `${v[0]} ${v[1]} ${v[2]} \n`;  
    }
    return sequence
}

export {
    armConfig,
    armCommands,
    armBaseSequence,
    armDownSequence,
    vec2seq
}