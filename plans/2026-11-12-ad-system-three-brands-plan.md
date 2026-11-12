# The ad system for all three brands (12 November 2026)

Justin: "can we build this also for the Social Billboard and Guided Schools".
The system built for Guided Childhood (ad studio skill, the gate, the
uploader, the results read, the Monday loop) now takes a brand. Each brand is
a profile in `content/ads/brands/<id>.json`: what it sells, to whom, its hook,
its funnel link, how its results are counted, its channels and its own banned
words.

## What the first sweep found (12 November, Ad Library, by hand)

- **The Social Billboard.** Few direct rivals advertise on Meta in the UK.
  The long runners near it: Super Me Show (a children's show sold as "safe
  screen time", statics 466 and 471 days) and Blumi Baby (not a rival, a games
  stick, but its year long video opens on our parent's exact pain: kids asking
  for YouTube or "just one more video"). Kidoodle.TV, YouTube Kids and Hopster
  were not advertising.
- **Schools.** Schools suppliers barely use Meta. The National College (was
  National Online Safety) advertises on LinkedIn to school and trust leaders,
  with a duty and a question. On Meta only Wellio, a PSHE and RSHE scheme
  saying "updates automatically, always compliant", which is our schools
  pitch said first, 8 days old. So schools are LinkedIn first.

## The steps

1. **Brand profiles in the system.** Done in this PR: the three profiles, two
   watchlists, the swipe file tagged by brand, the gate and the uploader
   reading a deck's `"brand"`. Guided Childhood is unchanged.
2. **The Social Billboard round 1**, once Justin agrees the hook and the free
   plan's contents are confirmed against the built product (its own
   evidence file flags this). Needs a dark theme in the ad template (near
   black, #FFD100, Montserrat, from `tools/tsb-playlist-card`), real screens
   of the live product, and the Social Billboard's own Page and ad account.
3. **The Social Billboard's counting.** The site is run by the developer and
   cannot yet count sign ups per link. Until it can, its verdicts are on
   landing page views, said plainly. The ask for the developer: keep the
   utm values on each sign up, as the schools pilot form already does.
4. **Schools round 1 on LinkedIn.** A LinkedIn uploader in the same shape as
   the Meta one (dry run, paused, a receipt), cards at LinkedIn's sizes, the
   hook agreed with Justin, aimed at heads, DSLs and trust leaders. Pilot
   requests already carry `?src` and the utm values.
5. **The Monday loop for each brand.** The scheduled loop reads every live
   round of every brand.
6. **Google search for schools**, after the Google Ads developer token.

## Decisions that are Justin's

- The Social Billboard's hook (proposed: "Build tonight's playlist" with
  "Free on one playlist, no card."), and what the free plan includes today.
- The Social Billboard's Page and ad account, and who is shown as paying.
- Schools: LinkedIn Campaign Manager account and a budget; the hook
  (proposed: "Try a free lesson" with "No login. Ready to teach today.").
