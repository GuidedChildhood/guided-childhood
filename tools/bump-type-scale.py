#!/usr/bin/env python3
"""Raise the parent app's type scale.

Justin, on a real phone: the text is way too small, make it much bigger across
the app. He is right, and it was not one screen. Every size in the parent app
was set by hand in an inline style, roughly two and a half thousand of them, so
there was no single number to turn and no honest way to do this by hand.

The rule, deliberately dull so it is predictable and reversible:

  under 9px      left alone   micro marks inside small dots and badges, where
                              two more pixels overflows the thing holding them
  9 to 20px      plus two     the whole readable range: labels, body, sub copy
  over 20px      left alone   already display sized, and mostly emoji glyphs
                              sized to fit a fixed box

Plus two rather than a percentage on purpose. It lifts the small end most in
relative terms, which is where the pain was (a 10px mono label gains a fifth,
a 20px heading gains a tenth), and it can never reorder the hierarchy: anything
bigger than its neighbour before is still bigger after.

clamp() sizes move too, but only when the top of the clamp is 22px or under, so
the hero headings that already fill a phone screen stay exactly as they are.

Scope is the parent app only. The child app and the marketing site have their
own typography that Justin has signed off on screen, so they are excluded.

    python3 tools/bump-type-scale.py [--dry]
"""

import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCLUDE_PREFIXES = ('app/k/', 'components/kid/')
EXCLUDE_CONTAINS = ('(marketing)', 'node_modules')

FLOOR = 9      # below this, a size is a micro mark and stays put
CEILING = 20   # above this, a size is display or a sized glyph and stays put
BUMP = 2
CLAMP_MAX = 22


def bumped(v: float) -> float:
    return v + BUMP if FLOOR <= v <= CEILING else v


def fmt(v: float) -> str:
    return str(int(v)) if v == int(v) else str(v)


SIZE_QUOTED = re.compile(r"(fontSize:\s*')([\d.]+)(px')")
SIZE_BARE = re.compile(r"(fontSize:\s*)([\d.]+)(\b)(?!\s*[.\w])")
CLAMP = re.compile(r"clamp\(\s*([\d.]+)px\s*,\s*([^,]+?)\s*,\s*([\d.]+)px\s*\)")


def rewrite(src: str) -> tuple[str, int]:
    changed = 0

    def quoted(m):
        nonlocal changed
        v = float(m.group(2))
        n = bumped(v)
        if n != v:
            changed += 1
        return f'{m.group(1)}{fmt(n)}{m.group(3)}'

    def bare(m):
        nonlocal changed
        v = float(m.group(2))
        n = bumped(v)
        if n != v:
            changed += 1
        return f'{m.group(1)}{fmt(n)}{m.group(3)}'

    def clamp(m):
        nonlocal changed
        lo, mid, hi = float(m.group(1)), m.group(2), float(m.group(3))
        # Only the clamps that live in the readable range. A hero that already
        # fills the screen at its top end is left alone.
        if hi > CLAMP_MAX:
            return m.group(0)
        changed += 1
        return f'clamp({fmt(bumped(lo))}px, {mid}, {fmt(bumped(hi))}px)'

    src = SIZE_QUOTED.sub(quoted, src)
    src = SIZE_BARE.sub(bare, src)
    src = CLAMP.sub(clamp, src)
    return src, changed


def in_scope(path: str) -> bool:
    rel = os.path.relpath(path, HERE)
    if any(rel.startswith(p) for p in EXCLUDE_PREFIXES):
        return False
    return not any(c in rel for c in EXCLUDE_CONTAINS)


def main() -> None:
    dry = '--dry' in sys.argv
    files = []
    for root in ('app', 'components', 'lib'):
        for ext in ('tsx', 'ts'):
            files += glob.glob(os.path.join(HERE, root, '**', f'*.{ext}'), recursive=True)
    files = sorted(f for f in files if in_scope(f))

    total, touched = 0, 0
    for f in files:
        src = open(f).read()
        out, n = rewrite(src)
        if n:
            total += n
            touched += 1
            if not dry:
                open(f, 'w').write(out)
            print(f'{n:5}  {os.path.relpath(f, HERE)}')

    print(f'\n{total} sizes raised across {touched} files{" (dry run)" if dry else ""}')


if __name__ == '__main__':
    main()
