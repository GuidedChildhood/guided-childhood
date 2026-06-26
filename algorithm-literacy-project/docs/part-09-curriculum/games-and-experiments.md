# Games and Experiments

Six activities, unplugged and plugged-in, that make the ideas physical. Each gives materials, rules, and the one learning point it exists to teach. Mix them into the lesson plans, or run a whole "algorithm games" enrichment session from this file alone.

Every game stays neutral about platforms. Cards say "a cooking video" or "a football clip", never a brand.

---

## 1. The Human Recommender (role-play): KS1 to KS2

**Learning point:** a feed is chosen for each person, by watching what they respond to.

**Materials:** one volunteer to be the Recommender; 20 simple picture cards (animals, food, sports, music, vehicles, art); two or three "viewer" children.

**Rules:**
1. The Recommender stands at the front holding the deck. They cannot read minds. They can only watch faces.
2. The Recommender shows one card to a viewer. The viewer reacts naturally (lean in and smile, or look away and shrug). No talking.
3. If the viewer leaned in, the Recommender finds two more cards "like that one" and gives them to the viewer. If they looked away, the Recommender gives nothing and tries a different kind of card.
4. Play eight rounds. Then each viewer holds up their pile.

**The reveal:** the piles are completely different, built from the same deck, by the same Recommender, using nothing but reactions. That is a recommendation system. It is chosen for you, from your signals.

**Extend:** whisper to one viewer to "react big to everything". Watch their pile fill with random stuff. Learning point: if you signal for everything, the feed cannot tell what you really want.

---

## 2. Feed the Algorithm (card game): KS2 to KS3

**Learning point:** the feedback loop, and that watching to the end is a treat the feed counts.

**Materials:** a deck of 40 "content cards" in four colours (topics): green = sport, blue = cooking, red = pranks, yellow = animals. Each player has a "feed mat" (just a sheet of paper).

**Rules:**
1. Deal each player five random cards face up onto their feed mat.
2. On your turn, choose ONE card on your mat to "watch" (place a counter on it).
3. The dealer then adds two new cards of the **same colour** to your mat. The feed gives you more of what you watched.
4. Play six rounds. Then count the colours on each mat.

**The reveal:** almost every mat has become dominated by one colour, even though everyone started balanced. That is the feedback loop. The twist question: "Did anyone watch a card they did not really care about, just because it was there? What did the feed learn from that?" The accidental treat.

**Variant for the bubble lesson:** after six rounds, give each player three "wildcard" tokens. A wildcard lets you watch a colour you have least of, and the dealer adds that colour. Watch mats rebalance. That is steering out of a bubble.

---

## 3. Bubble or Balanced (sorting game): upper KS2 to KS3

**Learning point:** how a feed narrows into a bubble, and the actions that widen it.

**Materials:** a stack of 30 mixed feed cards per group, spanning six topics; two labelled hoops or trays, "narrow" and "balanced"; three "widening action" cards (Search Something New, Follow Someone Different, Finish It On Purpose).

**Rules:**
1. Each group starts with a balanced stack and a simple greedy rule: "always pick the topic you already have the most of." Deal them through ten cards using only that rule, building a pile.
2. They sort their resulting pile: is it Narrow (one or two topics dominate) or Balanced? It will be Narrow. Every time.
3. Now hand them the three widening-action cards. Each action lets them swap three of their dominant cards for three from underused topics.
4. Re-sort. The pile moves toward Balanced.

**The reveal:** the greedy rule (more of what you already engage with) always narrows. The bubble is not bad luck, it is the rule doing its job. Widening takes deliberate action, and there are exactly three reliable moves.

**Discussion:** "When is a narrow feed actually fine?" (deliberately learning one skill). Nuance, not absolutes.

---

## 4. Build a Paper Algorithm (hands-on): KS2 to KS3

**Learning point:** an algorithm is just a set of ranking rules, and whoever writes the rule controls the feed.

**Materials:** ten "video cards" per pair, each printed with a watch-time score (1 to 10), a likes score (1 to 10), and a "new to you" tag (yes/no). The class scoring rule, written large on the board.

**Rules:**
1. Round 1, the rule is: `score = watch-time + likes, plus 1 if new to you`. Pairs calculate each card's score and lay all ten out top to bottom, highest first. That ranked column is the feed.
2. Round 2, change the rule on the board to `score = (watch-time x 3) + likes`. Re-rank. Note which cards leapt up and which sank.
3. Round 3, let each pair invent their own rule and rank by it.

**The reveal:** nothing about the cards changed between rounds. Only the rule changed, and the whole feed changed with it. "Change the objective, change the feed." Then: "Who writes the rule in real life?" The company. Knowing that is power, not panic.

**Bridge to code:** if a screen is available, finish by running `python code/part-05-recommendation-engine/engine.py` and changing the same weighting. The code does, fast, exactly what they just did by hand.

---

## 5. Signal Detectives (prediction game): KS3

**Learning point:** content that provokes a strong reaction tends to travel further, regardless of whether it is true or good.

**Materials:** 16 invented "headline cards" (calm/useful, mildly interesting, and high-reaction, all low-stakes and made up); a tally sheet per group. **Keep every card harmless. No real divisive content.**

**Rules:**
1. Lay the 16 cards face up. Before any discussion, each student privately predicts the three cards they think would "travel furthest" if posted.
2. As a class, vote card by card: would you react, comment, or share this? Tally reactions per card.
3. Rank the cards by total reactions. Compare to predictions.

**The reveal:** the cards that win on reactions are almost always the high-reaction ones, not the calm-useful ones. Students predicted this. Then the key move: "Reaction is the signal the feed rewards. So a feed that wants engagement will spread these, even though nobody decided to. And travelling far is not the same as being true."

**Defence drill:** finish with the three check-before-you-share questions on every student's bookmark: is it true, who gains if I share, am I sharing because it is right or because I am fired up.

---

## 6. The Class Echo-Chamber Experiment (Part 8 simulation): KS2 to KS4

**Learning point:** a feedback loop with a slight preference, left alone, produces a strong bubble, and a small design change can prevent it. A real experiment, with a prediction and a result.

**Materials:** the Part 8 simulation `echo_chamber` (and for older classes `virality` and `learning`) on a projected screen. If Part 8 is not wired up on your machine, run game 3 (Bubble or Balanced) as the unplugged stand-in.

**Run it as a proper experiment:**
1. **Hypothesis.** Before running anything, the class predicts: "If a viewer slightly prefers one topic, what will their feed look like after many steps?" Record the prediction on the board.
2. **Baseline.** Run `echo_chamber` with a balanced viewer. Show the feed staying mixed.
3. **Variable.** Set the viewer to a small preference for one topic. Run the same number of steps. Project the feed narrowing. Compare to the prediction.
4. **Intervention.** Change one setting: add a variety or exploration term, or reduce the preference strength. Re-run. The bubble loosens.
5. **Conclusion.** The class writes one sentence: "A small preference plus a feedback loop makes a big bubble, and adding variety prevents it."

**For KS3 to KS4, add a second run with `virality`:** seed a calm item and a high-reaction item, run the spread, watch reaction win, then dampen the reaction weighting and watch the gap shrink. Same experimental shape: predict, run, change one thing, conclude.

**For KS4, add `learning`:** show a feed optimised for a learning signal and then discuss where it could be gamed (Goodhart's law made visible). This feeds straight into the "Design a kinder feed" lesson.

**Why run it as an experiment, not a demo:** the prediction step is what makes it stick. A class that guessed first and was right owns the conclusion. A class that just watched a screen forgets it by lunch.
