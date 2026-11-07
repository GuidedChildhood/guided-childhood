#!/usr/bin/env python3
"""Build Posting Week: the week by week plan, with the steps in order.

Justin, 7 November 2026: an easy dashboard like the post desk that opens on each
week's content and gives the steps. The desk is the library. This is the plan.

The schedule obeys his own rules from linkedin-engagement.md: four a week,
weekday mornings, never two in a day, and nothing within about eight hours of
another post because they eat each other's first hour. Order is by what goes
stale soonest.
"""
import re, json, os

DESK = '/tmp/claude-0/-home-user/8607980e-4828-5409-a1c4-d7fee401bbd9/scratchpad/desk/'
OUT = DESK + 'week.html'

# date, post number, why this slot
SCHEDULE = [
    ('2026-11-09', '053', 'The filings are the most perishable thing in the queue, so it leads.'),
    ('2026-11-10', '045', 'Pegged to a piece published last month, so it goes while that is still live.'),
    ('2026-11-12', '050', 'Ofcom published on 29 October. Two clear days after 053 so each gets its own run.'),
    ('2026-11-13', '037', 'The film is still in cinemas. This one stops working when it leaves.'),
    ('2026-11-16', '052', 'Same Ofcom source as 050, different question, so a week behind it.'),
    ('2026-11-17', '047', 'Before Christmas buying, which is when a parent decides about an AI toy.'),
    ('2026-11-19', '048', 'Sits near 047 on purpose: the toy post and the chatbot post answer each other.'),
    ('2026-11-20', '043', 'Evergreen, and a good Friday post because it is a story rather than a number.'),
    ('2026-11-23', '051', 'The AI lane again, a week clear of 048.'),
    ('2026-11-24', '038', 'The trial second wave finishes before Christmas, so November is its window.'),
    ('2026-11-26', '039', 'Gaming, and it lands well mid week when parents are in the thick of it.'),
    ('2026-11-27', '044', 'Closes the ban run before the readiness pair.'),
    ('2026-11-30', '046', 'Opens the last week on the thing the whole product is about.'),
    ('2026-12-01', '049', 'Evergreen, strongest evidence, a good one to end the backlog on.'),
]

# A note on the figures, where there is one worth knowing before posting.
GATES = {
    '050': ('Three figures reach us through one secondary summary, and the post now '
            'says so in its own text, so it is safe as written. Opening the Ofcom PDF '
            'would let you drop the hedges.'),
    '052': ('Same as 050. The 150,000 is credited to CitizenCard in the first comment, '
            'not to Ofcom, which is the fix from 6 November.'),
    '051': ('The 54 percent question wording is still unread after four attempts at '
            'eSafety. The post is built on the 78 and 8 split instead, which is '
            'corroborated, so it stands as written.'),
}

STEPS = [
    ('Copy the post and paste it in.', 'body'),
    ('Read it back once on your phone before you publish. The first two lines are the whole hook.', None),
    ('Add the image, or publish as text only.', None),
    ('Publish.', None),
    ('Post the first comment straight away, yourself. The link lives there, never in the post.', 'comment'),
    ('Stay for the first hour. Reply to every comment with a question back, because each reply is '
     'another comment and the first sixty minutes decide the reach.', None),
]


def load():
    src = open(DESK + 'index.html', encoding='utf-8').read()
    d = json.loads(re.search(r'const D = (\{.*?\});\n', src, re.S).group(1))
    return {p['n']: p for p in d['posts']}


def main():
    posts = load()
    missing = [n for _, n, _ in SCHEDULE if n not in posts]
    assert not missing, 'not on the desk: %s' % missing
    assert len(SCHEDULE) == len(posts), 'scheduled %d of %d posts' % (len(SCHEDULE), len(posts))

    slots = []
    for date, n, why in SCHEDULE:
        p = posts[n]
        slots.append({
            'date': date, 'n': n, 'title': p['title'], 'why': why,
            'body': p['body'], 'comment': p['comment'], 'share': p.get('share', ''),
            'chars': p['chars'], 'card': bool(p.get('card')),
            'gate': GATES.get(n, ''),
        })

    data = {'slots': slots, 'steps': [{'t': t, 'copy': c} for t, c in STEPS],
            'desk': 'https://claude.ai/artifact/Xb6Jt6JAm2d3wrF7WXxeGY'}

    page = open(DESK + 'week-head.html', encoding='utf-8').read().replace(
        '__DATA__', json.dumps(data, ensure_ascii=False))
    page += open(DESK + 'week-tail.html', encoding='utf-8').read()

    for s in slots:
        for k in ('body', 'comment', 'title', 'why', 'gate'):
            assert not re.search(r'[‐-―−]', s[k]), (s['n'], k)
    assert 'selectNodeContents' not in page
    open(OUT, 'w', encoding='utf-8').write(page)
    print('Posting Week built, %d slots, %d bytes' % (len(slots), len(page)))
    for s in slots:
        print('  %s  GDC-%s  %4d chars  %s%s' % (
            s['date'], s['n'], s['chars'],
            'card' if s['card'] else 'NO IMAGE',
            '  (note)' if s['gate'] else ''))


if __name__ == '__main__':
    main()
