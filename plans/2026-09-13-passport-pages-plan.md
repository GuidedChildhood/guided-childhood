# Passport pages: simple to follow, a pass on every page, top motion, flips in when it matters

Justin, 13 September 2026: "review now that pages of passport are simple to
follow, make complete sense of where being achieved, and motion animation is
of top level standard, use all tools necessary, and flips in and out when we
feel a passport attention is needed, and can be linked in each page how to
achieve a pass. All the way to 16, jumping in at any age, easily catch up
able."

## What the review found (the parent's page, on a phone)

1. **No page says what a pass IS.** The five slots are the activity. The stamp
   rule (lib/pathway/stamped.ts) is every lesson, every script, the child's
   stage check. Scripts and the check are not among the five, so a page could
   read full and not be stamped, and the only sentence about it was a fallback
   line after all five went green.
2. **A catch up page looks like five jobs.** Moments, jobs and balance say
   Later on every page that is not the current one, so a family joining at 12
   reads two earlier pages of "Later" and has no idea what catching them up
   actually takes (it is the lessons, the scripts and the check, nothing else).
3. **An ahead page says nothing about when it opens.**
4. **The motion is CSS and half a turn.** The page rotates to 88 degrees with
   ease in, the content swaps, then it rotates back with the same ease in. The
   rings draw once at mount, so flipping to a new page shows it already full.
   No choreography on arrival. Nothing in the book uses GSAP, the house rule.
5. **The book never flips in.** The Today card "Open the passport" is one of
   nine rotating suggestions with no reason attached. Nothing tells a parent
   the page is ready for its check, or that two pages are behind.

## Mobbin references (pulled first)

- Goodreads achievement detail: one plain sentence, "Collect this achievement
  when you finish any 3 books", above a bar. The pass sentence.
- stoic "Your next badges": "To unlock this badge reach 10 days streak, 6/10".
  Requirement plus count on the same row.
- Duolingo quest rows: three rows, a bar and a count each. The three part pass.
- Asana Home "A task is due in 3 days", one card, one button, dismiss. The peek.
- Withings "2/3 of your weekly Walking complete! Tap here". One line nudge.

## Build

- [x] `lib/pathway/passport-pass.ts`: the three parts of a pass from the stamp
      rule, with counts and links, and the one sentence per status (current,
      catch up, ahead with "Opens at 8", passed).
- [x] `components/pathway/PassportPass.tsx`: the block on every stage page,
      "A pass on this page", three rows, read only safe (no links on the
      child's copy).
- [x] `PassportBook`: GSAP page turn (in with power2.in, out with power2.out,
      a shade on the turning page), arrival choreography per page (ring draws,
      area bars fill, slots pop, rows fade up), reduced motion goes straight
      to the end state. `openAtStage` now FLIPS the book open after mount.
- [x] `lib/pathway/passport-attention.ts` + `GET /api/pathway/attention`: the
      one reason the passport wants a look, in priority: page ready for its
      check, pages behind, a few left on this page. Null otherwise.
- [x] `components/home/PassportPeek.tsx`: the small passport flips in on Today
      when there is a reason, one tap opens the book on that page, Not now
      flips it out for the day.
- [x] Pathway page reads `?open=N`; Stamp carries `scriptsDone`,
      `scriptsTotal`, `checkPassed`; the child's book and the dev fixture too.
- [x] Guard `scripts/check-passport-pass.mjs`, mutation tested, in CI.
- [x] Screenshots at 390 and 1440 on the fixture (stage pages, read only, reduced motion, the peek), the turn and the peek sampled frame by frame, tsc, build, 45 CI guards local.
