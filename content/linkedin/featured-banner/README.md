# The LinkedIn Featured banner, schools service

Built 23 September 2026. The problem is what the law makes a school teach.
The answer is that the scheme already teaches it.

| File | What it is |
|---|---|
| `banner-1200x627.png` | the banner at LinkedIn's Featured size, ready to upload |
| `banner-2400x1254.png` | the same at 2x, sharper on a retina screen |
| `banner.html` | the source. Open it in a browser and it renders exactly |
| `build.mjs` | regenerates `banner.html` from the tokens and the numbers |
| `nunito-latin.woff2`, `plexmono-latin.woff2` | the two faces, embedded in the html |

## Why it is built rather than generated

An image model cannot be trusted to spell "Reception to Year 13" or to hit
`#EDC35F`, and Canva's API cannot set a font family at all, so a banner made
either way would have shipped in the wrong typeface. This one is rendered from
real Nunito and real IBM Plex Mono with the tokens read out of
`shared/tokens.css`, which is the same place the product reads them.

The fonts are embedded in the html as base64 rather than linked, because the
first render silently fell back to a system face and looked almost right. If
`document.fonts` does not list both families after a render, the file is wrong.

## Every number on it is checkable

| Claim | Held by |
|---|---|
| 57 online and digital requirements | `shared/schools-rshe-2026.ts`, 57 rows, counted rather than typed |
| All 57 taught | every row verdict is FULL, ratcheted by `scripts/check-rshe-coverage.mjs` |
| 29 lessons | the live `CURRICULUM` manifest |
| Reception to Year 13 | the key stage order, EYFS to KS5 |

It says **online and digital**, not "statutory requirements". The July 2025
statutory guidance runs to 195 numbered items across 28 strands; the 57 are its
online and digital part, which is what this scheme is and all it claims to be.
`/hub/rshe-mapping` says the same thing, and the banner had to agree with the
page a head clicks through to.

## The design

- One hard ink seam at x 474 with an 11px butter edge on its right. A door
  opening on to a lit classroom, not a gradient.
- Left, cold: ten blocks of guidance resting on each other, splaying left as
  they rise, running off the bottom of the frame so the pile reads taller than
  the page. The clause lines are abstract and never readable, on purpose.
- Right, warm: one chunky card, 16px radius, 2px ink border, `0 5px 0` solid
  gold shadow with no blur, per the house button rule.
- The 57 ticks sit inside the card as a 19 by 3 grid, because 19 by 3 is the
  only clean factoring of 57. The grid IS the claim.
- Both columns open with an IBM Plex Mono label on the same baseline, one
  naming the problem and one naming us.

Checked at 300px wide, which is roughly how a Featured tile renders: the cold
pile and "All 57 taught" both still read before a word is.

## The text that goes beside it

What goes in the Title and Description fields of the LinkedIn Featured item.
Written to the same shape as the Digital Behaviour Checker item already up
there: a short reframe that negates then corrects, a blank line, then the
concrete thing, then the offer.

**Title**

```
Guided Childhood Schools the statutory lessons, already written
```

**Description**

```
Most schools don't need another framework. They need the lessons written.

Guided Childhood Schools is a complete digital literacy scheme of work. 29 lessons, Reception to Year 13, taught from a word for word script with printable packs, parent notes and the statutory mapping you can show. All 57 online and digital requirements of the statutory RSHE guidance are taught, and KCSIE 2026 is mapped beside them.

Free one term pilot for the first 5 schools.
```

Every figure in it: 29 from the manifest, 57 from
`shared/schools-rshe-2026.ts`, 5 from `schools/lib/pilot.ts` `PILOT_PLACES`,
and £495 from `schools/lib/pricing.ts` if the price line is added back. Those
move, so the text moves with them.

## To change it

Edit `build.mjs`, run `node build.mjs` in this folder, then re-render. Never
edit `banner.html` by hand, it is generated and the fonts inside it are 90 KB
of base64.

## What it must never carry

No character is ever generated fresh. Pebble, Bloop, Orbit, Nova and Cosmo are
only their real art from `public/digi-squad/`. No crest, seal or department
logo, so it can never imply an endorsement nobody gave. No dashes, anywhere.
No claim that is not in the table above.

The image generation prompt, for anyone who wants a looser variant, is in
`../featured-banner-schools-prompt.md`.
