#!/bin/sh
# Contact sheet from a rendered file: one frame every 1.5 seconds, six across,
# the time stamped in the corner, plus the loudness per second so the music
# fade and the first kick can be checked without ears.
#   sh tools/sheet-from-mp4.sh renders/digi-launch-draft-960.mp4 render
set -e
in="$1"; name="${2:-render}"; out="renders/sheet-$name.png"
ffmpeg -v error -y -i "$in" -vf "fps=1/1.5,scale=476:268,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='%{pts\:hms}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.5,tile=6x6:padding=4:margin=4:color=#1A1A2E" -frames:v 1 -update 1 "$out"
echo "sheet $out"
ffmpeg -v error -i "$in" -vn -af "asetnsamples=48000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-" -f null - 2>/dev/null | grep -E "pts_time|RMS_level" | paste - - | awk -F'[= ]' '{printf "%3ds %6.1f dB\n", NR-1, $NF}' | tr '\n' ' ' | fold -w 110
echo
