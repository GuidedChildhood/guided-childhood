# Device setup as the calm first step, and DiGi device awareness

Plan, 22 July 2026. No migration needed: `device_guides` already carries
`category` and `emoji`, and `device_setup_progress` already records done versus
not owned. This is a presentation layer plus a DiGi read. No dashes in any copy.

## The problem

The devices page loads every guide at once. For a parent's first visit, and as
the "set up the devices" step on the passport, that is a wall. Justin's fix:
present a small, friendly set of common categories first, "which of these do you
have", and only open the detailed step by step guides for the ones they pick.

## Part 1: the calm category chooser (the first screen)

Before any full guide, show about eight big category tiles, emoji and plain name,
each one a "we have this" toggle. The tiles are grouped so nothing reads as
technical:

1. Home internet and wifi (the whole home filter, safe search, a bedtime pause)
2. TV and streaming (smart TV, kids profiles and a PIN on Netflix, YouTube,
   Disney)
3. Smart home and speakers (Alexa, Google, any voice assistant)
4. Laptop or computer (Windows, Mac, Chromebook family settings)
5. iPhone or iPad (Screen Time, Family Sharing)
6. Android phone or tablet (Family Link)
7. Games consoles (Nintendo Switch, PlayStation, Xbox parental controls)
8. Add others (opens the full guide list for anything not above)

Behaviour:
- Tap a category to say the family has it. That reveals the step by step guide or
  guides inside that category (the existing DeviceList content, filtered), and
  puts it on the active checklist and the coverage ring.
- Anything not tapped stays quietly off the checklist, so the page only ever
  shows what this family actually owns. No overwhelm.
- "Add others" expands the long tail for less common devices, so nothing is lost,
  it is just not shouted on arrival.
- This maps device_guides by their existing `category` into the eight buckets, so
  it is a grouping and reveal layer over what already exists, not a rebuild of the
  guides themselves. The coverage board, the done and not owned states, and the
  per device walkthroughs all stay as they are underneath.

This becomes the "set up the devices" entry from the passport: a parent lands on
eight friendly tiles, taps the three or four they own, and gets exactly those
guides, nothing more.

## Part 2: DiGi becomes device aware, and it shows up weekly

Once a family has said which devices they have, DiGi should use it.

- **In chat** DiGi already gets this family's screen life and a single device
  guide when one is asked about. Extend it with the full list of devices the
  family owns (from device_setup_progress, the done and active ones), so DiGi can
  ground advice in their actual kit: "since you have a Switch and an iPhone..."
- **In the Sunday weekly review** add one rotating, device specific line: name a
  device the family owns, give one setting worth checking and one thing to watch
  out for at the child's age, grounded in evidence. The evidence already lives in
  device_guides (`why`, `note`) and device_stage_notes (`science`), so the line
  stands on named guidance, never a vague tip. It rotates through their devices
  week to week so it stays fresh and covers the whole household over time.

Example weekly line: "You have a Switch set up. One thing to check this week is
the eShop spending limit, and one to watch is that friend requests on a console
can come from strangers, so keeping it to real life friends is the safe default."

Tone: calm, one device, one check, one watch out, never a chore list, never
alarmist. The same voice as the rest of the review.

## Build order, when Justin says go

1. The category chooser as the devices page first screen, grouping the existing
   guides into the eight buckets, reveal on tap, "add others" for the tail. Pure
   presentation, no migration.
2. DiGi device awareness: the owned device list into DiGi's brain, and the
   rotating device line in the weekly review, both reading existing tables.

Confirm the eight categories above are the right set (add or drop any), then it
is a contained build with no schema change.
