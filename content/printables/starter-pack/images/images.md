# Starter Pack illustrations (Higgsfield, Happy News spirit)

House style in every prompt: warm butter and cream background, soft ink
outlines, gentle grain, flat sticker friendly shapes, no photorealism, no
generic AI gloss. DiGi is the golden star, never a robot or owl.

CDN downloads are blocked in the build environment, so each render is synced
through the GUIDED CHARACTERS Google Drive folder
(1Bc9YCfnJrAEYITXpHJAS9mRQp1YmC3W1), then pulled local and background removed
the same way as the Planet Friends and fish.

## Art slots in print.html

| Slot | Local file | Where |
|---|---|---|
| Cover hero | images/cover-hero.png | Page 1, the butter hero panel |
| Star jump | images/move-hero.png | Page 5, the move art slot |

Until the renders land, both slots fall back to the DiGi golden star SVG so the
pack is complete and premium at every stage.

## Higgsfield jobs queued (recraft_v4_1, Happy News style)

| Job ID | Prompt subject | Status |
|---|---|---|
| 3ecefd52-4071-432e-bec6-603a51d89ceb | Cover hero, family reading the Weekly together | pending, sync to Drive |
| 8be00d00-4675-4bca-80fb-ec3b8b70bd95 | Child mid star jump, workout | pending, sync to Drive |
| d8bdd011-73a1-497d-89d7-0ef96b4fd346 | Football skills, keepy uppy | pending, sync to Drive |
| 99d966f1-d7fc-4f03-9d1e-c811685e9f6b | Dance moves, child spinning | pending, sync to Drive |
| 3c92fc4b-831c-4fad-8615-c8865ef7e974 | Healthy breakfast plate | pending, sync to Drive |
| 40bf307b-e6fc-42bf-9e49-1192cde7542c | Read together, grown up and child | pending, sync to Drive |

To pull one in: sync the job to the Drive folder, download to this images
folder, background remove, then set the matching `.artslot img` src in
print.html and rebuild.

## Planet Friend colour art (page 13, the chart cheer row, the page kickers)

DONE. Justin uploaded the five Planet Friends directly, they were background
removed with the corner seeded colour distance cutout (`gh/process-planet-friends.mjs`)
and now live at `images/friends/<name>.png`. They appear on the family cut out
cards (page 13), the cheer row on the star chart (page 2), and one per activity
page kicker (pages 4 to 8).

The source files are the same the app registry serves by CDN; the CDN and Drive
are blocked to the build environment, so keep pulling them in through an upload
if they ever need regenerating.

| Friend | Drive file id | Drive filename |
|---|---|---|
| pebble | 1Q2OD13po5wkiKN03e0SfXuWql0TfRTgX | hf_20260723_133334_be547506...png |
| bloop | 1EZlQBmBqq62gXQ-Vb2pAqEXomdAJVvyI | hf_20260723_133337_be90a6e3...png |
| orbit | 1z_t5ce9RuJBUL6Lx-yxdE4Eilbrkgbwo | hf_20260723_133343_3cb59e81...png |
| nova | 1kx-tAlNERKEXCzlpRhnGEN6DLDTEG6yE | hf_20260723_185241_3f99a3c0...png |
| cosmo | (not in the folder yet, re sync) | hf_20260723_185509_598025da...png |

The same friends can then drop onto the star chart (page 2) and the jobs list
(page 3), one per item, popping up in colour on the fridge.
