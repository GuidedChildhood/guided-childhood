# DiGi weekly tester and learning loop · plan for Justin's yes

Justin, 1 September 2026: a weekly tester agent that reviews DiGi with
difficult questions, checks the answering process, stores what it finds,
tells us what to add (scripts, patterns, common questions), tests against
expert thinking (Catherine Knibbs, Dr Becky), keeps DiGi learning from our
data and the latest science, and reports anything we should be checking.
Plan first, nothing built yet.

## The honest starting point: most of this already runs

Before adding anything, name what exists, because the safest build is the
one that extends rather than replaces:

- **Weekly safety MOT already runs.** Every Monday `digi-quality` runs the
  full adversarial eval suite (`lib/digi/evals.ts`: crisis, allow or deny
  bait, diagnosis bait, and more, each generating a REAL DiGi reply graded
  by the safety verifier and a rubric grader), counts what the live
  verifier flagged in real conversations that week, and emails you the
  verdict. An all clear still sends.
- **DiGi already learns, with your hand on the gate.** `knowledge-refresh`
  (fortnightly) reads what parents actually asked, drafts candidate
  findings from credible researchers, and queues them PENDING on the
  insights board. Nothing reaches the live bank until you click OK. That
  gate is the reason this can grow without breaking, and it stays.
- **Questions and answers are already stored.** Every chat sits in
  `digi_conversations`; live safety flags in `digi_safety_flags`; the
  wisdom, insights and check in learning crons already mine them.
- **A monthly self critique already runs** (`answer-review`, the 2nd of
  each month): the full eval suite plus a written review of how DiGi
  answered.

So the ask is not a new machine. It is four extensions to a machine you
already own.

## The four extensions

### 1. Rotating difficult questions, weekly

The current eval set is fixed on purpose: it is the regression net and it
never changes without a decision. ADD a second, rotating set each week:

- Five fresh hard questions drawn from two sources: the week's real parent
  questions (clustered from `digi_conversations`), and one from the week's
  news or research (a new study, a platform change, a moral panic).
- Each generates a real DiGi reply through the same pipeline as live, then
  graded by the same two graders plus the expert lenses below.
- Results stored alongside the existing eval runs, so week on week drift
  is visible. The fixed set is never edited by this process.

### 2. Expert lenses on the grader

Three additional rubric lenses, applied to every rotating case:

- **The Knibbs lens** (trauma informed cyber psychology): does the answer
  treat behaviour as communication, avoid shame, and understand the
  child's online world rather than fear it?
- **The Good Inside lens** (Dr Becky's connection first repair): does the
  answer build the parent as a sturdy leader, repair over punishment,
  never allow or deny?
- **The Odgers lens** (evidence discipline): is every claim defensible to
  a hostile expert, cited or silent, no moral panic numbers?

One important line to hold: these are lenses built from their PUBLISHED
work, used to test our answers. We never say or imply the experts
themselves reviewed or endorsed DiGi, in product or in marketing, and the
graders never write in their voices.

### 3. The Monday email grows three sections

Same email you already get, three additions, all from data already stored:

- **Common questions this week**, clustered, with counts.
- **Script gaps**: questions where no script category matched, which is
  your literal "what to add in the way of scripts" list.
- **Science watch**: one line on anything the research updater queued for
  your OK, so pending candidates never sit unnoticed.

### 4. The learning loop watched like plumbing

Add the learning crons (`knowledge-refresh`, `digi-wisdom`,
`checkin-learning`, `digi-insights`) and their tables to the daily health
sweep's watch list, so "is DiGi still learning" is checked every day by
the machine rather than remembered by a person. The check in scores DiGi
reads since PR #937 are part of the same watch.

## Why this cannot break what exists

- The live chat path is not touched. Everything runs in crons and the
  eval harness, on the same `DIGI_MODEL` config as live.
- The fixed eval set stays frozen; rotating cases are additive.
- New knowledge still only enters through your PENDING gate. A learning
  tool that learns itself, with a human throat to grab: that is the
  design Odgers would respect, because the evidence discipline is
  enforced, not promised.
- Expert lenses grade answers; they never inject content.

## Build order when you say go

1. Rotating case generator + expert lens graders (one week).
2. Monday email sections (same week, same PR).
3. Health sweep watch list additions (small).
4. Four weeks of runs, then we review whether the lenses agree with your
   own reading of the transcripts before trusting them further.
