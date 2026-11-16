"""Builds the 1.6 pair from the pictures in pics/, Tamsin's lines in audio/ and
lines.json. Nothing here uploads anything.

  python3 build.py overlays   writes work/overlays.json (every word set on screen)
  node overlays.mjs           draws those as transparent PNGs in the house fonts
  python3 build.py films      renders every cut into ../films/

Cuts:
  child product, full and A, B, C   16:9, the shape the Watch together player uses
  child YouTube                     16:9, no recap, stage check end card, subtitles
  child family                      9:16, the one big idea, full captions, stage check
  parent family                     9:16, captions, stage check
  parent product                    9:16, ends at "Book a watch together time"
  parent landscape                  16:9 of the same

Every word a viewer reads is set in HTML in Nunito and IBM Plex Mono, never
inside a generated picture. The pictures move with a slow push in or out,
continuous across lines that share a picture. No music: DiGi's voice only.
"""
import json, sys, subprocess, pathlib, re, html

HERE = pathlib.Path(__file__).parent
W = HERE / 'work'; W.mkdir(exist_ok=True)
OUT = HERE.parent / 'films'; OUT.mkdir(exist_ok=True)
L = json.loads((HERE / 'lines.json').read_text())
CREAM = '0xF9F8F6'
FPS = 30

def run(args):
    subprocess.run(args, check=True)

def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)],
                                capture_output=True, text=True).stdout)

def tight(i):
    """The generator pads lines with silence. Trim both ends and keep at most
    0.45 s of any pause inside the line (the 1.3 re-voice rule)."""
    src = HERE / 'audio' / f'{i:02d}.wav'; out = W / f't{i:02d}.wav'
    if not out.exists():
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-af',
             'silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,'
             'silenceremove=stop_periods=-1:stop_duration=0.45:stop_threshold=-40dB:stop_silence=0.45,'
             'areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse,'
             'aresample=48000,aformat=channel_layouts=stereo', str(out)])
    return out

def say(t):
    """Spoken text says Didgee; everything a viewer reads says DiGi."""
    return t.replace('Didgee', 'DiGi')

def chunks(text, limit=64):
    """Caption chunks: whole sentences, merged while they fit."""
    parts = re.findall(r'[^.?!:]+[.?!:]?', say(text))
    parts = [p.strip() for p in parts if p.strip()]
    out = []
    for p in parts:
        if out and len(out[-1]) + 1 + len(p) <= limit:
            out[-1] += ' ' + p
        else:
            out.append(p)
    return out

# ── Lines in order, with their audio and timing ─────────────────────────────
ALL = L['child'] + L['parent']
for k, x in enumerate(ALL):
    x['n'] = k

CARDS = {
    'ask1': ('Grown up, ask:', 'What helps YOU feel sleepy?', 'Older child: What is the last thing you do before you go to sleep?'),
    'ask2': ('Grown up, ask:', 'What shall our three cosy things be?', 'Older child: Where shall the screens sleep in our house?'),
}

def timeline(lines, card_hold=4.0):
    """Places every line on a clock. Returns segments: one per line, each with
    its picture spans, its audio offset and its length."""
    segs, t = [], 0.0
    for j, x in enumerate(lines):
        a = tight(x['n']); ad = dur(a)
        prev = lines[j - 1] if j else None
        nxt = lines[j + 1] if j + 1 < len(lines) else None
        new_shot = not prev or prev['pics'][-1] != x['pics'][0]
        lead = 0.45 if new_shot else 0.2
        if x.get('card'):
            gap = card_hold
        elif not nxt:
            gap = 1.6
        elif nxt['pics'][0] != x['pics'][-1]:
            gap = 0.9
        else:
            gap = 0.6
        length = lead + ad + gap
        n = len(x['pics'])
        spans = [(x['pics'][q], q * length / n, (q + 1) * length / n) for q in range(n)]
        segs.append({'line': x, 'audio': a, 'adur': ad, 'lead': lead, 'start': t, 'len': length, 'spans': spans})
        t += length
    return segs

def shots(segs):
    """Groups contiguous time on one picture into shots, so the slow push
    carries on across lines instead of restarting."""
    out = []
    for s in segs:
        for (pic, a, b) in s['spans']:
            ga, gb = s['start'] + a, s['start'] + b
            if out and out[-1]['pic'] == pic and abs(out[-1]['end'] - ga) < 1e-6:
                out[-1]['end'] = gb
            else:
                out.append({'pic': pic, 'start': ga, 'end': gb})
    for k, sh in enumerate(out):
        sh['dir'] = k % 2       # alternate push in and pull out
    return out

def zoom_at(sh, t):
    f = (t - sh['start']) / max(sh['end'] - sh['start'], 1e-6)
    z0, z1 = (1.0, 1.07) if sh['dir'] == 0 else (1.07, 1.0)
    return z0 + (z1 - z0) * f

# ── Layouts ──────────────────────────────────────────────────────────────────
LAND = {'W': 1920, 'H': 1080, 'box': (0, 0, 1920, 1080)}
PORT = {'W': 1080, 'H': 1920, 'box': (0, 640, 1080, 608)}       # child portrait: the picture full width
PPORT = {'W': 1080, 'H': 1920, 'box': (0, 0, 1080, 1350)}       # parent portrait: a 4:5 picture on top
PLAND = {'W': 1920, 'H': 1080, 'box': (0, 0, 1080, 1080)}       # parent landscape: a square picture on the left

def pic_path(pic):
    # "p22@0.85" means picture p22, cropped with its centre of interest 85
    # percent of the way across, for a picture whose characters sit off centre.
    return HERE / 'pics' / f"{pic.split('@')[0]}.png"

def focal(pic):
    return float(pic.split('@')[1]) if '@' in pic else 0.5

def render_piece(path, lay, piece, overlay_png, audio=None, alead=0.0, fade_in=False, fade_out=False):
    """One piece of film: a picture moving inside its box on cream, with a
    transparent overlay of words on top and, optionally, one voice line."""
    x, y, bw, bh = lay['box']
    T = piece['len']
    pic = piece['pic']
    z0, z1 = piece['z0'], piece['z1']
    nfr = max(int(round(T * FPS)), 1)
    if pic in ('words', 'thanks', 'blank'):
        vsrc = ['-f', 'lavfi', '-i', f'color=c={CREAM}:s={lay["W"]}x{lay["H"]}:r={FPS}:d={T:.3f}']
        filt = '[0:v]format=rgba[bg];'
        base = 'bg'
    else:
        src = pic_path(pic)
        # Crop the picture to the box's shape around its centre, upscale x2 so
        # the slow push is smooth, then zoom from z0 to z1 across the piece.
        if pic == 'screen':
            vsrc = ['-loop', '1', '-framerate', str(FPS), '-t', f'{T:.3f}', '-i', str(src)]
            filt = (f'color=c={CREAM}:s={lay["W"]}x{lay["H"]}:r={FPS}:d={T:.3f},format=rgba[bg];'
                    f'[0:v]crop=1170:830:0:1370,scale={min(bw - 80, 980)}:-2,format=rgba[ph];'
                    f'[bg][ph]overlay=x={x}+({bw}-w)/2:y={y}+({bh}-h)/2[b0];')
            base = 'b0'
        else:
            vsrc = ['-loop', '1', '-framerate', str(FPS), '-t', f'{T:.3f}', '-i', str(src)]
            zexpr = f'{z0:.5f}+({z1 - z0:.5f})*on/{nfr}'
            filt = (f'color=c={CREAM}:s={lay["W"]}x{lay["H"]}:r={FPS}:d={T:.3f},format=rgba[bg];'
                    f'[0:v]crop=\'min(iw,ih*{bw}/{bh})\':\'min(ih,iw*{bh}/{bw})\':\'(iw-out_w)*{focal(pic)}\':\'(ih-out_h)/2\',scale={bw * 2}:{bh * 2},'
                    f'zoompan=z=\'{zexpr}\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=1:s={bw}x{bh}:fps={FPS},'
                    f'trim=duration={T:.3f},setpts=PTS-STARTPTS,format=rgba[pc];'
                    f'[bg][pc]overlay=x={x}:y={y}[b0];')
            base = 'b0'
    inputs = vsrc + ['-loop', '1', '-framerate', str(FPS), '-t', f'{T:.3f}', '-i', str(overlay_png)]
    oi = 1
    filt += f'[{base}][{oi}:v]overlay=0:0,format=yuv420p'
    if fade_in:
        filt += f',fade=t=in:st=0:d=0.3:color={CREAM}'
    if fade_out:
        filt += f',fade=t=out:st={max(T - 0.3, 0):.3f}:d=0.3:color={CREAM}'
    filt += f',trim=duration={T:.3f}[v]'
    if audio:
        inputs += ['-i', str(audio)]
        filt += (f';[2:a]adelay={int(alead * 1000)}:all=1,apad,atrim=0:{T:.3f},'
                 'aresample=48000,aformat=channel_layouts=stereo[a]')
    else:
        inputs += ['-f', 'lavfi', '-t', f'{T:.3f}', '-i', 'anullsrc=r=48000:cl=stereo']
        filt += ';[2:a]atrim=0:%.3f[a]' % T
    run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', filt, '-map', '[v]', '-map', '[a]',
         '-r', str(FPS), '-c:v', 'libx264', '-crf', '19', '-preset', 'fast', '-pix_fmt', 'yuv420p',
         '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', str(path)])

def pieces_for(segs):
    """Cuts every segment into pieces at picture changes, carrying each shot's
    zoom across the pieces it spans."""
    shs = shots(segs)
    out = []
    for s in segs:
        for (pic, a, b) in s['spans']:
            ga, gb = s['start'] + a, s['start'] + b
            sh = next(h for h in shs if h['pic'] == pic and h['start'] - 1e-6 <= ga and gb <= h['end'] + 1e-6)
            out.append({'seg': s, 'pic': pic, 'len': gb - ga, 'z0': zoom_at(sh, ga), 'z1': zoom_at(sh, gb),
                        'first_of_shot': abs(sh['start'] - ga) < 1e-6, 'last_of_shot': abs(sh['end'] - gb) < 1e-6,
                        'local': a, 'gstart': ga})
    return out

def overlay_key(cut, line, extra=''):
    return f'{cut}-{line["id"]}{extra}'

def concat(parts, out):
    lst = W / (out.stem + '-list.txt')
    lst.write_text(''.join(f"file '{p}'\n" for p in parts))
    tmp = W / (out.stem + '-raw.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(tmp)])
    # One loudness for the whole film, video copied untouched.
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp), '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
         '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', str(out)])

def srt(segs, path, offset=0.0):
    def ts(t):
        h, r = divmod(t, 3600); m, s = divmod(r, 60)
        return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}'
    rows, k = [], 1
    for s in segs:
        cs = chunks(s['line']['text'], 64)
        total = sum(len(c) for c in cs)
        t = s['start'] + s['lead'] + offset
        for c in cs:
            d = s['adur'] * len(c) / total
            rows.append(f'{k}\n{ts(t)} --> {ts(t + d)}\n{c}\n'); k += 1; t += d
    path.write_text('\n'.join(rows))

# ── Cuts ─────────────────────────────────────────────────────────────────────
CHILD = L['child']
CUTS = {
    'child-product': {'lay': LAND, 'lines': CHILD, 'caps': False},
    'child-youtube': {'lay': LAND, 'lines': [x for x in CHILD if not x.get('product_only')], 'caps': False,
                      'end': 'end-16x9.png', 'end_len': 6},
    'child-family': {'lay': PORT, 'lines': [x for x in CHILD if x['id'] in
                     ('c01', 'c06', 'c07', 'c13', 'c14', 'c15', 'c16', 'c19', 'c25', 'c26', 'c29')],
                     'caps': True, 'end': 'end-9x16.png', 'end_len': 5, 'hook': 'One bedtime rule a five year old can say back'},
    'parent-family': {'lay': PPORT, 'lines': L['parent'], 'caps': True, 'end': 'end-9x16.png', 'end_len': 5},
    'parent-product': {'lay': PPORT, 'lines': L['parent'], 'caps': True, 'end': 'book-9x16.png', 'end_len': 4},
    'parent-landscape': {'lay': PLAND, 'lines': L['parent'], 'caps': True, 'end': 'end-16x9.png', 'end_len': 6},
}

def overlays():
    """Every overlay PNG the films need, as HTML for overlays.mjs to draw."""
    specs = []
    for cut, c in CUTS.items():
        lay = c['lay']; Wd, Ht = lay['W'], lay['H']
        for x in c['lines']:
            key = overlay_key(cut, x)
            parts = []
            if c['caps']:
                cs = chunks(x['text'], 64 if cut.startswith('child') else 72)
                for q, ctext in enumerate(cs):
                    specs.append({'file': f'{key}-cap{q}.png', 'W': Wd, 'H': Ht, 'html': page(cut, x, ctext)})
            else:
                specs.append({'file': f'{key}-cap0.png', 'W': Wd, 'H': Ht, 'html': page(cut, x, None)})
    (W / 'overlays.json').write_text(json.dumps(specs))
    print(len(specs), 'overlays')

def page(cut, x, caption):
    """The words on screen for one line of one cut, as a transparent page."""
    lay = CUTS[cut]['lay']; Wd, Ht = lay['W'], lay['H']
    e = html.escape
    bits = []
    if cut.startswith('child') and x.get('word'):
        if lay is LAND:
            bits.append(f'<div class="pill" style="left:50%;bottom:70px;transform:translateX(-50%);font-size:76px">{e(x["word"])}</div>')
        else:
            bits.append(f'<div class="pill" style="left:50%;top:1295px;transform:translateX(-50%);font-size:58px">{e(x["word"])}</div>')
    if cut.startswith('child') and x.get('card'):
        lead, q, older = CARDS[x['card']]
        fs = (1.0 if lay is LAND else 0.78)
        pos = 'left:50%;bottom:60px;transform:translateX(-50%);width:1500px' if lay is LAND else 'left:50%;top:1280px;transform:translateX(-50%);width:960px'
        bits.append(f'''<div class="card" style="{pos};padding:{40*fs}px {56*fs}px">
          <div class="eye" style="font-size:{26*fs}px">Pause</div>
          <div class="b" style="font-size:{38*fs}px;margin-top:{10*fs}px">{e(lead)}</div>
          <div class="h" style="font-size:{64*fs}px;margin-top:{6*fs}px">{e(q)}</div>
          <div class="b" style="font-size:{30*fs}px;margin-top:{16*fs}px;color:#7A7A8C">{e(older)}</div></div>''')
    if cut == 'child-family':
        bits.append(f'''<div style="position:absolute;top:300px;left:80px;right:80px">
          <div class="eye" style="font-size:30px">Watch together, ages 4 to 7</div>
          <div class="h" style="font-size:72px;margin-top:16px">{e(CUTS[cut]["hook"])}</div></div>''')
        bits.append(f'<img src="LOCKUP" style="position:absolute;left:80px;top:1600px;height:90px">')
    if caption is not None:
        if cut == 'child-family':
            if not x.get('card'):
                top = 1410 if x.get('word') else 1295
                bits.append(f'<div class="cap" style="left:80px;right:80px;top:{top}px;font-size:54px">{e(caption)}</div>')
        elif lay is PPORT:
            bits.append(f'<div class="cap" style="left:70px;right:70px;top:1410px;font-size:56px">{e(caption)}</div>')
            bits.append(f'<img src="LOCKUP" style="position:absolute;left:70px;top:1700px;height:84px">')
        elif lay is PLAND:
            bits.append(f'<div class="cap" style="left:1150px;right:80px;top:300px;font-size:58px">{e(caption)}</div>')
            bits.append(f'<img src="LOCKUP" style="position:absolute;left:1150px;top:880px;height:84px">')
    if cut.startswith('parent') and x['pics'][0] in ('words', 'thanks'):
        big = 'Phones go to bed first in our house. Mine too.' if x['pics'][0] == 'words' else 'Thank them for telling you.'
        eye = 'The words to say' if x['pics'][0] == 'words' else 'If something is stuck in their head'
        if lay is PLAND:
            box = 'left:90px;top:260px;width:900px'; fs = 84
        else:
            box = 'left:90px;right:90px;top:330px'; fs = 104
        bits.append(f'''<div style="position:absolute;{box}"><div class="eye" style="font-size:30px">{e(eye)}</div>
          <div class="h" style="font-size:{fs}px;margin-top:22px">{e(big)}</div></div>''')
    return '\n'.join(bits)

def films(only=None):
    for cut, c in CUTS.items():
        if only and cut not in only:
            continue
        lay = c['lay']
        segs = timeline(c['lines'])
        ps = pieces_for(segs)
        parts = []
        for k, p in enumerate(ps):
            s = p['seg']; x = s['line']
            key = overlay_key(cut, x)
            # Which caption chunk is on during this piece: captions change at
            # chunk times, so a piece with several chunks is split further.
            cs = chunks(x['text'], 64 if cut.startswith('child') else 72) if c['caps'] else [None]
            total = sum(len(q) for q in cs) if c['caps'] else 1
            bounds, t = [], s['lead']
            for q, ctext in enumerate(cs):
                d = s['adur'] * (len(ctext) / total if c['caps'] else 1)
                bounds.append((t, t + d, q)); t += d
            # Split points inside this piece (local time within the segment).
            a, b = p['local'], p['local'] + p['len']
            cuts_at = sorted({a, b, *[bb for (_, bb, _) in bounds[:-1] if a < bb < b]})
            for u in range(len(cuts_at) - 1):
                ua, ub = cuts_at[u], cuts_at[u + 1]
                q = 0
                for (ba, bb, qq) in bounds:
                    if ua >= ba - 1e-6:
                        q = qq
                sub = dict(p); sub['len'] = ub - ua
                f0 = (ua - a) / p['len']; f1 = (ub - a) / p['len']
                sub['z0'] = p['z0'] + (p['z1'] - p['z0']) * f0
                sub['z1'] = p['z0'] + (p['z1'] - p['z0']) * f1
                path = W / f'{cut}-{k:03d}-{u}.mp4'
                # Audio: the line's voice sits inside the segment at s['lead'];
                # this sub piece covers [ua, ub] of the segment.
                apath = W / f'{cut}-{k:03d}-{u}.wav'
                run(['ffmpeg', '-v', 'error', '-y', '-i', str(s['audio']), '-af',
                     f'adelay={int(s["lead"] * 1000)}:all=1,apad,atrim={ua:.3f}:{ub:.3f},asetpts=PTS-STARTPTS', str(apath)])
                render_piece(path, lay, sub, W / 'ov' / f'{key}-cap{q}.png', apath, 0.0,
                             fade_in=p['first_of_shot'] and u == 0, fade_out=p['last_of_shot'] and u == len(cuts_at) - 2)
                parts.append(path)
        if c.get('end'):
            ep = W / f'{cut}-end.mp4'
            run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', str(FPS), '-t', str(c['end_len']), '-i', str(W / 'ov' / c['end']),
                 '-f', 'lavfi', '-t', str(c['end_len']), '-i', 'anullsrc=r=48000:cl=stereo',
                 '-vf', f'scale={lay["W"]}:{lay["H"]},format=yuv420p,fade=t=in:d=0.4:color={CREAM}', '-r', str(FPS),
                 '-c:v', 'libx264', '-crf', '19', '-preset', 'fast', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', str(ep)])
            parts.append(ep)
        out = OUT / f'1.6-{cut}.mp4'
        concat(parts, out)
        if cut == 'child-youtube':
            srt(segs, OUT / '1.6-child-youtube.en-GB.srt')
        if cut == 'child-product':
            # The player's three segments, split where the two pause lines end.
            ends = [s['start'] + s['len'] for s in segs if s['line'].get('card')]
            marks = [0.0, *ends, sum(s['len'] for s in segs)]
            for name, (ta, tb) in zip('ABC', zip(marks, marks[1:])):
                run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ta:.3f}', '-to', f'{tb:.3f}', '-i', str(out),
                     '-c:v', 'libx264', '-crf', '19', '-preset', 'fast', '-c:a', 'aac', '-b:a', '160k',
                     '-movflags', '+faststart', str(OUT / f'1.6-child-product-{name}.mp4')])
        print(cut, round(dur(out), 1), 's')

if __name__ == '__main__':
    if sys.argv[1] == 'overlays':
        overlays()
    else:
        films(sys.argv[2:] or None)
