# Scripts library and the DiGi brain

Written 2026-07-18 from Justin's direction. Two joined up ideas: make the
hundreds of scripts findable and answerable, and let DiGi quietly learn from the
whole platform so it gets better and tells Justin what to build next.

## What already exists (do not rebuild)
- **Weekly Sunday review** (`lib/digi/weekly-review.ts`): reads the family's week
  and now the daily reflections too, and writes a warm summary. This is the
  Sunday feedback surface.
- **Daily reflection** (digi_feedback): DiGi already asks one gentle question a
  day and stores the answer.
- **Founder insights board** (`components/insights/InsightsBoard.tsx`): the place
  Justin reviews what DiGi surfaces, including the knowledge bank candidates.
- **DiGi script knowledge** (`app/api/digi/route.ts`): DiGi already knows which
  scripts a parent tried and whether they worked, and leans on that.
- **Knowledge refresh cron**: DiGi's bank grows itself every two weeks, gated by
  Justin's approval.

## Shipped now (this PR)
- **Find my script.** A search on the Scripts page: type the problem in plain
  words, the closest scripts surface as you type.
- **Ask DiGi for a missing script.** No fit, or not quite right, and the parent
  asks DiGi. The request lands in `script_requests` (migration 070) so the next
  scripts are written from real demand, not guesswork.

## Next, to build (staged, needs Justin go)
1. **Script requests in the insights dashboard.** Surface `script_requests` in
   the founder insights board: what parents asked for, how often, the closest
   existing script, so Justin writes the next one from demand. (Table and log
   already in place from this PR.)
2. **DiGi links a script in chat.** When a parent describes a problem in DiGi
   chat that a script covers, DiGi names and links that script inside its answer.
   Retrieval over the scripts table plus a system prompt rule.
3. **Did it help?** After a parent opens a script, DiGi asks if it worked. Feeds
   the same signal DiGi already uses, and flags scripts that keep failing so they
   can be rewritten.
4. **Occasional DiGi questions across the platform.** A capped, never annoying
   drip of one good question at the right moment (after a script, a quiet week, a
   new challenge), building the insight bank that powers the Sunday summary and
   the "what to add, how to help" feedback to Justin.
5. **Add scripts easily.** A founder authoring flow so hundreds of scripts, and
   new ones from requests, are quick to add (scripts live in the scripts table,
   never hardcoded).
6. **DiGi assimilates and looks for solutions.** The daily insight agent already
   mines conversations; extend it to cluster unmet needs, spot patterns across
   families (privately, aggregated), and propose scripts, lessons and bank
   findings, all landing in the insights board for Justin to approve.

## Guardrails
- Scripts live in the scripts table, never hardcoded (non negotiable 6).
- DiGi questions are capped so they encourage, never nag.
- Anything DiGi proposes for the library or the bank is founder approved before
  it goes live. Justin stays the editor.
- Justin's voice, no dashes, grounded in the research.
