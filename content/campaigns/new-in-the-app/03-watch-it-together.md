# New in the app, 3 of 3: Watch it together

**Draft. Not posted, not scheduled.** Carousel, 7 cards, in
`built/new-03-watch-it-together/`. Deck: `decks/03-watch-it-together.json`.
Lead: Pebble (ages 4 to 7, where the ten watch together films sit).

## The cards

1. We kept saying we would watch it together.
2. So now you book it. Pick a time.
3. You get a reminder fifteen minutes before.
4. It waits on your home page.
5. At the time, it is the first thing on their page.
6. Missed it? It happens. Pick another time. Short films for 4 to 7 year olds, made to watch side by side, with one thing to do after.
7. Save it for a rainy Saturday. Send it to the grown up who does bedtime.

## Caption, Instagram

"We will watch it together later." Later never has a time on it.

So now it does. Pick a time and the film waits on their page, with a reminder for you fifteen minutes before. Miss it and it says so kindly, and you pick another.

The films are short, made for 4 to 7 year olds to watch next to you, and each ends with one thing to do together. Tonight's is where every screen in the house sleeps. Yours too.

What stage is your child? Three questions, no sign up. Link in our bio.

## Caption, Facebook (card 1 on its own)

"We will watch it together later." Later never has a time on it.

The Guided Childhood app now lets you book it. Pick a time for one of the short films and it is waiting on your child's page at that time, with a reminder for you fifteen minutes before. It sits on your home page until then. If the time slips by, it just says pick another.

The films are made for 4 to 7 year olds to watch side by side with a grown up, and each one ends with one small thing to do together after.

Start with the free stage check. Three questions, no sign up: guidedchildhood.com/v/new-03-fb

## Alt text

1. Headline: We kept saying we would watch it together. Pebble, a small yellow character, on a gold path.
2. The app card: Watch it together later. Pick a time and it will be waiting on Ava's page then, with a reminder for you. Book a time.
3. The app card: Booked for today at 11:30am, with Add to my calendar, Change time and Cancel.
4. The home card: Watch together, Screens go to bed first, with Ava today at 5pm.
5. The child's card: Film time, Screens go to bed first, Watch it with Mum, Play.
6. Headline: Missed it? It happens. Pick another time.
7. Save and send card.

## Links

`new-03`, `new-03-fb`.

## Proof paths

- Booking, reminder fifteen minutes before, change and cancel, film time on the child's page, the missed state: `components/lessons/WatchBookingPanel.tsx`, `app/api/watch-bookings/route.ts`, `app/api/cron/watch-bookings/route.ts`, migration 400, PRs 1589 and 1598. Screens from `/ref-watch-booking` with the film family's names.
- Ten films, all stage 1 (4 to 7), each with an after prompt: `supabase/migrations/050_parent_lessons_seed.sql`, `400_watch_bookings.sql`. Only stages at or below the child's own can be booked.
- "Screens go to bed first" is the catchphrase of lesson 1.6, whose film is live. The Tamsin remake of 1.6 is not made yet (it waits on credits), so nothing here says "new film".
- The child's phone buzzes once at the time: quiet hours still hold, nothing buzzes at night (THE-STORY section 7). The caption does not mention the buzz.
