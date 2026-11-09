# The tells

Justin, 29 September 2026: do not use words or punctuation that let an algorithm,
or a reader, place the writing as machine written.

This file is the list. `content-engine`, `viral-post`, `family-social`,
`silent-ugc` and `linkedin-comment-replies` all load it. `scripts/check-ai-tells.mjs`
enforces the half of it that a machine can judge; the other half is on the
writer, because it needs an ear.

## Why this is a craft rule and not a disguise

The posts are Justin's. His thesis, his decisions, his name, his judgement about
what to publish. Writing them so they sound like him is accuracy, not
concealment. What the tells actually betray is not "a machine helped" but
"nobody chose these words", and that is the thing worth removing. A sentence
that survives this list is a sentence somebody meant.

So the test for every entry below is the same: does removing it make the writing
more like a person talking, or just harder to detect. Only the first kind belongs
here. Nothing in this file is about evading a platform's disclosure of synthetic
images or video, which is a separate question and is not covered.

## Hard, the guard fails on these

**Dashes of any kind.** Em dash, en dash, minus sign, and a hyphen used as
punctuation between words. Already a non negotiable in CLAUDE.md and, until this
file, enforced nowhere on marketing copy. The em dash is the single most
recognisable tell in circulation. Use a comma, a full stop, or restructure.

Hyphens inside a real compound word are fine. So are file paths, URLs and code.

**The banned phrases.** The full list is in the guard. The spine of it:

it is worth noting, it is important to note, in today's world, at the end of the
day, that being said, having said that, with that in mind, let us dive in, delve,
leverage as a verb, game changer, unlock, seamlessly, in conclusion, I hope this
helps, feel free to, great question, you raise a valid point, thanks for sharing,
navigate the landscape, in an era where, more than ever, the reality is, truth be
told, when it comes to, plays a crucial role, it is not about X it is about Y.

**The correction shapes.** These read as machine before the sentence even lands:

- "It is not just X, it is Y."
- "This is not about X. It is about Y."
- "X is not Y. X is Z."
- "Not only X, but also Y."

Justin uses contrast constantly and should keep doing it. The fix is to let the
second half arrive as its own sentence without the scaffolding announcing it.
"It is not literacy. It is the willingness to stay." is the shape done right,
because the first half is a real claim being denied, not a strawman erected to
be knocked down.

**Signposting.** Here is the thing. Let me explain. What is interesting is. The
key takeaway. Here is why that matters. Cut the signpost and say the thing.

## Soft, the writer's ear, not the guard

These are all legitimate moves that become tells through repetition, so a guard
firing on them would cost more than it caught. They belong in the read back.

**The rule of three everywhere.** Three adjectives, three examples, three short
sentences, over and over. One triple in a post is rhythm. Four is a machine.

**Even paragraph lengths.** Every paragraph two sentences, every sentence about
the same length. Real writing is lumpy. A one word paragraph next to a six line
one is what a person does.

**Symmetry in the close.** Ending by restating the opening in the same shape.
The winning post does not do this, it ends on an instruction and a question.

**Restating the question before answering it.** "You asked about X. X is..."

**Hedging in both directions in one sentence.** "While it is true that X, it is
also the case that Y." Pick one and put the concession in its own sentence,
which is the honest pivot the viral-post formula is built on anyway.

**Adverb pile up.** Genuinely, honestly, truly, incredibly, absolutely. The
comment reply skill already bans several of these as reflexes.

**Too many words with no cost.** A paragraph nobody would be annoyed to lose.
If cutting it changes nothing, it was machine filler.

## The meter, for the soft half

Justin, 9 November 2026, asked how to avoid AI detection, since detectors look
for groupings of words, and whether there is a tool.

Two things are worth knowing before reaching for one.

**The groupings model is the old one.** Perplexity and burstiness is what the
first generation of detectors measured, and GPTZero moved off it in 2023 for an
end to end classifier. The phrase half of the problem is what `npm run ai-tells`
already covers.

**And you cannot aim at a detector.** Independent testing puts real world false
positive rates around 18 percent, and a 2026 follow up found a mean of 61.3
percent on essays by non native English writers, because careful, plain, evenly
built prose is exactly what the statistical methods call machine written. A score
is noise. Rewriting good sentences to beat it makes the writing worse, which is
the opposite of the point.

So `npm run rhythm` aims at Justin instead. It measures a draft against the
rhythm of his own writing, from `founder-context.md` and `founding-story.md`.
**It prints and never fails a build**, because everything in the soft list above
is a judgement.

His baseline, as of 9 November: mean sentence 12.8 words, **spread 79 percent**,
shortest 1, longest 116, 17 percent of his sentences five words or fewer,
paragraph spread 52 percent, rule of three in **1.6 percent** of sentences.

What it found on the first run, across seven long form issues:

- **Triads at 6.7 to 8.3 percent against his 1.6.** Four to five times his rate.
  The most consistent tell in our drafts.
- **Sentence spread below his** in five of seven, worst at 62 percent. Uniform.
- **Mean sentence length 15.1 to 16.3 against his 12.8.** We write longer than he
  does, every time.
- **"That is" opening sentences at four to seven times his rate**, and "I have"
  opening sentences he never opens that way.

One caution learned on the same run. The first version counted repeated openers
raw, and flagged "it is" across every issue, which looked like a fingerprint. It
is not: normalised, we use it 1.7 times his rate and he uses it freely. **Compare
rates to his, never raw counts**, or the tool will send you to flatten prose that
already sounds like him. It still cannot tell a style tic from a proper noun, so
it flags things like a source's name appearing at the start of six sentences.

## The read back

Before any copy goes to Justin, read it as if he said it out loud to another
parent at the school gate. The tells above all fail that test in the same way:
they are how something sounds when it is assembled rather than said.
