# Free Saturday, 14 November 2026: The Christmas Screen Free Countdown

Status: DRAFT awaiting Justin's yes. Nothing is scheduled or posted.

- Slot: Saturday 14 November 2026, 10:00, Guided Childhood Instagram and Facebook (asset 1560723440917227). The slot is free in `Carousels/_build/scheduled-ledger.json`.
- Deck: `tools/social-cards/decks/free-saturday-2026-11-14-christmas-countdown.json` (7 cards). Render: `node tools/social-cards/render.mjs <deck>`.
- Taster: `/free/christmas-countdown` (the tree poster and doors 1 to 6, 3 of 11 pages). Etsy listing 4611164377. Every pack is free in the app during the four free days.
- Links: this first post uses the countdown page directly (`/free/christmas-countdown`, live since PR 1498), because `/free/this-week` only goes live when PR 1535 merges. From the next Free Saturday every link is `/free/this-week`.

## Instagram caption

Free Christmas countdown printable for kids, with no screens in it.

24 doors, one a day through December. Each one is a small thing to do together: a paper chain, hot chocolate and a story, a kitchen disco where the grown ups have to dance too.

This weekend the tree poster and the first six doors are free to print, just your email. Pop it in and the pages come straight to your inbox.

Want all 24? They are free in the Guided Childhood app for four days, no card, along with most of our other printable packs.

Free Christmas countdown: link in bio.

What is the one December thing your family does every year?

#christmascountdown #screenfreeactivities #adventactivities

## Facebook version

Free Christmas countdown printable for kids, with no screens in it.

December fills up fast. This is 24 doors, one a day, and behind each one is a small thing to do together, mostly with things already in your house. A paper chain as long as your family can make it. Hot chocolate and a story, everyone doing the voices. Paper snowflakes for the window. A card for someone who lives on their own.

The tree poster and the first six doors are free to print this weekend, just your email. Pop it in and the pages come straight to your inbox:
https://www.guidedchildhood.com/free/christmas-countdown?src=fb&utm_source=facebook&utm_medium=social&utm_campaign=1114-countdown

All 24 doors and the sticker sheet are free in the Guided Childhood app for four days, no card needed, along with most of our other printable packs.

What is the one December thing your family does every year?

## Story (same evening, 19:00, link sticker)

Card 1 of the deck, with a link sticker reading "Free countdown" to:
https://www.guidedchildhood.com/free/christmas-countdown?src=ig-story&utm_source=instagram&utm_medium=story&utm_campaign=1114-countdown

## Bio link

Add a second bio link titled "Free printable this week". Until PR 1535 merges:
https://www.guidedchildhood.com/free/christmas-countdown?src=ig-bio&utm_source=instagram&utm_medium=bio

Once it merges, change it once to the link that never needs changing again:
https://www.guidedchildhood.com/free/this-week?src=ig-bio&utm_source=instagram&utm_medium=bio

## Alt text

1. A printed Christmas countdown poster shaped like a tree with 24 numbered doors, on a wooden table with hot chocolate, a candy cane and fir branches. Text: 24 December evenings. None of them on a screen.
2. Text: One door a day. One thing to do together. Find today's door, do its card together, stick on its sticker.
3. The countdown poster held on a fridge with two magnets, under fairy lights and Christmas cards. Caption: Pin it up at child height.
4. A numbered list of the first six doors: a paper chain, hot chocolate and a story, paper snowflakes, a kitchen disco, a card for someone who lives on their own, a winter lights walk.
5. The real printable page of activity cards for 1 to 6 December, ready to cut out.
6. Text: Free, just your email. The tree and the first six doors. Print them this weekend. All 24 doors and the sticker sheet are free in the Guided Childhood app for four days, no card, or on Etsy to keep.
7. Text: Send this to the parent planning December. Free Christmas countdown, just your email: link in bio.

## Proof path

- The free page and its email capture: `app/(marketing)/free/[slug]/page.tsx`, `app/api/magnet/route.ts` (PR 1498).
- The activities quoted: page 5 of `content/printables/christmas-countdown/product/christmas-screen-free-countdown-A4.pdf`; "Ten to twenty minutes, mostly with things already in your house" is the pack's own cover line.
- Every pack free in the app during the four free days: `lib/printables/registry.ts` (Justin, 6 November 2026), and the `inApp` flag in `content/printables/free-tasters.json`.
- No figures, no outcome claims for children.
