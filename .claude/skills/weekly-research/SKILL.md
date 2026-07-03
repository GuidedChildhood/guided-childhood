---
name: weekly-research
description: The Monday research drop. Runs the full pipeline for one topic and delivers everything to Google Drive. Use whenever Justin says "run the weekly research", "weekly drop", "Monday research", or names a topic for the week. Chains kids-research (six lens STORM briefing with adversarial verification) into content-engine (LinkedIn post pack and Substack issue), then uploads the verified briefing and both content documents to the Guided Childhood Research folder in Google Drive.
---

# Weekly Research — the Monday drop

One command, one topic, one complete drop: a verified research briefing plus a ready to publish content pack, delivered to Google Drive and committed to the repo.

## Phase 0 — Pick the topic

If Justin names a topic, use it. If he just says "run the weekly research", propose one topic from the live priorities (the ban countdown, a stage curriculum question, a school sales question, or the missing lens flagged in last week's briefing) and confirm in one line before spending agent budget.

## Phase 1 — Research

Run the `kids-research` skill end to end on the topic: six lenses in parallel, contradiction map, HTML briefing from the template, adversarial verification of every citation, V2 saved to `briefings/`. All kids-research rules apply (design tokens, no dashes, Guided Childhood takeaways section, source ledger with verdicts).

## Phase 2 — Content

Run the `content-engine` skill on the verified briefing: copywriter drafts, council review, final pack saved to `content/packs/<date>-<slug>/` (5 LinkedIn posts with formats and posting moments, plus one Substack issue with subject lines). Only ledger backed claims; demoted sources never appear.

## Phase 3 — Deliver

1. Commit and push everything to the working branch.
2. Upload to Google Drive using the Google Drive connector, into the folder **Guided Childhood Research** (folder id `16LRxCM678a8HhzNtbZMyz7G4DMCGsn2W`; if that id is gone, search for the folder by name and create it if missing). Upload three items, titled `Week of <date> · <thing> · <topic>`:
   - the LinkedIn post pack (markdown, converted to a Google Doc)
   - the Substack issue (markdown, converted to a Google Doc)
   - the briefing HTML (uploaded with conversion disabled so it stays an HTML file Justin can open in a browser)
3. Send Justin the files in chat with a three line summary: the headline finding, the biggest verification change, and the recommended first post.

## Rate limit protocol

If agents fail with a session limit message, note the reset time, finish every step that needs no agents, schedule a one shot resume for shortly after the reset, and tell Justin plainly what is queued. Never deliver unverified content silently: anything not yet verified is labelled V1 with verification queued.

## Cadence

This skill is designed for Mondays, matching the weekly rhythm in CLAUDE.md. It runs when Justin asks; a fully unattended schedule would require a scheduled GitHub Action, which is a separate setup decision.
