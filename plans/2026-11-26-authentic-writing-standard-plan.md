# The authentic founder writing standard: plan and record, 26 November 2026

Justin's brief of 26 November: make the standard permanent in every content
workflow, keep an editorial watchlist, build the voice profile from his own
words only, run ten checks before anything is done, review the backlog, keep
every existing control.

## Built

| Part of the brief | Where it lives |
|---|---|
| Editorial watchlist from the seven sources (two Reddit threads unreadable) | `content/brand-story/editorial-watchlist.md` |
| Voice profile from his own words; AUTHENTIC, MIXED and GENERATED kept apart | `content/brand-story/voice-bible.md`, sections 1 and 5b |
| The ten checks, the four nevers, replies to people | `.claude/skills/founder-voice-review/SKILL.md`; short form in START HERE (`scripts/radar/packformat.mjs`) |
| Check 5, openings and endings against the last ten posts; check 4 across posts | `scripts/radar/openings.mjs` (`npm run openings`), tested in `scripts/forum-tells.test.mjs` |
| No forced closing question; repost ask optional | `config/content-engine.json` `linkedin`; `scripts/radar/qa.mjs` no longer fails a post without a question |
| The standard in the settings | `config/content-engine.json` `voice.authenticStandard`, `voice.never` |
| Backlog review with preserved originals and v2 copy | `content/packs/2026-11-26-backlog-authenticity-review/` |

Every platform is covered because the skill runs on every outward word (CLAUDE.md
routing line) and QA runs the guard over every format.

## Unchanged

Approval, evidence, numbering, deduplication, scheduling, the weekly limit of
three personal LinkedIn posts, the reserve of about five, and automatic
publishing off.

## Needs Justin

1. Approve, change or reject the v2 copy for 059, 060, 061, 062, 063 and 067
   (060 first: its consultation closes 3 December). Until then v1 stays the
   approved text and nothing new goes to Metricool.
2. Paste the two r/linkedin threads if he wants them in the watchlist.
3. Share three or four things he wrote alone (a voice note, a message to a
   friend about the product, an old post) so the voice profile and the meter
   rest on AUTHENTIC writing.
