# The first welcome walkthrough (2 September 2026)

Justin: "When first signing up and adding a child it then goes to celebration
and walk through. Can we make this super simple, explaining step by step what
happens each day, with the best UX, Apple level, simple to the user, and
animation sliding up of each part of the platform, how it helps solve their
problem. Do complete, get rid of what is there. We need to cover everything we
do, why, and how DiGi works. Make this top level, design first, with the best
mobile app look, and check Mobbin for the best onboarding ideas."

## What was there

The wizard ended on a DiGi speech bubble written by a model call, a first
task screen from the same call, and the notifications ask. Nothing said what
the product does each day. The dashboard then ran two more welcome surfaces
(DiGi's sheet and the rotating mission cards) on later visits.

## References (Mobbin, 2 September)

Finch: one card leads, the rest wait, the buddy hatches. Duolingo: progress
bar, one idea per screen, one button, the reminder ask once the plan is real.
Klima and Lloyds: illustration above, text below, one button. ANZ Plus: meet
your card, one feature per card.

## The design

Canvas: First Welcome Walkthrough. A celebration (DiGi, the child's name on a
green pill, confetti) then eight cards, one anatomy: a drawn scene from our
own screens, an eyebrow saying when it happens, one headline, two lines, the
why in a green strip, dots and one butter button.

1. Open the app, do one thing (home).
2. Rate how the worries went (the check in, the baseline).
3. Tap the moment that went wrong (moments become worries).
4. The actual words for tonight (scripts).
5. DiGi never says yes or no (how DiGi works: your family, the research, a
   pathway, never a ban or a free pass).
6. The child earns their own screen time (the child app, no login).
7. Watch it work (weekly email, passport, a worry that rests).
8. Want a nudge before bedtime (the reminder ask, kept).

## The build

- components/onboarding/WelcomeWalkthrough.tsx: the component, GSAP slide up
  per card, they and their for the child, real tokens, no generated copy.
- app/onboarding/page.tsx: the three old screens and the model call removed;
  setup ends on the walkthrough, which ends on the dashboard (the middleware
  still puts the plan choice in front).
- app/(gate)/dashboard/how-it-works: the same cards from Settings, no
  celebration, no reminder ask.
- app/dev/welcome: the fixture, every card, two phone sizes.

## Left alone, on purpose

DiGi's welcome sheet and the mission cards on the dashboard still run on
later visits. They are not the first welcome. Retiring them is a separate
decision for Justin.
