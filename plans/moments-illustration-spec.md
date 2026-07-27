# Job 1 generation spec: the 26 new moment illustrations

Prepared so the art can be generated and wired in one pass. Could not run it in
the web sandbox: the tile CDN (`d8j0ntlcm91z4.cloudfront.net`, the `BASE` in
`lib/content/moment-photos.ts`) is blocked by the environment network policy, so
the reference batch could not be opened to match the style, and generated art
could not be verified against it here. Run this where the CDN and the Higgsfield
account behind `BASE` are reachable.

No dashes in any copy. No people, ever. The object tells the story.

## Shared style preamble (prepend to every prompt)
Warm hand drawn children's picture book illustration, flat art, soft ink line
work, gentle and hopeful in the spirit of Happy News, never clinical, never
scary. Soft butter and cream background, muted warm palette. A single clear
object or small scene, centred, no text, no people, no faces. Reads instantly at
84 pixels. Square. Match the existing Guided Childhood moment tile set exactly.

## Priority draws (no interim tile yet — do these first)

| key | prompt (after the preamble) | TITLE_TO_PHOTO regex |
| --- | --- | --- |
| `clothes_laid` | A child's clothes and small shoes laid out neatly on a bed in soft sleepy morning light. Calm and unhurried. | `/slow to get ready|slow.*morning/i` |
| `plate_new_food` | A plate with one small new food beside two familiar favourites. Calm, no pressure. | `/same few foods|fussy eat|only wants/i` |
| `single_place` | A single place set at a kitchen table, a warm light left on above it. Soft, tender, not bleak. | `/skipping meals|eating alone/i` |
| `bag_snack` | A school bag resting by the front door and a snack on the side, a quiet after school scene. | `/will not talk|about their day|after school chat/i` |
| `phones_group` | A group of phones resting on a table with one gentle empty space among them. Warm, not sad. | `/everyone else has a phone|only one without/i` |
| `laptop_nightlight` | A closed laptop beside a soft glowing night light. Safe, calm, reassuring. Never the content. | `/upsetting|saw something|scary online/i` |
| `cloud_rainbow` | A small round storm cloud with a bright rainbow arcing just behind it. Warm and hopeful. | `/tantrum|meltdown(?! after)|big feelings/i` |
| `worry_jar` | A jar with a soft lid holding little worry shapes, on a calm bedside table. Gentle. | `/worry|anxiety|anxious/i` |
| `rainy_window` | A rainy window pane with a warm glowing light inside. Tender and hopeful. | `/low or flat|seeming low|withdrawn|sad/i` |
| `kettle_calm` | A kettle just off the boil, its steam softening. A held, calm feeling. | `/anger|boils over|rage|angry/i` |
| `bag_blanket` | A dropped school bag beside a cosy folded blanket. A soft landing after a hard day. | `/after school meltdown|home from school/i` |

## Interim upgrades (already show a tile — nice to have, lower priority)
These resolve to an existing tile today, so they are not blank. Redraw only if
time allows, then point the regex at the new key.
- Wants the tablet first thing (now `tablet_sofa`)
- Hard to wake, late night before (now `bed_morning`)
- Phones at the dinner table (now `phone_table`)
- Does not want to go to school (now `shoes_door`)
- Turning the screen off ends in tears (now `tv_remote`)
- Cannot come off the game (now `gaming`)
- Comparing themselves on social media (now `social_phone`)
- Leaving the house takes forever (now `shoes_door`)
- Ending a playdate (now `board_game`)
- Settling into a new school or class (now `uniform`)
- Siblings fighting (now `board_game`)
- Evening wind down before bed (now `bedtime_lamp`)
- Bedtime stalling (now `bedtime_lamp`)

## Wiring (data only, no logic)
For each generated PNG:
1. Generate on the Higgsfield account behind `BASE`, so the URL lands under it.
2. Add `key: BASE + '<filename>.png'` to `MOMENT_PHOTOS` in `lib/content/moment-photos.ts`.
3. Add `[<regex>, '<key>']` to `TITLE_TO_PHOTO`, most specific first. The card
   resolves art by title, so the regex is the whole wiring. Put the new specific
   patterns above any broad interim ones so the fresh art wins.

Verify each title in the migration 073 set actually matches its intended regex
(the titles above are the brief's wording; confirm against the shipped titles).
