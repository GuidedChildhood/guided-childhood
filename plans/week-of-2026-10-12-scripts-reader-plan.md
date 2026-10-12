# The scripts reader, rebuilt for the phone and for the moment

Justin, 12 October 2026: "make sure the scripts page fits great on mobile
phones and is extremely useful and attractive, really makes everything
important stand out and workable and easy to follow. Research the UX, 10 out
of 10 useful and accurate and workable for parents and proven to solve issues.
Better than Good Inside. Easy to use, save, shareable on social media to other
parents and to the child."

Four agents researched this in parallel: the codebase, the mobile UX with
Mobbin references, the evidence on whether scripts work at all, and the share
and child side. What follows is where they agree.

## The finding, in one line

**On a 390px phone the first screen of a script contains not one word a parent
can say.** Rendered and measured: roughly 460 to 520px of furniture (back link,
Try as deck, two pills, title, situation at 19px unclamped, a read tick, a
"wrong script?" link, a ban note, then a band reading "Four steps, in order")
before the quote begins. A parent in the kitchen with the child in front of
them scrolls to find the words.

## What the evidence changed about the content, not just the layout

- **`tonight` is the most evidenced field in the record and it renders last.**
  Hiniker 2016 (CHI, observational): previously agreed rules accounted for only
  9 percent of endings, and the parent's voice calling the end is what made
  endings worse. Wilder 2005: antecedent strategies did nothing without follow
  through. Gollwitzer and Sheeran 2006: a cue paired with a response, formed in
  advance, d = 0.65 across 94 tests. The before is the evidenced part.
- **Direct beats indirect, and asking twice is worse than asking once.** A 2025
  child welfare RCT coding real commands: direct commands far more likely to
  produce compliance, beta 0.75 (95% CI 0.58 to 0.94), and compliance FELL as
  command frequency rose. In DPICS coding, "shall we" and "let's" and any
  question form are indirect.
- **Measured against our own library (342 rows):** 65 use an indirect ask, 87
  contain a question mark, 93 take over fifteen seconds to say aloud, 77 run
  over three sentences. About a quarter fails on at least one axis.
- **Rehearsal is not a nice to have.** PCIT meta analysis (Thomas 2017, 23
  studies, SMD -0.87): studies requiring skill mastery showed -1.09 against
  -0.51 for non mastery. A script is a rehearsal object, not a reading object,
  which is the argument for the live gear and for keeping DiGi rehearse.
- **We are missing the single most evidenced technique.** Praise, specific and
  immediate, is one of only three techniques Leijten 2019 (154 trials) found
  associated with stronger effects. No field holds the line for the ten seconds
  after it works. `check_back` is a week later and is measurement, not
  reinforcement.

## The build

### 1. The reader: one sheet, two gears

One route, one URL, one saved position. Prepare is what you get; **Use it now**
is one butter dock button in the thumb zone flipping to `?live=1` by state, not
navigation, so the bookmark and the share link stay pointed at one thing.

Prepare order: sticky bar, stage chip, H1 (2 lines max), situation (17px/1.50,
clamped to 2 lines), **SAY THIS hero**, NOT THIS, IF THEY PUSH BACK, WHY IT
WORKS (the only collapsible block), TONIGHT, then status and navigation.
Blocks 0 to 4 come to about 440px, inside the honest 620px first paint budget.

Live gear: full bleed, one card per screenful, four cards maximum (opening
line, push back, escalation, landing). Ink dashes not dots. Tap the lower two
thirds AND swipe, always both, because a parent holding a confiscated tablet
cannot swipe. Screen Wake Lock so the phone does not dim mid sentence.
Rationale and NOT THIS are removed from this gear on purpose: showing the wrong
words half a second before speaking primes the wrong line.

Type: hero quote 28px Nunito 800 at 1.30 capped to 30ch; situation 17px at
1.50; rationale 17px at 42ch. Easterbrook: arousal narrows the cues a person
can process, so the live gear shows one cue per screen and never asks the
parent to hold four steps in their head.

### 2. The four steps are not steps

"Four steps, in order" numbers a thing you say, an anti example, a theory
block and a before action. Drop the band and the numbering. Label by job.

### 3. Share: fix the loop before extending it

**A verified live bug.** `app/m/[id]/opengraph-image.tsx` fetches with the anon
key and its comment says the table is publicly readable. Checked the grants:
`anon` holds every privilege on `daily_moments` EXCEPT SELECT, revoked by
migration 275. Every shared link unfurls blank today.

Then a public read only script page on the `/m/[id]` pattern (service role,
one id, named columns), because the native share sheet already exists in six
places and currently shares a `/dashboard` URL that bounces a stranger to
login. Ofcom Online Nation 2025: WhatsApp reaches 90 percent of UK online
adults, 74 percent daily. That is the surface, not Instagram.

Fork the help share from the £5 referral share. CAP 2.1 means a referral link
must declare itself, and "I get £5 too" is exactly the sentence that stops a
script being sent into a class chat.

Give the whole script away in the share, which is what Good Inside does: the
atomic unit is free, the library is the product. Half a script is not useful
standalone, so it does not get sent, and a share that is not sent costs the
loop and saves nothing.

### 4. The child version: extend, do not reword

Never reword a parent script for a child, and never ship `if_they_push_back`
to a child: they learn their objection was anticipated and pre countered, which
is the coercive frame in literal form. Migration 163 already built the right
shape (`child_scripts`, `tell_a_parent_cards` with `the_promise`,
`what_happens`, `never`), rendering on both sides.

Honest framing: involving the child does NOT reduce screen time (NORC 2,084
analysed; involvement at 5 to 10 associated with slightly MORE, B 0.06). It is
associated with higher prosocial functioning, rising with age (ß 0.21 at 14 to
17), and Weinstein and Przybylski 2019 (preregistered, ~1,000 British
adolescents) found controlling framing provoked reactance and concealment while
autonomy supportive framing raised trust. So build it for the 14 year old
first, not the 4 year old, and sell it as less concealment, never as
compliance.

## Not in this pass, and why

The content pass tightening `say_this` across ~300 rows against cue, one direct
ask and fifteen seconds. It is a copy job, it is Sonnet work, and it needs
Justin's ruling on follow through first (see below).

## Two factual exposures to fix

- THE-STORY: "forty years of attachment research sits behind this" is
  defensible for attachment generally, not for repair scripts specifically.
- Migration 261 cites Hiniker 2016 as experimental with one cohort of 55. It is
  observational across two samples (27 interviews plus 28 diary families).

## Waiting on Justin

The evidence says a named, predictable, non punitive **follow through action**
is one of only three techniques that reliably moved outcomes, and our scripts
mostly stop at words. Non negotiable one forbids a flat no, which is
compatible, but a pathway with no follow through is the thing the transition
literature found fails. Justin draws that line, not us.

## House rules

No dashes. Migration numbers: highest is 371 (PR 1246 open). 390 and 1280
before done. `git commit -F`, heredocs fail here.
