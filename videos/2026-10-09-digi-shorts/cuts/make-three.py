# Builds the three DiGi films' cut files (22 November 2026) from one template:
# Roblox strangers (a), the Year 6 group chat (b), the teen bedroom (c).
import json
F = {
 'a': dict(child='Ava', age=9, stage=2, pro='her', band='A stranger messaged her.',
   q="A stranger messaged Ava on Roblox. She's 9. What do I do?",
   step1=388, step2=250, track=365, tonight=261, deck=600, tile='Who they talk to in games?', code='roblox-strangers',
   before='Coming off screens, sorted in October', worked='Agreeing the ending first',
   claim='Rules alone cut the good too. Guiding keeps it.',
   cite='Livingstone, 2017. 6,400 parents, children 6 to 14.', note=''),
 'b': dict(child='Sam', age=11, stage=3, pro='him', band='Taken out of the class chat.',
   q="All hell has broken loose on the Year 6 group chat. Sam's been taken out of it.",
   step1=417, step2=125, track=275, tonight=170, deck=572, tile='Group chats?', code='group-chat',
   before='Asking for a phone, still on the list', worked='Talking on the walk to school',
   claim='Children bullied online cope better with support at home.',
   cite='Hellfeldt, 2020. 1,707 pupils aged 10 to 13.',
   note='64% of 8 to 17s were added or invited to a group chat in four weeks. Ofcom, 2026.'),
 'c': dict(child='Maya', age=14, stage=4, pro='her', band='Back in her room at night?',
   q="She's 14 and wants her phone back in her room at night. Says I don't trust her.",
   step1=417, step2=185, track=333, tonight=261, deck=572, tile='Bedtime screens?', code='bedroom-phone',
   before='Endless YouTube, sorted in September', worked='A trial with a review date',
   claim='A phone in the bedroom is linked to less sleep.',
   cite='Carter, 2016. 125,198 children aged 6 to 19.',
   note='UK Chief Medical Officers, 2019: "Leave phones outside the bedroom when it is bedtime."'),
}
SLATE = 'An example family. Real app screens, example replies.'
for k, f in F.items():
  rec = lambda t: f'rec/three-{k}-{t}.mp4'
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
   {'id': 'think', 'dur': 3.0, 'src': rec('chat'), 'mediaStart': 2.6, 'ground': 'white', 'fadeIn': 0.15,
    'cam': [{'t': 0, 'S': 2.7, 'fx': 195, 'fy': 120, 'py': 760}],
    'overlays': [cap(f"It starts with *{f['child']}*.", 0.3)],
    'sfx': [{'name': 'sfx-send', 'at': 0.05, 'vol': 0.35}, {'name': 'sfx-dots', 'at': 0.6, 'vol': 0.16}]},
   {'id': 'reply1', 'dur': 4.4, 'src': rec('chat'), 'mediaStart': 7.6, 'ground': 'white', 'fadeIn': 0,
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
    'inScreen': [{'cls': 'ripple', 'x': 297, 'y': 52, 'w': 44, 'h': 44, 't0': 0.6}],
    'sfx': [{'name': 'sfx-tap', 'at': 0.6, 'vol': 0.45}, {'name': 'sfx-chime', 'at': 1.1, 'vol': 0.4}]},
   {'id': 'held', 'dur': 3.4, 'src': rec('checkin'), 'mediaStart': 4.2, 'srcH': 1000, 'clipH': 1000, 'cropTop': 748, 'fadeIn': 0,
    'cam': [{'t': 0, 'S': 2.9, 'fx': 195, 'fy': 125, 'py': 1050}],
    'overlays': [{'kind': 'marker', 'text': 'A week later', 'y': 430, 't0': 0, 'instant': True},
                 cap('*Sorted.*', 0.2)]},
   {'id': 'inputs', 'dur': 6.0, 'fadeIn': 0.3, 'overlays': [
     {'kind': 'inputs', 'y': 300, 't0': 0.1, 'eyebrow': 'Example family', 'title': 'DiGi learns your family',
      'rows': [{'k': 'Your child', 'v': f"{f['child']}, {f['age']}"},
               {'k': 'What worked before', 'v': f['worked']},
               {'k': 'How it went', 'v': 'Your own rating'}],
      'note': 'Never a yes or no. Safety first.', 'gap': 1.1}],
    'sfx': [{'name': 'sfx-whoosh', 'at': 0.1, 'vol': 0.14}]},
   {'id': 'science', 'dur': 5.4, 'fadeIn': 0.3, 'overlays': [
     {'kind': 'science', 'y': 420, 't0': 0.1, 'eyebrow': 'The research', 'claim': f['claim'], 'cite': f['cite'], }]},
   {'id': 'end', 'dur': 5.6, 'overlays': [
     {'kind': 'digi', 'x': 405, 'y': 120, 'size': 270, 't0': 0},
     {'kind': 'end', 'y': 420, 'eyebrow': f['tile'], 'line': 'What stage is your child?', 'sub': 'Three questions. No sign up.',
      'button': "Find my child's stage", 'url': f"guidedchildhood.com/v/{f['code']}", 'slate': SLATE, 't0': 0.3, 'pressAt': 2.8,
      'tagline': 'One plan for screens, phones and AI.'}],
    'sfx': [{'name': 'sfx-land', 'at': 0.25, 'vol': 0.32}, {'name': 'sfx-tap', 'at': 3.1, 'vol': 0.38}]},
  ]
  total = sum(s['dur'] for s in shots)
  cut = {'name': f'three-{k}', 'music': {'file': 'music-leberch.mp3', 'mediaStart': 12.3,
          'lane': [[0, 0], [1.0, 0.2], [6.5, 0.14], [total - 12, 0.14], [total - 11.5, 0.26], [total - 2.5, 0.26], [total, 0]]},
         'rail': {'y': 236, 'from': 'reply1', 'fromT': 0.1, 'until': 'held', 'steps': [
           {'label': 'Asked DiGi', 'shot': 'reply1', 't': 0.35, 'vol': 0.14}, {'label': 'The words', 'shot': 'deck', 't': 1.5},
           {'label': 'Checked in', 'shot': 'followup', 't': 1.5}, {'label': 'Sorted', 'shot': 'great', 't': 1.1, 'silent': True}]},
         'shots': shots}
  json.dump(cut, open(f'cuts/three-{k}.json', 'w'), indent=1)
  print(k, round(total, 1), 's')
