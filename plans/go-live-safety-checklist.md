# Going live safely: what must be in place, and what can follow

Written 28 July 2026, for a launch this week. Not legal advice, and the last
section says who should check it. But this is the honest list.

---

## First, the good news, because it changes the priorities

The wording discipline is already strong, and stronger than most products that
touch this area. Already in the code:

- `lib/digi/safety.ts` carries `DIAGNOSIS_PATTERNS`, regexes that catch DiGi
  stating a diagnosis ("your child has ADHD", "this is depression"), plus
  `hasCrisisLanguage` and `verifyReply`
- `lib/digi/evals.ts` has a `diagnosis-bait` eval that specifically tests DiGi
  refuses to diagnose and signposts a professional instead
- the DiGi prompt says never diagnose, and routes anything that smells of crisis
  to a human: GP, NHS 111, Childline
- `digitalwellbeing` already carries the disclaimer naming Odgers, Orben and
  Scott, and says plainly it is not clinical advice or diagnosis
- the homepage already says **"Worth tracking, not diagnosing"**
- the chat screen already says DiGi is a guide, not a crisis line

That is the medical device question largely answered already. Keep every one of
those and do not let any of them get "tidied up" later.

**So no, the wording is not my main worry.** The worry is the data.

---

## What I am actually concerned about

### 1. Health data about named children, without explicit consent

`wellbeing_checks` holds `mood_score`, `sleep_score`, `social_score`,
`screen_mood_score`, `open_communication`, `concern_level` and free text notes,
against a `child_id`. Twenty five rows already.

That is **special category data** under Article 9 of UK GDPR. It needs a lawful
basis *and* a separate Article 9 condition on top, which realistically means
**explicit consent**: specific, informed, unbundled from the terms, and as easy
to withdraw as to give.

The current privacy policy does not mention special category data at all. That
is the single biggest gap, and it applies to what is running today.

### 2. The kid app is used by children, and nothing tells them

The ICO Children's Code applies. The standard most often missed is the one that
bites hardest here: **if a parent can see what a child does, the child must be
told, in language they can understand.** The timer, the ticks and the check ins
are all visible to a parent. Nothing in the child's app says so.

### 3. Retention is undefined

The privacy policy does not say how long anything is kept. "Until you ask" is
not a retention policy, and it is one of the first things an ICO complaint asks
about.

Everything else is in decent shape.

---

## Before you go live

All five are doable this week. None needs a lawyer first.

### 1. ICO registration

There is exactly **one** thing to register, and it is a fee. No separate
children's registration, no special category registration, no app registration.

Pay the **data protection fee** as a **data controller** at
[ico.org.uk](https://ico.org.uk/for-organisations/data-protection-fee/).

- **Tier 1 (micro)**: 10 or fewer staff, or turnover under £632,000. Comfortably us.
- **£52 a year, or £47 by direct debit** (there is a £5 discount). Fees rose
  29.8% on 17 February 2025, which is where £52 comes from. Tier 2 is £78 and
  tier 3 is £3,763, neither of which applies.
- Fifteen minutes online. Register **the legal entity that is the controller**.
  If Guided Childhood trades through a limited company, register the company,
  not Justin personally.
- Not paying carries a fixed penalty of up to £4,350. That is the only reason
  the cheapest item on this list sits at the top of it.

**The one question on the form that needs a decision:** whether we have a Data
Protection Officer. A DPO is mandatory under Article 37 when core activities
involve large scale processing of special category data. We do process special
category data as a core activity, the wellbeing check ins, but at launch we are
not doing it at large scale. So answer **no**, and name Justin as the data
protection contact. Review that answer as the user base grows, because it is
the thing most likely to change first.

**What is NOT registered, and this is where people get confused.** All of these
matter and none of them get filed with the ICO:

- **The DPIA.** Must be done and kept, because this is special category data
  about children with profiling. It only goes to the ICO if residual risk stays
  high after mitigation, which is Article 36 prior consultation and is not us.
- **The Children's Code.** A code we conform to. Nothing to submit.
- **The record of processing (ROPA).** Kept internally. Watch this one: the
  under 250 staff exemption **falls away the moment you process special category
  data**, so we do need one and small businesses routinely miss that.
- **The privacy policy.** Published, not filed. Already live.

### 2. Add a special category section to the privacy policy
Say plainly: we collect information about your child's mood, sleep and how they
seem, you choose to give it, it is used only to personalise your guidance, and
you can withdraw at any time and we will delete it.

### 3. Explicit consent where the wellbeing data is collected
A checkbox at the point of collection, not buried in the terms. Unticked by
default. Wording along the lines of:

> I am happy for Guided Childhood to keep what I record about my child's
> wellbeing, so DiGi can give better guidance. I can withdraw this at any time
> and it will be deleted.

Store the timestamp and version of what they agreed to. That record is what
proves consent later.

### 4. A child-facing note in the kid app
One short screen, age appropriate:

> Your grown up set this up with you. They can see the jobs you tick and the
> time you spend, so they can cheer you on. They cannot read your messages or
> anything else on your device.

This is a Children's Code requirement and it is also just the decent thing.

### 5. A delete path that really deletes
Account deletion must remove the family's data, including the wellbeing rows.
Test it once on a throwaway account before launch. If deletion cannot be
demonstrated, nothing else on this list matters much.

---

## In the first month

6. **Write the DPIA.** Mandatory for children's data plus special category plus
   profiling. It is a document, not a project: what you collect, why, the lawful
   basis, who it goes to, how long you keep it, the risks to children and what
   reduces them. Draft it and it also becomes the thing you hand to schools and
   investors.
7. **Confirm the processor agreements** with Supabase, Vercel, Anthropic,
   Resend and Stripe. Mostly standard DPAs you accept online.
8. **Get it reviewed** by a data protection solicitor with children's services
   experience. With the above in place it is a review, not a project.

---

## The wording rules, to keep

One line, and it decides the regulatory category:

> **DiGi describes what the family has logged, and what has helped other
> families. It never characterises a child.**

Safe: "you have logged three weeks where sleep looked worse, worth a word with
your GP if it continues".

Not safe: "DiGi has detected signs of anxiety in Ada".

The word to avoid in feature names is anything that promises to find something
wrong with a person: **checker, assessment, screening, test, diagnosis, risk
score.** "Digital Health Check" is fine as it stands because it is about screen
habits and already carries the disclaimer, but do not extend that name to
anything that reads as checking the child rather than the screen time.

For the feed idea Justin raised: frame it as **what is this feed showing them**,
which is a question about the platform, not **what is wrong with this child**,
which is a question about the person. The first is what the company is for.

---

## The honest bottom line

You are closer than you think. The hard part, refusing to diagnose, is built and
tested. What is missing is paperwork and two screens: a consent checkbox, a
child facing note, a retention line, and an ICO registration that costs less
than a weekly shop.

None of that should delay a launch by more than a couple of days, and doing it
now is far cheaper than retrofitting it onto a live user base.
