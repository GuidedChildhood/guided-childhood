"""Re-voices film 1.3 in DiGi's chosen voice (Tamsin, speech rate minus 10).

Step 1, `python3 revoice.py lines`: writes work/revoice-lines.json, one line per
spoken stretch of the original film, with the name respelled "Didgee" so it is
said the way the app says it. Each line is generated on Higgsfield (seed_audio,
preset 9eb5a147-c322-4f8a-8bc5-a30679dfaf5c, speech_rate -10) and saved as
work/tamsin/NN.mp3, recorded in work/tamsin/ledger.tsv.

Step 2, `python3 revoice.py build <film>`: lays each new line over its own
picture window from the original film, slowing that window to fit the new read,
keeps the original pause after each line, drops the closing promise line, and
writes work/1.3-tamsin.mp4 (picture and voice, no end card).
"""
import json, sys, subprocess, pathlib, re
here = pathlib.Path(__file__).parent; W = here / 'work'
sys.path.insert(0, str(here))
from captions import L, CUT_A, CUT_B

def lines():
    out = []
    for i, (s, e, caps) in enumerate(L):
        text = ' '.join(caps).replace('DiGi', 'Didgee')
        out.append({'i': i, 's': s, 'e': e, 'text': text})
    (W / 'revoice-lines.json').write_text(json.dumps(out, indent=1))
    print(len(out), 'lines,', sum(len(x['text'].split()) for x in out), 'words')

def dur(p):
    return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)],capture_output=True,text=True).stdout)

def tighten(p):
    """The generator pads every line with silence and leaves pauses of a second
    or more between sentences. Trim both ends and keep at most 0.45 s of any
    pause, so the read sounds like one person talking, not a list."""
    out = p.with_name(p.stem + '-tight.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(p), '-af',
        'silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,'
        'silenceremove=stop_periods=-1:stop_duration=0.45:stop_threshold=-40dB:stop_silence=0.45,'
        'areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse',
        str(out)], check=True)
    return out

def build(src):
    ls = json.loads((W / 'revoice-lines.json').read_text())
    film_end = dur(src)
    parts, n = [], len(ls)
    for k, x in enumerate(ls):
        cut_before = k and ls[k - 1]['e'] <= CUT_A and x['s'] >= CUT_B
        cut_after = k + 1 < n and x['e'] <= CUT_A and ls[k + 1]['s'] >= CUT_B
        start = 0.0 if k == 0 else (CUT_B if cut_before else x['s'])
        end = film_end if k + 1 == n else (CUT_A + 0.3 if cut_after else ls[k + 1]['s'])
        lead = x['s'] - start                          # silence before the line
        gap = max(0.35, min(1.6, end - x['e']))        # the pause after the line
        a = tighten(W / 'tamsin' / f"{x['i']:02d}.mp3")
        new_len = lead + dur(a) + gap
        f = new_len / (end - start)                    # how much this picture is slowed
        seg = W / 'tamsin' / f"seg{x['i']:02d}.mp4"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{start}', '-t', f'{end - start}', '-i', str(src), '-i', str(a),
            '-filter_complex',
            f"[0:v]setpts={f:.5f}*(PTS-STARTPTS),fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration=1,trim=0:{new_len:.3f}[v];"
            f"[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(lead * 1000)}:all=1,apad,atrim=0:{new_len:.3f}[a]",
            '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '20', '-preset', 'fast', '-r', '30',
            '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', str(seg)], check=True)
        parts.append(seg)
    lst = W / 'tamsin' / 'list.txt'
    lst.write_text(''.join(f"file '{p.name}'\n" for p in parts))
    out = W / '1.3-tamsin.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(out)], check=True)
    print('built', round(dur(out), 1), 'seconds from', len(parts), 'lines')

if __name__ == '__main__':
    lines() if sys.argv[1] == 'lines' else build(sys.argv[2])
