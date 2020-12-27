function initStrings(scaleSelect) {
  activestrings = [];

  let scales = [
                [1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0],
                [1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0],
                [1,0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1,0, 1,0,1,0,1,0,1,0,1,0,1,0],
                [1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0]
  ]

  for(let i=0; i<scales[scaleSelect].length; i++) {
    activestrings.push(scales[scaleSelect][i]);
  }
}

const colors = {
  bg: [0, 8, 10],
  wires: [255,20],
  agent: [218, 90, 51],
  positive_food: [255, 255, 255],
  negative_food: [46, 42, 21],
  type: [64, 80, 85, 220],
  touch: [255, 150, 150, 100]
}

// Tonejs components

let r1 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.06
}).toDestination();

let r2 = new Tone.Reverb({
  decay: 2.5,
  preDelay: 0.01
}).toDestination();

/*let r3 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.1
}).toDestination();
*/
const drone = new Tone.Player("assets/data/drone-bg.mp3").toDestination();
drone.loop = true;


var feedbackDelay1 = new Tone.FeedbackDelay(0.1, 0.98).connect(r1);
let fm1 = new Tone.FMSynth({
  "harmonicity": 8,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.01,
    "decay": 0.02,
    "sustain": 0.05,
    "release": 2
  },
  "modulation": {
    "type": "sine"
  },
  "modulationEnvelope": {
    "attack": 0.001,
    "decay": 0.02,
    "sustain": 0.03,
    "release": 1
  },

}).toDestination();
fm1.connect(feedbackDelay1);
fm1.volume.value = -8;

var feedbackDelay2 = new Tone.FeedbackDelay(0.1, 0.98).connect(r2);
let fm2 = new Tone.FMSynth({
  "harmonicity": 8,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.1,
    "decay": 2,
    "sustain": 0.4,
    "release": 6
  },
  "modulation": {
    "type": "square"
  },
  "modulationEnvelope": {
    "attack": 0.01,
    "decay": 1,
    "sustain": 0.2,
    "release": 10
  },

}).toDestination();
fm2.connect(feedbackDelay2);
fm2.volume.value = -8;

let poisonSynth = new Tone.MembraneSynth().toDestination();
poisonSynth.volume.value = -28;