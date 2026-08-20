#!/usr/bin/env python3
# The Planet Friend colouring sheets, derived from the real character art.
#
# The first colouring sheets were generated fresh on Higgsfield, and the
# generator drew whoever it felt like: the Nova sheet was an egg with a moon
# on its head, photographed as a booklet mockup on a grey background. A child
# who has met Nova knows that is not Nova. Justin, 20 August 2026: the sheets
# "need to actually be proper colouring in pictures that are not photos and
# match exactly the name and shape of planet friends."
#
# So nothing here is generated. The silhouette comes from the alpha channel
# of the same PNG the app shows the child, and the face comes from colour
# edges in the same pixels, which means the sheet matches the character the
# way a tracing matches the drawing underneath: by construction, not by
# prompt. Kept next to cutouts.py for the same reason cutouts.py is kept:
# the next piece of character art will need the same lift.
#
# Usage: python3 scripts/friend-colouring.py
# Reads  public/digi-squad/friends/<key>.png
# Writes public/printables/friends/<key>-colouring.png (1024x1024, white)

from collections import deque
from PIL import Image, ImageFilter
import numpy as np
import os

WORK = 1024          # working scale, 2x the source renders
OUTLINE_PX = 21      # outer contour thickness (about 10px of ink)
FEATURE_PX = 5       # interior line thickness before smoothing
ALPHA_T = 100        # low enough to keep Orbit's antenna ball glow
GRAD_T = 26          # colour edge threshold: faces fire, soft shading does not
MIN_PART = 800       # a silhouette piece smaller than this is fuzz, not friend
MIN_FEATURE = 500    # a feature blob smaller than this is noise or a shine
MIN_INK = 250        # any final ink speck smaller than this is dropped
MARGIN = 70          # breathing room around the framed character

FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo']
CROWN_CUT = {'bloop': 0.18}
SRC = 'public/digi-squad/friends'
OUT = 'public/printables/friends'


def sobel(gray):
    gx = np.zeros_like(gray, dtype=np.float32)
    gy = np.zeros_like(gray, dtype=np.float32)
    gx[:, 1:-1] = gray[:, 2:] - gray[:, :-2]
    gy[1:-1, :] = gray[2:, :] - gray[:-2, :]
    return np.hypot(gx, gy)


def binary(mask):
    return Image.fromarray(np.where(mask, 255, 0).astype(np.uint8))


def grow(img, px):
    return img.filter(ImageFilter.MaxFilter(px if px % 2 else px + 1))


def shrink(img, px):
    return img.filter(ImageFilter.MinFilter(px if px % 2 else px + 1))


def components(mask):
    # 4-connected labelling at half resolution: exact enough for despeckling,
    # and quick enough to run all five friends in a few seconds
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    sizes = {}
    nxt = 0
    for sy in range(h):
        for sx in range(w):
            if mask[sy, sx] and not labels[sy, sx]:
                nxt += 1
                q = deque([(sy, sx)])
                labels[sy, sx] = nxt
                n = 0
                while q:
                    y, x = q.popleft()
                    n += 1
                    for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                        if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not labels[yy, xx]:
                            labels[yy, xx] = nxt
                            q.append((yy, xx))
                sizes[nxt] = n
    return labels, sizes


def keep_big(mask, min_area):
    half = mask[::2, ::2]
    labels, sizes = components(half)
    keep = {k for k, v in sizes.items() if v * 4 >= min_area}
    if not keep:
        return mask
    keep_half = np.isin(labels, list(keep))
    keep_full = np.asarray(binary(keep_half).resize(mask.shape[::-1], Image.NEAREST)) > 128
    return mask & keep_full


def connect_floaters(ink, sil):
    # Orbit's antenna: the glow ball survives as its own piece of ink but the
    # wire under it is two pixels wide and does not. A ball floating over a
    # head is a mistake; a ball on a wire is Orbit. So any piece of ink that
    # sits fully above the body is redrawn as a clean ring and given its wire
    # back, down to the top of the head beneath it.
    half = ink[::2, ::2]
    labels, sizes = components(half)
    if len(sizes) < 2:
        return ink
    main = max(sizes, key=sizes.get)
    main_top = int(np.where((labels == main).any(axis=1))[0].min()) * 2
    h, w = ink.shape
    yy, xx = np.mgrid[0:h, 0:w]
    out = ink.copy()
    for k in sizes:
        if k == main:
            continue
        ys, xs = np.where(labels == k)
        ys, xs = ys * 2, xs * 2
        if ys.max() >= main_top:
            continue
        dy, dx = ys.max() - ys.min(), xs.max() - xs.min()
        # A ball is small and round. Bloop's sprout also labels as a floater
        # when its thin stem falls between samples, and a sprout redrawn as a
        # giant ring is a much worse fate than a shine mark, so anything big
        # or oblong is left exactly as it came.
        if max(dy, dx) > 90 or not (0.6 < (dy + 1) / (dx + 1) < 1.6):
            continue
        cy, cx = int(ys.mean()), int(xs.mean())
        r = max(17, (max(dy, dx) + 10) // 2)
        out[labels.repeat(2, 0).repeat(2, 1)[:h, :w] == k] = False
        dist = np.hypot(yy - cy, xx - cx)
        out |= (dist >= r - 5) & (dist <= r + 4)
        # The wire runs to the first body row BELOW the ball: the silhouette
        # contains the ball too, so its own rows must not count as the head.
        col = np.where(sil[:, cx] & (np.arange(h) > ys.max() + 4))[0]
        if col.size:
            out[cy + r - 2:col.min() + 8, cx - 4:cx + 4] = True
    return out


def process(src_path, out_path, key=''):
    im = Image.open(src_path).convert('RGBA').resize((WORK, WORK), Image.LANCZOS)
    rgba = np.asarray(im).astype(np.float32)
    alpha = rgba[..., 3]
    r, g, b = rgba[..., 0], rgba[..., 1], rgba[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)

    body = alpha > ALPHA_T

    # The renders stand on a soft floor shadow that is fully opaque at its
    # core, so alpha alone cannot drop it. It is the one warm, washed out
    # thing in the bottom of the frame while every friend is a saturated
    # house colour, so colour is the knife: warm and dull, low in the frame,
    # cut it and a little around it so no ledge survives at the feet.
    ys = np.where(body.any(axis=1))[0]
    y0, y1 = ys.min(), ys.max()
    low = np.zeros_like(body)
    low[int(y1 - (y1 - y0) * 0.22):, :] = True
    warm = (r >= g - 6) & (g >= b - 6) & (mx > 60) & (mx < 245)
    shadow = body & low & warm & (sat < 0.5)
    shadow = np.asarray(grow(binary(shadow), 7)) > 128
    sil = body & ~shadow

    # Keep every piece big enough to be character (Orbit's antenna ball is a
    # separate piece and it is staying), then round the mask: the cutout's
    # alpha has stepped fuzz edges, Nova's crown tuft worst of all, and a
    # gaussian pass turns machine steps into the soft bumps a hand would draw.
    sil = keep_big(sil, MIN_PART)
    sil_img = shrink(grow(binary(sil), 9), 9)
    sil_img = sil_img.filter(ImageFilter.GaussianBlur(7))
    sil_img = sil_img.point(lambda p: 255 if p > 127 else 0)
    sil = np.asarray(sil_img) > 128

    inner = np.asarray(shrink(sil_img, OUTLINE_PX)) > 128
    contour = sil & ~inner

    # The face and markings: the strongest colour channel gradient, inside
    # the body only, cleaned of the one-off shading flecks a 3D render
    # scatters everywhere.
    grads = np.max(np.stack([sobel(rgba[..., c]) for c in range(3)]), axis=0)
    feat = (grads > GRAD_T) & (np.asarray(shrink(sil_img, OUTLINE_PX + 6)) > 128)
    feat_img = binary(feat).filter(ImageFilter.MedianFilter(5))
    feat = keep_big(np.asarray(feat_img) > 128, MIN_FEATURE)
    # Bloop's dome carries a specular shine streak that survives every size
    # filter, and a shine is not a feature. The cut is measured from the top
    # of the head proper (where the body first gets wide, so a sprout or
    # antenna does not move it) and is per friend, because Cosmo wears his
    # eyebrows almost this high and a generic rule would shave them off.
    cut = CROWN_CUT.get(key, 0)
    if cut:
        widths = sil.sum(axis=1)
        head_top = int(np.argmax(widths >= widths.max() * 0.35))
        crown = np.zeros_like(feat)
        crown[:int(head_top + (y1 - head_top) * cut), :] = True
        feat &= ~crown
    feat_img = grow(binary(feat), FEATURE_PX).filter(ImageFilter.MedianFilter(5))
    feat = np.asarray(feat_img) > 128

    ink = keep_big(contour | feat, MIN_INK)
    ink = connect_floaters(ink, sil)

    # Frame every friend the same: ink cropped, centred on white, the same
    # margin all round, so the five sheets print as a matching set.
    iy, ix = np.where(ink)
    side = max(iy.max() - iy.min(), ix.max() - ix.min()) + 2 * MARGIN
    art = np.where(ink, 0, 255).astype(np.uint8)
    cy, cx = (iy.min() + iy.max()) // 2, (ix.min() + ix.max()) // 2
    canvas = np.full((side, side), 255, dtype=np.uint8)
    ty0, tx0 = max(0, cy - side // 2), max(0, cx - side // 2)
    sy0, sy1 = max(0, iy.min() - MARGIN), min(WORK, iy.max() + MARGIN)
    sx0, sx1 = max(0, ix.min() - MARGIN), min(WORK, ix.max() + MARGIN)
    oy = (side - (sy1 - sy0)) // 2
    ox = (side - (sx1 - sx0)) // 2
    canvas[oy:oy + (sy1 - sy0), ox:ox + (sx1 - sx0)] = art[sy0:sy1, sx0:sx1]

    out = Image.fromarray(canvas).resize((WORK, WORK), Image.LANCZOS)
    out = out.filter(ImageFilter.GaussianBlur(1.0))
    out = out.point(lambda p: 0 if p < 140 else 255)
    out = out.filter(ImageFilter.GaussianBlur(0.6))
    out.convert('RGB').save(out_path)
    print('wrote', out_path)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for key in FRIENDS:
        process(os.path.join(SRC, f'{key}.png'), os.path.join(OUT, f'{key}-colouring.png'), key)
