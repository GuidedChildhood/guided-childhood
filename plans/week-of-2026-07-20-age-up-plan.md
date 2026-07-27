# Week of 20 July 2026: everything grows up with the child, and works per child

Justin's direction: everything must update with the child's age and work per
child, platform wide.

Claims migration 083 (081 is claimed by PR 408, 082 by PR 412).

## Phase 1: audit (results in the PR body)

Map how children.age_band and stage_id are set today (onboarding, edit forms),
whether any birth date exists, and which surfaces read only the primary child
versus already per child.

## Phase 2: the ageing mechanism

- Migration 083: children.date_of_birth date, nullable. Children without a DOB
  keep their stored age_band exactly as it is today.
- lib/children/age.ts: bandForAge(dob) mapping to the existing bands
  (4-7, 8-10, 11-13, 13-15, 16+) and their stages. Single source of truth.
- Daily cron app/api/cron/age-up (vercel.json, CRON_SECRET gated): for
  children with a DOB, when the derived band differs from the stored one,
  update age_band and stage_id, insert a digi_memory row recording the stage
  up, and push the parent a warm birthday celebration linking to the pathway.
  If kid_links.agreed_level no longer matches the new band, clear agreed_at so
  the child re agrees the age right contract on next open. That is intended.
- Parent settings: a birthday field on the child edit form writing
  date_of_birth, with the line "Set the birthday and everything grows up with
  them on its own."

## Phase 3: multi child switcher

On the surfaces the audit finds primary only (home greeting and daily loop
context header, pathway page, tracker page), a simple switcher when a family
has more than one child: butter pill tabs with each child's name at the top,
selection carried in a query param, every reading recomputed for the selected
child. Server components that read is_primary true accept a childId search
param and default to the primary child.

Out of scope, noted as follow up: DiGi chat multi child. Its context stays on
the primary child in this PR.

## Verify

npx tsc --noEmit clean. Fixture screenshots of the switcher and the birthday
field. Migration NOT applied to Supabase from this session.
