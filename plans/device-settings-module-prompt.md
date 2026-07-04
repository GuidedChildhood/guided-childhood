# CLAUDE CODE BUILD PROMPT — Device Settings Before You Start

Paste everything below this line into Claude Code from the repo root.

---

You are building the **Device Settings Before You Start** module for Guided Childhood, inside the Digital Pathway OS members' dashboard. A free front-of-funnel version of this already exists at tools.guidedchildhood.com (Device Setup Pathway: quiz in, email gate, static guide library). This build creates the database-driven members' version and, in a later phase, refactors the free tool to read from the same data.

## Context you must respect

1. **Data source of truth**: Supabase. The schema is in `device-safety-schema.sql` and seed data in `entities.csv`, `settings.csv`, `risks.csv`. Tables: `entities`, `settings`, `risks`, `setting_checks`, `research_watch`, `guidance_content`. Never hardcode a setting, platform list, or age rule into components. Everything renders from the database.
2. **Stages**: explorer (age 4 to 7), learner (7 to 11), navigator (11 to 14), voyager (14 to 16), independent (16+). Stage is resolved from the child's date of birth or year group on their profile. Stage recommendation values in `settings`: `on`, `on_locked`, `off`, `parent_choice`, `na`.
3. **Config flags already in the codebase**: `social_media_law` (`none` | `partial_ban` | `full_ban_u16`) and the banned-platform list held as config data. When `social_media_law` is `partial_ban` or `full_ban_u16`, any entity with `in_uk_ban_scope = true` renders a ban-context banner on its guidance: the platform is scheduled to be unavailable to under 16s from Spring 2027, and the guidance shown is for the transition period. Positioning is neutral: neither pro-ban nor anti-ban. The frame is always: the ban removes the apps, it does not raise the child.
4. **DiGi**: expose a read API (or RPC) so DiGi can query settings, risks and the child's checklist state. DiGi outputs pathways and guidance only. It never outputs allow or deny decisions, never routes to banned platforms, never advises on circumvention, and never repeats a `bypass_risk` field as instructions. `bypass_risk` is for parent awareness copy only.
5. **Copy rules (hard)**: No dashes as punctuation anywhere in user-facing copy. Write around them. Hyphenated compounds are fine. Age ranges in data format are the only exception. Warm, direct, plain English. No fear language. Every screen ends with one clear next action.
6. **Review queue**: `guidance_content` rows and `research_watch.proposed_update` rows only surface to users when `approved = true`. Build an admin approval view. Nothing auto-publishes.

## Feature 1: The dashboard prompt

On the parent dashboard, for each child, show a **Device settings before you start** card if that child has any `essential` settings not marked `done` for their stage.

- Card shows: child name, progress ring (done essentials / total essentials for their stage and their household's devices), and the single highest-priority unfinished setting as the suggested next step.
- First run: a 90-second household inventory. "Which of these does [child] use?" Multi-select from `entities` grouped by category (their phone or tablet, consoles, the family TV, home wifi, apps and platforms). Store per child. Only inventoried entities generate checklist items.
- The checklist for a child = settings where the stage column for the child's stage is `on`, `on_locked` or `off`, filtered to inventoried entities, ordered: essential first, then recommended, then optional. `na` rows never appear. `parent_choice` rows appear in a separate "Your call" section with the why_it_matters copy and no pressure either way.

## Feature 2: Step-by-step guidance

Tapping a checklist item opens a guidance screen assembled from the settings row plus any approved `guidance_content` step_guide:

1. Title: setting_name. Subtitle: what_it_does.
2. "Why this matters" from why_it_matters.
3. Numbered steps from how_to_path (expand into full steps in guidance_content over time; how_to_path is the fallback).
4. "Worth knowing" from bypass_risk, rewritten as parent awareness not a how-to. Frame: controls are guardrails not walls, and the conversation is the other half.
5. Buttons: Mark as done, Not applicable, Remind me later (writes to setting_checks with snoozed_until).
6. If the entity is in ban scope and the config flag is active, show the transition banner.
7. Footer link: "Talk it through with DiGi" passing setting context.

## Feature 3: Scripts and game cards

Two content types in `guidance_content`:

- **script**: the exact words for the conversation that pairs with a setting or risk. Structure: Situation, What to say (verbatim parent lines), If they push back, What not to say. Generate an initial draft set of 12 scripts covering: handing over the first phone, setting up the Screen Time passcode without it feeling like surveillance, the 13th birthday Family Link conversation, the finsta conversation, the sextortion protective script (pattern level: if anyone ever asks for a photo or threatens you, you will never be in trouble for telling me), the off-platform migration signal (a game friend wants to move to Discord or Snapchat), Robux and V-Bucks spending pressure, group chat exits, the Snap Map conversation, the ban transition conversation for a current 13 to 15 year old, voice chat with strangers, and screens at bedtime. All drafts land unapproved in the review queue.
- **game_card**: short family activities that test whether the setup and the understanding both hold. Format: name, players, time, how to play, what it checks. Generate an initial draft set of 8, for example: Spot the Stranger (parent creates a mock friend request and the child talks through what they would check), Settings Detective (child tries to find one setting that is off and explain what it does), The Ad or Not game, Password Ransom (family password hygiene quiz), Feed Swap (compare what the algorithm shows each family member and discuss why), The Exit Drill (practice leaving a group chat and telling a parent), Robux Budget Night, and Screenshot Court (does deleting mean gone). All unapproved until reviewed.

Scripts surface contextually: each script row links to setting_ids or risk_ids so the relevant script appears on the guidance screen and in DiGi's retrieval.

## Feature 4: The tracker

- Per-child checklist view with tick-off, powered by `setting_checks`. Progress by entity and overall. Essentials complete unlocks a "Setup complete for now" state with the honest caveat that settings drift and a re-check reminder in 90 days.
- Re-check logic: when a `settings` row is updated (last_verified changes after a research-agent update is approved), all `done` checks on that setting flip to `needs_review` and the dashboard card reappears with "Something changed" copy.
- Stage transition: when a child crosses a stage boundary, generate the delta list (settings whose recommendation changed between stages) as a "Growing up checklist" and add milestone items to the calendar feature.

## Feature 5: The research agent

A scheduled job (Vercel cron or Supabase edge function) that keeps the data current. This is what turns the Spring 2027 update promise on the free tool from a manual rewrite into a pipeline.

- Iterate `research_watch` rows due by check_frequency_days. For each, run the watch_query through the search tool available in the agent runtime, compare findings to last_known_state, and if changed: set change_detected, write change_summary, and draft proposed_update (a diff-style suggestion against the relevant settings or entities row). Never write directly to `settings`.
- Seed `research_watch` with at least: iOS 27 Ask to Browse and Time Allowances rollout; Android and Family Link changes; Nintendo Switch 2 GameChat changes; Roblox Kids and Select account changes and the PEGI ratings transition; Instagram Teen Account and stricter tier changes; TikTok Family Pairing changes; Snapchat Family Centre changes; YouTube Shorts limit zero option rollout; WhatsApp parent-managed accounts rollout; the UK under 16 ban Regulations, Ofcom age assurance options, and specifically the YouTube scope question; and Online Safety Act codes affecting any listed platform.
- Volatile rows get check_frequency_days 14, semi_volatile 45, durable 180.
- Approved updates flow: admin approves in the review view, the settings row is updated with a new last_verified, and the tracker re-check logic fires.
- Weekly digest: one summary of detections awaiting approval, surfaced in the admin view (and optionally emailed).

## Build notes

- Stack: match the existing repo (Next.js on Vercel, Supabase client). Auth and database provider decisions are logged as open in the master build document; build behind an interface so the provider can be swapped.
- Mobile first. Bottom tab navigation pattern consistent with the rest of the OS.
- Design tokens: cream #F7F3EE, coral #D4600A, gold #F2C94C, green #AFDCA2, lavender #E7ECF8, border #E4DFD7, Hanken Grotesk plus IBM Plex Mono, 16px radius buttons with the hard 0 5px 0 shadow. Do not use DESIGN_SYSTEM.md in the repo; it is outdated.
- Every parent CTA in this module routes to /starter-pack context where relevant.
- Ship as staged diffs for review, not direct deploys.

Start by: (1) running the schema against Supabase, (2) importing the three CSVs, (3) building the inventory flow and checklist view, (4) the guidance screen, (5) tracker logic, (6) the research agent job, (7) the scripts and game card drafts into the review queue.
