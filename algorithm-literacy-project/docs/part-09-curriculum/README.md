# Part 9: The Algorithm Literacy Curriculum

*A complete, classroom-ready programme that teaches children how recommendation systems work and how to steer their own feeds. Built for UK schools, mapped to Key Stages 1 to 4, and ready to teach tomorrow morning.*

This part turns the rest of the repository into lessons. The research lives in Parts 1 to 3, the plain-language explanations in Part 4, the working code in Parts 5 and 6, the feasibility study in Part 7, and the interactive simulations in Part 8. Part 9 is where a teacher with no computer science background can pick up a single lesson plan and run it well.

It links loosely to the existing Guided Childhood theme **Module 9: The Social Media Brain**, and uses the DiGi Squad characters (Oliver, Zara, Sofia, and DiGi Junior) as friendly guides where it helps younger children. The characters are a door, not a dependency. Every lesson works without them.

---

## Learning aims

By the end of this programme a child should be able to do five things.

1. **Explain** that a feed is chosen for them, not random, and that a different feed is built for the person next to them.
2. **Describe** the feedback loop: what they do becomes a signal, signals change what they see, what they see changes what they do.
3. **Name** the heaviest signal (how long you watch) and explain why time is an honest signal even when you never tap like.
4. **Notice** when a feed is narrowing around them, and take a deliberate action to widen it.
5. **Judge** a feed against a human question, not just an exciting one: is this serving me, or just holding me?

These aims sit on top of, not instead of, ordinary online safety teaching. Safety asks "is this person who they say they are?" Algorithm literacy asks "why am I being shown this at all?" Both matter. This programme owns the second question.

---

## Our stance, carried into the classroom

We keep the three rules from Part 4 in every lesson.

- **Systems, not villains.** Apps are built to keep people watching because that is how they earn. That is an incentive, not a plot. We explain the machine. We do not demonise the people who built it.
- **Power, not panic.** Every lesson ends with the child more capable, not more frightened. The point is agency.
- **True, but right-sized.** A Year 2 child gets a smaller true picture. A Year 11 student gets close to the real engineering. Nobody has to unlearn what we taught them earlier.

Teachers should stay neutral about platforms. Name a behaviour ("watching to the end") rather than a brand. This keeps the lesson legal-safe, future-proof, and fair to children who use different apps or, under current UK policy, none of the named platforms at all.

---

## The spiral structure

The same five ideas come back at every Key Stage, each time a little more accurate. This is a spiral curriculum: we do not teach a topic once and move on, we return to it with more precision as children grow. The analogy each age uses is the one already written into Part 4, so the classroom language and the take-home reading match.

| Big idea | KS1 (5 to 7) | KS2 (7 to 11) | KS3 (11 to 14) | KS4 (14 to 16) |
|---|---|---|---|---|
| A feed is chosen for you | The robot waiter brings what makes you smile | The DJ reads the room and picks the next song | The vending machine rearranges itself for you | Retrieval and ranking: a shortlist, then a scored order |
| The feedback loop | If you smile, more of that comes | You train the puppy without meaning to | What you do changes what comes next, round and round | Signals, model update, next recommendation, repeat |
| Watch time is a vote | Stopping to look is like saying "yes please" | The longest watch is the loudest signal | Your time is honest even when you stay silent | Implicit feedback and the objective function |
| Feeds can narrow | Lots of the same thing can fill your plate | The bubble: you stop seeing the other side | Filter bubbles and why they form | Exploration versus exploitation, and the cost of safe bets |
| You can steer it | You can ask for something different | Train it on purpose, not by accident | Audit and reset: take the wheel | Audit your own feed; design a kinder objective |

A child who walks the whole spiral never meets a fact they have to throw away. The robot waiter quietly becomes retrieval and ranking. The puppy quietly becomes implicit feedback.

---

## Scope and sequence

The programme is eighteen taught units. A school can run the whole spiral across the years, or pull a single Key Stage block as a half-term unit. Each unit is roughly one lesson, though several KS3 and KS4 units sensibly run as a double.

| Unit | Key Stage | Year | Title | Core idea | Links to |
|---|---|---|---|---|---|
| 1.1 | KS1 | Y1 to Y2 | What is a recommendation? | A feed is chosen for you | Part 4 age 7 |
| 1.2 | KS1 | Y2 | The robot waiter | Smiling brings more snacks | Part 4 age 7 |
| 1.3 | KS1 | Y2 | Asking for something different | You can steer it | Part 4 age 7 |
| 2.1 | KS2 | Y3 to Y4 | Training the puppy: feedback loops | The accidental training loop | Part 4 age 9 |
| 2.2 | KS2 | Y4 | Watch time is a vote | Time is the loudest signal | Part 4 age 9, Part 5 |
| 2.3 | KS2 | Y5 | The DJ reading the room | Candidate generation and ranking | Part 4 age 11 |
| 2.4 | KS2 | Y5 to Y6 | Build a paper algorithm | Ranking by hand | Part 5 |
| 2.5 | KS2 | Y6 | Escaping the bubble | Feeds narrow, you can widen them | Part 4 age 11, Part 8 echo_chamber |
| 3.1 | KS3 | Y7 | The vending machine that rearranges itself | Engagement optimisation | Part 4 age 13 |
| 3.2 | KS3 | Y7 to Y8 | Signals: what your feed reads | Explicit vs implicit signals | Part 3, Part 5 |
| 3.3 | KS3 | Y8 | Filter bubbles, properly | How and why bubbles form | Part 8 echo_chamber |
| 3.4 | KS3 | Y8 to Y9 | Outrage travels fast | Virality and amplification | Part 8 virality |
| 3.5 | KS3 | Y9 | Audit your own feed | Take the wheel | Part 4 age 13, Part 4 age 16 |
| 4.1 | KS4 | Y10 | Inside the machine: retrieval and ranking | The real two-stage pipeline | Part 4 age 16, Part 5 |
| 4.2 | KS4 | Y10 | The objective function | What a feed is told to maximise | Part 5, Part 7 |
| 4.3 | KS4 | Y10 to Y11 | Exploration versus exploitation | Safe bets vs new ground | Part 4 age 16, Part 6 |
| 4.4 | KS4 | Y11 | Design a kinder feed | Alternative objectives | Part 6, Part 7 |
| 4.5 | KS4 | Y11 | Can we change the algorithms? | Feasibility and ethics | Part 7 |

Nine of these units are written up in full in `lesson-plans.md`, including Unit 3.5, the KS3 capstone audit lesson. The rest share their structure and can be built from the same template; the lesson plans file flags which ones reuse which design.

---

## How this links to Parts 4, 5, and 8

This curriculum is not freestanding. It is the teaching layer over three other parts, and teachers should keep those three to hand.

**Part 4 (child-friendly explanations)** is the reading and the language bank. Every Key Stage block in this curriculum uses the matching Part 4 analogy, so what a child hears in class and reads at home agree. Before teaching a block, read the matching `age-NN.md` file. It gives you the exact wording, the running analogy, and a "you are in charge" closer you can borrow for your plenary.

- KS1 to Part 4 `age-07.md` (robot waiter)
- Lower KS2 to `age-09.md` (puppy)
- Upper KS2 to `age-11.md` (DJ)
- KS3 to `age-13.md` (vending machine)
- KS4 to `age-16.md` (real engineering)
- `for-teachers.md` and `for-parents.md` back the teacher guides and parent workshops.

**Part 5 (the recommendation engine)** is the live demonstration for KS3 and KS4. It is a heavily commented Python engine that prints a friendly explanation as it runs. You do not need to code. Run `python code/part-05-recommendation-engine/engine.py` on a projected screen, change one number, and let students predict what happens. Unit 2.4 ("Build a paper algorithm") is the unplugged version of the same idea, so a class can meet the concept on paper first and then watch the code do it.

**Part 8 (interactive simulations)** is the experiment kit for KS2 upward. The simulations let a class change a setting and watch a feed narrow, a post go viral, or learning improve. Lessons reference them by their script names:

- `echo_chamber` for filter bubbles (Units 2.5, 3.3)
- `virality` for amplification and outrage (Unit 3.4)
- `learning` for the design-a-kinder-feed work (Unit 4.4)

If a simulation is not yet wired up on your machine, every lesson that uses one also offers an unplugged fallback in `games-and-experiments.md`, so a Part 8 outage never blocks a lesson.

---

## What a child can do by age 16: the outcomes ladder

One page. Read top to bottom as a child grows. Each rung assumes the one below it.

| By the end of | A child can | In their own words |
|---|---|---|
| **Year 2 (age 7)** | Say that a feed is picked for them, and that looking longer brings more of the same | "The app brings me things I smile at." |
| **Year 4 (age 9)** | Spot the feedback loop and name watch time as the biggest signal | "I trained it without meaning to. Watching to the end is a treat." |
| **Year 6 (age 11)** | Explain gather-then-rank, notice a narrowing feed, and widen it on purpose | "It makes a shortlist then ranks it. If it gets samey, I search something new to steer it." |
| **Year 8 (age 13)** | Distinguish "holding my attention" from "helping me", and explain why outrage spreads | "It is built to keep me watching, not to help me. Angry stuff travels because it gets reactions." |
| **Year 9 (age 14)** | Run an audit of their own feed and take three reset actions | "I checked what mine was feeding me, cleared the bad signals, and trained it on what I want." |
| **Year 11 (age 16)** | Describe retrieval, ranking, and the objective function; argue for an alternative objective and name its trade-off | "It maximises an objective. Change the objective and you change the feed, but every kinder metric is harder to measure and costs engagement." |

A child who reaches the top rung is not cynical and not frightened. They understand a system, they can steer it, and they can hold an honest opinion about how it should be built. That is the whole aim.

---

## Files in this part

- `README.md`: this overview.
- `lesson-plans.md`: nine full lesson plans, KS1 to KS4.
- `teacher-guides.md`: subject primer, misconceptions, safeguarding, tricky questions.
- `parent-workshops.md`: two ready-to-run 60 minute workshops.
- `games-and-experiments.md`: seven unplugged and plugged-in activities.
- `worksheets.md`: seven printable worksheets with answer notes.
- `assessment.md`: a 30+ question bank by Key Stage and Bloom level, plus an end-of-unit project rubric.
- `animation-briefs.md`: five short explainer animation briefs.

---

## A note for the busy teacher

If you have one lesson and forty minutes, do this. Pick the Key Stage block for your class, open the matching lesson plan, read the matching Part 4 file the night before, print the one worksheet it names, and run it. Everything else in this part is there to deepen, extend, or reassure. None of it is a prerequisite for a single good lesson.
