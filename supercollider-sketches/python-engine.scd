(
s.waitForBoot({

    Ndef(\click, {
        |trig = 0|

        var env, sig;

        env = Decay2.kr(
            trig,
            0.001,
            0.05
        );

        sig = WhiteNoise.ar * env;
        sig = BPF.ar(sig, 5000, 0.2);

        sig * 0.3 ! 2
    }).play;


    OSCdef(\trigger, {
        |msg|

        Ndef(\click).set(\trig, 1);

        // reset trigger
        {
            0.01.wait;
            Ndef(\click).set(\trig, 0);
        }.fork;

    }, "/trigger");

});
)