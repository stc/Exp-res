window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let audioStarted = false;

const numOscillators = 6;
const oscillators = [];
const gains = [];
const baseFreq = 400;
const pitches = [baseFreq, baseFreq * 2.5, baseFreq * 4.8, baseFreq * 8.2, baseFreq * 10.6, baseFreq * 17.7]
const drones = [];
const dronePitches = [100, 120];
const droneGains = [];
let filter;

initAudio = () => {
    if (!audioStarted) {
        audioContext = new AudioContext();
        createAudioComponents();
        audioStarted = true;
    }
}

createAudioComponents = () => {
    let reverb = SimpleReverb(audioContext);
    reverb.connect(audioContext.destination);
    reverb.time = 3.6 //seconds
    reverb.wet.value = 0.0
    reverb.dry.value = 1.0
    reverb.filterType = 'lowpass'
    reverb.cutoff.value = 8000 //Hz

    filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass'; // Band-pass filter type
    filter.frequency.setValueAtTime(4400, audioContext.currentTime); // Center frequency (Hz)
    filter.Q.setValueAtTime(3, audioContext.currentTime); // Q factor (resonance), typically between 0.5 and 10

    filter.connect(reverb);

    for (let i = 0; i < numOscillators; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'triangle'; // or 'square', 'triangle', 'sawtooth'
        osc.frequency.value = pitches[i];

        gain.gain.value = 0.0; // adjust volume

        osc.connect(gain);
        gain.connect(filter);
        //gain.connect(audioContext.destination);

        osc.start();

        oscillators.push(osc);
        gains.push(gain);
    }

    for (let i = 0; i < 2; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = dronePitches[i];

        gain.gain.value = 0.0; // adjust volume

        osc.connect(gain);

        gain.connect(audioContext.destination);

        osc.start();

        drones.push(osc);
        droneGains.push(gain);
    }
}

function changeDrones() {
    if (drones) {
        drones[0].frequency.setValueAtTime(random([80, 90, 100]), audioContext.currentTime);
        drones[1].frequency.setValueAtTime(random([120, 130, 135]), audioContext.currentTime);
    }
}

function changeFilterFrequency(freq) {
    if (filter) {
        filter.frequency.setValueAtTime(freq, audioContext.currentTime);
    }
}

function fadeDronesIn() {
    const now = audioContext.currentTime;
    if (drones) {
        for (let i = 0; i < droneGains.length; i++) {
            const gainNode = droneGains[i];
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.2);
        }
    }
}

function changeFilterQ(q) {
    if (filter) {
        filter.Q.setValueAtTime(q, audioContext.currentTime);
    }
}

function playWithADSR(index, volume, adsr = { attack: 0.0, decay: 0.001, sustain: 0.008, release: 0.001, duration: 0.01 }) {
    const now = audioContext.currentTime;
    const gainNode = gains[index];

    const { attack, decay, sustain, release, duration } = adsr;

    const sustainLevel = sustain;
    const attackEnd = now + attack;
    const decayEnd = attackEnd + decay;
    const releaseStart = now + duration;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, attackEnd);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, decayEnd);
    gainNode.gain.setValueAtTime(sustainLevel, releaseStart);
    gainNode.gain.linearRampToValueAtTime(0, releaseStart + release);
}

function fadeOut() {
    const now = audioContext.currentTime;
    for (let i = 0; i < gains.length; i++) {
        const gainNode = gains[i];
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.linearRampToValueAtTime(0, now + 1);
    }

    for (let i = 0; i < droneGains.length; i++) {
        const gainNode = droneGains[i];
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.linearRampToValueAtTime(0, now + 1);
    }
}