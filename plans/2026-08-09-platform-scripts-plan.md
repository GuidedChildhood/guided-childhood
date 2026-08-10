# Platform specific scripts, batch one

Justin, 9 August 2026:

> "We really need many more moments and scripts for social media and AI as this
> is core so let's build gradual learning scripts for every possible issue with
> Instagram, Facebook, TikTok and all top 10 social media platforms, deep
> research all the top advice, parent issues from Reddit Mumsnet ... and base
> learning on top child experts that follow our philosophy, not to ban but
> educate ... then a button to send convert to child tips"

## What the numbers actually are

The screenshots showed 63 scripts and 3 on social media. **That was a free tier
view on a test account.** Live counts, checked against the database:

| category | total | free |
| --- | --- | --- |
| mood-confidence | 62 | 17 |
| family-rules | 46 | 10 |
| staying-safe | 39 | 6 |
| screen-time | 37 | 10 |
| everyday-routines | 33 | 11 |
| school-and-ai | 31 | 4 |
| social-media | 27 | 3 |
| gaming | 21 | 2 |

296 scripts, 63 free. The free numbers match his screen exactly, category by
category. Nothing is hidden or broken.

## The three real gaps, from reading all 58 social and AI titles

1. **Almost nothing is platform specific.** Instagram appears in two titles,
   TikTok in one. No Snapchat, WhatsApp, YouTube, Discord, Roblox, Facebook, X
   or Twitch anywhere in the library.
2. **No gradual on ramp.** Social media by stage: foundation 0, builder 1,
   explorer 9, shaper 11, independent 5. Nothing before eleven but one script.
3. **The child version is mostly empty.** `for_your_child` is filled on **24 of
   296**.

   **Correction to what I first told Justin.** I said the send to child button
   did not exist. It does, and it is complete: `ScriptDepth` renders the child
   note with send to their app, SMS, share and copy, and `/api/scripts/expand`
   generates the note on demand when the stored field is null. So nothing is
   missing. Filling the field by hand buys a written child version instead of a
   generated one behind a spinner, which is worth having on the sixteen most
   sensitive scripts in the library, and nothing more than that.

This batch takes the first gap, starts the second, and improves the third.

## This batch: sixteen scripts, four platforms

Migration **180**. Claimed in the draft PR at open. Only #770 is open and it is
the child home lane, no migration overlap.

| platform | builder | explorer | shaper | why these |
| --- | --- | --- | --- | --- |
| Snapchat | left out of plans | streaks, Snap Map | disappearing messages | the three Mumsnet threads are all one of these |
| TikTok | | the rabbit hole, cannot concentrate | posting themselves | the algorithm is the whole complaint |
| Instagram | | asking, and Teen Accounts | second account, a DM from a stranger | DMs are the documented grooming path |
| WhatsApp | added by a stranger | removed from the group, the 11pm class chat | something vile forwarded in | the default setting is the fault |

Every one carries the full depth set, including **`for_your_child` on all
sixteen**, which is the send to child material Justin asked for and doubles the
filled count in the library.

## The research behind it

- **Snapchat**: streaks read as compulsory and hurt when broken, Snap Map
  exposes location, stories drive missing out, and the real bind is that plans
  happen there so a child without it is excluded. Mumsnet threads and platform
  guides.
- **TikTok**: engagement pulls a child deeper into whatever they linger on. An
  account set up as a fourteen year old was served suicide related posts within
  minutes in one investigation. Concentration is the other complaint.
- **WhatsApp**: **anyone holding the number can add a child to a group** with no
  request to accept. The setting is Settings, Privacy, Groups and it defaults to
  Everyone. Removing and re adding is a known exclusion tactic.
- **Instagram**: Teen Accounts default under 18s to private with messages
  limited to followers, and under 16s need a parent to loosen it. Unwanted adult
  DMs are the main documented contact route.

## The philosophy, honestly

Heitner's mentoring over monitoring is the match: blocking and spying drives it
underground and does not prepare a child for the adult version of the same
spaces.

**One complication that gets respected rather than buried.** Livingstone's
survey found parental restriction of peer to peer contact was associated with
reduced risk, while active co use was not necessarily. So these scripts do not
claim talking always beats settings. They put the words first and the setting
in `tonight`, and several say plainly that a setting is the right move now and
the conversation is what stops it becoming a fight.

## Rules

- No dashes in any copy. Not one.
- Never allow or deny. Every script ends with a next move.
- `law_flag` set per platform, `full_ban_u16` on the social platforms so Stage 4
  content follows the flag without a rewrite (docs/11). WhatsApp is messaging,
  so `none`.
- `is_free` on four of sixteen, one per platform, so the free tier gains a real
  taste rather than nothing.

## Not in this batch

YouTube, Discord, Roblox, Facebook, X, Twitch. Named so the gap stays visible.
Moments and lessons are their own build and are not touched here.
