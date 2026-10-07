# Read cards: every script written for Justin to say, in card sized pieces

Built 7 October 2026 from a sweep of the repo and Google Drive for everything
written for Justin to say to camera or as voice over since July 2026. Posts,
captions, carousel text, emails, DiGi and Planet Friends lines, lesson scripts
and HeyGen avatar scripts were left out on purpose.

Two decks, printed four A6 cards to an A4 page, one idea per card, big type:

- `2026-10-07-main.pdf` (14 pieces, 116 cards): everything with a date or a
  live slot, in filming order. The handover series, the stage check voice
  over, the Social Billboard demo reel, the two Social Billboard reels and
  the Top 5 show, the Penny video, four LinkedIn shorts, YouTube video 1.
- `2026-10-07-appendix.pdf` (15 pieces, 147 cards): the fifteen interview
  questions, the ten Last Stretch episodes, the two desk show films (host only
  cuts) and two older reels. Optional; film after the main deck.

The decks are built by `tools/read-cards/deck-2026-10-07.py` (the scripts,
verbatim from their sources, chunked by `chunk.py`) and printed by
`tools/read-cards/build.mjs` (Playwright and Chrome). Rebuild:

```
python3 tools/read-cards/deck-2026-10-07.py
node tools/read-cards/build.mjs content/read-cards/2026-10-07-main.json content/read-cards/2026-10-07-main.pdf
```

## How the cards work

One clip per card. Hold up the card number on your fingers for a second, say
the card, pause two seconds either side. Retakes on the same clip are fine. The
cover page carries the setup; each piece opens with a setup card. Clips go to
the Mac uncut (AirDrop) or Drive 05 New Footage Inbox; the talking head skill
cuts, captions and frames them.

## What the sweep found that is not in the decks

- The 29 September Penny cards in `videos/2026-09-29-penny-smart-glasses`
  were replaced on 30 September by a shorter version in the Daily Briefs (no
  unverified Meta product lines, "Guided Childhood" not "Guided Digital
  Childhood"). The deck carries the 30 September version.
- Social Billboard YouTube videos 2 to 4 and the weekly Safe Watch short are
  outlines only. They get written before filming.
- GDC-024, GDC-027 and GDC-028 in Drive have a 45 to 75 second short with
  only an opening line scripted. Written when their post runs.
- The "Justin-Only Switch Pack" (1 October, Drive, another session) is a
  parallel handover series with different wording. The scheduled version is
  the 2 October handover pack; the switch pack is not in the decks.
- The eight episode app walkthrough series (20 September) and the Planet
  Friends desk show guest lines wait on the character cast; the host only
  cuts of the two desk show films are in the appendix.
- No footage of Justin exists anywhere yet: the Drive video library folders
  (to camera, footage inbox, edits, masters) are empty and nothing is logged
  in `content/brand-story/posted-log.md`. One 34 MB file,
  RecordIt-1791286948.MP4 (6 October, My Drive root), may be the stage check
  screen recording and has not been opened.
