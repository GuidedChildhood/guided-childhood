# Etsy build next: the five gaps from the top sellers research (6 November 2026)

The top sellers research (`plans/2026-11-06-etsy-top-sellers-research.md`,
PR 1422) named five formats that sell in our customer's aisle and that we do
not have. This plan builds all five, to that file's specs, in deadline order.
Formats copied, never anyone's design or words.

## Claimed in the draft PR

| Order | Product | Folder | Friend | Ages | List | Due |
|---|---|---|---|---|---|---|
| 1 | The Phone Under The Tree Treasure Hunt | `content/printables/phone-treasure-hunt` | Orbit | 9 to 13 | £5.99 | listed by 20 Nov |
| 2 | The Planet Day Flip Chart | `content/printables/planet-day-flip-chart` | Pebble, Bloop | 4 to 10 | £6.99 | next |
| 3 | The Jobs Board for 11 to 15s | `content/printables/jobs-board` | Orbit, Nova | 11 to 15 | £5.99 | next |
| 4 | What Would You Do? Table Talk cards | `content/printables/table-talk-cards` | Orbit | 8 to 14 | £5.99 | next |
| 5 | The Road to 16 Board Game | `content/printables/road-to-16-board-game` | DiGi and all five | 6 to 12 | £7.99 | next |

Also: the treasure hunt joins the Christmas Phone Bundle
(`content/printables/christmas-phone-bundle`, listing and photos only).

## How every product is made

PR 1422's pipeline, unchanged, with `first-phone-kit` as the template:
`print.html` in mm on A4, `phone.html` where a phone copy is useful,
`listing/images.html` feeding `listing-images.js`, the last page from
`pack-finish.js`, `listing/listing.md` with 13 checked tags, each pack added
to PACKS in `build-pack.mjs` and to the tag checker's list. Approved Planet
Friend and DiGi cutouts from `public/digi-squad/` only, never a drawn
character. No dashes, UK English, no outcome claims. Titles lead with the
format that sells and a count (the research's main finding: screen time
alone barely sells, chore and routine charts do).

Every claim has a proof path in the product, named in each print.html head
comment and README: the star rate and weekly cap, protected time that stars
cannot buy, the core time that is the child's, family jobs outside the
economy, the quest board pitch, the five stages, Ready For My Phone, the
Family Phone Agreement, and the lessons' real choice questions.

## Checks

`node scripts/check-ai-tells.mjs` on every new html and md file,
`node content/printables/check-listing-tags.mjs`, and every page and photo
looked at by eye.

## Not in scope

Uploading to Etsy. The listings land ready; the Etsy session saves drafts.
