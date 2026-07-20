(
SynthDef(\densityDrone, {
    |amp = 0.2|

    var clock, pulse, click, tone, sig;
    var bassTrig, bassNote, bassEnv, bass;
    var trig5, trig8, trig, freq, len;
    var clickTrig;

    // Control-rate clock
    clock = Impulse.kr(64);


    // --------------------
    // PULSE
    // --------------------

    trig5 = PulseDivider.kr(clock, 8);
    trig8 = PulseDivider.kr(clock, 32);
    trig = trig5 + trig8;

    freq = Demand.kr(
        trig,
        0,
        Drand([100, 6400, 6600], inf)
    );

    len = TRand.kr(
        0.001,
        0.4,
        trig
    );

    pulse = Decay2.kr(
        trig,
        0.0001,
        len
    ) * SinOsc.ar(freq);

    SendReply.kr(
        trig,
        '/densityDronePulse',
        [1]
    );


    // --------------------
    // CLICK
    // --------------------

    clickTrig = PulseDivider.kr(clock, 4);

    click = Decay2.kr(
        clickTrig,
        0.0005,
        0.008
    ) * WhiteNoise.ar;

    click = BPF.ar(
        click,
        6000,
        0.15
    );

    SendReply.kr(
        clickTrig,
        '/densityDroneClick',
        [2]
    );


    // --------------------
    // TONE
    // --------------------

    tone = SinOsc.ar(35) * 0.5;


    // --------------------
    // BASS
    // --------------------

    bassTrig = PulseDivider.kr(clock, 64);

    bassNote = Demand.kr(
        bassTrig,
        0,
        Dseq(
            [35, 41.25, 49, 36.7],
            inf
        )
    );

    bassEnv = Decay2.kr(
        bassTrig,
        0.1,
        4
    );

    bass = SinOsc.ar(bassNote)
        * bassEnv
        * 0.6;

    bass = LPF.ar(
        bass,
        280
    );

    SendReply.kr(
        bassTrig,
        '/densityDroneBass',
        [3]
    );


    // --------------------
    // OUTPUT
    // --------------------

    sig = click + tone + pulse + bass;

    sig = tanh(sig * 1.5);

    Out.ar(
        0,
        Limiter.ar(sig * amp) ! 2
    );

}).writeDefFile(
    "/Users/stc/Documents/Git/Exp-res/supercollider-sketches/web/synthdefs"
);
)