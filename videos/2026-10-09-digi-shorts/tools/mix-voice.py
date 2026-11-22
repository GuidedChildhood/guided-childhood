# Lays Imogen's lines over a rendered film, one line per beat, with the music
# dipping under her (22 November 2026). The lines live in assets/vo.
#   python3 tools/mix-voice.py a renders/out/three-a-simple.mp4 out.mp4
import subprocess, sys
k, src, out = sys.argv[1:4]
her = 'his' if k == 'b' else 'her'
LINES = [(0.4, f'{k}-open'), (7.9, 'starts'), (10.9, 'steps'), (18.3, f'checkin-{her}'), (25.4, 'words'),
         (30.9, 'later'), (37.4, 'sorted'), (41.0, 'learns'), (46.6, f'{k}-research'), (52.7, 'end')]
cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src]
for _, n in LINES: cmd += ['-i', f'assets/vo/{n}.mp3']
f = ''
for i, (t, n) in enumerate(LINES):
    tempo = ',atempo=1.1' if n == 'a-research' else ''
    f += f'[{i+1}:a]aresample=48000{tempo},adelay={int(t*1000)}:all=1,volume=1.5[v{i}];'
f += ''.join(f'[v{i}]' for i in range(len(LINES))) + f'amix=inputs={len(LINES)}:normalize=0,asplit=2[vo][sc];'
f += '[0:a][sc]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=600[bed];[bed][vo]amix=inputs=2:duration=first:normalize=0[a]'
cmd += ['-filter_complex', f, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out]
subprocess.run(cmd, check=True)
