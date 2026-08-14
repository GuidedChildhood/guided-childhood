# The passport gets its own page, and the page is tabs

Justin, 13 August 2026: "this needs to be the only thing on the passport page so
they can access everything from nice tidy tabs starting with passport, looking
really pretty using pastel colours. Each section grouped in buttons like we did
before on home, as its a mess and a long scroll. We have broken the passport as
inside pages live behind the front cover. Split into tabs, click for passport,
click to buy passport and stickers."

## LANE CLAIM

Branch `claude/trusting-engelbart-60d791`. Two roadmap boxes, both named as not
started in decisions.md on 13 August: **the passport tidy** and **the what is
working dashboard**, plus **the monthly shop**. All three empty the same 656
line file, so they are one pass or they overwrite each other.

Open work checked at claim time: `claude/mobbin-ux-references-i142dd` has four
unmerged commits and touches `lib/pathway/daily-tasks.ts`. It does not touch
`lib/home/next-up.ts`, the pathway page or anything under `components/pathway`,
so the lanes do not cross. No migration in this pass.

## THE PROBLEM, STATED HONESTLY

There is no `/dashboard/passport` route. Every passport surface renders inside
`app/(dashboard)/dashboard/pathway/page.tsx`, 656 lines, no tabs, roughly
twenty queries on every open. The tab bar and the side nav both say "Passport"
and both point at that scroll.

`PassportBook` opens on the COVER on purpose (Justin asked for it after living
with the alternative, and the reasoning is in the component header). The cover
is not the bug. The bug is that the cover is the only door, so every inside page
is invisible. Tabs are a second door that leaves the book alone.

## WHAT GETS BUILT

**A real page at `/dashboard/passport`.** Server rendered, tab chosen by
`?tab=`, so every tab is a linkable destination and each tab pays only for its
own queries instead of the twenty the one scroll pays for now.

Four tabs, one stage pastel each, in stage order, so the tabs echo the journey
rather than adding a second palette. All tokens already in `shared/tokens.css`:

| tab | label | fill | text |
|---|---|---|---|
| `passport` | Passport | `--stage-1-bold` | `--stage-1-text` |
| `working` | Is it working | `--stage-2-bold` | `--stage-2-text` |
| `four` | The four things | `--stage-3-bold` | `--stage-3-text` |
| `shop` | Shop | `--stage-4-bold` | `--stage-4-text` |

Nothing above the tab bar. No hero, no preamble. Inside each tab, the sections
are grouped as `SectionTiles` buttons, which is the Home pattern Justin is
pointing at.

**What moves off the pathway page:**

- `PassportToDo`, `PassportBook`, `SocialRoadNova`, `StageReadiness` → Passport
- `IsItWorkingReport`, `FiveADayReport`, `HowFarYouHaveCome` → Is it working
- `LiteracyAreas` → The four things
- the shop → Shop

**What the pathway page keeps:** the road. `PathwayIntro`, `PathwayComplete`,
`FocusStrip`, `StageRoad`, `PlanetCard`, `SchoolChest`, `MeetTheFriends`,
`PathwayJourney`, `PathwayEvidence`, the tailored action, the children list and
the founder card. Stages four to sixteen, and nothing that belongs in a booklet.

**The shop is built once.** `components/shop/Shop.tsx` and its catalogue already
exist and already sell the printed passport and the sticker sheet;
`/dashboard/keepsakes` is the only thing rendering them. The data load moves
into `components/shop/ShopPanel.tsx`, the Shop tab renders it, and
`/dashboard/keepsakes` becomes a redirect that forwards its query string. One
shop, one URL. Stripe's success and cancel URLs move with it.

## THE NUDGE ON HOME

`lib/home/next-up.ts` already carries a `passport` item pointing at
`/dashboard/pathway#passport`. It repoints at `/dashboard/passport` and gains a
gate: it only applies once `first_checkin_at` is set, because before the first
check in there is nothing on the passport worth opening it for.

The shop joins as a **monthly** tier between the two that jump the queue and the
eleven that rotate. It cannot go in the rotation itself: a slot there comes
round every twelve days, which is not monthly, and gating a rotation item on a
date makes it show one month and skip the next depending on where the walk
starts. So it is its own tier, one day a month, never the daily lead, never
ahead of a real need.

## LINKS THAT HAVE TO MOVE

`NavTabs`, `MobileTabBar`, `MobileSecondaryNav`, `BackTo`, the `/dashboard/tracker`
redirect, `next-up`'s concern queue card, `PassportBook` and `StickerBook`'s
`#p-` deep links into the shop, `QuestShortcuts`, `HomeMain`, and the upgrade
page's route labels.

## CHECKS

Typecheck, build, then Chrome DevTools at 390 and desktop on every tab, per
non-negotiable 5. No dashes in any copy.
