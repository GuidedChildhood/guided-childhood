# Parent conversations — the Mom Test record

Ten conversations before the next build sprint. Answers recorded close to verbatim, then mapped to build decisions. No pitching during interviews, only their life.

---

## Conversation 1: Justin (founder, but answering as a parent). 2026-07-04

**Family shape:** three children (son plus two girls, hockey and Cubs age). Wife is a teacher working late, so after school he is solo parenting. School day ends 3:15 but hockey pickup means waiting until 16:30.

### The morning (yesterday, near verbatim)

Kids would not get out of bed on time (probably went to bed too late). Clothes were not ready, could not find clean clothes, not ironed. Realised they needed to book lunches and one had a packed lunch, forgot to book meals on the school app. School meeting in emails, did not see it. School reminded by email about things to take in. We get school newsletters but no time to read through all, "would be great if we could pick out vital info." Had to make pancakes, one crying, hair not done. One came down crying and turned the TV on, "we do not like TV in the morning, maybe Friday." Wanted drinks that should have been in the fridge. Pancakes not thin enough. Had to rush, one had a trip and needed a packed lunch. Did not check their bags from the night before: bags had damp clothes, needed swimming stuff, hockey kit.

### The evening before (near verbatim)

Screens on straight from school. Solo parent at this time. Had to play in the field with son while waiting for the girls to finish hockey, brought healthy snacks and water (always hungry after school). Got home: stuff chucked on the floor, dirty clothes still in bags, straight to TV. Had to cook dinner because one had Cubs in an hour. Dishwasher, no help, had to leave them all arguing about what to watch. No controls set on the TV so they watched rabbit holes, the algorithm. Tried to get them off when dinner was cooked: no homework done, no agreement. Took one to Cubs. Watched football, co watched a bit but son asking a hundred questions, "felt bad dad" for watching the football. Kids left without eating full dinner because of the snacks, then hungry late at night, had to cook again. Girls went up, left lights on, slept late, hard to get up in the morning. Kitchen a mess for the morning breakfast routine. Did not empty book notes from school bags. Did not get water ready for the morning. Shoes all over the hall. They did not help around the house, "made me shout, felt bad."

### What he has tried, and why each failed (near verbatim)

- YouTube login PINs: the kids saw them and remembered them, and they were not on all TVs.
- Fridge reward system on paper: hard to keep going on paper, "and if on an app it does not prompt me."
- Loosely agreed chores: one day of doing them, then forgotten.
- Threats (no grandma stay, no football unless screens off and dinner eaten, no TV unless rooms tidied): "they do not do it." Threats do not hold.

### The dream outcome (his words, barely edited)

The morning scramble fixed "would mean a better start to the day and everything then flows. I can clean the kitchen, do my work, feel like a good parent. If homework and a routine was there I would feel like a better dad. Relationship with my wife would be better. And if I am happy I am less likely to shout, cause stress."

---

## What Conversation 1 proves and changes

1. **The real enemy is the day running the parent, not screen time.** Screens appeared as the babysitter filling the vacuum of an overloaded solo evening. Marketing should keep the screen fight hook but the product promise is "the day flows again."
2. **Every failed system failed for the same reason: nothing prompted at the moment of action.** PINs got discovered, paper charts went stale, chores were forgotten, threats were hollow. His exact words: "if on an app it does not prompt me." This validates the entire proactive DiGi architecture (prompt queue, push, daily cron) as THE product, not a feature.
3. **The day is won the night before.** Both the morning story and the evening story point at the same missing piece.
4. **The emotional job is guilt relief.** "Felt bad dad" and "made me shout, felt bad" appeared in every answer. Success metric in his words: feel like a good parent, better marriage, less shouting.

### Build implications (ranked)

1. **The Evening Reset (new, now the top validated unbuilt feature).** A 7pm DiGi push per family: tomorrow's kit per child from a weekly timetable (swimming, hockey, Cubs), lunches booked check, trip and packed lunch flags from school emails, bags emptied, water bottles filled, clothes out. The school link already catches the email half; this adds the per child weekly kit timetable and the checklist push.
2. **Kid facing routine checklists.** The after school five things and the night before reset as checklists the CHILDREN run (printable fridge sheet plus in app), tied into the family agreements builder: agreed jobs with agreed stakes, replacing hollow threats. Prompted, not remembered.
3. **Device Hub nudge for the TV.** No controls on the TV was a 15 minute one off fix (autoplay off, PINs that are not guessable, per TV). DiGi should nudge it when a parent's devices list includes a TV.
4. **Morning flow copy.** After more interviews, test "mornings" language against "screen fights" in the hero. His peace buying moment was the morning, and the morning is downstream of the Evening Reset.
5. **Snack to dinner cascade** is DiGi tip material for the expert corpus (pickup snacks displacing dinner, second dinner late), not core build.

### Conversations remaining: 9

Same five questions, day shaped. Next parents: from Justin's named ten.
