#!/bin/bash
# One film's 30 second cut, start to finish (24 November 2026): the cut, the
# render, the quiet guitar bed, Justin's voice. Needs the film's recordings
# (tools/make-film.sh makes them) and its opening line in assets/vo3.
#   tools/make-ad.sh d04
set -e
k=$1; cd "$(dirname "$0")/.."; O=renders/out
python3 cuts/make-films.py ad $k
node build.mjs cuts/film-$k-ad.json | head -1
npx --yes hyperframes@0.8.141 render --quality looks --output $O/film-$k-ad.mp4 --quiet > $O/film-$k-ad.log 2>&1
python3 tools/remix.py film-$k-ad $O/film-$k-ad.mp4 $O/film-$k-ad-bed.mp4 --music music-guitar.mp3 --from 0 --gain 1.45
python3 tools/mix-ad.py film-$k-ad $O/film-$k-ad-bed.mp4 $O/film-$k-ad-voice.mp4 > /dev/null
python3 tools/remix.py film-$k-ad $O/film-$k-ad.mp4 $O/film-$k-ad-nobed.mp4 --no-music
python3 tools/mix-ad.py film-$k-ad $O/film-$k-ad-nobed.mp4 $O/film-$k-ad-voice-nomusic.mp4 > /dev/null
rm -f $O/film-$k-ad-bed.mp4 $O/film-$k-ad-nobed.mp4
echo "film-$k-ad done"
