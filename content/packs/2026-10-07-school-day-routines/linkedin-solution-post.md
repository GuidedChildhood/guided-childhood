# The school day card: how we got to it, why it is built the way it is, and an invitation to pull it apart

Second post of the series, the build post the distribution review asked for once the card was real. It is real: merged 8 October 2026, migration 363 applied, live for every family on the next school day. Vulnerable flavour, founder voice, one idea: here is what the evidence made us build, here is every design choice with its reason, and here is how to break it. Posts at least a day after the flagship, never the same day. Nameable reader: the parent who read the first post and thought "fine, so what do I actually do at 7.30", and the researcher who thinks a founder with a product has already decided the answer.

Series eyebrow on the card: THE WRONG VILLAIN, THE SCHOOL DAY, KEY INSIGHT 02. Format: text plus one real photo if there is a true scene (there is none in founder-context.md for a school morning, so text plus the research card from post one, or a plain screenshot of the card on Home, which is a real screen and allowed).

## The post

Four choices, one card, every reason. Pull it apart.

Last week I posted that the school day's two hardest moments are paid for by sleep and food, not the screen. The question came back: so what do we do at 7.30?

What we built, in eight days, and why.

One. A card on the Home screen that appears fifty minutes before your child's school starts, and fifteen minutes after they are usually home. Your child's day, set once in Settings.

Why fifty and fifteen. Morning advice is useless once the shoes are on, and the first quarter hour home is coat off, bag down. The numbers are a guess we will measure.

Two. One window a day, not two. Before school or after school, your choice, both only if you ask.

Why. In the one direct test of how often to message parents, three a week beat one and five, and five raised opt out by 58 percent and helped nobody (Cortes and colleagues, 3,473 families). Two microrandomised trials put the right minute at single digit points. So we cut the count.

Three. The words lead with sleep and food. Breakfast first, the screen after shoes. Snack in your hand at the gate, no questions for twenty minutes. The end agreed before the screen goes on.

Why. That is where the evidence sat: 355,358 adolescents on sleep and breakfast, two experiments on an hour of sleep, 380 logged screen endings where the routine ending, and the ending the technology made, beat the warning sprung at the end. The card never names a syndrome.

Four. Three taps under every card. Went fine. It happened. I tried it. Each one says what it does: went fine counts the day and flags nothing, it happened puts that moment on your child's check in from tomorrow, I tried it means DiGi asks how it went in a week.

Why. The logging is the product. A tap is a moment, a moment becomes a worry we can watch, and a week later we ask whether what you tried worked, so your answer counts with every other family's. That is how the advice gets better than my reading of the literature.

Yes, the card is a screen in a parent's hand at the moment I say the screen is beside the point. One card, one window, and every rule on it needs no app.

What we do not know. Whether anyone taps: our line is fifteen percent of cards tapped by week four, under ten and we redesign or kill it. Whether fifty minutes is right. Whether the no warning finding, from 28 American families with children under five, holds for a nine year old, or for a child with ADHD, where the NHS says the sequence takes longer. Every citation was checked against its source. It is still a hypothesis with a card on it.

So pull it apart. If you are a parent, set your child's school day in Settings and tell me in a fortnight what the card got wrong. If you are a researcher, the source ledger is yours for the asking, every figure with its verdict, and I would rather be corrected in public than quietly wrong.

This is The Wrong Villain series continued. The school day, part two.

What would you have built instead?

## The first comment

The sources behind each choice. One window: Cortes, Fricke, Loeb and Song, Education Finance and Policy 2021, 3,473 families randomised to one, three or five texts a week. The minute: Bidargaddi and colleagues, JMIR mHealth 2018, n 1,255, and Klasnja and colleagues, Annals of Behavioral Medicine 2019, n 44, both microrandomised. Sleep and food: Orben and Przybylski, Nature Human Behaviour 2019, n 355,358; Vriend 2013, n 32; Baum 2014, n 50. The ending: Hiniker, Suh, Cao and Kientz, CHI 2016, 28 families, 380 endings, children aged one to five, parent rated, and the authors themselves think the warning result is partly parents warning when they expect trouble. The label: Hagger and colleagues 2016, 23 labs, 2,141 adults. Seventy five sources sit under the first post and ninety seven under the briefing that produced this card; ask and I will send the ledger.

## Replies ready

- "A founder with a product would say this." Yes, and that is why the kill line is in the post: fifteen percent by week four or it goes. I will post the number either way.
- "You are telling parents not to warn their child before the screen ends." No. We are telling them to agree the end before the screen goes on, which the same study found went better. If your child does better with a countdown, keep the countdown; the card's script says agree it, in their words, on the fridge.
- "This is just a nudge app." It is a log first. The push is one a day at most and off by default for the morning. The thing that matters is the tap, because the tap is what lets us learn which approach worked for which family.
- "Where is the evidence the card works?" There is none yet. That is the point of the post.

## Claims and sources

| Claim | Source |
|---|---|
| Three texts a week beat one and five; five raised opt out 58 percent | S15 Cortes 2021, confirmed |
| Timing worth single digit points, two microrandomised trials | S17 Bidargaddi 2018, S22 Klasnja 2019, confirmed |
| 355,358 adolescents, sleep and breakfast | S5 Orben and Przybylski 2019 |
| Two experiments on an hour of sleep | S2 Vriend 2013, S3 Baum 2014 |
| 380 endings, 28 families: routine and technology made endings better than parent interrupted ones, warned children more upset, authors' confound note; agreeing the end in advance is our design inference from it, not a tested condition | S11 Hiniker 2016 |
| 23 labs, 2,141 adults | S8 Hagger 2016 |
| NHS: the sequence takes longer with ADHD | S14 West Suffolk NHS 2022 |
| Fifteen percent week four, kill under ten | plans/2026-10-07-school-day-windows-plan.md, our own metric, not a finding |
| Fifty minutes and fifteen minutes | lib/home/school-window.ts, a design choice, said so |

Every product claim describes what is live on 8 October 2026: the card, the three taps, the per family times in Settings, the one window default. Nothing described is a plan.
