# The child's tab bar on every screen: what is actually wrong, and what is not

Justin, 15 September 2026: *"are you also building the tabs at bottom working
for each page"*

## First, a correction

I told Justin, before looking properly, that the bar renders on one of twenty
child screens so *"nineteen screens have no way back except the browser"*.

**That was wrong, and it overstated the problem.** Having now read all twenty
routes and had every reading independently checked against the file:

- `/path` is not a screen at all. It validates the token shape and calls
  `redirect()`. It renders nothing. So there are **eighteen** screens besides
  the home, not nineteen.
- **Seventeen of those eighteen have a rendered way back to the child home**,
  most through the shared `KidBackLink`. The eighteenth, the stage check at
  `/quiz`, has a `← My lessons` link to the lessons shelf, one hop from home.

So **no screen traps a child.** Nobody is stuck with the browser back button.
The thing I said was the problem is not the problem.

## What is actually missing

A child can always go *back*. What they cannot do is go *across*. From Jobs
there is no way to reach Printables except home first, and on the screens with
a bar the three tabs are right there. That is a real gap, and it is the one
worth fixing, but it is a convenience, not a child stranded.

## Where the bar should NOT go, which is half of them

Eight of the eighteen are immersive: a task with progress a child could lose,
or a screen that already paints over everything.

| screen | why not |
| --- | --- |
| `/lessons/[lessonId]` | lesson player, answers in flight |
| `/lesson/[mission]` | star lesson player |
| `/tutor/[id]` | DiGi's one off lesson |
| `/adventures/[code]` | watch together, video segments |
| `/quiz` | the ten question stage check |
| `/planet` | drag and drop, unsaved arrangement |
| `/week` | the child's own diary entries, typed |
| `/ask` | borderline, see below |

The lesson player settles it by itself: it is
`position: fixed; inset: 0; zIndex: 110` and the bar is `zIndex: 60`, so a bar
mounted there would be **painted over and invisible**. Somebody already decided
this; the code just never said so out loud.

`/ask` is the one genuine disagreement between the two passes. The first read
called it a three tap chooser with nothing to lose; the check called it
immersive. Both have a point: steps one and two are a chooser, step three is a
child waiting on a grown up, and the page itself already says *"While you wait,
earn more"* and links away. **Recommendation: the bar goes on `/ask`**, because
a child waiting on somebody else is exactly who benefits from a way across.

## Where it should go: ten screens

`/balance`, `/bucket`, `/deal`, `/homework`, `/jobs`, `/lessons`, `/print`,
`/star-chart`, `/suggest`, `/tell`, plus `/ask` per above.

## The four things that make this not a copy and paste

Justin's standing instruction here is *"don't rewire what we have as this may
break it"*, so all four are additive.

**1. The bar has no URL contract, and this is the actual work.**
`KidTabBar` takes `onSelect: (tab) => void`. On the home that callback flips
in page state and scrolls. On any other route there is no local tab to flip, so
it has to navigate to the home AND land on the chosen tab. The home has no way
to be told which tab to open: `goToTab` only scrolls to `#kid-tab-content`.
So the home needs to read a `?tab=` parameter on arrival. That is the new
thing; everything else is plumbing.

**2. The zoom trap, which has already bitten twice.**
`shared/tokens.css` zooms `body` by 1.07. A fixed element inside a zoomed
ancestor drifts as you scroll on iOS Safari. `KidQuestScreen` works around it by
unzooming `body` and zooming itself, and the bar portals to `document.body`.
Any other host of the bar must do the same or the bar will drift on a real
iPhone, exactly as the parent bar did. This belongs in ONE shared wrapper, not
copied ten times.

**3. Bottom clearance.** The bar is fixed, so its height is not in the flow.
Every screen taking it needs its bottom padding raised, or the last control on
the page sits under the bar. `/ask` for instance pads
`calc(40px + env(safe-area-inset-bottom))`, which is not enough.

**4. The badges cannot be computed per route.**
The red counts on Lessons and Printables are worked out inside
`KidQuestScreen` by diffing the adventures, missions and printables lists
against client side seen state. None of the ten routes load any of that. So
either the bar renders with no badges off the home, or the counts move to one
shared source. **Recommendation: ship the bar with no badges on other screens
first**, because a wrong badge is worse than none, and we fixed exactly that
bug on the parent side this morning.

## The shape

`app/k/[token]/layout.tsx` is currently `<div className="gc-shell">{children}</div>`,
a server component with no data reads. It is the obvious mount point, but it
cannot know which tab is current or whether the screen is immersive.

So: one client wrapper that takes `current` and renders children plus the bar,
and the ten screens opt IN to it. Opt in, not automatic, so an immersive screen
can never accidentally acquire a bar it should not have.

## Guard, when built

The rule a typecheck cannot see: an immersive route must not mount the wrapper,
and a screen that mounts it must pad for it. Both are invisible to a build and
both are how this breaks later.
