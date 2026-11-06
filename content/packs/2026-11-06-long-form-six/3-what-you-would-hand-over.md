# Issue 3 · What you would have to hand over

**Venue:** Substack. **Length:** 1,836 words. **The Readiness Papers, two of four.**

## Subject lines

1. What you would have to hand over
2. A passport, a bank check, or your child's face
3. The ban needs a way to know who is sixteen

**Preview line:** Ofcom has named four ways to prove a child is sixteen. Each one fixes a problem and asks your family for something else.

---

A ban on social media for under sixteens needs a way to know who is sixteen.

That sentence sounds obvious and it is the most consequential thing about the whole policy, because the method is where the ban actually touches your house.

On 29 October Ofcom published a rapid assessment of highly effective age assurance at sixteen. It names four ways of doing it. Nobody has asked parents what they think of any of them, so this issue is my attempt at the plain English version, written before the consultation rather than after it.

## The four

Ofcom's four are photo ID matching, digital ID services, banking based checks, and facial age estimation. Its own phrase for them is methods currently capable of being highly effective, and the word currently is doing real work in that sentence.

Take each in turn, and in each case ask the only question that matters to a family: what are you handing over?

**Photo ID matching.** Your child uploads a passport or a driving licence and a selfie, and software checks they match. You are handing over a government identity document and a biometric image of a child's face, usually to a third party vendor rather than to the platform itself. The upside is accuracy. The downside is that you have created a record linking a named child to an account.

**Digital ID services.** Your child proves their age once, with a provider, and then reuses that proof across services. You hand over the same documents as above, but only once, which is genuinely better. What you get in exchange is a persistent identity that sits behind every app your child uses, and a single company that knows a great deal about where a child goes.

**Banking based checks.** The platform asks a bank to confirm, yes or no, that this person is over sixteen. You hand over a connection between a child's bank and a social media account. The attraction is that the bank already knows and does not have to say anything else. The discomfort is the precedent of a financial institution acting as the gatekeeper for speech.

**Facial age estimation.** Your child looks at a camera and software estimates their age from the image. You hand over a scan of a child's face. No document, which is the appeal, and the images are generally not retained, which is the mitigation. But it is an estimate, and that matters more at sixteen than anywhere else.

## The accuracy problem at exactly the wrong age

Facial age estimation gets more accurate the further you are from the line. It is very good at telling a forty year old from a twelve year old. It is at its weakest around the age the ban is drawn at.

Ofcom's response is a challenge age. If a scan puts someone close to sixteen, the service should check them a second way rather than guess. That is sensible and I have no complaint about it.

I do want to flag one thing I have seen stated as fact and will not repeat. A compliance vendor's summary of Ofcom's assessment describes a margin of error of a few years at sixteen. I cannot find Ofcom stating the margin in years anywhere, and Ofcom's site refuses the tools I use, so I have not read the primary document. The remedy is confirmed. The size of the problem is not, and I would rather tell you that than round it up.

## Who gets left out

This is the part I think is underdiscussed, because every conversation about age checks is about the children who get through and almost none is about the children who cannot get in.

An estimated 94 percent of people aged sixteen and over hold a passport or a driving licence. About 90 percent of sixteen and seventeen year olds hold a bank account. Those two figures sound reassuring until you turn them over: roughly one in ten of that age group has no bank account, and a slice has neither document.

The number doing the rounds for sixteen and seventeen year olds who hold neither a passport nor a licence is 150,000. I want to be precise about where that comes from, because I have seen it credited to Ofcom and it is not Ofcom's. It is an estimate from CitizenCard, drawn from a survey of 8,459 sixteen and seventeen year olds in schools, which Ofcom itself describes as a non representative sample. Treat it as an order of magnitude rather than a count.

Even as an order of magnitude it tells you something. A system built on documents will work smoothly for most families and badly for the ones who already find official systems hard: children in care, children in families without passports, children whose paperwork is somewhere else. Those are not the households with the most slack.

I notice that the privacy argument and the exclusion argument point in opposite directions, which is why this is genuinely hard. The method that asks for the least, a face scan, is the one that works for everybody. The method that is most accurate, a passport, is the one that excludes.

## What happens to it afterwards

Every conversation about age checks stops at the moment of the check. The more important question is what happens to the thing you handed over in the weeks after.

In most of these designs the platform doesn't do the checking. A third party vendor does, and the number of companies holding children's identity documents goes up rather than down. Facial age estimation is the best placed here, because a well built implementation estimates and discards. Document checks are the worst, because a document has to be stored somewhere for at least as long as it takes to review an appeal.

That last word is where I'd look hardest. The checks themselves will mostly work. It's the appeals process that collects the documents, because a child wrongly estimated as under sixteen has to prove otherwise, and proving otherwise means uploading something.

We already have an example of what that looks like when it goes wrong. In October 2025 Discord said approximately 70,000 users may have had government ID photos exposed at a third party used to review age appeals. The attackers claimed a far higher figure and Discord called that an extortion bluff; no outside party has verified any of the numbers, and Discord has since moved to different providers. I'm not offering that as a prediction and I'm certainly not saying it will happen here.

I'm saying that the appeals queue is where the documents pile up, and that no part of Ofcom's four methods is the part that gets written about.

Ask it as one question. Not "is this check accurate", but "who holds the file, for how long, and what happens when my child is told no?"

## The fair case for all of it

I have been describing costs, so let me put the other side as well as I can, because the people who want this have a real answer.

Checks are the price of a rule that means anything. The alternative is the system we have now, which is a box a child ticks, and that system has produced a situation where a nine year old can be on a platform designed for adults by typing a different year. If you think the current arrangement is unacceptable, then something has to actually verify something, and every method of verifying involves handing something over.

A ban with real checks is a better ban than one without them. Ofcom's assessment is a serious piece of work by people trying to make a hard thing function, and the twelve month commitment to publish research on circumvention after the ban starts is the kind of thing regulators usually avoid promising.

I can hold both of those at once: that this is a serious attempt, and that nobody has asked a parent which trade they would accept.

## What a check decides, and what it does not

Here is the line I keep coming back to.

A check decides who gets through the door.

It does not decide what a fifteen year old does with a friend's login. It does not decide what they feel when something odd lands in their feed at eleven at night. It does not decide whether they tell you.

Ofcom is honest about the first part of this. Its own assessment says no age assurance method is "completely robust against circumvention by children", and it expects attempts to increase once there is something to circumvent. That is the regulator saying out loud that the door will be got round.

So the door matters.

The door is not the plan.

And there's a second order effect worth naming, because it's the one I expect to be surprised by. Every one of these four methods makes a child's online life more identified than it is today. A teenager who currently moves through the internet as nobody in particular will, after March or whenever it lands, move through it as a verified person of a known age. That's the point, and it's also a change in what it means to be young online, made as a side effect of a child protection measure rather than as a decision anybody voted on.

I don't know whether that's bad. I know it's large, and that it isn't what the debate has been about.

## The timeline, so you can see what is actually decided

As things stand: the restriction was announced in June 2026. Ofcom published its assessment on 29 October. The first regulations were due before the end of 2026 and had not been laid when I wrote this. The Culture Secretary has named March 2027, though no exact date is officially confirmed and official statements have also said spring 2027. Ofcom will consult on draft guidance once the regulations are laid, and will publish research on circumvention within twelve months of the ban taking effect.

Which means the method is not settled. There is a consultation coming on how this will actually work, and parents are not usually the loudest voice in those.

## What to do on Sunday

Decide, before anyone asks you, which of the four you would accept for your own child. Not in the abstract. Actually pick one.

A passport upload. A reusable digital ID. A bank check. A face scan.

I find that choosing makes the whole argument different, because it stops being about whether the ban is good and becomes about what you are willing to trade. When the consultation opens, you will already have an answer, and an answer given early is worth more than an objection raised late.

And then the other half, which is the half I build for. Whatever method you would accept, it will not tell your child anything. The understanding has to come from somewhere else, and the time between now and March is the only part of this that is yours.

If you want a starting point, our stage check asks three questions about your own child and gives you a stage with the things worth practising next. A starting point, not a measurement: we hold no outcome evidence that finishing a stage changes what a child does.

---

## Sources, and a limit I want to be upfront about

**The headline limit.** ofcom.org.uk returns a refusal to the tools I use, on every attempt across two sittings, so I have **not read the primary document**. Everything below is traced to reputable secondary reporting, including verbatim quotations of Ofcom's own wording, and I have said in the text which specific figures rest on thin sourcing. If you want to check me, the document is Ofcom's Rapid assessment of highly effective age assurance at 16, published 29 October 2026.

**Confirmed across multiple independent reports.** The four methods and that they are photo ID matching, digital ID services, banking based checks and facial age estimation. Ofcom's phrase for them, methods currently capable of being highly effective. The challenge age approach with a secondary check for users near the threshold. The commitment to publish research on circumvention within twelve months of the ban coming into effect. The intention to consult on draft guidance once the Government's regulations are laid.

**Quoted verbatim.** That no age assurance method is "completely robust against circumvention by children". I am quoting this from reporting of Ofcom's wording rather than from the document itself.

**Single secondary source, so treat with care.** The 94 percent of people aged sixteen and over holding a passport or driving licence, and the roughly 90 percent of sixteen and seventeen year olds holding a bank account. Both come from one compliance vendor's summary of the assessment. I have used them because the internal arithmetic is coherent and nothing contradicts them, not because they are well sourced.

**Attributed, because it is commonly misattributed.** The 150,000 sixteen and seventeen year olds holding neither a passport nor a driving licence is a CitizenCard estimate from a survey of 8,459 in schools, which Ofcom describes as a non representative sample. It is not Ofcom's own estimate and I have seen it reported as though it were.

**The Discord example.** October 2025. Discord said approximately 70,000 users may have had government ID photos exposed at a third party used to review age appeals. The attackers claimed a figure in the millions and Discord called that an extortion bluff. The vendor says none of its own systems were involved. **No outside party has verified any of those figures**, and Discord has since moved to different age assurance providers, so this is not a description of where it is today. An earlier version of this argument on LinkedIn claimed the industry could not agree whether the spill was seventy thousand documents or two million; there is no such disagreement, the claim was wrong, and it was cut before publication. I am including the example only to make the point about where documents accumulate, which is the appeals queue.

**Not used.** Any statement of facial age estimation's margin of error expressed in years. One vendor summary gives it as a few years at sixteen; no source I could reach quotes Ofcom putting a number on it, so the issue describes the remedy and not the size.

**Timing.** March 2027 is the date named by the Culture Secretary in remarks reported from Labour Conference. Smartphone Free Childhood's parent FAQ notes it is not officially confirmed, and Hansard and the Commons statement say spring 2027. The powers sit in the Children's Wellbeing and Schools Act 2026, amending the Online Safety Act 2023, and the regulations had not been laid at the time of writing.
