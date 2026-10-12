#!/usr/bin/env python3
# Takes the white ground out of the approved 3D DiGi render
# (public/digi-squad/DiGi-star.png, rgb24 on white) without touching the star.
# The ground is found by flood filling the near white from the four corners;
# everything inside the silhouette stays fully solid with its original colour,
# so the star's own white highlights never turn see through. Only the soft
# outer edge and the drop shadow use colour to alpha against white.
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert('RGB')
im = np.asarray(img).astype(np.float64) / 255.0
d = 1.0 - im
key = np.clip((d.max(axis=2) - 0.02) / 0.98, 0, 1)
# Ground: near white pixels reachable from the corners.
near = Image.fromarray(((d.max(axis=2) < 0.10) * 255).astype(np.uint8))
fill = near.copy()
W, H = fill.size
for c in ((0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)):
    ImageDraw.floodfill(fill, c, 128)
ground = np.asarray(fill) == 128
inside = Image.fromarray(((~ground) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))
inside = np.asarray(inside.filter(ImageFilter.GaussianBlur(2))).astype(np.float64) / 255.0
a = np.maximum(key, inside)
safe = np.where(key > 1e-4, key, 1)
unwhite = np.clip(1.0 - d / safe[..., None], 0, 1)
# Inside the silhouette the original colour; on the edge the colour to alpha colour.
rgb = inside[..., None] * im + (1 - inside[..., None]) * unwhite
out = np.dstack([rgb, a])
Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(dst)
print('wrote', dst)
