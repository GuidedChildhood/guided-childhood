# Add job protocol, child app welcome, character art, inactivity nudges

Captured 30 July 2026 from Justin's testing on the parents and child apps.
Nothing in this file is built yet. Findings from investigation are recorded
against each item so the next session does not re-derive them.

## 1. Add job: follow the app protocol for more than one

Adding a single job works. Adding several does not follow the pattern the rest
of the app uses.

What it should do:
- List the jobs as they are added, rather than firing each one off alone
- Let the parent set the schedule per job before anything leaves: every day,
  just today, chosen days
- Only then ping the phone

Today the ping goes before the parent has said when the job repeats, so the
schedule is set after the child has already been told about it.

## 2. No child app: let the parent manage on their own phone

If no child app is set up, the flow should offer a real choice rather than
assuming a child device exists:
- Remind the parent to set the child app up, OR
- Keep it on the parent's phone and manage it there

This matters for young children, and for parents who do not want the app on a
child's phone at all. Both are ordinary cases, not edge cases.

Requirements:
- Must work with the timer either way
- The parent chooses: manage on my phone, or on the child's
- Switchable at any time, never a one way decision at setup

## 3. Child app welcome screen

Two bugs and one improvement.

Bugs:
- The home page flashes up first, then the screen slowly moves to the intro.
  It should open on the intro with no flash of the wrong screen.
- The full intro plays on every open. It should play once.

Improvement, for every open after the first: a short rotating welcome instead
of the full intro. Rotate weekly, on a Thursday.
- Try a printable, with a link
- Check your balance
- Check your streaks

## 4. Character art is hotlinked from someone else's CDN

**Diagnosed 30 July.** `lib/content/stage-characters.ts` line 23:

```
const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'
```

Every stage character's `art` and `cutout` is that base plus a Higgsfield
generation filename. Only `DiGi-star.png` and `Digi.png` exist locally in
`public/digi-squad/`. So Pebble, Orbit, Nova, Cosmo and Bloop all depend on a
third party CDN keeping those exact paths alive forever.

Justin photographed a broken image box where Nova's face should be on the
"NOVA SAYS" card in the child app, which is what that dependency failing looks
like to a child.

Fix: pull the files into `public/` and serve them from our own domain. The
characters are the product's face and cannot rely on an external generation
host. Could not be done in the 30 July session because outbound to external
hosts is blocked in that environment.

## 5. Nudge parents who have not opened the app

**Half of this already exists. Check before building.**

Already built:
- `/api/push/reengage`, a push nudge gated by `last_reengage_push_at` and a
  minimum gap between nudges
- `winBackEmail`, sent as `winback-1` from the email cron

Important distinction found on 30 July: the existing **email** fires on
`state === 'lapsed'`, meaning the trial or subscription lapsed. It is not an
inactivity email. Nothing currently emails a parent simply for not opening the
app for a few days.

So what is missing is the inactivity email, not the whole system. It should
name what they are missing rather than ask them to come back:
- Addressing the balance
- The device set up
- School work
- The briefing system
- Watching the lessons

Reuse the existing gap and opt out machinery rather than inventing another.

## 6. The weekly spotlight: one service a week, forever

A parent buys the whole thing and meets about a fifth of it. The spotlight
fixes that by naming one service a week, in Justin's voice, with the reason a
parent would want it this week rather than a feature announcement.

### It rides inside the weekly digest

Not a second weekly email. The digest already goes weekly, already holds an
unsubscribe, and already has the parent's attention; a second send the same
week is how a list starts opting out. The spotlight is a section inside it.

If it ever needs to stand alone, the registry below does not change, only the
send does.

### A registry, so shipping a feature adds it to the rotation

The point of this is that it never goes stale. Each entry is one service:

```
{ key, title, body, href, cta, eligible(family), addedAt }
```

The digest picks the highest priority entry the parent has not been shown,
records it, and moves on next week. A new feature ships with a registry entry
and enters the rotation on its own. Nothing to remember, no separate campaign.

Rules that make it stay honest:
- Never show the same spotlight to the same parent twice, so a table of
  what has been shown, keyed like the digest already is
- `eligible` gates on the family: no school spotlight without a school, no
  holiday spotlight in term time, no passport spotlight before the child is
  old enough
- Newest first among unshown, so a feature that just shipped is what a parent
  hears about next, which is the whole point of the request
- When everything has been shown, fall back to the highest value ones on a
  long cycle rather than repeating recent ones or going silent

### The content, as Justin listed it

Services already built:
- The passport
- The shop
- The printables
- The scripts library
- The balance tracker
- The lessons
- DiGi itself

Schools, once a school is loaded:
- What the curriculum covers, so a parent knows what is coming
- Age dependent, what is expected of a child this year
- SATs timing, and the stressors to watch for before they arrive. The value
  is being ahead of it rather than reacting.
- Homework loads, and that we help with them
- Task reminders tied to the school week: hockey kit, PE day, instrument,
  trip money
- Routine reminders more generally

Holidays and stars, which Justin called out specifically:
- Stars earned above the weekly healthy limit bank rather than expire, and
  can be spent in the school holidays. It keeps a child enthused through a
  term, and gives the holiday a reward that was earned rather than given.
- Extra device time in the holidays is not a failure. Limits can slacken
  without guilt, and saying so plainly is what keeps a parent sane. This is
  the pathway thesis applied to the calendar, and it is the opposite of what
  every other app tells a parent in August.

Every future feature: one registry entry at ship time.

### Watch out for

- The holiday spotlights need the school holiday data the family already has,
  so they land in the right week rather than the wrong hemisphere
- Star banking was written here as an unbuilt product change. That was wrong:
  `lib/quests/holiday-bank.ts` already does exactly it, time earned above the
  weekly cap, spendable only while school is out, never expiring. It needed a
  spotlight, not a build, and has one.
- Voice: this is a reason to open the app this week, never a changelog

## Order to build

1. Character art local hosting. A broken face in a child's app is the most
   visible of these and the least work.
2. Add job protocol and the manage on my phone choice. They are the same flow
   and should be designed together.
3. Child app welcome. Two clear bugs, then the rotating welcome.
4. Inactivity email. Smallest, and the machinery is already there.
5. The weekly spotlight registry and its digest section. Ship it with the
   services that already exist, then add entries as features land.
6. Star banking for the holidays, and the spotlight that explains it.

## Also outstanding from 30 July, not in this file

- Semantic script matching. Migration 131 is written and applied to nothing;
  the matcher swap, embedding backfill across 233 scripts, moment linking and
  the repeated gap email are all still to build.
- `NEXT_PUBLIC_APP_URL` points at a `*.vercel.app` host in production, which
  sits behind Deployment Protection. Push notifications still deliver nothing
  because of it, and it also builds unsubscribe links, starter pack resolver
  links and every email button URL.

---

# The quests restructure (31 July, from Justin testing on Chrome)

The single most important surface in the product, in his words: adding a child
job or chore has to be effortless. It is not, and the reason is structural.

## What is wrong now

**Manage jobs is a tab, not a page.** The quests screen is one very long
scrolling page with four tabs (manage, rewards, games, share) and manage is
already the default. Tapping it scrolls half a screen and arrives nowhere,
because you were already there. What you land on is two screens of idea chips,
not the thing you came to do.

**The screen time card takes the top of the page** and is not what a parent
opened quests for.

**Nothing shows what needs the parent.** Jobs waiting to be agreed are the one
thing with a deadline attached and there is no count anywhere.

## What Justin asked for

Add a job opens its own page, with tabs:
- Add a job, the new composer, easy
- Jobs waiting for confirmation, the ones the child has ticked
- Jobs waiting for the child to do

Plus:
- Manageable from the board, not only from inside the page
- The screen time card smaller, off to one side, not competing with the main
  quest page
- A red count on the button, like a notification badge, when jobs need agreeing

## Already built, do not rebuild

Checked on 30 and 31 July:
- Adding several in a row: the schedule and band are kept between adds
- Repeats: every day, school days, weekends, just once
- Bands: before school, after school, before bed, now chosen not guessed
  (migration 133, band column, bandForQuest resolver)
- Cancel: removeQuest, a button per job
- schedule_days is an array, so "Tuesday only" is already storable
- The soft guide at five jobs

So the work is layout and navigation, not the job model. The model is done.

## The reference

Superlist, which Justin picked out himself:
- https://mobbin.com/screens/56fef9c7-0c74-48e6-8072-929ff3d8ab52 quick add, chips under the input
- https://mobbin.com/screens/9f3a195c-f97a-465c-b193-260d3a809b4b chip resolves in place, never leaves the card
- https://mobbin.com/screens/ca834342-5966-435e-ad64-76121031a6a9 added items stack, keyboard stays up

Grok for the live count beside the composer, Tiimo for the value pill per row.

## Two smaller things found alongside

**The star total reads as a runaway number.** "116 = 580 min of screen time
left" does not separate banked holiday time from this week's allowance. The
holiday bank is deliberate: stars above the weekly cap survive, spendable only
while school is out, never expiring. In August that is the feature working, and
it reads like a bug because the display does not say which is which.

**Holiday jobs.** Justin: chores do not stop in the holidays, they change.
Different jobs, and device limits loosening on purpose. Needs a holiday job set
rather than the term time one, and it pairs with the holiday spotlight already
written.

## The printed passport button belongs on the passport

Justin, 31 July: "maybe this button should be a smaller version in corner of
actual passport?"

Right, and it fixes something already found. "Have this passport printed" is
currently a full card competing with the passport beside it, while PassportBook
itself has no shop link anywhere. Checked on 31 July: once a page is stamped
the celebration fires, the stamp slams, and then nothing. A parent who has just
earned a stamp is the most likely person in the product to want the real
booklet, and we say nothing to them.

So: a small affordance in the corner of the passport itself, and drop the
separate card. One change, two problems.

Where it matters most is the moment after a stamp is newly earned. PassportBook
already knows which pages are newly stamped, because that is what drives the
stamp slam and the buzz, so the hook exists.

Keep it quiet. A booklet offered the instant a child earns something has to
read as an offer, never as the point of having earned it.
