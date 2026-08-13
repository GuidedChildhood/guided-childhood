"""Lift the five Planet Friends off their cream ground.

The art arrives as a character standing on a soft cream vignette with its own
drop shadow. A cutout has to lose both: the ground AND the shadow, or the
Friend floats with a grey smudge stuck to its feet.

Two rules decide what is background, and the pair is what makes it robust:

  1  it must be UNSATURATED and reasonably light, which the cream ground and
     the shadow both are and no part of these characters is, because every one
     of them is a saturated yellow, green, blue, purple or orange, and

  2  it must be REACHABLE FROM THE EDGE, which protects the whites of the eyes
     and any pale highlight inside the character. Those pass the colour test
     and would otherwise be punched out, leaving holes through the face. That
     is precisely the damage already on the older Pebble, Bloop and Orbit
     cutouts in public/printables/friends, noted in decisions.md on 12 August.

The alpha edge is then feathered by one pixel so the character does not read as
cut out with scissors at 62px on a phone.
"""

from PIL import Image, ImageFilter
from collections import deque
import colorsys
import sys

SRC = {
    '133334_be547506': 'pebble',
    '133337_be90a6e3': 'bloop',
    '133343_3cb59e81': 'orbit',
    '185241_3f99a3c0': 'nova',
    '185244_0c2a39ff': 'cosmo',
}

# Saturation below this and value above it reads as ground or shadow rather
# than as any part of these five characters.
MAX_SAT = 0.22
# A separate piece this fraction of the body or larger is part of the Friend.
# Measured rather than guessed: Orbit's antenna ball and stalk come out at
# 1.9 and 0.7 per cent of the body, and the largest fleck of Nova's table at
# 0.37, so anything between those two numbers separates them cleanly.
MIN_PART = 0.005
DEBUG_COMPONENTS = False
MIN_VAL = 0.50


def is_ground(px):
    r, g, b = px[0] / 255, px[1] / 255, px[2] / 255
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    return s <= MAX_SAT and v >= MIN_VAL


def cutout(path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    px = im.load()

    ground = bytearray(w * h)
    q = deque()

    # Seed from every edge pixel that looks like ground.
    for x in range(w):
        for y in (0, h - 1):
            if not ground[y * w + x] and is_ground(px[x, y]):
                ground[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not ground[y * w + x] and is_ground(px[x, y]):
                ground[y * w + x] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not ground[ny * w + nx]:
                if is_ground(px[nx, ny]):
                    ground[ny * w + nx] = 1
                    q.append((nx, ny))

    # ── AND EVERYTHING BELOW THE FEET ──────────────────────────────────────
    #
    # The colour test above is deliberately timid, because a bolder one leaks
    # through a pale highlight on the silhouette and punches holes through
    # Orbit's belly and Bloop's eye. Tried at 0.38 and that is exactly what
    # happened.
    #
    # What it leaves behind is the ground the character stands on: a soft
    # shadow for most of them and, for Nova, a wooden table top that is too
    # saturated to read as background by any rule loose enough to be safe.
    #
    # That remnant is always in one place. Anything BELOW the lowest
    # unmistakably body coloured pixel is, by definition, not the character.
    # Feet are solid colour, so the cut lands under them and never in them.
    BODY_SAT = 0.45
    floor = 0
    for y in range(h - 1, -1, -1):
        row_has_body = False
        for x in range(0, w, 2):
            if not ground[y * w + x]:
                r, g, b = px[x, y]
                _, s2, v2 = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                if s2 >= BODY_SAT and v2 >= 0.25:
                    row_has_body = True
                    break
        if row_has_body:
            floor = y
            break
    for y in range(floor + 1, h):
        for x in range(w):
            ground[y * w + x] = 1

    # ── AND ANYTHING OUT TO THE SIDES OF IT ────────────────────────────────
    #
    # The rest of the ground sits at the same height as the feet, to the left
    # and the right: a soft cast shadow for most of them, and the ends of
    # Nova's table. A floor cut cannot reach it because it is not below
    # anything.
    #
    # It is always OUTSIDE the character though. These five are centred and
    # symmetrical, so the widest body coloured pixel marks the edge of the
    # Friend and everything beyond it is scenery. Horizontal only, with a
    # margin: clipping vertically would take the top off Pebble's stalk and
    # Orbit's antenna, which are thin and not always solidly saturated.
    left, right = w, 0
    for y in range(h):
        for x in range(w):
            if not ground[y * w + x]:
                r, g, b = px[x, y]
                _, s2, v2 = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                if s2 >= BODY_SAT and v2 >= 0.25:
                    if x < left:
                        left = x
                    if x > right:
                        right = x
    margin = int(w * 0.02)
    left = max(0, left - margin)
    right = min(w - 1, right + margin)
    for y in range(h):
        for x in range(w):
            if x < left or x > right:
                ground[y * w + x] = 1

    # ── ONE MORE FILL, NOW THAT THE CLIPS HAVE OPENED NEW EDGES ────────────
    #
    # The last of the ground is the cast shadow directly between the feet. The
    # first fill could not reach it around the outside of the character, and
    # the floor and side cuts do not cover it because it is neither below the
    # feet nor beyond them.
    #
    # It is reachable NOW though: the cuts above have exposed fresh boundary
    # right beside it. So the same conservative colour test runs again, seeded
    # from everything already known to be ground. Same timid rule, more places
    # to start from, which is why this cleans up without any of the leaking
    # that a bolder threshold caused.
    q2 = deque(i for i, g in enumerate(ground) if g)
    while q2:
        idx = q2.popleft()
        y, x = divmod(idx, w)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not ground[ny * w + nx]:
                if is_ground(px[nx, ny]):
                    ground[ny * w + nx] = 1
                    q2.append(ny * w + nx)

    # ── AND KEEP ONLY THE FRIEND ───────────────────────────────────────────
    #
    # Two dark flecks of Nova's table survive every colour rule, because they
    # are genuinely dark and genuinely saturated: they are the shadowed edge of
    # the wood. What gives them away is not their colour, it is that they are
    # not attached to anything.
    #
    # The Friend is one piece. Stalks, sprouts, antennae and horns are all
    # joined to the body, so the largest connected opaque region IS the
    # character and everything else is debris.
    comps, seen = [], bytearray(w * h)
    for start in range(w * h):
        if ground[start] or seen[start]:
            continue
        comp, qc = [], deque([start])
        seen[start] = 1
        while qc:
            idx = qc.popleft()
            comp.append(idx)
            cy, cx = divmod(idx, w)
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < w and 0 <= ny < h:
                    n = ny * w + nx
                    if not ground[n] and not seen[n]:
                        seen[n] = 1
                        qc.append(n)
        comps.append(comp)
    comps.sort(key=len, reverse=True)
    if DEBUG_COMPONENTS:
        print('   components:', [len(c) for c in comps[:6]])
    # Keep the body and anything a reasonable fraction of its size. Orbit's
    # antenna is a real part of the character whose stalk is too thin and too
    # pale to survive as one piece with the head, so largest-only decapitated
    # it. Nova's table flecks are two orders of magnitude smaller.
    biggest = len(comps[0]) if comps else 0
    keep = bytearray(w * h)
    for comp in comps:
        if len(comp) >= biggest * MIN_PART:
            for idx in comp:
                keep[idx] = 1
    for idx in range(w * h):
        if not keep[idx]:
            ground[idx] = 1

    alpha = Image.frombytes('L', (w, h), bytes(255 if not g else 0 for g in ground))
    # One pixel of feather, so the edge is not a staircase when it is drawn
    # small. Any more and the character grows a halo of its own colour.
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))

    out = im.convert('RGBA')
    out.putalpha(alpha)
    return out, sum(ground) / (w * h)


if __name__ == '__main__':
    for stamp, name in SRC.items():
        img, ratio = cutout(stamp + '.png')
        img = img.resize((512, 512), Image.LANCZOS)
        img.save(f'cut-{name}.png', optimize=True)
        # A sanity number: these characters fill roughly a third of a square
        # frame, so anything outside 0.45 to 0.85 means the fill has either
        # eaten the character or barely touched the ground.
        print(f'{name}: background removed {ratio:.0%}', 'OK' if 0.45 <= ratio <= 0.85 else 'CHECK')
