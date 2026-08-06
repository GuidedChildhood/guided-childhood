# Friends earned honestly, and the moment they arrive

Justin, 6 August 2026, looking at Teo's passport on his phone:
"Ok I'm not [sure] how Teo has earned so many friends here? Can we make even
one is earn[ed] there is a big animated celebration, check mobbin ... i love the
animation where [the] family can turn into a cartoon similar style to his Mario
football when they post up? Can we use higgsfield with a prompt where we copy
that type of animation where a rocket goes into space, lands on Mars, picks up a
relevant family planet friend and brings [it] home back down to earth and pops
up filling their screen."

Two jobs. One is a defect, one is the moment that defect made worthless.

## 1. Why Teo has four Friends

He has two completed days. Under the ladder agreed this morning, two days buys
Pebble and nothing else. The book showed four.

Read from the live database rather than guessed:

    Teo   13-15   completed_days 2   job_streaks 0
          earned_stickers: friend-bloop, friend-nova, friend-orbit,
                           friend-pebble, sheets-1, stars-1
    Iris  11-13   completed_days 0   job_streaks 0
          earned_stickers: friend-bloop, friend-orbit, friend-pebble

Both are the old AGE rule, banked. Before this morning the book read the child's
age band and handed over one Friend per stage, so a child who joined at 13 got
four on their first afternoon. That rule was deleted today. What was not deleted
is what it had already written: `earned_stickers` is permanent by design, and
`earned: owned.has(key) || derived` means a row written by a rule that no longer
exists still shows a Friend as earned forever.

The age rule is gone. Its receipts are still in the till.

There is also a live route that would refill the till tomorrow. `getStickerBook`
computes `friends: earnedFriends(stamps, streaks)`, and `stamps` is the number
of PARENT stages whose lessons and scripts are complete, read by `user_id`. So a
parent finishing Foundation and Builder hands every child in the house two
Planet Friends without the child completing a single day. Cleaning the table and
leaving that open would put the same screenshot back within a week.

### What changes

- **Migration 165** deletes every `friend-*` row from `earned_stickers`.
  Not a filtered delete. `getStickerBook` reconciles earning from the real
  numbers on every read and re-persists anything genuinely earned, so a full
  delete cannot cost a child a Friend they actually own, and it does not need a
  second copy of the ladder written in SQL to decide. Teo keeps Pebble, because
  two days is Pebble; he gets it back on his next read.

- **`earnedFriends` loses the stage route.** Friends are bought with completed
  days and nothing else. This is what Justin decided this morning: 2, 10, 22,
  38, 58. Parent progress already has its own tier in the child's book, the five
  Stamps, added the same day. A parent reading lessons is not a child finishing
  days, and the two should never have been added with a max.

## 2. The moment

Right now earning a Friend is a sentence. It appears inside the streak takeover
as "A new friend is on the way to your sticker book", under a fire emoji and a
week of dots, and then the child has to go and find it. The rarest thing in the
product, fifty eight days of work at the top end, is announced in body copy.

### Mobbin first

Pulled `search_screens` on reward and collection moments. Discord, Finch,
(Not Boring) Weather, (Not Boring) Vibes, Me+, Deepstash, Nibble, Duolingo.
Every one of them is the same six part grammar:

1. Full screen takeover. Everything else gone, no nav, no card.
2. The thing you won is huge and centred, roughly a third of the height.
3. Its name, once, in display weight.
4. A line saying WHY it came. Deepstash: "Get to day 7 of your reading streak".
   (Not Boring) Vibes: "you've released this spirit by reaching 1 hour of focus".
5. Exactly one way out.
6. Short motion. Land, overshoot, settle. Confetti is secondary and never the
   subject.

The two closest to us are Discord's "You've collected DISXCORE Headset, added to
your collection" and (Not Boring) Vibes, which is a dark takeover with a mono
eyebrow and a ribbon naming what earned it. That is already our passport
language.

### What gets built

`KidFriendArrival`, a full screen takeover in the passport's own colours: deep
space navy, gold rules, the Friend's own colour as the glow.

The sequence Justin described, as five beats:

    lift off      the rocket leaves a small Earth at the bottom
    cross         it climbs through stars toward a planet in the Friend's colour
    collect       it reaches the planet and turns
    home          it comes back down and grows toward the viewer
    arrival       gold light floods the screen and the REAL cutout art of the
                  Friend lands in it, full width, with their name

Then the name, the earn line ("Fifty eight full days. Cosmo is home."), and one
button.

The last beat matters most and is the reason this is not simply a video file.
The Friend who arrives has to be the child's actual Friend, in the same art the
sticker book uses, so the thing that filled the screen is the thing they then go
and find in their book. A pre rendered character would be a second copy of the
art that drifts the first time a Friend is re drawn, which has already happened
once to Nova.

So the journey is generic and the arrival is real. That is also why one video
covers all five Friends rather than five videos covering one each.

### The Higgsfield clip

Built to accept it, shipping without it. `KidFriendArrival` plays a CSS and GSAP
flight today, which works offline, costs nothing to load on a phone on 4G, and
respects `prefers-reduced-motion`. A `rocketVideo` prop swaps the first four
beats for an MP4 the moment there is one worth using, and the arrival beat stays
exactly as it is either way, because that is the beat that has to stay real.

Prompt drafted and waiting on Justin. He declined the generation, so nothing was
spent and nothing was rendered.

## 3. Not doing, and why

`stampsFor` reads stages by `user_id`, so both children in a house get the same
Stamps from one parent's progress. That is arguably correct, a passport page is
a family artefact, and unlike the Friends it is not what put four characters in
Teo's book. Left alone and written down here so it is a decision rather than an
oversight.

## Migration number

165. 164 is claimed by PR 716.
