# Five packs made Etsy ready, 5 November 2026

The Passport (PR 1407) names five packs on its stage pages. Justin decided on
5 November 2026 that they are checked and fixed before they are listed, and
the Passport does not go live on Etsy before them.

Packs: calm-down-kit, starter-pack, star-chart, earn-your-screen-time,
family-phone-agreement (all in content/printables/).

For each pack:

1. Art audit. Off model or damaged art out: the cream background Pebble in
   the Calm Down Kit, the unapproved Bloop in Earn Your Screen Time, the
   damaged Friend cutouts in the Starter Pack (and so the Star Chart). Every
   Friend from public/digi-squad/friends/, DiGi from DiGi-star.svg or
   DiGi-star-3d.png. "DiGi Junior" becomes DiGi. Nothing generated or redrawn.
2. Re-render A4, US Letter and ink friendly with one build script per pack
   (system Chrome, the main checkout's playwright-core), page previews, and
   check every page by eye.
3. A Passport sticker for the stage page each pack sits on, in the pack's
   last pages, from the pack map in plans/2026-11-05-passport-system-plan.md.
4. A 2000 by 2000 Etsy photo set per pack from listing/images.html, real
   page renders only, after the Passport's images.html.
5. listing.md to the Passport's standard: title, description, 13 tags
   checked by script, list price with the permanent 25 percent sale, floor £4.
6. npm run ai-tells on the listings and on the rendered page text.

Not in scope: uploading to Etsy (the Passport session does the drafts).
