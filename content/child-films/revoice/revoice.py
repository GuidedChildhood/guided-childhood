"""Re-voices a children's lesson film in DiGi's chosen voice (Tamsin, speech
rate minus 10), the way film 1.3 was done. Every step takes the film's folder,
which holds film.json (the spoken lines, the cut, the vertical window and the
card words).

  python3 revoice.py <folder> lines        writes work/revoice-lines.json and a
                                           committed copy, tamsin-lines.json
  python3 revoice.py <folder> build <film> lays each new line over its own
                                           picture window, slowing the picture
                                           to fit the new read
  python3 revoice.py <folder> finish       subtitles on the new timeline and the
                                           vertical window, ready for build.sh

Each line is generated on Higgsfield (seed_audio, preset
9eb5a147-c322-4f8a-8bc5-a30679dfaf5c, speech_rate -10), saved as
work/tamsin/NN.mp3 and recorded in tamsin-ledger.tsv in the film folder.

film.json:
  slug         output file names, e.g. "the-internet-remembers"
  work_film    the re-voiced film in work/ (default "revoiced.mp4")
  lines        [{s, e, caps: [caption, ...], say?}] one per spoken stretch of
               the original. say is the text sent to the voice; by default the
               captions joined, with DiGi respelled Didgee
  cut          [CUT_A, CUT_B]: the picture between them is removed (the closing
               promise to the grown up). CUT_B may be null when the cut runs to
               the end of the film. Omit for no cut
  vertical     [first line, last line] of the one big thing, for the family cut
  still        seconds into the original film for the thumbnail picture
  thumb_title, thumb_sub, hook   words for cards.mjs
"""
import json, os, sys, subprocess, pathlib

# Which recorded voice: 'tamsin' (Seed Audio, the first re-voice) or 'isla'
# (ElevenLabs Isla, chosen by Justin by ear on 16 November 2026). Lines live in
# work/<voice>/NN.mp3 and are recorded in <voice>-ledger.tsv.
V = os.environ.get('VOICE', 'tamsin')

def cfg(folder):
    d = pathlib.Path(folder).resolve()
    c = json.loads((d / 'film.json').read_text())
    c['dir'], c['work'] = d, d / 'work'
    cut = c.get('cut') or [None, None]
    c['CUT_A'], c['CUT_B'] = cut
    return c

def say(x):
    return x.get('say') or ' '.join(x['caps']).replace('DiGi', 'Didgee')

def lines(c):
    out = [{'i': i, 's': x['s'], 'e': x['e'], 'text': say(x)} for i, x in enumerate(c['lines'])]
    c['work'].mkdir(exist_ok=True)
    txt = json.dumps(out, indent=1)
    (c['work'] / 'revoice-lines.json').write_text(txt)
    (c['dir'] / f'{V}-lines.json').write_text(txt)
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

def windows(c, ls, film_end):
    """The picture window (start, end) of the original film behind each line.
    A window never reaches into the cut: the line before it stops 0.3 s after
    CUT_A and the line after it starts at CUT_B."""
    A, B, n, res = c['CUT_A'], c['CUT_B'], len(ls), []
    for k, x in enumerate(ls):
        after_cut = A is not None and B is not None and k and ls[k - 1]['e'] <= A and x['s'] >= B
        before_cut = A is not None and x['e'] <= A and (k + 1 == n if B is None else k + 1 < n and ls[k + 1]['s'] >= B)
        start = 0.0 if k == 0 else (B if after_cut else x['s'])
        end = A + 0.3 if before_cut else (film_end if k + 1 == n else ls[k + 1]['s'])
        res.append((start, end))
    return res

def build(c, src):
    W = c['work']; ls = json.loads((W / 'revoice-lines.json').read_text())
    if c.get('still') is not None:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(c['still']), '-i', str(src), '-frames:v', '1', str(W / 'still.png')], check=True)
    parts = []
    for x, (start, end) in zip(ls, windows(c, ls, dur(src))):
        lead = x['s'] - start                          # silence before the line
        gap = max(0.35, min(1.6, end - x['e']))        # the pause after the line
        a = tighten(W / V / f"{x['i']:02d}.mp3")
        new_len = lead + dur(a) + gap
        f = new_len / (end - start)                    # how much this picture is slowed
        seg = W / V / f"seg{x['i']:02d}.mp4"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{start}', '-t', f'{end - start}', '-i', str(src), '-i', str(a),
            '-filter_complex',
            f"[0:v]setpts={f:.5f}*(PTS-STARTPTS),fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration=1,trim=0:{new_len:.3f}[v];"
            f"[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(lead * 1000)}:all=1,apad,atrim=0:{new_len:.3f}[a]",
            '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '20', '-preset', 'fast', '-r', '30',
            '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', str(seg)], check=True)
        parts.append(seg)
    lst = W / V / 'list.txt'
    lst.write_text(''.join(f"file '{p.name}'\n" for p in parts))
    out = W / c.get('work_film', 'revoiced.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(out)], check=True)
    print('built', round(dur(out), 1), 'seconds from', len(parts), 'lines')

def ts(v):
    ms = int(round(v * 1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"

def finish(c):
    """Subtitles on the new timeline, the vertical captions and window."""
    W = c['work']; ls = json.loads((W / 'revoice-lines.json').read_text())
    t, spans = 0.0, []                 # where each line now starts and ends
    for x, (start, _) in zip(ls, windows(c, ls, 1e9)):
        lead = x['s'] - start
        speech = dur(W / V / f"{x['i']:02d}-tight.wav")
        spans.append((t + lead, t + lead + speech))
        t += dur(W / V / f"seg{x['i']:02d}.mp4")
    caps = []
    for (s, e), line in zip(spans, c['lines']):
        tot = sum(len(k) for k in line['caps']); c0 = s
        for k in line['caps']:
            d = (e - s) * len(k) / tot; caps.append([c0, c0 + d, k]); c0 += d
    for i in range(len(caps) - 1): caps[i][1] = min(caps[i + 1][0], caps[i][1] + 1.0)
    (c['dir'] / f"{c['slug']}.en-GB.srt").write_text(
        "\n".join(f"{i}\n{ts(s)} --> {ts(e)}\n{k}\n" for i, (s, e, k) in enumerate(caps, 1)))
    a, b = c['vertical']
    V0, V1 = spans[a][0] - 0.3, spans[b][1] + 0.6
    (W / 'captions.json').write_text(json.dumps(
        [{"s": round(s - V0, 2), "e": round(min(e, V1) - V0, 2), "t": k} for s, e, k in caps if V0 <= s < V1], indent=1))
    (W / "vwindow.txt").write_text(f"{V0:.2f} {V1:.2f}\n")
    print(len(caps), 'subtitle lines; vertical window', round(V0, 1), 'to', round(V1, 1), f'({V1 - V0:.1f}s)')

if __name__ == '__main__':
    c = cfg(sys.argv[1]); step = sys.argv[2]
    {'lines': lambda: lines(c), 'build': lambda: build(c, sys.argv[3]), 'finish': lambda: finish(c)}[step]()
