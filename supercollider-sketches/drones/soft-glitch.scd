(
Ndef(\glitchBeatDrone, {
    |amp = 0.6|

    var beat, chordTrig, root, chord, pad, bass, kick, hat;
    var glitchTrig, glitch, sig;

    // tempo: 120 BPM (4 beats/sec)
    beat = Impulse.kr(4);

    // chord changes every 8 beats
    chordTrig = PulseDivider.kr(beat, 8);

    root = Demand.kr(
        chordTrig,
        0,
        Dseq([
            55,    // G
            65.4,  // C
            73.4,  // D
            49     // F
        ], inf)
    );

    // soft harmonic pad
    chord = root * [1, 5/4, 3/2, 2];

    pad = Mix(
        SinOsc.ar(
            chord,
            0,
            [0.08, 0.02, 0.01, 0.08]
        )
    );

    pad = LPF.ar(pad, 10);

    // deep bass foundation
    bass = SinOsc.ar(root / 2) * 0.1;
    bass = LPF.ar(bass, 120);

    // kick on every 4th beat
    kick = PulseDivider.ar(beat, 4);
    kick = SinOsc.ar(
        EnvGen.ar(
            Env([40, 30], [0.8], \exp),
            kick
        )
    ) * Decay2.ar(kick, 0.001, 0.25);

    // small hat clicks
    hat = PulseDivider.ar(beat, 2);
    hat = HPF.ar(WhiteNoise.ar, 5000);
    hat = hat * Decay2.ar(hat, 0.001, 0.03) * 0.15;

    // glitch layer
    glitchTrig = Dust.kr(8);

    glitch = (
        WhiteNoise.ar +
        SinOsc.ar(TExpRand.kr(300, 5000, glitchTrig))
    );

    glitch = glitch * Decay2.kr(glitchTrig, 0.001, 0.05);
    glitch = HPF.ar(glitch, 1000) * 2.8;

    sig = pad + bass + kick + hat + glitch;

    // atmosphere
    sig = FreeVerb.ar(sig, 0.35, 0.8, 0.25);

    Limiter.ar(sig * amp) ! 2
}).play;
)