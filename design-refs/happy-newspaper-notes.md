# The Happy Newspaper: teardown notes

Justin, 2 September 2026: "review this site for inspiration", with the shop
(thehappynewspaper.com/shop) and two screenshots: the Instagram profile and
the News for Schools page. The site is blocked from the build environment,
so this is read from the screenshots, the brand's public write ups, and the
rule already in content/brand-story/visual-system.md: we take the energy,
never the artwork. Emily Coxhead's lettering and drawings are hers.

## What the site is

An independent quarterly newspaper of good news (since December 2015, by
Emily Coxhead, Lancashire) with a WordPress and WooCommerce shop behind it:
the paper by subscription, prints, cards, books, stationery, a schools
initiative. 552K Instagram followers. The whole brand is one colour, one
hand, one feeling.

## Typography

- Display: Emily's own hand lettering, black, upper case, uneven baseline,
  used for the logo, headlines and the words inside pictures ("FREE HAPPY
  NEWS", "KEEP Celebrating HAPPY NEWS"). Lettering is the brand.
- Body: a plain humanist sans (Open Sans or close), grey, about 17px,
  centred, generous line height, short paragraphs. Nothing clever, so the
  lettering stays the only voice.
- No mono, no small caps labels. Labels are lettered ribbons instead.

## Colour

- One sunshine yellow (about #F7D64A) on white, black ink for every line.
- Pastel plates behind illustrations: a soft pink circle (#F9D5DB) under the
  post box. Red (#E8492B) and blue (#3B8BEB) only inside drawings.
- Mobile shop bar: a full width yellow strip with account and basket, black
  icons. The one place the yellow is used as a surface rather than a mark.

## Layout

- Single centred column, big breathing space, one picture per beat, copy
  under it. Nothing sits beside anything on a phone.
- The illustration lives in a circle plate, which turns a flat drawing
  into a picture book page.
- Sticky yellow bottom bar with the round smiley coin button above it.

## Imagery

- Every drawing tells a story rather than showing an object: the paper
  going INTO the post box, with a ribbon saying what it means. Thick black
  outline, flat fills, a ribbon label on the picture.
- Photos are of a real person holding the real paper, on a beach, in a
  kitchen. Product as a thing in a hand, never a render.
- Instagram: pinned posts carry a lettered headline on flat yellow, and the
  grid alternates yellow cards with real photos.

## Voice

Warm, plain, grateful: "spread the happiness even further", "so incredibly
grateful for any support you can afford to give", "we run the initiative
like a raffle so all schools will, at some point, receive free newspapers".

## What we take, and where it lands

Already ours since 2 September: the ink edge, the crayon fills, the ribbon
masthead on the drawn sheets, the sticker stamps (HappyNewsBits, HappyPaper,
KidHomeTiles). The next things worth taking:

1. **The circle plate.** A soft pastel circle behind the hero drawing on
   child screens (day done, the printable open screen, the friend arrival)
   and behind the tile icons. One CSS circle, big win.
2. **Story icons over object icons.** The post box is the rule: the icon
   shows the situation. Ask for a job should be a hand holding up an idea
   card, Use my time a timer with a job ticked beside it. Next pass on
   HappyIcon.
3. **A ribbon for a section head, once per screen.** HappyRibbon exists on
   paper; the child app can use it for the one heading that matters (Five a
   day), never for every heading.
4. **One colour, one surface.** Butter as the child tab bar surface with
   ink icons, the way the yellow strip carries the shop. The parent side
   stays cream and calm.
5. **The product in a hand.** Every printable listing (Etsy and the
   /printables shop pages) should lead with a photo of the printed sheet
   held by a real hand, not the PDF render.
6. **The schools raffle, as a business idea.** Any school signs up, a draw
   each term, a free class pack to the winner, a donate line for parents to
   fund more. Cheap goodwill and a list of schools. For Justin to decide,
   not built.

## 14 September 2026: the two reference screenshots, and what they changed

Justin sent two more shots and said "reference images". Read from them:

1. **The News for Schools page.** A white page. A big flat sun yellow disc
   with a drawn envelope on it (red heart seal, three motion dashes). Under
   it, grey centred body copy. Then a big flat soft pink disc with the drawn
   post box, the paper going in, and a yellow ribbon lettered FREE HAPPY
   NEWS across it. Nothing patterned, nothing tinted behind the discs. The
   disc IS the decoration.
2. **The subscription page.** The paper's own front: a painted rainbow
   (red, orange, yellow, green, blue, pink, thick painted bands) rising over
   a pale yellow ground, the paper lying on it at a tilt, the name lettered
   in black over a big sun yellow disc. The sun logo in the corner has
   short black dashes for rays.

What landed today, against those two:

- The polka dot sky from the morning's Kenji pass is gone. A dotted ground
  is exactly what the page does not do; it is white, and the colour is in
  the discs. (`KidWeekCalendar`, `KidSchoolWeek`, the week page, the ask
  page.)
- Every day on a child calendar is a disc: butter with the Planet Friend on
  it for a done day, the soft pink with the sun's rays for today, dashed
  white for a day to come, pale for a quiet day gone. The count is a butter
  burst. `HAPPY.pink` (#F9CFD9) and `SunRays` joined the kit.
- The week page opens with a masthead: pale butter card, the painted
  rainbow rising out of the corner (`RainbowArc painted`, our five bands),
  the title over a butter sun disc, the Friend on a white plate
  (`KidWeekMasthead`).
- The sticker book leads with die cut stickers on white discs, the how one
  tap behind.

Still ours to draw, never theirs: the lettering stays Nunito 900, the
rainbow is our coral, butter, green, sky and pink, the drawings are the
Planet Friends.
