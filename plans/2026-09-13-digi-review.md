# The DiGi review

Sunday 13 September 2026, the second job of the day. Written on Friday so the
session spends its time fixing rather than finding.

Justin, 11 September 2026: DiGi is "taking too long to answer so sort it out",
and make sure "all guard rails philosophy science data we collect and expertise
we believe in all works well together to give unique tailored advice only we can
give", that "the api it uses the latest model", and that it is an "agentic super
adviser in our expertise".

## The headline: it is not mainly slow, it is silent

Measured from the `digi_latency` table on 11 September 2026, sixty days:

| | |
|---|---|
| median answer | 4.2 seconds |
| slowest one in twenty | 5.7 seconds |
| worst | 6.7 seconds |
| **messages that returned nothing at all** | **10 of 35** |

Four seconds is not great and it is not the complaint. Ten messages in sixty
days produced an empty screen. Every single one of them was in the `family`
lane, and eight of the ten had a tool call fire first.

The family lane is 15 messages, 10 of them empty. **Two thirds of the questions
a parent asks about family life around the child get no answer.** The parenting
lane is 20 messages and has never once failed.

A parent who asks how to word a note to the head teacher watches it spin and
gets nothing. That reads as slow. It is worse than slow.

The code already noticed this. There is a comment at `app/api/digi/route.ts`
about four failed messages on 19 August, all family lane, all tool fired, and
the `failure` column was added to catch the next one. It caught six more, the
last on 5 September, and every one is recorded as the fallback reason `empty`,
which means none of the named failure branches fired. The reply simply came back
with no text in it.

**Fix this first. Nothing else on the list matters as much.** Start at the tool
continuation in the stream, because eight of the ten went through it, and at the
family lane prompt, which is the only prompt that tells DiGi it may "end cleanly
with no marker and no question".

## The model ladder is one generation behind

`lib/config/digi.ts` today:

| setting | now | should be |
|---|---|---|
| `DIGI_MODEL` | `claude-fable-5` | `claude-fable-5-1` |
| fallback 2 | `claude-opus-4-8` | `claude-opus-5` |
| fast tier | `claude-haiku-4-5-20251001` | `claude-haiku-4-5` |

The fast tier carries a date suffix that should not be there. The ladder itself
is honest about being a config value, which is why this is a one line change and
not a rewrite. Confirm the ids against the Models API on the day rather than
trusting this table.

## Where I disagree with the obvious move

The obvious move is to point DiGi at Fable 5.1 because it is the most capable
model. **That would make the answer slower, not faster.**

Fable 5.1 thinks on every request and cannot be told not to. Hard questions can
run for minutes. It is the right model for a weekly review that nobody is
watching, and the wrong one for a parent standing in a kitchen at bedtime.

What actually gets the answer down:

1. **Effort.** `output_config: { effort: 'low' }` or `'medium'` for chat.
   Nothing in this codebase sets effort anywhere, so the whole platform is
   running at the default of high. This is the single biggest lever and it is
   free.
2. **Fast mode for the chat lane.** Opus 5 will run up to two and a half times
   faster on output for a premium price, and it is the only model tier that
   offers it. Fable cannot do fast mode at all.
3. **The 1.3 seconds before the model is even called.** Auth, first gather,
   lane, second gather and prompt build cost 1,301ms on average, in sequence.
   The lane call is a whole model round trip at 334ms. Some of that can run in
   parallel with the rest and some of it can be cached.

So the recommendation is a split, not a swap: **Opus 5 with fast mode answers the
parent, Fable 5.1 does the thinking nobody is waiting on** (the weekly review,
the insights, the wisdom pass, the evals). That is the opposite of one model
everywhere, and it is what makes DiGi feel instant and still be the deepest
adviser in the category.

Caching is already in place: the static system prompt carries `cache_control`.
Nothing records whether it is actually hitting. Add `cache_read_input_tokens` to
the latency row, because a cache that silently stopped working looks exactly like
a model that got slower.

## The audit Justin actually asked for

Walk each of these and prove it reaches the prompt, rather than assuming it does
because the file exists. For each one, the test is the same: change the input,
ask DiGi, and see the answer change.

| what he named | where it lives | the question to answer |
|---|---|---|
| guard rails | `lib/digi/safety.ts`, the crisis and safeguarding openers | Does a crisis line reach the screen before the model speaks, every time |
| philosophy | `digi/01-philosophy.md`, the never allow or deny rule | Does any reply ever land on a yes or a no |
| the science | `expert_knowledge`, `lib/digi/wisdom.ts`, `lib/digi/knowledge-embed.ts` | Does a named researcher's finding change the answer, or is it decoration |
| the data we collect | concerns, ratings, jobs, lessons, devices, the passport | Does a worry at two stars produce a different answer than the same worry at five |
| the expertise | the scripts library, the stage model | Does the reply point at a real script row that exists |

The pass condition for the whole audit is one sentence: **an answer DiGi gives a
family who have used the product for a month should be impossible to get from a
general chatbot.** If a reply would read the same with none of our data attached,
the wiring is decorative and the audit has failed.

## The agentic question

`lib/digi/tools.ts` is 423 lines and the tool loop already runs. Two things to
check before adding anything:

1. The tool continuation is the prime suspect for the ten silent replies, so
   more tools on a broken loop is more silence.
2. Forced tool choice is rejected on Fable 5.1. If any call sets `tool_choice`
   to `any` or a named tool, it returns an error on the new model. Grep for it
   before switching the ladder.

Agentic is not more tools, it is DiGi finishing the job: reading the child's
actual week, choosing the script, opening it, and marking the pathway. Most of
those pieces exist. The work is joining them, after the loop is trustworthy.

## And the screen itself

From Justin's screenshot of the DiGi tab on a phone, two visible faults to check
at 390:

- The eyebrow "YOUR EVIDENCE LED GUIDE" runs under the status bar and off both
  edges. It needs the safe area inset and it needs to not be full bleed.
- The suggested question chip is cut off at the right edge mid word. Chips
  should wrap or scroll inside their own box, never leak off the page.

Both are look and feel, so they can ride with the parent UX pass rather than
this one. `scripts/check-mobile-overflow.mjs` should have caught the chip. Find
out why it did not.

## Order of work

1. The ten silent replies. Reproduce, root cause, fix, guard.
2. The model ladder, one line, plus a grep for forced tool choice.
3. Effort on the chat path, and fast mode behind a config flag.
4. The 1.3 seconds of pre work.
5. The five row audit above.
6. Record `cache_read_input_tokens` so this is measurable next time.

The gates are unchanged: `npx tsc --noEmit`, `npx next build`, `npm run wiring`
at zero new, the dash grep, and the DiGi evals in `lib/digi/evals.ts` before and
after, because a latency change that quietly makes the answers worse is not a
win.
