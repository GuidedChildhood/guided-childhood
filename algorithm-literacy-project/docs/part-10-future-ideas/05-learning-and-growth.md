# Part 10, Theme 5: Learning and Growth

*Ideas 101 to 125. A recommendation system is, accidentally, one of the most powerful informal teachers a child encounters. This theme asks what happens if we make that teaching deliberate: feeds that build skills, follow curiosity, and grow a child rather than merely holding them. Part 7 rates learning as one of the more tractable wellbeing outcomes, because it has shorter horizons and corroborating signals (a quiz score, a finished project), so several of these are more buildable than the wellbeing ideas.*

Feasibility labels follow the repository convention: **High**, **Medium**, **Low**, **Speculative**. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

---

### 101. School Learning Modes

**How it would work.** A mode, switchable for homework time or in class, that re-ranks the feed toward content aligned with what the child is currently studying, drawing on a curriculum the child or teacher selects. [SPECULATIVE].

**Problem it solves.** The same feed that distracts from homework could support it if it knew what the child was learning.

**Technical feasibility.** Medium. Mapping content to curriculum topics is feasible but quality control is hard.

**Potential risks.** "Educational" content varies wildly in quality; alignment can be shallow or wrong.

**Educational value.** High.

---

### 102. Skill-Tree Feeds

**How it would work.** Interests are organised as a visible skill tree (like a game's), and the feed offers the "next unlock" content that builds on what the child already knows, turning a flat feed into a path of progression. [SPECULATIVE].

**Problem it solves.** Feeds keep a child at the same level forever. A skill tree gives direction and a sense of getting better.

**Technical feasibility.** Low. Sequencing content by skill prerequisite at scale is a hard structuring problem.

**Potential risks.** Over-gamification; the tree's structure encodes a contestable view of mastery.

**Educational value.** High.

---

### 103. Curiosity Engines

**How it would work.** Instead of optimising for engagement, a mode optimises for *follow-up curiosity*: it favours content that leaves the child asking a new question, measured by what they choose to explore next. [SPECULATIVE].

**Problem it solves.** Engagement and curiosity diverge; sticky content often deadens curiosity. A curiosity objective chases the better thing.

**Technical feasibility.** Low. Defining and measuring "productive curiosity" is genuinely hard.

**Potential risks.** Curiosity proxies can be gamed into clickbait questions.

**Educational value.** High.

---

### 104. Mentor Recommendations

**How it would work.** The system surfaces not just content but *people* worth learning from in a child's interest area (a vetted creator, a club, a local expert), recommending relationships and guidance rather than only videos. [SPECULATIVE].

**Problem it solves.** Feeds recommend content endlessly but never the human mentor who would accelerate real growth.

**Technical feasibility.** Low. Vetting and safely connecting children to mentors is a hard safety problem.

**Potential risks.** Child-safety stakes are very high; any human connection feature needs rigorous safeguards.

**Educational value.** High.

---

### 105. The "Go Deeper" Path

**How it would work.** Any item offers an optional ladder downward into the topic: a quick explainer, then a richer one, then a primary source, letting a child descend from a viral clip to real understanding. [SPECULATIVE].

**Problem it solves.** Feeds keep everything shallow and lateral. A depth ladder lets curiosity convert into knowledge.

**Technical feasibility.** Medium. Requires linking content by depth, which is partly automatable.

**Potential risks.** Depth content is scarcer and harder to vet for quality.

**Educational value.** High.

---

### 106. Spaced-Repetition Feed

**How it would work.** For things a child has shown they want to learn, the feed gently re-surfaces key ideas on a spaced-repetition schedule, using the feed itself as a memory aid. [SPECULATIVE]; spaced repetition is [ESTABLISHED] in learning science.

**Problem it solves.** Feeds optimise for novelty and so forget everything; learning needs deliberate revisiting.

**Technical feasibility.** Medium. The scheduling is well understood; integrating it into a feed is the new part.

**Potential risks.** Repetition can feel repetitive; needs to be framed as revision, not filler.

**Educational value.** High.

---

### 107. Project Feeds

**How it would work.** When a child declares a project ("build a birdhouse", "learn a song"), the feed assembles a coherent sequence of content that supports it from start to finish, rather than scattered clips. [SPECULATIVE].

**Problem it solves.** Feeds are terrible at supporting a sustained goal; they pull toward the next shiny thing.

**Technical feasibility.** Low. Assembling a genuinely coherent project sequence is hard.

**Potential risks.** Incoherent or unsafe sequences for practical projects; needs curation.

**Educational value.** High.

---

### 108. The Knowledge Gap Spotter

**How it would work.** From what a child watches, the system spots prerequisite gaps ("you keep hitting algebra you haven't learned") and gently offers the missing piece, the way a good tutor notices what is blocking you. [SPECULATIVE].

**Problem it solves.** Children get stuck on content above their level and bounce off; a gap-spotter offers the missing rung.

**Technical feasibility.** Low. Inferring conceptual prerequisites reliably is hard.

**Potential risks.** Misdiagnosed gaps frustrate; can feel like being told you are behind.

**Educational value.** High.

---

### 109. The Apprentice Mode

**How it would work.** For a chosen craft, the feed adopts an apprenticeship structure: observe, then guided practice, then feedback, recommending content that matches the child's current stage of learning a skill. [SPECULATIVE].

**Problem it solves.** Watching is not learning; an apprenticeship structure pushes toward doing.

**Technical feasibility.** Low. Stage-aware sequencing plus practice prompts is ambitious.

**Potential risks.** Practice without real feedback can entrench errors.

**Educational value.** High.

---

### 110. Cross-Subject Connectors

**How it would work.** The feed deliberately draws lines between a child's interests and school subjects ("the physics behind your favourite skate trick"), making formal learning feel connected to what they already love. [SPECULATIVE].

**Problem it solves.** School and feed live in separate worlds; connectors bridge intrinsic interest to curriculum.

**Technical feasibility.** Medium. Relating content across domains is partly tractable.

**Potential risks.** Forced or shallow connections can feel like a teacher trying too hard.

**Educational value.** High.

---

### 111. The Misconception Catcher

**How it would work.** When content a child engages with contains a common misconception, the feed follows up with a clear correction framed as an interesting twist, not a telling-off. [SPECULATIVE].

**Problem it solves.** Feeds spread misconceptions and never correct them; a catcher closes the loop.

**Technical feasibility.** Low. Detecting specific misconceptions in content is hard and error-prone.

**Potential risks.** Wrongly flagging correct content; corrections can themselves be wrong.

**Educational value.** High.

---

### 112. Reading-Level Aware Recommendations

**How it would work.** The feed matches text and explanation complexity to the child's reading level and gently stretches it over time, scaffolding literacy through everyday content. [INFERENCE]; readability scoring is [ESTABLISHED].

**Problem it solves.** Content pitched wrong (too hard or too easy) wastes a learning opportunity.

**Technical feasibility.** Medium. Readability is measurable; matching it to a child needs care.

**Potential risks.** Reading level is a crude proxy; can underestimate a child.

**Educational value.** High.

---

### 113. The Question Box

**How it would work.** A child can drop any question into a box, and the feed answers it not with a single source but with a small, balanced set of explanations to compare, modelling how to learn from multiple sources. [SPECULATIVE].

**Problem it solves.** Children get one answer from one source. A multi-source answer teaches triangulation.

**Technical feasibility.** Medium.

**Potential risks.** Sources must be vetted; risk of authoritative-sounding wrong answers.

**Educational value.** High.

---

### 114. Effort-Aware Difficulty

**How it would work.** The feed notices when a child is coasting and offers a slightly harder, more rewarding challenge, keeping them in the productive zone between boredom and frustration. [SPECULATIVE]; flow theory is partly [ESTABLISHED].

**Problem it solves.** Feeds default to easy, passive content; calibrated challenge sustains genuine engagement and growth.

**Technical feasibility.** Low. Estimating optimal challenge per child is hard.

**Potential risks.** Misjudged difficulty discourages; "challenge" must be inviting, not punishing.

**Educational value.** High.

---

### 115. The Portfolio Feed

**How it would work.** As a child creates and learns, the system helps assemble a private portfolio of what they have made and mastered, recommending next steps based on their actual demonstrated work. [SPECULATIVE].

**Problem it solves.** A child's growth leaves no trace and informs no recommendation; a portfolio makes growth the basis of what comes next.

**Technical feasibility.** Medium.

**Potential risks.** Portfolio data is personal; must stay child-controlled.

**Educational value.** High.

---

### 116. Socratic Recommendations

**How it would work.** Instead of always answering, the feed sometimes recommends a good *question* to sit with, or content that poses a puzzle, training the child to think rather than to be told. [SPECULATIVE].

**Problem it solves.** Feeds spoon-feed conclusions; a Socratic mode builds reasoning.

**Technical feasibility.** Low. Generating genuinely good questions at the right level is hard.

**Potential risks.** Frustrating if overused; not every moment wants a question.

**Educational value.** High.

---

### 117. The Skill Swap Network

**How it would work.** The system connects children who can teach each other (one good at drawing, one at coding) through safe, supervised exchanges, recommending peers as learning partners. [SPECULATIVE].

**Problem it solves.** Peer teaching is powerful and underused; a feed could broker it safely.

**Technical feasibility.** Low. Safe child-to-child connection is a serious safeguarding challenge.

**Potential risks.** High child-safety stakes; needs strong supervision and design.

**Educational value.** High.

---

### 118. Learning Streaks Worth Having

**How it would work.** Rather than streaks of mere presence, the system rewards streaks of genuine learning milestones (a concept understood, a project advanced), tying motivation to growth not attendance. [SPECULATIVE].

**Problem it solves.** Streak mechanics reward showing up, not learning. Redefining the streak redirects the motivation.

**Technical feasibility.** Low. Measuring real learning milestones automatically is hard.

**Potential risks.** Gameable "milestones"; pressure can sour intrinsic motivation.

**Educational value.** High.

---

### 119. The Expert Lens

**How it would work.** A child can view any topic "through the eyes of" a vetted expert persona (a marine biologist, a historian), and the feed re-ranks to show what that expert would find interesting, modelling expert attention. [SPECULATIVE].

**Problem it solves.** Children rarely see how an expert filters a field; the lens makes expert taste learnable.

**Technical feasibility.** Low. Modelling expert preferences faithfully is hard.

**Potential risks.** Caricatured experts mislead; needs real grounding.

**Educational value.** High.

---

### 120. Curriculum-Linked Serendipity

**How it would work.** When a child is studying a topic at school, the feed occasionally drops a delightful, unexpected item connected to it, reinforcing learning through pleasant surprise rather than drill. [SPECULATIVE].

**Problem it solves.** School learning is reinforced poorly outside the classroom; serendipitous tie-ins make it stick.

**Technical feasibility.** Medium.

**Potential risks.** Tenuous links feel forced; quality bar must be high.

**Educational value.** High.

---

### 121. The Build-in-Public Feed

**How it would work.** A child working on something can opt into a small, safe audience of peers who follow their progress, with the feed recommending encouragement and relevant help at each stage. [SPECULATIVE].

**Problem it solves.** Learning in isolation lacks motivation and feedback; a safe audience supplies both.

**Technical feasibility.** Low. Safe peer audiences for children are hard to provision.

**Potential risks.** Exposure and comparison risks; needs strong safety and opt-in.

**Educational value.** High.

---

### 122. Failure-Friendly Recommendations

**How it would work.** When a child struggles with something, the feed offers content that normalises failure and shows others' messy first attempts, building resilience instead of serving only polished success. [SPECULATIVE].

**Problem it solves.** Feeds are full of effortless-looking mastery, which discourages. Showing the struggle behind it rebuilds courage.

**Technical feasibility.** Medium. Identifying "honest struggle" content is the work.

**Potential risks.** Could surface genuinely discouraging content if misjudged.

**Educational value.** High.

---

### 123. The Synthesis Prompt

**How it would work.** After a child has explored a topic across several items, the feed invites them to pull it together ("In your words, what did you learn about volcanoes?"), turning consumption into understanding. [SPECULATIVE].

**Problem it solves.** Watching many videos rarely consolidates into knowledge; a synthesis prompt forces the integration step.

**Technical feasibility.** Medium.

**Potential risks.** Feels like a test if framed wrong; must be inviting.

**Educational value.** High.

---

### 124. Interest-to-Career Windows

**How it would work.** The feed occasionally connects a child's interest to the real-world paths it could lead to (where a love of animation or animals can go), broadening horizons without pressure. [SPECULATIVE].

**Problem it solves.** Children rarely see how a passion connects to a future; gentle windows widen aspiration.

**Technical feasibility.** Medium.

**Potential risks.** Can narrow or pressure if heavy-handed; keep it light and plural.

**Educational value.** High.

---

### 125. The Teacher Co-Pilot

**How it would work.** A teacher can seed a class's learning-mode feed with a topic and a few trusted sources, and the system extends from there, giving educators a hand on the recommendation wheel for their pupils. [SPECULATIVE].

**Problem it solves.** Teachers have no influence over the feeds shaping their pupils; a co-pilot gives them a constructive lever.

**Technical feasibility.** Medium. Teacher seeding plus controlled expansion.

**Potential risks.** Teacher bias enters the feed; needs transparency and limits.

**Educational value.** High.
