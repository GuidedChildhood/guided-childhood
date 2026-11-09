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

# date, post number, why this slot. Follows the Monday LinkedIn pass of
# 9 November, which cut the week from four posts to three: nine posts the week
# before split the attention and the week ran at half. Two days apart, nothing
# back to back on the same story.
SCHEDULE = [
    ('2026-11-09', '047', 'The Monday pass put this first: a number that contradicts the reader, and a card.'),
    ('2026-11-11', '046', 'Opens on a declared uncertainty, the second shape that wins on your account.'),
    ('2026-11-13', '045', 'Re verified on 9 November. Check the eSafety PDF before this one if you can.'),
    ('2026-11-16', '053', 'The court filings are the most perishable thing left in the queue.'),
    ('2026-11-18', '048', 'Sits near the toy post on purpose: the two answer each other.'),
    ('2026-11-20', '043', 'Evergreen, and a story rather than a number, which suits the end of a week.'),
    ('2026-11-23', '044', 'Closes the ban run.'),
    ('2026-11-25', '037', 'Only while the film is still in cinemas.'),
    ('2026-11-27', '038', 'The trial second wave finishes before Christmas, so November is its window.'),
    ('2026-11-30', '039', 'Gaming, and it lands well at the start of a week.'),
    ('2026-12-02', '049', 'Strongest evidence of the lot, a good one to end the backlog on.'),
]

# Not scheduled. The source document is still unread, so these wait.
HELD = {
    '050': 'Ofcom\'s PDF is still unread, four attempts, 403 every time. The post is honest about where each figure comes from, so it is safe as written, but the Monday pass is holding it until somebody opens the document.',
    '051': 'Same, for eSafety. 503 every time. Held by the Monday pass.',
    '052': 'Same Ofcom source as 050. Held with it.',
}

# Cards made on 9 November, plus 046's own.
CARDS = {'045', '046', '047', '048'}

# A note on the figures, where there is one worth knowing before posting.
GATES = {
    '045': ('Re verified on 9 November. The BMJ paper is 436 adolescents aged 12 to 17, '
            'mostly New South Wales, published 24 June, and it says there is insufficient '
            'evidence of a drop rather than that nothing changed. The eSafety figures are '
            '803 children aged 10 to 15 and reach us through snippets, so tick them against '
            'the PDF if you can open it.'),
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
    assert not (set(n for _, n, _ in SCHEDULE) & set(HELD)), 'a held post is also scheduled'
    assert len(SCHEDULE) + len(HELD) == len(posts), (
        'scheduled %d and held %d of %d posts' % (len(SCHEDULE), len(HELD), len(posts)))

    slots = []
    for date, n, why in SCHEDULE:
        p = posts[n]
        slots.append({
            'date': date, 'n': n, 'title': p['title'], 'why': why,
            'body': p['body'], 'comment': p['comment'], 'share': p.get('share', ''),
            'chars': p['chars'], 'card': n in CARDS or bool(p.get('card')),
            'gate': GATES.get(n, ''),
        })

    held = []
    for n, why in HELD.items():
        p = posts[n]
        held.append({'n': n, 'title': p['title'], 'why': why, 'body': p['body'],
                     'comment': p['comment'], 'share': p.get('share', ''),
                     'chars': p['chars'], 'card': n in CARDS})

    data = {'slots': slots, 'held': held, 'steps': [{'t': t, 'copy': c} for t, c in STEPS],
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
