import sys, vtracer
from PIL import Image, ImageOps
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('L')
# threshold to clean black on white so the tracer sees only ink
bw = im.point(lambda v: 0 if v < 140 else 255).convert('RGB')
bw.save(out + '.bw.png')
# centreline mode gives open stroke paths that can draw themselves
vtracer.convert_image_to_svg_py(out + '.bw.png', out, colormode='binary', mode='polygon', filter_speckle=8, path_precision=2, hierarchical='cutout')
svg = open(out).read()
print('paths:', svg.count('<path'), 'bytes:', len(svg))
