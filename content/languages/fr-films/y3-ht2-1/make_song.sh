#!/bin/sh
# One draft of the lesson song on Justin's Mac, with the ACE-Step install the
# Planet Friends rap uses. Usage: sh make_song.sh <seed>   (try 42, then 7, 99)
D=$(cd "$(dirname "$0")" && pwd)
A="$D/../../../music/planet-friends-mission-control/ACE-Step-1.5"
[ -d "$A" ] || { echo "ACE-Step is not installed at $A. See content/music/planet-friends-mission-control/PROGRESS.md, Phase 1."; exit 1; }
mkdir -p "$D/outputs"; cd "$A"
~/.local/bin/uv run python "$D/song.py" "${1:-42}" 75 > sample.toml
rm -f instruction.txt
yes "" | ~/.local/bin/uv run python cli.py -c sample.toml > "$D/outputs/song-${1:-42}.log" 2>&1
P=$(sed -n 's/.*Path: \([^ ]*\.mp3\).*/\1/p' "$D/outputs/song-${1:-42}.log" | tail -1)
[ -z "$P" ] && { echo "FAILED, see outputs/song-${1:-42}.log"; exit 1; }
mv "$P" "$D/outputs/song-${1:-42}.mp3"; echo "made outputs/song-${1:-42}.mp3"
