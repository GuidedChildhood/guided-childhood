# 18 · A birthday is not a training course

| | |
|---|---|
| Run | Parents, 11 of 13 |
| Service | The passport, the lessons, and the printed keepsake (map entries 3, 6 and 17) |
| Format | Carousel, 8 cards, in the franchise THE ROAD TO 16. Not built |
| Channels | Guided Childhood Instagram. Facebook takes card 1 and the text |
| Proposed | Tuesday 15 December, 19:00, ten days before a phone goes under the tree |
| Free step | The stage check |

## Hook

> A sixteenth birthday is not a training course.

## Slides

| Card | Words | Image |
|---|---|---|
| 1 | THE ROAD TO 16. A sixteenth birthday is not a training course. | The five Planet Friends on the gold pathway, the passport at the end |
| 2 | Five stages. One stamp each. | The passport book, cover |
| 3 | 4 to 7. Calm screen offs. | Pebble, the stage page |
| 4 | 8 to 10. Healthy habits. | Bloop |
| 5 | 11 to 13. Knows how it works. | Orbit |
| 6 | 13 to 15. Owns their footprint. Then 16: ready for the world. | Nova, with Cosmo at the end of the road |
| 7 | The stamps come from what you do. Jobs, check ins and lessons. Fifteen of the lessons are about social media, before the account exists. | The lessons page, Social Media Ready |
| 8 | What stage is your child? Three questions. No sign up. | The stage result screen |

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
