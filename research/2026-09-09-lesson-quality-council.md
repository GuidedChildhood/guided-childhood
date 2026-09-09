# The lesson quality council: what four agents found

**What this is.** Justin, 9 September 2026: benchmark our sample lessons against
the best school lesson providers, make the appearance, style and children's
interaction the best possible as well as the content, and map the whole thing.
Four research agents were run in parallel. This document holds what they found,
with our own code and database checked against every claim they made about us.

**Status.** All four returned. Nothing here is applied to the scheme yet.

**A note on method that matters.** Every claim an agent made about OUR product
was checked against our code and database before it was written down here. Three
of those checks came back the other way, and they are marked below. An agent
guessing about your own codebase is the cheapest kind of wrong to catch.

---

## 1. The finding that matters most: we teach recognition, not recovery

Online safety education across the whole field teaches children to spot danger.
It almost never teaches what to do in the hour after it has already gone wrong:
who to tell, what to screenshot, what to say, what happens next. Recognition is
taught well, recovery is rarely taught and almost never measured
([Halliwell et al., 2026](https://bpspsychub.onlinelibrary.wiley.com/doi/10.1111/bjdp.70038)).

Our 21 modules follow the field. This is the clearest differentiator available
to us and it is sitting in plain sight.

The same review found that **planning and goal setting**, the two behaviour
change techniques with the best track record, are the two least used in this
field. Our close phase is a recap. It should send every child out with a
written if then plan for one named situation.

---

## 2. What the evidence does not support, checked against our code

Each of these was verified in our repository, not taken on the agent's word.

| What we do | Where | What the evidence says |
| --- | --- | --- |
| 70 percent of choice slides is a pass | `LessonPlayer.tsx:808` | It proves recall on the day. In this subject knowledge reliably moves while behaviour does not ([Cochrane, 2015](https://www.cochrane.org/evidence/CD004380_school-based-programmes-prevention-child-sexual-abuse)). Do not call it proof of learning |
| The starter quiz carries retrieval | all 21 modules | The EEF's own trial found no attainment difference between a retrieval starter and a discussion starter ([EEF, 2023](https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/teacher-choices-trial-a-winning-start)). Keep it, stop leaning on it |
| An image per point | slide design | Dual coding has limited applied classroom evidence and adds load ([EEF review, 2021](https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/cognitive-science-approaches-in-the-classroom)). Keep only images that carry information words cannot |

The stronger effect we are not using at all is **spacing across weeks**
(d = 0.54 in real classrooms, [Mawson and Kang, 2025](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12189222/)).
Every starter should pull from a module three to six weeks back, not only the
last one. That needs a schema field we do not have.

---

## 3. The five changes to the lesson arc, ranked

1. **A recovery cycle in every module.** Not risk recognition. What to do after.
2. **The close becomes a plan, not a recap.** A written if then plan per child.
3. **Spaced retrieval across weeks.** A new field pulling from an earlier module.
4. **Fade the worked example across the three cycles.** Model, then complete,
   then independent. High assistance helps novices (d = 0.505) and actively
   harms those with prior knowledge (d = minus 0.428,
   [Tetzlaff et al., 2025](https://www.sciencedirect.com/science/article/pii/S0959475225000660)).
   This is a cycle template change, not a content change.
5. **A real norm on every module where children overestimate a behaviour**,
   sourced from Ofcom, with the number on the slide. Normative messaging is
   small but real (d = 0.1 across 89 trials,
   [Nature Human Behaviour, 2025](https://www.nature.com/articles/s41562-025-02275-6))
   and it helps most exactly where children overestimate, which is true of
   sending images, gaming spend and always being online.

**Does any of this change behaviour?** Yes, under conditions. A Vietnamese
randomised trial of 1,399 pupils cut stranger contact by 13.6 to 23.4
percentage points
([Computers in Human Behavior, 2024](https://www.sciencedirect.com/science/article/abs/pii/S0747563224000931)).
Cyberbullying programmes cut perpetration by 10 to 15 percent across 44 trials
([Trauma, Violence and Abuse, 2025](https://doi.org/10.1177/15248380251375480)).
The conditions are: multi session, skills based, whole school, and children
practising the behaviour rather than hearing about it. We satisfy the first
three. The fourth is where practise being 9 percent of our slides bites.

**And fear does not work.** The PSHE Association warns that shocking input is
likely to have the opposite effect to the one intended, partly because fear in
a safe setting reads as exciting. The hard evidence of active harm comes from
Scared Straight, where the odds of offending rose to about 1.6 to 1
([Campbell Collaboration, 2013](https://onlinelibrary.wiley.com/doi/10.4073/csr.2013.5)).

---

## 4. The visual floor, and where we sit against it

ISO 9241-303 sets minimum legible cap height at 16 arc minutes. On a two metre
projected image with the back row at eight metres, anything every child must
read needs about **50px on a 1920 canvas**, and the question of the moment
wants **64px**.

Measured in our own player:

| Element | Ours | Needs |
| --- | --- | --- |
| Main heading, projector | `clamp(2.2rem, 4.5vw, 3.2rem)` = 35 to 51px | 50px+, so this one is fine at full width |
| Body, options, steps | 1.15 to 1.5rem = 18 to 24px | 40px absolute floor |
| Emoji and icons | 2.4rem = 38px | 40px+ |

Our design brief (`plans/kids-player-design.md`, move 8) already sets 40pt for
question text and 24pt as the absolute floor. The 40pt for questions is right.
**The 24pt absolute floor is about half what the back of the room needs.**

The brief also already calls for a higher contrast token variant for classroom
mode, and that has not been built. Cream on cream washes out under classroom
lighting with the blinds up.

---

## 5. Interaction: the highest yield thing we do not have

Ranked by learning produced per minute of class time, with no pupil devices.

1. **Mini whiteboards, everybody shows.** Every child commits before anyone
   reveals, on a "3, 2, 1, show me". The teacher reads the room in three
   seconds. We do not have this.
2. **Think, pair, share with three timed phases on screen** and the sentence
   stem printed large. High quality classroom talk is worth about six months
   additional progress.
3. **Cold call with a visible three second wait bar.** Teachers wait about one
   second by default; three seconds changes the length and quality of answers
   ([Rowe, 1986](https://journals.sagepub.com/doi/10.1177/002248718603700110)).
   The pupil's name goes in the teacher rail, never on the projected slide.
4. **Whole class vote**, every option carrying a colour *and* a shape *and* a
   number, so it works for the one in twelve boys with colour vision deficiency.
5. **One child at the board with a job for everyone else**, used sparingly
   because twenty nine children are otherwise passive.

**Hands up caps participation at roughly half the class and stays there.** If a
slide is designed around hands up it reads as participation and delivers half a
room.

---

## 6. The traps, which pass a design review and fail in a classroom

- A full bleed photograph behind the question. Fails coherence and contrast at
  once. Decoration goes between questions, never behind text.
- Speed scoring. It produces guessing and concentrates stress on exactly the
  children we are teaching about online harm.
- A named leaderboard on the projector. The one place in the room where being
  bottom is public.
- Autoplay pacing. A slide that advances itself removes the teacher's only tool
  for reading the room.
- One visual language from Reception to Year 13. A Year 9 who sees the same
  character as their Year 1 sibling stops listening, and no amount of content
  quality recovers it.
- A personal disclosure question projected at 120px. "Has anyone here been
  bullied online" is a safeguarding incident waiting to happen. Distance it
  through a character, always.
- Assuming sound. Most teachers run projectors muted, so a slide that only
  works with audio does not work.

---

## 7. Honest limits on this research

- **The EEF website was blocked by the network proxy**, so EEF claims reached us
  through search summaries and mirrored guidance rather than direct fetches.
  Anything we publish citing the EEF must be re-fetched from the primary source
  first. This matters because the EEF is the citation a UK head teacher trusts
  most.
- ISO 9241, the British Dyslexia Association, WCAG and the PSHE Association were
  read from primary or official documents.
- Two of the four agents have not reported. The provider benchmark in
  particular may reprioritise everything above.

---

## 8. The provider benchmark

**Oak National Academy is the benchmark, not Twinkl.** Oak is free, needs no
login, claims use in 72 percent of schools, and its RSHE units are named almost
exactly like ours. Our real competition on price is zero.

The three to benchmark against:

1. **Oak National Academy.** Same subject, same year groups, near identical unit
   titles, already in most schools. If our lesson is not visibly better than
   Oak's, we have no argument.
2. **Kapow Primary.** The paid incumbent at our price point, and its teacher
   subject knowledge video attacks our weakest flank, the non specialist
   teaching a hard topic. £215 to £333 plus VAT per subject by school size.
3. **Common Sense Education.** The best lesson artefact set in our topic
   anywhere: timed steps, a teacher version of every pupil handout, a real
   family artefact translated into several languages. American, and still the
   design target.

Not Twinkl, which is a resource bank rather than a scheme. Not Century, a
different product. Not BBC Own It, retired in 2024.

### Our actual advantage

Everybody else hands the teacher **files**. Oak hands over a PPTX, a worksheet
and four quiz PDFs, and the teacher still opens PowerPoint and reads it. Common
Sense puts its downloads behind a free account. Nobody in the UK set runs the
lesson for the teacher in a browser with a live pass mark.

**That is the one button, and we already have it.** The gap is that our
catalogue page does not make it obvious in the first thirty seconds, and we are
priced above the free incumbents.

### The gap list, corrected by checking our own code

| Gap the benchmark named | What we actually found |
| --- | --- |
| Separate quiz answer keys | **We have them.** Both quiz routes take an `?answers` parameter that renders the answer version. **But it is linked from nowhere.** A teacher cannot find it without knowing the URL. One line to fix |
| Minutes on each lesson phase, on screen | **We have this.** The prep page shows total minutes, slide count, interactive count and the phase breakdown before the teacher presses play |
| Teacher version of every pupil handout | **Genuinely missing.** The booklet has no answer or annotation layer |
| One click bundle of everything | **Genuinely missing.** This is the real one button gap |
| Teacher subject knowledge video per module | Missing. A term of production, twenty one modules |
| Pupil facing lesson video with transcript | Missing |
| Content guidance and supervision flag before opening | We have a DSL note; it is not surfaced pre lesson the way Oak surfaces it |
| Live per pupil response data | Missing. Nearpod's capability |
| Family take home artefact, translated | Our parent note is thinner than Common Sense's |
| Third party quality mark | Missing. PSHE Association, from £1,500, and they explicitly do not assess whole key stage programmes |

### What not to copy

- **Twinkl's volume model.** It sells search results and leaves the coherence
  problem with the teacher. That is the opposite of one button.
- **Common Sense's account gate on a free lesson.** Oak needs no login and sits
  in 72 percent of schools. Our open catalogue is the land grab.
- **Century style adaptivity in this subject.** An algorithm quietly deciding
  which child meets the sextortion content is a safeguarding problem, not a
  feature.
- **The quality mark for the whole scheme.** They do not assess whole key stage
  programmes. Quality mark one or two flagship modules and cite those.

---

## 9. AI and children: what we can and cannot say

This is the highest risk area we have, because AI claims age badly and a wrong
number in front of a head teacher costs the sale and the trust.

### The finding that is our thesis in one sentence

**Unrestricted chatbot access harms learning, and guardrails remove the harm.**
Near 1,000 secondary pupils, randomised: free access produced 17 percent lower
exam grades, and the harm disappeared when guardrails were added
([Bastani et al., PNAS, 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122)).

That is the single most useful sentence in this entire research pass. It is the
argument for teaching AI rather than banning it, it is defensible to a hostile
expert, and it is exactly what we already believe.

### A landmine we nearly stepped on

The most cited study claiming ChatGPT boosts learning, the one with the famous
large effect size, was **retracted in April 2026**
([Retraction Note](https://www.nature.com/articles/s41599-026-07310-z)).
Anyone still quoting that figure is quoting a withdrawn paper. It appears
throughout the edtech marketing of our competitors.

### Five statements we can make with confidence

1. Teaching children to use AI without guardrails makes them worse at the exam.
2. AI saves British teachers real planning time without lowering resource
   quality: 259 teachers, 68 schools, 31 percent less planning time, with a
   blind expert panel finding no quality drop (EEF and NFER, 2025). This is a
   **workload** claim, never an attainment claim, because attainment was not
   measured.
3. Evidence that AI improves pupil outcomes is thin, and Ofsted says so.
4. AI companion chatbots are a safeguarding category now, not an IT question.
   KCSIE 2026 treats generative AI simulating harmful interaction as a contact
   risk, in force from 1 September 2026.
5. Children are not waiting for the curriculum. Around six in ten 8 to 17s use
   generative AI.

### Five we must never say

| Never say | Say instead |
| --- | --- |
| Studies show ChatGPT boosts learning by a large margin | The pooled evidence collapsed under scrutiny, so we teach the guardrails the one strong trial validated |
| AI delivers a personal tutor for every child, the two sigma promise | Two sigma has never replicated. Real tutoring is worth about 0.37 of a standard deviation, and AI is not yet a good tutor |
| 65 percent of children will work in jobs that do not exist yet | Traced to no source, and the named originator denies producing it. We cannot forecast the jobs, so we teach judgement |
| Our detector will catch AI cheating | Detectors falsely flagged 61 percent of essays by non native English speakers. Detection punishes your EAL pupils. Design the task instead |
| AI is rewiring children's brains | That headline rests on a preprint of 54 adults aged 18 to 39. We have good evidence about offloading effort, and none about brains |

### The sales window

The Curriculum and Assessment Review (November 2025) recommends a broader
Computing GCSE covering AI, and media literacy prioritised in the statutory
primary curriculum. New curriculum spring 2027, first teaching September 2028.

### What must be checked before any of this goes to a school

Four figures rest on secondary summaries because the primary PDFs were
unreachable from the research session: the exact Ofcom 2026 generative AI figure
and its base, the exact Ofsted wording on limited evidence, the KCSIE 2026
paragraph numbers, and the NFER confidence interval on the 31 percent.

---

## 10. Honest limits, restated

The network proxy blocked direct fetches of the EEF, Ofcom, gov.uk, NFER, Kapow,
Twinkl, the PSHE Association, Thinkuknow, Childnet and several others. Claims
from those sources reached us through the search index rather than the page
itself. **Every one of them must be re-fetched from the primary source before it
appears in anything a school reads.** This matters most for the EEF, which is
the citation a UK head teacher trusts above all others.
