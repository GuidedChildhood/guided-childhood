# Teacher Guides

For the non-specialist. You do not need a computer science background to teach this well. You need the few core ideas below, an honest stance, and the confidence to say "good question, let us think it through" when a child catches you out.

---

## 1. Subject knowledge primer

Read this once and you know enough to teach the whole programme. It is the grown-up version of the Part 4 analogies. Keep `for-teachers.md` in Part 4 to hand too.

### What a recommendation system actually is
A feed is not a random pile of posts. It is **chosen for each person**, freshly, every time they open the app. The thing doing the choosing is a recommendation system. The person next to your pupil gets a completely different feed from the same app at the same moment.

### The two moves: retrieval and ranking
Every feed makes two moves.

1. **Retrieval (gather).** From a catalogue of maybe billions of items, the system pulls a shortlist of a few hundred or thousand that might suit this person. It cannot score everything, so first it narrows.
2. **Ranking (order).** It scores that shortlist and orders it, best guess first. The top of your screen is whatever scored highest.

For younger children we call this "gather then rank", or "the DJ reads the room then picks the next track". It is the same thing.

### Signals
The system guesses what you want from **signals**: the things you do. Two kinds.

- **Explicit signals:** you chose to do them. A like, a comment, a follow, a search.
- **Implicit signals:** you did them without deciding to. How long you watched, whether you rewatched, whether you lingered.

The single heaviest signal is usually **watch time**. The reason is simple and worth saying to a class: time is honest. You can like something to be polite, but if you watched it to the end, you watched it to the end. Implicit signals are powerful precisely because we are not performing for the camera when we give them.

### The feedback loop
This is the most important idea in the whole programme. What you do is a signal. Signals change what you are shown. What you are shown changes what you do. Round and round. This is why a feed feels like it "knows you": you have been training it, mostly by accident, every time you used it. The puppy analogy (age 9) is the child-facing version. The grown-up name is a **feedback loop with implicit feedback**.

### The objective function
A feed ranks to maximise something. That something is the **objective function**, usually a weighted blend of engagement signals (watch time, completion, comments, shares, return visits) plus some safety guardrails. The one sentence that unlocks KS4: **change the objective, and you change the feed.** A feed is not good or evil. It is an optimiser pointed at a target, and the target is mostly engagement because engagement is what an advertising business earns from and what is cheap to measure.

### Filter bubbles
If the system keeps giving you more of what you engage with, your feed can narrow until you mostly see one kind of thing. That is a filter bubble (or echo chamber). It is not a punishment and not a plot. It is just what a feedback loop does if nothing pushes back. The cure is variety: searching for something new, following someone different, deliberately finishing content outside your usual lane. Part 8's `echo_chamber` simulation lets a class watch this happen and then reverse it.

### Why outrage spreads
Content that provokes a strong reaction tends to get more comments, shares, and dwell time. Those are engagement signals. So a system optimising engagement will, without anyone intending it, tend to amplify reaction-provoking content. Say "tend to". This is contested in its size and the platforms dispute it, but the mechanism is real and is enough for a Year 8 to understand. The defence is the same as ordinary media literacy: check before you share.

### Exploration versus exploitation
A good recommender cannot only give you more of what it already knows you like (exploitation), or it traps you in a bubble and never learns anything new. It also has to try new things now and then (exploration) to discover what else you might like. The tension between "play the safe bet" and "try something new" is exploration versus exploitation, and it is the honest reason feeds are not perfectly predictable. This is a KS4 idea but a strong KS3 class can meet it.

### Can the objective be something kinder?
This is Part 7. The honest answer is: partially, for some outcomes, at a real cost, never cleanly. Outcomes that are behavioural and externally observable (sleep, physical activity, learning, family time) are more tractable. Latent states (empathy, confidence, mental wellbeing) resist cheap measurement and invite gaming. Any kinder metric tends to reduce short-term engagement, which is why no major platform has shipped one wholesale. Teach this as a genuine open problem, not a solved one.

---

## 2. Common misconceptions and how to correct them

| Misconception | Why it is wrong | How to correct it in class |
|---|---|---|
| "The feed is random." | It is individually chosen and different for every user. | Show two children's "trays" or feeds side by side. Same app, different result. |
| "The algorithm reads my mind." | It only reads behaviour. It infers, and it gets things wrong. | "It cannot see what you think, only what you do. So what does it get wrong about you?" |
| "Only likes count." | Implicit signals, especially watch time, usually matter more. | The "watch time is a vote" lesson. Time is honest; a like can lie. |
| "The app is evil and wants to hurt me." | It optimises for engagement because that is the business model. That is an incentive, not malice. | "Systems, not villains." Explain the machine without demonising the builders. |
| "A filter bubble is something bad people do to you." | It is the natural result of a feedback loop with no variety. | The swimming pool corner. You can swim out any time. |
| "If I just delete the app I have solved it." | Useful, but the literacy goal is to understand and steer, not only to avoid. | Power, not panic. Avoidance is one tool; understanding is the durable skill. |
| "Watching something means I endorse it." | Watching is a signal whether or not you meant it. | The accidental treat. "You can vote for something just by lingering." |
| "Bigger numbers (more likes) means it is true." | Spread measures reaction, not truth. | "Travelling fast and being true are different things. Check before you share." |
| "Algorithm just means something mean a computer does." | An algorithm is just a set of steps to make a decision. A recipe is an algorithm. | Build a paper algorithm. Children rank by hand and see it is just rules. |

---

## 3. Safeguarding and sensitivity notes

This programme is calm by design. Still, a few cautions.

- **Keep it about the mechanism, not the material.** When teaching "outrage travels fast", use invented, low-stakes example posts. Never surface real divisive political content, distressing imagery, or anything that could single out or upset a child. The learning point is *how* spread works, not *what* spreads.
- **Some children have no access to these platforms.** Under current UK policy a full access ban for under-16s on the named platforms is confirmed and due to come into force. Many pupils may use messaging or gaming apps only, or nothing. Never assume a class uses any app. Teach the principles, which apply to any recommender (including video sites, music apps, and shopping), and never imply a child should circumvent a restriction.
- **Watch for disclosure.** A lesson on feeds and feelings can prompt a child to share something worrying about their own online life. Follow your school's safeguarding policy. Know your designated safeguarding lead before you teach the KS3 and KS4 units. Do not promise confidentiality.
- **No shaming.** A child who recognises their own scrolling habit in a lesson may feel exposed. Frame every recognition as power ("now you can spot it"), never as a failing. The "you are in charge" closer is not decoration, it is safeguarding.
- **Neutral about platforms and companies.** Do not name brands as good or bad. It is unfair, it dates instantly, and it can distress children whose families work in tech or who love a particular app. Name behaviours and mechanisms.
- **Screen-time conversations belong to families.** You teach how feeds work. How long a child should spend on a screen is a family decision. Stay in your lane and point parents to the parent workshops.

---

## 4. Tricky questions children ask, and honest answers

Keep these in your back pocket. The aim is always a true, right-sized, calm answer.

**"Is the algorithm spying on me?"**
It is not watching you through the camera. It logs what you do inside the app: what you watch, for how long, what you tap. That is a lot, and it is worth knowing. But it is data about your behaviour, not a person looking at you.

**"Does the app want me to be addicted?"**
The app is built to keep people watching, because that is how it earns money. It is not a person wanting anything. It is a machine pointed at "more watching". Knowing that is exactly what lets you push back.

**"If I use it less, does that hurt the company?"**
A little, but that is not the point of this lesson. The point is that you get to decide how you use it, on purpose, instead of by accident. You are the trainer, not the puppy.

**"Why do I keep seeing the same stuff?"**
Because you have been training it, mostly without meaning to. Every time you stop on something, you tell it "more of this". If you want different, you have to give it different signals: search something new, finish something outside your lane.

**"Is everything I see on my feed a lie?"**
No. Most of it is just chosen to keep you watching, which is not the same as being false. But things that make people react strongly spread further, and spreading is not the same as being true. So check before you share.

**"Can the algorithm be good?"**
It can be pointed at kinder targets, like helping people sleep or learn. Some small versions of that have been tried. But it is genuinely hard, because the good things are hard to measure and tend to make people use the app less, and companies earn from people using it more. It is an unsolved problem, and people are working on it. That is a true and hopeful answer without pretending it is easy.

**"Who decides what I see?"**
Whoever writes the rule the feed follows decides, and right now that is the company. You do not write the rule. But you do control the signals you feed it, so you have real influence over your own feed even though you did not build the machine.

**"Is my feed different from my friend's?"**
Yes, completely. Same app, same moment, two different feeds, because you two have given it different signals. That is the clearest proof that it is chosen, not random.

---

## 5. If a child knows more than you

Some will. A pupil may have read about transformers, or argue a fine point about a specific platform. Two moves keep you safe and keep the lesson honest.

1. **Hand it to the class as a question.** "Interesting, let us reason about that together." You do not have to be the answer key. You are the person who runs the thinking.
2. **Anchor on the stance, not the trivia.** You may not know one platform's latest ranking detail. You do know the durable truths: it is chosen, it learns from behaviour, time is honest, feeds narrow, you can steer, the objective decides everything. Those do not go out of date, and they are what the child actually needs.
