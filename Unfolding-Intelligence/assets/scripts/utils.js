function initStrings( which ) {
	activestrings = [];

	if(which == 0) {
		activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
  	activestrings.push(0);
  	activestrings.push(1);
  	activestrings.push(0);
    activestrings.push(1);
    activestrings.push(0);
    activestrings.push(0);
    activestrings.push(1);
    activestrings.push(0);
    activestrings.push(1);
    activestrings.push(0);
    activestrings.push(1);
    activestrings.push(0);
    activestrings.push(0);
    activestrings.push(1);
    activestrings.push(0);
	}
}

const colors = {
  bg: [250],
  wires: [0, 30],
  agent: [218,90,51],
  positive_food: [255,255,255],
  negative_food: [46,42,21],
  type: [64,80,85,220]
}

// tonejs components

let panner = new Tone.Panner(-1).toDestination();
console.log(Tone.FMSynth);
let fm = new Tone.FMSynth({
    "harmonicity": 18,
    "modulationIndex": 8,
    "detune": 0,
    "oscillator": {
        "type": "square"
    },
    "envelope": {
        "attack": 0.01,
        "decay": 0.02,
        "sustain": 0.15,
        "release": 2
    },
    "modulation": {
        "type": "square"
    },
    "modulationEnvelope": {
        "attack": 0.01,
        "decay": 0.02,
        "sustain": 0.03,
        "release": 0.3
    },
    
}).toDestination();
fm.connect(panner);
fm.volume.value = -14;
panner.pan.value = 0.5;
