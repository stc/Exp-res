(
SynthDef(\mysine, { |freq=440, amp=0.2, gate=1|
    var env;
    var sig;

    env = EnvGen.kr(
        Env.adsr(
            attackTime: 0.01,
            decayTime: 0.1,
            sustainLevel: 0.1,
            releaseTime: 0.1
        ),
        gate,
        doneAction: 2
    );

    sig = SinOsc.ar(freq) * env * amp;

    Out.ar(0, sig ! 2);
}).writeDefFile("/Users/stc/Documents/Git/Exp-res/supercollider-sketches/web/synthdefs");
)