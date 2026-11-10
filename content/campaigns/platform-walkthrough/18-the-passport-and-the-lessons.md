# 18 · A birthday is not a training course

| | |
|---|---|
| Run | Parents, 11 of 13 |
| Service | The passport, the lessons, and the printed keepsake (map entries 3, 6 and 17) |
| Format | Carousel, 7 cards, 1080 by 1350, in the franchise THE ROAD TO 16. **Built** |
| Channels | Guided Childhood Instagram. Facebook takes card 1 and the text |
| Proposed | Tuesday 15 December, 19:00, ten days before a phone goes under the tree |
| Free step | The stage check |
| Files | `built/18-the-passport-and-the-lessons/`, deck at `built/decks/18-the-passport-and-the-lessons.json` |

## Hook

> A sixteenth birthday is not a training course.

## Slides

| Card | Words | Image |
|---|---|---|
| 1 | THE ROAD TO 16. A birthday is not a training course. | The five Planet Friends on the gold pathway, the passport at the end |
| 2 | Five stages. One job each. 4 to 7, calm screen offs. 8 to 10, healthy habits. 11 to 13, knows how it works. 13 to 15, owns their footprint. 16, ready for the world. | One band a stage, each with its friend |
| 3 | Each stage ends in a stamp. The stamps fill in from what you already do: jobs, check ins and lessons. | None |
| 4 | Fifteen lessons before the first account. Social Media Ready runs from 8 to 16. The lesson is how it works. | None |
| 5 | Want it real? There is a printed one. | The keepsakes screen: The printed passport |
| 6 | Find the stage first. | The stage result: "Sam's pathway is ready." |
| 7 | Keep this one. Save it for the week the phone question comes up. Send it to the parent whose child wants a phone for Christmas. | None, Orbit |

## Caption, Instagram

Send this to the parent whose child wants a phone for Christmas.

There are five stages between 4 and 16, and each one has a job.

1. 4 to 7: calm screen offs.
2. 8 to 10: healthy habits.
3. 11 to 13: knows how it works.
4. 13 to 15: owns their footprint.
5. 16: ready for the world.

Nobody goes from nothing to everything in one birthday and comes out
knowing what to do with it.

The passport gets a stamp as each stage is done. The stamps fill in from
things you were doing anyway: jobs, check ins and lessons.

11 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What do you wish somebody had taught you before your first phone?

## Caption, Facebook

Your child is nine. At sixteen they get the lot. Nobody tells you what the
bit in the middle is meant to look like.

So we drew it. Five stages from 4 to 16, each with one job: calm screen
offs, healthy habits, knows how it works, owns their footprint, ready for
the world. Each stage has a Planet Friend, and each ends in a stamp in your
child's passport.

The stamps are not a quiz. They fill in from the jobs, the check ins and the
lessons you were already doing. Fifteen of those lessons make up Social
Media Ready, which runs from 8 to 16: what a feed is for, why it is built to
be bottomless, followers are not friends, when the group chat turns. The
lesson is not "stay off it". The lesson is how it works.

If you want it to be real, there is a printed passport you can hold.

The idea of a graduated digital passport comes from researchers at
Cambridge, not from us. We built the version a family can use.

If a phone is on the list this Christmas, find the stage first.

11 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-18-fb

What do you wish somebody had taught you before your first phone?

## Visual brief

- Format 5, age stage and journey. The one post where the whole cast appears, because it is about the whole road.
- Each stage card takes its friend's soft ground and ink from the visual system. The friends are the approved cutouts in `public/digi-squad/friends/`.
- Burgundy appears only where the passport itself is on the card. The cover is drawn from the `PassportBook.tsx` styles with "Our family" where a name would be. Never the old `public/marketing/passport-*.png` files.
- The gold pathway runs through every card, left to right.
- Cosmo stands at the end of the road. He is not shown teaching.

## Proof

- The passport and its five stamps: `/dashboard/pathway`, `/passport`, `lib/content/readiness.ts`, `components/pathway/PassportBook.tsx`.
- Stage names and ages: Foundation 4 to 7, Builder 8 to 10, Explorer 11 to 13, Shaper 13 to 15, Independent 16 and over.
- Social Media Ready, 15 lessons: `SOCIAL_MEDIA_MODULE` in `app/(dashboard)/dashboard/lessons/page.tsx`, including "Built to be bottomless".
- The printed passport: `/dashboard/keepsakes`. Only the passport and the sticker sheet are on sale.
- The graduated digital passport is the Cambridge idea, credited as the service map says.

## Checks

- The phone carousel of 14 November used the five steps of the phone. This one uses the five stages of the child. Different list, and the words "ladder" and "rung" stay out of public copy.
- No claim that a stamped child is ready or safe. A stamp records what the family did.
- "Ready for the world" is the product's own name for the last stamp, used as a name.
- Charms, the bracelet, the plush and the magnetic chart are coming soon in the app and are not mentioned.
- **For Justin:** card 5 shows the printed passport at £14, as the keepsakes screen has it. The Etsy decision of 5 November says the price waits on the Mixam proof copy. Confirm the price, or the card is cropped above it.
