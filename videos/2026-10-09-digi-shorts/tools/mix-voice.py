# Lays Imogen's lines over a rendered film, one line per beat, with the music
# dipping under her (22 November 2026). The lines live in assets/vo.
#   python3 tools/mix-voice.py a renders/out/three-a-simple.mp4 out.mp4
import subprocess, sys
ONGOING = False
k, src, out = sys.argv[1:4]
her, research = ('his' if k == 'b' else 'her'), f'{k}-research'
if k not in 'abc':  # a film from cuts/films.json: its own opening, shared lines for the rest
    import json
    D = json.load(open('cuts/films.json')); f = next(x for x in D['films'] if x['key'] == k)
    her, research = D['cast'][f['child']]['pos'], D['research'][f['research']]['vo']
    ONGOING = f.get('ending') == 'ongoing'  # a film that does not end on Sorted leaves that line out
LINES = [(0.4, f'{k}-open'), (7.9, 'starts'), (10.9, 'steps'), (18.3, f'checkin-{her}'), (25.4, 'words'),
         (30.9, 'later'), (37.4, 'sorted'), (41.0, 'learns'), (46.6, research), (52.7, 'end')]
TEMPO = {}
if len(sys.argv) > 4 and sys.argv[4] == 'ad':  # the 30 second ad cut: six of the lines, the opening a touch quicker
    LINES = [(0.2, f'{k}-open'), (5.9, 'steps'), (11.4, 'words'), (15.4, 'later'), (19.4, 'sorted'), (25.5, 'end')]
    TEMPO = {0: 1.15, 1: 1.05}
import os
LINES = [(t, n) for t, n in LINES if not (ONGOING and n == 'sorted')]
LINES = [(t, n) for t, n in LINES if os.path.exists(f'assets/vo/{n}.mp3')]  # a line not recorded yet is left out, the rest still play
cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src]
for _, n in LINES: cmd += ['-i', f'assets/vo/{n}.mp3']
f = ''
for i, (t, n) in enumerate(LINES):
    tempo = ',atempo=1.1' if n == 'a-research' else ''
    if i in TEMPO: tempo = f',atempo={TEMPO[i]}'
    elif i == 0:  # the opening must finish before the next line at 7.9s: quicken it a touch if it runs long
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'assets/vo/{n}.mp3']))
        if d > 7.1: tempo = f',atempo={d / 7.1:.3f}'
    f += f'[{i+1}:a]aresample=48000{tempo},adelay={int(t*1000)}:all=1,volume=1.5[v{i}];'
f += ''.join(f'[v{i}]' for i in range(len(LINES))) + f'amix=inputs={len(LINES)}:normalize=0,asplit=2[vo][sc];'
f += '[0:a][sc]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=600[bed];[bed][vo]amix=inputs=2:duration=first:normalize=0[a]'
cmd += ['-filter_complex', f, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
