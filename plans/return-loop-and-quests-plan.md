# The Return Loop, Family Quests, Tracker Redesign, Login Flow Review

Written 4 July 2026 from the wife test feedback and Justin's decisions.
The single idea underneath all of it: the platform is a pathway to digital
safety and literacy at 16, and every login must show where you are on it
and solve one real problem in the moment.

## 1. Why parents come back (the return loop)

The loop a parent lives daily, each step feeding the next:

1. Morning: push notification with today's one thing (school item caught by
   DiGi, or the day's moment card, or a quest to hand the child).
2. In the moment: a problem happens, Right Now button or moment card gives
   the exact words, gets logged as a concern.
3. Child side: the child completes their quests (printed card for little
   ones, their phone link for older ones) and ticks them off to earn stars.
4. Evening: ten minute close. How did today go, approve the kids' ticks,
   tomorrow teased. Session ends warmly, never just fizzles.
5. Next morning: the platform REMEMBERS. Yesterday you flagged the bedtime
   battle, is it better, same, still hard. Streak grows. Path node fills in.

Every screen must answer: where am I on the path to 16, and what is the one
thing right now. If a screen answers neither, it does not belong.

### The session shape (LOCKED, Justin 4 July)

Login shows the flow up front: a session strip at the top of Home reading
"Your 10 minutes today" with the day's steps as path nodes (concern follow
up, school items and quest approvals, today's moment card, tracker close).
The minutes come from the time commitment stored at onboarding, and the
node count scales to it. Progress fills as they move. The LAST node every
day is the tracker: a thirty second touch (how was today, one tap, plus a
yes/no on any open concern), expanding to the full five minute check in on
Fridays. The tracker is the session's finish line, not a page you have to
remember to visit; that is what keeps its data live. Then the close: your
minutes are done, streak shown, tomorrow teased.

## 2. Family Quests (what the wife would pay for) — DECISIONS LOCKED

- Reach the kid BY AGE: ages 4 to 8 printable quest cards plus a handover
  screen on the parent's phone; ages 9+ a private magic link on their own
  device (no account, no app store, PWA style), tasks appear, they tick.
- The DEAL is stars: tasks earn stars, the family agreement defines what
  stars buy (Saturday film, hour of Minecraft, pocket money). Screen time
  is unlocked by living well, never dangled as candy.
- Kid ticks, parent approves: child gets the satisfying tick, parent gets
  a one tap approve on the dashboard, stars land only after approval.
- V1 scope, ALL FOUR: weekly printable game pack (age matched, screen free
  logic and family games, tied to the pathway week), phone tasks with the
  earn deal, agreement upgraded with a rewards section that drives the task
  system, family progress board on dashboard home.

Build shape:
- Migration (next free number, claim in draft PR first): family_tasks,
  task_ticks (status pending_approval/approved), kid_links (child_id,
  token), star_goals. Ticks by token route use the admin client, token is
  the auth exactly like the school letterbox.
- /k/[token] kid screen: today's quests, big friendly ticks, star count,
  goal progress, celebration on completion. No parent data reachable.
- Parent: quests manager (create from templates: teeth, reading, outside
  time, kit ready, kind thing done), approve queue on dashboard home,
  star goal setter per child.
- Printables: quest card sheet and the weekly game pack, print CSS like
  the agreement printout.
- Push: kid ticked (parent), quests set for today (kid link visits).

## 3. Tracker redesign (from Justin's screenshot, 4 July)

Today it is a flat 1 to 5 form that looks like a survey. Redesign as the
child's progress screen, Duolingo clarity:

- Top: the child's position on the pathway to 16 (stage path with the
  current node glowing, age vs stage, what is next and when).
- Middle: live concerns as chips (Still working on: bedtime battle, 3
  weeks) pulled from the concerns ledger, each tappable to the script or
  DiGi. Improving ones show it (green arrow, "better this week").
- Week bars become a real trend line with plain words under it ("two good
  weeks after a rough one"), never a bare red block with no explanation.
- The questionnaire stays but becomes a Start check in card (five minutes,
  once a week) instead of an always open form, prefilled state explained.
- Next day return: finishing the check in books tomorrow's follow up on
  whatever scored lowest, which feeds the morning notification.

## 4. Login flow review (the pathway to 16, a moments solution to problems)

Expert pass over the first sixty seconds after login, to be applied screen
by screen:

- Dashboard home order: 1 streak + path strip (where am I), 2 school items
  and approve queue (what needs me), 3 today's moment card (one thing), 4
  Right Now (always reachable), 5 everything else below the fold.
- Every card leads with the PROBLEM IT SOLVES in the headline and the
  resolution inside, bigger cards, fewer of them (Justin: cards need to be
  bigger with the problem they solve and resolution).
- Pathway page redesign: the stage cards become the journey view, your
  child's node marked, tap a stage for what it unlocks, scripts and
  settings for that age. Not a brochure, a map with You Are Here.
- First login after onboarding lands on the first task screen, never an
  empty dashboard. Add to home and school email prompts appear in the
  first session checklist.

## 5. Order of work

1. DiGi freeze fix (shipped in this PR: cached static brain, slim family
   context, honest rate limit message).
2. Family Quests v1 (section 2), the payable loop, one week.
3. Tracker redesign (section 3) and dashboard home order (section 4).
4. Pathway page as the map.
5. Then STOP BUILDING and put a price in front of strangers (founder 50).

## 6. The Device Pathway matrix (LOCKED, Justin 4 July evening)

The pathway map must answer, for every age band, the question parents
actually arrive with: what is my child allowed at this age. One matrix,
stage by stage, device by device (TV, tablet, console, smartwatch, laptop,
smartphone, social accounts, AI tools). Each cell is one of three states:

- Yes, with the settings pack for that age (from the device safety data)
- Co viewing only: shared screen, parent present, what to watch together
- Not yet: a clear cross, warm copy underneath (why, what instead, and
  when it changes). The smartphone gets the flagship treatment, and the
  philosophy is LOCKED (Justin, no brick phones, we do not believe in
  them): when the phone arrives it is a real iPhone set to brick phone
  settings. Calls, messages, camera, maps, nothing else: no browser, no
  App Store, no feeds, downtime on, contacts limited. Then the SETTINGS
  widen year by year along the pathway while the device stays the same.
  The child learns the actual device they will live on, inside walls the
  parent lowers deliberately, and a readiness checklist, not a birthday,
  decides each widening step.

Every Yes cell links three things: the settings walkthrough for that
device at that age, the scripts for introducing it, and the parent
behaviour modelling guide (your phone at dinner teaches more than any
rule: what the parent models at each stage, phones down at meals, no
scrolling during pickup, narrating your own device choices out loud).
Plus what to watch: the age specific warning signs from the risks data.

This IS the product spine: safety through settings, smartphone education
starting with the parent's own settings and behaviour, use widening year
by year, check ins catching issues. The matrix makes the whole promise
visible on one screen.

## 7. The promise audit (4 July, against the live marketing page)

Delivered and true: scripts for the hard moment, Right Now, DiGi any
time (once the cache fix deploys), the five stages, starter pack,
founder cap.

Gaps to close or trim before strangers arrive:
- Monday ritual is promised but nothing arrives on Monday. Build: Monday
  morning push and email with the three personalised actions (stage plus
  open concerns). Cheapest promise to make true.
- Tracker "optional uploads: browsing data, AI usage, sleep" does not
  exist. Trim from the page until built.
- "Full curriculum: home and school" is the lessons engine, not the
  current app. Mark rolling out or trim until the engine ships.
- Verify 131 parents and the three named testimonials are real. Honest
  numbers is a non negotiable; smaller true numbers beat big soft ones.
- Waitlist copy vs live signups: pick one mode.

## 8. The daily literacy card (the FEEL of daily support, per age)

One two minute card per day in the session strip, age specific, one
literacy idea per card (algorithms, deepfakes, comparison, AI, dark
patterns), swipeable like the moment deck. Progress counter makes the
pathway tangible: Literacy skill N of 160 on the road to 16. Content
seeds from the ai_lessons table and the evidence bank now; when the
lessons engine lands, every lesson renders three ways: daily drip cards,
home sofa lesson, school classroom lesson. This is the bridge that makes
"digital literacy support every day at every age" true, not implied.

## 9. The moment flash (Justin, 4 July night)

On login the most likely moment for RIGHT NOW flashes up top, before any
scrolling: time of day picks the candidate (7.30am morning TV battle or
phone before school, 4pm after school decompress, 7.45pm bedtime), and
the concerns ledger overrides it (bedtime flagged twice this week means
bedtime flashes first tonight regardless of clock). One big card, the
problem named in the headline, the words one tap away, dismiss slides it
into the normal deck. The app should feel like it already knows what is
happening in the kitchen. Slots into the dashboard reorder as the Today's
one thing position when a moment is live.

### Correction to the promise audit item 2 (Justin, 4 July night)

The tracker uploads promise (browsing data, AI usage, sleep) IS real: it
is the Digital Health Report at wellbeing.guidedchildhood.com, a separate
paid service. So the fix is a bridge, not a trim:
- Homepage tracker bullet reworded to name it: weekly check in included,
  the deep dive (browsing data, AI usage, sleep analysis) is the Digital
  Health Report, one tap away.
- Product bridge to build: report results feed back into the platform
  (tracker trend and DiGi context), so the loop reads: the report finds
  the problem, the platform fixes it, the tracker proves it.
- Pricing decision for Justin: is a report included with membership
  (founder perk, one per year?) or always a separate purchase. Decide
  before the founder 50 push so the pricing table can say it plainly.

### Tracker untangled (Justin, 5 July)

Two things were half conflated and are now separate:
- The WELLBEING CHECK IN is a ritual, not a destination: thirty second
  touch at the end of every daily session, full five minute version on
  Fridays. It loses its nav tab.
- PROGRESS is the page (nav tab renamed from Tracker to Progress): the
  child's position on the pathway to 16, streak, literacy skills done,
  quest stars this week, concerns improving or open, devices unlocked.
  The check in FEEDS this page; it is not the page. Section 3's redesign
  applies to Progress.

## 10. Milestones, recurring settings, watch time allocation, literacy crafts (Justin, 5 July)

Launch date relaxed: done properly with all kids lessons beats Wednesday.

DIGITAL MILESTONES on the Progress page: at each age, three columns of
expectations: Using (what they should be doing digitally), Understanding
(concepts they should grasp), Behaviour (habits and warning signs). Each
row is monitored by what we already track: lessons covered, settings
applied on age related devices, check in signals. When an age unlocks,
new rows appear plus a "three new things arrive at age N" briefing.

SMARTPHONE JOURNEY additions: each age band on the device matrix names
the known behaviour issues that arrive with it (from the risks data:
group chat drama at 9, comparison dip 11 to 13, secrecy at 14) and
settings check ins RECUR: age tick over reopens the walkthrough with
what changed.

QUESTS additions: approval allocates the agreed watch time automatically
per the agreement exchange rate, shown on both sides ("You earned your
45 minutes of Saturday Minecraft"). Under phone age children get the
daily printable tick sheet, parent keeps the alert rhythm.

LITERACY CRAFT PACKS (printable, screen free, star earning, tied to the
lesson curriculum): 4 to 7 Robot Parent programming cards, Real or
Pretend sorting, My Screen Rules colour in door poster, build a paper
turn timer. 8 to 10 Password Monster (silly name becomes the real
passphrase), Advert Detective bingo, The Feed snakes and ladders with
choice ladders and trap snakes. 11 to 13 Algorithm Architect (design a
feed to hook someone, reverse engineering as vaccine), Deepfake or Real
family quiz pack, phishing escape room. Family: device free dinner cards,
weekly Family Tech Quiz. Every craft doubles as a quest and maps to a
lesson so the curriculum, the chores and the fun are one system.
