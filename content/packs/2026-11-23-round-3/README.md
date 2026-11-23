# Ad round 3: three mechanics against left out

Made 23 November 2026 by the weekly ad loop (ad studio Phase 7), on Justin's
"Prepare round 3" of 22 November. Deck:
`tools/social-cards/decks/2026-11-23-round-3.json`. Cards at 2160 by 2700.

Nothing here has been posted, boosted, scheduled or uploaded. Nothing is
loaded or spent without Justin's word.

## The control

Left out (`r1-left-out`), final read 23 November: 9,794 reached, 700 clicks,
£27.89, 20 stage checks begun. That is 2.0 per thousand at £1.39 a check.
Round 3 has to beat those two numbers.

## The three cards

Each borrows one mechanic from an advert that has run a long time
(`Research Pack/15-style-ladder-adlibrary-review.md` section 4). The mechanic
only: no competitor's words, pictures or brand.

| Card | Headline | The one thing that changes | Mechanic | Link code |
| :-- | :-- | :-- | :-- | :-- |
| `01-left-out-one-line.png` | Everyone is on Snapchat. They are not. | The screen: one line of the free script, not the whole of it | Left out, version 2 | `r3-left-out-line` |
| `02-founder-origin.png` | The same argument every evening. So I built this. | The voice: Justin in the first person, plain card, no scene | Founder origin (one sec, 1,094 days) | `r3-founder-origin` |
| `03-left-out-seen.png` | Everyone is on Snapchat. You are not on your own. | The second beat: reassurance for the parent, then the free thing | Moment, reassurance, the free thing (Good Inside carousel) | `r3-left-out-seen` |

### Choices made, for Justin to check

- **Card 1 shows the line not to say.** The brief asked for one free script
  line. The opening line of SAY THIS cannot be cropped cleanly: at every real
  phone width from 360 to 430 the first sentence ends mid line, and a crop
  never cuts a sentence or redraws a screen. The NOT THIS line is a whole
  line of the same free script, and it is the one most of us have said. If
  Justin would rather lead on the line to say, the script page needs a
  capture at a width that breaks cleanly, or the card keeps the full quote.
- **Card 2 is the plain card, not the film.** The brief gives the film first:
  Justin, self shot, vertical, fifteen to twenty seconds. The card is the
  stand in until he films it. The words beside it are his own from the brief:
  a dad of three, the same argument every evening, three questions and the
  words for tonight, free, no card. No child's name, age or story (founder
  canon). If any of it is not how he would say it, change the words, not the
  shape. A film beats a card (proven rule 1), so the film replaces this card
  when it exists, under a new code.
- **Card 3 is one card, not a carousel.** The uploader loads single image
  adverts only. The three beats sit on one card: the moment in the headline,
  the reassurance in the gold line and on the real screen ("This is usually
  true, which is what makes it hard"), the free thing on the button. A true
  three card carousel needs a small change to the uploader and is the next
  step if this card wins.
- **No new scene.** Cards 1 and 3 reuse the round 1 hallway from
  `content/ads/scenes`. Card 2 has none. No Higgsfield credits were spent.
- **The old stage check capture was not used.** `content/ads/screens/stage-check.png`
  is from 19 October, before question one changed, and its words would fail
  the gate today. It wants a fresh capture before any card shows it.

## The checks

- `npm run ad-gate`: passed, three cards. Butter 2.5, 0.9 and 5.3 percent, cap 10.
- Vision pass, out of ten on the skill's ten lines:
  - Card 1: 9. Loses line 10 only, which is Justin's to give.
  - Card 2: 8. Loses line 2 (the full script is small at thumbnail size, as
    on the control) and line 10.
  - Card 3: 8. The first render ran the headline off the card; the gold line
    was shortened to "You are not on your own." and it now sits in two lines at 80px.
    Loses line 9 (the screen's title repeats the headline) and line 10.
- Benchmark, scored from the 22 November read of the library, not reopened
  today: Big Little Feelings' flat question card (376 days) is the closest
  proven advert to cards 1 and 3, and scores about level on lines 1 to 7.
  What theirs does that ours does not: one question and nothing else on the
  card. Ours keeps the real screen because that is our proof. For card 2 the
  closest proven advert is a video (one sec, 1,094 days), so the honest line
  is that the card is the support act and Justin's film is the answer.
- Claim gates: no number, no named or unnamed expert, no outcome promised for
  a child, no synthetic person, no testimonial. "You are not on your own" is
  reassurance, not a count. "Free" and "no card" are true of the stage check
  and the public script page.
- Competitors, 23 November: nobody in the UK library uses "everyone is on
  Snapchat" or "what stage is your child". Kairoo still has no active UK
  adverts.

## Suggested split, for Justin to approve or change

- £10 a card over 7 days, £30 in all, plus left out switched back on at £10
  as the live control, so £40 at most. Without the control running, judge
  against its final numbers above and the most it can cost is £30.
- The uploader as built makes one ad set at £5 a day (£35 at most) and lets
  Meta share the money between the cards. In round 1 that gave left out most
  of the spend. For an even £10 each, each card needs its own ad set: say so
  and the config changes before anything is loaded.

## What Justin does

1. Read the three cards and the words beside them. Change any words.
2. Say the split.
3. Make the three link codes on the founder links page
   (`/dashboard/admin/videos`, channel facebook): `r3-left-out-line`,
   `r3-founder-origin`, `r3-left-out-seen`. The loop does not write to the
   live database, and a code that does not exist counts nothing.
4. Say "load round 3". It goes in paused. He switches on.
5. Film the founder line when he can: it is the stronger version of card 2.
