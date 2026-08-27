# The Story of Guided Childhood

**What this file is.** The one document that holds the whole picture: what this
product is, why it exists, what has been built, how it works, how it makes
money, and how it grows. Written 15 August 2026, nine weeks into the build.

**How to use it if you are Claude.** Read this before building anything. It
tells you what exists so you do not rebuild it, what the philosophy forbids so
you do not break it, and where everything lives. When this file and the code
disagree, the code is right and this file needs updating. Append to the
timeline, update the numbers, and keep every file path real. The deeper log of
every decision is `plans/decisions.md`, append only, 320 entries and counting.

**How to use it if you are human.** Read the first three sections and stop.
That is the pitch, the customer and the promise. The rest is the machine room.

---

## 1. The story in one line

We get children to sixteen ready for a phone and social media, ten minutes a
day, with the parent and child working on it together instead of fighting
about it.

Said at the school gate: *it is a bit like Duolingo, but for getting your kid
ready for a phone, and it gives you the actual words for the arguments.*

## 2. The problem, in parents' own words

Mined from Mumsnet, app store reviews and UK surveys on 8 August 2026, the
full sweep is in `research/homepage-audience-language.md`. The one sentence
version:

> Parents are exhausted by a fight they have every single night, guilty
> because they handed over the phone themselves, and nobody has ever told them
> what to do instead of just taking it away.

The strongest recurring feeling is **policing without a plan**. Verbatim:
"It's utterly miserable constantly policing screen time." Nine in ten parents
argue with their kids over screen time. 54 percent regret giving their child a
smartphone. 47 percent feel their child knows more about technology than they
do. And the tools they tried, Qustodio, Bark, Family Link, earn reviews like
"a huge waste of money time and energy", because blocking software makes
today's decision for the parent and teaches the child nothing for tomorrow.

**The perfect customer.** A UK parent with a child aged 2 to 16 (Justin,
18 August 2026), the heart of the market being primary age, who can feel the
cliff edge coming: at some point the phone arrives, social
media goes live, and nothing they did before that felt like preparation. They
have tried an app that promised control and delivered arguments. They read
Good Inside and follow the Smartphone Free Childhood conversation. They do not
want a ban and they do not want surrender, they want a plan. They will repeat
one sentence to another parent if we give them one worth repeating.

## 3. The philosophy

Five commitments, and every feature either honours them or does not ship.

1. **Never allow or deny.** DiGi never answers a question with yes or no,
   permitted or forbidden. Every answer is a calibrated pathway: here is where
   you are, here is the next step, here are the words. This is non-negotiable
   number one and it is enforced in the prompt rails, not by hope.

2. **Connection is the protection.** The trust framework
   (`digi/07-trust-framework.md`): a child who trusts their parent is more
   protected from every digital risk than a child with every parental control
   in existence. Repair over punishment, curiosity before consequence, the
   open door, modelling over monitoring. Forty years of attachment research
   sits behind this and it is the lens on every DiGi response.

3. **The positive pathway, not the ban.** The UK under 16 social media ban
   frames the whole market, and we are deliberately ban neutral: a deadline is
   not a plan. The product is the plan. A config flag, `social_media_law`,
   lets Stage 4 content adapt to whatever the law does without a rewrite.

4. **Three kinds of time, and the child is a participant.** A small core of
   time is theirs unconditionally (parent set, so the screen never becomes
   the ultimate prize), extra time is earned through jobs and chores at a
   per child star rate, and protected time (bedtime, mealtimes, school
   hours) cannot be bought at any price, though a start inside it always
   goes to the parent as an ask, never a flat no. Family jobs sit outside
   the economy entirely, because contribution is belonging, not payment.
   The ladder runs parent regulation, then shared, then self regulation,
   and the objective is to make the system unnecessary. This is the
   mechanic nobody else has, evidenced end to end
   (content/packs/2026-08-26-star-system-evidence/), and it is what makes
   the child's side a product rather than a report.

5. **Evidence or silence.** No invented studies, no made up numbers, no
   composite scores. Every curriculum objective carries a source or it cannot
   be inserted at all (migration 108 makes `source` NOT NULL, deliberately
   awkward). The internal test for public claims: defensible to a hostile
   expert.

## 4. The science, honestly stated

- **The measurement spine.** A parent names concerns, scores them 1 to 10,
  and the first check in is the baseline every later number is measured
  against. `concern_events` stores the journey. No overall family score is
  ever computed, because a parent asking "where did that number come from"
  deserves an answer we can give.
- **The teaching spine.** Lessons follow the Rosenshine arc: retrieval
  starter, teach, practise, prove with real choice questions, recap. The
  player computes a real 70 percent pass from the choice slides, so a lesson
  cannot be passed by tapping through.
- **The curriculum spine.** 448 objectives for England Years 1 to 6 in DfE
  verbatim wording, each with a mandatory source, with the national
  checkpoints flagged (phonics screening, multiplication tables check, SATs).
  The schools scheme is built on the Education for a Connected World framework
  and the 2025 RSHE guidance.
- **The research loop.** DiGi's knowledge bank grows through a research
  updater with a human gate: the model drafts candidates with web search,
  Justin approves on `/dashboard/insights`, and only then does it go live.
  The bank grounds DiGi, it does not cap it.
- **What we do not claim.** We can say what Year 4 covers nationally. We
  cannot say what one school teaches this week, and the code refuses to guess
  (`lib/learning/digi-context.ts`). We hold no assessment data on children
  and the learning surface says so out loud.

## 5. The timeline, nine weeks

The full log is `plans/decisions.md`. The arc:

| When | What happened |
| --- | --- |
| 13 June 2026 | Week 1 kickoff. A waitlist homepage and a plan. |
| Late June | Platform and schools architecture. The stage model, ages 4 to 16. |
| Early July | The content engine: STORM research pipeline, verified briefings, the viral post anatomy (best post 73,911 impressions). Positive pathway doctrine locked. |
| 3 July | Two sessions built the same phase twice. The multi session sync rules in CLAUDE.md date from this. |
| 6 to 7 July | The full schools curriculum ships: lesson engine, teacher dashboard, the hub, the premium schools site. |
| 10 to 13 July | Trial model (two doors), DiGi intelligence pass, the quest economy with its own bank, script sessions covering ages 0 to 16, printables ship, the passport becomes a flip book. |
| 16 July | The Good Inside simplicity pass across the platform. DiGi renamed. Email funnel confirmed in house on Resend. |
| 20 July | **Go live day closed out.** Etsy channel greenlit the same evening. |
| Late July | The child app deepens: five a day, La Casita games, character art, the learning sheets, the curriculum connector. |
| 1 August | DiGi's precedence order, the retrieval floor, DiGi becomes an agent within a fence. `digi/00-how-digi-works.md` written. |
| 6 to 8 August | Planet Friends earning, the star chart habit, the email programme reaches six weeks, the privacy policy contradictions found and fixed, homepage rebuilt around one message. |
| 9 August | The split: schools becomes its own app on its own domain, sharing one token package. "Guided Childhood is not by The Social Billboard." |
| 11 to 12 August | The private tutor phase 1 (homework in, real lesson out). The screen moments join the moments library. One email a week from all systems, enforced in code. Erasure that sticks. |
| 13 to 14 August | The paywall placement found and fixed (nobody was ever asked to pay). The first check in becomes the baseline. A separate Stripe account for Guided Childhood, decided and set up. What is working leaves the passport. |

By the numbers: 215 database migrations, roughly 850 pull requests, an 8,151
line decision log, two live apps plus a schools app, and one founder doing all
of it with Claude.

## 6. The product map

Three surfaces, one database, one design language.

### The parent app (`app/(dashboard)`)
Home is the daily page: one clear lead a day picked by `lib/home/next-up.ts`,
a Duolingo style winding path (`components/daily/TodayPathBig.tsx`), the
rotating bonus, the school chest beside the road. Behind it: the check in
(`components/daily/ConcernCheckIn.tsx`, 1 to 10 per named concern, first one
is the baseline), moments (`components/daily/MomentTimeline.tsx`, the day as
tappable tiles, each flagged moment becomes a concern), scripts (the words
for every hard conversation, stored in the database, five free), the lessons
hub, the homework decoder and private tutor, devices (per screen setup
guides), quests management, printables, the passport flip book, and DiGi.

### The child app (`app/k/[token]`)
Token link, no login, no account. Jobs earn stars, stars become minutes,
minutes per star at the child's own rate (5 by default) with a weekly cap, the chores gate, a free daily core when the parent turns it on, and protected windows no stars can buy. Five a day, the quest
board where a child can pitch their own quest, lessons in the shared player
with their chosen buddy and colour, Planet Friends earned by streaks, games,
printables and the paper chart as a first class no device route.
**Zero model calls on the child's side, ever**, enforced by a guard script.
Nothing buzzes a child's phone at night.

### DiGi (`digi/`, `lib/digi`, `app/api/digi`)
Claude wrapped in four things a raw model does not have: rails it cannot talk
its way out of, a research base we can point at, a memory of this family that
survives between conversations, and loops that feed back what worked. Model
set by `DIGI_MODEL` (default `claude-fable-5`), never hardcoded, with a
fallback ladder and a router that spends the deep model only where judgement
matters. Every reply streams through a dash stripping filter and past a
safety verifier. Free accounts get three messages a day, which is the paywall
doing its job gently. The canonical write up is `digi/00-how-digi-works.md`.

### The schools app (`schools/`)
Its own Next app, its own Vercel project, built for
`schools.guidedchildhood.com`. An open catalogue with no login as the land
grab, zero prep lessons, the hub for DSL, CPD, policy and RSHE mapping.
Priced in bands from £495 to £1,995 a year (roughly £2 per pupil, against
Jigsaw at £795 entry), paid on invoice, not card. The real value of a school
is distribution: one 300 pupil primary is 250 families with the school's
endorsement attached.

### The email system (`lib/email`, `app/api/email`)
In house on Resend. One row per address, a six day floor between programme
emails enforced inside `sendEmail` itself, so **one email a week from all
systems** is a property of the platform rather than a policy. Address
aliasing (`identityKey`) stops a lead nurture email chasing someone who
signed up under a different alias. Suppression survives account deletion so
a forgotten parent can never rejoin a drip. Six week lead programme, welcome
on signup, service drip, weekly review.

### The content and commerce layer (`content/`, skills)
The printables engine (Etsy channel, greenlit 20 July), the lesson video
pipeline, the content engine and viral post skills for LinkedIn, the family
social skill for Instagram and Facebook, the ban series framing. All of it
feeds the same funnel.

## 7. The clever things

The mechanisms that are load bearing and easy to break by accident. Do not
simplify these away.

- **The founder cap is counted in Stripe, not in our database.** The checkout
  route counts seats held (active or trialing) before letting anyone through,
  so the public counter and the gate can never drift. Corollary: the Stripe
  portal must never allow plan switching, or the cap becomes decoration.
- **The email floor fails open and lives inside `sendEmail`.** No caller can
  forget it. `MIN_DAYS_BETWEEN_PROGRAMME_EMAILS = 6`.
- **`hasFullAccess` and `hasPaidPlan` are different questions.** Access grant
  versus payment record. The paywall bug that hid the payment ask for weeks
  was these two being conflated. `lib/access.ts`.
- **Deletion suppresses first, deletes second.** If suppression failed after
  the delete, a forgotten parent would be back on the mailing list with no
  account left to tell us they existed. `app/api/account/delete/route.ts`.
- **One counting function for the child's currency.** `streakCurrency` feeds
  the sticker book, the road, the celebration and the printed poster, because
  the day two surfaces disagreed a child was shown Friends they had not
  earned.
- **Scripts live in the database, not the app.** The `scripts` table is the
  product's voice and it updates without a deploy.
- **Provenance is mandatory.** Migration 108: an objective without a source
  cannot exist. The same approval gate covers everything researched.
- **The child side has no model.** A guard script fails the build if an
  Anthropic import appears under `app/k`, `app/api/kid`, `lib/kid` or
  `components/kid`. Generation happens on the parent's side, once, stored.
- **`SITE_URL` is written down once** (`lib/config/site.ts`), because three
  files disagreeing is how a wrong domain sat unnoticed in the sitemap.
- **The dash rule is mechanical.** DiGi's stream strips dashes as it goes.
  The voice is a system property, not a hope.
- **British English by one rule** for every spoken line, and the type scale
  moves by rule, not by hand.
- **Quiet hours are absolute.** Nothing buzzes a child at night, ever.

## 8. The tech stack

Next.js 16 App Router, React 19, TypeScript. Supabase (Postgres, auth, RLS,
215 migrations). Stripe (subscriptions, four day trial, webhook on four
events). Resend for email, web push for notifications, GSAP for motion,
pdf-lib and print CSS for the paper layer, Playwright for browser checks.
Tailwind 4 with a single shared token file (`shared/tokens.css`) that both
apps import, butter gold on cream, Nunito display, IBM Plex Mono labels,
chunky 16px radius buttons with the 5px drop shadow. Anthropic SDK for DiGi
only, parent side only. Monorepo: the parent app at root, `schools/` as its
own app, `shared/` as the common package. Vercel hosts three projects; the
duplicate parent project (`guided-childhood-app`) is debt scheduled for
retirement, `guided-childhood` is production.

## 9. The business model, and the path to £4,000 MRR

**Prices.** Founder £7.99 a month, capped at 50 for ever, cap enforced in
code. Standard £12.99 a month. Annual £99. Free tier: four day trial, three
DiGi messages a day, five free scripts, the starter pack. Schools £495 to
£1,995 a year on invoice.

**The paywall.** One block, shown after the first check in, when the parent
has given something and seen something back. Two doors: Founder with a card
now (four day trial, then £7.99 held for ever), or free trial with no card
into the capped tier. Nobody is walled off from the daily loop; the wall
stands between the free taste and the full product.

**What £4,000 MRR is.** Roughly 325 paying families: the 50 founders
(£399.50) plus about 280 standard (£3,637). Every £795 school knocks about
£66 a month off that requirement, but schools are slow money and are treated
as distribution, not revenue.

**The route there, in order.**
1. The funnel already built: every CTA routes to `/starter-pack`, the three
   question stage check with no signup. The hook, used everywhere, identical:
   *What stage is your child? Three questions, no sign up.*
2. At the observed benchmark of 4 percent free to paid, 325 payers needs
   roughly 8,000 stage checks. That is the whole game: parents to the stage
   check, the email programme and the product do the rest.
3. Channels in switch on order (`plans/DISTRIBUTION-PLAYBOOK-step-by-step.md`):
   Justin's own LinkedIn (a proven 73,911 impression format exists), parent
   groups, the share loop, then paid parent creators capped at £1,000 total
   and only after free traffic converts, then search pages, then schools.
   The money rule: never pay to find out if something works, only to scale
   something proven.
4. The retention spine: one clear thing a day, the weekly review, the
   passport filled in with the child, and the star quest making the child a
   participant. A parent who sets up the star quest has brought their child
   in, and that family stays.

## 10. The marketing story we tell

The pitch is the loop: *you tell it what actually went wrong today, it gives
you the one thing to do and the words to say, and you watch the number move.*
We are not parental controls, and we say so plainly. The star quest leads
every list of what is inside, because it is the only piece competitors do not
have. The Duolingo comparison does the explaining. The proof path for every
claim is the product itself: the stage check is showable in fifteen seconds.

Voice: Justin's. Warm, plain, direct, no dashes, no AI phrasing. The content
engine skills hold the formats; the hidden thread filter keeps the mission in
one post out of ten rather than every post.

## 11. The simplification agenda

Where the product should get simpler, not bigger:

- **One word for one thing.** "Pathway" has meant both the stages road and
  today's list; it caused a wrong build. Rename the road route, keep "today"
  for the daily loop.
- **One picker.** The daily lead and the bonus both come through
  `lib/home/next-up.ts`. Extending it is allowed; a second picker is not.
- **Date of birth, asked once at signup.** Derives the band, the school year
  and the checkpoints, and deletes a setup step.
- **One Vercel project for the parent app.** Retire the duplicate.
- **One reference document.** This file. CLAUDE.md routes here first.
- **A page does one job.** Home is today. The passport is the record. The
  what is working dashboard is the payoff. The road is the journey.

## 12. Open work, honestly

The live list, so nothing hides:

- Wire the new Stripe account (env swap done or in progress, then the end to
  end payment test on a clean address; the checkout route still needs its
  try/catch so failures stop being blank 500s).
- The welcome email rewrite (brief in
  `plans/setup-quest-and-the-first-check-in.md`), then back to school and
  founder offer emails.
- The Setup Quest reshape, the baseline leading every first visit.
- The child link domain fix (two components still build from
  `window.location.origin`).
- The passport page with pastel tabs; the what is working dashboard.
- Schools: attach the subdomain, flip robots to index, pricing page and
  invoice request form.
- Compliance month one: ICO registration (Justin, personally), the DPIA,
  processor DPAs, solicitor review. `plans/go-live-safety-checklist.md`.
- The content gap: Years 7 to 11 curriculum, the coaches phase, the mobile
  wrap.

## 13. House rules

The ten non-negotiables live in `CLAUDE.md` and are not repeated here in
full. The five most often at risk: never allow or deny; `DIGI_MODEL` is
config; no dashes in any copy; scripts live in the database; founder cap
enforced in code. Check both phone and desktop in a browser before calling
any UI done. Report to Justin in three things and stop.

---

*Update this file when the facts change. It earns its place by being true.*
