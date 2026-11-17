# 17 November 2026: the French Planet Friends

Justin: "review her work, change character names into our planet friends and
make better animations", "a French version of our Planet Friends", "our
Planet Friends dressed up". The scheme's two class toys become two of our
Planet Friends in every piece of our own copy on the French pages, and the
pair get a whisper or shout moment on the approach page and the lesson page.

## Which two friends, and why

| Her toy | Her description | Our friend | Why this friend |
| --- | --- | --- | --- |
| Marie, the teddy | shy, timid, calm, quiet; the class sings quietly | **Nova** | Nova's register is Still: moves once, deliberately, then stops, and the restraint is the joke. That is the whisper. Orbit (Level, tilts the head before answering) was the other candidate; Nova is the quieter of the two and the one whose stillness already reads as calm. Pebble is Bouncy, so wrong for this role |
| Pierre, the duck | loud, cheeky, outgoing; the class sings loudly | **Bloop** | Bloop is the Stage 2 friend (8 to 10), the exact age of Years 3 and 4, and Playful. The hide and seek game fits Bloop's own running joke, which is always searching for the missing piece. Pebble (Bouncy) is louder still, but is the 4 to 7 friend |

They keep their own names. French in how they are shown: a small
bleu, blanc, rouge ribbon on the plate and a word each, "chut" for Nova and
"fort !" for Bloop. The character art is the approved file, unaltered (visual
system section 16). A beret, striped top or scarf ON the character is new
art: the brief is written into the visual system, nothing is generated.

## How it is built

- `schools/lib/languages/fr-friends.ts`: the mapping layer. One pure
  function turns her English prose (Marie, Pierre, Où est Pierre ?, the teddy,
  the toy duck) into Nova and Bloop. Pure TS, no JSON import, so the guard can
  run it directly.
- `french.ts` passes FR_PAGE, FR_HANDBOOK, the unit summaries and the lesson
  book tasks through it at read time. fr.json and the sync are untouched, so
  the nightly sync cannot undo it.
- Slide titles in the running order are her deck, listed as it is: they stay
  verbatim, so the list matches what the class sees on the board.
- `FrenchFriends.tsx` (client): Nova and Bloop on their plates with a whisper
  or shout control. Whisper: Nova leans in, small and soft. Shout: Bloop
  bounces big. GSAP only, reduced motion shows the pose with no movement.
  On the approach page section (renamed "Nova and Bloop", keeping the old
  `#marie-and-pierre` anchor so links still land) and on each lesson page
  beside the song step.
- `scripts/check-french-friends.mjs`: fails if Marie or Pierre reaches a page
  through our copy (the mapped data, and any literal in the French page
  sources), and if fr.json is ever edited to do the mapping instead.

## Where her files still say Marie and Pierre (not rewritten)

| Where | What it says | Count |
| --- | --- | --- |
| Colours decks, lessons 1 to 7 | slide "Où est Pierre ?" | 7 |
| Je peux decks, lessons 1 to 7 | slide "Où est Pierre ?" | 7 |
| Je peux deck, lesson 6 | slide "Réponds à Marie" | 1 |
| Je peux unit (her PDFs and slides) | Marie and Pierre show what they can and cannot do; the book task example "Marie : Oui, je peux !" | throughout |

Proposal for Justin: one line under the running order on the lessons whose
deck has these slides: "The slides call them Marie and Pierre. In class, hide
Bloop and answer Nova." Not shipped until he says yes. Alternative: ask the
author whether she would add a name setting to her decks (she agreed to our
branding, so it is a fair ask), which removes the mismatch at source.

## Built (PR 1609)

- Approach page: the section is now "Nova and Bloop", with the whisper or
  shout card above her six notes, all mapped. Her mascot origin line is
  reworded so it does not claim our friends began as her class toys.
- Lesson page: the card sits in Teach, under "Before the song: whisper or
  shout", on every lesson with a song, linking to the approach section.
- Teach mode: Whisper and Shout buttons in the bar; the chosen friend stands
  in the corner of the board. Icon only on a phone so the bar still fits.
- Print room: her sheet titles name neither toy, so nothing to change there.
  The guard covers it if one ever does.
- Reduced motion: the chosen friend is shown and the other dimmed, no movement.

## Not done, and why

- No new art. Brief in brand/GDC_SOCIAL_VISUAL_SYSTEM.md, section 17, waits for
  Justin's yes and a credit quote.
- No change to her decks, PDFs or fr.json.
