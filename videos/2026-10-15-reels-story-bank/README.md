# Reels: stories 24, 5 and 10

Built 15 October 2026 from `content/packs/2026-10-14-reels-story-bank`, the
three Justin chose to film first. Silent UGC format (`silent-ugc` skill),
1080 by 1920, 16.8 seconds, quiet music bed.

| Reel | Hook | File |
|---|---|---|
| Story 24 | You did every setting. The arguments did not get the memo. | `renders/reel-story24.mp4` |
| Story 5 | "But everyone else is allowed." You have one sentence before it becomes a row. | `renders/reel-story05.mp4` |
| Story 10 | An hour in Screen Time settings. Still not sure you got it right. | `renders/reel-story10.mp4` |

## How it is built

- **Scene one (6.5s).** A generated plate of objects only (`assets/plates`,
  Higgsfield gpt_image_2_5, about 0.75 credits for all three, approved by
  Justin), with a slow push in. No people, no screens, no text in the image.
  The hook is set in HTML with Nunito 900 over a cream panel, one gold
  underline under the turn.
- **Scene two (10.3s), identical in all three**, so the hook is the only
  thing under test. Cut from the real app recordings of the DiGi shorts
  (`videos/2026-10-09-digi-shorts/assets/rec`, made up family, real screens):
  DiGi's reply (labelled example family, illustrative reply), the Say this
  card of a real script, a check in going to Sorted (labelled this parent's
  own rating), then the stage check end card with DiGi and the mark.
- `node overlays.mjs` renders the text layers; `bash build.sh` builds the
  three films into `renders/` (git ignored, so rebuild after a clone).

## Known gaps

- The product scene shows the coming off screens example in all three. Story
  5's own script ("Everyone has it and I do not") and story 10's own screen
  (the first phone page) are not filmed yet; recording them would make each
  reel's proof match its hook.
- The end card says "Link in bio"; the bio link must go to the stage check.
