# Real life scenes for the Etsy photo set

Justin, 6 November 2026: show the printables used in real life, "classroom,
fridge, kitchen, Christmas day", made on Higgsfield.

Each scene was generated on Higgsfield with one **blank** sheet facing the
camera. The printable itself is never generated: `../scene-composite.mjs` lays
the real page render onto the blank sheet, keeps the room's light on the paper
and keeps magnets and pins on top. So every photo shows exactly what the buyer
downloads, and no AI model ever draws our pages or our text.

The sheet corners for each scene are measured in `quads.json` on the 1024px
originals (checked on a pixel grid); the script scales them to the scene it
loads. A new scene needs its corners added there, measured at 1024px.

Each scene is kept as a 2160px JPEG, enlarged from the 1024px original on
Higgsfield (bytedance_image_upscale, 2k, 2 credits each), so the room has as
much real detail as the page laid into it. Justin, 6 November 2026: "super
real images".

| Scene | Enlarged on Higgsfield (job) |
| --- | --- |
| fridge-white | 11d7d84f-d91a-4d95-87fe-2c990bf5ebee |
| fridge-cream | b1a261b5-d8db-4a17-8e87-ede9275ed2c3 |
| classroom-hessian | 9d957bbb-e3ca-465e-b0d9-24bd00db6c01 |
| classroom-cork | eb059175-37b8-4ea1-9896-17ad65bce72b |
| table-oak | a7e8ac62-69a8-4290-8742-4d112554429d |
| table-breakfast | 000992f7-e3df-4d68-b359-44fcf44cef78 |
| christmas-table | 5e608620-ff5c-4c5f-b1fc-6205123475d1 |
| christmas-fridge | 3d3edd94-1c05-41ee-b341-b002cb747d0b |

What keeps a composite from looking pasted on (all in `../scene-composite.mjs`):
nine samples a pixel, so the page is as soft as the room and its edge is
antialiased; ink lifted and calmed to what a home printer lays down; a faint
paper fibre and the photo's fine grain; and the sheet's own light multiplied in.

`inUse` in a pack's `window.LISTING` shows the scene page filled in the way a
family would (a name, jobs written in, a week of stars, the daily totals), by
`../in-use.js`. Only the photo is filled in, never a product file. A bundle
names the pack whose page it shows with `scenePack`.

| Scene | Higgsfield job (original) | Model |
| --- | --- | --- |
| fridge-white | c88c7521-7d60-4fa6-ad9f-3fd683e9ea71 | gpt_image_2_6, 1:1, 1k |
| fridge-cream | b06fc037-1d47-404d-844e-a3a28a22c3eb | gpt_image_2_6, 1:1, 1k |
| classroom-hessian | c304b130-8754-4478-85ef-ec1f757e7a9d | gpt_image_2_6, 1:1, 1k |
| classroom-cork | 3e022483-e207-43b3-8ec7-1c72e56d2e6e | gpt_image_2_6, 1:1, 1k |
| table-oak | e3a77b22-1bbc-4ae0-9473-08124850e976 | gpt_image_2_6, 1:1, 1k |
| table-breakfast | 9b7cc4df-3d9d-458d-ac24-6bc1fe3cfbcd | gpt_image_2_6, 1:1, 1k |
| christmas-table | 5c6167ec-dec3-4d08-8b1b-0fce995464dc | gpt_image_2_6, 1:1, 1k |
| christmas-fridge | 1529d113-7f78-4705-8051-2032cad3a240 | gpt_image_2_6, 1:1, 1k |

Prompt pattern: "Realistic photo, straight-on view of <place>. In the centre,
one completely blank plain white A4 sheet of paper in portrait orientation,
perfectly flat and facing the camera square-on, filling about half the height
of the frame, held by <magnets or pins>. <Props around the edges>. <Light>.
No people, no readable words or letters anywhere." Flat lays say "top-down
flat lay" and "no hands". 0.25 credits each.

A pack names its scenes in `listing/images.html` (`scenes: [...]`, and
optionally `scenePage`, otherwise the fridge or cover page), and
`build-pack.mjs <pack> listing` writes `01c-real-<scene>.jpg` and
`01d-real-<scene>.jpg` after the cover (JPEG at 92, what Etsy takes).

These scenes are AI made, like the friends, so the listing's creation setting
stays "With an AI generator".
