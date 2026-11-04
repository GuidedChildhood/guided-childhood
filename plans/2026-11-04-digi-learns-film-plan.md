# Film 10: DiGi learns you (Coming off screens, part two)

Justin, 4 November 2026: DiGi clips for TikTok and Instagram that solve the
common parent problems live and show the full cycle, "how it stores info ...
and learns to improve based on results". He chose a new film for the learning
loop (the nine film series already covers one problem per film), ending on the
stage check ("Three questions, no sign up").

## The proof path (checked in the code today)

Before every reply the live DiGi route reads the family's open worries with
their check in scores (`concern_events`), the family memory
(`getFamilyMemory`), what worked (`getWhatWorked`) and what was already tried.
So a reply that starts from "your check in says getting there" is what the
product does. The reply is still illustrative and labelled.

## The film (same example family as Short 1: Ava, 9)

1. Hook, MONDAY: the Short 1 question and DiGi's first reply, landing on its
   own line "Coming off screens is on Ava's check in now, and in four days I
   will ask how it went." (reused `rec/short-chat.mp4`)
2. A FEW DAYS ON: the real check in, "Did you get to try it?" Yes, then this
   parent's own rating "Getting there" (reused `rec/followup.mp4`)
3. THURSDAY: the parent asks again, in their words: "We agreed the ending like
   you said. Two good nights, then Sunday was a fight again." DiGi's reply
   starts from the check in and changes one thing (new `scenes/learns-chat.json`,
   99 words, two bold lead ins, the script link, Tonight last)
4. End card: "Coming off screens?", the series line, the stage check line,
   `/v/digi-learns`.

Rail: Asked DiGi, Checked in, Remembered, Next step. Band on beat 3: "It starts
from what you tried." Never "learns your child", never an outcome promise.

Cuts: full (Reels, Facebook) and a TikTok cut without the send beat.
Not touched: DIGI_MODEL, the knowledge bank, the refresh cron, digi-context.
