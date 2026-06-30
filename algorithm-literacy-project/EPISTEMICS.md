# Epistemics: How We Label What We Know

The single most important habit in this repository is telling the truth about how sure we are. Recommendation systems are mostly built behind closed doors. Some things about them are published and peer reviewed. Some things can be reasonably inferred by anyone who understands the engineering. Some things are honest guesses about the future. These are not the same, and we never let them blur together.

Every substantive claim in this repository carries one of three labels.

---

## The three labels

### Established research

> **What it means:** Supported by peer-reviewed studies, replicated findings, or primary technical documents published by the platforms themselves.

We use this label when there is a citation you can check. Examples: the architecture of YouTube's deep candidate generation network (Covington et al. 2016, published at RecSys), or the finding that false news spreads faster than true news on Twitter (Vosoughi, Roy, and Aral 2018, published in *Science*).

A reader should be able to follow the citation and verify the claim. Established does not mean certain. Science updates. But it means the claim has cleared a bar of evidence and review.

In the documents we mark this with:

```
[ESTABLISHED] False news diffused significantly farther and faster than true news (Vosoughi et al. 2018).
```

### Plausible engineering inference

> **What it means:** Not officially confirmed by the platform, but a reasonable conclusion for anyone who understands how large-scale ranking systems are built.

Platforms rarely publish the current details of their production systems. But the field shares a common toolbox: two-tower retrieval, multi-task ranking networks, gradient boosted trees, embeddings, real-time feature stores. When we say "TikTok almost certainly uses a multi-task ranking model with strong real-time features," we are inferring from public engineering talks, job postings, patents, and the behaviour of the product, not quoting a confirmed fact.

Inference can be wrong. We flag the reasoning so you can judge it yourself.

```
[INFERENCE] TikTok's rapid adaptation implies near real-time feature updates and short retraining loops, consistent with how comparable streaming ranking systems are built.
```

### Speculative

> **What it means:** A forward-looking idea, a design proposal, or a hypothesis that has not been built or tested at scale.

Parts 6, 7, and 10 contain many speculative ideas: wellbeing-optimising feeds, digital nutrition scores, family recommendation modes. These are valuable as design provocations, but they are not yet evidence. We label them clearly so no one mistakes a hopeful idea for a proven result.

```
[SPECULATIVE] A feed that optimises for next-day reported mood could, in principle, reduce late-night doomscrolling, but this has not been tested in a large deployed system.
```

---

## Why three labels and not two

It would be easier to split the world into "facts" and "opinions." But the most interesting and most misunderstood territory is the middle: the plausible engineering inference. Most public discussion of algorithms lives there without admitting it. Someone says "the algorithm is designed to make you angry." That is usually an inference, sometimes a reasonable one, but it is presented as established fact. By naming inference as its own category, we make the discussion honest.

---

## How we handle disagreement in the research

Some of the most cited questions in this field are genuinely unsettled. The clearest example is the relationship between social media use and adolescent mental health.

- Large correlational studies find associations that are real but small (Orben and Przybylski 2019, *Nature Human Behaviour*).
- Some researchers argue the small average hides larger effects for vulnerable subgroups (Twenge and colleagues).
- Others argue that causation runs in multiple directions and that the panic outruns the data (Odgers and Jensen 2020).
- More recent books argue for a stronger causal story (Haidt 2024).

We do not pick a winner. We present the range, cite the strongest work on each side, and label the conclusion as **contested**. A fourth informal tag, `[CONTESTED]`, appears where the research community itself has not settled.

---

## What we will never do

- Invent a citation, a DOI, or a study that does not exist.
- Present an inference as a confirmed fact.
- Claim a platform "intends" a harm without strong evidence of intent. Optimising for engagement can produce harmful side effects without anyone designing those harms on purpose. That distinction matters and we keep it.
- Use a child's fear to make a point. The tone throughout is calm, curious, and empowering.

---

## A worked example

Take the sentence: *"The algorithm wants you to stay up late."*

Here is how we would unpack it.

- **Established:** Many recommender systems are trained to maximise engagement signals such as watch time and session length (Covington et al. 2016; Zhao et al. 2019). This is published.
- **Inference:** A system that maximises session length will, as a side effect, tend to surface content that keeps a session going, including late at night, because that is when the objective is still being optimised.
- **Speculative:** Whether a child stays up *because* of this, versus would have stayed up anyway, is hard to prove and depends on the child.
- **What we would never say:** "The engineers want children to lose sleep." There is no evidence of that intent, and the side-effect explanation is both kinder and more accurate.

The algorithm does not "want" anything. It optimises an objective. Teaching children that difference is most of the battle.
