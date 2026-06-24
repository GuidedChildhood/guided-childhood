# Week 4 — Standalone Evidence Post

Date: 2026-06-24
Branch: claude/loving-fermi-abalbd

## Goal
A standalone long form post that breaks down the Independent Evidence Review and
carries an argument the PDF does not make out loud. Lives alongside /evidence
(the download landing page). New file, new route.

## Route
- File: `evidence-report.html` at repo root
- Route: `/evidence-report` (add to vercel.json, both with and without trailing slash)
- Cross link: /evidence (download) and /evidence-report (the read) point at each other

## The argument (what the user asked for)
1. Break the highlights down. Quick, honest recap of the five findings, the small
   effect size, platform differentiation, design not access, the cliff edge at 16.
2. The chasm. CAMHS and the rest of the frontline see children in crisis every day
   and are certain it is social media, the way a doctor in 1960 was certain about
   cigarettes. That certainty is not stupidity. It is what the frontline sees.
3. The cigarette analogy and why it does not hold. A clear list of differences:
   uniform vs minority harm, dose response vs potato sized effect, no upside vs a
   safe room for some children, substance vs design, abstinence protects vs only
   delays, and the selection effect (the frontline sees the casualties, never the
   millions who are fine).
4. The harm of putting research against frontline. A population statistic handed to
   someone holding a child in crisis does not win the argument, it loses the person,
   and it teaches the frontline to distrust the evidence. Both describe the same
   animal from different ends.
5. How this plays out in social media. The feed rewards the vivid casualty over the
   quiet average. The public argument about social media is being run by social
   media's own logic.
6. The algorithm as mirror. Does the algorithm reflect how we act. It did not invent
   comparison or novelty hunger. It learned them from us, axon by axon, and runs them
   at a speed our self regulation never evolved for. Banning the mirror does not change
   the face. Change the gain (regulate design) and teach the child to recognise the
   reflection (the preparation curriculum). A ban does neither.
7. Close. CTA to download the full review, link home.

## Constraints
- No dashes anywhere. No em dash, no en dash. Commas, full stops, restructure.
- Checker tokens only (reuse evidence.html :root). Hanken Grotesk + IBM Plex Mono.
- Chunky buttons, 16px radius, 0 5px 0 shadow. No purple gradients. No Inter.
- Justin's voice. Warm, plain, direct. No AI isms.
- Subtle fade up reveals, dependency free (matches evidence.html, no Three.js).
- Mobile and desktop checked before declaring done.
