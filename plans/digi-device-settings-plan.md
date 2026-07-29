# DiGi and device settings: what Justin asked for on 28 July

Written from his notes after testing on a real phone. Nothing here is built yet
apart from the name fix, which shipped separately.

## 1. DiGi loses the thread mid walkthrough

**What happened.** He was on device settings, asked DiGi to help set up TikTok,
and DiGi answered correctly. Then it stopped. To actually do it he has to leave,
go to the real settings, work through them, and find his own way back.

**What it needs.** DiGi should know where the parent came from, walk them one
step at a time, and hand them back to where they started when it is done.

Three parts:

- **Know the entry point.** When DiGi is opened from a device guide, that
  context travels with the conversation. It already does for a single turn
  (`deviceGuideKnowledge` is injected when a guide is detected) but it does not
  survive as a place the parent can be returned to.
- **One step at a time, with a real position.** The guide steps exist in
  `device_guides`. What is missing is state: which step this parent is on, so
  DiGi can say "you were on step 3" rather than starting again.
- **A way back.** A visible return to the guide, not a hope that the parent
  remembers the path.

**Rule to keep.** Advise, never insist. The walkthrough offers the next step, it
does not block on the last one.

## 2. Device settings must be thorough, current, and step by step

Every guide gets audited for accuracy and completeness. These change often, so
this wants a review date per guide rather than a one off pass.

## 3. Device setup belongs near the front

He found the link from the passport, which is too far in. Setting up the screens
already in the house is one of the first real jobs, not a later one.

## 4. Settings strength scales with age, and we say so unprompted

The core of it. If a smartphone is added for a 4 to 9 year old, the recommended
settings should be visibly stronger, and DiGi should raise it rather than wait
to be asked.

Applies across the board, not just phones. The shape:

- every device guide carries a recommended strength per age band
- adding a device to a child triggers the recommendation for that pairing
- an ahead of age pairing is already detected on the passport (`aheadNames` in
  `passport-sections.ts`), so the signal exists and just needs acting on
- **guide, do not lock.** A strong recommendation with the reason, never a
  refusal. This is the calibrated pathway rule from CLAUDE.md.

## 5. The basics should be on by default

Where a sensible default exists, it should already be chosen, so setup is
confirming rather than deciding from nothing.

## 6. A feed assessment for worried parents

For a parent frightened by what their older child sees: run an assessment that
looks for worrying patterns in the feed, and let DiGi suggest the right health
tool when it finds them. Only in that circumstance, never as a routine scan.

Needs a scope conversation before any build: what is actually assessed, what the
child consents to, and what we do with the answer. It touches a child's private
feed, so it is the one item here that should not start without agreeing the
boundaries first.

## Sequence

1. Age based settings strength (4) plus defaults (5). Biggest safety payoff and
   the signal already exists.
2. Device setup earlier in the order (3).
3. The walkthrough with a way back (1), which needs per step state.
4. Guide accuracy audit (2), ongoing.
5. The assessment (6), after a scoping conversation.
