# The Guided Digital Pathway growth engine

**Date:** 2026-07-04
**Source:** the Glam Up thesis (0 to 1M users and $150K MRR in 6 months, no paid ads). Justin uploaded the full paper. This plan translates its playbook for Guided Childhood.
**Target it serves:** the £10k MRR maths from plans/mrr-10k-review.md. 800 paying families needs roughly 2,500 free signups a month at 4 percent conversion. This plan is how those 2,500 arrive.
**Branch:** claude/guided-digital-pathway-plan-62yc3p. Claims migration 029 (referrals).

---

## 1. What the Glam Up paper actually proves

Strip away the beauty vertical and the paper makes five claims, all backed by their data:

1. **Growth must live inside the product, not beside it.** Their referral gate (pay or invite 3 friends to unlock your scan) turned every user into a distributor. Referral codes fired 1.2 million times. It was their dominant acquisition channel.
2. **Content plus referral is a flywheel, not two channels.** Viral TikToks filled with users commenting referral codes, which the algorithm read as engagement, which pushed the video further. Awareness converted itself.
3. **The paywall moment matters more than the price.** They asked for money at the exact peak of emotional investment (after the user answered questions, uploaded a selfie, and watched the scan build). Raising prices from $2.99 to $8.99 INCREASED conversion from 3.5 to 5.5 percent.
4. **Influencer marketing failed. A trained creator system worked.** $10k single videos returned 200 users. Six college students at $400 a month, trained on a tested format playbook, generated 40 to 50 million views in their best month.
5. **Everything was a test.** They broke winning content into variables (hook text, contrast, emoji, captions, posting time) and optimised each one. Virality was engineered, then made repeatable.

## 2. What transfers and what never will

Guided Childhood sells trust to worried parents. Glam Up sold curiosity to Gen Z girls. Some of their machine transfers directly. Some of it would destroy us.

**Transfers:**

- The no login start. Our starter pack quiz already works this way. Keep it sacred.
- Personal investment before the ask. Their selfie upload is our three questions about YOUR child. A parent who has named their child's age and worries is emotionally in the room.
- The anticipation beat before results. Honest version: we genuinely calculate a stage. Give that calculation a visible moment.
- Results that are real but partially held back. Their blur was fake. Ours is genuinely deeper paid content behind a real preview. Same psychology, honest execution.
- Pay or share as the fork after value is shown.
- The exit offer as a second chance, using a real scarce thing we already have: the founder rate, capped at 50 in code.
- The trained creator system and the variable testing matrix.
- Weekly emotional rhythm of asking. For parents this is the school week, not impulse pricing.

**Never transfers (write these on the wall):**

- No fake scans, fake loading bars, or pretend analysis. Our stage assignment is real. It stays real.
- No fabricated reviews designed in Figma. App Store suicide and brand suicide. Real parent quotes only, with permission.
- No forced rating gate, no "I rated" button. Dark pattern, and Apple now rejects it.
- No hard referral wall on first value. A parent in a panic at 11pm gets their answer. The referral ask comes after we have helped, as a way to unlock MORE, never as a toll on help.
- No shame based before and after. Their engine ran on "very ugly before pictures." Our equivalent contrast is confusion before, calm plan after. The transformation is the parent's, not the child's face.

## 3. The Guided Childhood flywheel

The adapted loop, end to end:

1. **Content** (LinkedIn, Facebook parent groups, Instagram, TikTok) poses the question every parent argues about: what age for what device, is my child behind, what does the ban mean for my kid.
2. **Starter pack quiz** answers it in 3 questions, no login. Already built. Every CTA on /join routes here (non negotiable 9).
3. **Result becomes an artifact.** A shareable stage card: "My child is Stage 2, The Builder. 4 of 9 foundations in place." Visual, personal, arguable. This is our scan result. Parents share it into the same groups the content came from, with their referral link baked in.
4. **The fork.** The free result is complete and helpful. Beneath it sits the full stage report (genuinely deeper: the 90 day plan, the scripts for their stage, the device settings walkthrough) with two unlock paths: start the founder rate, or invite 3 parents who complete the quiz.
5. **Referred parents land on the quiz**, not the homepage. The loop closes.
6. **Email does the closing** over days 2 to 14 (the biggest gap named in mrr-10k-review.md, gap 2).
7. **Comment mechanics feed the algorithm.** Justin's PATHWAY comment mechanic on LinkedIn is already proven (73,911 impressions). The quiz link is the destination asset that post promised.

## 4. What we build in this repo, in order

Each phase is one PR sized piece. Nothing here duplicates an open PR (checked 4 July: PR 75 schools print pack, PR 25 pathway waterfall content, PRs 1, 2, 3, 5 are stale content drafts).

### Phase 1: Measure the funnel (build first, everything else is blind without it)
- Events table plus a tiny /api/events endpoint (or PostHog if Justin prefers a tool; env var either way).
- Track: quiz_start, quiz_complete, result_view, share_tap, referral_visit, signup, paywall_view, checkout_start, subscribe.
- One internal page /admin/funnel showing the conversion waterfall by week and by source.
- Glam Up knew their 90 percent reach rate and 5.8 percent conversion cold. We currently know nothing.

### Phase 2: The shareable result card
- Dynamic OG image per quiz result (Next.js ImageResponse): child's stage, stage name, foundations count, checker design tokens, chunky and screenshot proud. No child's name on the image, ever.
- A share button on the result page (native share sheet on mobile, copy link on desktop) that appends the parent's referral code.
- Public route /p/[code] that renders the shared card and drops straight into the quiz.

### Phase 3: The referral loop (migration 029)
- referral_codes and referrals tables: code per profile (and per anonymous quiz completion via localStorage token), referred_by on signup, status (visited, completed_quiz, signed_up).
- The fork UI on the result page: "See your full stage report" with two paths, founder rate or invite 3 parents.
- Unlock logic: 3 completed quizzes from your link opens the full stage report for 30 days plus one paid script. Real value, time boxed, upgrade path intact.
- Anti gaming basics: one credit per IP per day, referrals only count on quiz completion.

### Phase 4: Paywall v2, the emotional timing pass
- Move the ask to after the value beat: parent sees their real result, scrolls the genuine preview of the full report (real headings, locked bodies), THEN meets the price.
- Exit offer: on dismiss, one screen only, the founder rate with the live counter (founder-spots API already exists). True scarcity we already enforce in code. Never a fake discount.
- Annual default at £99 with monthly as the visible downgrade (mrr-10k-review gap 4).
- A/B the order of the two unlock paths (pay first vs invite first) once Phase 1 events exist.

### Phase 5: The content format testing system
- plans/format-test-log.md: the Glam Up variable matrix adapted (hook wording, stage named vs mystery, question vs statement, carousel vs single card, posting time, first comment content). One row per post, impressions and quiz starts per post.
- Weekly review beat: kill losers, double the winner. The winner becomes the template for the creator brief.
- Creator brief doc for 2 to 3 parent creators at a flat monthly rate (their $400 college student model, our version is UK parent creators), trained on the winning format only after we have one.

## 5. Step by step for Justin (the human loop)

Week 1 (while Phases 1 and 2 build):
1. Approve this plan, or mark up what to cut.
2. Post the PATHWAY mechanic post again with the quiz as the promised link. The destination asset now exists; the promise in decisions.md (3 July) is unblocked.
3. Pick the 3 Facebook parent groups and 1 subreddit where you already lurk. That is the seed pond. No new platforms yet.

Week 2 (Phases 3 and 4 live):
4. Post one result card yourself: your own child's stage card, honestly framed. The founder sharing first gives everyone else permission.
5. Start the format test log: 4 posts a week, one variable changed each time, numbers into the log every Friday.

Weeks 3 to 6:
6. When one format clearly wins (a post that outperforms your median by 5x or more), stop testing and repeat it with variations for two weeks. This is their "double down like crazy" moment.
7. Only then recruit 2 parent creators. Train them on the ONE winning format. Flat monthly fee, small bonus per 1,000 quiz starts attributed via their referral code (we can attribute this from Phase 3 tables).
8. Watch the funnel page every Monday. The one number that matters: quiz completions per week. Everything upstream feeds it, everything downstream converts it.

The kill rule, from their paper: no format gets a third week without a signal. Fail fast is the strategy, not a slogan.

## 6. Targets

| Metric | Now | 90 days |
|---|---|---|
| Quiz completions per week | unknown (Phase 1 fixes this) | 600 |
| Share taps per 100 results | 0 (no button) | 15 |
| Referral visits that complete the quiz | 0 | 40 percent |
| Free signups per month | small | 2,500 (the mrr-10k number) |
| Paywall view to subscribe | unknown | 4 percent, stretch 5.8 (Glam Up's October rate) |

## 7. Sequencing against the multi session rules

- This plan claims: funnel events, share cards, referral loop, paywall v2, format test log. Named in the draft PR title.
- Migration 029 claimed here. PR 75 uses 027 which collides with main's 027_concerns.sql and will renumber to 029 or higher on merge; whoever merges second renumbers, per the 3 July precedent.
- Lane: platform growth mechanics. Does not touch schools, curriculum, or the waterfall content set.
