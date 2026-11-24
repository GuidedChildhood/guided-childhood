# The content engine, made to run on its own: plan of 24 November 2026

Justin's brief of 24 November, "Master autonomous content engine implementation
and audit", twenty sections. This plan turns it into stages, each one its own
pull request, so he can stop or redirect between them. One engine: the existing
radar, Stage 2, motion engine, newsletter and Metricool handoff, joined up and
driven from one settings file. Nothing new is built where something exists.

## Founder decisions in the brief that change standing rules

| Rule | Was | Now (brief of 24 Nov) |
|---|---|---|
| Personal LinkedIn cadence | at most three a week, Mon, Wed, Fri 08:00 | three to four strong posts a week; authorised scheduling uses the next free date, then every other day, 08:00 UK |
| Reserve | none set | about five finished packs in reserve |
| Formats | every pack carries Instagram and Facebook (24 Nov morning) | Instagram and Facebook "where appropriate"; do not force every story into every format |
| Metricool drafts | only for approved packs | inert drafts for completed packs are a standing permission (C); scheduling (D) and publishing (E) only under explicit standing authorisation |
| Scheduling (addendum, 24 Nov) | Justin approves each slot | ChatGPT has standing permission to schedule editorially cleared posts: next free date, then every other day, skipping occupied dates. Automatic publishing stays OFF. Native newsletter bookings preserved |
| Daily report (addendum) | many notices | one founder report, owned by ChatGPT's 14:30 Metricool task; every Claude stage writes its status where that task reads it |
| Newsletter (addendum) | Sunday issue, about 2,000 words | Sunday edition ready by Friday, 1,200 to 1,800 words, ten deliverables: LinkedIn edition, Substack edition, title, subtitle and preview, sources, cover, landscape teaser, portrait teaser where right, LinkedIn, Instagram and Facebook promos |
| Founder voice | ai-tells, voice keeper, founder-context scattered | one founder-voice-review skill run on all outward writing |

The 24 Nov morning rule "every pack carries Instagram and Facebook" is softened
to "where appropriate" in stage 2: QA asks for each format or a written reason.

## Stages

1. **Audit** (read only). Contradictions, obsolete dates, duplicate workflows,
   stale manifests, manual steps, scheduled tasks. Report:
   `plans/2026-11-24-content-engine-audit.md`.
2. **One settings file.** `config/content-engine.json` (editable by Justin),
   read by the radar code, START HERE, the skills and the scheduled task
   prompts. Holds philosophy, voice, audiences, research standards, cadence,
   platforms, visuals, motion, newsletter, scheduling, the permission matrix
   (A to F), approval, pause switch, notifications. A guard fails CI when a rule
   in code disagrees with it. A one page "where to change things" guide.
3. **Founder voice.** DONE 24 Nov (see decisions.md).
   **Founder voice.** `.claude/skills/founder-voice-review/` built on the
   existing ai-tells guard, the voice keeper and founder-context, informed by the
   three named editorial sources (read, not executed). The living Founder Voice
   Bible at `content/brand-story/voice-bible.md`, fed by his posts, transcripts
   and corrections, with a corrections log. Wired into CLAUDE.md routing, the
   writing skills, QA and START HERE.
4. **Research and verification.** DONE 24 Nov (verification.mjs).
   **Research and verification.** The ten verification checks become required
   fields of a stored review; the review gate refuses one that lacks any. The
   philosophy and TRUST and readiness framework in the settings file.
5. **The handoff manifest (ChatGPT contract).** One stable Drive file,
   `GDC HANDOFF MANIFEST, CURRENT`, with the sixteen fields per post, versioned,
   written only after every file it points at has been read back, and marked
   incomplete otherwise. START HERE points at it. Revisions propagate by GDC
   number and platform; a material change to a scheduled post resets its review.
6. **Production and media.** Packs for the reserve; motion engine run and every
   frame inspected (headline, figures, spelling, legibility, clipping, pacing,
   size, labels, no GDC number). No paid rendering.
7. **Metricool through ChatGPT.** The METRICOOL HANDOFF folder carries a
   machine readable job per post with the exact text, first comment and media;
   ChatGPT returns a result file (created, link, or failed and why). Claude
   reconciles the result against GitHub. Dedupe by GDC number and platform.
8. **Newsletter.** The weekly edition from the week's cleared stories, voice
   reviewed, saved to its Drive folder; the manual LinkedIn publishing step
   named plainly.
9. **Timetable and recovery.** Completion based handoffs between the scheduled
   tasks, retries, one story's hold never stopping the rest, one daily report.
   Retire duplicate writers; fix stale scheduled task prompts.
10. **Backlog sweep.** 059, 060, 061, 062, 063, 067 against the brief's list;
    withdrawn provisional items still scheduled anywhere.
11. **End to end test** with an isolated fixture and inert drafts, PASS, FAIL or
    NOT TESTED per integration, and the final report with one consolidated
    approval request.

## What will stay manual, said now

- Claude has no Metricool access and must not seek any: every Metricool action
  is ChatGPT's, and only its returned result counts as done.
- Posting to LinkedIn and the native LinkedIn newsletter stay with Justin unless
  a tested integration exists.
- The scheduled radar cannot push to GitHub (patches in Drive on 18, 19 and 24
  November). Until its permission is fixed, nothing it does reaches main on its
  own. This is the first blocker for "runs without me".
