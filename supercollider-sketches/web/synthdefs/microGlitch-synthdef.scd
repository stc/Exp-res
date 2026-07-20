(
SynthDef(\microGlitch, {
    var randomTime, delayTime, sig, trig;

    randomTime = TExpRand.kr(
        2e-4,
        0.4,
        Impulse.kr(8)
    );

    delayTime = randomTime.round([2e-3, 4e-3]);

    sig = AllpassC.ar(
        SinOsc.ar(55).tanh,
        0.2,
        delayTime,
        2
    );

    // Detect audible signal events
    trig = Amplitude.kr(sig).poll;

    SendReply.kr(
        Trig1.kr(trig > 0.01, 0.01),
        '/microGlitch',
        delayTime
    );

    Out.ar(0, sig);
}).writeDefFile(
    "/Users/stc/Documents/Git/Exp-res/supercollider-sketches/web/synthdefs"
);
)