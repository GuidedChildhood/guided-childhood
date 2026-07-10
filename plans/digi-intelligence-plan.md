# DiGi Intelligence Plan

How DiGi becomes visibly, defensibly smarter over time. No foundation model
training. The moat is the system around the model: memory, retrieval, your
voice, a safety layer, evals, and community learning. This is a thinking
document, not a commitment. Nothing here is built yet.

## The honest framing

We are not building our own foundation model. That is tens of millions of
dollars and not our business. What we build is a proprietary system that a
competitor cannot copy: our family data plus outcomes, our retrieval, our
voice, our safety gate, and our evals. To a parent that combination *is*
"DiGi's own intelligence." It just is not a model we trained.

Also: Codex is the wrong tool. Codex and the GPT "codex" modes are coding
agents. For parenting insight the relevant models are the normal chat models,
Claude and GPT. When this plan says "second model" it means a chat model,
possibly from a second provider, used as a verifier or a router, never Codex.

## What already exists (the baseline)

Worth stating so we build on it, not over it.

- **Family memory.** `digi_memory` table. After each exchange DiGi extracts one
  durable memory. `getFamilyMemory` injects the last dozen into every prompt
  (`lib/digi/brain.ts`). This is the single most important asset already in
  place.
- **Retrieval over an evidence base.** `expert_knowledge` table plus
  `getExpertKnowledge`, a keyword and age band relevance scorer that pulls the
  relevant research slice into the prompt and asks DiGi to cite the source.
- **A feedback loop.** `digi_feedback` stores the reflective question DiGi ends
  every reply with, and the parent's answer, so DiGi learns the family over
  time.
- **Proactive triggers.** `findTriggers` in `brain.ts` turns real family data
  into reasons for DiGi to speak first, not only react.
- **Model abstraction.** `DIGI_MODEL` is an env value with an ordered fallback
  list (`lib/config/digi.ts`). Currently all Anthropic. This is the seam a
  router and a second provider slot into.
- **Prompt caching, ban guards, voice and research base** baked into the static
  system prompt.

So DiGi is already more than a chatbot. The plan below sharpens each layer and
adds the two that are missing: evals and a safety verifier.

## The phases, in order of impact

Each phase ships on its own and makes DiGi visibly smarter. Do them in order.

### Phase 1 — Sharpen memory and retrieval (biggest win, lowest risk)

The 80 percent. Make DiGi feel like a professional who knows your family.

- **Better retrieval.** Replace the keyword scorer in `getExpertKnowledge` with
  embeddings (pgvector in Supabase). Same for scripts and lessons: retrieve the
  most relevant curriculum for any question, not just an age band match. This
  is what makes answers on brand and citable instead of generic.
- **Structured, durable memory.** Promote `digi_memory` from a flat list to
  typed memory: the children and ages, the live concerns and their arcs, what
  has been tried, what worked, what did not. Inject the relevant slice, not the
  last twelve rows. Add a light summarisation pass so memory does not grow
  unbounded.
- **Outcome links.** Connect a DiGi answer to what happened next: a script
  completed, a concern marked improving, a return the next day. This is the raw
  material for Phases 4 and 5.

Cost: low. Risk: low. This alone is most of "super intelligent."

### Phase 2 — Evals (you cannot improve what you cannot measure)

Before adding models, define good.

- A held out set of real, de-identified parent questions with a rubric: on
  voice, evidence grounded, calibrated pathway (never allow or deny), safe,
  ends on one concrete action.
- Score every change against it. This is what lets us swap models, add a
  verifier, or fine tune later and *know* it got better rather than hope.
- Wire the `digi_feedback` and outcome signals into a simple quality dashboard.

Cost: low. Risk: low. Unlocks everything after it.

### Phase 3 — The safety and quality verifier (where a second model earns its place)

The genuinely valuable use of "two AIs," a draft then check gate, not two
chatbots chatting.

- One model drafts the reply. A second model checks it against the non
  negotiables before it reaches the parent: never allow or deny, always a
  calibrated pathway, Justin's voice, no crisis mishandled, data minimisation.
- The verifier can be a second provider (GPT checking Claude, or the reverse),
  which catches failure modes a single model shares with itself.
- Reserve it for the replies that matter: anything flagged safety, crisis, or
  low confidence. Not every message, for cost and latency.

For a product about children, this verifier is worth more than raw
intelligence. It is the feature that lets us honestly say DiGi double checks
itself.

Cost: medium (2x on the gated share of calls). Risk: medium. High trust value.

### Phase 4 — Model routing

Now that evals exist and the seam is proven.

- Turn `DIGI_MODEL` into a router: a fast cheap model for simple replies, a
  frontier model for hard or sensitive ones, mixed providers where one wins on
  evals.
- Route on message type, not at random. Measure cost per useful answer.

Cost: saves money net. Risk: low once evals exist.

### Phase 5 — Community learning (privacy first)

DiGi getting wiser from the whole community, shown as help.

- Aggregate, de-identified: what worked across families at a given stage and
  concern. "Most parents of 11 to 13 year olds found the bedroom rule was the
  turning point."
- Surface it two ways: as guidance inside a DiGi reply, and as social proof on
  the dashboard.
- **Hard privacy line.** This is data about children and struggling families.
  Aggregation must be de-identified, k anonymised (never surface a pattern from
  a handful of families), and transparent to the parent. Get this right before
  shipping any of it. It is a trust and legal gate, not an afterthought.

Cost: medium. Risk: high on privacy, so gate it carefully.

### Phase 6 — Optional fine tune (later, modest payoff)

Only once thousands of DiGi answers are rated helpful.

- Fine tune a *small* model on our curated question and answer pairs and our
  voice. It makes DiGi cheaper and more consistently on brand, not dramatically
  smarter.
- This is a cost and consistency feature, not the strategy. Never the headline.

Cost: medium. Risk: low. Payoff: modest. Do it if the numbers justify it.

## How we demonstrate it to the user

Parents do not care that DiGi talks to Claude and GPT. They care that it helps
their child. Demonstrate outcomes, not plumbing.

- **Memory made visible.** "You told me in March bedtime was the battle. How is
  that going?" One line like that beats any multi model badge.
- **Insight with a source.** "This is drawn from the Cambridge work on the 11
  to 13 window." Insight plus evidence reads as intelligence.
- **Proactive noticing.** DiGi surfaces a pattern on the dashboard the parent
  had not spotted. That is the real insight moment.
- **Aggregate wisdom as guidance.** "3 in 4 families at your stage found this
  was the turning point."
- **Honesty when unsure.** DiGi saying "I am not certain, here is what to watch
  for, and here is when to get a professional" builds more trust than false
  confidence. For our mission, that restraint is the demonstration.

What we do NOT do is advertise "multi model AI" to parents. The framing to the
user is "DiGi remembers your family, is grounded in the evidence, and double
checks itself," never the model plumbing.

## Guardrails that apply to every phase

- Never allow or deny. DiGi always returns a calibrated pathway.
- `DIGI_MODEL` stays a config value. Never hardcode a model.
- Data minimisation: first name and age range only, never surname, school, or
  location. GDPR and COPPA aligned.
- Any cross family learning is aggregated, de-identified, and transparent.
- Every change is measured against the eval set before it ships.

## Suggested build order (one line)

Memory and retrieval (Phase 1) → evals (Phase 2) → safety verifier (Phase 3) →
router (Phase 4) → community learning (Phase 5) → maybe fine tune (Phase 6).

Phase 1 is the one to start with. It is the biggest jump in perceived
intelligence for the least cost and risk, and it is mostly wiring up assets we
already have.
