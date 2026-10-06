# LinkedIn · DiGi talks back, keeps track, and checks in

Three posts in Justin's voice, about what went live on 2 October 2026 (PR
1185 and PR 1186). Run them in this order, two or three days apart. The /starter-pack link is used
once in the pack, in post three's first comment, never in a post body.

Read with `content/brand-story/founder-context.md`: one true scene at most,
small. Only the scenes in that file are used, and nothing is added to them.

---

## Post one · Where you ask matters more than what you ask

Pillar: founder story, the build. Format: text only. About 1,900 characters.
Best moment: Tuesday or Wednesday morning, 7:30 to 8:30.

15 out of 40.

That is how often parents answered a three tap question from us when it sat inside the daily check in, right next to the worry it was about.

The same three taps, asked on a separate card a few days later: 0 out of 6.

Same parents. Same question. The only thing that changed was where it was asked and when.

I am going to give you the honest part first. These are tiny numbers from our own product, not a study. Forty and six would not survive a peer reviewer and I would not ask them to.

But it changed how we build, and today it changed how DiGi works.

Most parenting advice is a one way street. The book does not ask how Tuesday went. The podcast does not ring back. So nobody, the parent included, ever finds out what actually worked for this child.

So from today, when a parent tells DiGi what is hard right now, each worry goes onto their daily check in and stays there until they say it is sorted. DiGi gives one thing to try. One, not ten. And a few days later it asks how that went, right there on the check in, beside the worry it was for.

Not on a card. Not in an email. In the place the parent is already thinking about it.

Every answer goes back into what DiGi knows about that family, so the next idea is a new one rather than the same one again.

I used to think the clever part of a product like this was the answer. I now think it is the question afterwards, and where you ask it.

If you have ever been given good advice, what made you actually go back and try it?

### Prepared first comment

The numbers, so nobody has to take my word for it: inside the check in, 15 answered out of 40 asked; on a separate card, 0 out of 6. Measured in our own product in September 2026 and written into the code where the decision was made. Too small to generalise from, which is why the post says so. The design point stands either way: ask where the parent already is.

---

## Post two · We were asked for "Hey DiGi". We said no.

Pillar: founder story, design ethics. Format: text, or a 60 second face to
camera script (below). About 2,000 characters. Best moment: two or three days
after post one.

The most obvious feature request we had for DiGi was a wake word. Say "Hey DiGi" from across the kitchen and it answers.

We did not build it.

A wake word means a microphone open all day, listening for its name, in a family home. A web page cannot do it, and I would not want ours to even if it could.

So here is what we built instead, and the rules we gave it.

You can talk to DiGi. Tap the microphone, say what is happening, and your words land in the box first so you can fix them before anything sends.

Ask out loud and it answers out loud. But not the whole answer. One line. Usually the words to say to your child, so you hear them before you say them. Nobody wants a lecture read to them in a hallway.

Reading aloud is off until you switch it on. One tap anywhere stops it.

There is a hands free mode for when your hands are full. It only runs while the page is open. It is off every time you open the page and it never remembers being on. Two quiet minutes and it switches itself off.

We never keep a recording. DiGi only ever gets the words.

Now the honest bit. "We never keep a recording" is not the same as "nothing leaves your phone". The browser does the listening, which means Chrome sends the sound to Google to turn into words, and Safari sends it to Apple. Exactly what the microphone on your keyboard already does. I would rather you heard that from me than found it in a privacy policy.

None of this is clever engineering. It is a set of choices about what a tool in a family home should not do.

What is one thing you wish the tech in your house would not do?

### Prepared first comment

For anyone who builds: every one of those rules is checked in code on every change, not just written in a document. Off by default, one tap stops it, no audio captured, never in the child's app, hands free never remembered. If a future change breaks one, the build fails.

### Face to camera version, 60 seconds

Open on Justin, kitchen, phone in hand.

"Everyone asked us for a 'Hey DiGi'. We said no. A wake word is a microphone listening all day in your home. So instead, you tap, you talk, it says back the one line to say to your child, and one tap shuts it up. It is off until you turn it on. Hands free only while the page is open. No recordings kept. The browser does the listening, so Google or Apple turn your voice into words, same as your keyboard mic. I would rather tell you that than bury it. What should the tech in your house never do?"

---

## Post three · Tell it what went wrong

Pillar: the loop, the product in one idea. Format: PDF carousel (breakdown
below) or text. About 1,800 characters. Best moment: two or three days after
post two.

Here is the whole idea behind Guided Childhood in one line.

You tell it what actually went wrong today. It gives you the one thing to do and the words to say. And then it keeps track.

Today the keeping track got real.

I lived the problem it is for. Timers. Rules. A screen going off and a child in tears. Arguments in the car about what to watch. Trying to make homework come before everything else. Each one handled, forgotten, and handled again the next week, because nothing ever wrote down what we had tried.

So now, in DiGi:

Tell it what is hard right now, typed or out loud.

Each worry goes on your daily check in and stays there until you say it is sorted.

It gives you one thing to try for it.

A few days later it asks how that went, on the check in, beside that worry.

And if you want a nudge, say "remind me at six to start the wind down" and the reminder arrives at six.

The honest bit. This does not fix a child. Nothing on a phone does. What it does is stop the parent carrying the whole job of remembering, which is most of the job.

And it will never tell you to allow something or ban it. A verdict ends a conversation. It tells you where your child is, the next step, and the words.

The research I trust keeps pointing at the same thing. How a child does online has much more to do with the life around the screen than the screen itself. The adults around them matter most. So we built for the adult.

What is the one worry you would hand to someone else to keep track of?

### Prepared first comment

If you want to see where your child is on the pathway, it is three questions and no sign up: guidedchildhood.com/starter-pack

And on the research line, for anyone who wants the source: Candice Odgers' 2024 review in Nature argues that blaming social media distracts from the bigger causes, and calls for investing in the adults around children. That is the bit I mean.

### Carousel breakdown (6 slides, 1080 x 1350)

1. "Tell it what went wrong today."
2. "Each worry goes on your daily check in."
3. "One thing to try. Not ten."
4. "A few days later, it asks how it went."
5. "Remind me at six. It arrives at six."
6. "It never says allow or ban. Where you are, the next step, the words."

---

## Claims and where they come from

| Claim | Source |
|---|---|
| 15 of 40 inside the check in, 0 of 6 on a card | `lib/checkin/today.ts` comment, 21 September 2026; our own product data, stated as small |
| Worry on the check in until sorted | `save_memory` concern → `raiseConcern`, `lib/digi/tools.ts` |
| One thing to try, asked back on the check in | `schedule_followup` with `worry`; `lib/checkin/today.ts` |
| Next idea is a new one | the worry strand, migration 307 |
| Reminders at a set time | `set_reminder`, migration 359 (applied 2 October 2026), `/api/cron/digi-reminders` |
| Talk to DiGi, words in the box first, one line read back | `lib/voice/digi-voice.ts` (PR 1185) |
| Off until switched on, one tap stops, hands free never remembered, two quiet minutes | `scripts/check-digi-voice.mjs` guards each |
| Browser sends sound to Google or Apple | how Web Speech recognition works in Chrome and Safari; plan file `plans/2026-10-02-digi-voice-plan.md` |
| Never allow or deny | non negotiable 1 |
| Odgers 2024 review | `briefings/notes/positive-canon.md` |
| Founder scenes in post three (timers, rules, screen off upset, car arguments, homework first) | `content/brand-story/founder-context.md`, "The family scenes that complicated the question", used as written |

## Hidden thread

Post three carries the brick: the adults around a child matter more than the
screen, sourced to Odgers. It is a brick, not the one in ten. Posts one and
two are product and design, platform neutral.

## Flag for Justin (AMBER)

Post three uses your own scenes from founder-context.md: timers, rules, a
screen going off and tears, arguments in the car, homework first. They are
written as you gave them, with no names and nothing added. Cut them if they
feel too close.
