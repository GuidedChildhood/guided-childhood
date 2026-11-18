# 2.1: One piece is never just one piece, and its parent film

The first NEW film of the series: strangers and contact in games, Stage 2
(ages 8 to 10), with Bloop. Scripted 17 November, made 18 November on Justin's
"Go ahead with all". **Nothing here has been uploaded, posted or scheduled,
and it is not in the app** (see below).

## The films (in `films/`)

| File | What it is |
| --- | --- |
| `2.1-child-youtube.mp4` | 16:9, no recap, the stage check at the end, with `2.1-child-youtube.en-GB.srt` |
| `2.1-child-family.mp4` | 9:16, the Monday to Wednesday story, the move, and the catchphrase, full captions, the stage check at the end |
| `2.1-parent-family.mp4` | 9:16 parent film, captioned with its sources, ends at the stage check |
| `2.1-parent-product.mp4` | 9:16, ends at "Book a watch together time" |
| `2.1-parent-landscape.mp4` | 16:9 of the parent film |
| `2.1-child-product.mp4` and `-A`, `-B`, `-C` | Rebuilt by `build/`, not kept in git; for the app once 2.1 has a place there |

## Checked

- 19 pictures by eye against the DiGi and Bloop reference art. All usable,
  none redrawn. The closing line was changed to fit the picture: Bloop holds
  the found piece, so DiGi says "There it was" rather than "It was on your foot".
- All 37 lines transcribed and read against their words. Three redone: the
  breathing count was flagged by the provider and reworded, "one yes, and it's
  a piece" read as "One, yes" and became "If even one answer is yes", and the
  parent line about moving chat lost its opening words.
- Childline is spoken in words and captioned 0800 1111. The parent film's
  figure (Ofcom) and quote (CEOP) are captioned with their sources.

## Not checked

- **Nobody has listened with the sound on.**

## Not in the app, on purpose

`/api/parent-lessons/complete` awards a stage passport once a child has
completed every active lesson of that stage. As the only active Stage 2 film,
2.1 would award a Stage 2 child the whole Stage 2 passport for one film. It
stays out of the app until there are more Stage 2 films, or the passport rule
changes.

**Decided by Justin, 18 November 2026: YouTube and the family account only for
now.** No app row, no passport change.

## Cost

70.5 Higgsfield credits against the 71 quoted: 19 pictures at 2 (38) and the
voice (32.5, one refused take refunded). Stage 2 lines are longer, so each
cost more than Stage 1's.

## The quote, as given before any spend

- `child-film-script.md`: built from the approved 2.1 script, trimmed to about
  760 words, plus one new beat from the verified Roblox pack: "let's chat
  somewhere else" and "don't tell anyone" are always a check moment. No game
  or app is named or shown.
- `parent-film-script.md`: about 70 seconds. One cleared figure (Ofcom, 55
  percent) and one cleared quote (CEOP), each with its source on screen; the
  promise "If anyone asks you to move to another app, come and tell me."

**The product needs a decision.** Stage 2 has no Watch together films in the
app yet. This one can go to YouTube and the family account once made; putting
it in the app means a new `parent_lessons` row with its segments and cards.

Prices measured on 1.6, 1.5 and 1.4. Balance 186.32 credits on 17 November,
shared with every other session.

| Item | Count | Each | Credits |
| --- | --- | --- | --- |
| New pictures for the Stage 2 set (Bloop and DiGi) | 19 | 2 | 38 |
| Redraws, allow three (each film so far needed one) | 3 | 2 | 6 |
| Parent film pictures (all reused) and the real screen (already captured) | | 0 | 0 |
| Tamsin lines, both films | about 50 | about 0.45 | 23 |
| Redone lines, allow a sixth | | | 4 |
| **The pair** | | | **about 71** |

Higher than 1.4 because this is a new stage: none of the Pebble pictures can
be reused, and Stage 2 films run longer. The build is the 1.4 one, reused as
it is with a new `lines.json`.
