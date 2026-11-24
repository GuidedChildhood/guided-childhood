# Rebuilds a film's sound without rendering the picture again (24 November 2026).
# Reads cuts/<name>.sound.json (written by build.mjs): the music lane and every cue.
#   python3 tools/remix.py film-d08 in.mp4 out.mp4 [--gain 0.65] [--music other.mp3 [--from 20]] [--no-music]
# --gain scales the music only; the taps and chimes stay as they were. The voice
# goes on afterwards with tools/mix-voice.py, as before.
import json, subprocess, sys
name, src, out = sys.argv[1:4]
A = sys.argv[4:]
opt = lambda k, d=None: A[A.index(k) + 1] if k in A else d
S = json.load(open(f'cuts/{name}.sound.json'))
T, m, gain = S['total'], S['music'], float(opt('--gain', 1))
cmd, f, mix = ['ffmpeg', '-v', 'error', '-y', '-i', src], '', []
n = 1
if m and '--no-music' not in A:
    cmd += ['-i', 'assets/' + opt('--music', m['file'])]
    L, e = m['lane'], '0'
    for (t0, v0), (t1, v1) in reversed(list(zip(L, L[1:]))):  # the lane as one nested expression, last segment innermost
        if t1 > t0: e = f"if(lt(t,{t1}),{v0}+({v1}-{v0})*(t-{t0})/{t1 - t0},{e})"
    start = float(opt('--from', m['mediaStart']))
    f += f"[{n}:a]atrim=start={start},asetpts=PTS-STARTPTS,aresample=48000,volume='{gain}*({e})':eval=frame[m];"
    mix.append('[m]'); n += 1
for i, c in enumerate(S['sfx']):
    cmd += ['-i', f"assets/sfx/{c['name']}.mp3"]
    f += f"[{n}:a]aresample=48000,adelay={int(c['at'] * 1000)}:all=1,volume={c.get('vol', 0.4)}[s{i}];"
    mix.append(f'[s{i}]'); n += 1
cmd += ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo']
f += f"[{n}:a]anull[z];" + ''.join(mix) + f"[z]amix=inputs={len(mix) + 1}:normalize=0:duration=longest,atrim=end={T}[a]"
cmd += ['-filter_complex', f, '-map', '0:v', '-map', '[a]', '-t', str(T), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
