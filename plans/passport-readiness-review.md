# Passport readiness review, 5 August 2026

The question asked: can we say, stage by stage, that a child is being taught
what they need so that full access at 16 is a handover and not a cliff. The six
things named as the test:

1. How to use the platforms safely
2. The settings on those platforms
3. Conversations
4. Scripts the child can use to ask a parent a question
5. What to report to a parent
6. Device settings

This is a coverage audit against those six, read from the live database and the
app code on 5 August 2026. It is not a claim about what researchers would
conclude. It says what exists, what is thin, and what is missing.

## The short answer

Three of the six are genuinely there. One is broken in production. Two barely
exist. So no, not yet, and the gaps are nameable rather than vague.

## What the library actually holds

The lessons table has 135 rows, which overstates it. Only 47 are written and
live. The other 88 are stubs, a title and nothing behind it, and every teacher
variant is a stub.

| Stage | Live lessons | With slides | With a child facing message |
|---|---|---|---|
| Foundation | 6 | 4 | 0 |
| Builder | 6 | 4 | 0 |
| Explorer | 8 | 5 | 0 |
| Shaper | 20 | 18 | 14 |
| Independent | 7 | 5 | 1 |

Shaper is the only stage that is properly built. The four either side of it are
running on six to eight lessons each.

The app is honest about this. Every path that shows a family a lesson filters
`status = stub`, so a parent sees six, not twenty four. Nothing is being
inflated on screen. The shortfall is real content, not a display bug.

Scripts are the strong point: 296 of them, spread across all five stages and
eight categories, and they are database rows as they should be.

Device guides are also solid: 25 guides across six categories, each with the
why, the steps and an honest note, age keyed from 4 to 13.

## The six, one by one

**1. How to use the platforms safely. Mostly there.** The ladder runs sensibly
from stop and tell at Foundation, through passwords and strangers at Builder,
group chats and location and footprint at Explorer, into a strong Shaper block
covering grooming, sextortion, deepfakes and radicalisation, then Independent
picks up news diet, money and meeting people from the internet. Explorer is the
weak rung, eight lessons carrying the age where most of the first real accounts
appear.

**2. The settings on those platforms. Broken in production.** The page at
`/dashboard/social-settings` reads from a table called `social_platform_guides`.
That table does not exist in the live database. Migration 093 creates it and was
never applied. The page therefore renders with zero platform guides on it, for
every family, today. This is the single most fixable thing in this document.

The device guides table does carry TikTok, Snapchat, Instagram and WhatsApp
settings, but all four are gated at minimum age 13, and nothing connects them to
a stage. So the settings work exists in one place and is invisible in the other.

**3. Conversations. Strongest area.** 296 scripts, every stage covered, every
category populated. The distribution is uneven, Shaper mood and confidence has
26 while Explorer everyday routines has 4, but there is no stage where a parent
opens the app and finds nothing to say.

**4. Scripts the child uses to ask a parent. Missing.** Every one of the 296
scripts runs parent to child. There is no script anywhere that runs the other
way. The `for_your_child` field exists and is filled on 21 of 296, but that is a
child facing rendering of a parent script, not a thing a child picks up to start
a conversation they are nervous about starting.

This is the gap that matters most for the 16 handover. A young person who can
raise the awkward thing themselves is the actual outcome we are claiming.

**5. What to report to a parent. Partial and implicit.** The pieces are
scattered: the stop and tell rule at Foundation, keeping the door open when
something goes wrong at Shaper, and the refusal ladder in code. What is missing
is one explicit artefact per stage that says here is what you tell me, and here
is what happens when you do. The second half is the one that earns the telling,
and it is nowhere.

**6. Device settings. Good, with a hole at the top.** 25 guides, real steps,
freshness tracking. Age keyed 4 to 13, which means Independent, the stage that
runs directly into 16, has no device guidance at all.

## What would close it

In the order I would do them:

1. Apply migration 093 so the social settings page stops rendering empty. Small,
   and it fixes a live hole today.
2. Write the child to parent scripts, one set per stage. This is the missing
   half of the product, not a nice to have.
3. Give every stage an explicit what to tell a parent card, including what
   happens next when they do.
4. Fill Explorer out to match Shaper's depth, since Explorer covers the age
   where the first accounts land.
5. Extend device guides past 13 so Independent is covered.
6. Decide what the 88 stubs are for. Either write them or delete them, because
   right now they make the library look four times its real size to anyone
   reading the table rather than the app.

Items 2 and 3 are the ones that decide whether the 16 claim holds. Items 1 and 5
are quick.
