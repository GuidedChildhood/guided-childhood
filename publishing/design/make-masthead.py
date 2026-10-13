"""The boho masthead word, drawn from the font's own outlines.

    pip install --target /tmp/pylib fonttools brotli
    PYTHONPATH=/tmp/pylib python3 publishing/design/make-masthead.py

A masthead is a logo, so it is drawn rather than set: each letter of
"Planet" from Fraunces (OFL, publishing/design/fonts) at its softest and
wonkiest, in its own boho rainbow colour, with an espresso outline and a hard
offset shadow, tipped a degree or two like hand lettering. Set as live text
those three layers printed every letter three times into the PDF's text, which
broke search (caught by tests/render.test.ts). As a drawing it carries an
aria label, and the paper's name stays real text in every running head.
fontTools is only needed to regenerate this file, so it is not a dependency.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

HERE = Path(__file__).parent
font = TTFont(HERE / 'fonts' / 'fraunces-latin.woff2')
font = instantiateVariableFont(font, {'wght': 900, 'SOFT': 100, 'WONK': 1, 'opsz': 144})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm

WORD = 'Planet'
COLOURS = ['#C8694A', '#E9B44C', '#A9BA94', '#9FC2C7', '#EFC3B5', '#C8694A']
TILT = [-3, 2, -1.5, 3, -2, 1.5]
INK = '#2E2818'
TRACK = 0.02 * upm
SHADOW = (0.035 * upm, 0.045 * upm)
STROKE = 0.05 * upm
ASC = font['hhea'].ascent

x = 0.0
parts = []
for i, ch in enumerate(WORD):
    name = cmap[ord(ch)]
    g = glyphs[name]
    pen = SVGPathPen(glyphs)
    g.draw(pen)
    d = pen.getCommands()
    bp = BoundsPen(glyphs)
    g.draw(bp)
    x0, y0, x1, y1 = bp.bounds
    cx, cy = x + (x0 + x1) / 2, (y0 + y1) / 2
    # Font units point up; SVG points down. Flip, then tip around the centre.
    t = f'translate({x:.1f} {ASC}) scale(1 -1)'
    tip = f'rotate({-TILT[i]} {cx - x:.1f} {cy:.1f})'
    parts.append(f'<g transform="{t}"><g transform="{tip}">'
                 f'<path d="{d}" fill="{INK}" transform="translate({SHADOW[0]:.0f} {-SHADOW[1]:.0f})"/>'
                 f'<path d="{d}" fill="{COLOURS[i]}" stroke="{INK}" stroke-width="{STROKE:.0f}" stroke-linejoin="round" paint-order="stroke fill"/>'
                 f'</g></g>')
    x += g.width + TRACK

pad = 0.12 * upm
w = x - TRACK + 2 * pad
h = ASC - font['hhea'].descent + 2 * pad
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad:.0f} {-pad:.0f} {w:.0f} {h:.0f}" role="img" aria-label="Planet">'
       + ''.join(parts) + '</svg>\n')
(HERE / 'masthead-planet.svg').write_text(svg)
print(f'wrote masthead-planet.svg, {w:.0f} by {h:.0f} units')
