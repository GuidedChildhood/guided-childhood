# Email programme, weeks 5 to 7

Justin, 8 August 2026:

> "can we build on top of current emails that go to sign ups and count how many
> weeks we have covered and start adding more around school curriculum and how
> digi learns explaining simply the brain and why it will bring the top provider
> advice by feedback loop and updates from users and more the users we get the
> better the feedback the more we add and learn"

## What is already covered

The signed up sequence lives in `app/api/email/cron/route.ts`, one daily run,
every send guarded by a unique `(user_id, email_key)` row in `email_log`.

| day | email | key |
| --- | --- | --- |
| 0 | Welcome, first script ready | `welcome` |
| 2 | What your stage is about | `day2-stage` |
| 3 | The full tour, every service | `day3-tour` |
| 4 | The 11pm question, DiGi | `day4-digi` |
| 7 | Founder rate, live counter | `day7-founder` |
| 9 | Child's own app | `svc-childphone` |
| 11 | Screen time balance | `svc-screentime` |
| 13 | Lessons | `svc-lessons` |
| 15 | School reminders | `svc-school` |
| 17 | Family agreement | `svc-agreement` |
| 19 | Printables reveal | `reveal-printables` |
| 21 | Balance reveal | `reveal-balance` |
| 23 | Mental health reveal | `reveal-mind` |
| 25 | Passport reveal | `reveal-passport` |

**Fourteen emails, day 0 to day 25. Three and a half weeks.** After day 25 a
parent hears nothing on the lifecycle track again, ever. The weekly digest and
the monthly balance carry on, but those are reports, not the programme.

### The ceiling nobody would have seen

The cron only loads profiles created in the **last 30 days**:

```ts
const since = new Date(Date.now() - 30 * 86400000).toISOString()
```

So anything scheduled past day 30 silently never sends. It does not error and
it does not log. Adding week 5 onward without widening this window would have
produced six emails that look right in the code, pass every check, and reach
nobody. The window moves to 60 days.

## What gets added

Three more weeks, days 28 to 43, taking the programme to **twenty emails and
just over six weeks**.

Cadence drops from every two days to **every three**. A parent four weeks in
has stopped being onboarded, and the second half of a programme that keeps the
first half's pace reads as pressure rather than help.

### Week 5, what the child is actually learning

| day | email | the one idea |
| --- | --- | --- |
| 28 | The eight strands | The lessons walk the same recognised ground schools use |
| 31 | Ahead of the assembly | Where it sits against what school must teach from Sept 2026 |

Grounding, all of it already in the repo:

- `lib/content/curriculum-badges.ts` maps every lesson to one of the eight
  UKCIS **Education for a Connected World** strands and a Key Stage.
- RSHE statutory guidance (July 2025) is compulsory from **1 September 2026**
  and names the new content: pornography harms, incel and misogynistic
  cultures, deepfakes, online gambling, illegal online behaviours
  (`plans/school-readiness-verdict-2026-07.md`).

**The honesty line, held exactly where the code already holds it.** The badge
file says outright that nothing there "claims the family lessons are the school
curriculum" and that the chips are "the signpost that the family version walks
the same recognised ground". The emails say the same and no more. A parent who
believed their child had covered the school's scheme, and had not, would find
out in the worst possible way.

### Week 6, how DiGi thinks and how it learns

| day | email | the one idea |
| --- | --- | --- |
| 34 | What DiGi is doing when it answers | The brain, in plain words |
| 37 | It learns from what worked | The loop, and the human gate on it |

Grounding, all real code:

- Not a chatbot guessing: retrieval over a research bank
  (`app/api/cron/knowledge-embed`), calibrated to the child's stage, and it
  never allows or denies, it returns a pathway (non negotiable 1).
- `app/api/cron/knowledge-refresh` reads **what parents have actually been
  asking**, drafts candidates from credible researchers, and drops them in a
  review queue as PENDING. Nothing goes live until Justin approves it.
- `lib/digi/wisdom.ts` `rebuildWisdom` reads the three places a success is
  recorded: a concern a family marked resolved, a script a parent said worked,
  and their own written feedback in `digi_feedback`.
- `getProvenSolutions` weights a pattern by `evidence_count`, so something that
  has worked across many families leads. Deliberately **not** a rule: the code
  comment calls it "a good place to start and not a verdict".

### Week 7, why more families makes it better, and the checks

| day | email | the one idea |
| --- | --- | --- |
| 40 | Your answer helps the next parent | The flywheel, and the ask |
| 43 | Who checks the checker | Weekly MOT, monthly review, published |

- The ask is real and it has a real door: DiGi asks whether something worked
  and the reply is saved to `digi_feedback.parent_response`
  (`app/api/digi/feedback`), which is the exact input `rebuildWisdom` reads.
  This email is where the programme finally asks the parent for something,
  after six weeks of only giving. That is the right order.
- `app/api/cron/digi-quality` runs the full eval suite every Monday and emails
  the verdict even when clear. `app/api/cron/answer-review` critiques a closed
  month. Saying so is the difference between claiming DiGi is safe and showing
  the machinery that would catch it if it were not.

## Rules being followed

- No dashes in any copy. Not one.
- Justin's voice: warm, plain, direct, one idea per email, one door.
- Every claim traces to code or to a cited document. No invented capability.
- Each email sends once, guarded by `email_log`, same as the existing fourteen.

## Not doing

- **No migration.** `email_log` already takes any `email_key`.
- Not touching the pre signup lead teasers. Different audience, different job.
- Not adding a preferences centre. Worth doing, not this change, and the
  cadence drop plus the existing unsubscribe covers the pressure risk for now.
