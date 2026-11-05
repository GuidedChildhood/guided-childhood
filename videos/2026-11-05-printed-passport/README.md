# The printed Passport, two silent films

Made 5 November 2026 for the printed Passport listing
(`content/printables/guided-childhood-passport/listing/printed-listing.md`).

| Cut | Project | Size | Length | Ends on |
|---|---|---|---|---|
| Etsy listing video | `etsy-square/` | 1080 by 1080 | 12 s | the book, "Made to order · Ages 4 to 16" |
| Reels, TikTok, Shorts, Facebook | `social-vertical/` | 1080 by 1920 | 14.4 s | the stage check line |

Both are written by `build.mjs` from the real page renders of `printed.html`,
so a change to the book is one `build-passport.mjs printed` and one
`node build.mjs` away. Then render each:

    cd etsy-square && npx hyperframes@0.9.16 render -q delivery -o ../renders/printed-passport-etsy-1080x1080.mp4
    cd social-vertical && npx hyperframes@0.9.16 render -q delivery -o ../renders/printed-passport-social-1080x1920.mp4

`renders/` is gitignored, as for every film in `videos/`.

## Rules these follow

- Silent. Etsy strips sound from listing videos, and the silent UGC format
  carries everything in the words on screen.
- Renders of the real pages, no generated hands, booklet or person. When the
  Mixam proof arrives, film the hands on the table version in
  `listing/listing.md` and it replaces the Etsy cut.
- The Etsy cut has no web address or call to action, because Etsy does not
  allow a listing video to send a buyer off Etsy. The social cut ends on the
  stage check, per `.claude/skills/silent-ugc`.
- The sample name on the cover is Sam, never a real child's name.
- Frame 0 is the hook: the line and the book are already on screen.

## Not to post until

The printed listing is live on Etsy. Both films say "printed and posted",
and that has to be true on the day they go out.

Captions: `social.md`.
