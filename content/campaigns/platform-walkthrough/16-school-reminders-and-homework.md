# 16 · Ten past eight

| | |
|---|---|
| Run | Parents, 9 of 13 |
| Service | School alerts and reminders, and the homework helper (map entries 7 and 8) |
| Format | Reel, 29 seconds, 1080 by 1920. **Built** |
| Channels | Guided Childhood Instagram and Facebook Reels, TikTok cut |
| Proposed | Friday 11 December, 19:00, the last full week of term |
| Free step | The stage check |
| Files | `built/16-school-reminders-and-homework/ten-past-eight.mp4`, cut at `videos/2026-10-09-digi-shorts/cuts/walkthrough-16.json` |

## Hook

> We have never once forgotten swimming. We have remembered it at ten past eight.

## Script, shot by shot

| Time | On screen | Real screen |
|---|---|---|
| 0.0 | ONE WEEK, ONE HEAD. PE kit. Trip money. Christmas jumper day. Then: INSIDE GUIDED CHILDHOOD, 9 OF 13 | None |
| 3.8 | One place. Tick it off. | None |
| 6.2 | SCHOOL ALERTS. 1. Everything from school, in one place | "This week": Reading record signed and in the bag, Return the consent form |
| 10.8 | SET IT ONCE. 2. It comes round every week | The same screen, closer: "weekly" and "they get it too" |
| 15.2 | THEIR APP. 3. It lands with them too | The child's week: "PE kit, and the black shorts not the blue ones" |
| 19.6 | HOMEWORK. 4. And it explains the homework | "Stuck on tonight's homework? Paste it in. We say what it is for and how the school teaches it." |
| 24.4 | One plan for screens, phones and AI. What stage is your child? Three questions, no sign up. `guidedchildhood.com/v/tour-16` | End card |

## Caption, Instagram

Send this to the parent holding the whole school calendar in their head.

1. Everything from school in one place. Tick it off to clear it.
2. Photograph a letter and DiGi reads it into a reminder.
3. Set PE kit once and it comes round every week.
4. One tap sends the reminder to your child, so the kit becomes their job.
5. Paste in the homework and it tells you what it is asking for.

A reminder that goes to them is one less thing you have to nag about.

9 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What is the one school thing you always remember too late?

## Caption, Facebook

PE kit on Tuesday. Swimming on Thursday. Trip money by Friday. In December
you can add a Christmas jumper, a nativity costume and a tin for the food
bank. It all arrives by email and it all lives in one parent's head.

This is the least glamorous thing we built.

Everything from school sits in one place and you tick it off to clear it.
You can photograph a letter and DiGi reads it into a reminder. You can have
school emails sent to your own letterbox address and they are caught for
you. Set a weekly routine once and it comes round every week, with one tap
to put it in your phone's calendar.

The part we like best: the reminder can go to your child as well. The PE kit
becomes their job, and you stop being the alarm clock.

And when the homework looks nothing like the way you were taught, paste it
in. It tells you what it is asking for, the one thing to do tonight, and
where parents usually trip up.

9 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-16-fb

What is the one school thing you always remember too late?

## Visual brief

- Same film frame as post 1. Film from `app/ref-school-card`, `app/ref-school-links` and `app/ref-homework-help`.
- The letter in beat 1 is a made up school letter with a made up school name. No real school, no real child.
- The opening list is three short lines landing one at a time.

## Proof

- `/dashboard/school`: "School alerts and reminders", "Everything from school in one place. Tick a thing off to clear it, or add your own weekly routine so the PE kit never gets forgotten again."
- "Snap it and DiGi reads it", "Add this reminder"; the Letterbox ("Let DiGi catch the school emails", live since 17 September, `SchoolLetterbox.tsx`).
- "Every week", "Send to {Name}", the calendar link `/api/school/[id]/ics`, table `school_actions`.
- Homework: `/dashboard/homework`, "What is this homework?", "What it is asking for", "One thing to do tonight", "Where parents usually trip up".
- What their year covers: `/dashboard/learning`, 448 objectives for England, Years 1 to 6.

## Checks

- We can say what a year group covers nationally. We cannot say what one school teaches this week, and the post does not.
- The service map said not to claim email forwarding. That note is out of date: the Letterbox is live. Check the card still says "Your letterbox is working" before filming.
- "School chest" is not used anywhere. No parent sees that name.
- The hook is in the family "we". It is a joke about the parents, not a story about a child.
- Built 10 November from `ref-school-card`, `ref-kid-week` and `ref-learning-year`. The snap a letter and Letterbox screens are in the captions and not in the film, because no reference page shows them. They can be added from the live app.
