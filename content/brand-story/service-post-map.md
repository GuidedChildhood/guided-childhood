# Service Friday: the full rotation

**Eighteen Fridays. Every service we have actually built, each one opened on a
real parent problem. No dashes in any copy.**

Verified against the live route and migration surface on 30 July 2026, and
again on 8 August 2026 when entries 19 to 21 were added for the services built
in the week between. Each entry carries its proof path so a claim can be
checked in ten seconds. **If a service is not in this file, it does not get a
Friday**, because the failure mode of a marketing calendar is describing
something that is still in a plan.

This file is also the standing record Justin asked for on 8 August: every
piece of service, the benefit, why, and the problem it solves, all in one
place. When something new ships and a parent can touch it, it gets an entry
here the same week.

The structure of every Friday post, from `weekly-rhythm.md`:

1. The problem, in the words a parent would use
2. What we made for it
3. **The hinge**, one sentence connecting it to another part
4. The soft ask

---

## 1 · The five o'clock fight

**Problem.** "Two more minutes" becomes twenty. Then it is a row, and the row is
about the tablet but it ruins the evening.

**What we made.** Ask first, and a timer both of you can see. Before screen time
starts the child sends an ask. You get it on your phone, you say yes or not yet.
Then a countdown runs that you are both looking at, so the end of it is not a
surprise you spring on them.

**Hinge.** The minutes are not free. They were earned on the jobs board, which
is why the countdown ending is a deal running out, not you being mean.

**Hook.** "For about two years, five o'clock in our house was a fight."

**Proof.** `/dashboard/quests/timer`, `lib/quests/device-time.ts`, migration
`081_ask_first_kid_nudges.sql`. Ask is the default trust level for everyone.

---

## 2 · Screen time nobody agreed to

**Problem.** Screen time gets taken, not given. You never quite decided, and you
never quite said yes.

**What we made.** Family Quests. Real jobs, set by you, ticked by them. Jobs pay
stars, stars buy minutes. The deal does the arguing so you do not have to.

**Hinge.** What gets paid for is the point. The board pays the most for the
things that get them off the screen and outside.

**Hook.** "We stopped negotiating about screen time. We wrote down the price
instead."

**Proof.** `/dashboard/quests`, `lib/quests/templates.ts` (`STAR_MINUTES`),
tables `family_quests`, `quest_ticks`, `star_spends`.

---

## 3 · Nothing between no phone and everything

**Problem.** They are nine. At sixteen they get the lot. There is nothing in the
middle and nobody tells you what the middle is meant to look like.

**What we made.** The passport. Five stages from 4 to 16, each with a short list
that fills in as your family actually does things, and a stamp when a stage is
done. Calm screen offs. Healthy habits. Knows how it works. Owns their
footprint. Ready for the world.

**Hinge.** The stamps are not a quiz. They fill in from the jobs, the lessons and
the check ins you were already doing.

**Hook.** "A sixteenth birthday is not a training course."

**Proof.** `/dashboard/pathway`, `/passport`, `lib/content/readiness.ts`,
`components/pathway/PassportBook.tsx`, table `stage_passports`. The graduated
digital passport is the Cambridge idea, not ours, and we say so.

---

## 4 · Eleven at night and nobody to ask

**Problem.** Something has happened online. It is late. The options are a
Facebook group, a panicked search, or waking up your partner.

**What we made.** DiGi. An advisor that knows your child's stage and your
family, available at any hour. It will not tell you to allow it or ban it,
because a verdict ends a conversation. It gives you the conditions: what
structure, at what time, agreed with whom, reviewed together when.

**Hinge.** DiGi knows where you are on the pathway, so the answer for a nine year
old is not the answer for a fourteen year old.

**Hook.** "We built an AI for parents and then forbade it from giving an answer."

**Proof.** `/dashboard/digi`, `/api/digi`, `lib/digi/system.ts`, `lib/digi/brain.ts`.
`DIGI_MODEL` is a config value. Crisis routing to Samaritans, 999 and Childline
is hard coded, not left to the model.

---

## 5 · You know what you mean and the words go

**Problem.** You have rehearsed it all day. They look up and you say the wrong
thing and it turns into a row about the tone rather than the phone.

**What we made.** Scripts. Word for word. What to say, what not to say, why it
works, and what to do after. You can rehearse it before you have it.

**Hinge.** Tell us which line actually worked and the next script you get is
picked on that.

**Hook.** "I had the whole conversation planned. I opened my mouth and said
'because I said so'."

**Proof.** `/dashboard/scripts`, `/api/scripts/rehearse`, `/api/scripts/lines`,
migration `107_which_line_worked.sql`. Scripts live in the database, never
hardcoded.

---

## 6 · They will be on it before you are ready

**Problem.** Social media is the thing parents worry about most and the thing
they feel least equipped to teach.

**What we made.** Social Media Ready. Fifteen lessons pulled into one ramp from
8 to 16. What social media really is. Why the feed is built to hold you. Before
you make an account. Real life is not a highlight reel. Followers are not
friends. When the group chat turns. The settings. The footprint test. When
someone asks for a photo. The honest check on your mood. The money machine
behind it. Taking the wheel at sixteen.

**Hinge.** Lessons feed the passport. Doing them is how a stage gets its stamp.

**Hook.** "The lesson is not stay off it. The lesson is here is how it works."

**Proof.** `SOCIAL_MEDIA_MODULE` in `app/(dashboard)/dashboard/lessons/page.tsx`,
migrations `091`, `092`, `103`, `104`, `105`. Content is database rows.

---

## 7 · The mental load of school

**Problem.** PE kit Tuesday. Swimming Thursday. Trip money by Friday. It all
arrives by email and it all lives in your head.

**What we made.** School alerts. Everything from school in one place, tick to
clear. Set a weekly routine once and it reminds both of you every week. One tap
puts it in your phone calendar.

**Hinge.** The reminder can go to the child too, so the PE kit becomes their job
instead of your nagging.

**Hook.** "I have never once forgotten swimming. I have simply remembered it at
ten past eight."

**Proof.** `/dashboard/school`, table `school_actions` with `recurs_weekday` and
`auto_send_to_child`, `/api/school/[id]/ics`, crons at 18:00 and 06:45.

**Do not claim** the school email forwarding. The backend is built but the
parent facing card still says coming soon, so it is not a Friday yet.

---

## 8 · Helping with homework the wrong way

**Problem.** You show them how you were taught to do it. They tell you that is
not how Miss does it. Now everyone is cross about a bus stop.

**What we made.** What they are learning, and the homework decoder. Their year,
their term, what the class is actually being taught, and the method the school
uses so you help the right way.

**Hinge.** Anything they are learning can be turned into a job on the quests
board, so the maths pays stars.

**Hook.** "I was not helping. I was teaching a second, competing method."

**Proof.** `/dashboard/learning`, `/dashboard/homework`, `/api/learning/decode`,
448 objectives across migrations `108`, `114`, `115`.

---

## 9 · Everything else is on a screen

**The Inspired by Alma continuity post. Give it a good Friday.**

**Problem.** Every tool for managing screens is itself a screen.

**What we made.** Printables. Twenty nine of them. Star charts, routine charts,
the family phone agreement, scavenger hunts, calm down corner, colour in sheets
of the Planet Friends. Print it, do it, and the finished sheet pays stars.

**Hinge.** This is the part of the pathway that is not on a screen, and it still
counts toward the same stars as everything else.

**Hook.** "For ten years we made things out of card and sugar. Some of them
still are."

**Proof.** `/dashboard/printables`, `lib/printables/registry.ts` (29 entries),
`/api/printables/[key]/pdf`, tables `printable_completions`,
`printable_assignments`. The star chart is free and starts from the jobs the
family already set.

**Why this one matters.** It is the post that tells 6,000 people who came for
cake toppers that the craft did not stop. Put a real printed sheet on a real
fridge in the photo.

---

## 10 · Rules nobody agreed to

**Problem.** You set a rule. They did not agree to it. So every enforcement is a
fresh argument.

**What we made.** The family agreement. You build it together, you both sign it,
you print it and it goes on the fridge.

**Hinge.** On a birthday the contract clears and gets agreed again, because a
deal made with a nine year old should not still bind a twelve year old.

**Hook.** "A rule they did not agree to is a rule you have to enforce twice a
day."

**Proof.** `/dashboard/agreement`, `/dashboard/agreement/print`, table
`family_agreements`, cron `/api/cron/age-up` clears `agreed_at`.

---

## 11 · The child has no stake in it

**Problem.** Every screen time tool is built for the parent. The child is the
thing being managed, so of course they push against it.

**What we made.** Their own app. A private link, no login, installs on their
home screen with its own icon. Today's jobs, their stars, what they are saving
for, their lessons, their road, and asking for time.

**Hinge.** They can suggest a job. You approve it. Suddenly they are proposing
the deal instead of resisting it.

**Hook.** "The app my daughter actually opens is not the one I use."

**Proof.** `/k/[token]` and its pages, `kid_links`, `/api/kid/*`,
`app/k/[token]/layout.tsx` overrides the manifest. Younger children stay parent
led with no child device via `children.no_phone`, migration `105`.

---

## 12 · Settings scattered across five devices

**Problem.** A tablet, a console, a telly, a laptop, and a phone. Each with its
own settings buried somewhere different.

**What we made.** The family devices register and the first phone guide. Set it
once per device, per operating system, and then release it on purpose as they
grow rather than all at once.

**Hinge.** The settings ease as the passport stamps land. Growing up is what
unlocks it, not pestering.

**Hook.** "Never a free for all, and never a lockdown."

**Proof.** `/dashboard/devices`, `/dashboard/phone-setup`,
`/dashboard/social-settings`, migrations `094`, `093`, `106`.

---

## 13 · You are counting hours and hours tell you nothing

**Problem.** The screen time number goes up, you feel bad, and you still have no
idea whether anything is actually wrong.

**What we made.** Balance. What the week was actually made of, sorted by what the
device was for, against a sensible level for their age, alongside the off screen
wins.

**Hinge.** If something looks off, it becomes a concern the whole system carries,
and DiGi brings it up rather than waiting for you to.

**Hook.** "Two children, same three hours. One is in a group chat and a football
rabbit hole. The other is being fed comparison and late night doom."

**Proof.** `/dashboard/stats`, `lib/balance/pace.ts`,
`lib/quests/screen-balance.ts`, `/dashboard/checkin`, table `concerns`.

**Careful here.** This is the closest a Friday gets to the evidence, so the
Wednesday rules apply: honest pivot included, no outcome claims.

---

## 14 · Everyone in the class is getting a phone

**Problem.** Year 6 into Year 7. It arrives all at once, everybody's family is
deciding at the same time, and the pressure is enormous.

**What we made.** The phone bridge. It leads on your home screen for the six
weeks either side and it never tells you whether to get the phone. It tells you
the order to do things in if you do.

**Hinge.** It knows the window is open because it knows their birthday, which is
the same fact that drives the curriculum and the school calendar.

**Hook.** "We will not tell you whether to buy the phone. We will tell you what
to do first."

**Proof.** `/dashboard/secondary`, `components/home/PhoneBridgeCard.tsx`,
`lib/learning/transition.ts`.

---

## 15 · The school holiday free for all

**Problem.** Six weeks. The structure goes, the screens win, and by mid August
everyone has given up.

**What we made.** The holiday bank. Work they did during term that the week had
no room for goes into a balance they can only spend in the school holidays.

**Hinge.** Two different rewards for two different things. Unused time pays
sticker credits and rewards restraint. Surplus work pays the holiday bank and
rewards effort. Neither can be earned by doing the other.

**Hook.** "Holiday screen time is earned in June."

**Proof.** Migrations `127_holiday_allowance.sql`, `128_holiday_spend.sql`,
`lib/quests/holiday-bank.ts`, cron `/api/cron/star-week-rollover`.

---

## 16 · AI arrived and nobody has a plan

**Problem.** Everything about AI in schools is either a ban or a panic. Meanwhile
they are already using it.

**What we made.** The AI module. Lessons by age, from 7 up to 16, plus one for
parents. And games that pay stars for spotting a scam, telling real from fake,
and knowing what to keep private.

**Hinge.** The games pay stars, so learning to spot a fake buys screen time. That
is the whole philosophy in one loop.

**Hook.** "Teo is four. By sixteen the road will have changed again."

**Proof.** `/dashboard/ai-module`, tables `ai_lessons`, `ai_updates`,
`lib/quest-games/registry.ts` (Real or Fake?, Scam or Safe?, Share or Keep
Private?, Password Power).

---

## 17 · The thing on the fridge

**Problem.** Everything lives in an app and none of it feels real.

**What we made.** Keepsakes. The printed passport with their name on it, and the
sticker sheet. Made by hand for the first fifty, on purpose.

**Hinge.** The printed passport is the same passport the app has been stamping
all year.

**Hook.** "We are posting the first fifty ourselves."

**Proof.** `/dashboard/keepsakes`, migration `102_shop.sql`,
`lib/shop/catalogue.ts`. **Only the printed passport and the sticker sheet are
active.** Charms, the bracelet and the plush are shown honestly as coming soon
and must not be marketed.

---

## 18 · The school lane

**Different audience. Roughly one Friday in six, and only on Facebook**, where
teachers and governors actually are. Instagram is parents.

**Problem.** Schools have to evidence RSHE coverage and it is currently a filing
job done in the evenings.

**What we made.** Twenty one modules from Reception to Year 13, a projector
player with the teacher script, and a coverage report for heads and governors
that fills itself in as lessons are taught.

**Hinge.** Evidence becomes a side effect of taking the register.

**Proof.** `/educator` and its hub, `/schools`, migrations `109` to `112`.

---

## 19 · The child who cannot find the words

**Problem.** Something happens on the phone. A message that scared them, a game
that turned nasty, a picture they should not have seen. The child knows it is
wrong and does not know how to start the sentence, so they say nothing, and the
parent finds out weeks later or never.

**What we made.** The child's own scripts, in their app. Twenty five short
openers written for children, sorted by the moment ("someone sent me
something", "I saw a thing I did not like", "someone is being mean"), each one
a sentence they can actually say out loud or show their parent. Beside them,
five Tell a parent cards that teach the one idea underneath: telling is not
grassing, and nothing gets taken away for being honest.

**Hinge.** The parent side already promised no telling off for telling. This is
the other half: the child holding the first sentence in their hand.

**Hook.** "The hardest sentence a child ever says starts with Mum, something
happened."

**Proof.** `/k/[token]/tell` on the child's app, `/dashboard/tell-a-parent` on
the parent's, migration `163_child_to_parent_scripts.sql`, tables
`child_scripts` and `tell_a_parent_cards`. Scripts live in the database per
non-negotiable 6.

---

## 20 · You cannot see how far you have come

**Problem.** Parenting improvements are invisible from inside. The bedtime that
was a war in March is quietly fine by June, and nobody notices, because the
problems that got solved stop being thought about. Parents quit tools that are
working because working looks like nothing happening.

**What we made.** The evidence of the journey. Every concern a family raises is
logged the day it is raised, checked in on daily with one tap and a zero to ten
strip, and marked the day it settles, with a look back question that catches
how bad it really was at the start. The pathway page then shows the record:
what you came in with, what got resolved, how long each took, and honestly,
what came back.

**Hinge.** The same record feeds DiGi, so what worked for your family becomes
part of how it helps the next one, once a human has read every line.

**Hook.** "Write down the problem on the day it starts. In six weeks you will
not believe it was ever that bad."

**Proof.** `HowFarYouHaveCome` on `/dashboard/pathway`, migration
`164_concern_events.sql` (append only, backfilled rows excluded from every
duration), the check in strip in `components/daily/ConcernCheckIn.tsx`.
Recurrences are counted and shown, per the honesty rules in
`plans/evidence-of-outcomes-research.md`.

---

## 21 · Advice that never finds out if it worked

**Problem.** Every parenting source hands out suggestions and walks away. The
podcast does not ring back. The book does not ask how Tuesday went. So nobody,
including the parent, ever quite learns what actually works for this child.

**What we made.** DiGi keeps its promises. When it suggests something concrete,
a script for tonight, a rule to hold for a week, it says it will check in, and
a few days later a card arrives asking how it went. One tap answers it. The
answer becomes part of the family's record and, stripped of names, part of
what DiGi knows holds for families like yours.

**Hinge.** This is the loop that makes entry 20 move: tried, checked, kept or
dropped, written down.

**Hook.** "Every parenting expert gives advice. Ours is the only one that
rings back to ask if it worked."

**Proof.** `schedule_followup` in `lib/digi/tools.ts`, the 07:15 cron
`/api/cron/followups`, the I tried this button in
`components/cards/MomentCard.tsx`, tables `digi_followups` and
`digi_outcomes` (migration 147). Switched fully on 8 August 2026; treat the
Friday for this one as earned once real follow ups have run for a few weeks.

---

## The four month rotation

| Week | Friday |
|---|---|
| 1 | 1 · The five o'clock fight |
| 2 | 2 · Screen time nobody agreed to |
| 3 | 9 · Everything else is on a screen (the craft bridge, early on purpose) |
| 4 | 3 · Nothing between no phone and everything |
| 5 | 4 · Eleven at night and nobody to ask |
| 6 | 7 · The mental load of school |
| 7 | 5 · You know what you mean and the words go |
| 8 | 11 · The child has no stake in it |
| 9 | 6 · They will be on it before you are ready |
| 10 | 10 · Rules nobody agreed to |
| 11 | 8 · Helping with homework the wrong way |
| 12 | 13 · You are counting hours and hours tell you nothing |
| 13 | 12 · Settings scattered across five devices |
| 14 | 16 · AI arrived and nobody has a plan |
| 15 | 15 · The school holiday free for all |
| 16 | 14 · Everyone in the class is getting a phone |
| 17 | 17 · The thing on the fridge |
| 18 | 18 · The school lane |

**Why this order.** The first two are the loudest, most universal problems and
they earn attention fastest. Week 3 is the craft bridge and it goes early
because the 6,000 need to hear it early. The passport waits until week 4 because
it only makes sense once someone has felt the problem it solves.

Weeks 15 and 16 are pegged to the calendar: the holiday bank lands before the
summer holidays, the phone bridge lands in the run up to September.

Entries 19 and 20 join the rotation at the end of the current cycle or wherever
a Friday opens up, in that order: the child's scripts first because the problem
is the loudest, the evidence record second because it needs a few families to
have lived it. Entry 21 waits until follow ups have genuinely run for a few
weeks, per its own note; a post about keeping promises has to keep them first.

---

## Do not post about these

Named because a future session will be tempted. All planned, none built, per
`plans/week-of-2026-07-30-app-protocol-and-nudges-plan.md`, whose first line is
"Nothing in this file is built yet".

- The weekly spotlight rotation
- School email forwarding, parent facing
- The inactivity email
- Semantic script matching
- Keepsake charms, bracelet, plush
- Anything on `/evidence` or `/investor`, both marked DRAFT in source
