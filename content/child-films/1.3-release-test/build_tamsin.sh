#!/usr/bin/env bash
# The 1.3 public versions in DiGi's voice (Tamsin). Nothing here uploads anything.
#   python3 revoice.py build <1.3 full film>  (once the lines are generated)
#   python3 finish_tamsin.py
#   bash build_tamsin.sh
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; W="$D/work"; SRC="$W/1.3-tamsin.mp4"
node "$D/cards.mjs"
read V0 V1 < "$W/vwindow.txt"

# 1. YouTube: the re-voiced film, then six seconds at the stage check.
ffmpeg -v error -y -i "$SRC" -loop 1 -t 6 -i "$W/end-16x9.png" -f lavfi -t 6 -i anullsrc=r=48000:cl=stereo \
 -filter_complex "[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[1:v]scale=1920:1080,fps=30,format=yuv420p,fade=t=in:d=0.4[e];[0:v][a0][e][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart \
 "$D/the-internet-remembers-youtube-16x9.mp4"

# 2. Family account: the one big thing on cream, captions under the picture, then the stage check.
INPUTS=(); FILT="[1:v]trim=$V0:$V1,setpts=PTS-STARTPTS,scale=900:-2[film];[0:v][film]overlay=90:650[b0]"; i=0
while read -r s e; do
  INPUTS+=(-i "$W/cap-$(printf %02d $i).png"); n=$((i+2))
  FILT="$FILT;[b$i][$n:v]overlay=90:1196:enable='between(t,$s,$e)'[b$((i+1))]"; i=$((i+1))
done < <(python3 -c "import json;[print(c['s'],c['e']) for c in json.load(open('$W/captions.json'))]")
DUR=$(echo "$V1-$V0"|bc)
ffmpeg -v error -y -loop 1 -t "$DUR" -i "$W/v-frame.png" -i "$SRC" "${INPUTS[@]}" \
 -filter_complex "$FILT;[1:a]atrim=$V0:$V1,asetpts=PTS-STARTPTS,afade=t=in:d=0.2,afade=t=out:st=$(echo "$DUR-0.3"|bc):d=0.3[a]" \
 -map "[b$i]" -map "[a]" -r 30 -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k "$W/v-body.mp4"
ffmpeg -v error -y -i "$W/v-body.mp4" -loop 1 -t 5 -i "$W/end-9x16.png" -f lavfi -t 5 -i anullsrc=r=48000:cl=stereo \
 -filter_complex "[1:v]fps=30,format=yuv420p,fade=t=in:d=0.4[e];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[0:v][a0][e][2:a]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart \
 "$D/the-internet-remembers-family-9x16.mp4"
echo built
