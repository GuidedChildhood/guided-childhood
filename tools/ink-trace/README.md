# Ink trace: real drawings that draw themselves

Why the first explainer looked basic: its pictures were four hand typed SVG
paths per icon (`videos/_templates/explainer-draw/icons.json`, a clock is two
strokes). The draw on mechanism was right. The drawings were not drawings.

The fix, proven 1 October 2026 (`example-bedtime-ink.png` and `.svg`):

1. **Generate a real ink illustration on Higgsfield.** `gpt_image_2_5`, 1:1,
   prompt shape: "A hand drawn ink line illustration, single confident pen
   strokes, black ink on plain cream paper, no shading, no fill, no colour, no
   text. [the scene]. Loose, warm, editorial sketch style like a New Yorker
   spot illustration. Plenty of empty paper. Line art only, suitable for
   tracing into vector paths." One generation gives a usable drawing.
2. **Trace it to SVG.** `python3 tools/ink-trace/trace.py in.png out.svg`
   (needs `pip3 install vtracer`, which compiles once). It thresholds the ink
   and traces the outlines into a handful of paths.
3. **Draw it on.** Put the SVG in the composition with `fill:none; stroke:
   ink` on every path and animate `stroke-dashoffset` from the path length to
   zero across the paths in order, exactly as `drawPath()` already does in
   the explainer template. At 60 per cent the figure is half drawn; at 100 it
   is the illustration.

What this does not yet do: the explainer template's `build.mjs` still reads
`icons.json`. Next step is to let a brief point a beat at an SVG from this
tool instead of an icon name. Until then, generate and trace here, then paste
the paths into the beat.

The other half of "amazing motion graphics" is not drawing at all: it is
Seedance clips of the character from the reference art, with our captions on
top in HyperFrames. See `videos/2026-10-01-how-digi-works/` for that pipeline:
draft at 480p for 18 credits a clip, review, finalise only the keepers.
