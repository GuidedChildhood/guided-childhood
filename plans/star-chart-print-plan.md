# Star chart builder — tidier print + cut-out stickers page

Lane: platform code (printables). Branch `claude/etsy-printables-research-izl4ex`.
No migration.

## What the user reported (from the printout screenshot)

1. The printout is untidy: the app bottom nav icons and a footer line print on
   the sheet. The builder's `@media print` only hid its own `.no-print`, never
   the dashboard chrome (`.bottom-tab-bar`, `header`).
2. It needs to also print a page full of yellow DiGi stars to cut out, big
   enough to sit on the chart cells.
3. The Planet Family should show with "1 star = 5 minutes" written there so a
   family reads the deal off the page.
4. The Sticker Book "print stars" button already routes here, so this page must
   print BOTH the chart and the stickers, and say so on the button.
5. Make the builder neater and more formatted (Mobbin: simple, neat, grouped
   chips, one prominent action — Care.com, Suno, Apollo patterns).

## Build

- Expand `@media print` to hide `header, .bottom-tab-bar, .rightnow-desktop,
  .no-print`; add `.cut-page { page-break-before: always }`.
- Neaten the builder: title + one helper line, chip groups in soft cards with
  even spacing, one prominent gold print button in a tidy action row.
- Print button label: "Print the chart and stickers".
- Second print page (`.cut-page`): grid of big gold DiGi cut-out stars with
  dashed cut guides, sized to fit a chart cell; a Planet Family strip (Pebble,
  Bloop, Orbit, Nova, Cosmo from public/printables/friends) with
  "1 star = 5 minutes · 4 stars in a day = one Planet Friend home (20 minutes)".
- Copied the 5 friend PNGs into `public/printables/friends/` so the page can
  serve them (CDN is blocked in this env).

No dashes in any copy. Nunito + IBM Plex Mono, house tokens, chunky radius.
