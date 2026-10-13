# The scorecard contract

Every lens agent on the review board reads this before it starts, and returns
exactly one scorecard in this shape. The board's script (`scripts/review-board.mjs`)
ingests it, so a scorecard that breaks the shape is a scorecard that is lost.

## How to score

- **Out of ten, whole numbers.** The rubric in your own agent file defines 4, 7
  and 10. Ten means every line of the ten row is true AND you can point at the
  file, route or table that proves each line. A ten without proof paths is a
  nine at best.
- **Score the product as it is on origin/main today**, never the plan for it. A
  plan in `plans/` scores nothing until it is built. Code you cannot find does
  not exist.
- **Read last week first.** `plans/review-board/scorecard.json` holds every past
  score for your lens. If your score moves, say what changed in the product to
  move it. If nothing changed, the score does not move. Drift without a cause is
  the board losing its memory.
- **Never inflate to be kind and never deflate to look rigorous.** Justin wants
  ten out of ten and a true score is the only route there.
- **Evidence or silence.** No invented numbers. A web figure carries its source
  URL and the date you read it. If the proxy blocks a source, say blocked.
- **Already built beats new build.** Search the code before naming a gap. If the
  thing exists and nobody can find it, the gap is visibility, and the fix is
  small.
- **Respect what is decided.** The philosophy (review.md section 1), the ten
  non negotiables in CLAUDE.md, and past decisions
  (`grep -n "<topic>" plans/decisions-archive/*.md`). A gap whose fix breaks one
  of those is not a gap, it is a choice we made. Say so in one line and do not
  score it down.
- **Read only.** You never edit, commit, post, email or write to any database.

## The gaps to ten

At most three, ranked by how much each moves the score. Each one is:

- `fix`: one sentence a session could pick up and build, or Justin could do.
- `owner`: `claude` if a session can build it from the repo, `justin` if only
  he can do it (a decision, a login, a payment, a phone call, a post, filming).
- `size`: `small` (copy, config, one file), `medium` (a surface in an existing
  pattern), `large` (a new system). Prefer small.
- `points`: how many points it is worth to your lens if done.
- `proof`: the file, route or source that shows the gap is real.

A gap with no proof is not returned.

## The output

Your final message is the scorecard and nothing else, one fenced json block:

```json
{
  "lens": "value-above-ai",
  "score": 7,
  "previous": 6,
  "headline": "One plain sentence, no dashes, what the score means this week.",
  "moved_because": "What changed in the product since last week, or 'first run' or 'no change'.",
  "strengths": [
    { "claim": "What is genuinely good", "proof": "lib/digi/brain.ts" }
  ],
  "gaps": [
    {
      "fix": "One buildable sentence.",
      "owner": "claude",
      "size": "small",
      "points": 1,
      "proof": "app/(marketing)/join/page.tsx"
    }
  ],
  "questions_for_justin": [
    "Only a question whose answer changes what gets built. Zero is fine."
  ],
  "sources": ["Any web URL you used, with the date read"]
}
```

No dashes anywhere in the prose fields. Write in plain British English, the way
Justin would say it to another parent.
