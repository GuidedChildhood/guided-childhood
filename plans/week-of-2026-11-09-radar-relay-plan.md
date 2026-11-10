# Research Radar relay: no more copying between ChatGPT and Claude

Justin, 10 November 2026: "I want to complete the Guided Childhood automation so
I no longer need to copy research findings and prompts between ChatGPT and
Claude. I should only need to review and publish."

Lane: content and radar scripts. No app code, no migration.

## What already exists and is not rebuilt

- The register, dossier, handoff, manifest, sync, QA and pipeline gates in
  `scripts/radar/` (PRs 1482, 1486, 1487, 1488). 133 checks.
- The 09:17 weekday routine, which runs in Claude Code on the web with the
  Drive connector. It is a cloud scheduled task, not a desktop conversation.
- ChatGPT's 08:00 brief, which has written a file to Drive every day since at
  least 30 October (checked in the folder listing, 10 November).
- The Post Desk and the Radar Desk.

## What is missing, and gets built

1. **A candidate inbox.** A folder in the Stage 2 Drive folder, a JSON schema
   for what ChatGPT drops there, a validator, and an ingest step that is
   idempotent (a ledger keyed by the batch digest and the candidate id).
2. **Deduplication** against the research register, the post register, the
   archived and published posts, and ChatGPT's posting pack.
3. **Gated steps that were done by hand**: storing a review, claiming a GDC
   number, recording "changes requested".
4. **A run log and a daily summary**: which stages ran, what passed, what was
   held and why, what needs Justin.
5. **Every story in the queue shown to ChatGPT**, not just the first, so one
   production run can write everything that is eligible.
6. **One approval sheet** with the post, the other formats, the evidence and
   overclaim notes, the QA result and the publication checklist.
7. **A GitHub Actions gate** with no secrets: the deterministic checks on every
   radar pull request, and a weekday watchdog that goes red if the morning run
   left no log.
8. **A second scheduled Claude run after ChatGPT's 11:00**, so a pack is checked
   the same day rather than the next morning.

## What is deliberately not done

- No paid service is switched on. Running Claude inside GitHub Actions needs an
  API key and a Google credential for Drive: costed and reported, not enabled.
- No auto merge. A pull request from an unattended run still needs Justin, or
  his say so to let the gate merge it.
- Nothing posts. Approval is Justin's, and PUBLISHED needs a URL that answers.

## Test

One new candidate through the real inbox to the handoff queue, then a simulated
production response through final QA on a throwaway register, so no real record
carries a test pack. The three stories reviewed today go through the same gates
as real work.
