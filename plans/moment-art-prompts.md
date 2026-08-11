# Artwork for the five screen moments

The five tiles added on 11 August 2026 (`come_off`, `tv_morning`, `phone_car`,
`phone_out`, `phone_street`) show their emoji, which is the right fallback and
not the finished thing. The other fifteen are illustrated. These five need one
Higgsfield batch to match.

## Why this file exists rather than the pictures

The Higgsfield connection is live in the remote session and the account reads
72.97 credits on the plus plan, but every generation tool there is behind an
approval gate that a remote session cannot clear. `balance` answers; every
`generate_*`, `models_explore` and `show_generations` call comes back
"requires approval" the moment it is made. So the batch runs on Justin's Mac,
where approving is a tap, and this file is the thing he pastes.

## The locked style

From the 12 July 2026 batch, which produced all thirty one existing tiles:

> flat picture book, thick charcoal outlines, bright flat colours, rainbow
> accent, no text, original animal characters, never a copy of the reference
> artist

The whole set is **animals**, not people. A tile with a human child on it would
stand out badly next to the other fifteen. The reference JP sent for the look
was The Happy News covers: photos die at 84px, flat joyful art reads instantly.

## The one thing to hold on to while generating

**None of these five is a telling off.** They are the moments this company
exists for, and a parent taps them on the evening they went wrong. A tile
showing a smug parent and a shamed child is the wrong product. Every one of
these is warm, ordinary, and on the family's side.

## The five prompts

Square, 512px, no text anywhere in the image.

**1. come_off — Coming off a device**

> Flat picture book illustration, thick charcoal outlines, bright flat colours,
> a rainbow accent, no text. A young rabbit sitting cross legged on a rug
> holding a tablet, looking up at a grown up badger who is crouching down beside
> them with an open hand out, both of them mid conversation rather than mid
> argument. Warm cream background, simple shapes, square tile.

**2. tv_morning — TV first thing**

> Flat picture book illustration, thick charcoal outlines, bright flat colours,
> a rainbow accent, no text. Two young foxes in pyjamas on a sofa in front of a
> glowing television, early morning light coming through the window behind them,
> breakfast bowls on the floor. Warm cream background, simple shapes, square
> tile.

**3. phone_car — Phones in the car**

> Flat picture book illustration, thick charcoal outlines, bright flat colours,
> a rainbow accent, no text. Side view of a small car with a badger driving and
> two young hedgehogs in the back seats, one looking down at a phone and one
> looking out of the window at passing trees. Warm cream background, simple
> shapes, square tile.

**4. phone_out — Phones when eating out**

> Flat picture book illustration, thick charcoal outlines, bright flat colours,
> a rainbow accent, no text. A family of otters around a small round restaurant
> table with plates and glasses, one young otter looking at a phone in their lap
> while the others are talking to each other. Warm cream background, simple
> shapes, square tile.

**5. phone_street — Phones while walking**

> Flat picture book illustration, thick charcoal outlines, bright flat colours,
> a rainbow accent, no text. A young deer walking along a pavement looking down
> at a phone, a grown up deer beside them with a gentle hand on their shoulder,
> a zebra crossing and a lamp post ahead. Warm cream background, simple shapes,
> square tile.

## Where the five URLs go

`lib/content/moment-images.ts`, into `MOMENT_ART`, beside the fifteen already
there. Five lines, nothing else:

```ts
  come_off:     ART_BASE + 'hf_...png',
  tv_morning:   ART_BASE + 'hf_...png',
  phone_car:    ART_BASE + 'hf_...png',
  phone_out:    ART_BASE + 'hf_...png',
  phone_street: ART_BASE + 'hf_...png',
```

`momentImageSrc` returns null for anything not in that map and the tile falls
back to its emoji, which is why the five have been shipping safely without art
and why adding them is a data edit and never a code change.

Then, on the same machine, `node scripts/vendor-art.mjs` to pull them into
`public/art` so nothing the app shows depends on somebody else's CDN staying
up. That script is re runnable and skips anything already downloaded.

## Checking them

`/dev/moment-timeline` renders the tagger outside a daily check in, so the full
timeline can be looked at without completing a deck first. Open it on a phone.
A dud tile is one re roll and one URL edit.
