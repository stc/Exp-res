window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let audioStarted = false;

const numOscillators = 6;
const oscillators = [];
const gains = [];

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
      
        osc.type = 'sine'; // or 'square', 'triangle', 'sawtooth'
        osc.frequency.value = 200 + i * 220; // different frequency per oscillator
      
        gain.gain.value = 0.0; // adjust volume
      
        osc.connect(gain);
        gain.connect(audioContext.destination);
      
        osc.start();
      
        oscillators.push(osc);
        gains.push(gain);
      }
}

function playWithADSR(index, adsr = { attack: 0.01, decay: 0.02, sustain: 0.05, release: 0.1, duration: 0.05 }) {
    const now = audioContext.currentTime;
    const gainNode = gains[index];
  
    const { attack, decay, sustain, release, duration } = adsr;
  
    const sustainLevel = sustain;
    const attackEnd = now + attack;
    const decayEnd = attackEnd + decay;
    const releaseStart = now + duration;
  
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, attackEnd);
    gainNode.gain.linearRampToValueAtTime(sustainLevel, decayEnd);
    gainNode.gain.setValueAtTime(sustainLevel, releaseStart);
    gainNode.gain.linearRampToValueAtTime(0, releaseStart + release);
  }