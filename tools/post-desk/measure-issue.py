#!/usr/bin/env python3
"""Measure a long form issue against the house rules.

The body is what a reader reads: everything between the horizontal rule that
closes the subject lines block and the horizontal rule that opens the sources
block. Headings, blockquote markers and the pack's own metadata are not body.
"""
import re, sys, os

LIMIT_LO, LIMIT_HI = 1800, 2500
BANNED = [
    "it's worth noting", 'it is worth noting', 'important to note', "here's the thing",
    'here is the thing', 'in today', 'at the end of the day', 'that being said',
    'having said that', 'let us dive', "let's dive", 'delve', 'leverage',
    'game-changer', 'game changer', 'unlock', 'seamlessly', 'in conclusion',
    'i hope this helps', 'feel free to', 'needle in', 'landscape of',
    'navigate the', 'testament to', 'deep dive', 'unpack', 'tapestry',
    'safe online', 'ready for social media',
]


def body_of(text):
    parts = text.split('\n---\n')
    if len(parts) < 3:
        return None
    return '\n---\n'.join(parts[1:-1])


def words(body):
    out = []
    for line in body.split('\n'):
        if line.startswith(('#', '>', '|')):
            continue
        out += [w for w in line.split() if re.search(r'[A-Za-z0-9]', w)]
    return out


def check(path):
    t = open(path, encoding='utf-8').read()
    b = body_of(t)
    name = os.path.basename(path)
    if b is None:
        return [f'{name}: CANNOT FIND BODY, needs a --- before and after it']
    n = len(words(b))
    fails, notes = [], []
    if not (LIMIT_LO <= n <= LIMIT_HI):
        fails.append(f'{n} words, outside {LIMIT_LO} to {LIMIT_HI}')
    d = re.findall(r'.{0,40}[‐-―−].{0,40}', t)
    if d:
        fails.append('DASH: ' + repr(d[:2]))
    c = len(re.findall(r"\w['’](s|t|re|ve|ll|d|m)\b", t))
    if c < 10:
        fails.append(f'only {c} contractions, reads stiff')
    paras = [p.strip() for p in b.split('\n\n')
             if p.strip() and not p.strip().startswith(('#', '>', '|', '**Venue', '**Preview'))]
    short = [p for p in paras if len(p.split()) <= 8 and '\n' not in p]
    if not short:
        fails.append('no very short paragraph')
    low = t.lower()
    hit = [p for p in BANNED if p in low]
    if hit:
        fails.append('BANNED PHRASE: ' + ', '.join(hit))
    if '## Subject lines' not in t:
        fails.append('no subject lines')
    elif len(re.findall(r'^\d\. ', t, re.M)) < 3:
        fails.append('fewer than 3 subject lines')
    if 'Preview line' not in t:
        fails.append('no preview line')
    if '## Sources' not in t:
        fails.append('no sources block')
    if 'this week' not in low and 'on sunday' not in low and 'tonight' not in low:
        fails.append('no takeaway a parent can act on')
    qs = b.count('?')
    notes.append(f'{n} words, {c} contractions, {len(short)} short paras, {qs} question marks')
    head = f'{name}: ' + ('PASS' if not fails else 'FAIL')
    return [head + '  (' + notes[0] + ')'] + ['    ' + f for f in fails]


if __name__ == '__main__':
    bad = 0
    for p in sorted(sys.argv[1:]):
        lines = check(p)
        print('\n'.join(lines))
        if 'FAIL' in lines[0] or 'CANNOT' in lines[0]:
            bad += 1
    print(f'\n{len(sys.argv)-1} issues, {bad} failing')
