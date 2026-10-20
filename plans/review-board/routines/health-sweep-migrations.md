# Daily health sweep, check 5: is every migration on main in the database?

Added 16 October 2026 (review board task `health-sweep-checks-applied-migrations`).
The sweep's prompt tells it to read `lib/ops/health.ts` first, and that file
points here. Read this file from `origin/main`, never from a checkout on disk.

**Why it exists.** Migration 360 (give five, get five) merged on 4 October and
was never run. The referral tables did not exist, thirteen files of code read
them, and checkout hid it by replying 200. The sweep's other checks could not
see it: the column check only knows the sixteen columns someone listed, and the
heartbeats only know the crons. This check works from the migration files
themselves, so a new migration is covered the day it lands without anyone
adding a line.

## The steps

1. `git fetch origin main`. The script reads the migration files from
   `origin/main`, so it always judges main and never a stale clone.
2. `node scripts/migration-gap.mjs probe` prints one read only select. It lists
   every table, column and function the newest forty migrations create that
   still exist after later migrations drop or rename things. For a wider look,
   add `--all` or `--since 300`.
3. Run that select as it is with the Supabase connector (`execute_sql`). It
   reads `information_schema` and `pg_proc` and writes nothing. Save the rows
   it returns to your scratch folder as `migration-rows.json`.
4. `node scripts/migration-gap.mjs report --rows <scratch>/migration-rows.json`
   (same `--since` or `--all` as step 2). The exit code is 0 clean, 1 a gap,
   2 unknown.
5. Put its output in the report, verbatim. Do not summarise a gap into
   "mostly applied".

## What to do with the result

- **Gap (exit 1).** This is the highest priority finding of the day, above the
  advisors. Say which migration, what is missing, and what that breaks for a
  real family (search the code for the missing table or column name). Read the
  migration file first: a statement that is guarded by a condition can read as
  missing when it chose not to run, and `report` says so. Do not apply a
  migration from the sweep. Name it and stop, so Justin can say "apply it".
- **Unknown (exit 2), or no connector.** Say "migration gap: unknown" in one
  line. Never report clean because the check could not run. Unknown is also
  the answer if some objects came back without a row.
- **Clean (exit 0).** One line in the report. It also lists the migrations the
  probe cannot check, because they only insert, update, grant or index. A
  green result says nothing about those, and 373's content half was exactly
  that kind.

## What it does not cover, said plainly

- Rows, policies, grants and indexes. A migration that only changes those has
  nothing to look for. They are listed as "not checkable".
- A column added by `alter table` is checked on its own, against the migration
  that added it, so a table that exists can still show a later migration as
  half applied.
- `list_migrations` is not used as evidence. Many migrations are run through the
  SQL editor and never recorded in the migrations table, so its list would show
  false gaps. The probe asks the database what exists instead.
- Backup snapshot tables (`*_backup_*`) are checked, but a missing one is
  mentioned softly: housekeeping may have dropped it on purpose.

## For Justin

The live routine's prompt was pasted into claude.ai Routines, which a session
cannot edit. This check reaches the sweep through the note in `lib/ops/health.ts`
that the prompt already tells it to read. If you would rather it sat in the
prompt too, copy check 5 from `plans/go-live-two-manual-steps.md` (updated in
the same pull request) into the routine in the claude.ai interface.
