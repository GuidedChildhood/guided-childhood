# DiGi intelligence: safety verifier, evals, aggregate wisdom

Week of 2026-07-11. Lane: platform code (DiGi brain). Claimed via draft PR.

The three remaining no-key steps from the 8 step DiGi intelligence plan.
Steps 1 to 4 (ranked memory, what worked, concierge prompts, quick lesson,
insight agent) already shipped. Step 4 embeddings and step 8 router stay
parked for a key and a later week.

## Step 6 — Safety verifier

A second pair of eyes on DiGi. Because the reply streams to the parent, the
verifier cannot block it, so it runs post hoc in the route's after() block and
logs anything it catches. It is a monitoring layer and the grader the evals
lean on, not a gate.

- `lib/digi/safety.ts`
  - `lexicalFlags(userMessage, reply)`: pure, deterministic. Catches the clear
    cut breaches: any dash in the copy, allow or deny binary language, a stated
    diagnosis, a definitely fine or definitely not fine verdict, a request for
    identifying data, and the big one, a crisis message answered without a
    human signpost (Samaritans, 999, GP, CAMHS).
  - `verifyReply(...)`: runs the lexical pass plus a model graded rubric against
    the non negotiables, returns { pass, severity, violations, notes }.
- Wire into `app/api/digi/route.ts` after(): run `lexicalFlags` on the finished
  reply, and when anything fires, insert one row into `digi_safety_flags`.
  Non blocking, best effort, never delays or changes the parent's reply.

## Step 5 — Evals harness

- Extract the static system prompt from the route into `lib/digi/system.ts`
  so both the live route and the evals generate from the exact same DiGi.
- `lib/digi/evals.ts`: a fixed set of adversarial cases (crisis, allow or deny
  bait, diagnosis bait, LGBTQ+ restriction bait, screen time ban bait, a normal
  how to, a data minimisation bait). For each: generate a real DiGi reply, grade
  it with `verifyReply` plus a rubric, return per case pass or fail and a score.
- `app/api/admin/digi-evals` (founder only, POST): runs the suite, returns the
  results. Surfaced on the insights board with one button.

## Step 7 — Aggregate wisdom

What tends to work across all families, de-identified, so DiGi can lean on the
wider track record, not only this one family's.

- `digi_wisdom` table: topic, age_band, what_works, evidence_count, updated_at.
- `lib/digi/wisdom.ts`
  - `rebuildWisdom()`: admin client reads de-identified wins across families
    (resolved and improving concerns, script completions marked worked, answered
    reflections), distils them with the model into short reusable patterns, and
    replaces the wisdom rows. Only paraphrased patterns are stored, never a
    family's raw content.
  - `getAggregateWisdom(supabase, ageBand, message)`: retrieves the matching
    patterns for the DiGi context block, same shape as getWhatWorked.
- Wire `getAggregateWisdom` into the route's family context.
- Weekly cron `/api/cron/digi-wisdom` (Sunday) plus a founder rebuild endpoint.

## Migration

`043_digi_intelligence.sql`: `digi_safety_flags` (service role writes, founder
reads via admin) and `digi_wisdom` (public read for the authenticated DiGi
route, service role writes).

## Guardrails held

No dashes in any copy. DIGI_MODEL stays config, never hardcoded. Nothing
identifying leaves the aggregate. Verifier never blocks or alters the live
reply. Privacy: only question text, stage, and paraphrased patterns reach the
model, never a user or child id.
