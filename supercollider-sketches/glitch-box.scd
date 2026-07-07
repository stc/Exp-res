(
Ndef(\glitchDrone, {
    |amp = 0.8|

    var clock, drone, glitchTrig, glitches, env, sig;

    // master rhythm: 4 pulses per second
    clock = Impulse.kr(4);

    // deep soft drone
    drone = Mix([
        SinOsc.ar(55, 0, 0.15),
        SinOsc.ar(82.5, 0, 0.08),
        SinOsc.ar(110, 0, 0.05)
    ]);

    drone = LPF.ar(drone, 300);
    drone = drone * SinOsc.kr(0.05).range(0.7, 1);

    // glitch events: every random pulse
    glitchTrig = Dust.kr(3);

    env = Decay2.kr(glitchTrig, 0.001, 0.08);

    glitches = Mix([
        LFSaw.ar(
            TExpRand.kr(200, 4000, glitchTrig),
            0,
            env
        ),
        WhiteNoise.ar(env),
        SinOsc.ar(
            TExpRand.kr(400, 6000, glitchTrig),
            0,
            env * 0.5
        )
    ]);

    // make glitches digital / sharp
    glitches = HPF.ar(glitches, 800);
    glitches = glitches.tanh;

    sig = drone + (glitches * 0.3);

    // space
    sig = FreeVerb.ar(
        sig,
        0.35,
        0.8,
        0.2
    );

    Limiter.ar(sig * amp) ! 2
}).play;
)