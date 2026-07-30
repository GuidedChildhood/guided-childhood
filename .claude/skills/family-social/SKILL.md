---
name: family-social
description: Drafts the week for the family Instagram and Facebook account (The Guided Digital Childhood, formerly Inspired by Alma) in the family voice, researched from what has actually been built in this repo. Use whenever Justin asks for Instagram posts, Facebook posts, the family social week, Founder Monday, Research Wednesday, Service Friday, Happy News Saturday, a carousel for the family account, or says "draft this week's social", "what are we posting", "do the family week". Not for LinkedIn or Substack, which belong to content-engine.
---

# Family Social: the week on Instagram and Facebook

You draft four posts a week for **the family account**, in the family's voice,
about things that have actually been built. You never publish. You hand back a
review queue.

**This is not the LinkedIn engine.** LinkedIn and Substack belong to
`content-engine`, where the author is Justin, the register is evidence led, and
the calendar already exists at `content/packs/2026-07-08-posting-calendar/`. If
the request is for LinkedIn, Substack, Mumsnet or Reddit, stop and use
`content-engine` instead.

---

## Phase 0 · Read the canon, every time, no exceptions

Read these before drafting a single line. They are the whole reason this skill
exists rather than a generic content prompt.

1. **`content/brand-story/founding-story.md`**, the facts. If a fact about the
   family is not in that file, it does not go in a caption. Do not infer, do not
   embellish, do not invent a charming detail.
2. **`content/brand-story/weekly-rhythm.md`**, what each day is for and the
   standing rules.
3. **`content/brand-story/service-post-map.md`**, the Friday rotation, with the
   proof path for every service.
4. **`content/brand-story/handover-sequence.md`**, the register to match.
5. **`.claude/skills/content-engine/hidden-thread.md`**, the mission filter and
   the 1 in 10 rule. Internal. Never a public statement.
6. **`briefings/notes/positive-canon.md`**, the evidence spine for Wednesday.

Then check `content/brand-story/posted-log.md` for what has already gone out, so
Monday takes the next chapter and Friday takes the next service rather than
repeating one.

---

## Phase 1 · Research what is actually built

**This is the phase that makes the skill worth having.** Marketing that
describes a feature which does not exist is worse than no marketing, because a
parent goes looking for it and finds a coming soon card.

Before drafting Friday:

1. **Confirm the route exists.** The service map gives a path. Check it. A page
   under `app/` that renders, not a plan file.
2. **Confirm the data layer exists.** The migration or table named in the map is
   really in `supabase/migrations/`.
3. **Check it is not stubbed.** Grep the page for "coming soon". Check the
   component named is actually imported somewhere, not orphaned. School email
   forwarding is the standing example: the backend is complete and the parent
   facing card still says coming soon, so it is not postable.
4. **Check the plan files for the do not post list.** Anything in
   `plans/week-of-2026-07-30-app-protocol-and-nudges-plan.md` is planned, not
   built. That file opens with "Nothing in this file is built yet."

**Every Friday draft carries its proof path at the bottom**, so Justin can check
a claim in ten seconds. A draft without a proof path is not finished.

When something new has shipped since the last run, say so, and propose it as a
new entry in the service map rather than silently working it into a post.

---

## Phase 2 · Draft the four

### Monday · Founder Monday
Next unposted chapter from the twelve chapter table. Open on the moment, not the
lesson. Three to five short paragraphs. One line that costs something. No moral,
no CTA. Close on a question a stranger can answer from their own life. Name the
real photo it needs.

### Wednesday · Research Wednesday
One finding. The claim they have already heard, what the research actually
found, **the honest pivot**, the tonight line, a question. Every claim traced to
a named source or cut.

Apply the 1 in 10 rule explicitly and **say in the review queue which one this
is**: a brick, or the one in ten that states the thesis plainly. Count back
through `posted-log.md` to decide. If nine bricks have run, this one lands the
thesis.

### Friday · Service Friday
Next service in the rotation. Problem in the parent's words, what we made, **the
hinge**, the soft ask. Carousel card breakdown or screen recording shot list.
Proof path at the bottom.

### Saturday · Happy News Saturday
Carousel, five to seven cards. Real things children made or learned. The genuine
positives, honestly. Roughly one Saturday in three is a printable or a chart,
the craft strand.

**Every draft ships in two variants.** Instagram, shorter and warmer, no links.
Facebook, longer, and a real link in the body where there is an ask.

---

## Phase 3 · Attack the drafts before Justin has to

Run every draft against these and fix what fails. Report anything you could not
fix.

**The voice check.** Would `Natalia` say this out loud to another parent at
the school gate. Kill: unlock, dive in, game changer, landscape, delve,
revolutionary, genuinely, straightforward, the truth is, here is the thing.

**The dash check.** No dashes. Not in captions, carousel cards, Stories or
Highlights titles. Ages as "4 to 16", never "4-16". Restructure the sentence,
never swap in a different dash. **Search the drafts for the characters and
confirm zero.**

**The claim check.** Every fact about the family traces to the founding story.
Every fact about the product traces to a route or migration. Every research
claim traces to a named source. Never claim developmental outcomes for children.
Claim calmer homes and a calibrated pathway.

**The hidden thread check.** Does this move attention toward the real drivers,
poverty, adverse childhood experiences, parental mental health and CAMHS
capacity, or does it accidentally make the platform the main character.

**The pathway check.** Never allow or deny. Never relitigate the ban in either
direction. The legislation is settled background fact only.

**The clinician check.** No living clinician's name attached to our advice.
Settled 29 July 2026. Published academic citations are fine.

**The character check.** Alma, Olga and Teo are our real children in the founding
story only. They are **not** characters in the app. The app has DiGi, the golden
star, and five Planet Friends: Pebble, Bloop, Orbit, Nova, Cosmo.

**The consent check.** No child's face without consent. No reply reshared
without asking. No before and after that shames a parent or a child.

---

## Phase 4 · Deliver a review queue

Write to `content/brand-story/weeks/<yyyy-mm-dd>/`:

- `monday.md`, `wednesday.md`, `friday.md`, `saturday.md`. Each with the
  Instagram version, the Facebook version, the image or card brief, and for
  Friday the proof path.
- `stories.md`, the four Stories for the week.
- `review.md`, what to check before publishing. Which chapter and which service
  were used. Whether Wednesday was a brick or the one in ten. Anything the
  claim check could not verify. Anything that has shipped since the last run and
  should join the rotation.

Then **append to `content/brand-story/posted-log.md`** so the next run does not
repeat a chapter or a service.

In chat, give Justin the single strongest line of the week and anything that
failed a check.

**Never publish. Never post. Never schedule.** This skill drafts.

---

## What is automated and what is not

**Automated.** Choosing the chapter and the service. Verifying the product
claims against the codebase. Applying the voice, dash, claim, thesis and consent
checks. Both channel variants. The card breakdowns and shot lists. The log.

**Not automated, on purpose.**

- **The photo.** Ten years of archive is the biggest asset in the plan and only a
  human can pick the right picture. Drafts name what the photo should be.
- **Publishing.** Nothing here posts to a platform.
- **The replies.** Post 3 in the handover sequence will get parents admitting
  their own guilt. Answering those personally is the actual work and it does not
  get delegated to a model.
- **The one in ten.** The skill proposes it. Justin approves it.
