# Builds any film in cuts/films.json (23 November 2026): the production line for
# the DiGi question films. Two passes, because the cut frames DiGi's two steps
# where the recording says they are:
#   python3 cuts/make-films.py scenes d01     writes the four scenes to record
#   python3 cuts/make-films.py cut d01        reads the measurements, writes the cut
import json, sys
D = json.load(open('cuts/films.json'))
mode, key = sys.argv[1], sys.argv[2]
raw = next(x for x in D['films'] if x['key'] == key)
ONGOING = raw.get('ending') == 'ongoing'  # a worry that is not Sorted in a week (bullying): the parent taps Getting there and DiGi stays on it
FACE = 'Getting there' if ONGOING else 'Going great'
c = D['cast'][raw['child']]; r = D['research'][raw['research']]
NAMES = {n: raw['child'] for n in ['Teo', 'Timbotee', 'Alfie', 'Bumble', 'Olga', 'Alma Rose', 'Alma']}
ENTER = 300 + len(raw['q']) * 24 + 330          # when the question is sent, ms
T1 = ENTER + 2600 + 3050                          # the first step is on screen, ms
if mode == 'scenes':
  chip = {"'s mood drops after Instagram. What do I say tonight?": "'s friends are all online after school. What do I say?"}
  stage = {} if c['stage'] == 3 else {'Stage 3': f"Stage {c['stage']}", '11 to 13': c['range']}
  texts = raw['steps'] + ['Tonight']
  S = {
   'chat': {'url': '/ref-digi-chat?kids=1', 'swap': {**stage, **chip, **NAMES}, 'seconds': 19.5,
     'stubs': [{'match': '/api/digi', 'method': 'POST', 'delayMs': 2600, 'wordMs': 40, 'body': raw['body']}],
     'actions': [{'at': 300, 'do': 'type', 'selector': 'textarea', 'text': raw['q'], 'charMs': 24}, {'at': ENTER, 'do': 'press', 'key': 'Enter'},
                 {'at': T1, 'do': 'measure', 'texts': texts}, {'at': 11800, 'do': 'scrollChat', 'back': 230}, {'at': 12700, 'do': 'measure', 'texts': texts},
                 {'at': 15600, 'do': 'scrollChat'}, {'at': 16700, 'do': 'measure', 'texts': texts}]},
   'deck': {'url': f"/ref-script-deck?script={raw['script']}", 'swap': NAMES, 'seconds': 12.5, 'height': 1000, 'anims': True,
     'stubs': [{'match': '/api/completions', 'method': 'POST', 'body': '{"ok":true}', 'json': True, 'delayMs': 200}],
     'actions': [{'at': 9000, 'do': 'jsclick', 'selector': 'button', 'text': 'Next \u2192'}]},
   'followup': {'url': '/dev/concern-scale?only=1', 'seconds': 13, 'scrollY': 420,
     'swap': {'Online safety': raw['tile'], 'putting the tablet on the landing shelf at seven': raw['note'], **NAMES},
     'stubs': [{'match': m, 'method': 'POST', 'body': '{"ok":true}', 'json': True, 'delayMs': 300} for m in ['/api/digi/outcome', '/api/daily/concern-check']],
     'actions': [{'at': 2600, 'do': 'tap', 'selector': 'button', 'text': 'Yes', 'nth': 1}, {'at': 6200, 'do': 'tap', 'selector': 'button[aria-label="Getting there"]', 'nth': 0}]},
   'checkin': {'url': '/ref-baseline-checkin', 'seconds': 8, 'height': 1000, 'scrollY': 400,
     'swap': {'Mood after screens': raw['tile'], 'Morning TV': 'Bedtime screens' if raw['tile'] == 'Endless YouTube' else 'Endless YouTube', **NAMES},
     'stubs': [{'match': '/api/daily/concern-check', 'method': 'POST', 'body': '{"ok":true}', 'json': True, 'delayMs': 300}],
     'actions': [{'at': 1500, 'do': 'tap', 'selector': f'button[aria-label^="{FACE}"]', 'nth': 3}]},
  }
  for n, sc in S.items(): json.dump({'name': f'film-{key}-{n}', **sc}, open(f'scenes/film-{key}-{n}.json', 'w'), indent=1)
  sys.exit(0)
M = {m['at']: m for m in json.load(open(f'renders/rec/film-{key}-chat/measure.json'))}
pos = {'step1': M[T1]['text'][raw['steps'][0]], 'step2': M[12700]['text'][raw['steps'][1]], 'link': (M[12700]['link'] or [None])[0], 'tonight': M[16700]['text']['Tonight']}
bad = [k for k, v in pos.items() if v is None or not 40 <= v <= 640]
if bad: sys.exit(f'{key}: off screen or missing: {bad} {pos}')
F = {key: dict(child=raw['child'], age=c['age'], stage=c['stage'], pro=c['pro'], band=raw['band'], q=raw['q'],
  step1=pos['step1'] + 10, step2=pos['step2'] + 10, track=pos['link'] - 52, tonight=pos['tonight'] + 10, deck=590,
  tile=raw['tile'] + '?', code=raw['code'], worked=raw['worked'], claim=r['claim'], cite=r['cite'], eyebrow=r['eyebrow'], note='')}
SLATE = 'An example family. Real app screens, example replies.'
for k, f in F.items():
  rec = lambda t, k=k: f'rec/film-{k}-{t}.mp4'
  cap = lambda text, t0=0.5, t1=None: {'kind': 'caption', 'text': text, 'y': 1395, 't0': t0, **({'t1': t1} if t1 else {})}
  ul = lambda y, t0, t1: {'cls': 'underline', 'x': 57, 'y': y + 12, 'w': 220, 'h': 3, 't0': t0, 't1': t1}
  shots = [
   {'id': 'hook', 'dur': 5.4, 'overlays': [
     {'kind': 'band', 'text': f['band'], 'y': 300, 't0': 0},
     {'kind': 'pill', 'text': f['q'], 'y': 560, 't0': 0.5, 'typed': 0.17},
     {'kind': 'eyebrow', 'text': SLATE, 'y': 1300, 't0': 3.4}],
    'sfx': [{'name': 'sfx-tap', 'at': 0.3, 'vol': 0.15}, {'name': 'sfx-tap', 'at': 1.1, 'vol': 0.14}]},
   {'id': 'hero', 'dur': 2.3, 'src': rec('chat'), 'mediaStart': 0.3, 'bezel': True, 'fadeIn': 0.3,
    'cam': [{'t': 0, 'S': 1.55, 'fx': 209, 'fy': 436, 'py': 900}, {'t': 0.9, 'S': 2.0, 'fx': 209, 'fy': 300, 'py': 800, 'dur': 1.4}],
    'tilt': [{'rx': 14, 'ry': -32, 'rz': 4}, {'t': 0.15, 'rx': 0, 'ry': 0, 'rz': 0, 'dur': 1.7}],
    'overlays': []},
   {'id': 'think', 'dur': 3.0, 'src': rec('chat'), 'mediaStart': round(ENTER / 1000 + 0.53, 2), 'ground': 'white', 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.7, 'fx': 195, 'fy': 120, 'py': 760}],
    'overlays': [cap(f"It starts with *{f['child']}*.", 0.3)],
    'sfx': [{'name': 'sfx-send', 'at': 0.05, 'vol': 0.35}, {'name': 'sfx-dots', 'at': 0.6, 'vol': 0.16}]},
   {'id': 'reply1', 'dur': 4.4, 'src': rec('chat'), 'mediaStart': round(T1 / 1000 - 0.1, 2), 'ground': 'white', 'fadeIn': 0,
    'cam': [{'t': 0, 'S': 2.8, 'fx': 195, 'fy': f['step1'] + 50, 'py': 760}],
    'inScreen': [ul(f['step1'], 1.0, 4.3)],
    'overlays': [{'kind': 'label', 'text': 'Example reply', 'y': 1270, 't0': 0.2},
                 cap("*Never* a yes or no.", 0.6)],
    'sfx': [{'name': 'sfx-pop', 'at': 0.05, 'vol': 0.35}, {'name': 'sfx-shimmer', 'at': 1.0, 'vol': 0.14}]},
   {'id': 'reply2', 'dur': 3.0, 'src': rec('chat'), 'mediaStart': 12.6, 'ground': 'white', 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.8, 'fx': 195, 'fy': f['step2'] + 50, 'py': 760}],
    'inScreen': [ul(f['step2'], 0.5, 2.9)],
    'overlays': [cap('Two plain *steps*.', 0.3)]},
   {'id': 'tracked', 'dur': 2.8, 'src': rec('chat'), 'mediaStart': 12.8, 'ground': 'white', 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.8, 'fx': 195, 'fy': f['track'] + 30, 'py': 760}],
    'overlays': [cap("Then it *checks* back.", 0.3)]},
   {'id': 'tonight', 'dur': 2.8, 'src': rec('chat'), 'mediaStart': 16.6, 'ground': 'white', 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.8, 'fx': 195, 'fy': f['tonight'] + 25, 'py': 760}],
    'overlays': [cap('One thing for *tonight*.', 0.3)]},
   {'id': 'deck', 'dur': 6.8, 'src': rec('deck'), 'srcH': 1000, 'mediaStart': 3.0, 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.7, 'fx': 195, 'fy': 303, 'py': 420}, {'t': 1.0, 'S': 3.1, 'fx': 195, 'fy': f['deck'], 'py': 1010, 'dur': 0.8}],
    'overlays': [{'kind': 'veil', 'h': 420, 't0': 0}, {'kind': 'veil', 'h': 640, 't0': 1.0, 'fade': True}, cap('The exact *words*.', 1.8)],
    'sfx': [{'name': 'sfx-whoosh', 'at': 0, 'vol': 0.16}, {'name': 'sfx-shimmer', 'at': 1.6, 'vol': 0.16}]},
   {'id': 'followup', 'dur': 5.0, 'src': rec('followup'), 'mediaStart': 5.0, 'cropTop': 390, 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.9, 'fx': 195, 'fy': 165, 'py': 1050}],
    'overlays': [{'kind': 'marker', 'text': 'A few days later', 'y': 430, 't0': 0, 'instant': True},
                 cap('How did it *go*?', 1.6)],
    'inScreen': [{'cls': 'ripple', 'x': 234, 'y': 233, 'w': 44, 'h': 44, 't0': 1.2}],
    'sfx': [{'name': 'sfx-tap', 'at': 1.2, 'vol': 0.45}]},
   {'id': 'great', 'dur': 1.8, 'src': rec('checkin'), 'mediaStart': 0.9, 'srcH': 1000, 'clipH': 1000, 'cropTop': 748, 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.9, 'fx': 195, 'fy': 125, 'py': 1050}],
    'overlays': [{'kind': 'marker', 'text': 'A week later', 'y': 430, 't0': 0}],
    'inScreen': [{'cls': 'ripple', 'x': 234 if ONGOING else 297, 'y': 52, 'w': 44, 'h': 44, 't0': 0.6}],
    'sfx': [{'name': 'sfx-tap', 'at': 0.6, 'vol': 0.45}, {'name': 'sfx-chime', 'at': 1.1, 'vol': 0.4}]},
   {'id': 'held', 'dur': 3.4, 'src': rec('checkin'), 'mediaStart': 4.2, 'srcH': 1000, 'clipH': 1000, 'cropTop': 748, 'fadeIn': 0,
    'cam': [{'t': 0, 'S': 2.9, 'fx': 195, 'fy': 125, 'py': 1050}],
    'overlays': [{'kind': 'marker', 'text': 'A week later', 'y': 430, 't0': 0, 'instant': True},
                 cap('Not sorted yet. DiGi *stays on it*.' if ONGOING else '*Sorted.*', 0.2)]},
   {'id': 'inputs', 'dur': 6.0, 'fadeIn': 0.3, 'overlays': [
     {'kind': 'inputs', 'y': 300, 't0': 0.1, 'eyebrow': 'Example family', 'title': 'DiGi learns your family',
      'rows': [{'k': 'Your child', 'v': f"{f['child']}, {f['age']}"},
               {'k': 'What worked before', 'v': f['worked']},
               {'k': 'How it went', 'v': 'Your own rating'}],
      'note': 'Never a yes or no. Safety first.', 'gap': 1.1}],
    'sfx': [{'name': 'sfx-whoosh', 'at': 0.1, 'vol': 0.14}]},
   {'id': 'science', 'dur': 5.4, 'fadeIn': 0.3, 'overlays': [
     {'kind': 'science', 'y': 420, 't0': 0.1, 'eyebrow': f['eyebrow'], 'claim': f['claim'], 'cite': f['cite'], }]},
   {'id': 'end', 'dur': 5.6, 'overlays': [
     {'kind': 'digi', 'x': 405, 'y': 120, 'size': 270, 't0': 0},
     {'kind': 'end', 'y': 420, 'eyebrow': f['tile'], 'line': 'What stage is your child?', 'sub': 'Three questions. No sign up.',
      'button': "Find my child's stage", 'url': f"guidedchildhood.com/v/{f['code']}", 'slate': SLATE, 't0': 0.3, 'pressAt': 2.8,
      'tagline': 'One plan for screens, phones and AI.'}],
    'sfx': [{'name': 'sfx-land', 'at': 0.25, 'vol': 0.32}, {'name': 'sfx-tap', 'at': 3.1, 'vol': 0.38}]},
  ]
  if mode == 'ad':
    # The 30 second ad cut (23 November 2026): the product on screen inside three
    # seconds, the two steps, the words, the check back, one line of proof, the
    # stage check. Same shots as the full film, fewer and shorter.
    # Second ad cut (24 November 2026, after the sign up review): the phone is on
    # screen from the first frame with the question typing into the real app, the
    # script card is framed clear of its caption and held long enough to read a
    # line, the check in shows only the worry that was rated, the cards that a cold
    # parent will not wait for (inputs, research) are gone, and the end card says
    # what comes after the stage check.
    AD = {'hero': 4.4, 'reply1': 3.4, 'reply2': 2.6, 'deck': 5.0, 'followup': 3.2, 'great': 1.6, 'held': 2.4, 'end': 5.8}
    shots = [dict(x, dur=AD[x['id']]) for x in shots if x['id'] in AD]
    # How DiGi works, between the question and the answer (Justin, 24 November): what it draws on, flowing into DiGi.
    shots.insert(1, {'id': 'brain', 'dur': 4.6, 'fadeIn': 0.2, 'overlays': [
      {'kind': 'flow', 't0': 0, 'title': 'More than a chatbot.', 'out': f"A plan for {f['child']}.", 'outAt': 3.0,
       'chips': ['Reviewed research', 'What worked in your house', 'Families in the same spot', 'Safety rules first']}],
      'sfx': [{'name': 'sfx-whoosh', 'at': 0.05, 'vol': 0.16}, {'name': 'sfx-shimmer', 'at': 0.9, 'vol': 0.2}, {'name': 'sfx-chime', 'at': 3.0, 'vol': 0.3}]})
    for x in shots:
      if x['id'] == 'hero':
        x['fadeIn'] = 0
        x['cam'] = [{'t': 0, 'S': 1.36, 'fx': 209, 'fy': 436, 'py': 1230}, {'t': 1.9, 'S': 1.85, 'fx': 209, 'fy': 380, 'py': 1120, 'dur': 1.4}]
        x['tilt'] = [{'rx': 10, 'ry': -24, 'rz': 3}, {'t': 0.1, 'rx': 0, 'ry': 0, 'rz': 0, 'dur': 1.5}]
        x['overlays'] = [{'kind': 'hook', 'text': f['band'], 'y': 250, 't0': 0},
                         {'kind': 'label', 'text': 'Example family. Real app.', 'y': 470, 't0': 0, 'instant': True}]
        x['sfx'] = [{'name': 'sfx-tap', 'at': 0.2, 'vol': 0.15}, {'name': 'sfx-send', 'at': round(ENTER / 1000 - 0.3, 2), 'vol': 0.3}]
      if x['id'] == 'deck':
        # The words start 178px below the top of the card's blue header, and the card sits higher or lower with the
        # length of the script's title, so the cut measures it: every film opens the card on its first sentence.
        sys.path.insert(0, 'tools'); import dotted
        ct = dotted.card_top(f'assets/rec/film-{k}-deck.mp4')
        if ct is None: sys.exit(f'{k}: could not find the script card on the deck recording')
        qy = ct + 178
        x['cam'] = [{'t': 0, 'S': 2.7, 'fx': 195, 'fy': ct, 'py': 420}, {'t': 0.7, 'S': 3.1, 'fx': 195, 'fy': qy, 'py': 470, 'dur': 0.7}, {'t': 1.6, 'S': 3.2, 'fx': 195, 'fy': qy, 'py': 470, 'dur': 3.2}]
        x['overlays'] = [dict(o, t0=1.0, y=1440) if o['kind'] == 'caption' else o for o in x['overlays']]
      # Nothing sits still: every held shot drifts in a touch, and each step's number gets a pulse as its line is underlined.
      if x['id'] in ('reply1', 'reply2', 'followup', 'held'):
        c0 = x['cam'][0]; x['cam'] = [c0, dict(c0, t=0.15, S=round(c0['S'] + 0.16, 2), dur=x['dur'] - 0.2)]
      if x['id'] in ('reply1', 'reply2'):
        u = x['inScreen'][0]; x['inScreen'] = x['inScreen'] + [{'cls': 'ripple', 'x': 12, 'y': u['y'] - 34, 'w': 44, 'h': 44, 't0': u['t0']}]
      if x['id'] == 'followup': x['overlays'] = [dict(o, text='Example: a few days later') if o['kind'] == 'marker' else o for o in x['overlays']]
      if x['id'] in ('great', 'held'): x['overlays'] = [dict(o, text='Example: a week later') if o['kind'] == 'marker' else o for o in x['overlays']]
      if x['id'] == 'held':
        sys.path.insert(0, 'tools'); import dotted
        y = dotted.rule_y(f'assets/rec/film-{k}-checkin.mp4')  # the name can wrap to one, two or three lines, which moves the row
        if y is None: sys.exit(f'{k}: could not find the result row on the check in recording')
        x['cropTop'] = y + 4
        x['overlays'] = [dict(o, text=o['text'] if ONGOING else '*Sorted.* Your own rating.') if o['kind'] == 'caption' else o for o in x['overlays']]
      if x['id'] == 'end':
        for o in x['overlays']:
          if o['kind'] == 'end': o.update(then='Then try DiGi free for four days. No card.', pressAt=3.4); o.pop('tagline', None)
    k = f'{k}-ad'
  total = sum(s['dur'] for s in shots)
  cut = {'name': f'film-{k}', 'music': {'file': 'music-leberch.mp3', 'mediaStart': 12.3,
          'lane': [[0, 0], [1.0, 0.2], [6.5, 0.14], [total - 12, 0.14], [total - 11.5, 0.26], [total - 2.5, 0.26], [total, 0]]},
         'rail': {'y': 236, 'from': 'reply1', 'fromT': 0.1, 'until': 'held', 'steps': [
           {'label': 'Asked DiGi', 'shot': 'reply1', 't': 0.35, 'vol': 0.14}, {'label': 'The words', 'shot': 'deck', 't': 1.5},
           {'label': 'Checked in', 'shot': 'followup', 't': 1.5}, {'label': 'Ongoing' if ONGOING else 'Sorted', 'shot': 'great', 't': 1.1, 'silent': True}]},
         'shots': shots}
  json.dump(cut, open(f'cuts/film-{k}.json', 'w'), indent=1)
  print(k, round(total, 1), 's')
