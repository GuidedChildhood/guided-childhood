# Real life scenes for the Etsy photo set

Justin, 6 November 2026: show the printables used in real life, "classroom,
fridge, kitchen, Christmas day", made on Higgsfield.

Each scene was generated on Higgsfield with one **blank** sheet facing the
camera. The printable itself is never generated: `../scene-composite.mjs` lays
the real page render onto the blank sheet, keeps the room's light on the paper
and keeps magnets and pins on top. So every photo shows exactly what the buyer
downloads, and no AI model ever draws our pages or our text.

The sheet corners for each scene are measured in `quads.json` (checked on a
pixel grid). A new scene needs its corners added there.

| Scene | Higgsfield job | Model |
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
`build-pack.mjs <pack> listing` writes `01c-real-<scene>.png` and
`01d-real-<scene>.png` after the cover.

These scenes are AI made, like the friends, so the listing's creation setting
stays "With an AI generator".
