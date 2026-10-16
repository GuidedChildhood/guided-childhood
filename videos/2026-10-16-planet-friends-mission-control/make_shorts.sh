#!/bin/sh
# Cut one vertical short per friend from the vertical render: the friend's verse,
# with the stage check card crossfading in over the last 3.5 seconds while the
# verse keeps playing. Every short ends at the stage check (silent-ugc rule).
# Usage: sh make_shorts.sh   (after renders/planet-friends-vertical-9x16.mp4 exists)
set -e
SRC=renders/planet-friends-vertical-9x16.mp4
ffmpeg -v error -y -ss 220.5 -i "$SRC" -frames:v 1 renders/endcard-9x16.png
python3 - <<'PY' > renders/short-windows.txt
import json
s = json.load(open("lyrics-timed.json"))
for i, name in [(3, "pebble"), (4, "bloop"), (5, "orbit"), (7, "nova"), (8, "cosmo")]:
    a = max(0, s[i]["start"] - 0.35); b = s[i + 1]["start"] - 0.35
    print(name, round(a, 3), round(b + 2.0, 3))
PY
while read NAME A B; do
  LEN=$(echo "$B - $A" | bc); X=$(echo "$LEN - 3.5" | bc)
  ffmpeg -v error -y -ss "$A" -t "$LEN" -i "$SRC" -loop 1 -t "$LEN" -i renders/endcard-9x16.png -filter_complex \
    "[1:v]format=yuv420p,setsar=1[e];[0:v]setsar=1[v];[v][e]xfade=transition=fade:duration=0.5:offset=$X[o];[0:a]afade=t=in:d=0.3,afade=t=out:st=$(echo "$LEN - 1.2" | bc):d=1.2[a]" \
    -map "[o]" -map "[a]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "renders/short-$NAME-9x16.mp4"
  echo "made renders/short-$NAME-9x16.mp4 ($LEN s)"
done < renders/short-windows.txt
