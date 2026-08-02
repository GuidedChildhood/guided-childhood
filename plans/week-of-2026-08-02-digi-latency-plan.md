# DiGi felt slow. Measure it before touching it.

**2 August 2026.** Lane: platform. Migration claimed: **149**.

Justin, twice: "DiGi took a little bit long to load answer."

The closed loop plan parked this at the bottom with the right instruction, so
this is that instruction carried out and nothing more:

> Worth measuring rather than guessing at. The first message of a thread pays
> for lane classification, two parallel gather rounds, and a tool round trip
> that is a whole extra model turn whenever `search_knowledge` fires. Any of
> those could be the cost. Measure before touching it.

Not claimed by anyone. PR 675 has the DiGi verdict spine, PR 676 has the say
yes card. Neither touches timing.

---

## What the code already tells us, before a single measurement

`app/api/digi/route.ts` streams. `callDigiStream` is awaited at line 501, and
the response is not returned until line 773. So everything below runs to
completion before one character reaches the parent:

1. `createClient()` and `auth.getUser()`
2. Gather round one, thirteen Supabase queries in parallel
3. `classifyLane`
4. Gather round two, seven queries in parallel
5. Prompt assembly
6. Anthropic's own time to first token

Six phases, strictly one after another. The parallelism inside rounds one and
two is real and worth keeping. The rounds themselves are ordered because round
two genuinely needs `child.age_band`, `child.stage_id` and `scriptFeedback`
from round one. That dependency is honest, so this is not a case of somebody
forgetting to use `Promise.all`.

Which means the answer is not obvious from reading, and picking a phase to
optimise now would be a guess. That is the whole reason for this pass.

---

## The one thing worth saying about the metric

The number a parent feels is **time to first token**, not total duration. A
reply that takes nine seconds to finish but starts moving in one second reads
as fast. A reply that appears complete after four seconds of nothing reads as
slow. Total duration would rank those the wrong way round.

So the measurement stops at the moment the first byte is enqueued, and every
phase before it is stamped separately.

---

## What gets built

**1. `lib/digi/timing.ts`.** A phase stamper. Starts a clock, takes a mark per
phase, renders a `Server-Timing` header value and a plain object.

**2. Instrumentation in the route.** Marks at each of the six boundaries. No
behaviour change anywhere: nothing is reordered, nothing is gated on a timing,
and a failure in the stamper cannot fail a reply.

**3. `Server-Timing` on the response.** Chrome DevTools renders this natively
in the Network tab, under Timing. CLAUDE.md rule 5 already has us in DevTools
on every change, so the numbers land where Justin is already looking, with no
new screen to build and no migration needed to read them.

**4. Migration 149, `digi_latency`.** One row per message so we get a
distribution rather than one anecdote. Written inside the existing `after()`
call at line 525, which is already off the critical path, because a table
write on the hot path would add latency to the thing we are measuring.

---

## Rails

- **Measuring must not cost anything.** All stamps are in memory. The only
  write happens in `after()`. If the write fails, the reply is unaffected.
- **No optimisation in this pass.** Not one line reordered. The next pass gets
  to act on real numbers, and it will be a different PR so the before and after
  are separable.
- **Nothing identifying.** Durations, the lane, whether a tool fired, whether
  the message was the first of a thread. No message text, ever.

---

## What the numbers will decide next

- **Model TTFT dominates** and the rest is noise. Then the fix is to stop
  making the parent wait for the whole preamble: send an acknowledgement or
  open the stream earlier. Nothing to optimise in our own code.
- **Gather round one dominates.** Thirteen queries where the slowest sets the
  pace. Find the slow one, index it.
- **Gather round two dominates.** The research helpers do real work.
  `getExpertKnowledge` is semantic, migration 142.
- **`classifyLane` dominates.** It fell through the keyword pass to the model,
  which costs up to eight seconds. Widen the keyword list.

Each of those is a different fix, and today we cannot tell them apart. That is
the finding this pass exists to change.

---

## Separately, worth Justin knowing

There are **two migration 147s on main**: `147_digi_outcomes.sql` and
`147_kid_homework_notes.sql`, from two sessions the same day. They create
different tables so nothing is broken and no data is at risk, but it is the
exact collision the multi session rules in CLAUDE.md exist to prevent, and it
is now the second time this week. 148 is also taken, so this pass takes 149 and
claims it in the draft PR at claim time.
