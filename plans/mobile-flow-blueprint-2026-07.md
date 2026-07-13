# Mobile flow blueprint: the daily pathway that keeps parents engaged

Researched 2026-07-12 against the proven pathway platforms: Duolingo, Fabulous,
Noom, Headspace, Finch, Good Inside. Mobbin itself is login gated for the
agent, so the benchmark ran on the published teardowns and design system
documentation of the same apps Mobbin catalogues. This document is the standing
reference for every mobile home and flow decision.

## What the winners do (one line each)

1. **Duolingo: one lit path, no category choice.** Users think they want to
   browse; they actually want the app to hand them the next step. Removing
   choice raises engagement. Character animations on completion raised new
   learner retention by 1.7 percent on their scale, thousands a day.
2. **Fabulous: journeys as chapters, one ritual at a time.** Start with ONE
   small action, layer the next only when the first sticks. A commitment moment
   ("I commit to this") does psychological work. Sixteen fold download growth
   after the redesign.
3. **Noom: a vertical stack of daily cards, reprioritised each day.** Bite
   sized chunks, different emphasis each day, and it asks WHEN you want your
   daily lesson, a routine choice disguised as personalisation.
4. **Headspace: the Today tab strips everything to one tap.** Morning,
   afternoon, night actions on one screen. And the validation: their award
   winning canvas is butter cream with Nunito at 1.5 line height, which is our
   exact brand. We are on the right horse; the job is discipline, not a new
   look.
5. **Finch: the companion makes showing up feel like caring for someone.**
   Parents come back for the character, not the checklist.
6. **Good Inside: a daily deck and a reason to return, under five minutes.**
   The whisper in the ear, never a wall.

## The seven rules for Guided Childhood mobile

1. **One lit step.** Home opens on Today's Path (shipped). Nothing above it
   but the header and setup conductor. Everything else descends from it.
2. **Bite sized, layered.** Never show the whole mountain. The day is four
   steps. The stage journey is chapters on the Pathway page. New rituals layer
   in only after the current one sticks.
3. **Time of day awareness.** Morning opens on check in, afternoon on the
   moment, evening on the script and bedtime. Same path, the lit step follows
   the clock and what is already done.
4. **DiGi is the interior guide, on a budget.** DiGi sits on the lit node,
   speaks one line, celebrates completions with a micro moment, and raises at
   most two proactive cards per session. DiGi never interrupts mid task and
   always signposts a human in crisis.
5. **Progressive service discovery.** One service surfaced per day, at the
   moment it is relevant, through the Explore grid spotlight. A parent learns
   the whole membership over two weeks, not one scroll.
6. **Celebrate small, immediately.** Completing a path node gets a tick pop
   and a DiGi bob, half a second, GSAP, no modal. The evidence says these
   micro moments are what compound into retention.
7. **Apple level type discipline.** Nunito stays. Display 800 to 900 with
   negative tracking, body 15 to 16px at 1.55 line height, mono eyebrows 10 to
   11px with 0.12em tracking, a 4 point spacing rhythm, 44px minimum touch
   targets, and butter reserved for the one action that matters per screen.

## The DiGi interruption grammar

- **On the path:** DiGi stands on the lit node with one instruction line.
- **On completion:** a half second celebration, then the path advances.
- **Proactive:** at most two DiGi prompt cards on Home, generated from the
  family's own data, dismissable, never guilt.
- **Streak at risk:** the widget goes grey warm with one gentle line, never
  the Duolingo guilt owl. A parent is never made to feel they failed.
- **Crisis:** the Now button and DiGi both route to humans (Samaritans, 999,
  GP, CAMHS) the moment crisis language appears.

## Build order from here

1. Time of day aware Today's Path ordering plus the completion celebration.
2. Explore spotlight: one tile a day carries a "today" glow and one line of
   why, replacing the rotating FeatureDiscovery card.
3. "When do you want your daily nudge?" ask, wired to the push cron.
4. Pathway page as journey chapters with You Are Here (existing roadmap item).
5. The Now rescue upgrade: typed one line rescue, crisis net, voice.

Sources: Google Design on Fabulous, Behavioral Scientist teardown, Duolingo
case studies and design system, Apple Developer Behind the Design features on
Headspace and Duolingo, Justinmind Noom teardown, Finch teardown, RevenueCat
Noom funnel analysis.
