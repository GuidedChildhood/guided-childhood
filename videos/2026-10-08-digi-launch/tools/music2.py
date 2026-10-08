#!/usr/bin/env python3
# The second score, composed in code again but in the sound of the moment:
# a modern house underscore at 118 bpm, four on the floor kick, clap on two
# and four, sixteenth hats, a pad that pumps under the kick, bright plucks
# on an I V vi IV in F major, a sub bass, and a long riser into the first
# kick. Deterministic. Licence ours, nothing sampled.
#   python3 tools/music2.py --t0 12.0 --len 100
import numpy as np, subprocess, os, wave, argparse
ap = argparse.ArgumentParser(); ap.add_argument('--t0', type=float, default=12.0); ap.add_argument('--len', type=float, default=100.0); ap.add_argument('--out', default='music-house.mp3')
A = ap.parse_args()
SR = 48000; BPM = 118.0; BEAT = 60 / BPM; BAR = 4 * BEAT
LEN = A.len; N = int(LEN * SR); T0 = A.t0
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def put(sig, t, pan=0.0, gain=1.0):
    s = int(round(t * SR))
    if s < 0: sig = sig[-s:]; s = 0
    if s >= N or len(sig) == 0: return
    seg = sig[:N - s] * gain
    L[s:s + len(seg)] += seg * min(1, 1 - pan); R[s:s + len(seg)] += seg * min(1, 1 + pan)
def env(n, a, d, sus, r, curve=4.0):
    e = np.zeros(n); aN = max(1, int(a * SR)); dN = max(1, int(d * SR)); rN = max(1, int(r * SR)); body = max(aN, n - rN)
    e[:min(aN, n)] = np.linspace(0, 1, min(aN, n))
    if aN < body:
        dec = np.exp(-np.linspace(0, curve, dN)) * (1 - sus) + sus
        seg = dec[:body - aN]; e[aN:aN + len(seg)] = seg
        if aN + len(seg) < body: e[aN + len(seg):body] = sus
    if body < n: e[body:] = e[body - 1] * np.linspace(1, 0, n - body)
    return e
def lowpass(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / max(cutoff, 20)) ** 4), len(x))
def kick():
    n = int(0.32 * SR); t = np.arange(n) / SR; f = 46 + 130 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 1.0 + 0.2 * rng.standard_normal(n) * np.exp(-t * 180)
def clap():
    n = int(0.22 * SR); x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X *= np.exp(-((f - 2200) / 1500) ** 2) + 0.3 * np.exp(-((f - 6000) / 2500) ** 2)
    x = np.fft.irfft(X, n); x /= np.max(np.abs(x)) + 1e-9
    e = np.exp(-np.arange(n) / SR * 22); 
    for k in (0.011, 0.022): e[int(k * SR):] += np.exp(-np.arange(n - int(k * SR)) / SR * 22) * 0.7
    return x * e / 2.4 * 0.5
def hat(open_=False):
    n = int((0.18 if open_ else 0.06) * SR); x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X *= (f > 6500) * np.exp(-((f - 11000) / 5000) ** 2)
    x = np.fft.irfft(X, n); x /= np.max(np.abs(x)) + 1e-9
    return x * np.exp(-np.arange(n) / SR * (14 if open_ else 70)) * 0.16
def pluck(note, dur, vel=1.0):
    # A plucky synth: the upper harmonics die faster than the fundamental, which is the brightness fading.
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(note)
    saw = sum(np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * (1.0 + k * 1.3)) for k in range(1, 9))
    s = lowpass(saw, 3200) * env(n, 0.002, dur * 0.7, 0.0, 0.03, 3.5)
    return s * vel * 0.26
def pad(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for nt in notes:
        for det in (-7, 0, 7):
            f = midi(nt) * 2 ** (det / 1200)
            s += sum(np.sin(2 * np.pi * f * k * t + rng.random() * 6.28) / (k * k) for k in range(1, 5))
    s = lowpass(s, 1400) / (len(notes) * 3)
    return s * env(n, 0.6, 0.3, 0.9, 0.5, 2.0) * 0.6
def sub(note, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(note)
    return (np.sin(2 * np.pi * f * t) + 0.15 * np.sin(2 * np.pi * 2 * f * t)) * env(n, 0.005, dur * 0.6, 0.35, 0.03, 3.0) * 0.55
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X *= np.exp(-((f - 3000) / 2500) ** 2)
    x = np.fft.irfft(X, n); x /= np.max(np.abs(x)) + 1e-9
    return x * (t / dur) ** 2.2 * 0.5
# F major: F, C, Dm, Bb. (sub root, pad voicing, pluck notes)
PROG = [(41, (53, 57, 60, 65), (65, 69, 72, 77)), (36, (52, 55, 60, 64), (64, 67, 72, 76)), (38, (50, 57, 60, 65), (62, 65, 69, 74)), (34, (50, 53, 58, 62), (62, 65, 70, 74))]
ARP = [0, 2, 1, 3, 0, 2, 3, 1]
bars = [(T0 - k * BAR, -1) for k in range(6, 0, -1)]
t = T0; g = 0
while t < LEN: bars.append((t, g)); t += BAR; g += 1
nbars = g
for bar_i, (t, g) in enumerate(bars):
    root, voicing, plk = PROG[bar_i % 4]
    groove = g >= 0
    outro = groove and g >= nbars - 3
    put(pad(voicing, BAR + 0.4), t, pan=0.2, gain=0.9 if groove else 0.55); put(pad(voicing, BAR + 0.4), t, pan=-0.2, gain=0.0)
    if not groove:
        # The intro: filtered plucks on the beat, sparse, the riser over the last two bars.
        for k in (0, 2, 3):
            put(lowpass(pluck(plk[k % 4], 1.4, 0.55), 1200), t + k * BEAT, pan=0.2 * (k - 1))
        continue
    step = BEAT / 2
    for k, idx in enumerate(ARP):
        vel = (0.9 if k % 4 == 0 else 0.62 if k % 2 == 0 else 0.48) * (0.7 if outro else 1.0) * (1 + 0.08 * rng.standard_normal())
        put(pluck(plk[idx] + (12 if k in (3, 7) else 0), 0.9, max(0.3, vel)), t + k * step, pan=0.3 * np.sin(k * 1.3))
    if not outro:
        for b in range(4):
            put(kick(), t + b * BEAT, gain=0.95)
            put(sub(root, BEAT * 0.95), t + b * BEAT, gain=0.9)
            put(sub(root + (12 if b % 2 else 7), BEAT * 0.45), t + b * BEAT + BEAT / 2, gain=0.5)
        put(clap(), t + BEAT, gain=0.8); put(clap(), t + 3 * BEAT, gain=0.8)
        for k in range(16):
            put(hat(open_=(k % 8 == 6)), t + k * BEAT / 4 + (0.008 if k % 2 else 0), pan=0.35, gain=(0.9 if k % 4 == 2 else 0.5 if k % 2 == 0 else 0.35))
put(riser(2 * BAR), T0 - 2 * BAR, gain=0.7)
# The pad pumps under every kick in the groove: a sidechain shaped gain.
duck = np.ones(N)
if True:
    tt = np.arange(N) / SR
    inb = tt >= T0
    ph = ((tt - T0) % BEAT) / BEAT
    duck = np.where(inb, 0.45 + 0.55 * np.clip((ph - 0.04) / 0.5, 0, 1) ** 1.6, 1.0)
mix = np.stack([L, R], axis=1) * duck[:, None]
fade = np.ones(N); fi = int(3.0 * SR); fade[:fi] = np.linspace(0, 1, fi) ** 1.4
fo = int(6.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.3
mix *= fade[:, None]
mix = np.tanh(mix * 1.5) / np.tanh(1.5)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 0.9
pcm = (mix * 32767).astype('<i2').tobytes()
out = os.path.join(os.path.dirname(__file__), '..', 'assets')
wav = os.path.join(out, A.out.replace('.mp3', '.wav')); mp3 = os.path.join(out, A.out)
with wave.open(wav, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3], check=True)
os.remove(wav)
import json
with open(os.path.join(out, 'music.json'), 'w') as fh: json.dump({'file': A.out, 't0': T0, 'len': LEN, 'bpm': BPM}, fh)
print(f'wrote {os.path.relpath(mp3)}  first kick at {T0:.3f}s  {LEN}s  {BPM} bpm')
