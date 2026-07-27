# Simplified daily flow, the real build

Justin approved the narrowed daily flow sample (app/ref-daily-flow/page.tsx on
claude/daily-flow-sample). This plan turns it into the real parent home.
Rules he approved: one screen, one next action, everything else folds to slim
rows, same shape every day. Constraint: lose no existing functions, only
reflow them. And make the road diagrams larger.

## Home reshape (app/(dashboard)/dashboard/page.tsx)

Top to bottom, the same shape every day:

1. DigiWelcomeSheet, untouched, exactly the first login behaviour it has now.
2. Trial banners, untouched, they only show when relevant.
3. New greeting row (components/daily/HomeGreeting.tsx): DiGi bubble with one
   sentence folding in the road position and today's minutes, streak chip on
   the right (the existing StreakFlame).
4. WaitingOnYou, untouched, silent when nothing waits.
5. THE one card (components/daily/TodayTenCard.tsx): driven by the existing
   getTodayLoop engine and TodayPathStrip's own minute weights and copy.
   Mono eyebrow with the parent's real minute commitment, four progress dots,
   Next headline, one butter Do it now button, the exact TodayPathStrip
   minutes line, the I have 5/10/15 picker kept, the celebration pop kept.
6. Three slim rows (components/daily/HomeSlimRows.tsx): Family quests with a
   live N to approve badge, The road to 16 with stage and stamp position,
   Ask DiGi anything. Sunday adds the weekly round up row. The kid handover
   nudge shows on the quests row when the child is 8 to 10 or older and no
   kid link exists yet, pointing at the quests Share tab.
7. Quiet conditionals kept as they are: RevealCard, SundayCheckIn,
   SetupUnlockToast, AddChildName, HomeStats cheer, the Finish setting up
   row, PushPrompt with its #turn-on-check-ins anchor.
8. Everything else folds into one closed details section at the bottom, the
   same tiles and cards as today, nothing deleted.

## Where each old home piece now lives

- Today path strip: replaced by the one card, same engine, same copy.
- Road to 16 strip: the road slim row on home; the full road is the pathway
  page, where it always was.
- Literacy strand ticks: pathway page (LiteracyAreas) and Progress page.
- Quest board with goal bars: the quests page already holds all of it in
  QuestManager (approve, tick, goals, share). Home's board folds to the
  quests slim row with the approve badge.
- Focus concern bar: pathway page carries the tailored concern card.
- Moment cards, insight, weekly actions, DiGi prompts, alerts, readiness,
  streak widget, school card, upgrade: inside the folded section on home.

## Bigger road (components/pathway/StageRoad.tsx)

Duolingo style fat coins: StageDot default 44 to 64 with the 0 5px 0 shadow
edge on every state, MiniRoad dots 30 to 44, thicker trails, larger labels.
Pathway page gets a small sticky header card naming the current stage and
stamp while scrolling. Consumers checked: pathway page, RoadToSixteen,
DigiWelcomeSheet, KidRoad.

## Not touched

app/api/digi/*, DeviceTimeCard, ParentDeviceTime, app/api/quests/time/*,
app/api/cron/device-time.

## Update, 20 July 2026: the centre goes Duolingo sized

Justin's added direction after the first pass: the daily path must be BIG,
Duolingo pathway sized, and so must the road to 16. So the one card with four
little dots is superseded by components/daily/TodayPathBig.tsx: the same
getTodayLoop engine and the same minute copy, rendered as a tall winding
vertical path. Fat 68px nodes with the pressed 0 5px 0 edge, a gentle left
and right meander, done nodes filled green with big ticks, the current node
ringed and pulsing with DiGi sitting beside it, and the action callout with
one big butter Go riding right under the current node. The minute picker is
now three big icon chips. StageRoad's full road becomes the pathway hero:
84px stamp nodes on a thick winding trail, big Nunito 900 labels, the sticky
position card in butter, a trophy marker at the end of the road. The device
timer pops onto Home only when live: a slim countdown row for a running
session, a warm row for a pending ask, both opening the full card on Quests.
TodayTenCard, HomeGreeting and HomeSlimRows from the first pass are replaced
by TodayPathBig, DigiGreeting, HomeRows and LiveTimerChip; the earlier files
live on in git history.
