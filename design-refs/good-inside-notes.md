# Good Inside — Design & UX Reference

Source: Full onboarding + marketing flow documented June 2026.
Apply these patterns to all Guided Childhood pages. Use our brand colours, not GI's.

---

## Flow Structure to Copy

```
1. Landing — "Our job / Your job" headline → single CTA
2. Onboarding quiz — one question per screen, progress bar + back arrow
3. Reassurance screen — "You're in the right place." + tailored one-liner
4. Platform preview — "Here's what you'll get" personalised to their answers
5. Pricing — "Imagine yourself a year from now..." + plan cards with border-highlight
6. Risk reversal — "14 days. Not right for your family? Full refund."
7. Email capture → Account creation → Payment → Get started
```

Steps 7 onward belong in the Next.js platform build, not the static HTML pages.

---

## Headline Pattern: "Our job / Your job"

Structure: bold label at the start of the sentence, then lighter continuation.

```
Our job: [what we deliver — specific, not abstract]
Your job: [one simple action — make it feel achievable]
```

GI example:
"Our job: a win in your home every day you open the app."
"Your job: download the app now, not later."

GC application:
"Our job: the right script for tonight, the warning signs to know, and one clear next step."
"Your job: answer three questions. Two minutes. Free."

---

## Reassurance Screen (after quiz, before result)

Show after the final question. Short, warm, tailored to their challenge.
One big line. One supporting line. One CTA.

```
"You're in the right place."
[One-line tailored to their challenge]
[Show my pack →]
```

Keep the background the same cream. Do not add complexity.

---

## Vivid Future Framing (on pricing / join CTA)

Place above any join/pricing card. Not salesy — honest and warm.

GI: "Imagine yourself a year from now. Calmer, more confident, with a stronger relationship with your child."

GC application:
"Imagine this time next year. You know exactly what to say. The conversations don't spiral. Your child comes to you."

---

## Risk Reversal / Guarantee

Always near or on the join CTA. Never hidden.

GI: "Don't love it within 14 days? It's on us."
GC application: "Not right for your family in 30 days? Full refund. No questions asked."

---

## Plan Card Selection

When showing pricing tiers:
- Default: border: 1.5px solid var(--border)
- Selected: border: 2px solid var(--green-dark) + radio dot filled green
- "BEST VALUE" badge: gold pill on the recommended plan
- Feature list: bold heading + one-line description, checkmark icon before each

---

## Quiz Screen Layout

- Logo centred at top (not left-aligned nav bar)
- Progress bar below logo: 8px tall, gold fill, grey remainder, with back arrow left
- Step counter: "Question 2 of 3" in mono below bar
- Question: large (h2), left-aligned
- Sub: small, muted
- Options: full-width card buttons, number badge left, hover = green-lt border
- Auto-advance on selection (no CONTINUE button needed — faster UX)

---

## Visual Tokens (GI → GC translation)

| GI pattern | GC equivalent |
|------------|---------------|
| Warm cream #FEFBE8 background | var(--cream) #F7F3EE |
| Gold/yellow CTAs | var(--gold) + var(--gold-hover) shadow |
| Teal/green selected state | var(--green-dark) |
| Full-width bottom CTA | .btn display:block width:100% |
| Card: white, subtle border, 12-16px radius | .card or .box with border-radius:20px |
| Progress bar: gold fill | var(--green-dark) or var(--gold) |
| Back arrow: thin, left of progress bar | ← in mono font |
| "BEST VALUE" badge | gold pill with var(--gold-lt) bg |

---

## What GI Does That We Skip (for now)

- Expert-led workshops (add later)
- Video content library (add later)
- Live coaching sessions (add later)
- Community/private forum (add later)
- Co-parent/second account feature (add later)

---

## Copy Tone Rules (from GI — already matches Justin's voice)

- Acknowledge the hard thing first ("We get the later urge")
- Never lecture ("Not gentle — sturdy")
- Specific over vague ("use your first tool in under 2 minutes")
- Warm parentheses for empathy ("Parenting asks so much.")
- Always give them a way out without shame ("if you really can't download right now — that's real")
