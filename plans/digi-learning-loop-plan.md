# DiGi's learning loop: the plan, and the legal work it needs

Written 28 July 2026 from Justin's brief. He asked three things: is it possible,
how do we get it across to users, and how does pricing work. Plus: be cautious
on mental health, and give me the legal requirements step by step so I can make
sure everything is in place.

Short answer to the first: yes, and more of it is built than you would think.
The engineering is the easy half. The half that decides whether this becomes the
company's moat or its ending is on page two.

**I am not a lawyer.** Everything in the legal section is the structure and the
questions, written so a solicitor can price and confirm it quickly rather than
start from nothing. Do not ship the child facing parts of this on my say so.

---

## 1. What Justin asked for

1. DiGi offers **three possible replies** for a moment.
2. Parent taps one. We show it. They come back and pick another, or pick
   **other** and write their own.
3. DiGi works out the best answer using **Dr Becky style logic and the rest of
   the evidence bank**.
4. The written in replies are **kept**, and offered as options in future
   scenarios for families like this one.
5. Age aware, so what works for an eight year old is not offered for a fifteen
   year old.
6. Over time DiGi sees **patterns in behaviour and wellbeing**, and check ins
   confirm what actually worked.
7. **Reporting** across all of it.
8. **Polls** and anything else it learns, linked to solutions.

---

## 2. What already exists

This matters, because it changes the plan from "build a learning system" to
"close the loop on one that is already running".

| Table | Rows | What it already does |
| --- | --- | --- |
| `digi_wisdom` | 45 | topic, age_band, what_works, evidence_count. **Aggregate and de-identified: no user_id, no child_id.** This is already the "what works for this age" bank |
| `digi_feedback` | 35 | per family: question, parent_response, digi_insight |
| `digi_memory` | 41 | per family memory, with embeddings, so DiGi can recall by similarity |
| `expert_knowledge` | 71 | the evidence bank, human gated via `expert_knowledge_candidates` |
| `wellbeing_checks` | 25 | per child: mood, sleep, social, screen mood, open communication, concern level |
| `community_polls` | 13 | monthly polls with options |
| `digi_insights` | 14 | generated summaries across questions |
| `digi_weekly_reviews` | 5 | weekly per family |

`lib/digi/brain.ts` and `lib/digi/wisdom.ts` already feed `aggregateWisdom` and
`whatWorked` into every DiGi prompt. The learning loop is live. It just has no
front door: nothing asks the parent to choose between options, and nothing
captures what they wrote instead.

**The single most important thing already right:** `digi_wisdom` learns at the
level of *what advice works for an age band*, not *what this child is like*.
That is the design that keeps this on the safe side of the line, and it happened
before anyone was thinking about the law. Protect it.

---

## 3. What to build

### Phase A: the chooser (small, no new risk)

A moment offers three replies. Each is tagged with which evidence it comes from.
The parent taps one, or taps **Other** and writes their own.

New table `reply_options` (the three we offered, and why) and `reply_choices`
(what the parent picked, or typed). Keyed to the moment and the age band.

Two things to get right:

- **The written reply is the gold.** A parent typing their own words is telling
  us our three were wrong for their family. That is the highest value signal in
  the product and currently we throw it away.
- **"Did it work?"** comes later, not immediately. Ask at the next check in, not
  in the moment. A parent who has just defused a meltdown does not want a survey.

### Phase B: closing the loop (the actual learning)

A written reply, once used by enough different families and confirmed as having
worked, becomes a candidate for the three we offer. Same shape as
`expert_knowledge_candidates`: **a human approves before any parent sees it.**

That gate is not optional. Parent written text will contain names, private
detail, and occasionally advice we would never give. It cannot go from one
family's text box to another family's screen without a person in between. Ever.

Aggregation rule: a reply only becomes a candidate at **k anonymity, k of at
least 5** distinct families. Below that you are effectively showing one family's
words to another.

### Phase C: patterns and reporting

`digi_wisdom` grows an evidence count per topic per age band. Reporting reads
the aggregate tables only. Nothing in a report should be traceable to a family.

### Phase D: polls linked to solutions

`community_polls` already exists. Link each option to the script, lesson or
guide that answers it, so a poll result is a route to help rather than a
statistic.

---

## 4. The mental health line, which is where the real care goes

Justin's instinct is right, and here is the precise reason.

**Helping a parent respond well is not regulated. Screening a child is.**

If the product claims to *detect*, *screen for*, *diagnose*, *predict* or *treat*
a mental health condition, it can be classed as **Software as a Medical Device**
under the UK Medical Devices Regulations 2002, which means MHRA registration, a
conformity route, clinical evaluation and post market surveillance. That is a
different company.

The line is drawn by **the claim**, not the cleverness. These are fine:

- "Families with a nine year old who is struggling with handovers often find
  this helps."
- "You have logged three weeks where sleep looked worse. Worth a conversation
  with your GP if it continues."

These are not:

- "DiGi has detected signs of anxiety in Ada."
- "Your child is at risk of depression."
- "Run our assessment to find out if your child has a problem."

The rule I would write into the product: **DiGi describes what the family has
logged and what has helped other families. It never characterises a child.**

For the feed assessment Justin mentioned for worried parents: frame it as *what
is this feed showing them* (a content question, about the platform) rather than
*what is wrong with this child* (a clinical question, about the person). The
first is squarely what the company is for. The second needs a regulator.

Always, and prominently: DiGi is a guide, not a crisis line. That line is
already on the chat screen. Keep it, and make the escalation route to real help
one tap, not a phone number in small print.

---

## 5. The legal work, step by step

Order matters. Several of these must be done **before** the processing starts,
not alongside it.

### Step 1: Confirm ICO registration
Almost certainly required as a data controller. Annual data protection fee,
likely tier 1. Quick, cheap, and the first thing anyone checks.

### Step 2: Data Protection Impact Assessment, before anything else
**Mandatory here, not optional.** Article 35 requires one for large scale
special category data, for profiling, and for children's data. This hits all
three. The ICO expects it done *before* processing begins.

The DPIA must cover: what is collected, why, the lawful basis, who it is shared
with, retention, the risks to children specifically, and what reduces them.

**This is the document that makes everything else defensible.** It is also the
one an investor, a school, or a journalist will ask for.

### Step 3: Settle the lawful basis, and the Article 9 condition
Two separate questions.

- **Parent's own data:** contract, or legitimate interests, straightforward.
- **Anything about a child's mood, sleep or wellbeing:** this is health data,
  which is **special category** under Article 9. You need a condition on top of
  the lawful basis. Realistically that is **explicit consent**, which must be
  specific, informed, unbundled from the terms, and as easy to withdraw as to
  give.

Note this applies to `wellbeing_checks` **today**, not just to the new work.
Twenty five rows of mood and sleep scores against named children already exist.

### Step 4: The Children's Code
The ICO Age Appropriate Design Code applies to any service likely to be accessed
by children. The kid app plainly is. Fifteen standards, and these bite hardest:

- **Data minimisation.** Collect only what the feature genuinely needs.
- **Default settings high privacy.** Off unless the child changes it.
- **Profiling off by default.** Directly relevant to the learning loop.
- **Detrimental use.** Do not use children's data in ways shown to be against
  their wellbeing.
- **Parental controls: if a parent can monitor a child, the CHILD must be told,
  age appropriately.** This one is frequently missed and is directly relevant to
  the kid app, the timer and the check ins.
- **Transparency.** A privacy explanation a child of that age can actually read.

### Step 5: Age appropriate transparency, for the child
Not a legal footnote, a real screen. What we keep, why, and what their grown up
can see. Written for the age band. This is also, plainly, the right thing.

### Step 6: Processor agreements for the model
Prompts go to a third party model provider. You need the DPA in place, and to
confirm and document that API data is **not used to train** the provider's
models. Also record where processing happens for transfer purposes.

### Step 7: Retention and deletion, decided up front
How long does a written reply live? A wellbeing score? What happens on account
deletion, and does it pull the family's contributions out of the aggregate? A
child's right to erasure is stronger in practice, and "we cannot untangle it"
is not an answer a regulator accepts. **Design the delete path before the write
path.**

### Step 8: The human gate, written down as policy
Nothing parent written reaches another parent without review. That is already
the pattern for `expert_knowledge_candidates`. Make it an explicit, documented
rule rather than a habit that lives in a cron job.

### Step 9: Get it reviewed
A data protection solicitor with children's services experience. With the DPIA
drafted and this structure in place, that is a review, not a project. Far
cheaper than starting cold.

---

## 6. How to tell users, and why it sells

The honest version is the strong version. Nobody else can say this:

> **DiGi learns from what actually works.** When something helps a family with a
> nine year old, it becomes one of the options we offer the next family with a
> nine year old. Not theory. Not one expert's opinion. What worked, in houses
> like yours.

Then immediately, in the same breath, the trust line:

> **We never profile your child.** DiGi learns which *advice* works for an age
> group. It does not build a picture of your child, it does not diagnose, and
> nothing you write is shown to another family unless a human has checked it
> first and stripped anything personal.

That second paragraph is not a compliance disclaimer. It is the differentiator.
Every other AI parenting tool will end up in a data scandal. Being the one that
can explain exactly what it does and does not keep is worth more than the
feature.

Show the growth. "This month DiGi learned 14 new things that worked" is a
better retention hook than any streak.

---

## 7. Pricing

The learning loop changes what the product *is*, and that changes what it can
charge for.

- **The loop itself should not be a paid tier.** It gets better the more people
  use it. Gating it starves it. Everyone contributes, everyone benefits.
- **What people pay for is depth and proof:** the full reporting, the passport,
  the school features, the printables, the history.
- **The real pricing power is time.** A family two years in has a DiGi that
  knows them, and a passport that proves progress. That is the least cancellable
  thing you will ever build, and it argues for annual over monthly, and for
  never deleting a paying family's history.
- **Schools and organisations** are where aggregate insight is genuinely worth
  paying for, and it is de-identified by nature, which is exactly the data you
  can ethically sell. That is the B2B line, and it is the biggest number here.

Do not sell the data. Sell the conclusions, aggregated, with the families' names
nowhere near them.

---

## 8. Suggested order

1. DPIA drafted, lawful basis and Article 9 condition settled. **Before code.**
2. Phase A, the chooser plus capturing written replies. Low risk, immediate
   value, and it starts gathering the material.
3. Consent and transparency screens, parent and child.
4. Phase B, the human gated promotion of written replies, with k of 5.
5. Retention and deletion paths.
6. Solicitor review.
7. Phase C and D, reporting and polls linked to solutions.

Steps 1 and 3 are the ones that feel like a delay and are not. Every later step
gets cheaper and safer because they were done first, and doing them afterwards
means undoing work.
