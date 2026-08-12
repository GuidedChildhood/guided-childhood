# Tomorrow: one clear thing a day, Planet Friends, and a passport worth keeping

Justin, end of 12 August 2026:

> "as we won't get any visitors yet, shall we fix this tomorrow, and then tidy up
> everything that was meant to be on the to do list, and the planets turned on to
> Planet Friends images, and make it Duolingo to do every day knowing what they
> need to do, with emphasis on the star system, set up plan and steps to tidy up
> passport page, and do this tomorrow."

Five jobs, in this order, because each makes the next easier.

---

## 0. First, unblock the paywall. Nothing else earns anything.

**What is certain.** `justin@thesocialbillboard.com` is hardcoded into
`ACCESS_ALLOWLIST` in `lib/access.ts`, with a guard that re-adds it even when the
environment says otherwise. `hasFullAccess` checks that list on its FIRST line,
before the profile, the subscription or the trial. So on that address the paywall
can never appear, and no amount of resetting onboarding will change it.

**What is not certain.** Justin reports the same on other addresses. The
allowlist does not explain that.

**Do not guess it a fifth time.** Print the current `screen` value on the page
during onboarding, walk through on a fresh email, and read where it actually
goes. Five minutes, and it ends the argument.

Two things to check while in there:

- **`FOUNDER_EMAILS`** on the **guided-childhood** project. It is a comma
  separated allowlist. If the test addresses are in it, they are comped too.
- **`NEXT_PUBLIC_APP_URL`** on the **guided-childhood** project specifically.
  The domains live there, not on `guided-childhood-app`, so an env change made on
  the wrong project never reached the live site.

---

## 1. The to do list that was meant to be there

Already designed in `plans/home-is-the-daily-page.md`, so this is execution. The
short version: the pathway page quietly became where the good daily material
lives, and Home is the page people actually open.

Six blocks belong in the daily loop. Each is already a countable state plus a
next step:

| Block | What it says |
| --- | --- |
| Your focus | the concern being worked on, and the words for tonight |
| Set up every device | 2 of 4 set, next the iPad |
| Work through what comes up | the concern queue |
| The child's lessons | 3 of 23 done, next Mean messages |
| The school chest | beside the road, never a task |
| How far you have come | the payoff, weekly rather than daily |

`lib/home/next-up.ts` already picks one thing a day from a smaller set, and its
rotation is the right engine. Extend it. Do not write a second one.

---

## 2. Planet Friends, not generic planets

The six coins use `PlanetArt`, a drawn sphere with a motif. They should be the
Planet Friends the child already knows from `digi-squad`, so the parent side and
the child side share one cast instead of running two.

Worth knowing first: the Higgsfield MCP has needed an approval prompt every time
it has been reached for in this session, so plan for the art to come from the
existing squad files rather than a fresh generation.

---

## 3. Duolingo, properly: one obvious thing, every day

The bones exist. `TodayPathBig` is the winding green path with the current node
ringed and DiGi beside it, and a bouncing bonus coin now hangs off the right of
the road. **That coin is not yet checked in a browser** and that check is the
first build job of the day.

What is missing is the sentence a parent should be able to say out loud after
opening the app: *today I do this one thing*. Home currently offers a loop, a
coin row, a bonus and a school line, and the eye has to choose. Duolingo never
makes you choose.

One lead, picked by what is live. Everything else quieter.

---

## 4. The star system, said out loud

Stars become minutes. It is the mechanic the whole child side turns on, and it is
currently explained inside the Quests tab, which is the one place a parent
already understands it.

It needs saying where a parent meets it first, in one line, without a lesson:
**they earn stars, stars become device time, you set the rate.**

---

## 5. The passport page

Justin, pointing at the concern list:

> "this is the section that needs its own dashboard, and we can create an icon
> next to to do today saying when they have done a check in, so not there until a
> check in, and can say journey to 16, social media and device ready, progress so
> far. Note it is not the path, it is the to do today list, this all needs to be
> near."

So the passport becomes a real destination rather than a long scroll:

- **Its own page**, holding the record: how far you have come, the journeys, the
  stamps, the readiness readings.
- **An icon beside today's loop**, appearing **only once a check in exists**.
  Before that there is nothing to show, and an empty badge is worse than none.
- **The line it carries**: journey to 16, social media and device ready, progress
  so far.
- **It is not the pathway road.** The road is stages four to sixteen. This is the
  record of what this family has actually done.

The concern list on it became a tidy table tonight, live first with the sorted
ones folded, so that part is already done.

---

## The order, and why

**0** first, because nothing earns anything until somebody can pay.

**1** next, because the daily loop is the frame everything else hangs on.

**5** then, because the passport is where the material moves FROM, and it needs
somewhere to land before you start moving things.

**3 and 4** together, because the one clear daily thing and the star system are
the same sentence.

**2** last, because new art on a settled layout is safe, and new art on a moving
one is wasted twice.
