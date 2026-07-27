#!/usr/bin/env python3
"""Rebuild every printable card cover from page one of its own colour PDF.

The card a parent taps and the sheet they download used to be two separate
generations, which is how four covers ended up starring the retired squad while
the PDFs behind them had already been redrawn with the Planet Friends. A card
promising one thing and a download delivering another is worse than no card.

So the cover is now derived, never drawn: regenerate a PDF, run this, and the
grid is right by construction. Square crop off the top of the sheet, which is
where the title and the character sit, at the width the cards render at. The
Starter Pack keeps the whole page, because it is the booklet the marketing site
hands out rather than a card in a grid.

    python3 tools/printable-covers.py

Needs pdftoppm (poppler-utils) and Pillow.
"""

import glob
import os
import subprocess
import sys
from PIL import Image

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEETS = os.path.join(HERE, 'public', 'printables')
WIDTH = 794
FULL_PAGE = {'starter-pack'}


def render(key: str, out_dir: str) -> str:
    stem = os.path.join(out_dir, key)
    subprocess.run([
        'pdftoppm', '-png', '-f', '1', '-l', '1',
        '-scale-to-x', str(WIDTH), '-scale-to-y', '-1',
        os.path.join(SHEETS, f'{key}-colour.pdf'), stem,
    ], check=True)
    # pdftoppm pads the page number to the width of the page count, so a two
    # page sheet lands as -1 and a ten page sheet as -01.
    pages = sorted(glob.glob(f'{stem}-*.png'))
    if not pages:
        raise SystemExit(f'no page rendered for {key}')
    return pages[0]


def main() -> None:
    import tempfile
    keys = sorted(
        os.path.basename(p)[:-len('-colour.pdf')]
        for p in glob.glob(os.path.join(SHEETS, '*-colour.pdf'))
    )
    if not keys:
        raise SystemExit('no colour PDFs found')

    with tempfile.TemporaryDirectory() as tmp:
        for key in keys:
            page = render(key, tmp)
            im = Image.open(page).convert('RGB')
            if key not in FULL_PAGE:
                im = im.crop((0, 0, WIDTH, WIDTH))
            im.save(os.path.join(SHEETS, f'{key}.png'), optimize=True)
            print(f'{key}  {im.size[0]}x{im.size[1]}')

    print(f'\n{len(keys)} covers rebuilt from their PDFs')


if __name__ == '__main__':
    sys.exit(main())
