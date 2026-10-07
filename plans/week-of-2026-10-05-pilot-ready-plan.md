# Pilot ready: every lesson video plays, and the lessons a trust will open work

Justin, 7 October 2026: "sample lesson is not working, the video here, DiGi intro
not playing ... press play doesn't work. Run a review over lessons to make sure
all works before going to pilot." He is about to email a trust offering the
pilot, with links to /curriculum, /hub/rshe-mapping and /hub/dsl.

## What is wrong

Every video slide in the scheme (11 slides in 6 lessons) is the generator's raw
output: HEVC Main 10, 10 bit, in an hvc1 MP4. Browsers only decode that with a
hardware decoder for it. Firefox does not, Chrome on Linux does not, and Chrome
or Edge on a school laptop without one shows a black box whose play button does
nothing ("The element has no supported sources"). Reproduced on the live taster,
slide 2, "DiGi opens the lesson".

Two of the six lessons are the primary pilot pair (ks1-03, ks2-06), so a pilot
primary school would meet it in both of its lessons.

The five Planet Friend intro clips are already H.264 and are fine.

## The fix

1. Convert the 11 clips to H.264 High 4.0, 8 bit 4:2:0, 1080p24, AAC 48 kHz,
   moov first. Same pictures, same sound, about the same size.
2. Host them in schools/public/clips/ under their generator filenames, so the
   school site serves them and nothing depends on the generator's CDN.
3. Migration 361 points each video slide at its clip by absolute address
   (https://schools.guidedchildhood.com/clips/...), absolute because the kid app
   on the parent domain plays the same school lesson rows as star lessons.
   Backed up, idempotent, proved: no video slide left on the CDN, exactly 11
   moved, no slide count changed. Applied only after the deploy carrying the
   clips is live, so no lesson ever points at a file that is not there yet.
4. The six content mirrors (content/modules, content/standalone) carry the
   same addresses.
5. A guard, scripts/check-lesson-clips.mjs, in CI: every video slide in the
   mirrors points at a clip that exists in schools/public/clips and is H.264,
   never HEVC. The next generated clip cannot ship in a format a school laptop
   cannot play.

## The review before the pilot email

A browser sweep of what the trust will open: the home page, /curriculum,
/hub/rshe-mapping, /hub/dsl, /pilot, and every slide of the free taster and the
three free standalone lessons, at 1440 and 390. Must fix items are fixed in
this PR; the rest are listed for Justin.

## The email

Claims checked against the live pages, the Gmail redirect links replaced with
the real addresses, and a recommendation on links versus the pilot form.
