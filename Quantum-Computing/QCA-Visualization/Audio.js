window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let audioStarted = false;

const numOscillators = 6;
const oscillators = [];
const gains = [];
const baseFreq = 200;
const pitches = [baseFreq,baseFreq*2,baseFreq*3,baseFreq*6,baseFreq*7,baseFreq*16]
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
    reverb.time = 0.6 //seconds
    reverb.wet.value = 0.5
    reverb.dry.value = 0.2
    reverb.filterType = 'lowpass'
    reverb.cutoff.value = 8000 //Hz

    for (let i = 0; i < numOscillators; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
      
        osc.type = 'triangle'; // or 'square', 'triangle', 'sawtooth'
        osc.frequency.value = pitches[i];
      
        gain.gain.value = 0.0; // adjust volume
      
        osc.connect(gain);
        gain.connect(reverb);
        gain.connect(audioContext.destination);
      
        osc.start();
      
        oscillators.push(osc);
        gains.push(gain);
      }
}

function playWithADSR(index, volume, adsr = { attack: 0.005, decay: 0.001, sustain: 0.01, release: 0.01, duration: 0.05 }) {
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
    for(let i=0; i<gains.length; i++) {
        const gainNode = gains[i];
        gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0, 1);
    }
}