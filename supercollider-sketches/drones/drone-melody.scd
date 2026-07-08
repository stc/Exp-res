(
Ndef(\melodicDrone, {
    |amp = 0.18|

    var trig, root, notes, chord, pad, melody, sig;

    // new harmony every 8 seconds
    trig = Impulse.kr(1/8);

    root = Demand.kr(
        trig,
        0,
        Dseq([
            220, // A3
            261, // C4
            196, // G3
            293  // D4
        ], inf)
    );

    // open, airy chord voicing
    notes = root * [
        1,
        5/4,
        3/2,
        2,
        5/2
    ];

    pad = Mix(
        SinOsc.ar(
            notes,
            LFNoise1.kr(0.1).range(0, 2pi),
            [0.25, 0.18, 0.15, 0.12, 0.08]
        ) * 0.6
    );

    // slow melodic voice
    melody = SinOsc.ar(
        Demand.kr(
           Impulse.kr(1/4),
            0,
            Dseq([
                440, 494, 523, 659,
                523, 494, 440, 392
            ], inf)
        )
    ) * 0.2;

    sig = pad + melody;

    // evolving movement
    sig = sig * SinOsc.kr(0.03).range(0.6, 1);

    sig = (sig * 1);

    sig = FreeVerb.ar(
        sig,
        0.5,
        0.9,
        0.2
    );

    sig * amp ! 2
}).play;
)