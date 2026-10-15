#!/usr/bin/env bash
# Builds the three silent reels (stories 24, 5 and 10 of the reels story bank).
# Scene one: the generated plate (objects only) with a slow push in and the
# hook set in HTML. Scene two: the same product clip in every reel, cut from
# the real app recordings of the DiGi shorts (made up family, real screens),
# ending on the stage check. Run overlays.mjs first.
#   bash build.sh
set -euo pipefail
cd "$(dirname "$0")"
REC=../2026-10-09-digi-shorts/assets/rec
MUSIC=../2026-10-09-digi-shorts/assets/music-leberch.mp3
OV=assets/overlays
mkdir -p renders work
FPS=30
CREAM=0xF9F8F6

# Scene two, built once and reused, so the hook is the only thing under test.
# Each beat: a crop of a real 3x recording, scaled onto cream under its caption.
beat() { # name src start dur crop_y crop_h width ypos overlay
  ffmpeg -v error -y -ss "$3" -t "$4" -i "$REC/$2.mp4" -i "$OV/$9.png" -filter_complex "
    color=c=$CREAM:s=1080x1920:r=$FPS:d=$4[bg];
    [0:v]fps=$FPS,crop=1170:$6:0:$5,scale=$7:-2:flags=lanczos[ph];
    [bg][ph]overlay=x=(W-w)/2:y=$8:shortest=1[a];
    [a][1:v]overlay=0:0,format=yuv420p" -an -r $FPS "work/$1.mp4"
}
beat digi   hero-chat     14.0 2.8 220  1500 1040 520 beatDigi
beat script script-deck    1.0 2.4 880  1720 1000 470 beatScript
beat check  checkin-great  1.2 2.6 1600 1400 1000 470 beatCheck
ffmpeg -v error -y -loop 1 -t 2.8 -i "$OV/endcard.png" -vf "fps=$FPS,format=yuv420p" -r $FPS work/end.mp4
ffmpeg -v error -y -i work/digi.mp4 -i work/script.mp4 -i work/check.mp4 -i work/end.mp4 \
  -filter_complex "[0][1][2][3]concat=n=4:v=1:a=0,format=yuv420p" -r $FPS work/product.mp4

# Scene one per story, then stitch, then a quiet bed under the whole film.
HOOK_DUR=6.5
for s in 24 05 10; do
  ffmpeg -v error -y -loop 1 -i "assets/plates/story$s.png" -i "$OV/hook$s.png" -filter_complex "
    [0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,
      zoompan=z='1+0.06*on/($HOOK_DUR*$FPS)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=$FPS[p];
    [p][1:v]overlay=0:0,format=yuv420p" -t $HOOK_DUR -r $FPS "work/hook$s.mp4"
  ffmpeg -v error -y -i "work/hook$s.mp4" -i work/product.mp4 -i "$MUSIC" -filter_complex "
    [0:v][1:v]concat=n=2:v=1:a=0[v];
    [2:a]atrim=0:30,asetpts=N/SR/TB,volume=0.35,afade=t=in:d=0.6[a]" \
    -map "[v]" -map "[a]" -shortest -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 160k -movflags +faststart "renders/reel-story$s.mp4"
  echo "built renders/reel-story$s.mp4"
done
