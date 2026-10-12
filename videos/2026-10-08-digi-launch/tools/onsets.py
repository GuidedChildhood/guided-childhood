#!/usr/bin/env python3
# Where does a track start hitting? Decodes to mono, prints the loudness every
# second and the first few strong onsets (a jump in low band energy), so the
# build can put the first kick on "Introducing".
import numpy as np, subprocess, sys
f = sys.argv[1]; SR = 22050
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, dtype='<i2').astype(np.float64) / 32768
# Low band for kicks.
X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR); low = np.fft.irfft(X * (fr < 160), len(x))
hop = int(0.01 * SR); n = len(x) // hop
e = np.array([np.sqrt(np.mean(low[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
full = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
print(f'duration {len(x)/SR:.2f}s')
print('loudness per 2s (dB):', ' '.join(f'{t*2:>3d}s {20*np.log10(np.mean(full[t*200:(t+1)*200])+1e-9):5.1f}' for t in range(min(60, n // 200))))
# Onsets: low band energy jumping well above the previous 150 ms, and above a floor.
floor = np.percentile(e, 85) * 0.5
ons = []
for i in range(15, n):
    prev = np.mean(e[i - 15:i - 3]); 
    if e[i] > floor and e[i] > prev * 3.0 and (not ons or i * 0.01 - ons[-1] > 0.25): ons.append(i * 0.01)
print('first low band onsets (s):', ' '.join(f'{t:.2f}' for t in ons[:12]))
if len(ons) > 6:
    d = np.diff(ons[:24]); d = d[(d > 0.3) & (d < 1.2)]
    if len(d): print(f'beat spacing around {np.median(d):.3f}s, about {60/np.median(d):.0f} bpm')
