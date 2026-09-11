# The home page, Apple's way: one screen, then icons

Justin, 11 September 2026: "all these things on home page need to be tidied up
in best platform way as cant be a long scroll and some of them are not right
for first ever log in, monthly catch up. can we make this format like apple
would, their view on UX on home page, so that these things are accessible and
time critical if need to be, so not a massive long scroll but behind icons if
needed."

## What is actually there

Forty top level blocks in one return, roughly 800 lines of JSX. Counted, not
guessed: QuietLine, school block, trial countdown, HomeLive, DiGi's word,
catch up, habit nudge, the child's day strip, the path, moments today, child
app gone, TodayCard, DiGi welcome sheet, mission welcome, phone bridge, phone
later, school ahead, term preview, DiGi greeting, community bite, day complete,
check up needs, home rows, reveal card, Sunday check in, DiGi flash up, setup
card, unlock toast, monthly shop sheet, add child name, push prompt, HomeMain,
the More fold, last feedback, school promo, today's moments, last insight,
check in due, the DiGi card, the upgrade card.

Most are conditional, so no one family sees all forty. A family a few weeks in
sees enough of them that the screen is a scroll with no shape.

## The Mobbin read

Pulled before designing, as the rule says. The pattern that answers this is
the same in every app that has solved it:

- **Revolut Business** and **Jobber**: a hero, then ONE row of circular icon
  actions ending in More. Everything else is one tap, not one scroll.
- **Withings Health Mate** and **Alan**: sections capped at three rows with a
  see all link. The home never grows, the list page does.
- **Asana**: the only thing allowed to break the shape is a time critical
  banner at the top, and it is dismissible.
- **stoic** and **Future Pro**: a first run screen shows almost nothing except
  the one thing to do, because a new account has no history to report on.

Apple's own Health and Fitness apps are the same idea: a summary that never
scrolls past about two screens, with everything else behind Browse.

## The shape

**Band one, always, never folded**
1. The greeting, one line.
2. Anything with a person waiting on the other end (an approval, a child's
   ask, a school deadline today, the trial ending). One fixed slot.
3. Today's path.

**Band two, the icon row.** Five circular tiles: Moments, Scripts, DiGi,
Passport, More. Every destination that is currently a card halfway down the
page is one tap from the top instead.

**Band three, at most three cards.** Ranked, capped, and the rest folded into
one More for you with a count. Never a fourth card.

**First ever login shows band one and nothing else.** A brand new account has
no history, so every card that reports on history is either empty, wrong, or
faintly insulting: a monthly check in on day one, a community bite, last
insight, last feedback, the streak widget, moments today.

## The build

1. `lib/home/first-run.ts`: is this the family's first day? No completed daily
   session, no concern ever checked, account younger than a day. One read, one
   boolean, used to suppress every retrospective block.
2. `components/home/HomeShortcuts.tsx`: the icon row, Checker tokens, chunky
   ink circles.
3. `lib/home/shelf.ts`: the ranking and the cap. Every card that is not time
   critical goes through it, so the cap is a rule rather than a habit.
4. The tail of the page goes inside one fold.

## The rule that decides everything

Time critical means a person is waiting or a date is passing: an approval, a
child's request, a school deadline, the trial ending, a check in due today.
Those sit at the top and break any cap. Everything else is worth knowing, not
worth interrupting, and belongs behind an icon or a fold.
