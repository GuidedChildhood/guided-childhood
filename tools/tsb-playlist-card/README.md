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
- Colours come from the live site on 1 October 2026: near black `#0A0A0A`,
  grey `#A1A1A1`, and the one accent, yellow `#FFD100`, which is every CTA
  button on thesocialbillboard.com. The age line takes the accent. `accent`
  in the deck accepts `yellow` (default), `pink` (#E91E8C, the colour in the
  brief) or `red`.

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
