---
name: feedback-filter
description: Weigh outside advice against our own objectives before acting on any of it. Use whenever Justin pastes or forwards feedback, a review, an audit or a suggestion from anyone outside the build, such as a DSL, a clinician, a parent, a school, a consultant, another AI's website review, an investor, or a comment asking for a change. Splits the advice into single points, tests each against THE-STORY.md and review.md, and returns a verdict per point (adopt, adapt, already built, park, decline) with the reason, before anything is built. Never builds from advice alone.
---

# Feedback filter: our objectives first, then the advice

Justin, 24 September 2026: "make sure that we don't just act on the advice
given, we assess it against our own objectives and make sure it is right for
our philosophy and goal."

Three reviews arrived in two days: Jane (a DSL), Pam (a clinician) and Alice
(through an AI built to review early years websites). All three were useful,
and two of them pulled in opposite directions: Pam said the site speaks only in
problems, Alice said open on the problems. Advice is an input. It is never an
instruction, whoever gives it and however confidently it is written.

## The steps

1. **Split it.** One line per claim or recommendation, with the reviewer's own
   words quoted, so nothing is paraphrased into something they did not say.

2. **Note what they could see.** A reviewer judges what they were shown. Jane
   had no code, so she could not see the Hub. Pam looked only at the parent
   track. Alice's AI read the home page. A point about something they could
   not see is a point about visibility, not about the product.

3. **Test each point against our own objectives, in this order.**
   1. **The goal.** THE-STORY.md section 9: parents to the stage check, about
      4 percent free to paid, £4,000 MRR, schools as distribution. Does the
      point bring more parents to the stage check or keep more families? If it
      does neither, it is decoration.
   2. **The philosophy.** review.md section 1, the five commitments. A point
      that breaks one is declined, however good it sounds. Advice to add a
      "block this app" switch breaks commitment 2, for example.
   3. **The customer.** review.md section 2. Would the perfect customer get it
      in five seconds, in their own words
      (`research/homepage-audience-language.md`), not ours or the reviewer's?
   4. **Evidence or silence.** Any number, study or claim the advice wants on
      a page needs a source we have opened ourselves. If we cannot verify it,
      it does not ship, whoever suggested it.
   5. **The non-negotiables** in CLAUDE.md: no dashes, our tokens and fonts,
      the founder cap, every CTA to /starter-pack, scripts in the database.
   6. **Already built?** Search the code before agreeing that something is
      missing. If it exists, the finding is that it is hidden, and the fix is
      visibility, not a second build.
   7. **Conflicts.** Does it contradict another reviewer, our research, the
      briefings, or a past decision (`grep -n` the decisions archives)? Name
      the conflict and say which side the evidence favours.
   8. **Cost against the goal.** Size it (small, medium, large). A large change
      for a small gain waits.

4. **Give a verdict per point.**
   - **Adopt**: passes every test. Say which objective it serves.
   - **Adapt**: the need is real but the suggestion is not ours. Say what we do
     instead, and why.
   - **Already built**: point to it. The fix is making it visible.
   - **Park**: right idea, wrong time. Say what it waits for.
   - **Decline**: breaks a commitment or works against the goal. One plain line
     saying why.

5. **Bring Justin only the decisions that are his**, as quick questions with a
   recommendation, each naming the objective it serves. Never build from the
   advice alone, and never because of who gave it.

6. **Record it.** A verdict table in `plans/`, and one decisions.md entry per
   review: what was adopted, adapted, parked and declined.

7. **Reply honestly.** The reply to the reviewer names what changed because of
   them and never promises a change that has not passed this filter.

## Output

A table per review: point, their words, verdict, the objective it serves or
breaks, size. Then the questions for Justin. The first worked example is
`plans/2026-09-24-outside-reviews-weighed.md`.
