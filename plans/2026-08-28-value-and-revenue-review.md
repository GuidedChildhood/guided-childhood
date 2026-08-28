# 28 August 2026 — Do we solve the problem, is £7.99 justified, and where is the value hiding

Commissioned by Justin: keep the price, review whether we solve the problem, whether
the service is enough, how to make the full power of what is built transparent to
users, an honest view of revenue growth, and what to change. Grounded in
THE-STORY.md and a full platform-mapper sweep of the parent surfaces (28 Aug).

## 1. Do we solve the problem? Honest verdict: yes for the problem we named

The problem as stated: policing without a plan, the nightly fight, guilt, no idea
what to do instead of taking the phone away. Against that, the product delivers the
four things a plan actually needs and no competitor bundles: the words (160 scripts
by stage), the mechanic (three kinds of time and the star quest, the only piece
nobody else has), the advisor (DiGi, calibrated pathways, never allow or deny), and
the proof (baseline check ins, movement per concern, weekly review). The child is a
participant, not a target, which is what makes it a plan rather than a control.

Honest limits, stated so we never oversell:
- The payoff loop needs weeks to show movement; week one must be carried by the
  scripts and the star quest, which is why they must lead every surface.
- Years 7 to 11 curriculum is still a content gap; strongest offer is primary age,
  which is also the named heart of the market, so this is acceptable at launch.
- The product works when the parent sets up the star quest with the child. A parent
  who never brings the child in gets a much thinner product. Activation is the risk,
  not the proposition.

## 2. Is there enough for £7.99 a month? Yes, and the shop window undersells it by half

The complete honest inventory exists in code and, tellingly, in exactly one piece of
copy: components/upgrade/WhatYouAreBuying.tsx, which only a parent who hits the
paywall ever reads. Meanwhile the two public money pages undersell:
- Homepage /#pricing: no star quest, no child app, no homework decoder, no
  printables, no passport, and stale copy ("Weekly three action plan").
- /join: nine feature blocks, again missing the star quest, the child app, the
  homework decoder, printables and the passport. The single differentiator is
  absent from both public sales pages, violating THE-STORY §10.

Price anchors: Good Inside runs roughly three times our founder price for advice
without a child mechanic; blockers (Qustodio, Bark) charge similar money to deliver
the arguments our customer already hates. £7.99 founder and £99 annual are right.
The problem is not the price or the product; it is that a buyer is shown about half
the product before the card ask.

## 3. Transparency: the five fixes (from the platform mapper, ranked, mostly small)

1. SMALL. Put the star quest and the missing half of the product on both public
   money pages: reuse the WhatYouAreBuying rows on app/page.tsx (~954 to 999,
   replacing the stale annual list) and /join (lines 31 to 95). Biggest single gap
   between what is built and what a buyer is told.
2. SMALL. Give /dashboard/what-is-working a permanent door: an ExploreGrid tile plus
   retargeting the two weekly rotation items that currently point at a redirect.
   The payoff page must not depend on a conditional doorway and a Sunday email.
3. SMALL. Fix stale rotation targets (/dashboard/road, /dashboard/passport?tab=)
   and add missing Explore tiles: Devices, Balance, The guide, Toolbox.
4. MEDIUM. Read the baseline back at check in completion: when a score improves,
   show the movement sentence (already built in lib/working/movement.ts) on the
   completion state. Closes the "data goes in, nothing comes back until Sunday" gap.
5. SMALL/MEDIUM. Two new rotation slots: printables ("one sheet for the fridge")
   and, age gated, phone-setup or social-settings, so the offline and settings
   layer stops being invisible.

Also verified while auditing: the welcome email rewrite, setup quest reshape, what
is working dashboard and child link fix are DONE (THE-STORY §12 is stale on these);
the passport tabs page was built and reversed by Justin's instruction; Stripe
checkout hardening is done in code and the remaining owner action is the env keys
on Vercel plus one end to end test purchase.

## 4. Revenue growth, honestly

The model is already set and sound: £4,000 MRR = 325 paying families = the 50
founders plus ~280 standard; at the observed 4 per cent free to paid that needs
~8,000 stage checks. The whole game is stage checks. Levers in order of leverage:

1. Fix the shop window first (fix 1). It is free, it multiplies every other lever,
   and it is the only change that raises conversion on traffic we already get.
2. The LinkedIn engine. Our own analytics: daily posting lifted impressions 378 per
   cent in eight days; the fines series (week one) and Settlement Papers (week two)
   are eleven posts with the funnel discipline already built. This is the top of
   funnel for September.
3. Retention is MRR: fix 4 (immediacy of the proof loop) plus the star quest
   activation are worth more than any acquisition spend. A family whose child is in
   the quest stays; the weekly email already carries the movement block.
4. Schools as distribution, not revenue: one 300 pupil primary is 250 families with
   the school's endorsement. The catalogue land grab and invoice flow exist.
5. Etsy printables: paid channel free acquisition, greenlit 20 July, feeds the same
   funnel.
6. The £79 Apple enrolment unlocks the Capacitor wrapper (push and the widget), the
   retention layer the web cannot fake. Decision gate for a real native build stays
   at 1,000 installs.

What I would NOT do: paid creators before free traffic converts (the playbook's own
money rule), price changes in either direction, and any new feature work before the
five surfacing fixes, because the audit shows the product is already bigger than
its own shop window.

## 5. What I would change, in one list

The five surfacing fixes above; update THE-STORY §12 to match reality; run the
Stripe end to end test before Monday's series launch so the funnel does not land on
a broken till; ICO registration (Justin personally, from the go live checklist);
the Apple enrolment when convenient. Nothing else. Keep the price.
