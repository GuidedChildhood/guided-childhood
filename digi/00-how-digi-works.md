# How DiGi works

The canonical explanation of the machine. Written 1 August 2026. If you change
how DiGi is built, change this too, because it is the thing a school, a parent,
an investor or the next Claude session reads first.

Everything here is checkable against the code. Where a claim would be a stretch,
it says so instead.

---

## What DiGi is

Claude, wrapped in four things a raw model does not have:

1. **Rails** it cannot talk its way out of
2. **A research base** we can point at and prove
3. **A memory of this family** that survives between conversations
4. **Loops** that feed what actually worked back in

The model is set by `DIGI_MODEL`, defaulting to `claude-fable-5`, with a fallback
ladder behind it. It is a config value and is never hardcoded. Mechanical jobs
(memory extraction, grading, prompt chips) start on a faster tier through
`digiModelsFor`, so the deep model's judgement is spent where it matters.

---

## One message, end to end

**1. Gate.** Signed in. Free accounts capped at three messages a day.

**2. Pick the shape.** Three lanes: `parenting`, `family`, `general`. A keyword
pass answers it free in the common case, a cheap model call handles the genuinely
ambiguous remainder, and every failure path lands on `parenting`, the shape that
loses least by being wrong. See `lib/digi/lane.ts`.

**3. Gather, in two parallel rounds.** Profile, conversation history, every child
in the family rather than only the primary one, tracker check ins, live concerns,
script feedback, the device guide, school context when the message names a
subject, and the family memory. Then the research layer: expert findings scored
against the message, aggregate wisdom, proven solutions.

**4. Assemble.** `PRECEDENCE` first, because an instruction about how to read
something has to arrive before the something. Then roughly fifteen labelled
context blocks. Then the lane shape last, because it overrides the format rules
in the static prompt and an override that arrives early reads as a suggestion.

The static system prompt is cached, so only the changing part is paid for on each
message.

**5. Stream the reply,** through a filter that strips any dash as it goes.

**6. Afterwards, out of the parent's way** (`after()` keeps the function alive):
save the conversation, extract one durable memory and embed it, upsert a concern
into the same ledger the tracker writes to, split the reflective question into
`digi_feedback`, log the question with its lane, and run the safety verifier over
the finished reply.

---

## What DiGi knows, and how it weighs it

`PRECEDENCE` states the order rather than leaving the model to infer it:

| Rank | Source | Why |
| --- | --- | --- |
| 1 | Safety | Outranks everything, always. The human signpost is never replaced by advice. |
| 2 | The family's own signed agreement | Never quietly contradict a deal a parent and child signed. |
| 3 | Research | What is generally true is where an answer starts. Cited by name. |
| 4 | This family | Sets the fit. A finding about eleven year olds is not a finding about THIS eleven year old. |
| 5 | Other families | A starting suggestion, never authority, and never with numbers attached. |
| 6 | Conflict | When the research and the family point different ways, say so and give the parent the choice. |
| 7 | Not knowing | Never invent a study, a statistic, a source or a number. |

Underneath all of it sits everything Claude knows. **The knowledge base grounds
DiGi, it does not cap it.** Three levels:

1. The bank covers it, so lead with it and name the source
2. It does not, so answer just as fully from what you know, with no source
   attached and nothing dressed up as our own approach
3. It is genuinely contested, so say that and say why

The research itself is two layers: sixteen sections of researchers loaded into
every prompt (`digi/02-scientists.md`), and around sixty five findings in
`expert_knowledge`, of which six are retrieved per question with a floor of two,
so no answer is ever built on nothing.

Retrieval is **hybrid**: the question is embedded and the findings nearest in
meaning come back first, then the keyword pass fills in what a vector blurs (the
crisis bump, exact topic matches). And if what came back does not fit what the
parent actually means, DiGi can call `search_knowledge` and look again in its own
words. Meaning search needs `EMBEDDING_API_KEY`; without it everything falls back
to keywords and still works.

---

## How DiGi learns

| Loop | When | Reads | Writes |
| --- | --- | --- | --- |
| This family | every reply | the exchange | a memory, embedded, plus a concern |
| All families | Sunday 06:00 | resolved concerns, scripts marked worked, written feedback | `digi_wisdom`, read back on the next question |
| The research bank | 1st and 15th | question gaps, plus a web search | candidates for the founder to approve |
| Quality | Monday 06:30 | fourteen adversarial eval cases | a score to watch move |
| Insights | daily 07:00 | what parents asked | the founder board |
| Management review | Monday 00:30 | what actually worked | `management_findings` |

Two rules hold across all of it. **No family's raw content reaches a model that
is looking at more than one family**, only counts and category labels we chose.
And **nothing enters the research bank without a human approving it**, because an
unsupervised loop that adds its own sources is how you end up citing a study that
does not exist.

---

## What DiGi never does

- Never allow or deny. Always a calibrated pathway.
- Never diagnose, never rule anything out, never say a child is definitely fine.
- Never invent a study, a statistic, a source, a name or a number.
- Never name an individual clinician or a private practice.
- Never ask for identifying detail it does not need.
- Never make waiting the whole plan when a referral is in the picture.
- Crisis routing to a real human beats every other instruction in the prompt.
- **Never treats anything it retrieves as an instruction.** A tool result is
  evidence to weigh. The moment retrieved text can tell DiGi what to do, every
  rail becomes negotiable by whatever gets into the bank. This one has to keep
  being said out loud as tools are added, and especially when one reaches the
  open web.

---

## What DiGi is not

**It is barely an agent, and only in one direction.** DiGi has exactly one tool,
`search_knowledge`, and it is read only over a corpus that is already public
inside the product. So it can now decide the research it was handed does not fit
what a parent actually means, and go and look again in its own words. That is a
real crossing of the line between retrieving and searching, and it is also the
whole of it.

It still **cannot take an action**. It cannot save something, schedule something,
change anything, or reach outside that one bank. Every loop in the table above is
a scheduled job, not a decision DiGi made.

The other exception is the fortnightly research updater, which does search the
web, and everything it finds waits in a queue for approval.

**The model does not learn either, and it should not.** DiGi learns *about* our
families. Nothing learns *from* them into anyone's weights. That is the version
that can be defended to a parent.

### The honest public claim

> A research grounded coaching system with a persistent per family memory and
> closed learning loops, that can search its own evidence base when a question
> needs it, and where every new source passes a human.

That survives a hostile expert reading it. "Truly agentic" still does not, and
will not until DiGi can act rather than only look.

---

## Known soft spots

Kept here on purpose. A list of what is weaker than it looks is worth more than a
page that only describes the good parts.

- **Semantic retrieval needs `EMBEDDING_API_KEY` and a backfill.** With neither,
  everything silently falls back to the keyword scoring, which looks identical
  from the outside. `/api/cron/knowledge-embed` reports counts for exactly that
  reason. Check them rather than assuming.
- **`digi_wisdom.evidence_count` is the model's own estimate** of its evidence,
  parsed from the JSON it returns, not a counted fact. `getProvenSolutions` floors
  and weights on it, so "proven across families" currently reads harder than it is.
- **The proactive half of the success loop is unbuilt.** Proven solutions are
  available when a parent asks. Offering them unprompted is a separate change.
