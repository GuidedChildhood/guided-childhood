# Diagrams

Architecture diagrams for recommendation systems, written in [Mermaid](https://mermaid.js.org/) so they render directly on GitHub. Each diagram has a plain-language caption underneath.

These are simplified teaching diagrams. Real production systems have many more stages, caches, and safety filters. See [Part 2](../docs/part-02-platform-analysis) for the fact-versus-inference detail per platform.

---

## 1. The two-stage recommender: the shape of almost every feed

```mermaid
flowchart LR
    A[Huge catalogue<br/>millions of items] --> B[Candidate generation<br/>retrieval]
    B --> C[Few hundred candidates]
    C --> D[Ranking model<br/>predict engagement and value]
    D --> E[Ordered shortlist]
    E --> F[Re-ranking<br/>diversity, safety, business rules]
    F --> G[Your feed]
    G --> H[You act<br/>watch, like, skip]
    H -->|signals| I[Logged behaviour]
    I -->|training data| D
    I -->|update profile| B
```

**Caption.** Out of millions of items the system first retrieves a shortlist that might suit you (candidate generation), then puts that shortlist in order (ranking), then adjusts for diversity and safety (re-ranking). What you do next becomes the training data that shapes tomorrow's feed. That last arrow is the feedback loop, and it is the heart of personalisation.

---

## 2. The feedback loop, drawn as a cycle

```mermaid
flowchart TD
    P[Your profile<br/>interest vector] --> R[Recommendations]
    R --> B[Your behaviour<br/>watch time, clicks, skips]
    B --> S[Signals are logged]
    S --> U[Profile updated]
    U --> P
```

**Caption.** A loop with four steps: the system guesses your taste, shows you things, watches what you do, updates its guess. Run this loop thousands of times and the feed becomes startlingly personal. If exploration is low, the loop can also narrow your world. See the echo chamber simulation in Part 8.

---

## 3. Candidate generation: the two-tower retrieval model

```mermaid
flowchart TB
    subgraph User side
    U1[User features<br/>history, context] --> U2[User tower<br/>neural network]
    U2 --> UE[User embedding]
    end
    subgraph Item side
    I1[Item features<br/>topic, audio, text] --> I2[Item tower<br/>neural network]
    I2 --> IE[Item embedding]
    end
    UE --> M[Nearest-neighbour search]
    IE --> M
    M --> C[Top candidates]
```

**Caption.** A common way to shortlist from millions of items quickly. One network turns the user into a short list of numbers (an embedding), another turns each item into the same kind of numbers, and the system finds the items whose numbers sit closest to the user's. This is fast because item embeddings can be computed in advance. [INFERENCE] Most large platforms use a retrieval design in this family.

---

## 4. Multi-task ranking: predicting many things at once

```mermaid
flowchart TB
    F[Shared features] --> S[Shared layers]
    S --> E1[Expert 1]
    S --> E2[Expert 2]
    S --> E3[Expert 3]
    E1 --> T1[Will you click?]
    E2 --> T2[Will you finish?]
    E1 --> T3[Will you like?]
    E3 --> T4[Will you share?]
    E2 --> T5[Will you be satisfied?]
    T1 --> W[Weighted combination]
    T2 --> W
    T3 --> W
    T4 --> W
    T5 --> W
    W --> Score[Final ranking score]
```

**Caption.** Modern ranking models predict several outcomes at once: click, completion, like, share, satisfaction. Each prediction is multiplied by a weight and added up into one score. The choice of weights is a values choice in disguise: weight watch time heavily and you get one kind of feed, weight reported satisfaction heavily and you get another. This is the design space Parts 6 and 7 explore. Based on YouTube's published MMoE system (Zhao et al. 2019).

---

## 5. Engagement objective versus a wellbeing objective

```mermaid
flowchart LR
    subgraph Engagement-first
    EA[Maximise watch time<br/>and session length] --> EB[Side effects:<br/>narrowing, late nights,<br/>arousal-favouring]
    end
    subgraph Wellbeing-aware
    WA[Blend engagement with<br/>diversity, calm, reported<br/>satisfaction, time-of-day] --> WB[Trade-offs:<br/>lower short-term engagement,<br/>harder to measure]
    end
```

**Caption.** Two different definitions of success produce two different feeds. Neither is free. An engagement-first objective is easy to measure but has side effects. A wellbeing-aware objective is kinder in intent but harder to measure and usually costs short-term engagement, which is why it is commercially difficult. Part 7 weighs this honestly.

---

## 6. Exploration versus exploitation

```mermaid
flowchart TD
    D{Decide what<br/>to show next} -->|most of the time| X[Exploit:<br/>show known favourites]
    D -->|small fraction, epsilon| E[Explore:<br/>try something new]
    X --> O[Reliable but narrowing]
    E --> N[Risky but broadening]
    O --> L[Learn a little]
    N --> L2[Learn a lot]
```

**Caption.** Every recommender faces this choice on every slot: give you more of what it knows you like (exploit) or take a chance on something new to learn more (explore). Too little exploration and your feed shrinks to a bubble. Too much and it feels random. The balance is a dial, and Part 5's code lets you turn it.

---

*To edit these, change the Mermaid code blocks above. GitHub renders them automatically. For slides or print, paste a block into the [Mermaid Live Editor](https://mermaid.live).*
