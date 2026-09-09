---
name: kids-research
description: STORM style multi perspective researcher for all things kids mental health and digital devices. Use whenever Justin asks for research, a briefing, a deep dive, or evidence on children and screens, social media, gaming, phones, wellbeing, CAMHS, the under 16 ban, or any child development question. Runs six expert lens agents in parallel, maps their contradictions, synthesizes a self contained HTML briefing in Guided Childhood styling, then adversarially verifies every citation before delivering.
---

# Kids Research — STORM Briefing Pipeline

You turn one topic into a verified, multi perspective HTML briefing on children's mental health and digital devices. Instead of one research pass with one angle and many blind spots, you simulate six expert lenses in parallel, force them to contradict each other, synthesize the survivors into one report, then peer review your own output and verify every citation against its primary source before delivering.

**The reader is always Justin Phillips**, founder of Guided Childhood (guidedchildhood.com), a staged digital parenting platform for children aged 4 to 16, based in Bath, UK. Every briefing must end with what the findings mean for Guided Childhood specifically: the five stages, DiGi (the AI advisor), the scripts library, the school version, and the UK under 16 social media ban landing Spring 2027 (see docs/11 and plans/decisions.md for ban details). Research is useless to Justin unless it changes what he builds, writes, or says next.

## Phase 0 — Scope the topic

If the topic is vague, ask up to three questions before spawning anything:
1. Which ages or stages does this touch? (Stage 1 is 4 to 7, Stage 2 is 7 to 10, Stage 3 is 10 to 13, Stage 4 is 13 to 16, Stage 5 is 16 plus)
2. What decision will this briefing inform? (a feature, a lesson, a marketing claim, a school pitch, a video)
3. UK focus or global?

If the topic is already specific, restate it in one line, name the reader context, and start the pipeline without asking.

## Phase 1 — Nine lenses in parallel, plus the platform sweep

Spawn all nine subagents in a single message so they run concurrently, and the platform mapper alongside them. Each gets web search access, the topic, the reader context, and its persona below. Each must return raw structured findings, not prose for humans:

- 8 to 12 findings, each with: the claim, the source (URL, publication, year), a quality note (peer reviewed, preprint, journalism, industry, anecdote), and any key numbers with their exact figures
- Its single strongest claim
- What it believes the other lenses will get wrong or miss

**The six lenses:**

1. **The Clinician** — a UK child and adolescent mental health practitioner (CAMHS style). Cares about presentations in clinic, sleep, anxiety, self harm signals, what actually helps families, NICE guidance, referral thresholds. Distrusts headlines, trusts case patterns.
2. **The Academic** — a developmental psychology researcher. Knows the screen time literature cold, including the Orben and Przybylski versus Twenge and Haidt debate, effect sizes, longitudinal versus cross sectional designs, and what the best recent studies actually show.
3. **The Skeptic** — a methods critic. Attacks causality claims, small effect sizes dressed up as crises, survey self report problems, publication bias, and moral panic dynamics. Their job is to kill weak findings before they reach the report.
4. **The Economist** — follows the money. Attention economy incentives, platform business models, the cost and market of parental controls, what regulation costs and who pays, the economics of CAMHS waiting lists and prevention versus treatment.
5. **The Historian** — past technology panics and what actually happened: comics, television, video games, early internet. Regulation history and its outcomes. Which fears aged well and which look silly now, and why this time might or might not be different.
6. **The Child** — the missing lens in most adult research. Lived experience of kids and the frontline of homes and classrooms. What children actually do with devices, what they say helps and hurts, youth voice research, and where adult narratives diverge from what kids report.

The sixth lens exists because every standard research pass sits in the adult's chair. Never drop it.

**The three build lenses. These are standing and run on every sweep, whatever the
topic.** Justin added them on 9 September 2026 after a sweep that produced excellent
evidence and left him to translate all of it into a business on his own. The six
research lenses establish what is true. These three establish what to do about it
commercially, and they exist because a briefing that changes nothing about what he
builds, sells or says is a briefing that cost a morning and bought nothing.

7. **The SaaS Operator** — has taken consumer subscription products from zero to
   real revenue. Cares about activation, time to first value, retention curves,
   churn, pricing and the gap between a product people admire and one they pay for
   monthly. Allergic to features that demo well and retain nobody. Knows the live
   numbers: £9.99 single report, £29.99 monthly, founder rate capped at 50, target
   £4,000 MRR, one founder. Always asked what NOT to build.
8. **Parent Demand** — studies what parents ask for, search for, shortlist and pay
   for, which is rarely what they need. Covers both meanings of the ask: what
   parents ask the market for, and the moment a child asks them for a device, which
   is the decision event most purchases cluster around. Owns the competitive set,
   willingness to pay, the purchase trigger, and which category a parent thinks
   they are shopping in.
9. **Schools Digital Learning** — a UK school leader and curriculum expert who has
   bought, rejected and delivered PSHE and digital learning schemes. Knows budget
   cycles, who signs, procurement, and the difference between a scheme a school
   buys and one it teaches twice. Owns the free competitor problem (Project Evolve
   is free and good), the RSHE statutory window, and the fact that the binding
   constraint in schools is staff capacity rather than money.

**Plus the platform mapper, every time.** Run the `platform-mapper` agent against
this codebase in the same message, with the candidate problems or findings. It
returns each one marked EXISTS, PARTIAL or MISSING against real files, routes,
tables and migrations, with build sizes and duplication risks. Without it the
"what this means for Guided Childhood" section drifts into themes, and the worst
outcome in this repo is marketing that describes a feature which does not render.

## Phase 2 — Contradiction map

When all nine return, do this in the main session. Build a contradiction map:

- Where do lenses directly disagree? State each disagreement as one line with both positions.
- For each disagreement, which side has stronger evidence and why (study design, sample, recency, independence)?
- Which findings appear in three or more lenses independently? Those are the spine of the report.
- Where do the build lenses contradict the research lenses? That tension is usually the most valuable thing in the sweep, because it is where the evidence and the business pull apart, and Justin has to know before he picks a side.
- Which findings appear in only one lens with weak sourcing? Flag them as fragile.

## Phase 3 — Synthesize the briefing

Read `report-template.html` in this skill folder. Fill it with real content. Never change its structure, tokens, or fonts. The template sections are:

1. **60 Second Summary** — five to seven sentences a busy founder can read cold
2. **Key Findings** — each ranked by reliability out of 10, with which lenses supported it and which challenged it
3. **Contradiction Map** — the live disagreements and where the evidence leans
4. **Lens Panels** — each perspective's sharpest take in its own voice, all nine, with the three build lenses visually distinct from the six research ones
5. **What This Means for Guided Childhood** — concrete moves: which stage content changes, what DiGi should say differently, script ideas, school pitch angles, marketing claims that are now safe or unsafe to make. Every move carries the platform mapper's verdict (built, partial or missing) and a build size, so nothing here is a theme. The three build lenses own this section; the research lenses supply the evidence for it.
6. **Assumptions and the Missing Lens** — what this briefing rests on, and which seventh perspective would change it
7. **Source Ledger** — every citation with its verification status

Save the V1 file to `briefings/<yyyy-mm-dd>-<topic-slug>.html` in the repo root.

## Phase 4 — Adversarial verification

Spawn up to six verifier agents in parallel, using the `citation-verifier`
agent type (.claude/agents/citation-verifier.md) so every session runs the
same adversarial pass. Split every citation in the report between them. Each
verifier must:

- Fetch the primary source, not a secondary write up
- Check the claim, the numbers, the year, and whether the source actually says what the report says it says
- Return a verdict per source: **confirmed** (says exactly this), **corrected** (real but the report misstated it, with the correct version), or **demoted** (cannot be verified, is misattributed, or the source is weaker than claimed)

Apply every correction to the report. Rewrite any key finding whose reliability changed. Update the Source Ledger with colour coded verdicts. Save as V2, replacing V1 (`briefings/<yyyy-mm-dd>-<topic-slug>-v2.html`).

Never deliver a briefing that skipped verification. If verification finds nothing wrong, say so in the ledger; that is a result, not a wasted step.

## Phase 5 — Deliver

Send the V2 HTML file to Justin. In chat, give him: the one sentence headline finding, the biggest thing verification changed, and the single most actionable move for Guided Childhood. Offer to spin up the missing seventh lens as a V3 if the assumptions section surfaced one worth running.

**LinkedIn post pack.** If the topic relates to marketing, audience growth, or content, or if Justin asks, draft 3 to 5 LinkedIn posts from the verified findings after delivering the briefing. Justin's voice: warm, plain, direct, no AI isms, no hype, no dashes. Each post leads with a hook from a confirmed finding, cites the real number, and ends with one soft line pointing at Guided Childhood. Never build a post on a demoted source.

## Lens flexing

The **six research lenses** flex. The Clinician, Academic, Skeptic, Economist,
Historian and Child fit kids mental health and device topics; when the topic is
adjacent (marketing, school sales, content strategy, product formats), swap the
personas to fit. Two rules survive every swap: always a skeptic whose job is to
kill weak claims, including claims that flatter us, and always the person on the
receiving end (the child, the pupil, the parent scrolling, the teacher delivering).

The **three build lenses do not flex and are never dropped.** The SaaS Operator,
Parent Demand and Schools Digital Learning run on every sweep regardless of topic,
because their job is to convert whatever the research found into something Justin
can act on. Neither does the platform mapper.

Name the lenses honestly in the report chips, including the swapped ones.

**Brief the build lenses with the real numbers**, not a description of the product.
Pricing, the MRR target, the founder cap, the live surfaces, and any commercially
relevant finding the research lenses have already produced. A build lens given a
vague product summary returns generic advice, which is worse than nothing.

**The bench (named optional lenses, swap in when the topic calls for them):**

- **The Teacher** — a UK Year 6 or secondary form tutor. Sees the Monday morning fallout, runs the informal triage, writes the letters home. Swap in whenever the topic touches school life, transitions, or anything the schools product would sell. (Added 27 August 2026 after the first WhatsApp moment briefing named it the missing seventh lens.)
- **The Distributor** — a platform growth expert who knows the LinkedIn algorithm (per .claude/skills/viral-post) and Instagram family content (per .claude/skills/family-social). Swap in when the decision the briefing informs is content or audience growth rather than product.
- **The Designer** — a product translator who asks of every finding "what screen, what table, what words". Swap in when the briefing exists to drive a build, so the What This Means section lands on real surfaces instead of themes.

## Phase 5b — The distribution review (STANDARD, every briefing)

After verification, always run the `distribution-reviewer` agent
(.claude/agents/distribution-reviewer.md) over the V2 findings. It reads the
viral-post, linkedin-engagement, hidden-thread and family-social skills
itself, then returns, per confirmed finding: is this a hook, a card stat, a
carousel, or unpostable, plus the one strongest post angle per platform and
any finding that must never be posted (demoted, or safe only with its caveat
attached). This pass reviews and ranks, it does not draft; drafting stays
with content-engine and viral-post so the voice and evidence guards still
run. Save its output as a "content potential" note in
`content/packs/<yyyy-mm-dd>-<topic-slug>/content-potential.md` and deliver it
alongside the briefing. (Made standard 27 August 2026: Justin asked for the
Instagram and LinkedIn expert review to run every time.)

## Phase 5c — The platform mapping (STANDARD when the briefing informs a build)

Whenever the What This Means section proposes features, run the
`platform-mapper` agent (.claude/agents/platform-mapper.md) over the
candidate list in parallel with verification. It sweeps the codebase and
returns, per candidate: where it would live, what already exists with file
paths, what is genuinely new, a build size, and duplication risks. Its
output becomes the build plan in `plans/`, so the briefing's product moves
land on real surfaces instead of themes and nothing already built gets
rebuilt.

## Hard rules

- No dashes anywhere in report copy. Not in headings, buttons, body text, or lens names. Restructure the sentence instead.
- Guided Childhood tokens only: Hanken Grotesk plus IBM Plex Mono, the cream, green, coral, gold, and lav token set already in the template. No Inter, no purple gradients, no generic AI report styling.
- Justin's voice in the summary and takeaways: warm, plain, direct, no AI isms, no hype.
- UK context always noted where it matters, especially the under 16 platform ban (confirmed 15 June 2026, live Spring 2027) and Online Safety Act enforcement.
- Every claim in the report traces to a ledger entry. No orphan statistics.
- Never describe a feature the platform mapper marked MISSING as though it exists. A parent who goes looking and finds a coming soon card is worse than no marketing at all.
- The build lenses are held to the same evidence bar as the research ones. An operator's confident opinion is not a finding, and a benchmark without a source does not go in the ledger.
- The report is self contained: one HTML file, inline CSS, Google Fonts import only. It must open clean from a file:// URL.
