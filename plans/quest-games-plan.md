# Quest games — games a child completes to earn stars

**Written 9 Jul 2026 · Age matched games sent as quests, played on a phone or printed, that pay stars through the loop we already trust · Grounded in the existing kid missions and star system**

Justin's ask: research and confirm we can send a child the best age related games as a quest task, played on their phone or printed and completed, that earns stars, with the best buildable designs. Answer: yes, and it extends what is already built rather than starting fresh. This plan sets the concept, the architecture, the starter catalogue, the safety rules and the build order.

---

## 1. The idea, and why it fits

Today a game is the reward stars buy. This adds the other half: the game IS the task that earns the stars. A parent sends an age matched quest game to their child, the child plays it on their phone by magic link or prints and completes it, and finishing pays stars into the same bank, for the same parent approval, that everything else already uses. The games lean educational, and the oldest stages lean into digital judgement, so earning screen time also teaches the judgement that makes screen time safe. That is the mission, turned into play.

## 2. What it reuses (almost all of it)

This is not a new system. It is a richer renderer on top of the kid quest machine that already works:

- **`KID_LESSONS`** already are quest activities: two minute mini lessons on the kid quest page, kid voice, ending in a quiz, and finishing one creates a quest with a pending tick so stars land through the normal approve loop. Marking is server side, never trusted from the child device. A quest game is the same shape with a richer middle.
- **`kid_lesson_missions`** already lets a parent send a specific activity to a specific child, age matched, paying a set number of stars (status sent then done). Quest games are sent the same way.
- **The kid magic link** (`/k/[token]`) already gives the child a safe, accountless, dataless way in. Games play there.
- **The quest print page** already generates printables. The print and complete mode lives here.
- **`star_goals`** already turns earned stars into progress toward a chosen reward. Quest games feed it.

So the new build is a quest game engine and its renderers, plus a parent send flow. The star loop, the access, the approval and the marking rule are done.

## 3. Two delivery modes, one source

Every quest game is authored once as a small JSON definition. From that definition:

- **In app**: a self contained React component renders the playable game on the kid page, scores it server side, and creates the pending tick.
- **Printable**: the same JSON renders through a print stylesheet to a clean one activity page (cut and match, sequence cards, maze, dot to dot, tracing), which the child completes on paper. The parent ticks it done, stars land the same way.

`[both]` games need no second authoring pass. Younger stages lean printable and simple tap, older stages lean logic, words, numbers and judgement.

## 4. Architecture: one engine, content in the database

Rule 6 holds: the game content lives in the database, the renderers live in the app. A quest game row carries `{ mechanic, config, stars, stage, printable }`. The app has a registry of mechanic renderers keyed by string, exactly like the lessons interactive layer. The research is clear that eight of the sixteen mechanics share one scaffold (a grid or list of tappable items plus a correctness check), so **one flexible engine plus four renderers (tap, match, sort, true or false) unlocks eight of the first ten games**. Scoring is always server side: the client reports actions, the server decides the stars, never the other way round.

## 5. The mechanics we can actually build

From the research, buildable as small self contained components, no physics, no multiplayer, no heavy assets:

Low build, share one engine: matching pairs, memory flip, sort into buckets, sequencing, number bonds, pattern completion, true or false swipe, dot to dot, tap the target, quick tap reaction.
Medium build, their own renderer: spot the difference, tracing and drawing, word building, rhythm tap, jigsaw and snap, maze path.

Only two depend on timing (quick tap, rhythm) and both use a calm forgiving window with no countdown, so the anti slot machine ethos holds across the whole set.

## 6. The starter catalogue (first ten)

1. Animal Pairs, Foundation, matching, both. Match each UK animal to its baby.
2. Trace the Letters with Teo, Foundation, tracing, printable. Follow the dotted letters, no rush.
3. Woodland Maze, Foundation, maze, both. Help the hedgehog find the way home.
4. Count the Conkers, Builder, number bonds, both. Join the conkers that add up to ten.
5. Story Scramble, Builder, sequencing, printable. Put the four picture cards in order.
6. What Is an Advert?, Explorer, sort, in app. Sort real posts from paid adverts. **Judgement quest.**
7. Real or Fake?, Explorer, true or false, in app. Swipe on everyday claims and headlines. **Judgement quest.**
8. Word Ladder, Shaper, word building, both. Change one letter at a time from one word to another.
9. Safe or Unsafe Message?, Shaper, sort, in app. Decide which messages are worth questioning. **Judgement quest.**
10. Spot the Manipulation, Independent, swipe plus sort, in app. Name the pull: urgency, flattery, fear of missing out. **Judgement quest.**

The four judgement quests (6, 7, 9, 10) are the differentiator, they lean entirely on the sort and swipe renderers, so they are cheap to ship once the engine exists, and they climb the DiGi pathway idea: what is an advert for the young, naming manipulation tactics for the oldest.

## 7. Two build paths for the games themselves

- **Hand built app components (recommended spine).** Small, offline, no ads, no data, no child account, server scored, our design tokens and GSAP motion. Best for tight quest and star integration, and the only path for the digital judgement games where the content is ours. Almost the whole catalogue is this.
- **Higgsfield game pipeline (occasional richer game).** The connected Higgsfield tools can build and deploy a richer browser game to a shareable URL, which a quest can open. Use sparingly for a game too rich to hand build, never for the judgement games. Hosted elsewhere, so it sits outside the offline and no data guarantees, which is why it is the exception.

## 8. Safety and the anti slot machine ethos (non negotiable)

The whole product is anti slot machine, and the research names exactly what to avoid: variable or random rewards, streak and daily login pressure, countdown urgency, fear of missing out prompts, and endless content with no stop. None of those ship. Instead:

- **Fixed, transparent rewards.** A quest game is worth a known number of stars, shown up front. No jackpots, no multipliers.
- **Mastery over grind.** Reward completing and understanding. Once mastered, the game says well done and stops offering itself.
- **Calm finality.** A clear finish screen, a warm word, then out. No autoplay into the next, no streak in danger nudge.
- **Predictable effort.** Child and parent both know it takes a few minutes and yields a set amount of screen time.
- **Praise the process.** Feedback names the thinking ("you spotted the advert"), it does not shower generic confetti, so the value stays in the learning.

Grounded in the four pillars of good educational apps (active, engaged, meaningful, supported: Hirsh-Pasek and Golinkoff 2015), Common Sense Media's rating frame, and the dark patterns research (ACM CHI, Fairplay).

## 9. Accessibility and printables

- **WCAG 2.2**, weighted to what matters for children: no time pressure (2.2), predictable layout (3.2), plain readable language (3.1), strong contrast and never colour alone (1.4), forgiving input (3.3). Large finger friendly tap targets on a phone.
- **Printables**: one activity per page, generous white space, thick high contrast lines that photocopy cleanly, short instructions for the child plus a one line note for the parent, and a visible satisfying finish that maps to stars.

## 10. Build order

1. **The quest game engine plus four renderers** (tap, match, sort, true or false) and the server side scoring path. Unlocks eight of the first ten games.
2. **The parent send flow**: pick an age matched game, send it as a mission to a child, from the Quests tab.
3. **Ship the four low build games** first (Animal Pairs, Woodland Maze, Count the Conkers, Real or Fake?) to prove the loop end to end on a phone.
4. **The four digital judgement games** (6, 7, 9, 10), the differentiator, on the sort and swipe renderers.
5. **The print stylesheet** from the same JSON, for the `[both]` and `[printable]` games.
6. **Then batch**: the medium build renderers (maze, tracing, word building, jigsaw) and their games, plus a Higgsfield built richer game if one is wanted.

## 11. Design references

Kids' game and level reward UI patterns to pull from Mobbin (level complete, star reward, calm finish, child friendly tap targets) when the connector is stable in this environment. Until then, JP can paste Mobbin screenshots for a site teardown, or we lean on the patterns already pulled for the quest and reward work.

## 12. First actions

1. Define the quest game JSON shape and the mechanic renderer registry (mirrors the lessons interactive layer).
2. Build the shared engine plus the tap, match, sort and true or false renderers with server side scoring.
3. Wire the parent send flow into the Quests tab, reusing kid_lesson_missions.
4. Ship the four low build games and test the full earn a star loop on a phone.
