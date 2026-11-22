# Homework reminders: the walkthrough film and its posts

Built 22 November 2026, the fifth iPhone service film, for the homework early reminders shipped in PR 1641. Drafts. Justin posts.

Every screen is the real app, recorded frame by frame from its fixture page with the film family's names (Ava, Sam), in the same drawn iPhone as the other four. No image or video model was used. Engine: `videos/2026-11-19-iphone-films/` (scenes `hw-snap`, `hw-coming`, `hw-kid`; cut `films/homework-reminders.json`).

| Film | Length | File |
|---|---|---|
| Homework: snap the project letter, reminders that lead up to the day | 32.8s | `films/homework-reminders.mp4` |

1080 x 1920, silent, ends on the stage check card. Short enough to run uncut on TikTok.

## What it shows, beat by beat

1. "The project letter that lives on the fridge." The Snap it card.
2. "Snap it. DiGi finds the date." A photo goes in, the card reads Anderson shelter project, Tue 1 Dec.
3. "One tap. It is in your week." Add this reminder.
4. "Due in 12 days. So no alert today." The Coming up card on the school page.
5. "A week before. 3 days before. You choose." The 3 days button tapped off and on.
6. "And always the night before."
7. "Their own app says it too." The child's home line: Due in 5 days, a little bit at a time.

## Proof path for every claim

- The date read from a photo: `components/school/SchoolCatch.tsx`, `/api/school/catch`.
- No alert until the first reminder: `showFrom` in `lib/school/lead-up.ts`, used by `lib/notifications/collect.ts`.
- A week before, 3 days before, the night before: `/api/school/remind` (evening run), and the same alerts in the calendar file.
- The parent chooses: `components/school/LeadReminders.tsx`, migration 401 (applied 22 November).
- The child's app: `app/k/[token]/page.tsx`, homework only.

No claim about marks, grades or calmer evenings. The film says what the app does.

## Sound

None baked in. Add a calm trending instrumental at upload, from the shortlist in `content/packs/2026-11-19-iphone-films/posting-plan.md`.

## Caption, Instagram

The project letter comes home on a Monday. It goes on the fridge. You remember it the night before, with no shoebox in the house.

Snap the letter. DiGi finds the date and puts it in your week. Nothing pings today. You get a reminder a week before and again 3 days before, and always the night before. Their own app says it too, so starting is their job as well as yours.

What stage is your child? Three questions, no sign up. Link in bio.

## Caption, Facebook

The same text, ending: What stage is your child? Three questions, no sign up. guidedchildhood.com/v/hw-reminders-fb

## Caption, TikTok

The school project you remember the night before. Snap the letter once. A reminder a week before, 3 days before, and the night before. On their app too. Built on research. Link in bio.

## LinkedIn, Justin's voice

Post the film natively. No link in the body. The link goes in the first comment.

> A letter came home about an Anderson shelter.
>
> Build a model at home. Shoebox size. Due 1 December.
>
> I photographed it into the app we are building, and my phone told me about it straight away.
>
> Twelve days early.
>
> That was the bit we had got wrong.
>
> An alert twelve days early is noise. You swipe it away.
> And the night before is too late for cardboard and glue.
>
> What a project needs is the middle.
> A nudge to start. A nudge to check. Then the night before.
>
> I struggled with homework as a child. I do not want the last night to be where my children meet theirs.
>
> So this week we changed it.
>
> The letter goes in once.
> Nothing pings today.
> A reminder comes a week before, and again three days before.
> The night before, always.
> And the same line shows on the child's own app, because starting is their job too.
>
> "Due in 5 days, a little bit at a time."
>
> It will not build the shelter. That is still cardboard on the kitchen floor.
>
> But nobody finds out the night before.
>
> When do school projects get remembered in your house?

First comment: "The film is the real app with an example family. The stage check is three questions, no sign up: guidedchildhood.com/v/li-1123-homework"

For Justin to check before posting (AMBER): the post tells the true story of the letter that came home this week, without naming a child. The homework line is from founder-context ("struggled with homework"). Nothing else about the family is in it. Change or cut either if it is more than you want said.

## Labels on screen

"Example family" on every beat. No DiGi reply and no rating appear, so no other label is needed.

## Checked

- Every recording read from contact sheets before the cut; eight stills of the film checked for names, dates and wording.
- The fixture's names are swapped to Ava by `tools/names.json`. The school on the photographed letter is made up and never appears on screen.
- The dates agree across the film: recorded on a 19 November evening, due Tue 1 Dec, 12 days to go. The child's screen is a week later, Due in 5 days.
- No dashes, no outcome words, no child's face, no synthetic person.
- Not yet done: the marketer review `product-shorts` asks for. Run it on Justin's word.

## Links to make (Admin, Film links)

`hw-reminders` (Instagram and TikTok bio), `hw-reminders-fb`, `li-1123-homework` (channel LinkedIn). Nothing is posted before they count.
