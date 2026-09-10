# The starter pack: the account goes last

**Justin, 10 September 2026:** "research and don't stop until you rate your work
10 out of 10, only ship when it's impossible to improve, that the starter steps
and click through makes the perfect user want to pay and use the platform, and
that it's not too many clicks and cannot be more efficient and user friendly."

## The finding, in one line

**Every advert we run promises "Three questions. No sign up." The second screen
of the funnel asks for a name, an email and a password.**

`app/page.tsx:305` is the promise, under a button that says Start for free. Tap
it, tap Start on the next screen, and screen two is **Create your account**. A
parent who came for a free stage check meets a password box before they have
been asked a single question about their child.

That is not a nit. It is the funnel's headline claim broken at the first step,
and it is upstream of everything else: THE-STORY §9 puts the whole route to
£4,000 MRR through this one page, at roughly 8,000 stage checks for 325 payers.
Every point of drop here is a point off the top of the business.

## Why it is like that, and why that reason no longer holds

Commit `619150bc`, 10 July 2026: *"Front loaded journey step 4: create the
account on the first click."* The goal was right and still is: the old flow
asked for the child twice, once in the quiz and once in a separate onboarding,
and folding them into one path fixed a real annoyance.

The fix chosen was to move the account to the FRONT. The same goal is served by
moving the account to the END, and that costs nothing: the questions are already
held in state and in localStorage, and `submitEmail()`, the handler from the
older order, is still in the file.

## What the reference apps do

From the Mobbin sweep (iOS, quiz onboarding):

- **Calm Sleep**: six quiz questions, then a personalised recommendations
  screen, then *"Your plan is ready. Unlock it now"* and only then the account,
  as one tap providers with email last.
- **Brilliant**: the questions, then *"Create a free account to discover your
  personalized learning path"*, the ask framed by the reward it unlocks.
- **Life Reset**: twelve questions, then a written personal reading before
  anything is asked of the user.
- **Noom** is the exception and asks early, on the strength of a brand and a
  budget we do not have; even then it is providers and one field, never a typed
  name.

Every one of them puts the personalised result BEFORE the account, and frames
the account as the thing that saves it.

## What the numbers say

- Quiz funnels with an immediate, relevant reward capture **58 to 63 percent**
  of finishers, against **10 to 20 percent** for a landing page form.
- A form asking only for an email outperforms one asking name and email by
  **12 to 18 percentage points**.
- Typical quiz completion sits at **35 to 42 percent**, and above 50 percent
  when the flow is short and clean on a phone.

Sources: emaillistvalidation.com quiz funnel benchmarks 2026, custom.one quiz
funnel guide, kissmetrics conversion benchmarks.

## The change

**Order now:** intro → account → child → worries → time → build beat → reveal.

**Order after:** intro → child → worries → time → build beat → **reveal** →
account.

1. **The three questions come first, with no account.** The promise in the
   advert becomes true.
2. **The reveal is free to read, in full.** It is the sell: the problem named,
   the known problems, the service tabs, the happy news icons, the sticky bar.
   Today it is shown only to people who have already signed up, which is the
   whole persuasion aimed at somebody who has already converted.
3. **The account is asked for at the end, framed by what it saves**, in the
   words of the thing they have just watched being built: "Save Nia's pathway".
4. **Email and password only.** The parent's name goes. It is already recovered
   from the email local part by `dashboard/page.tsx:619` ("justin@..." greets
   "Justin"), so nothing is lost but a field.

Nothing else moves. The birthday stays month and year, for the reasons already
written into the file. The build beat stays exactly as it is. The nine worries
stay. The intro stays, because DiGi arriving first is the thing Justin likes
about it and it costs one tap.

## Click count, before and after

Both are 7 taps, 2 selects and 3 typed fields to the reveal. The difference is
not the count, it is **where the cost falls**: today all three typed fields and
a password are spent before the parent has seen anything at all. After, the
first thing spent is a tap and the first thing received is their own child's
name on a pathway.

## What must never regress

A guard, because this exact thing has flipped once already and nothing failed:

- The account step never appears before the questions.
- The reveal is reachable with no session.
- The account asks for email and password, and not a name.

## Risk, stated plainly

We lose the email of a parent who reads the reveal and leaves. Today we have
their email because we took it at gunpoint before they saw anything, which also
means we do not have the emails of everyone who refused. The benchmark says the
second group is much larger. If it turns out otherwise the fix is a one screen
soft ask on the reveal, not a return to the wall.
