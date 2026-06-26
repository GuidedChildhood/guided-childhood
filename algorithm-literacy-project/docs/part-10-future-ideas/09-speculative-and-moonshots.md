# Part 10, Theme 9: Speculative and Moonshots

*Ideas 186 to 200. This is the deliberately ambitious tail of the collection. Everything here is [SPECULATIVE] by design: concepts that depend on technology, institutions, or social agreement that do not yet exist at the required scale. We include them because the boundary of the possible is worth pushing on paper before it is worth building, and because some of today's ordinary features were yesterday's moonshots. We hold to the repository's honesty: a moonshot is a provocation, not a plan.*

Feasibility labels follow the repository convention. Everything here is **Speculative**; we add a phrase on *why*, and where a component is more tractable we say so. See [`EPISTEMICS.md`](../../EPISTEMICS.md).

---

### 186. On-Device Personal Recommender Agents

**How it would work.** Each child has their own recommender that runs entirely on their device, learns only locally, and acts as their agent, requesting content from platforms but ranking it by the child's own goals rather than the platform's. [SPECULATIVE]; on-device ML is partly [ESTABLISHED], but full agency at this scale is not.

**Problem it solves.** Today the recommender serves the platform's objective; a personal agent flips loyalty to the child and keeps data on the device.

**Technical feasibility.** Speculative. On-device models are real, but platforms exposing raw content to be re-ranked elsewhere cuts against their business model.

**Potential risks.** Platforms resist; a personal agent can be misconfigured or hijacked; uneven access by wealth.

**Educational value.** High.

---

### 187. Value-Aligned RL With Child Assent

**How it would work.** The recommender is trained with reinforcement learning whose reward is shaped by the child's own reflectively endorsed values, gathered through ongoing, age-appropriate assent rather than inferred from clicks. [SPECULATIVE]; RL from human feedback is [ESTABLISHED], but eliciting a child's reflective values reliably is not.

**Problem it solves.** Optimising for revealed clicks ignores what a child actually endorses; assent-based reward aims at the reflective interest directly.

**Technical feasibility.** Speculative. The alignment machinery exists; reliable, non-coercive elicitation of a child's values is the unsolved part.

**Potential risks.** Children's values are still forming; assent can be coerced or shallow; reward hacking remains.

**Educational value.** High.

---

### 188. The Right to Be Forgotten by the Algorithm

**How it would work.** A child can ask the system to genuinely unlearn a phase of their life, so that an old obsession or a painful episode leaves no residue in future recommendations, verified and permanent. [SPECULATIVE]; machine unlearning is an active but immature research field.

**Problem it solves.** A child's worst moment or outgrown phase should not haunt their feed forever; true forgetting restores a clean slate.

**Technical feasibility.** Speculative. Verifiable unlearning in large continuously trained models is an open research problem.

**Potential risks.** Forgetting can be abused to evade safety history; "verified" forgetting is hard to prove.

**Educational value.** Medium.

---

### 189. Recommender Second Opinions

**How it would work.** A child can ask a completely independent recommender (run by a different organisation with different values) what *it* would show them, and compare, the way one seeks a second medical opinion. [SPECULATIVE]; depends on open APIs (idea 174) existing.

**Problem it solves.** A single recommender is a single point of view with no check; a second opinion exposes its choices as choices.

**Technical feasibility.** Speculative. Requires interoperable access that platforms do not currently grant.

**Potential risks.** The second opinion can be wrong too; comparison can confuse younger children.

**Educational value.** High.

---

### 190. Time-Capsule Feeds

**How it would work.** A child can seal a snapshot of their interests and a few favourite things to be reopened years later, and the system can recommend a "then and now" reflection, making personal growth visible across time. [SPECULATIVE].

**Problem it solves.** Feeds erase the past; a time capsule lets a child meet their younger self and see how they have changed.

**Technical feasibility.** Speculative as a feature, though the storage is trivial; the reflective experience is the hard design.

**Potential risks.** Stored snapshots are sensitive long-term data; nostalgia can be monetised.

**Educational value.** High.

---

### 191. The Lifelong Learning Companion

**How it would work.** A single, child-owned, portable recommender-companion that follows a person from childhood across every platform and decade, accumulating an understanding of their growth and consistently serving their flourishing. [SPECULATIVE].

**Problem it solves.** Recommenders restart and fragment across services and life; a lifelong companion offers continuity aligned to the person, not the platform.

**Technical feasibility.** Speculative. Requires portability, interoperability, and trust infrastructure that do not yet exist.

**Potential risks.** A lifelong dossier is the ultimate privacy concentration; capture would be catastrophic.

**Educational value.** High.

---

### 192. Dream-Aware Wind-Downs

**How it would work.** With deep, consented physiological integration, the evening feed adapts to support good sleep and restful transitions, retreating entirely as the body signals readiness for sleep. [SPECULATIVE].

**Problem it solves.** Late feeds wreck sleep; a sleep-aware system would actively protect it rather than exploit the pre-sleep window.

**Technical feasibility.** Speculative. Requires intimate biometric integration with serious privacy and safety stakes.

**Potential risks.** Biometric and sleep data are extremely sensitive; intimacy of the data invites abuse.

**Educational value.** Low.

---

### 193. Collective Child-Designed Feeds

**How it would work.** Children across the world collaboratively govern and tune a shared recommendation system for their age group through a kind of standing youth assembly, deciding together what a good feed should do. [SPECULATIVE].

**Problem it solves.** Adults design every feed children use; collective child governance gives the actual users real authorship.

**Technical feasibility.** Speculative. The governance design, not the code, is the moonshot.

**Potential risks.** Manipulation of the assembly; tyranny of the loudest; hard to make representative.

**Educational value.** High.

---

### 194. The Wisdom Feed

**How it would work.** A long-horizon recommender that optimises explicitly for what a person would, decades later, be glad they spent time on, using long-term self-report and the reflections of adults about their own childhoods as training signal. [SPECULATIVE].

**Problem it solves.** Every metric we have is short-horizon; a wisdom objective aims at lifetime value, the thing we actually care about.

**Technical feasibility.** Speculative. The horizon is far beyond any trainable feedback loop today (Part 7's core tension in its purest form).

**Potential risks.** Whose wisdom defines the target is profoundly contestable; paternalism risk is severe.

**Educational value.** High.

---

### 195. Emotion-Honest AI Companions

**How it would work.** A companion that helps a child reflect on their feed while being radically honest about its own nature and limits ("I am a program, not a friend, here is what I can and cannot help with"), designed against parasocial dependence. [SPECULATIVE].

**Problem it solves.** AI companions risk fostering unhealthy attachment; an honesty-first design tries to be useful without pretending to be a friend.

**Technical feasibility.** Speculative as a safe product; the conversational tech is closer to [ESTABLISHED], the safety is not.

**Potential risks.** Even honest companions can foster dependence; high stakes for vulnerable children.

**Educational value.** High.

---

### 196. Federated Family Recommenders

**How it would work.** A family runs a shared recommender that learns across members using federated learning, so the household benefits from collective patterns while each person's raw data never leaves their own device. [SPECULATIVE]; federated learning is partly [ESTABLISHED].

**Problem it solves.** Family-level recommendation usually means pooling sensitive data; federation gets the shared benefit without the pooling.

**Technical feasibility.** Speculative at this scope, though federated learning itself is real.

**Potential risks.** Federated systems still leak some signal; family power dynamics complicate consent.

**Educational value.** Medium.

---

### 197. The Counterfactual Childhood Simulator

**How it would work.** A research and education tool that lets a family or class safely simulate how different feed designs would shape a child's media life over years, making the long-term stakes of design choices tangible. [SPECULATIVE]; builds on Part 8's simulations.

**Problem it solves.** The long-term effects of feed design are invisible until too late; a simulator makes them explorable in advance.

**Technical feasibility.** Speculative for accuracy, though illustrative versions are [ESTABLISHED] (see Part 8).

**Potential risks.** Simulations can mislead if taken as prediction; false precision is the danger.

**Educational value.** High.

---

### 198. Self-Sovereign Interest Identity

**How it would work.** A child controls a cryptographically self-sovereign record of their interests that they selectively reveal to services, granting and revoking access at will, owning their preference identity outright. [SPECULATIVE]; self-sovereign identity is an emerging field.

**Problem it solves.** Interest profiles are owned by platforms; self-sovereignty puts ownership and control with the child.

**Technical feasibility.** Speculative. The identity tech is maturing; usability for children is far off.

**Potential risks.** Key loss, complexity, and uneven access; children cannot manage cryptographic keys unaided.

**Educational value.** Medium.

---

### 199. Recommender Diversity Mandate at the Ecosystem Level

**How it would work.** Society deliberately maintains a plurality of differently designed recommenders for children (commercial, public, educational, family-run) the way it maintains a free press, so no single ranking logic dominates childhood. [SPECULATIVE].

**Problem it solves.** Monoculture in ranking is a systemic risk; ecosystem diversity is a structural safeguard against any one design's blind spots.

**Technical feasibility.** Speculative. A policy and market-structure goal more than a technical one.

**Potential risks.** Fragmentation and confusion; hard to sustain plurality against scale economics.

**Educational value.** High.

---

### 200. The Reflective-Interest Optimiser

**How it would work.** The culminating idea of this part: a recommender whose explicit objective is the gap between a child's revealed impulses and their reflective interests, actively working to serve the latter and to *shrink that gap over time* by helping the child's choices and values converge. [SPECULATIVE].

**Problem it solves.** It names the whole design philosophy of Part 10 as a single objective: optimise for who the child wants to become, not only for what they tapped, and help them grow into the chooser they would endorse.

**Technical feasibility.** Speculative. It presumes we can measure reflective interest, the hardest measurement problem in the entire collection (Part 7).

**Potential risks.** Defining and optimising "reflective interest" risks deep paternalism; whoever specifies it holds enormous power; the child must remain the ultimate author.

**Educational value.** High.
