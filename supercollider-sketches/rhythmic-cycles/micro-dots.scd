(
Ndef(\minimalDigital, {
    |amp = 0.2|

    var clock, pulse, click, tone, glitch, sig;
	var bassTrig, bassNote, bassEnv, bass;
	var trig5, trig8, trig, freq, len;

    clock = Impulse.ar(64);

	trig5 = PulseDivider.ar(clock, 8);
	trig8 = PulseDivider.ar(clock, 32);
	trig = trig5 + trig8;

	freq = Demand.ar(
		trig,
		0,
		Drand([100, 6400, 6600], inf)
	);

	len = TRand.kr(
		0.001,
		0.4,
		trig
	);
    pulse = Decay2.ar(
        trig,
        0.0001,
        len
    ) * SinOsc.ar(freq);

    click = Decay2.ar(
        PulseDivider.ar(clock, 4),
        0.0005,
        0.008
    ) * WhiteNoise.ar;

    click = BPF.ar(click, 6000, 0.15);

    tone = SinOsc.ar(35) * 0.5;

	// occasional bass
	bassTrig = PulseDivider.ar(clock, 64);

	bassNote = Demand.ar(
		bassTrig,
		0,
		Dseq([35, 41.25, 49, 36.7], inf)
	);

	bassEnv = Decay2.ar(
		bassTrig,
		0.1,
		4,
	);

	bass = SinOsc.ar(bassNote)
	* bassEnv
    * 0.6;

	bass = LPF.ar(bass, 280);

    sig = click + tone + pulse + bass;

    sig = tanh(sig * 1.5);

    Limiter.ar(sig * amp) ! 2
}).play;
)