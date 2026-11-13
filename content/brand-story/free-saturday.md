# Free Saturday: one free printable a week, built to be claimed

Justin, 13 November 2026: carousels that offer a free resource each week and
get our Instagram followers to leave an email or sign in for the free
downloads. This is the format for the Happy News Saturday printable strand,
every week from 14 November 2026 at 10:00. The Saturday engine
(`~/.claude/scheduled-tasks/gc-weekly-promise`) builds from it; the schedule
is `content/printables/free-saturdays.json`, the tasters
`content/printables/free-tasters.json`.

## Why it is built this way (research, 13 November 2026)

Full report and sources: `content/packs/2026-11-14-free-saturday/research.md`.

- **The bio link is the leak.** 3 bio link opens a week (`Carousels/_build/what-works-live.md`). Every extra tap loses people, so the offer goes where they already are: the post, a Story the same evening, and a single bio link that never changes.
- **The big parenting accounts ask for a comment keyword** and send the link by DM (Big Life Journal, Talking Point Cards, through 2025). It is the strongest lever found, but every conversion number for it is vendor data. **It is off until Justin rules on it** (the 6 November fix pack bans comment keywords; see "The keyword question").
- **Sends and saves drive reach** (Mosseri, January 2025), and carousels lead on saves (Socialinsider 2025). So the pages on the slides must be usable without downloading anything, and the last card is a send line.
- **A weekly slot is a test, not a proven habit.** No published evidence that a named weekly freebie builds repeat opt ins. It runs with its own src tags so we find out.

## The eight rules

1. **One taster a Saturday**, the row in `free-saturdays.json` for that date. Never a `hold` taster. No repeat within eight weeks (the test holds it).
2. **Seven cards, in this order**:
   1. The cover: a real photo of the printable in a home (the `real-life-photos-v2` set), the eyebrow "Free Saturday · ages X to Y", a headline of 12 words at most that names the moment the pack is for.
   2. The second hook: what it is, one line, then how it runs in one sentence taken from the pack's own words.
   3. The printable in use: the second real photo, captioned with the pack's own instruction.
   4. The value card: what the free pages hold, as a list a parent can use tonight without downloading.
   5. The real page, flat: one taster page from `public/printables/free/tasters/`.
   6. The offer, on ink: eyebrow "Free, just your email"; what the free pages are; then the full pack, softly: "free in the Guided Childhood app for four days, no card" (only when `inApp` is true) and "on Etsy to keep" (only when there is a listing).
   7. The send card: "Send this to the parent who…", with "Free <thing>, just your email: link in bio." as one short line under it.
3. **"Free" always sits next to what it costs**: "just your email" (CAP Code 3.24).
4. **The words come from the pack.** Activities, steps and lines are quoted from the product PDF. No figures, no claims about what a child will become.
5. **The link is always `/free/this-week`**, which opens that Saturday's taster until the next one. Tag each place:
   - Instagram bio: `https://www.guidedchildhood.com/free/this-week?src=ig-bio&utm_source=instagram&utm_medium=bio`
   - Story link sticker (19:00 the same day, card 1 as the image): `?src=ig-story&utm_source=instagram&utm_medium=story&utm_campaign=<mmdd-slug>`
   - Facebook post body: `?src=fb&utm_source=facebook&utm_medium=social&utm_campaign=<mmdd-slug>`
   Never anything about the person in a link.
6. **Captions**: line 1 is the search phrase ("Free Christmas countdown printable for kids…"); a short warm body in the family voice; "just your email"; the app line when true; "Free <thing>: link in bio."; one real question; exactly three specific hashtags. Facebook gets card 1 only, the longer text and the real link.
7. **Two doors, both free**: the taster page asks for an email (the printable comes whether or not the optional tips box is ticked), and its "Get all N pages free" button goes through the stage check into the four free days, where every in app pack is free.
8. **Consent (PECR)**: the download never depends on marketing. The tips box on the gate is optional and unticked; only a tick enrols the address in the lead emails (migration 396).

## The keyword question (waiting for Justin)

If Justin lifts the fix pack ban for Saturday posts, the cover gets a small badge and the send card a second line, both with one topical word in capitals that changes every week (COUNTDOWN, PHONE, CALM; never LINK or FREE):

- Card 7: "Comment COUNTDOWN and we'll send it to your DMs."
- Caption line 2: the same, plus "Not following us? Check your message requests."
- First DM, under 120 characters with one button: "Here it is. Tap below and we'll send your free countdown pages." Button: "Send it".
- Second DM, after the tap: the `/free/this-week?src=ig-dm&utm_source=instagram&utm_medium=dm&utm_campaign=<mmdd-slug>` link and one line about the stage check.

It needs a Meta approved automation tool connected to the Instagram account (ManyChat has a free tier). Connecting it is Justin's step. `ladder.ts` errors on comment keywords, so the Saturday decks stay in `tools/social-cards` rather than the carousel skill's Review Queue.

## Counting it

`free_download_counts` (migration 392) gives claims and new leads per taster and per src. Read it each Monday beside `what-works-live.md`: which src brings claims (bio, Story, Facebook, and the DM if it is switched on), and whether any taster is claimed far above the rest. The first £50 of paid promotion, if Justin ever wants it, goes only behind the Saturday post with the most claims, through Ads Manager to the same landing page, never an instant form (it skips the stage check).
