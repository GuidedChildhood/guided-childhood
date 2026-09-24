# The three outside reviews, weighed against our own objectives

Written 24 September 2026, after Justin asked that no advice be acted on
until it has been checked against our philosophy and goal. Each point below
has been through `.claude/skills/feedback-filter`. The first two reviews were
already acted on, so this is also a check on what we built. Every change made
passes. One of Alice's points is declined and three are parked.

Objectives referred to: the **goal** (THE-STORY.md section 9: parents to the
stage check), the **five commitments** (review.md section 1, numbered as there),
the **customer test** (review.md section 2), and **evidence or silence**.

## Jane, a DSL, 23 September

**What she could see:** the open pages only. She had no code, so no Hub.

| Point | Her words | Verdict | Objective | Size |
|---|---|---|---|---|
| The DSL page was missing | "I can't see the DSL Hub element of it" | **Adopt.** `/hub/dsl` opened; it is a document for exactly her | Goal: schools are distribution, and the DSL is the person who says yes | Small |
| Save a teaching DSL time | "resources that save them time and easy to access" | **Already built.** Scripts on every slide, staff briefings, print pack | | |
| Adapt | "easy to access and adapt" | **Adapt.** School details (lead, deputy, how a concern is recorded, policy title) printed onto the filed pages, kept in the browser. Not editable lessons, because a teacher could then edit a sourced claim | Commitment 5; no teacher accounts or staff data on our server | Medium |
| Rooted in DfE guidance | "rooted in DfE statutory guidance" | **Already built.** The RSHE page maps all 57 requirements | | |

## Pam, a clinician, 23 September

**What she could see:** the parent track only.

| Point | Her words | Verdict | Objective | Size |
|---|---|---|---|---|
| Tone leads with problems | "the overall tone still emphasizes problems" | **Adapt.** The worries stay, because they are the words parents search in (the audience research). Each one now sits beside the hope | Commitment 3, the positive pathway; customer test | Small |
| A two part teen question | "we never ask a double-barreled question" | **Adopt** | Commitment 2, curiosity before consequence | Small |
| "Just a habit" shames | "shaming and belittles any use the kid feels is positive" | **Adopt** | Commitment 2, repair over punishment | Small |
| Children copy their parents' phone use | "kids learn by observing how their parents use media" | **Adopt, as an action, never as a statistic** | Commitment 2 says "modelling over monitoring" in so many words; commitment 5, so no number was added | Small |
| "I worry..." statements and swapping seats | her suggested lines | **Adopt** | Commitment 2 | Small |

## Alice, an AI website review, 24 September (part one; more notes coming)

**What she could see:** the home page.

| Point | Her words | Verdict | Objective | Size |
|---|---|---|---|---|
| The category is the pathway | "The digital childhood pathway" | **Adopt, with a condition.** THE-STORY.md section 11 says "pathway" has meant two things and caused a wrong build. If it becomes the organising word, it means the stages road only | Simplification agenda | |
| Parents are buying confidence | "They're buying confidence" | **Agree; already ours.** THE-STORY.md section 2, "policing without a plan" | | |
| The hero should carry the benefit | "the supporting copy should carry more of the emotional benefit" | **Adapt.** Our one line story, not her wording. Hers had dashes, and "digital independence" is our jargon rather than the parent's words | Customer test; non-negotiables | Small |
| Button: find my child's starting point | "Find my child's starting point" | **Already built, so relabelled.** The stage check exists; the buttons now use our hook, "Find my child's stage" | Goal: stage checks are "the whole game" | Small |
| The stage check as the main way in | "FIND MY CHILD'S STAGE could become the main acquisition mechanism" | **Already built.** `/starter-pack`, three questions, the answer before any sign up | Goal | |
| Ask which devices they use | "What devices do they currently use?" | **Decline.** The promise is three questions, and a fourth costs completions of the one thing the goal depends on. Devices are asked in setup, after the answer | Goal | |
| The home page is too long | "The homepage is currently too long" | **Park** until her full notes, so the page is rebuilt once. THE-STORY.md section 11 agrees: a page does one job | Simplification agenda | Large |
| Open on problem recognition | "Parenting the digital part wasn't supposed to be this complicated" | **Adapt.** This conflicts with Pam. Recognition goes in, but always paired with the hope | Commitment 3; conflict named | Medium |
| Know, Do, Grow | "KNOW / DO / GROW" | **Park** for the restructure. "Grow" must be the star quest and the passport, because THE-STORY.md section 10 says the star quest leads every list and her lists never mention it | THE-STORY.md section 10 | Medium |
| A visual journey from first screen to independence | "Show the journey visually" | **Park.** The stages road exists; check it against her full notes | | |

## What this changed

Nothing already shipped needed undoing. The checks caught four things that
taking the advice at face value would have got wrong:

- editable lessons for Jane
- a fourth question in the stage check
- a wall of problems that Pam had just warned against
- a three part model with the star quest missing
