# 17 · Ours prints

| | |
|---|---|
| Run | Parents, 10 of 13 |
| Service | Printables, crafts and the family agreement (map entries 9 and 10) |
| Format | Carousel, 7 cards. Not built |
| Channels | Guided Childhood Instagram. Facebook takes card 1 and the text |
| Proposed | Sunday 13 December, 19:30, the weekend before the holidays |
| Free step | The stage check |

## Hook

> Every tool for managing screens is itself a screen. Ours prints.

## Slides

| Card | Words | Image |
|---|---|---|
| 1 | Every tool for managing screens is itself a screen. Ours prints. | A real photo: a printed sheet on a real fridge. Justin to supply |
| 2 | 47 things to print. Charts, games, kits and colouring. | The printables page, "The offline pathway" |
| 3 | A star chart built from your own jobs. | The star chart builder |
| 4 | Things to make. Kindness Postcards. Phones Go To Bed. The Ice Cream Shop. | Three real page previews |
| 5 | An agreement you write together. Read it out loud, then sign. It goes on the fridge. | The family agreement, step three |
| 6 | Finished sheets earn stars. Paper counts the same as everything else. | The child's printables tab |
| 7 | Keep this one. Save it for the first wet day of the holidays. | Colour in Bloop, the line art |

## Caption, Instagram

Send this to the parent facing two weeks of school holidays.

1. There are 47 things to print in the app.
2. The star chart builds itself from the jobs you already set.
3. The crafts are real making: cutting, sticking, colouring, posting.
4. The family agreement gets written together and signed by everyone.
5. A finished sheet earns stars, the same as any other job.

A sheet on the fridge gets looked at more often than anything inside a
phone.

10 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What is stuck to your fridge right now?

## Caption, Facebook

For ten years this account made things out of card. Cake toppers, party
decorations, things you hold in your hand. That did not stop when we started
building an app.

It is a strange fact that nearly every tool for managing screens is itself a
screen. So a good part of what we built comes out of a printer.

There are 47 things to print. Star charts that build themselves from the
jobs you have already set. A calm down corner. Scavenger hunts. Colouring
sheets of the five Planet Friends. Crafts like Kindness Postcards and Phones
Go To Bed, where the phones get their own bed for the night.

There is also a family agreement that you write together, read out loud and
all sign. On each birthday it clears and gets agreed again, because a deal
made with a nine year old should not still bind a twelve year old.

And every finished sheet earns stars, exactly like the jobs on the board.

10 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-17-fb

What is stuck to your fridge right now?

## Visual brief

- Format 3, printable or offline: the real page is the hero on every card.
- Card 1 is a real photo and nothing else will do. **Needed from Justin:** one photo of a printed star chart or agreement on the fridge, no child's face, no surname visible.
- Page previews from `public/printables/*.png` (the rebuilt packs, 5 November). Never the old `content/printables/starter-pack/images/friends` files.
- Line art from the `colouring` field in `lib/content/stage-characters.ts`.

## Proof

- `/dashboard/printables`: "The offline pathway". "Print it, put the crayons out, and the screens look after themselves. Every finished sheet is worth stars…" 47 entries in `lib/printables/registry.ts`.
- Crafts: ten registry entries of kind `craft`, including "Phones Go To Bed", "Kindness Postcards", "The Ice Cream Shop" and the five colour in friends.
- The star chart builder: `/dashboard/printables/star-chart`, "Build your star chart".
- The agreement: `/dashboard/agreement`, "Read it out loud, then sign", `/dashboard/agreement/print`; the birthday reset is the cron `/api/cron/age-up`.
- Every Etsy pack is in the app for any parent (decision of 6 November).

## Checks

- The free step is still the stage check. The free download pages ask for an email, so this post does not send anyone to one and does not say "no sign up" about a printable.
- No Planet Post page is shown, so the "Read for 20 minutes" line cannot appear.
- The ten years of card and cake toppers is the Inspired by Alma story, already public on this account. It is the family's history, not a scene about a child.
- Re count the registry on the day. It was 47 on 10 November.
