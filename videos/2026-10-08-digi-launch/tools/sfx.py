#!/usr/bin/env python3
# Synthesised chat sounds for the DiGi launch film. Nothing sampled, nothing
# licensed: every cue is a few sine or noise bursts shaped by an envelope, so
# the folder owns its own sound. Writes assets/sfx-*.mp3 through ffmpeg.
import numpy as np, subprocess, os, sys
SR = 48000
out = os.path.join(os.path.dirname(__file__), '..', 'assets')

def env(n, a, d, s=0.0, r=0.0, curve=4.0):
    t = np.linspace(0, 1, n)
    e = np.ones(n)
    aN = max(1, int(a * SR)); dN = max(1, int(d * SR)); rN = max(1, int(r * SR))
    e[:aN] = np.linspace(0, 1, aN)
    dec = np.exp(-np.linspace(0, curve, dN))
    e[aN:aN + dN] = (dec * (1 - s) + s)[:max(0, n - aN)]
    if n > aN + dN: e[aN + dN:] = s
    if rN < n: e[-rN:] *= np.linspace(1, 0, rN)
    return e

def tone(f, dur, a=0.004, d=0.25, curve=5.0, harm=(1.0, 0.35, 0.12), glide=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    fr = f * (1 + glide * np.exp(-t * 18))
    ph = 2 * np.pi * np.cumsum(fr) / SR
    s = sum(w * np.sin(ph * (i + 1)) for i, w in enumerate(harm))
    return s * env(n, a, d, 0, 0.01, curve)

def noise(dur, lo, hi, a, d, curve=4.0):
    n = int(dur * SR)
    x = np.random.default_rng(7).standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    band = np.exp(-((np.log(np.maximum(f, 1)) - np.log(np.sqrt(lo * hi))) ** 2) / (2 * (np.log(hi / lo) / 4) ** 2))
    x = np.fft.irfft(X * band, n)
    x /= np.max(np.abs(x)) + 1e-9
    return x * env(n, a, d, 0, 0.02, curve)

def mix(*parts):
    n = max(len(p) for p in parts); out = np.zeros(n)
    for p in parts: out[:len(p)] += p
    return out

def write(name, sig, gain=0.8):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * gain
    pcm = (sig * 32767).astype('<i2').tobytes()
    wav = os.path.join(out, name + '.wav'); mp3 = os.path.join(out, name + '.mp3')
    import wave
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-q:a', '2', mp3], check=True)
    os.remove(wav)
    print('wrote', os.path.relpath(mp3))

# A send: a short airy swoosh that rises, like a message leaving.
n = int(0.42 * SR); t = np.arange(n) / SR
sw = noise(0.42, 900, 6000, 0.05, 0.3, 3.0) * (0.5 + 0.5 * np.sin(np.pi * t / 0.42))
write('sfx-send', mix(sw, 0.25 * tone(620, 0.42, 0.03, 0.3, 4.0, (1, 0.2), glide=0.6)), 0.55)
# A pop: a reply landing. Soft, round, a pitch drop.
write('sfx-pop', mix(tone(520, 0.16, 0.002, 0.14, 7.0, (1, 0.5, 0.2), glide=0.9), 0.3 * noise(0.05, 1500, 5000, 0.001, 0.04, 6.0)), 0.6)
# A tap: a tiny click, mostly transient.
write('sfx-tap', mix(noise(0.045, 1200, 7000, 0.0005, 0.04, 8.0), 0.5 * tone(1800, 0.04, 0.0005, 0.035, 9.0, (1,))), 0.5)
# The typing dots: three very quiet ticks.
dots = np.zeros(int(0.7 * SR))
for i in range(3):
    s = int(i * 0.22 * SR); d = noise(0.03, 2000, 6000, 0.0005, 0.025, 8.0) * 0.5
    dots[s:s + len(d)] += d
write('sfx-dots', dots, 0.25)
# The chime when a worry rests: two soft bell notes, a major third apart.
def at(sig, t):
    return np.concatenate([np.zeros(int(t * SR)), sig])
write('sfx-chime', mix(tone(880, 1.4, 0.004, 1.2, 4.0, (1, 0.3, 0.08, 0.04)), at(tone(1108.7, 1.2, 0.004, 1.1, 4.0, (1, 0.3, 0.08, 0.04)), 0.18)), 0.6)
# The tinks for the face: three bright short notes going up.
write('sfx-tink', mix(*[at(tone(f, 0.35, 0.002, 0.3, 6.0, (1, 0.25, 0.1)), i * 0.19) for i, f in enumerate((1318.5, 1568.0, 1975.5))]), 0.55)
# A whoosh for the camera moves: low, wide, half a second.
write('sfx-whoosh', noise(0.6, 200, 2500, 0.12, 0.4, 3.0), 0.5)
# The drop: DiGi lands. A soft thud with a little squash.
write('sfx-land', mix(tone(140, 0.3, 0.002, 0.25, 6.0, (1, 0.4), glide=1.2), 0.4 * noise(0.08, 300, 1500, 0.001, 0.07, 6.0)), 0.65)
# A notification arriving: two quick soft notes, the house version of a buzz.
write('sfx-notify', mix(tone(1046.5, 0.5, 0.003, 0.4, 5.0, (1, 0.3, 0.1)), at(tone(1318.5, 0.4, 0.003, 0.35, 5.0, (1, 0.3, 0.1)), 0.11)), 0.5)
# The shimmer: a rising airy sweep for the butter highlight.
write('sfx-shimmer', noise(0.9, 2500, 9000, 0.3, 0.5, 2.5) * np.linspace(0.3, 1, int(0.9 * SR)), 0.35)
