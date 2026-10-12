# AI and SaaS advice, weighed (11 October 2026)

Justin pasted a long piece of advice, written by another AI, arguing that AI
will not kill SaaS but will kill many of the reasons people pay for it, and
setting out what that means for Guided Childhood, The Social Billboard and
DiGi. He asked: is this good advice? Run through `.claude/skills/feedback-filter`.

**What the reviewer could see.** Only what it was told in conversation. No
code, no THE-STORY.md, no live product. So where it says "build X", the first
question is whether X already exists.

**Short answer.** Sound in direction, and most of it describes what is already
built. Two facts are wrong or premature (the price, and the Social Billboard
framework claim), and one recommendation (fold the Social Billboard into one
service) is a decision for Justin, not something to adopt from advice.

## Verdict table

| # | Point | Their words | Verdict | Objective | Size |
|---|---|---|---|---|---|
| 1 | The thesis | "AI won't kill SaaS. It will kill a lot of the reasons customers currently pay for SaaS." | Adopt as framing | Already our position: THE-STORY s6 describes DiGi as "Claude wrapped in four things a raw model does not have" | none |
| 2 | Gartner figure | "$234 billion ... Approximately 20% of enterprise SaaS spending" | Verified, low relevance | Gartner press release, 1 July 2026: exposure, not loss, and it is about enterprise per seat software, not a £12.99 family subscription. Background only, not for any page | none |
| 3 | Bain figure | "a potential $100 billion US market opportunity" | Not verified | Evidence or silence: not opened, so it is not quoted anywhere | none |
| 4 | Guided Childhood is the strongest business | "Parents and schools aren't fundamentally buying software. They're buying help" | Already built | THE-STORY s1 and s10: "We are not parental controls". The stage pathway, provenance (migration 108, every objective sourced), curriculum mapping and school relationships are the moat it describes | none |
| 5 | Social Billboard sells assurance, not playlist generation | "Every video has been checked against a published child-safety framework" | Adapt | The need is right: the checking is the product. But `plans/sb-parent-launch-control.md` gate G3 bars describing the framework until one wording is confirmed and the transparency page has a live route. "Ongoing monitoring" is not built and is not said. So: finish G3, then say it | medium (G3) |
| 6 | DiGi as the interface to the service, not a chatbot | "It could know: the child's current stage ... lessons completed ... agreed boundaries ... the research ... what comes next" | Already built | `lib/digi/brain.ts` (family memory, research corpus, `getStageProgress`), `lib/digi/family-state.ts`, `lib/digi/horizons.ts`. If anything is missing it is saying so on the marketing pages, which is a visibility point | small, copy only if wanted |
| 7 | Prices | "your existing £7.99 founding price and £9.99 standard parent price" | Fact wrong | Standard is £12.99 a month, annual £99, founder £7.99 capped at 50 (THE-STORY s9). The underlying point (prove recurring value ChatGPT cannot give) stands | none |
| 8 | Charge for a continuing result | "charge for a continuing result" | Adapt | We never sell an outcome for a child (philosophy 5, and the explainer skill's rule). The continuing value we can prove is the check in number moving, the passport and the weekly review: already the retention spine (THE-STORY s9 point 4) | none |
| 9 | Own the methodology | "Make the age-staged pathway, evidence framework and safety standards the heart" | Already built | Stages, trust framework (`digi/07-trust-framework.md`), migration 108 | none |
| 10 | Use AI aggressively internally | "Reduce development, content production, administration and support costs" | Already built | This repo is that: the skills, the routines, the guards | none |
| 11 | Build accumulated value | "A family's pathway should become more useful as their child progresses" | Already built | Passport, DiGi memory, check in history, star quest | none |
| 12 | Develop distribution | "School partnerships, newsletters, parent communities" | Already the plan | THE-STORY s9 channel order; founding schools rate (8 October) | none |
| 13 | Sell the outcome, not the technology | "Parents want help raising digitally capable children" | Adapt | Sell the plan and the words, never a promised outcome. The hook stays the stage check | none |
| 14 | One service, several doors | "The Parent Pathway, School Pathway, Social Billboard and DiGi become connected parts of that service" | Declined for now (Justin, 11 October) | Parent, schools and DiGi already are one service. Folding the Social Billboard in conflicts with "one business per post" and its own brand and price (£5.95). The cross referral plan (`plans/2026-10-03-cross-referral-plan.md`) is the current link between them | large if done |

## The one new thing worth taking

For the Social Billboard, the checking is the moat, not the playlist builder.
That makes gate G3 (one confirmed framework wording and a live transparency
page) the most valuable piece of Social Billboard work, ahead of more posts.

## Decided

Justin, 11 October 2026: "keep the Social Billboard separate for now and seems
we are heading in right direction as this is hard to copy". The Social
Billboard stays its own business, linked by the cross referral plan. The
direction stands: the moat is the method, the evidence, the family's history
and the school relationships, not the code.
