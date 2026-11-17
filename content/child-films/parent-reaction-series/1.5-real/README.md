# 1.5 remake: Real or pretend?, and its parent film

Subject 2 of the lesson film series ("is this real?"). 17 November 2026.
Made on Justin's yes to the quote. **Nothing here has been uploaded, posted,
scheduled or swapped into the product.**

## The films (in `films/`)

| File | What it is |
| --- | --- |
| `1.5-child-youtube.mp4` | 16:9, no recap, the stage check at the end, with `1.5-child-youtube.en-GB.srt` |
| `1.5-child-family.mp4` | 9:16, the one big idea, full captions, the stage check at the end |
| `1.5-parent-family.mp4` | 9:16 parent film, captioned, ends at the stage check |
| `1.5-parent-product.mp4` | 9:16 parent film for inside the app, ends at "Book a watch together time" (live since 17 November) |
| `1.5-parent-landscape.mp4` | 16:9 of the parent film |
| `1.5-child-product.mp4` and `-A`, `-B`, `-C` | The product film and its three segments. Rebuilt by `build/`, not kept in git |

## Checked

- 14 pictures by eye against the reference art; one redrawn so the upside
  down book reads (the first draw kept as `pics/r01-first.png`, not in git).
- All 36 lines transcribed by machine and read against their words. One redone:
  "When you're not sure" came back with a stutter, and now reads "And if you're
  not sure, ask. Is this real?"
- The real screen in the parent film is the Book a time panel, filmed from
  `app/ref-watch-booking` with made up data.

## Not checked

- **Nobody has listened with the sound on.** No music, DiGi's voice only.
- Not swapped into the product: new segment files on the CDN and the 1.5
  `parent_lesson_segments` rows wait for Justin.

## Cost

43.3 Higgsfield credits against the 53 quoted: 14 pictures at 2 (28) and the
voice takes (15.3, one failed take refunded). All the spend on the account in
that window was this build. Job ids: `build/picture-ledger.tsv`,
`build/voice-ledger.tsv`.

## The quote, as given before any spend

- `child-film-script.md`: the remake, about 3:45, three segments for the
  player, keeping the live title, keyword, catchphrase and pause cards so it
  swaps in with no database change.
- `parent-film-script.md`: about 70 seconds, with the Book a time panel as its
  one real screen.

Prices measured on the 1.6 build (16 November). Balance 269.72 credits on
17 November, shared with every other session.

| Item | Count | Each | Credits |
| --- | --- | --- | --- |
| New pictures, Nano Banana 2.1 at 2k | 13 | 2 | 26 |
| Redraws, allow a quarter (1.6 needed none) | 3 | 2 | 6 |
| Pictures reused from 1.6 (calm breath, pause cushion) | 2 | 0 | 0 |
| Parent film pictures (all reused from the child film) | 4 | 0 | 0 |
| Tamsin lines, both films (1.6 averaged 0.47 a line) | about 37 | about 0.5 | 18 |
| Redone lines, allow a sixth | | | 3 |
| **The pair** | | | **about 53** |

The motion, words and captions are built in code by the 1.6 build
(`../1.6-sleep/build/`), which costs nothing. 1.6 came in at 68.7 against a
quote of 97.

## The build, once approved

The 1.6 build runs as it is with a new `lines.json` and picture list:
pictures, then voice, every line checked by transcript, then the six cuts,
then frames looked at, then Justin listens.
