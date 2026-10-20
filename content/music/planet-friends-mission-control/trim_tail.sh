#!/bin/sh
# Cut the instrumental tail off a draft: split the vocals with Demucs, find where
# they stop for good, and end the song 1.5 seconds later with a 1.5 second fade.
# Usage: sh trim_tail.sh <song.mp3> <out.mp3>
set -e
IN="$1"; OUT="$2"; NAME=$(basename "$IN" .mp3); STEMS=outputs/stems
~/.local/bin/uvx --python 3.11 --from "demucs==4.0.1" --with "torchaudio<2.9" --with soundfile \
  demucs --two-stems=vocals -n htdemucs -o "$STEMS" --mp3 "$IN" >/dev/null 2>&1
V="$STEMS/htdemucs/$NAME/vocals.mp3"
LEN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# The last silence that runs to the end of the file is the instrumental tail.
TAIL=$(ffmpeg -i "$V" -af silencedetect=n=-32dB:d=3 -f null - 2>&1 | sed -n 's/.*silence_start: \([0-9.]*\).*/\1/p' | tail -1)
[ -z "$TAIL" ] && { echo "no vocal free tail found"; cp "$IN" "$OUT"; exit 0; }
END=$(echo "$TAIL + 1.5" | bc); FADE=$(echo "$END - 1.5" | bc)
ffmpeg -v error -y -i "$IN" -t "$END" -af "afade=t=out:st=$FADE:d=1.5" -b:a 192k "$OUT"
echo "song $LEN s, vocals stop at $TAIL s, trimmed to $END s -> $OUT"
