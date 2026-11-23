#!/bin/bash
# One film from cuts/films.json, start to finish (23 November 2026):
# scenes, four recordings, the measured cut, the render. The voice is laid on
# after with tools/mix-voice.py, once the film's opening line exists in assets/vo.
#   DEV=http://localhost:3100 tools/make-film.sh d01
set -e
k=$1; cd "$(dirname "$0")/.."
python3 cuts/make-films.py scenes $k
for s in chat deck followup checkin; do node tools/record2.mjs scenes/film-$k-$s.json | tail -1; done
python3 cuts/make-films.py cut $k
node build.mjs cuts/film-$k.json | head -1
npx --yes hyperframes@0.8.141 render --quality looks --output renders/out/film-$k.mp4 --quiet > renders/out/film-$k.log 2>&1
echo "film-$k rendered"
