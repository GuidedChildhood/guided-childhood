#!/bin/sh
# Re-render GDC 058 and run every check. From this folder: sh render.sh
#
# Renderer: HyperFrames 0.8.82, the one the explainer-video and
# talking-head-video skills name. It needs Chrome and ffmpeg on the machine and
# fetches itself through npx the first time. Fonts and GSAP are in assets/, so
# the composition itself needs no network.
set -e
cd "$(dirname "$0")"
export DO_NOT_TRACK=1   # keeps HyperFrames telemetry off
OUT=gdc-058-look-at-the-feed.mp4

python3 check-text.py
npx --yes hyperframes@0.8.82 check
npx --yes hyperframes@0.8.82 render --fps 30 --quality high --output "$OUT" --quiet

# No remux step: HyperFrames already writes H.264, yuv420p, moov before mdat
# (faststart) and no audio stream. The probes below prove it each time.
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,duration -show_entries format=duration,size -of json "$OUT"
ffmpeg -v error -i "$OUT" -f null - && echo "full decode: clean"
python3 - "$OUT" <<'PY'
import struct, sys
f = open(sys.argv[1], "rb"); order = []
while True:
    h = f.read(8)
    if len(h) < 8: break
    size, typ = struct.unpack(">I4s", h)
    if size == 1: size = struct.unpack(">Q", f.read(8))[0]; f.seek(size - 16, 1)
    else: f.seek(size - 8, 1)
    order.append(typ.decode())
print("atoms:", order, "faststart:", order.index("moov") < order.index("mdat"))
PY

# One frame from the middle of every beat (frame numbers from storyboard.md),
# plus the first and last frame, then the contact sheet of the five beats.
mkdir -p frames
grab() { ffmpeg -v error -y -i "$OUT" -vf "select=eq(n\,$1)" -frames:v 1 -update 1 "frames/$2.png"; }
grab 48  beat-1-the-clock
grab 147 beat-2-what-kept-arriving
grab 216 beat-3-the-finding
grab 349 beat-4-the-caveat
grab 529 beat-5-the-close
grab 0   first-frame
grab 593 last-frame
ffmpeg -v error -y -i frames/beat-1-the-clock.png -i frames/beat-2-what-kept-arriving.png \
  -i frames/beat-3-the-finding.png -i frames/beat-4-the-caveat.png -i frames/beat-5-the-close.png \
  -filter_complex "[0][1][2][3][4]concat=n=5:v=1:a=0,scale=540:675,tile=5x1:padding=16:margin=16:color=0x1A1A2E" \
  -frames:v 1 -update 1 frames/contact-sheet.png

sha256sum "$OUT"
