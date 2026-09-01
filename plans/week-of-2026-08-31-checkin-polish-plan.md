# Check-in polish and wiring plan · week of 31 August 2026

Justin, 1 September 2026, after the five lane check-in audit: "all and make
sure apply level of UX." Build every group from the audit, Apple level UX,
on the existing star instrument. The stars, the bands, the 2/4/6/8/10 posts
and everything downstream stay exactly as decided on 12 to 19 August.

## The five groups, in build order

1. **Verdict pop and progress counter** (ConcernCheckIn.tsx)
   - "2 of 5" progress line at the top of the card, counting saved rows.
   - The live question at full strength, waiting questions softened until
     their turn, so the list reads one at a time without hiding anything.
   - The verdict becomes a pop-in chip that SURVIVES on the folded row:
     "✓ Bedtime screens · up from hard going" instead of the verdict being
     destroyed after 2.6 seconds.
   - The fold itself animates (height settle, not a snap); reduced motion
     keeps the jump.
   - Skip gets a 44px tap target.
   - Dead code and stale comments from the audit cleaned up in passing.

2. **Baseline daily promise copy** (ConcernCheckIn.tsx)
   - Baseline intro gains the cadence: we check in each day and show the
     movement. First-save verdict says "Tomorrow reads against this one."

3. **Dip helpers made real** (ConcernCheckIn.tsx + digi context)
   - A dip renders two real buttons: Ask DiGi (carries the concern into
     /dashboard/digi) and the matched script via signal-map.
   - DiGi's live concern context block gains the latest score, band word
     and days-since, read from concern_events, so DiGi genuinely knows
     about this morning's dip.

4. **Data fixes** (server)
   - Weekly review email gate: families with scored check-ins this week
     get the email even with no quest ticks.
   - Event-write ordering: the history row is written before status moves;
     a failed write returns an error so the row can be retried, never a
     silent "Saved" with no history.
   - Moment keys map onto the baseline concern slugs on /api/daily/feedback
     so "log it as a moment and it returns here on its own" is true for the
     seeded four worries.
   - Child names on movement everywhere: getMovements carries child, the
     What is working page, the weekly email block and the Sunday round-up
     say whose line is whose.

5. **Review and monitoring wiring**
   - review.md gains a named check-in section (bands post 2/4/6/8/10, band
     vs band comparison, per child rungs, words never numbers).
   - scripts/check-concern-dots.mjs fixed for the grey-stars design and
     wired into CI alongside the wiring check.
   - THE-STORY.md check-in line updated from "1 to 10" to the five stars.
   - The Wednesday walkthrough routine prompt gains the RETURNING check-in
     (grey stars, verdict, five star drop-off, multi child handover).
   - decisions.md appended.

## Constraints

- Instrument unchanged: five stars, bands post band tops, server compares
  bands. No migration to the scale.
- No dashes in any copy. Checker tokens only. Motion subtle and guarded.
- Verify on app/ref-baseline-checkin (renders the live component with
  fixtures) plus tsc plus the fixed guard script.
