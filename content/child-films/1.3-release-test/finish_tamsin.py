"""Turns work/1.3-tamsin.mp4 (made by revoice.py) into the public versions:
the YouTube cut with the stage check end card, the vertical cut for the family
account, and the subtitle file, all on the new timing. Run after revoice.py."""
import json, subprocess, pathlib
from revoice import dur, CUT_A, CUT_B, L
here = pathlib.Path(__file__).parent; W = here / 'work'
ls = json.loads((W / 'revoice-lines.json').read_text())

# Where each line now starts and ends in the re-voiced film.
t, spans = 0.0, []
for k, x in enumerate(ls):
    seg = dur(W / 'tamsin' / f"seg{x['i']:02d}.mp4")
    cut_before = k and ls[k - 1]['e'] <= CUT_A and x['s'] >= CUT_B
    start = 0.0 if k == 0 else (CUT_B if cut_before else x['s'])
    lead = x['s'] - start
    speech = dur(W / 'tamsin' / f"{x['i']:02d}-tight.wav")
    spans.append((t + lead, t + lead + speech))
    t += seg

caps = []
for (s, e), (_, _, lines), x in zip(spans, L, ls):
    lines = list(lines)
    if x['i'] == 29: lines = ['"Stop and ask me. Shall we send it together?"', 'Now the little one answers. "Stop. Ask."']
    lines = [c.replace('DiGi', 'DiGi') for c in lines]
    tot = sum(len(c) for c in lines); c0 = s
    for c in lines:
        d = (e - s) * len(c) / tot; caps.append([c0, c0 + d, c]); c0 += d
for i in range(len(caps) - 1): caps[i][1] = min(caps[i + 1][0], caps[i][1] + 1.0)

def ts(v):
    ms = int(round(v * 1000)); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
(here / 'the-internet-remembers.en-GB.srt').write_text(
    "\n".join(f"{i}\n{ts(s)} --> {ts(e)}\n{c}\n" for i, (s, e, c) in enumerate(caps, 1)))

# Vertical cut: the one big thing, from "Today we learn" (line 6) to the end of line 19.
V0, V1 = spans[6][0] - 0.3, spans[19][1] + 0.6
(W / 'captions.json').write_text(json.dumps(
    [{"s": round(s - V0, 2), "e": round(min(e, V1) - V0, 2), "t": c} for s, e, c in caps if V0 <= s < V1], indent=1))
(W / "vwindow.txt").write_text(f"{V0:.2f} {V1:.2f}\n")
print(len(caps), 'subtitle lines; vertical window', round(V0, 1), 'to', round(V1, 1), f'({V1 - V0:.1f}s)')
