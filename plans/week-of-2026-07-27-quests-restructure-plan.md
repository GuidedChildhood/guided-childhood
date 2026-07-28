# Quests restructure

Justin approved this on 28 July: keep all eight tiles, turn them into live
status, then fix the order, then thin the duplication.

The audit behind it ran 45 agents over the page and confirmed 24 findings.
Source: the Quests page is `app/(dashboard)/dashboard/quests/page.tsx` (207
lines) driving `QuestManager.tsx` (2293 lines) plus `QuestShortcuts.tsx`.

## What is actually wrong

Not that there are eight tiles. That a parent opens the page and meets a full
phone screen of navigation before a single piece of information. Eight tall
pastel cards in a two column grid, four rows deep, unconditional, and two of
the eight point at somewhere on the page they are already on.

The tiles are dead signposts. None of them says whether there is anything
behind it. So the parent with four jobs waiting to confirm and the parent with
none see exactly the same page, and the only way to find out is to tap.

Underneath that, the same job is built more than once:

- six entry points to the handover
- five ways to add a job
- screen time spend built three times
- around 250 lines of one time setup sat inside the Share tab, where a parent
  who has already shared never goes again

## The order

The page should answer, in this order, what a parent came to do:

1. **Today** — approve and tick, the timer, screen time. The daily loop.
2. **Status** — the eight tiles, now carrying live counts.
3. **Set up** — everything one time, pulled out of Share, shown while it is
   still unticked and folded away once it is done.

Today's page is the reverse of that.

## Phase 1, this PR: the tiles carry live status

Keep all eight. Give each a badge that reads its real state:

| Tile | Live badge |
| --- | --- |
| Manage jobs | `4 to confirm` |
| Printables | `2 waiting` |
| School reminders | `PE kit tomorrow` |
| Build your star chart | `Not printed yet` |
| Our family deal | `Not signed` |
| Shop | `40 earned` |
| Lessons | next lesson, or `All done` |
| Keepsakes | count kept |

Rules, so this does not become another wall of noise:

- A tile with nothing waiting shows **no** badge, not a zero. Silence is the
  resting state, the same call as the Mon, Wed, Sat greeting.
- The badge is the truth or it is absent. Never a guess, never a placeholder.
- One query per badge at most, batched in the page's existing server fetch, so
  eight tiles do not become eight round trips.

## Phase 2: the order

Move the daily loop above the tiles. Screen time and approvals first.

## Phase 3: the duplication

Six handover entry points down to one. Five ways to add a job down to one.
Screen time spend built once. The 250 lines of setup out of Share and into its
own fold, visible until done.

## Not in scope

The tab strip itself, the child app, anything on the pathway page.
