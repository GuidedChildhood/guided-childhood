# Part 5: A Recommendation Engine You Can Read

This folder contains a small but real recommendation engine, written in Python so
that a curious thirteen year old, or a teacher with thirty minutes, can read every
line and understand how a video feed decides what to show you next.

It is the same shape as the engines that run the big platforms, just shrunk down
to a world of six topics and twenty videos so you can hold the whole thing in your
head. Nothing here is hidden inside a machine learning library. Every decision is
plain arithmetic you could redo with a calculator.

## How to run it

From the project root, set up the environment once:

```bash
cd algorithm-literacy-project
python -m venv .venv
source .venv/bin/activate          # on Windows: .venv\Scripts\activate
pip install -r requirements.txt    # only numpy is needed for this part
```

Then run the engine:

```bash
cd code/part-05-recommendation-engine
python engine.py
```

It prints a friendly story as it goes. You do not need to read the code first.
Run it, read the output, then come back to the code to see how each step happened.

## The two files

- **`engine.py`** is the whole engine and a demo. Start here.
- **`interest_vector.py`** is one small building block: the idea of describing a
  person's taste, or a video's subject, as a row of numbers (a "vector"). The
  engine imports it.

## The big idea: retrieve, rank, show, learn

Every modern feed works in the same loop. Ours does too.

```
        +-----------+      +--------+      +--------+      +---------+
        |  RETRIEVE | ---> |  RANK  | ---> |  SHOW  | ---> |  LEARN  |
        | shortlist |      |  score |      |  feed  |      | update  |
        +-----------+      +--------+      +--------+      +---------+
              ^                                                 |
              |_________________________________________________|
                         tomorrow's feed is different
```

1. **Retrieve (candidate generation).** Out of every possible video, quickly grab
   a rough shortlist of a few dozen that look promising. This has to be fast, so
   it is rough. We pick the videos whose topics best match your current taste,
   plus a few chosen at random so you can still discover new things.

2. **Rank.** Now that the list is short, score each one carefully and sort. Our
   score combines four things: how well it matches you, how well made it is, how
   fresh it is, and a small curiosity bonus for things we are unsure about.

3. **Show.** Put the top few on screen.

4. **Learn.** Watch what you do. Did you watch it all, like it, or skip it
   instantly? Turn that into a single "reward" number, then nudge your taste
   profile towards what you engaged with and away from what you skipped. Nudge the
   ranking weights too. Next round, the feed is slightly different. That is the
   famous feedback loop.

## What to look for in the output

The demo follows a pretend person called Robin, who starts out mostly into
football. As you read the printout, watch for these moments.

- **The feed narrows, then drifts.** In the first rounds almost everything is
  football, because that is what Robin liked. Watch how each "you watched ... ->
  your interest in FOOTBALL rose" line pushes the next feed further the same way.
  This is the feedback loop tightening.

- **A skip changes everything.** When Robin skips a science video, science
  interest stops rising. The feed notices a single bored moment and reacts.

- **The weights drift.** At the end the engine prints the ranking weights it
  learned. They started at fixed guesses and moved on their own, because the
  engine slowly worked out which signals predicted that Robin would stay. That is
  a baby version of how real feeds train themselves.

- **The filter-bubble experiment.** At the very end the same person is run twice,
  once with no exploration (`epsilon = 0.0`) and once with plenty
  (`epsilon = 0.3`). The engine counts how many different topics each feed ever
  showed. The cautious feed funnels down to a single topic. The curious feed shows
  a wider world. One hidden number quietly decides how broad your view becomes.

## Things to try (experiments)

You learn the most by changing one thing and rerunning. Good first experiments:

1. **Turn exploration off and on.** In `demo_adapting_feed()` change `epsilon`
   from `0.15` to `0.0`. Does Robin ever escape football? Now try `0.4`. Does the
   feed feel more varied, or just more random?

2. **Change the learning rate.** In `run_round()` find `learning_rate=0.18` and
   try `0.4` (a feed that over-reacts to one click) or `0.05` (a calm feed that
   barely moves). Which one feels healthier?

3. **Rewrite what a "like" is worth.** In `simulate_engagement()` the reward is
   built from watch time, likes and skips. Make a "like" worth far more, or make
   skips hurt far more. You are changing what the feed secretly optimises for, and
   you will see Robin's interests end up somewhere different.

4. **Change Robin's starting interests.** In `demo_adapting_feed()` start Robin as
   mostly into science, or split evenly across everything. Does an even start stay
   even, or does the feed still pick a favourite and run with it?

5. **Add a video.** Add a new `Item(...)` to `build_catalogue()` with its own topic
   mix and quality. Watch whether and when it ever reaches the feed.

6. **Make the world bigger.** Add more items per topic and run more rounds. Does
   the filter-bubble effect get stronger or weaker with more choice?

## Glossary

Plain-language definitions of the terms used in this part.

- **Recommendation engine.** The machine that decides what to show you next.
- **Interest vector.** A person's taste, or a video's subject, written as one
  number per topic. Two vectors that "point the same way" are a good match.
- **Cosine similarity.** A score from 0 to 1 for how aligned two vectors are. It
  cares about direction, not loudness, so a quiet fan and a loud fan of the same
  thing still match.
- **Candidate generation (retrieve).** Stage one: quickly grab a rough shortlist
  of promising videos out of everything available.
- **Ranking.** Stage two: carefully score the shortlist and sort it best first.
- **Weights.** The numbers that say how much each signal (match, quality,
  freshness) counts when scoring. They can be tuned, and here they also learn.
- **Quality.** A rough "how well made or well liked is this" score baked into each
  video.
- **Freshness.** How new a video is. Newer videos get a small boost, then it fades.
- **Reward.** A single number summarising how you reacted to one video, from happy
  (you watched and liked) to unhappy (you skipped at once).
- **Feedback loop.** Show, watch the reaction, update, repeat. Each round changes
  the next, which is why feeds drift over time.
- **Learning rate.** How big a step the engine takes when it updates after each
  reaction. Big means fast but jumpy, small means slow but steady.
- **Online learning.** Learning one example at a time as it arrives, rather than
  crunching a huge dataset all at once.
- **Exploration vs exploitation.** Exploitation means "show more of what works".
  Exploration means "occasionally try something new so we can keep learning". A
  good feed needs both.
- **Epsilon (epsilon-greedy).** The chance the feed ignores its best guess and
  gambles on something random. `epsilon = 0` never explores, higher values explore
  more. It is the single curiosity knob in this engine.
- **UCB (Upper Confidence Bound).** A way to be curious on purpose: give a small
  bonus to videos we have not shown much, because trying them is the only way to
  find out if you like them. The bonus shrinks as the system gathers experience.
- **Filter bubble.** What happens when a feed only ever shows you more of what you
  already engaged with, slowly narrowing your view of the world.
- **Personalisation.** Tailoring the feed to one specific person's learned taste,
  rather than showing everyone the same thing.
