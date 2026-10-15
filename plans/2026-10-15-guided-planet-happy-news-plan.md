# The Guided Planet in the Happy News design system

15 October 2026. Justin, after comparing Issue 001 with The Planet Post: make the
paper as attractive as the best children's newsletter. He said yes to both:

1. **One name each.** The Planet Post is the free 4 page taster that wins the
   email (another session's lane, `components/printables/news/`). The Guided
   Planet is the monthly 12 page paper it leads into (this lane, `publishing/`).
2. **One look.** The Guided Planet is rebuilt in the Guided Childhood Happy News
   design system (Claude Design, https://claude.ai/artifact/LgLM8FhZ63cKbvkYZT6BWT),
   the same system The Planet Post is built from, so the taster and the paper
   read as one family.

## What changes, and what does not

The words, sources, checks, workflow and approvals stay. Only the look moves,
as a third theme (`"theme": "happy"`, `publishing/design/happy.css`) on top of
`newspaper.css`, the same way boho was added. Both issues switch to it. Boho and
editorial stay available.

## The rules taken from the design system (tokens, exact values)

| Rule | Value |
| --- | --- |
| Paper | White `#FFFFFF` pages and boxes; `butter-light #FEF7E0` for highlighted boxes and the masthead ground. No tinted page fields |
| Ink | `#1A1A2E` text, every edge 3px in print, every ledge `4px 5px 0` ink, no blur |
| Type | Nunito 900 headlines, Nunito 600 to 800 body, IBM Plex Mono 700 caps for eyebrows only. No Fraunces or Caveat in this theme |
| Floor | The Planet Post's own print sizes, measured from its code: body 15px (11 to 11.25pt), task text 13 to 14px (10pt), labels 10 to 11px (7.5 to 8.25pt). (The system's 16px body is its screen size; the Planet Post prints a step smaller, so the two papers match at that size.) |
| One ribbon per page | A tilted (1 degree) crayon banner with an ink edge carries the destination |
| Masthead | Painted rainbow (coral, butter, green, sky, pink) over butter light, the name on a tilted white sheet, a coral FREE burst, smiley dots |
| Friends | Approved waving stills only, on butter light plates or the band on a crayon green hill (Pebble, Bloop, Orbit, Nova, Cosmo) |
| Drawings | Ink line with crayon fills (`crayon-butter #F4D072`, `crayon-sky #8EC3F0`, `crayon-coral #F2957A`, `crayon-green #93CFA8`, `crayon-pink #F2A0C4`, `crayon-teal #7FCFC6`) |

## Order of work

1. Draft PR to claim the lane.
2. `happy.css` and the theme switch in the renderer and templates (cover with
   the rainbow masthead and the Friends band; ribbons; boxes; plates).
3. Crayon remap of our own drawings (`happySwap`), like `bohoSwap`.
4. Render both issues; let the layout checks find every overflow; trim copy
   page by page to fit, never dropping a citation for a claim that stays.
   (Done without trimming a word: the picture strips on the feature pages give
   back a third of their height, and the list page drops its numbered strip.)
5. Visual baselines refreshed, tests, ai-tells, contact sheet to Justin.

No new art is generated and no credits are spent.
