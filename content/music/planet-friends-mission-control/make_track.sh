#!/bin/sh
# One track from local_sample.py, renamed, with the instrumental tail cut unless
# it is the instrumental. One at a time: the 16 GB Mac cannot hold two.
# Usage: sh make_track.sh <vocal|instrumental|jazz> <seed> <seconds> <name>
D=$(cd "$(dirname "$0")" && pwd); cd "$D/ACE-Step-1.5"
~/.local/bin/uv run python ../local_sample.py "$2" "$3" "$1" > sample.toml
rm -f instruction.txt
yes "" | ~/.local/bin/uv run python cli.py -c sample.toml > "../outputs/$4.log" 2>&1
P=$(sed -n 's/.*Path: \([^ ]*\.mp3\).*/\1/p' "../outputs/$4.log" | tail -1)
[ -z "$P" ] && { echo "FAILED $4, see outputs/$4.log"; exit 1; }
mv "$P" "../outputs/$4.mp3"; echo "made $4.mp3"
[ "$1" != instrumental ] && cd .. && sh trim_tail.sh "outputs/$4.mp3" "outputs/$4-trimmed.mp3"
exit 0
