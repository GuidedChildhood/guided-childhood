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
