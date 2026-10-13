#!/bin/sh
# Records one scene with record2.mjs, one at a time. If Chrome hangs on close
# after the last frame (it does when two recorders run at once), this encodes
# the frames itself. Only frames newer than this run count, so a stale folder
# from an earlier take can never be encoded by mistake.
#   sh tools/rec-safe.sh <scene name>        (DEV defaults to localhost:3000)
cd "$(dirname "$0")/.."
s=$1
tot=$(python3 -c "import json;print(round(json.load(open('scenes/$s.json'))['seconds']*30))")
marker=$(mktemp); sleep 1
DEV=${DEV:-http://localhost:3000} node tools/record2.mjs scenes/$s.json > renders/rec-$s-safe.txt 2>&1 &
pid=$!
while kill -0 $pid 2>/dev/null; do
  sleep 5
  n=$(find renders/rec/$s -name 'f-*.jpg' -newer $marker 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -ge "$tot" ]; then sleep 20; kill $pid 2>/dev/null; break; fi
done
n=$(find renders/rec/$s -name 'f-*.jpg' -newer $marker | wc -l | tr -d ' ')
[ "$n" -ge "$tot" ] || { echo "$s FAILED: only $n of $tot new frames (see renders/rec-$s-safe.txt)"; exit 1; }
ffmpeg -v error -y -framerate 30 -i renders/rec/$s/f-%05d.jpg -vf "format=yuv420p" -c:v libx264 -crf 14 -preset slow assets/rec/$s.mp4 && echo "$s ok: $n new frames"
