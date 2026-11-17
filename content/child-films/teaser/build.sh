#!/usr/bin/env bash
# The Instagram teaser for the five DiGi films, 9:16. Nothing here uploads anything.
#   node cards.mjs && bash build.sh
# Each film shows its own "one big thing" line, read by DiGi, picture and sound
# from the YouTube cut, then the stage check end card.
set -euo pipefail
T="$(cd "$(dirname "$0")" && pwd)"; W="$T/work"; C="$T/.."
enc=(-c:v libx264 -crf 21 -pix_fmt yuv420p -r 30 -c:a aac -b:a 160k -ar 48000)
silent=(-f lavfi -i anullsrc=r=48000:cl=stereo)
ffmpeg -v error -y -loop 1 -t 2.8 -i "$W/hook.png" "${silent[@]}" -t 2.8 \
  -filter_complex "[0:v]fps=30,format=yuv420p[v]" -map "[v]" -map 1:a "${enc[@]}" "$W/p0.mp4"
list="file 'p0.mp4'"$'\n'
python3 -c "import json;[print(f['n'],f['dir'],f['a'],f['b']) for f in json.load(open('$T/films.json'))]" |
while read n dir a b; do
  read V0 V1 < "$C/$dir/work/vwindow.txt"
  src=$(ls "$C/$dir"/*-youtube-16x9.mp4)
  s=$(echo "$V0+$a"|bc); d=$(echo "$b-$a"|bc); fo=$(echo "$d-0.25"|bc)
  ffmpeg -nostdin -v error -y -loop 1 -t "$d" -i "$W/frame-$n.png" -ss "$s" -t "$d" -i "$src" \
    -filter_complex "[1:v]scale=900:506,setpts=PTS-STARTPTS[f];[0:v][f]overlay=90:640,fps=30,format=yuv420p[v];[1:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.1,afade=t=out:st=$fo:d=0.25[a]" \
    -map "[v]" -map "[a]" -t "$d" "${enc[@]}" "$W/p$n.mp4"
done
ffmpeg -v error -y -loop 1 -t 4.5 -i "$C/1.3-release-test/work/end-9x16.png" "${silent[@]}" -t 4.5 \
  -filter_complex "[0:v]scale=1080:1920,fps=30,format=yuv420p[v]" -map "[v]" -map 1:a "${enc[@]}" "$W/p6.mp4"
printf "file 'p%s.mp4'\n" 0 1 2 3 4 5 6 > "$W/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -c copy -movflags +faststart "$T/five-digi-films-teaser-9x16.mp4"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$T/five-digi-films-teaser-9x16.mp4"
