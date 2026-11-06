# The Christmas Phone Bundle

A bundle over four packs that already exist (the First Phone Kit, the Phone Under The Tree Treasure Hunt, the Family Phone Agreement, the Calm Down Corner Kit), so it has no pages of its own. The
listing, its price and the files to attach are in `listing/listing.md`. The
photos are `listing/images/`, rendered from `listing/images.html` through
`../bundle-images.js` by `node content/printables/build-pack.mjs christmas-phone-bundle listing`.
Every page in them is the real page render from its own pack's
`images/preview`, so rebuild the photos after any pack in it changes.

Images here: `images/DiGi-star-3d.png` from `public/digi-squad/` and `images/friends/orbit.png` from `public/digi-squad/friends/`, copied unaltered. Nothing is generated or redrawn.
