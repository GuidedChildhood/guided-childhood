#!/usr/bin/env python3
"""Add the 6 November second batch of long form issues to the post desk.

The desk stores a newsletter body as plain text with the markdown taken off:
headings are a bare line, blockquotes lose their marker, and each paragraph is
one unwrapped line, because the page renders it in a <pre> and the source files
are hard wrapped at about eighty characters.
"""
import re, json, os, sys

PACK = '/home/user/guided-childhood/content/packs/2026-11-06-long-form-six-more'
DESK = '/tmp/claude-0/-home-user/8607980e-4828-5409-a1c4-d7fee401bbd9/scratchpad/desk/'
FILES = [
    ('1-two-hours-and-a-curfew.md', 'GDC-038'),
    ('2-the-arrows-that-survived.md', 'GDC-049'),
    ('3-the-thing-parents-want-least.md', 'GDC-047'),
    ('4-the-rules-are-for-the-eight-percent.md', 'GDC-051'),
    ('5-the-number-nobody-quotes.md', 'GDC-045'),
    ('6-the-rule-i-could-enforce.md', 'GDC-039'),
]


def plain(md):
    """Markdown to the desk's plain text: unwrap paragraphs, drop markers."""
    out = []
    for block in md.split('\n\n'):
        block = block.strip('\n')
        if not block.strip():
            continue
        if set(block.strip()) <= {'-'}:          # a horizontal rule
            continue
        lines = [l.strip() for l in block.split('\n')]
        lines = [re.sub(r'^#{1,6} +', '', l) for l in lines]
        lines = [re.sub(r'^> ?', '', l) for l in lines]
        para = ' '.join(l for l in lines if l)
        para = re.sub(r'\*\*(.+?)\*\*', r'\1', para)
        para = re.sub(r'\*(.+?)\*', r'\1', para)
        para = re.sub(r'`(.+?)`', r'\1', para)
        para = re.sub(r' {2,}', ' ', para).strip()
        if para:
            out.append(para)
    return '\n\n'.join(out)


def parse(path):
    t = open(path, encoding='utf-8').read()
    title = re.search(r'^# Issue: (.+)$', t, re.M).group(1).strip()
    subjects = re.findall(r'^\d\. (.+)$', t, re.M)[:3]
    subtitle = re.search(r'\*\*Preview line:\*\* (.+?)\n\n', t, re.S).group(1)
    subtitle = re.sub(r'\s+', ' ', subtitle).strip()
    parts = t.split('\n---\n')
    assert len(parts) >= 3, path
    body = plain('\n---\n'.join(parts[1:-1]))
    sources = plain(parts[-1])
    return title, subjects, subtitle, body, sources


def main():
    src = open(DESK + 'index.html', encoding='utf-8').read()
    d = json.loads(re.search(r'const D = (\{.*?\});\n', src, re.S).group(1))
    have = {x['title'] for x in d['news']}
    n = max(int(x['n']) for x in d['news'])
    added = []
    for fname, post in FILES:
        title, subjects, subtitle, body, sources = parse(os.path.join(PACK, fname))
        if title in have:
            continue
        n += 1
        words = len([w for w in body.split() if re.search(r'[A-Za-z0-9]', w)])
        d['news'].append({
            'n': n, 'title': title, 'venue': 'Substack',
            'subjects': subjects, 'subtitle': subtitle,
            'body': body + '\n\nSources, and what each one can carry\n\n' + sources,
            'words': words, 'note': '', 'series': 'from ' + post,
        })
        added.append((n, words, title))
    for x in d['news']:
        assert len(x['subjects']) == 3, x['n']
        assert x['subtitle'] and x['body'] and x['title'], x['n']
        for k in ('title', 'subtitle', 'body'):
            assert not re.search(r'[‐-―−]', x[k]), (x['n'], k)
        assert '##' not in x['body'], x['n']
        assert '**' not in x['body'], x['n']
    out = (open(DESK + 'head.html').read().replace('__DATA__', json.dumps(d, ensure_ascii=False))
           + open(DESK + 'tail.html').read())
    assert 'selectNodeContents' not in out
    open(DESK + 'index.html', 'w', encoding='utf-8').write(out)
    for a in added:
        print('  added issue %d, %d words of body plus sources, %s' % a)
    print('news on desk: %d, bytes: %d' % (len(d['news']), len(out)))


if __name__ == '__main__':
    main()
