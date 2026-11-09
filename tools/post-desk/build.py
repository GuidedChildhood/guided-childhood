#!/usr/bin/env python3
"""Build the Post Desk page from head.html, desk-data.json and tail.html.

Justin, 9 November 2026. Until today the desk's data and its build step lived
only in a session scratchpad, so the page Justin schedules from could not be
rebuilt from this repository. Ten ready posts were missing from it for weeks
and nothing here would have shown that. The data is now desk-data.json and this
script is the only way the page is assembled, so what he opens is what is
committed.

The packs under content/packs are still where each post came from and where its
sources and overclaim notes live. This file is the desk's current contents, not
a second copy of the argument: when a pack and this file disagree, read the
pack's note and fix this file.

Run:  python3 tools/post-desk/build.py [out.html]

Then publish the result to the one desk artifact. Never create a second desk:
a new URL is the exact fragmentation the page exists to end.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# No dashes in any copy, ever. Checked over the unicode dash range rather than
# with grep, which in a C locale matches the bytes inside a smart quote and
# reports dashes that are not there.
DASHES = re.compile(r'[‐-―−]')

LINKEDIN_LIMIT = 3000


def check(data):
    """Everything here has cost us something at least once."""
    problems = []

    for p in data['posts']:
        where = 'GDC-' + p['n']

        for field in ('body', 'comment', 'title', 'checked'):
            hit = DASHES.search(p.get(field) or '')
            if hit:
                problems.append(f'{where}: dash in {field}')

        if p['chars'] != len(p['body']):
            problems.append(f"{where}: chars says {p['chars']}, body is {len(p['body'])}")

        if p['chars'] > LINKEDIN_LIMIT:
            problems.append(f"{where}: {p['chars']} chars, over LinkedIn's {LINKEDIN_LIMIT}")

        # The closing question goes last with nothing after it, and there is
        # only ever one. A repost ask therefore sits in front of it.
        if not p['body'].rstrip().endswith('?'):
            problems.append(f'{where}: does not end on its question')

        if not (p.get('comment') or '').strip():
            problems.append(f'{where}: no first comment')

    nums = [p['n'] for p in data['posts']]
    if len(nums) != len(set(nums)):
        problems.append('a post number appears twice')
    if nums != sorted(nums, key=int, reverse=True):
        problems.append('posts are not newest first')

    return problems


def main():
    data = json.loads((HERE / 'desk-data.json').read_text(encoding='utf-8'))

    problems = check(data)
    if problems:
        print('FAIL')
        for x in problems:
            print('  ' + x)
        return 1

    head = (HERE / 'head.html').read_text(encoding='utf-8')
    tail = (HERE / 'tail.html').read_text(encoding='utf-8')
    if '__DATA__' not in head:
        print('FAIL  head.html has no __DATA__ placeholder')
        return 1

    page = head.replace('__DATA__', json.dumps(data, ensure_ascii=False)) + tail

    # The copy button must never select a styled element, because that copies
    # rich HTML and carried the dark background into LinkedIn. See README.
    if 'selectNodeContents' in page:
        print('FAIL  rich copy reintroduced, see the README')
        return 1

    out = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'index.html'
    out.write_text(page, encoding='utf-8')

    posted = len(data['posts'])
    print(f'PASS  {posted} posts, {len(data["news"])} newsletters, '
          f'{len(data["ideas"])} ideas, {len(page):,} bytes')
    print(f'      written to {out}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
