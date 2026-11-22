# New in the app, 2 of 3: What would you like help with?

**Draft. Not posted, not scheduled.** Carousel, 7 cards, in
`built/new-02-what-would-you-like-help-with/`. Deck:
`decks/02-what-would-you-like-help-with.json`. Lead: DiGi. This post is the
stage check itself, so it ends there by being it.

## The cards

1. The twelve things parents ask us for help with.
2. It starts with one question. (the question and the first two tiles)
3. Games, what they see, the feed, bedtime.
4. Group chats, the rules, homework, YouTube.
5. Spending, AI, and anything else on your mind.
6. Tick one. You get the words to say and one thing to try tonight. Then the plan keeps going, and brings up the next one for their age.
7. Save it for the night one of these comes up. Send it to the parent who said it was just their house.

## Caption, Instagram

We asked what parents actually post about, on Mumsnet and in the UK surveys, and put the twelve that came up most on one screen.

Coming off screens is still number one. Asking for a phone is two. Who they talk to in games is three.

Each one comes with the words to say and one thing to try tonight. And it is not a one time form: as they grow, the next one comes up for their age, like the first phone or the first group chat.

Which one is yours this week?

What stage is your child? Three questions, no sign up. Link in our bio.

## Caption, Facebook (card 2 on its own)

We put the twelve things parents ask us about most on one screen.

Coming off screens. Asking for a phone. Who they talk to in games. What they come across online. Social media. Bedtime screens. Group chats. They get round the rules. Homework and school. Endless YouTube. Spending in games. AI chatbots. And something else, in your own words.

Tick what is on your mind. For each one you get the words to say, something to try tonight, and a plan that keeps going as they grow.

It is the second of three questions on our free stage check. No sign up: guidedchildhood.com/v/new-02-fb

Which one is it in your house this week?

## Alt text

1. Headline: The twelve things parents ask us for help with. DiGi, the gold star, on a gold path.
2. The app screen: What would you like help with? Coming off screens, a calm ending, not a nightly row. Asking for a phone, know when they are truly ready.
3. Four tiles: Who they talk to in games, What they come across online, Social media, Bedtime screens, each with one line of what we bring.
4. Four tiles: Group chats, They get round the rules, Homework and school, Endless YouTube.
5. Three tiles: Spending in games, AI chatbots, Something else.
6. Headline: Tick one. You get the words to say and one thing to try tonight.
7. Save and send card.

## Links

`new-02`, `new-02-fb`.

## Proof paths

- The question and the twelve, in order: `app/(marketing)/starter-pack/page.tsx` (q2), `lib/onboarding/worries.ts`. Evidence and order: `plans/2026-11-16-worry-question-top-12.md` (Mumsnet log plus UK surveys and Ofcom; Reddit and Facebook groups could not be read, so the caption says "Mumsnet and in the UK surveys", nothing wider).
- "The words to say, something to try tonight, a plan that keeps going": the screen's own subhead. Each tile line is the short form of its answer in `lib/content/proof.ts`.
- "The next one comes up for their age": `lib/push/flashpoint-heads-up.ts` and the age up cron, named in the page's own comment.
- Two tile lines changed today so no tile promises "safe" (`lib/onboarding/worries.ts`, this PR). The cards were captured after the change.
