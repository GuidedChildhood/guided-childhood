# The Whole System Bundle

A bundle over packs that already exist, so it has no pages of its own. The
listing, its price and the files to attach are in `listing/listing.md`. The
photos are `listing/images/`, rendered from `listing/images.html` through
`../bundle-images.js` by `node content/printables/build-pack.mjs whole-system-bundle listing`.
Every page in them is the real page render from its own pack's
`images/preview`, so rebuild the photos after any pack in it changes.

Images here: `images/DiGi-star-3d.png` from `public/digi-squad/`, copied unaltered. Nothing is generated or redrawn.
