#!/bin/sh
# Download generated files listed in assets/ledger.tsv (path, job id, url, text)
# that are not on disk yet. Each line is generated once; this only fetches.
cd "$(dirname "$0")/.."
while IFS='	' read -r path job url text; do
  [ -z "$path" ] && continue
  [ -s "$path" ] && continue
  mkdir -p "$(dirname "$path")"
  curl -sSf -o "$path" "$url" && echo "got $path"
done < assets/ledger.tsv
