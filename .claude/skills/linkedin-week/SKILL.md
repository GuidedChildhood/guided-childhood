---
name: linkedin-week
description: The Monday LinkedIn pass. Reads what is actually working on Justin's own account, reviews the popular posts other people are getting traction with in our topics, and writes the week's three to five LinkedIn posts against the formula. Use when the Monday LinkedIn routine fires, or whenever Justin says "do the LinkedIn week", "what should I post this week", "what is working", "write this week's posts", "review my stats", or pastes LinkedIn analytics screenshots. Never posts and never schedules; Justin does that.
---

# The Monday LinkedIn pass

One job: turn evidence about what works into the week's posts, so the account
compounds instead of restarting every Monday.

This is **not** `research-radar`, which finds new research and is allowed to find
nothing. This is **not** `social-week`, which makes Instagram and Facebook cards.
This is LinkedIn copy for Justin's personal account, built on `viral-post` for
the formula and `content-engine` for the voice. Where they disagree with the
account data, the account data wins.

## The evidence base, read it first and in this order

1. `content/analytics/linkedin-365-days-2026-10-20.md`, the full year. The
   opening rule, the reach against conversation split, the funnel finding.
2. `.claude/skills/content-engine/linkedin-engagement.md`, for the live lane and
   the algorithm notes. Its 28 day table is superseded; the top of the file
   says so.
3. `.claude/skills/viral-post/SKILL.md`, the formula and the stat card.
4. `content/gdc-post-register.md`, so a number is never claimed twice.

## Step 1. Our own numbers

If Justin has pasted fresh analytics, transcribe them into a new dated file in
`content/analytics/` and say plainly which of the standing rules it confirms,
refines or kills. **A rule built on fewer than ten posts is a hypothesis, not a
rule**, and it is labelled as one. We wrote a rule off four posts once and it
cost us two wrong recommendations in a day.

If nothing fresh has been pasted, do not guess at current numbers. Work from the
newest file in `content/analytics/` and say which one.

## Step 2. What other people are getting traction with

Claude cannot read the LinkedIn feed; it is behind a login. So this step works
from two real sources and never invents a post or a metric.

- **What Justin pastes.** A screenshot or a link to someone else's post is the
  best input this step gets. Ask for them once, at the end, not before starting.
- **The open web.** The research, the policy move, the news story or the report
  that the people in our lane are reacting to this week. `WebSearch` in standard
  mode, several queries in one turn.

For each candidate, log a row in the Post Intelligence sheet in Drive
(the "LinkedIn, Content Intelligence and Performance" spreadsheet) with: what it
was about, the hook shape, the evidence it used, why it travelled, and **our
angle on it**, which is the only column that matters. A post we cannot answer
in our own voice, with a proof path in the product, is not our post. Drop it.

## Step 3. Pick the week

Three to five posts. That is the floor from the 90 day read, not a target, and
two quiet weeks give back most of the compounding.

Each post is assigned a **job before it is written**:

| Job | Opening shape | What success looks like |
|---|---|---|
| Recruit strangers | A precise number inside a complete sentence that contradicts what the reader expects | Impressions. The year's best did 75,842 |
| Start an argument | Name the live debate, or ask the question only a parent can answer | Comments. The year's best ER was 4.87 percent on 3,288 impressions |
| Build authority | A named researcher or institution in the first three lines | Peers and departments in the comments |

Never write a post whose job you cannot name. Mixing all three is how a post
does nothing.

## Step 4. Write them

Through `viral-post` and `content-engine`. Then the hard checks:

- Hook inside 140 characters and a complete sentence.
- Body 1,300 to 2,500 characters, up to 3,000 when every line earns it.
- The honest pivot line, conceding the strongest opposing point.
- One closing question, nothing after it.
- **Zero links in the body.** Thirteen clicks in a year came from in post links.
  The link goes in the first comment. The profile button is the funnel: 165
  clicks against those 13.
- No comment for a keyword mechanic.
- No dashes. Check with a locale aware regex over the unicode dash range, not
  with grep in a C locale.
- Every figure traced to a primary source. A `citation-verifier` pass on any
  post carrying more than two numbers, before it goes in Drive.
- One founder scene at most, and never in line one. Scene led openings sit in
  the bottom third of the year. Log it in `founder-scenes-used.md`.

## Step 5. Hand over

- Claim the numbers in `content/gdc-post-register.md` and name the version.
- One Drive document per post, title prefixed with the number, carrying the
  body, the first comment, and what was checked.
- A running order with a reason per slot, driven by each post's own clock.
- Open the pull request. Then tell Justin: what changed, whether it worked and
  the one reason, and what is needed from him.

**Claude never posts, schedules or sends anything. Justin posts.**

## The standing questions this pass should keep answering

- Is the opening rule still holding on the newest numbers?
- Has a new lane opened? Children and AI did 6,036 in its first month.
- Did last week's posts actually go out? A planned date is not a posted date,
  and only Justin can move a register row to POSTED.
