# Ad round 2: left out, by school year

Made 16 November 2026 by the weekly ad loop (ad studio Phase 7). Deck:
`tools/social-cards/decks/2026-11-16-round-2.json`. Cards at 2160 by 2700.

Nothing here has been posted, boosted, scheduled or uploaded.

## Why these three

Round 1 had one winner. Left out reached 6,438 people and began 8 stage
checks, 1.2 per thousand at £1.78 a check; the other five began none and are
retired (`content/ads/results-log.md`). Proven rule 10: once a card wins, make
segment versions that change two or three words and nothing else, and let
Meta find who each one speaks to. Rule 11 says the niche is parents of
children 8 to 13 in the first phone years, so the segment is the school year.

| Card | Headline | Words changed from left out | Link code |
| :-- | :-- | :-- | :-- |
| `01-left-out-year-5.png` | Everyone in Year 5 is on Snapchat. They are not. | "in Year 5"; "ten year old" to "nine year old" in the words beside it | `r2-left-out-y5` |
| `02-left-out-year-6.png` | Everyone in Year 6 is on Snapchat. They are not. | "in Year 6" | `r2-left-out-y6` |
| `03-left-out-year-7.png` | Everyone in Year 7 is on Snapchat. They are not. | "in Year 7"; "ten year old" to "eleven year old" | `r2-left-out-y7` |

The control is left out itself (`r1-left-out`), still live. Same scene, same
real `/say/` capture, same crop, same button, same words beside it apart from
the age. Each card has its own `src`, so each is read on its own.

No new scene was generated: the hallway is the round 1 scene from
`content/ads/scenes`, so no Higgsfield credits were spent.

## The checks

- `npm run ad-gate`: passed, three cards. Butter 1.4 percent on each, cap 10.
- Vision pass: the first render broke "Year" from its number across two lines.
  Fixed with a non breaking space, so every card now reads "Everyone in Year 5
  / is on Snapchat. / They are not.", three lines as round 1. Scores out of ten,
  on the skill's ten lines: 9, 9, 9. Each loses line 10 only (Justin would post
  it without changing a word), which is his to give.
- Claim gates: no number, no expert, no promise for the child, nothing a
  competitor says. The headline is the child's own complaint, not our claim.
  The script on screen says Snapchat is thirteen and up, which holds for all
  three years. Year 5 is the one to read closely: the words beside it say a
  nine year old is "not making that up" about plans on Snapchat. That is the
  same line round 1 ran for a ten year old; if it reads too strong a year
  younger, drop the Year 5 card rather than rewrite it.
- Competitors, 16 November: nobody in the UK library says what left out says.
  An exact phrase search for "everyone is on snapchat" returns only our advert.

## What Justin does

1. **Make the three link codes first.** `r2-left-out-y5`, `r2-left-out-y6`
   and `r2-left-out-y7` are not in `video_links` yet, and `/v/<code>` counts
   nothing for an unknown code (it still lands on the stage check, but the
   test cannot be read). Add them on the founder links page
   (`/dashboard/admin/videos`), channel facebook, the same way round 1's were
   made. The weekly loop does not write to the live database.
2. **Then load, when he says so.** `npm run ad-upload -- 2026-11-16-round-2`
   is the dry run (read 16 November: 11 calls, a new campaign, £5 a day for
   7 days, £35 at most if switched on). Adding `--go` loads it paused. Nothing
   switches on without him. Left out keeps running as the control.
