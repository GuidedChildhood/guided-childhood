# GDC-046 · The age is the easy part

Justin, 23 October 2026: wrote this one himself and asked for it to go in Drive
with a GDC number, with his most viral image format copied and a contrarian
stat chosen for it.

## What was changed, and what was not

The post is his, and the argument, the structure and the voice are untouched.
The edits were: three typos, one doubled space, and the closing line, which
arrived as "Super interested to find our If you had to judge..." and is now the
question on its own. `viral-post` is explicit that the close is one question
with nothing after it, and the question is stronger alone.

Body 2,086 characters, inside the band. Hook 92 characters, well inside the
mobile fold. Twelve paragraphs. One question, at the end. No dashes.

**The opening was left exactly as he wrote it.** "I have built a product around
the word readiness and I still cannot tell you how to test it" is a declared
uncertainty, which is one of the two shapes that wins on this account, and it is
the best line in the post. The 365 day numbers say an evidence opening also
wins; they do not say it wins by more. Forcing a number into that sentence would
have cost more than it bought.

## The contrarian stat, and why this one

The obvious choice was a number about harm. The contrarian one is that **there
is no single age at all**. Everybody argues about which number is right without
noticing there are three live answers for the same child in the same year:

| Age | Where it comes from |
|---|---|
| 13 | The platform minimum in most terms of service, traced to US children's privacy law rather than to anything about thirteen year olds |
| 16 | The UK social media restriction, announced June 2026, enforcement from 2027 |
| 18 | Character.AI, which ended open ended chats for under eighteens from 25 November 2025 |

Justin's draft asserted all three. The eighteen was the one worth checking, and
it holds: Character.AI announced it on 29 October 2025 under lawsuits and an FTC
inquiry, with the cutoff on 25 November.

## The card

`stat-card.html` in this folder, rendered to `gdc-046-card.png` at 1080 by 1350.
Same system as the beta = 0.061 card: cream, one terracotta accent used on the
hero, the kicker and the footer, editorial serif, generous space.

**The bars were removed rather than invented.** The proven card carries two bars
because it had a real ratio, 32 percent against 3 percent. This post has no
ratio. Putting bars on it would have been a data visualisation of nothing, so
the card is hero, caption and kicker, and the layout was recentred so the cream
reads as deliberate instead of as a gap.

**One limitation.** Google Fonts is blocked from the build container, so the
rendered PNG fell back to Georgia instead of Playfair Display. Opening
`stat-card.html` in a browser on a machine with network access and screenshotting
at 1080 by 1350 gives the intended face. The PNG is usable as it stands; it is
just not the final typeface.

## The post

I have built a product around the word readiness and I still cannot tell you how to test it.

That is the uncomfortable centre of this, and picking a better age does not make it go away.

Everyone argues about the number. Thirteen for an account. Sixteen for social media. Eighteen for an AI companion. I understand why. An age is enforceable, auditable, the same for every child, and a regulator can write it down.

What an age cannot do is describe the child in front of you. I know this, having three very different children.

One child can turn thirteen without knowing that an AI which sounds caring does not care. Without understanding that a chatbot can be confidently wrong about something it has no business being confident about. Without noticing when a conversation is being kept going rather than finished. With no idea when to stop talking to a machine and go and find a person.

So what would a readiness test actually look like.

Not a quiz. A child can pass a quiz on Monday and hand over their address on Friday. Not a certificate either, because the whole point is that it moves as they grow and as the technology does.

The closest I have got is three things a parent can see for themselves. Can the child explain, in their own words, why this thing is showing them this. Can they tell you about a time they stopped. And do they come to you when something turns, which depends entirely on whether coming to you went well enough last time that they would do it again.

That last one is the real test, and it is not about the child at all.

Our stage check is an attempt at this and I will not dress it up as more. Three questions about your own child, and a stage with the things worth practising next. A starting point rather than a measurement. We have no outcome evidence that a child who finishes a stage behaves differently afterwards, and almost nobody in this field does.

An age tells you when the door opens. It tells you nothing about who walks through it.

If you had to judge whether a child was ready for something online, what would you actually look at?

### First comment

Where the three ages come from, since the card leans on them. Thirteen is the platform minimum in most terms of service, which traces back to the United States children's privacy law rather than to any finding about thirteen year olds. Sixteen is the UK social media restriction, announced June 2026 with enforcement from 2027. Eighteen is Character.AI, which ended open ended chats for under eighteens from 25 November 2025 after lawsuits and an FTC inquiry, replacing them with a narrower creative experience. Three different answers about the same child, each arrived at by a different route, and none of them derived from evidence about what a child at that age can actually do. On our own stage check, I meant the line in the post literally: we have no outcome evidence that a child who finishes a stage behaves differently afterwards. It is three questions and a starting point, not a measurement, and I would rather say that than imply otherwise. If anyone knows of a readiness instrument for children online that has been tested against what children actually do later, I would genuinely like to read it.

## What was deliberately not said

- **No claim that our stage check works.** The post says the opposite, in his
  words, and the first comment repeats it. That is the strongest thing in it.
- **No outcome claim about any child.** The three signals are things a parent can
  observe, not predictors.
- **The children appear only as a count.** "Three very different children", no
  names, no ages, no behaviour, which is below the bar set by GDC-044 and does
  not spend a scene from the green list.

## What would make this post wrong

If a tested readiness instrument for children online does exist, the closing
admission is overstated and the first comment's invitation is the right way to
find out. If Character.AI reversed the under eighteen policy, the eighteen on
the card goes and the stat becomes two ages, not three.
