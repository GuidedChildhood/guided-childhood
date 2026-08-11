#!/usr/bin/env python3
"""Rebuild every printable's cover from page one of its own colour PDF.

Justin, 11 August 2026, with two screenshots of the child's app: "make sure all
printables are higher quality, best you can do" and, on the Word Fishing card,
"again this thumbnail does not look good please fix."

He is looking at a sheet of A4 that has been cropped square. Every cover in
public/printables was rendered at 794 by 794 out of a page that is 596 by 843
points, which is A4 portrait, so a third of the page was thrown away before the
file was ever saved. The card then cropped it a second time with object-fit
cover in a square tile, and what survived both cuts was the title and the top
inch of the picture. A child looking at that cannot tell what they are about to
print, which is the only job a cover has.

So the covers are rendered at the shape of the paper, whole, and the cards show
them whole. Nothing here is redrawn: the source is page one of the same colour
edition the family downloads, so a regenerated PDF regenerates its own cover and
the two can never drift.

    python3 scripts/build-printable-previews.py           write them
    python3 scripts/build-printable-previews.py --check   fail if any is stale

--check is what CI would ask: every colour PDF has a cover, the cover is the
shape of its page, and it is big enough to read.

Needs PyMuPDF (pip install pymupdf).
"""

import glob
import os
import sys

import fitz  # PyMuPDF

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRINTABLES = os.path.join(HERE, "public", "printables")

# 1400px on the long edge, which is about 167 dpi on A4.
#
# The biggest a cover is ever drawn is the 190px hero on the child's home, which
# a 3x phone asks for at 570, so this is well over twice what any card needs.
# It is deliberate: next/image resizes on the way out, so a larger source costs
# a family nothing to receive and leaves room for a bigger card later. Against
# that, these are full colour illustrations rather than line art, so the file
# size is real, and 1400 keeps the whole library inside a couple of megabytes.
LONG_EDGE = 1400

# A4 portrait, 596 by 843 points. Anything else is a sheet built to a different
# page and the cover would be the wrong shape, which is the fault being fixed.
EXPECT_RATIO = 843 / 596


def cover_path(pdf_path: str) -> str:
    """my-sheet-colour.pdf becomes my-sheet.png, which is what the registry reads."""
    key = os.path.basename(pdf_path)[: -len("-colour.pdf")]
    return os.path.join(PRINTABLES, key + ".png")


def render(pdf_path: str):
    """Page one at the shape of the paper, whole. Returns (pixmap, ratio)."""
    doc = fitz.open(pdf_path)
    page = doc[0]
    ratio = page.rect.height / page.rect.width
    # Scale off the height so a page that is not quite A4 still lands on the
    # same long edge rather than coming out a different size from its neighbours.
    zoom = LONG_EDGE / page.rect.height
    # No alpha. These are sheets of paper and a transparent background would let
    # a dark card show through what should be white.
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    doc.close()
    return pix, ratio


def main() -> int:
    check = "--check" in sys.argv
    pdfs = sorted(glob.glob(os.path.join(PRINTABLES, "*-colour.pdf")))
    if not pdfs:
        print("FAIL  no colour editions found in public/printables")
        return 1

    failures = 0
    for pdf in pdfs:
        out = cover_path(pdf)
        name = os.path.basename(out)
        pix, ratio = render(pdf)

        if abs(ratio - EXPECT_RATIO) > 0.02:
            print(f"FAIL  {name} is built to a page that is not A4 portrait ({ratio:.3f})")
            failures += 1
            continue

        if check:
            if not os.path.exists(out):
                print(f"FAIL  {name} has no cover")
                failures += 1
                continue
            # The shape is the whole point. A square cover is the old cropped
            # one and it has to fail rather than quietly stay on the card.
            import struct
            with open(out, "rb") as f:
                head = f.read(24)
            w, h = struct.unpack(">II", head[16:24])
            got = h / w
            if abs(got - EXPECT_RATIO) > 0.02:
                print(f"FAIL  {name} is {w} by {h}, which is not the shape of the paper")
                failures += 1
            elif h < 900:
                print(f"FAIL  {name} is only {h} tall, too small to read")
                failures += 1
            else:
                print(f"PASS  {name}  {w} by {h}")
            continue

        pix.save(out)
        kb = os.path.getsize(out) // 1024
        print(f"wrote {name}  {pix.width} by {pix.height}  {kb}KB")

    if check:
        print(f"\n{'all passed' if failures == 0 else str(failures) + ' failed'}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
