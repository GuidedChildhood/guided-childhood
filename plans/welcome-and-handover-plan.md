# The welcome on open, and the child phone handover

Brief from Justin, 26 July 2026.

## 1. The welcome becomes a one card drip tour

Today the overlay rotates mission lines every six seconds inside one view. That
is the wrong axis. It should rotate **across logins**, not within one: a Duolingo
style welcome back, one beat, one tap, gone.

**No duration.** Never "today takes about six minutes". It is the first thing a
tired parent reads and it lands as a commitment, not a welcome. They find out it
is short by it being short. If a time is ever shown it is the next step only,
two minutes, never the sum of the day.

**One service per open.** Each login introduces one thing the platform does, so
across a fortnight a parent meets the whole product without ever being given a
tour. Candidates:

- Set up your child, and we build the pathway
- Family Quests, jobs that earn the screen time
- School reminders, the week set up for you
- Balanced online and offline, the healthy amount for their age
- Safe learning and digital literacy, the lessons at the age they land
- Log a moment, and find out how to handle it
- The check ins, parent and child, and what they tell us

**Each card carries the trust line.** Not just what the service is, but what we
do with what you tell it: you log a moment, DiGi remembers it and brings it back
when the same thing happens again. Parents are rightly wary of apps that hoover
up family information. Saying plainly what happens to it is both the feature
explanation and the reason to trust us.

**Make it adaptive, not random.** The app already knows the setup state
(`lib/setup/steps.ts`). Lead with a service this family has **not** set up or
used yet, so the card is a useful next thing rather than a fact. Once they have
met everything, fall back to rotating the insights.

**Shape:** one card, one line, one tap out. No dots to swipe, because the
rotation lives across opens. Casual, warm, short.

## 2. The child phone handover prompt

The handover is the moment the whole star economy comes alive, and today it is
buried on the Quests page where only a parent who goes looking will find it.

**Show it on the second login**, not the first. The first open already carries
the welcome and onboarding; two overlays on day one is a wall.

**QR alone will not work.** The parent is holding their own phone when the
prompt appears, and you cannot scan a code with the device showing it. So
**send the link** (share sheet, text) sits equal to the QR: the code for when the
child is stood next to you, the link for every other time. Without that a good
share of parents hit a dead end.

**Respect the age gate.** Handover is already only offered for children 8 and up
(`age_band !== '4-7'`). A parent of a five year old being asked to link a phone
reads as us pushing devices onto little children, which is the opposite of what
we stand for.

**The paper option is an equal choice, not a dismissal.** "We do it on paper" is
legitimate and on brand: plenty of families will not give a phone and we should
be the platform that respects that. It is recorded as a real preference and the
prompt never returns.

**It disappears by itself** the moment a `kid_links` row exists for that child,
since there is then nothing to ask.

**Cap the asking.** If a parent answers neither way, ask two or three times at
most, then fall back to the quiet prompt already on the Quests page. An overlay
on login is the most intrusive surface we have and the fastest way to make it
hated is to let it nag forever.

**The reasons why, which is the sell:** jobs they tick themselves, screen time
they ask for rather than argue for, printables and lessons landing on their own
device, and a star bank they can see. The child doing their side, so the parent
stops being the enforcer.

## 3. Does the daily path already cover reported issues

Checked: `getTodayLoop` does read live concerns and builds a check in step from
them, and Home shows a focus bar naming the most recently flagged one. So the
path **acknowledges** what a parent reported.

The open question is whether it **chooses content** by it. `getRecommendedScript`
takes a challenge parameter, so the machinery exists, but it is not confirmed
that the live concern feeds that selection. If it does not, wiring it is the
single highest value change to the pathway: it turns "we remember what you told
us" into "everything today is about what you told us". Verify first, then wire.

## Build order

1. Welcome copy and the one card drip tour (small, high visibility)
2. The handover prompt, with link plus QR, the age gate and the paper choice
3. Verify and, if needed, wire the live concern into daily content selection
