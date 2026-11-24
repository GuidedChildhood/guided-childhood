# Lays one voice's six lines over a 30 second ad cut (24 November 2026).
#   python3 tools/mix-ad.py film-d04-ad <bed.mp4> <out.mp4> <voice dir>
# The bed comes from tools/remix.py (music and taps). Each line starts at its
# shot, never before the line ahead of it has finished, and the last is quickened
# just enough to end inside the film. Every voice is brought to one loudness, and
# the music dips under it.
import json, subprocess, sys
name, src, out, vd = sys.argv[1:5]
C = json.load(open(f'cuts/{name}.json')); st, t = {}, 0
for s in C['shots']: st[s['id']] = t; t += s['dur']
TOTAL = t
want = [0.2, st['reply1'] + 2.4, st['deck'] + 1.0, st['followup'] + 0.2, st['great'] + 0.5, st['end'] - 1.0]  # the last line leads into the end card
dur = lambda f: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
vol = lambda f: float([l for l in subprocess.run(['ffmpeg', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr.split('\n') if 'mean_volume' in l][0].split(':')[1].split()[0])
cmd, f, end = ['ffmpeg', '-v', 'error', '-y', '-i', src], '', 0
for i in range(6):
    p = f'{vd}/{i}.mp3'; d = dur(p); cmd += ['-i', p]
    tempo = 1.06 if i == 0 else 1.0
    start = max(want[i], end + 0.25)
    if i == 5 and start + d / tempo > TOTAL - 0.25: tempo = d / (TOTAL - 0.25 - start)
    end = start + d / tempo
    gain = 10 ** ((-17.5 - vol(p)) / 20)  # every voice to the same level
    f += f'[{i+1}:a]aresample=48000,atempo={tempo:.3f},volume={gain:.3f},adelay={int(start*1000)}:all=1[v{i}];'
    print(f'  line {i}: {start:.1f} to {end:.1f}' + (f' (x{tempo:.2f})' if tempo != 1 else ''))
f += ''.join(f'[v{i}]' for i in range(6)) + 'amix=inputs=6:normalize=0,asplit=2[vo][sc];'
f += '[0:a][sc]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=600[bed];[bed][vo]amix=inputs=2:duration=first:normalize=0[a]'
cmd += ['-filter_complex', f, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
