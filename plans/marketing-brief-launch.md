# Marketing page brief — launch narrative (for the Mobbin design session)

Written by the continue-build session on 2026-07-17. The app side of this
narrative is built and on PR 303. The marketing page is your lane. When you
redo it, please carry this story so the site and the app say the same thing.

Do NOT rebuild the app pages, only the marketing site. Reuse the exact copy from
`lib/content/readiness.ts` so the words never drift between site and app:
`READINESS` (the stamps), `WHY_IT_WORKS` (the science block), `OUR_STANCE` (the
contradiction answer).

## One hero promise (pick one, lead with only it)
Recommendation: **"Get them ready for the phone. No cliff edge."**
Reason: every other screen time app says "end the battle." The readiness on ramp
is the ownable, differentiated position, and it is the true product. "End the
screen time battle" can be the secondary line, not the hero.

## How we do it (the mechanism, show it solves the problem)
Three steps, in the passport frame:
1. Real world quests earn stars, stars earn balanced screen time (habit and
   balance, felt daily).
2. DiGi coaches the parent through the hard moments (scripts, rehearsal, the
   weekly round up with the balance score).
3. The passport: stage by stage the child earns the readiness stamps
   (`READINESS`), so 16 is a gentle ramp, not a cliff. Show the five stamps.

## The science (credibility, measured not moral panic)
Use `WHY_IT_WORKS` verbatim. Candice Odgers and Amy Orben (Cambridge), balance and
competence over a countdown. Leave Haidt out, Justin does not agree with all of
it. The digital passport idea is the Cambridge frame for the gradual pathway.

## The stance (defuse the contradiction up front)
Use `OUR_STANCE` verbatim, visible on the page, not buried: we do not put phones
in children's hands, under 11 is parent led with no child device, own device is a
free opt in for older kids, we never police the family.

## Non negotiables to respect
- No dashes in any copy, ever.
- Checker design tokens, Nunito plus IBM Plex Mono, no purple gradients.
- Every CTA on /join routes to /starter-pack.
- Founder rate capped at 50, enforced in code as well as copy.
- Mobbin first: pull real reference screens before redesigning, translate to our
  butter and ink, never a copy of another brand.

## Full conversion page structure (the efficient signup page)

Build the home marketing page in this order. This is the proven shape of a high
converting single product landing page. One promise, one flow, one CTA repeated.

1. **Hero** (above the fold): the one promise ("Get them ready for the phone. No
   cliff edge."), a one line subhead naming the problem it solves, one primary
   CTA to /starter-pack, and a real product shot (the child app or the pathway).
   No nav clutter. The CTA and the promise are the only jobs here.
2. **The problem** (agitate, briefly): the screen time battle and the 16 cliff
   edge, in the parent's own words. Two or three lines, not a wall.
3. **The solution in one line**: Guided Childhood is the on ramp. Then the three
   step how it works (real world quests earn balanced screen time, DiGi coaches
   the hard moments, the passport builds readiness stage by stage). Reuse the
   passport steps.
4. **Proof / credibility**: the measured science block (`WHY_IT_WORKS`), Odgers
   and Orben, Cambridge. Plus any real numbers or testimonials you have. Do not
   invent social proof, no fake family counts.
5. **The stance** (`OUR_STANCE`): answer the contradiction before a sceptic can
   raise it. We do not put phones in children's hands.
6. **What you get** (scannable): the daily loop, DiGi, the pathway, the weekly
   round up. Short, benefit led, not a feature dump.
7. **Pricing**: annual default with monthly as the downgrade, the founder 50 cap
   named as real scarcity, the trial. One clear price story.
8. **FAQ**: the three or four real objections (is it just screen time, do you put
   a phone in my kid's hand, what age is it for, can I cancel). The stance and the
   science answer most of these.
9. **Final CTA**: repeat the hero promise and the /starter-pack button.

Tactics to hold to: one promise the whole way down, the CTA repeated at hero,
after how it works, after pricing, and at the end; fast load, mobile first, real
product shots not stock; no dashes anywhere; every CTA to /starter-pack.

## Status: READY FOR HANDOVER
The app side of this narrative is built and on PR 303 (readiness passport, the
science, the stance, tailoring by concern, the child buddy picker). The shared
copy is in lib/content/readiness.ts. The mobbin session can start the marketing
page rebuild against this brief now.
