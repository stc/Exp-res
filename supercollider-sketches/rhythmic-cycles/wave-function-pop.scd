(
Ndef(\allpass, {
    AllpassC.ar(
        SinOsc.ar(55).tanh,
        0.2,
        TExpRand.ar(
            2e-4,
            0.4,
            Impulse.ar(8)
        ).round([2e-3, 4e-3]),
        2
    )
}).play;
)