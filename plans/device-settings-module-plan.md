# Device Settings Before You Start: integration plan

**Date:** 2026-07-04
**Assets:** schema and seeds banked at supabase/device-safety/ (schema.sql, entities.csv 28 rows, settings.csv 106 rows, risks.csv 31 rows). Justin's full build prompt at plans/device-settings-module-prompt.md. This becomes its own clear section of the platform: the Devices tab.

## Two conflicts, resolved toward the live platform

1. **Stage names.** The spec uses explorer/learner/navigator/voyager/independent. The live platform (database, 160 scripts, all UI) uses foundation/builder/explorer/shaper/independent. Platform names are canonical. Import mapping: explorer→foundation, learner→builder, navigator→explorer, voyager→shaper, independent→independent. Warning baked into the importer: "explorer" exists in BOTH systems with different meanings, so the import renames columns and never mixes. Slight age boundary differences (spec learner 7 to 11 vs builder 8 to 10) are accepted: the platform's age bands win.
2. **Design tokens.** The spec lists the old cream/coral/gold set and Hanken Grotesk. The live system is butter and ink with Nunito. Live tokens win everywhere.

## What it supersedes
Migration 014's device_guides (19 static guides) and the current /dashboard/devices. The new module absorbs them: existing guide content becomes step_guide rows in guidance_content (review queue), the Devices pill in the nav points at the new module.

## Build phases (own sprint, after the daily loop)
1. Migration (next free number, check open PRs per sync rules): schema with renamed stage columns + CSV import + RLS per existing pattern.
2. Household inventory flow (90 seconds, per child, grouped by category) + per child checklist + the dashboard progress ring card.
3. Guidance screen (evidence line first: what it does, why it matters, steps, worth knowing) + Mark done / Not applicable / Remind me later + ban banner from social_media_law + Talk it through with DiGi.
4. Tracker logic: essentials complete state with the honest drift caveat, 90 day recheck, needs_review flip on approved updates, stage transition Growing up checklist, yearly ICS calendar reminders (already planned in the Device Hub upgrade section).
5. Research watch cron + admin review queue (approved only ever surfaces) + weekly digest.
6. The 12 scripts and 8 game cards drafted into the review queue, unapproved.
7. Later: refactor the free tools.guidedchildhood.com to read the same data.

## Images
One real product image per entity (28): stock product shots where licensing is clean, Higgsfield renders otherwise, one consistent style (clean product on soft pastel, no text), stored /public/devices. Same batch session as moments tiles and the 19 legacy guide images.

## Proactive per age
Covered by design: stage columns decide what appears per child, stage transitions generate the delta checklist, research watch keeps recommendations current, the age playbook and yearly calendar reminders resurface settings as the child grows. DiGi reads checklist state so it can say "two essentials left on the PlayStation" unprompted.

## Quiz page tidy (from Justin's screenshots)
1. DONE 4 Jul: reassurance subline on the concern question telling parents the choice is a starting point, not a limit.
2. Icon upgrade: replace the thin outline icons with warmer filled duotone icons on soft pastel squares (or mini product images), consistent with the moments tiles style.
3. The flow principle: quiz chooses where we START, the pathway covers everything, and the parent can re choose focus later from the Devices tab and pathway. Copy carries this at question 2 and on the result page.
