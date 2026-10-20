---
name: research-radar
description: The Monday sweep. Finds the week's new research across every Guided Childhood platform, kills what will not survive a hostile reader, maps what survives onto a real product surface that proves it, and turns the survivors into a waterfall of content. Use when the Monday research routine fires, or whenever Justin says "run the radar", "what is new this week", "find me research", "what can we post about", or asks what new evidence exists for any part of the product. Chains into kids-research for depth and content-engine for the pack. Never produces content for a finding with no proof path in the product.
---

# Research Radar, the Monday sweep

`weekly-research` takes one topic Justin names and goes deep. This goes wide
first: it finds what is new, decides what is worth his name, and only then
goes deep on the one or two that earn it.

**The gate that makes this worth running: it is allowed to find nothing.** A
week with no new research worth posting is a normal week. Saying so in one line
is the correct output, and it is what stops this becoming a machine that
manufactures a reason to post every Monday. CLAUDE.md is explicit that a pass
which proposes a hundred edits to things that are already fine is churn rather
than quality. The same applies here.

## Phase 1, the sweep

Search the last 14 days across the six domains that feed a real product
surface. Not "children and technology" in general, which returns the same
recycled commentary every week.

| Domain | The surface it feeds |
|---|---|
| Children, screens, mental health, sleep, attention | The parent app stages, the check in, the lessons |
| Children and AI, companions, chatbots, AI toys | DiGi, Stage 3 and 4 content, the AI module |
| RSHE, computing programme of study, Ofsted, DfE guidance | The schools app, the curriculum map, the sign off |
| Online Safety Act, the under 16 ban, Ofcom enforcement | docs/11 and the `social_media_law` flag, Stage 4 |
| Reading, homework, academic attainment | The lessons, the school pitch |
| What parents actually search and buy | The printables, the marketing pages |

Prefer, in this order: a named journal with a DOI, a government or regulator
publication, a named research group's own release. A newspaper write up is a
pointer to a paper, never the source.

**Record what you could not reach.** The proxy in this container blocks most
publishers, Crossref, OpenAlex, Semantic Scholar, PubMed and doi.org. If a
paper matters and cannot be opened, say so by name and ask Justin to put the
PDF in Drive, which works and is how the 30 September pack was built. Never
write a pack from an abstract and call it read.

## Phase 2, the kill

Most of what the sweep returns should die here. Run each candidate against
three tests and write down which ones it failed.

**The Odgers test.** Would a hostile, hype allergic researcher wince at any
sentence we would write from this? Correlation stated as cause, a population
average sold as a personal risk, a tiny effect dressed as a crisis. If yes,
either the claim narrows until it survives or the finding is parked.

**The proportionality test.** `hidden-thread.md` is the filter. Does this move
attention toward the real drivers, or does it accidentally make the platform
the main character again? A finding that only works by making a phone the
villain fails, however good the numbers.

**The repetition test.** Check `content/packs/` for the last eight weeks. If we
have already made this argument, it does not get made again with a new number
on it. Reach is not the problem; saying the same thing is.

Anything that survives all three goes to `citation-verifier` before a single
line of copy exists. Nothing unverified reaches Phase 4.

## Phase 3, the proof path, which is the part that was missing

This is the step `weekly-research` never had, and the reason a finding can be
true, interesting, and still useless to us.

Run the `platform-mapper` agent on every surviving finding. It must come back
with a **real surface**: a file path, a screen, a lesson id, a table. Not a
theme.

Then write the finding up in this shape:

> **The finding.** One sentence, with the number and its interval.
> **What it means for a parent.** One sentence, in their words, no jargon.
> **What we already built that answers it.** The actual thing, by path.
> **What it would take to answer it better.** Small, medium or large, or nothing.

**A finding with no proof path does not become content.** It goes in the parked
list with a line saying why. This is the whole discipline: we are not a
commentary account, we are a product with an argument, and every post should be
standing on something a parent can go and use.

If the mapper says we already have it and it is not visible, that is a product
finding, not a content finding. Say so to Justin separately.

## Phase 4, the waterfall

Only now, and only for the one or two findings that earned it. Hand to
`content-engine`, which owns the voice, and build the pack at
`content/packs/<date>-<slug>/`:

- `00-plan.md`, the spine, the posting order, and an explicit list of what the
  pack must never say
- `linkedin.md`, with a prepared first comment per post
- `facebook.md`, warm, no effect sizes in the body
- `instagram.md`, carousel and single image
- `substack.md`
- `mumsnet-reddit.md`, research only, no founder and no product, because a
  pitch in those rooms is detected and punished

### Two things the 6 October analytics changed

Both come from Justin's own 28 day numbers, and both beat the general advice in
`viral-post`, which was written from folklore rather than from his account.

**Open on the question you cannot answer, not the number you found.** His two
posts that opened on an admitted uncertainty did 6,008 and 3,155 impressions and
carried 67 percent of every comment he got that month. The posts that opened on
a figure did 1,002 and 698 and got **zero comments**. The number belongs in the
third paragraph where it rewards the reader, not the first where it closes the
thought.

**Children and AI is the live lane.** Both of those top posts were about it.

Every post still ends on a real question, last, next to the comment box. Nothing
goes after it.

## Phase 5, deliver

1. Run `npm run ai-tells` and fix anything it finds.
2. Check every figure back against the source text, not against your notes.
3. Push a branch, open a **draft** pull request, name the findings in the title.
4. Run `.claude/skills/content-engine/drive-post-review.md` over every post in
   the pack, then put the pack in the Control Room in Drive. Anything that goes
   into Drive has been reviewed before it gets there, not after.
5. Three lines for Justin: what is new, what it proves about the product, what
   he needs to decide.

## The ledger

Append one row per run to `content/research-radar-log.md`: the date, what was
swept, what was killed and why, what shipped. This is what makes the repetition
test in Phase 2 possible, and it is how a later session can see that a topic was
looked at and rejected rather than missed.

## Hard rules

- No dashes anywhere. `npm run ai-tells` enforces the half a machine can judge.
- Never an outcome claimed for a child. Clarity, calmer conversations, a pathway.
- Never "safe online" and never "ready for social media".
- A finding Justin's own position would find inconvenient gets stated **before**
  the findings that help. That is what makes the rest believable, and it is the
  move his best posts already rest on.
- Never post, schedule or send anything. Justin does that.
