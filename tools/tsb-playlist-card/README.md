# The Social Billboard weekly playlist card

One template, two sizes, a new playlist a week. Change the deck JSON, run the
render, post the PNG.

    node tools/tsb-playlist-card/render.mjs

Output lands in `out/<deck>/` as PNGs plus a `.alt.txt` per card with the alt
text to paste into the post.

## How it is built

- The sky is our own artwork, made on Higgsfield (gpt_image_2_5) with no text,
  no logos, no thumbnails, no people. Four skies live in `backgrounds/`. Make a
  new one for a new theme (ocean, dinosaurs, Minecraft) with the same prompt
  shape: flat graphic, no text, empty space on the left and the middle, one
  small motif bottom left, one small motif top right.
- The words are HTML on top, in Montserrat, the live site font, self hosted in
  `fonts/`. Text stays crisp and editable; image models still mangle words.
- Colours come from the live site: black, white and the one accent, yellow
  `#FFCE1B` (`--color-primaryYellow` in the site's CSS), which is every CTA
  button on thesocialbillboard.com. No pink: it is not a brand colour (Justin,
  6 October 2026). The age line takes the accent. `accent` in the deck accepts
  `yellow` (default) or `red`.

## Why the card looks like this (sign ups, not likes)

- The eyebrow says "free" before anything else, and the pill repeats the site's
  own CTA. A parent who sees only the image, with no caption, still knows what
  to do and where.
- "No card needed. Nothing autoplays after it." is the objection and the
  promise in one line, both lifted from the landing page, so the post and the
  page say the same thing.
- One accent colour, one big word, plenty of empty sky. The feed is loud; the
  card is not.
- No dashes in copy. "9 to 11", never "9–11".

## A new week

Copy `decks/space-9-to-11.json`, change `headline`, `age`, `meta`, the
`background` and the `alt`, then render. Keep `eyebrow`, `ctaText`, `siteNote`
and `site` as they are unless the landing page changes.

## The series layer (5 October 2026)

Every Social Billboard franchise uses one system, so the account reads as a
set of series rather than a new design each post. A deck with
`"kind": "series"` gets three things on every slide:

- the masthead: `series` top left, `issue` top right, a hairline under it;
- the session bar at the foot: a start dot, a track that fills slide by slide,
  and an END block that fills on the last slide (a session with a beginning
  and an end, drawn);
- optional `chips` (the builder's own choices; any chip starting "Age" is
  the one filled chip, white on dark slides and black on light ones), `ends` (the ENDS WITH line on a
  weekly playlist), `photo` or `photoFull` (a labelled slot for a real photo),
  `sky` (a background from `backgrounds/`), `note`, `pill`.

Word budget: `node tools/tsb-playlist-card/check-words.mjs` (12 words on slide 1, 25 after). The method is the `sb-carousel` skill.

`"kind": "reels"` renders 1080 x 1920 Reel covers with every word inside the
3:4 grid crop and nothing in the bottom 380px. Set `"guides": true` to draw
the safe zones (`decks/reels-00-cover-spec.json`).

The primary CTA on every pill is "Get a free playlist". The launch decks and
what each is for are listed in `plans/sb-parent-launch-control.md`.
