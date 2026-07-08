(
Ndef(\allpass, {
    AllpassC.ar(
        SinOsc.ar(55).tanh,
        0.2,
        TExpRand.ar(
            2e-4,
            0.4,
            Impulse.ar(4)
        ).round([2e-3, 4e-3]),
        0.2
    ) * 0.5
}).play;
)

(
Ndef(\kick, {
    var trig, freq, env, sig;

	trig = Impulse.ar(SinOsc.kr(0.2).range(4,8));
    env = Decay2.ar(trig, 0.01, 0.3);
    freq = EnvGen.ar(
        Env([40, 60], [0.08], \exp),
        trig
    );

    sig = SinOsc.ar(freq) * env;
    sig = (sig * 3).tanh * 0.3;
}).play;
)

(
Ndef(\hat, {
    var trig, env, sig;
	trig = PulseDivider.ar(Impulse.ar(32), SinOsc.kr(0.1).range(0, 10));
    env = Decay2.ar(trig, 0.001, SinOsc.kr(0.33).range(0.01, 0.1));
    sig = HPF.ar(WhiteNoise.ar, SinOsc.kr(0.4).range(100, 6000)) * env;
    DelayC.ar(sig, 1, 0.1) * 0.5
}).play;
)