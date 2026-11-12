# Etsy listing package: Screens At Granny's

Part of the paid line (plans/2026-11-06-etsy-paid-downloads-build-plan.md).
A Christmas visit pack: the family's screen deal, written down so it travels
to Granny's, Grandad's, or any house that is not their own. Fronted by Bloop.
Not named in the Passport's Go further strip, so its sticker page asks the
family to stick it on the Bloop page with no tick.

## Title (89 characters)

Screens at Granny's Printable | Grandparent Screen Time Rules Card | Christmas Visit Kids

## Price and listing setup

- List price: £2.49, set on 11 November 2026 (it was £4.99). Etsy adds
  20 percent UK VAT, so UK buyers see £2.99.
- The shop wide 25 percent sale runs to 30 November 2026, so until then they
  pay about £2.24.
- The £4 floor is retired: the charts and contracts this competes with sell
  at £1.40 to £4.68 (`plans/decisions.md`, 11 November 2026).
- Seasonal: list by mid November, lead the photos with Christmas until
  6 January, then keep it live for Easter, half terms and summer visits.
- Type: digital download. Files: the three PDFs in `product/` plus a zip of
  the two phone screens in `phone/`.
- Not editable. Every card is filled in by hand, or on the phone screen with
  the phone's own markup pen.

## Description

The same screen deal, in a different house.

Christmas at Granny's. Different telly, cousins with tablets, a grandparent
who loves saying yes, and you, feeling awkward about saying no in somebody
else's front room. Screens At Granny's writes your family's screen deal down
so it travels with you, and so your host never has to guess or be the baddie.

It uses the three kinds of time from the Guided Childhood app. Our time: a
little every day that is your child's, no strings. Earned time: extra jobs
earn stars, and one star is five minutes of screen time unless you agree your
own rate. Protected time: meals, bedtime and the hour before it, maybe the
Christmas dinner table, that no stars can buy. If your child asks for more,
the host has the words: "Let's ask Mum or Dad together." You answer with a
next step, and your host never has to say no.

What you get:

- For the grown ups at home: why a travelling deal helps, and how to fill it
  all in together in ten minutes the week before you go
- The three kinds of time, one big card each, to read with your child
- The card for your host, two to a page: their own time, your star rate, when
  screens rest, jobs that earn a star, the words to use, your number, and a
  warm line that the host is the boss of their own house
- My deal at Granny's, your child's own card in big friendly type, with boxes
  to fill in and a row of stars to colour for every job
- The visit tally: up to seven days of stars earned, minutes used and a face
  for each day, counted together at bedtime
- Thank you for having me notes, two to a page, for your child to write and
  draw on the last day
- Your Passport sticker for the Bloop page of the Guided Childhood Passport
- A4 and US Letter in full colour, plus an ink friendly version
- A phone version: the host card as a screen you can send by message, and the
  three kinds of time

This is an instant download. Nothing is posted. Print as many copies as your
own family needs. For personal use only.

I am Justin, a dad who got tired of the screen time fight. If anything will
not print or open, message me and I will sort it fast.

## 13 tags (every one 20 characters or fewer)

| Tag | Characters |
|---|---|
| grandparent rules | 17 |
| screen time rules | 17 |
| screen time chart | 17 |
| christmas visit kids | 20 |
| grandparents gift | 17 |
| family screen rules | 19 |
| kids house rules | 16 |
| holiday screen time | 19 |
| sleepover rules kids | 20 |
| christmas printable | 19 |
| kids reward chart | 17 |
| thank you note kids | 19 |
| parenting printable | 19 |

## The photo slots

| Slot | File | What it shows |
|---|---|---|
| 1 | `images/01-cover.png` | The cover, brand printable format: the child's card in front, the host card behind, Bloop, the gold pathway |
| 2 | `images/02-whats-inside.png` | All eight pages, as rendered |
| 3 | `images/03-close-up.png` | The host card close up |
| 4 | `images/04-passport-sticker.png` | The last page: the Bloop sticker and the free gift |
| 5 | `images/05-formats.png` | A4, US Letter, ink friendly, phone |
| 6 | `images/06-how-it-works.png` | Fill, pack, hand over, count |
| 7 | `images/07-phone-version.png` | The two phone screens |

All 2000 by 2000, rendered from `listing/images.html` by
`node content/printables/build-pack.mjs screens-at-grannys listing`. Every
page in them is the real page render, never a redraw.

## Listing video (12 seconds, hands on table)

Overhead, kitchen table, a mug of tea, no faces, no voiceover. A child's hand
writes a number in the "Every day I get" box. A grown up's hand slides the cut
out host card across the table next to the mug. An older hand picks it up.
Text on screen: Same deal. Different house.

## Instagram reel (same footage)

First frame text: Going to Granny's for Christmas? Take the screen deal with you.
Caption: Their own time, five minutes a star, and the times screens rest, on
one card for Granny. If they ask for more, she has the words: let's ask Mum
or Dad together. Printable, link in bio.

## Compliance

- The deal matches the app exactly (lib/quests/time-tiers.ts,
  lib/quests/device-time.ts, components/quests/TimeTiersCard.tsx): a small
  core that is the child's, used first and gone at midnight; one star is five
  minutes, or the family's own rate; protected windows no stars can buy, where
  a start becomes an ask to the parent, never a flat no. The protected line on
  the host card is the app's own mealtime line, word for word.
- Family jobs stay outside the economy: clearing your own plate does not earn
  a star, extra jobs do.
- No outcome or medical claims anywhere. The parent page says the pack does
  not promise any result for a child.
- The last PDF page points to guidedchildhood.com/etsy-bonus, a free page (the
  Starter Pack for an email). No checkout link, no price, no cheaper
  elsewhere line.
- The review line on the last page asks kindly and offers nothing in return.
- Bloop and DiGi were made with AI tools. Say so in the listing's creation
  details, per Etsy's Creativity Standards.
