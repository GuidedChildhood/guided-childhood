# 1.6 remake: Screens go to bed first, and its parent film

16 November 2026. Made on Justin's yes to the quote. **Nothing here has been
uploaded, posted, scheduled or swapped into the product.**

## The films (in `films/`)

| File | What it is |
| --- | --- |
| `1.6-child-product.mp4` and `-A`, `-B`, `-C` | 16:9, 3:45, the whole film and the three segments the Watch together player plays between its pause cards. Keeps the one line of recap. Rebuilt by the build, not kept in git (about 110 MB) |
| `1.6-child-youtube.mp4` | 16:9, 3:39, no recap, six seconds at the stage check, with `1.6-child-youtube.en-GB.srt` |
| `1.6-child-family.mp4` | 9:16, 1:24, the one big idea, full captions so it reads with the sound off, the stage check at the end |
| `1.6-parent-family.mp4` | 9:16 parent film, captioned, ends at the stage check |
| `1.6-parent-product.mp4` | 9:16 parent film for inside the app, ends at "Book a watch together time". Holds until the booking feature exists, because that button is not built yet |
| `1.6-parent-landscape.mp4` | 16:9 of the parent film |

Thumbnail: `build/work/ov/thumbnail.png` (rebuilt by the build, not kept in git).

## What is different from the live 1.6

- Pebble and DiGi in the house look, every picture drawn from the reference art
  (`public/digi-squad/DiGi-star.png`, `public/digi-squad/friends/pebble.png`).
  DiGi is the gold star in every frame. No screen is ever a villain.
- Tamsin, slower, is the only voice. The name is spoken "Didgee" and written DiGi.
- One line about the body, and it claims nothing beyond the obvious ("your body
  gets the rest it needs"). The original "tidies away the day" line had no
  cleared source and was dropped.
- No closing promise to the child or the grown up. It ends "See you next time."
- The parent film shows one real product screen: the "Their time, three kinds"
  card, filmed from `app/ref-time-tiers` with made up settings.

## Checked

- Every one of the 38 lines was transcribed by machine (whisper, small English
  model) and read against its words. Two were redone: line 22 slurred into "go
  until you're grown up", and line 35 dropped "the words to say".
  Two parent lines failed on the provider twice and were reworded to get them
  through; the new words are in `build/lines.json`.
- Frames of every cut were looked at for the pictures, the words and the safe
  zones.

## Not checked

- **Nobody has listened to either film with the sound on.** Please watch the
  YouTube cut and the parent family cut once before anything goes out.
- There is no music, only DiGi's voice. That is deliberate for a bedtime film,
  but it is a choice to confirm.
- The swap into the product (new segment files on the CDN, the `parent_lesson_segments`
  rows for 1.6) is not done. It changes what families see, so it waits for Justin.

## Cost

68.7 Higgsfield credits, against the 97 quoted: 24 pictures at 2 (48) and 44
voice takes (20.7, including redos; failed takes were refunded). Measured from
the account's own transactions, leaving out another session's spend at the same
time. Job ids: `build/picture-ledger.tsv`, `build/voice-ledger.tsv`.

## Rebuilding

From `build/`, with `pics/` and `audio/` fetched from the ledgers:

```bash
python3 build.py overlays && node overlays.mjs && python3 build.py films
```

`capture-screen.mjs` re-films the product screen from a running dev server.

## Found on the way

`components/quests/TimeTiersCard.tsx` writes "about 1 hours a day" when the
age guide is exactly 60 minutes. A one line fix, not made here because it is
app code outside this lane.
