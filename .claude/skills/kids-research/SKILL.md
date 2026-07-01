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

## Phase 1 — Six lenses in parallel

Spawn six subagents in a single message so they run concurrently. Each gets web search access, the topic, the reader context, and its persona below. Each must return raw structured findings, not prose for humans:

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

## Phase 2 — Contradiction map

When all six return, do this in the main session. Build a contradiction map:

- Where do lenses directly disagree? State each disagreement as one line with both positions.
- For each disagreement, which side has stronger evidence and why (study design, sample, recency, independence)?
- Which findings appear in three or more lenses independently? Those are the spine of the report.
- Which findings appear in only one lens with weak sourcing? Flag them as fragile.

## Phase 3 — Synthesize the briefing

Read `report-template.html` in this skill folder. Fill it with real content. Never change its structure, tokens, or fonts. The template sections are:

1. **60 Second Summary** — five to seven sentences a busy founder can read cold
2. **Key Findings** — each ranked by reliability out of 10, with which lenses supported it and which challenged it
3. **Contradiction Map** — the live disagreements and where the evidence leans
4. **Lens Panels** — each perspective's sharpest take in its own voice
5. **What This Means for Guided Childhood** — concrete moves: which stage content changes, what DiGi should say differently, script ideas, school pitch angles, marketing claims that are now safe or unsafe to make
6. **Assumptions and the Missing Lens** — what this briefing rests on, and which seventh perspective would change it
7. **Source Ledger** — every citation with its verification status

Save the V1 file to `briefings/<yyyy-mm-dd>-<topic-slug>.html` in the repo root.

## Phase 4 — Adversarial verification

Spawn up to six verifier agents in parallel. Split every citation in the report between them. Each verifier must:

- Fetch the primary source, not a secondary write up
- Check the claim, the numbers, the year, and whether the source actually says what the report says it says
- Return a verdict per source: **confirmed** (says exactly this), **corrected** (real but the report misstated it, with the correct version), or **demoted** (cannot be verified, is misattributed, or the source is weaker than claimed)

Apply every correction to the report. Rewrite any key finding whose reliability changed. Update the Source Ledger with colour coded verdicts. Save as V2, replacing V1 (`briefings/<yyyy-mm-dd>-<topic-slug>-v2.html`).

Never deliver a briefing that skipped verification. If verification finds nothing wrong, say so in the ledger; that is a result, not a wasted step.

## Phase 5 — Deliver

Send the V2 HTML file to Justin. In chat, give him: the one sentence headline finding, the biggest thing verification changed, and the single most actionable move for Guided Childhood. Offer to spin up the missing seventh lens as a V3 if the assumptions section surfaced one worth running.

## Hard rules

- No dashes anywhere in report copy. Not in headings, buttons, body text, or lens names. Restructure the sentence instead.
- Guided Childhood tokens only: Hanken Grotesk plus IBM Plex Mono, the cream, green, coral, gold, and lav token set already in the template. No Inter, no purple gradients, no generic AI report styling.
- Justin's voice in the summary and takeaways: warm, plain, direct, no AI isms, no hype.
- UK context always noted where it matters, especially the under 16 platform ban (confirmed 15 June 2026, live Spring 2027) and Online Safety Act enforcement.
- Every claim in the report traces to a ledger entry. No orphan statistics.
- The report is self contained: one HTML file, inline CSS, Google Fonts import only. It must open clean from a file:// URL.
