# DiGi always answers, and tells us when it did not

**2 August 2026.** Lane: platform. Migration claimed: **150**.

Justin hit a failure, lost his message, and asked the right question:

> "Would it have answered this if longer to think? How can we make sure it
> answers these questions"

The answer to the first is almost certainly no. Every measured request that
afternoon reached the model in under 3.5 seconds. Something that dies at 65
seconds when the normal case is 4 is broken, not thinking.

---

## What the first real numbers said

Four rows, his session, 14:05 to 14:09.

| UK time | auth | gather1 | lane | gather2 | prompt | model | total |
|---|---|---|---|---|---|---|---|
| 14:05:35 | 229 | 395 | **1332** | 309 | 144 | 2777 | 5185 |
| 14:06:56 | 225 | 339 | **774** | 250 | 129 | 2517 | 4235 |
| 14:08:16 | 59 | 263 | 0 | 268 | 109 | 3299 | 3998 |
| 14:08:59 | 63 | 168 | 0 | 164 | 115 | 3416 | 3926 |

Two findings, one expected and one not.

**Expected:** the model is 65 to 85 percent of the wait. Our own code costs
about a second. There is no slow query to go and find.

**Not expected:** `lane` cost 1332ms and 774ms on the first two and nothing on
the last two. That is `classifyLane` falling through the keyword pass and
paying for a model call to answer a question a word would have answered. His
message was about Teo and the television, and **tv, telly and netflix are not
in the keyword list**. Tested, not assumed:

```
NO MATCH  <- Teo wakes up sbd puts tv on first thing then cries...
NO MATCH  <- he wont get off the telly
NO MATCH  <- she watches netflix all evening
MATCH "iPad"  <- too much iPad in the mornings
```

A list with youtube, roblox and xbox in it but not the television, in a product
whose whole argument is that it is not the device but what is on it.

---

## The thing I got wrong this morning

Migration 149 measures how long every phase took and **not whether an answer
came out**. So when Justin asked which of those four rows was his failure, I
could not tell him. I measured the speed and forgot the outcome.

Worse, the same error text covers two unrelated failures:

```
line 417:  if (!mainResponse)   -> "DiGi took too long to answer"   // instant, empty
line 443:  catch                 -> "DiGi took too long to answer"   // hung for 65s
```

An empty reply that arrived in four seconds and a request that hung for over a
minute read identically to a parent and identically in the logs. That is the
same fault as everything else this week: one confident sentence covering two
different truths.

---

## What gets built

### 1. Retry once, quietly

The parent should not be the retry mechanism. One automatic second attempt on a
failed send, before any error is shown. Most transient failures die on the
second try and nobody ever knows.

Not two retries. A second failure means something real is wrong, and hammering
it makes a slow system slower.

### 2. Never a dead end

CLAUDE.md non-negotiable 1: **DiGi always returns a calibrated pathway.** An
error box is a dead end, which is exactly what that rule forbids. When both
attempts fail, DiGi still answers: thinner, honest about being thinner, and
about the thing the parent actually asked.

### 3. Record whether it answered

`replied`, `reply_chars` and `failure` on `digi_latency`. Then "did DiGi
answer?" is a question the data can answer, and the two failure modes stop
looking the same.

### 4. The vocabulary, properly

Everything a child in 2026 actually watches, plays and scrolls. Television and
streaming, social platforms, games and their currencies, creators and formats,
devices. Roughly 200 words rather than 90.

Deliberately excluded, because a false positive breaks the general lane that
this whole mechanism exists to serve: bare `x`, `prime`, `lol`, `kick`,
`signal`, `watch`. The phrases go in instead (`prime video`, `apple tv`).

### 5. Keywords live in the database

If Justin taps a button to add a word, the list cannot be a TypeScript array.
Same rule as scripts, non-negotiable 6.

`digi_lane_keywords`, seeded with the full list. Read in the **first gather
round**, which is already parallel, so a database backed list costs nothing on
the clock. Cached in module scope with a short window so most requests do not
query at all. If the read fails, the built in list still answers, because a
routing hint must never be the reason a parent gets no reply.

### 6. The misses report, and the button

Every message that falls through the keyword pass leaves its candidate words in
`digi_lane_misses`. Weekly in Insights, founder only: the words that keep
turning up, ranked by how many families said them, with one tap to add a word
to the live list.

**The privacy rail.** Words, never messages. Stopwords and names dropped,
capped per message. And nothing surfaces until **two or more separate families**
have used it, so one family's word is never shown to anybody. That is the same
de-identification rule that governs `rebuildWisdom`: counts and labels we
chose, never a family's own words.

---

## Rails

- **A routing hint is never load bearing.** Every new read fails soft to the
  built in list. Nothing here can stop a parent getting an answer.
- **Retry once, not twice.**
- **Nothing auto adds itself.** A suggested word becomes a live word when
  Justin taps it, exactly as the research bank works.
- **The keyword list is a speed optimisation, not a safety mechanism.** Every
  failure still lands on the parenting lane, which loses least by being wrong.

---

## Separately: a third migration collision is already in flight

PR 676 carries `149_script_categories.sql` and `149_digi_latency.sql` is
already on main. That is the third this week, and unlike the two 147s it is
still catchable, because 676 is open. It should renumber to 151, since this
plan takes 150.

Documenting the rule has now failed three times. This PR adds a CI check that
fails on duplicate migration numbers, so there cannot be a fourth.
