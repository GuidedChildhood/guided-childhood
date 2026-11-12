# The ad system: how to use it

One page for Justin. Written 12 November 2026. Everything else is detail for
Claude, in `.claude/skills/ad-studio/SKILL.md`.

## What it does, in one breath

Claude looks at the competitors' adverts that have run longest (the best
public sign an advert pays), copies their structure but never their words,
makes our cards from real app screens, checks every card against our rules
and against the best competitor advert, loads them into Facebook and
Instagram switched off, and every Monday reads what each one did and makes
the next round. You decide what goes live and what money is spent.

## What to say

| You say | What happens |
| :-- | :-- |
| "Do an ad round" | Claude reads the competitors and our results, writes five hooks, builds the cards, runs every check, and gives you the pack to look at. |
| "Load round <name>" | Claude shows you what it would send, then loads the adverts into Ads Manager, all switched off. |
| "How are the ads doing?" | Claude reads the numbers for every live card and tells you the winner and the one number. |
| "Make versions of the winner" | Segment versions of the winning card, two or three words changed for each group of parents. |
| "Check the competitors" | A fresh look at the Ad Library for anything new that is working. |
| "Make the video ad" | The cut of ad video 1 once your clips are in. |

## What happens on its own

**Every Monday at 09:00** (the "weekly ad loop" in the Scheduled list in the
Claude app): the numbers are read and logged, the winner gets new versions,
the competitors are checked, next week's cards are built and checked, and you
get one message with three lines: what won, what is new, what you need to do.
Your Mac needs to be on with Chrome open, because the Ad Library only opens in
your browser. If the Mac is off, it runs when the app next opens.

## What only you do

1. **Look at the pack** and say yes or change it.
2. **Switch an advert on in Ads Manager.** Nothing spends until you do. Check
   the audience and the daily budget on the ad set first.
3. **Film** when a video round needs you (the read cards are printed for you).
4. **Renew the Facebook key** if Claude says it has stopped working: Graph API
   Explorer, Generate Access Token, Access Token Debugger, Extend, paste into
   `.env.local`. Steps in `content/ads/SETUP.md`.

## How a winner is chosen

The card with the most stage checks begun per thousand people reached, once
at least 300 people have seen it. Never likes, never views. Below 300 it is
too early and keeps running. The full log is `content/ads/results-log.md`.

## Where things are

| What | Where |
| :-- | :-- |
| This week's cards | `content/packs/<date>-round-<n>/` |
| What every card did | `content/ads/results-log.md` |
| The competitor adverts we learned from | `content/ads/swipe/ads.json` |
| The rules the adverts follow | `content/ads/proven-rules.md` |
| Account setup and keys | `content/ads/SETUP.md` |
