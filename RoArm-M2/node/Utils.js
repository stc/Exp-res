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
    "rotateWrist": '{"T":'
}

export {
    armConfig,
    armCommands
}