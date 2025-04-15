window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let audioStarted = false;

const numOscillators = 6;
const oscillators = [];
const gains = [];
const pitches = [100,500,1000,2000,4000,8000]

initAudio = () => {
    if (!audioStarted) {
        audioContext = new AudioContext();
        createAudioComponents();
        audioStarted = true;
    }
}

createAudioComponents = () => {
    for (let i = 0; i < numOscillators; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
      
        osc.type = 'triangle'; // or 'square', 'triangle', 'sawtooth'
        osc.frequency.value = pitches[i]; // different frequency per oscillator
      
        gain.gain.value = 0.0; // adjust volume
      
        osc.connect(gain);
        gain.connect(audioContext.destination);
      
        osc.start();
      
        oscillators.push(osc);
        gains.push(gain);
      }
}

function playWithADSR(index, volume, adsr = { attack: 0.0, decay: 0.01, sustain: 0.01, release: 0.08, duration: 0.05 }) {
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