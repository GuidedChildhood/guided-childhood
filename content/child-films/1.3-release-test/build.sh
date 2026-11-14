#!/usr/bin/env bash
# Builds the 1.3 release test from the live film. Nothing here uploads anything.
#   bash content/child-films/1.3-release-test/build.sh <path to the 1.3 full film>
# The film is the live "full" segment of lesson 1.3 on the generator's CDN.
set -euo pipefail
SRC="$1"; D="$(cd "$(dirname "$0")" && pwd)"; W="$D/work"; mkdir -p "$W"
CUT_A=227.95; CUT_B=237.15        # the closing promise to the grown up comes out
ffmpeg -v error -y -ss 62 -i "$SRC" -frames:v 1 "$W/ellie.png"
ffmpeg -v error -y -i "$D/../../brand-assets/guided-childhood-lockup-1600x600.png" \
  -vf "colorkey=0xF9F8F6:0.06:0.02,crop=iw:ih*0.5:0:ih*0.25" "$W/lockup.png"
python3 "$D/captions.py"
node "$D/cards.mjs"

# 1. YouTube: the whole film, the promise line cut, then six seconds at the stage check.
ffmpeg -v error -y -i "$SRC" -loop 1 -t 6 -i "$W/end-16x9.png" -f lavfi -t 6 -i anullsrc=r=48000:cl=stereo \
 -filter_complex "
  [0:v]trim=0:$CUT_A,setpts=PTS-STARTPTS[v1];[0:v]trim=$CUT_B,setpts=PTS-STARTPTS[v2];
  [0:a]atrim=0:$CUT_A,asetpts=PTS-STARTPTS,afade=t=out:st=$(echo "$CUT_A-0.15"|bc):d=0.15[a1];
  [0:a]atrim=$CUT_B,asetpts=PTS-STARTPTS,afade=t=in:d=0.15,aresample=48000,aformat=channel_layouts=stereo[a2];
  [a1]aresample=48000,aformat=channel_layouts=stereo[a1s];
  [1:v]scale=1920:1080,fps=30,format=yuv420p,fade=t=in:d=0.4[v3];
  [v1][a1s][v2][a2][v3][2:a]concat=n=3:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart \
 "$D/the-internet-remembers-youtube-16x9.mp4"

# 2. Family account: the one big thing, 30.0 to 107.6, on cream, captions under the picture.
V0=30.0; V1=107.6
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
cp "$W/thumbnail.png" "$D/the-internet-remembers-thumbnail-1280x720.png"
echo built
