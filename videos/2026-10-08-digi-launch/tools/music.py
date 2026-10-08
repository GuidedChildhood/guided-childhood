#!/usr/bin/env python3
# The score, generated locally. No catalogue was reachable (no HeyGen sign
# in, no Lyria key, no MusicGen weights on this Mac), and the brief allows a
# local generate, so the track is composed in code: a warm keynote underscore
# in C major at 105 bpm. Piano style plucks over a soft pad, a gentle kick and
# bass pulse, a quiet shaker. The first kick lands at exactly 8.0 seconds
# (fourteen beats of intro), which is where "Introducing" cuts in. Length
# 48 seconds; the build fades it under the end card. Deterministic: the same
# file every run. Licence: ours, nothing sampled.
import numpy as np, subprocess, os, wave
SR = 48000; BPM = 105.0; BEAT = 60 / BPM; BAR = 4 * BEAT
LEN = 48.0; N = int(LEN * SR)
INTRO_BEATS = 14  # 14 * 0.5714 = 8.0 s
T0 = INTRO_BEATS * BEAT
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def put(buf, sig, t, pan=0.0, gain=1.0):
    s = int(round(t * SR))
    if s < 0:
        sig = sig[-s:]; s = 0
    if s >= N or len(sig) == 0: return
    seg = sig[:N - s] * gain
    L[s:s + len(seg)] += seg * (1 - max(0, pan))
    R[s:s + len(seg)] += seg * (1 + min(0, pan))

def envelope(n, a, d, s_level, r, curve=4.0):
    e = np.zeros(n); aN = max(1, int(a * SR)); dN = max(1, int(d * SR)); rN = max(1, int(r * SR))
    body = n - rN
    i = 0
    e[:min(aN, n)] = np.linspace(0, 1, min(aN, n)); i = aN
    if i < body:
        dec = np.exp(-np.linspace(0, curve, dN)) * (1 - s_level) + s_level
        e[i:min(i + dN, body)] = dec[:max(0, min(dN, body - i))]; i += dN
    if i < body: e[i:body] = s_level
    if rN < n: e[body:] = e[body - 1] * np.linspace(1, 0, rN) if body > 0 else 0
    return e

def pluck(note, dur, vel=1.0):
    # A piano like tone: harmonics that decay faster the higher they are.
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(note)
    s = np.zeros(n)
    for k, w in enumerate((1.0, 0.5, 0.25, 0.14, 0.08, 0.05)):
        s += w * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (2.2 + k * 1.6))
    s *= envelope(n, 0.003, dur * 0.8, 0.0, 0.03, 3.0)
    return s * vel * 0.5

def pad_chord(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for nt in notes:
        f = midi(nt)
        for det in (-0.25, 0.25):
            fd = f * 2 ** (det / 12 / 4)
            s += np.sin(2 * np.pi * fd * t) + 0.35 * np.sin(2 * np.pi * fd * 2 * t) + 0.12 * np.sin(2 * np.pi * fd * 3 * t)
    s /= (len(notes) * 2 * 1.5)
    return s * envelope(n, 0.9, 0.5, 0.85, 0.9, 2.0) * 0.32

def kick(t=0.26):
    n = int(t * SR); x = np.arange(n) / SR
    f = 42 + 110 * np.exp(-x * 26)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 11) * 0.9

def bass(note, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return s * envelope(n, 0.01, dur * 0.7, 0.2, 0.05, 3.0) * 0.5

def shaker(dur=0.09):
    n = int(dur * SR); x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X *= (f > 5000) * np.exp(-(f - 9000) ** 2 / (2 * 3000 ** 2))
    x = np.fft.irfft(X, n); x /= np.max(np.abs(x)) + 1e-9
    return x * np.exp(-np.arange(n) / SR * 60) * 0.22

# I V vi IV in C, voiced warm. (root, pad voicing, arp notes)
PROG = [
    (48, (48, 55, 64, 67, 71), (60, 64, 67, 71, 72)),   # Cmaj7
    (43, (43, 55, 62, 66, 67), (59, 62, 67, 69, 71)),   # G add9
    (45, (45, 52, 60, 64, 67), (57, 60, 64, 67, 69)),   # Am7
    (41, (41, 53, 60, 64, 69), (57, 60, 65, 69, 72)),   # Fmaj7 add6
]
# Arpeggio pattern over 8 eighth notes, indexes into the arp notes.
ARP = [0, 2, 4, 2, 1, 3, 4, 3]
MOTIF = [(0, 72), (1.5, 71), (2, 67), (3, 69)]  # beat offset, note: the four bar lead line

# Four intro bars counted back from the kick (the first starts before zero and is clipped), then the groove from T0.
bars = [(T0 - k * BAR, -1) for k in range(4, 0, -1)]
t = T0; g = 0
while t < LEN:
    bars.append((t, g)); t += BAR; g += 1
for bar_i, (t, g) in enumerate(bars):
    root, voicing, arp = PROG[bar_i % 4]
    in_groove = g >= 0
    section = g if in_groove else -1
    # Pad, every bar, from the very start.
    put(L, pad_chord(voicing, BAR + 0.6), t, pan=0.15, gain=1.0); put(R, pad_chord(voicing, BAR + 0.6), t, pan=-0.15, gain=0.0)
    # Sparse piano in the intro, a full arpeggio in the groove.
    if not in_groove:
        for k, nt in enumerate(arp[:3]):
            put(L, pluck(nt, 2.0, 0.55 - k * 0.1), t + k * BEAT * 1.0, pan=0.1 * (k - 1))
    else:
        bright = 1.0 if section < 11 else 0.75   # thin out under the end card
        for k, idx in enumerate(ARP):
            vel = (0.7 if k % 2 == 0 else 0.5) * bright * (1 + 0.12 * rng.standard_normal())
            put(L, pluck(arp[idx], 1.2, max(0.2, vel)), t + k * BEAT / 2, pan=0.25 * np.sin(k))
        # The lead motif every other bar, an octave up on the lift.
        if bar_i % 2 == 0 and section < 13:
            up = 12 if 10.5 <= section < 13 else 0
            for off, nt in MOTIF:
                put(L, pluck(nt + up, 1.6, 0.8 * bright), t + off * BEAT, pan=-0.1)
        # Kick and bass on 1 and 3, shaker on every eighth, until the outro.
        if section < 13.5:
            for b in (0, 2):
                put(L, kick(), t + b * BEAT, gain=0.75)
                put(L, bass(root - 12 if root >= 48 else root, BEAT * 1.6), t + b * BEAT, gain=0.8)
            for k in range(8):
                put(L, shaker(), t + k * BEAT / 2 + (0.012 if k % 2 else 0), pan=0.3, gain=0.5 if k % 2 == 0 else 0.3)

mix = np.stack([L, R], axis=1)
# A gentle fade in over the intro so the pad swells rather than switches on.
fade = np.ones(N); fi = int(2.5 * SR); fade[:fi] = np.linspace(0, 1, fi) ** 1.5
fo = int(5.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 1.2
mix *= fade[:, None]
mix = np.tanh(mix * 1.6) / np.tanh(1.6)
mix /= np.max(np.abs(mix)) + 1e-9; mix *= 0.89
pcm = (mix * 32767).astype('<i2').tobytes()
out = os.path.join(os.path.dirname(__file__), '..', 'assets')
wav = os.path.join(out, 'music-keynote.wav'); mp3 = os.path.join(out, 'music-keynote.mp3')
with wave.open(wav, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3], check=True)
os.remove(wav)
print(f'wrote {os.path.relpath(mp3)}  first kick at {T0:.3f}s  {LEN}s  {BPM} bpm')
