# New in the app, 1 of 3: The school letter

**Draft. Not posted, not scheduled.** Carousel, 7 cards, 1080 x 1350, in
`built/new-01-the-school-letter/`. Deck: `decks/01-the-school-letter.json`.
Lead: Bloop (routines). Parent problem: service map 7, the mental load of school.

## The cards

1. The letter said Wednesday. I found it on Thursday.
2. Take a photo of the letter. Or pick the screenshot. (the snap card)
3. Or forward the school emails to your own address. (the Letterbox card)
4. It lands on the right day. Weekly ones come back. (the week grid)
5. And on their week, in their own app. (the child's week)
6. A reminder the night before. Another in the morning. We keep the reminders, never the emails. Nobody reads your inbox.
7. Save it for the next letter in the book bag. Send it to whoever does the school run.

## Caption, Instagram

Every parent knows this one. The trip letter comes home on Monday and turns up on Thursday, at the bottom of the book bag.

So now it gets a photo the minute it comes out of the bag. Or the school email gets forwarded to an address of our own.

DiGi reads it and the dates land on the right day. PE kit, the trip money, the form that needs signing. A reminder the night before and again in the morning, and it shows up on their own week too.

We keep the reminders, never the emails.

What stage is your child? Three questions, no sign up. The link is in our bio.

## Caption, Facebook (card 1 on its own, never the carousel)

Every parent knows this one. The trip letter comes home on Monday and turns up on Thursday, at the bottom of the book bag.

Every parent we talk to has a version of it. The letter, the email, the ClassDojo post, the WhatsApp from another mum asking if it is non uniform tomorrow.

So in the Guided Childhood app you take a photo of the letter, or pick a screenshot of the email, and DiGi reads it. Or you forward the school emails to a private address of your own. The kit days, payments and deadlines come out as reminders on the right day, the night before and again in the morning. Weekly ones, like PE, come back every week. Your child sees them on their own week in their app.

We keep the reminders, never the emails. Nobody reads your inbox.

It starts with a free stage check. Three questions, no sign up: guidedchildhood.com/v/new-01-fb

## Alt text

1. Headline: The letter said Wednesday. I found it on Thursday. Bloop, a small green character, stands on a gold path.
2. The app's card: Snap it and DiGi reads it, with a Photo or screenshot button and Or paste the text.
3. The app's card: Let DiGi catch the school emails, a private address, with three ticks about privacy and a Get my address button.
4. The app's week, Monday 16 and Tuesday 17 November, with PE kit at 08:30 marked weekly.
5. The child's week in their app: a row of days and Today, PE kit, 08:30, every Tuesday.
6. Headline: A reminder the night before. Another in the morning.
7. Save it for the next letter in the book bag. Send it to whoever does the school run.

## Links to make first (Admin, Film links)

`new-01` (bio and Story sticker), `new-01-fb`.

## Proof paths

- Snap or screenshot, read by DiGi: `components/school/SchoolCatch.tsx`, `app/api/school/catch/route.ts`, `lib/school/extract.ts` (dev fixture `/dev/school-catch`). PR 1610 (open) moves "add from school" to the top of the page and gives an honest message when a screenshot cannot be read. Post this after 1610 merges.
- Forwarded emails, private address, "we keep the reminders, never the emails": the Letterbox card, `/dev/school-letterbox`, live since 17 September.
- Night before and morning reminders: the snap card's own words; the school window push (decision of 3 November).
- Weekly items come back: `components/school/SchoolWeek.tsx` ("Anything marked weekly comes back on the same day next week").
- The child's week: `/dev/kid-school-week`, `app/k/[token]`.
- The cover line is a parent's line, not a claim about our family. The captions say "every parent knows this one" rather than telling it as ours (family-social claim check). If Justin has a true version in `content/brand-story/founder-context.md` (GREEN only), it can replace it.
