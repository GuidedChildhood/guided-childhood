#!/usr/bin/env bash
# Contact sheet of a film at fixed times: frames.sh film.mp4 out.jpg W H t1 t2 ...
f=$1; out=$2; w=$3; h=$4; shift 4; args=(); i=0; flt=""
for t in "$@"; do args+=(-ss "$t" -i "$f"); flt="${flt}[${i}:v]trim=end_frame=1,scale=${w}:${h},setsar=1[v${i}];"; i=$((i+1)); done
L=""; lay=""; cols=6
for ((j=0;j<i;j++)); do L="${L}[v${j}]"; x=$(( (j%cols)*w )); y=$(( (j/cols)*h )); lay="${lay}${x}_${y}|"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${flt}${L}xstack=inputs=${i}:layout=${lay%|}:fill=black" -frames:v 1 "$out"
