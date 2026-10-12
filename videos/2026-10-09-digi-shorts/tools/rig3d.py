#!/usr/bin/env python3
# Rigs the approved 3D DiGi star so it can act like the code version: the two
# eyes are lifted onto their own transparent layers, and the sockets are filled
# from the star's own surrounding colour (a diffusion fill, nothing drawn), so
# an eye can blink (squash to a line), wink and look left or right a few pixels.
# The art is not redrawn: every eye pixel is the original render.
import json, numpy as np
from PIL import Image, ImageFilter
SRC = '../../public/digi-squad/DiGi-star.png'
im = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float64)
H, W, _ = im.shape
EYES = {'l': (412, 492), 'r': (616, 493)}
R_EYE, R_FILL = 40, 47      # the eye with its soft socket shadow, and the area refilled
yy, xx = np.mgrid[0:H, 0:W]
base = im.copy()
for k, (cx, cy) in EYES.items():
    r = np.hypot(xx - cx, yy - cy)
    m = r <= R_FILL
    # Start from the ring colour, then diffuse inward until smooth.
    ring = (r > R_FILL) & (r <= R_FILL + 6)
    base[m] = base[ring].mean(axis=0)
    x0, x1, y0, y1 = cx - R_FILL - 12, cx + R_FILL + 12, cy - R_FILL - 12, cy + R_FILL + 12
    for _ in range(400):
        crop = Image.fromarray(np.clip(base[y0:y1, x0:x1], 0, 255).astype(np.uint8))
        sm = np.asarray(crop.filter(ImageFilter.BoxBlur(2))).astype(np.float64)
        sub = base[y0:y1, x0:x1]; mm = m[y0:y1, x0:x1]
        sub[mm] = sm[mm]
    # Eye sprite: original pixels, feathered alpha at the socket edge.
    a = np.clip((R_EYE + 4 - r) / 6.0, 0, 1)
    sprite = np.dstack([im, a * 255])[cy - R_EYE - 6: cy + R_EYE + 6, cx - R_EYE - 6: cx + R_EYE + 6]
    Image.fromarray(sprite.astype(np.uint8)).save(f'assets/digi-3d-eye-{k}.png')
Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).save('renders/digi-3d-noeyes-rgb.png')
size = 2 * (R_EYE + 6)
json.dump({'w': W, 'h': H, 'eyeSize': size, 'eyes': {k: {'cx': cx, 'cy': cy} for k, (cx, cy) in EYES.items()}}, open('assets/digi-3d-rig.json', 'w'), indent=1)
print('rig written', size)
