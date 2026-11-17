#!/usr/bin/env bash
# Tiles up to nine pictures into a contact sheet: sheet.sh out.jpg p01 p02 ...
out=$1; shift; args=(); f=""; i=0
for p in "$@"; do args+=(-i "pics/$p.png"); f="${f}[${i}:v]scale=600:335,setsar=1[v${i}];"; i=$((i+1)); done
L=""; for ((j=0;j<i;j++)); do L="${L}[v${j}]"; done
lay="0_0|600_0|1200_0|0_335|600_335|1200_335|0_670|600_670|1200_670"
lay=$(echo "$lay" | cut -d'|' -f1-$i)
ffmpeg -v error -y "${args[@]}" -filter_complex "${f}${L}xstack=inputs=${i}:layout=${lay}" -frames:v 1 "$out"
