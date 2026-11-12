# The Social Billboard ad round 1: five hooks, one treatment

Made 12 November 2026, the first round for The Social Billboard from the same
ad system as Guided Childhood (brand profile
`content/ads/brands/social-billboard.json`). Deck:
`tools/social-cards/decks/2026-11-12-sb-round-1.json`, theme `tsb`: the
Social Billboard's own look from its brand file and the live site (near black,
white Montserrat 800, its yellow, its red mark), never Guided Childhood's.

Nothing here has been posted, uploaded or spent on.

## The cards

| Card | Hook | Proof on screen | Link code |
| :-- | :-- | :-- | :-- |
| `01-control.png` (control) | YouTube for kids, without the algorithm. | The time of day picker, After School chosen | `sb1-control` |
| `02-it-ends.png` | When the playlist ends, it ends. | The live page's playlist panel: four videos, "Playlist ends. Nothing follows it." | `sb1-it-ends` |
| `03-bedtime.png` | Twenty calm minutes before bed. Then it stops. | The time of day picker, Bed Time chosen, over the night sky artwork | `sb1-bedtime` |
| `04-you-chose.png` | Nothing plays that you didn't choose. | The content type picker, Educational chosen | `sb1-you-chose` |
| `05-five-decisions.png` | Five decisions, made by you. | The live page's Build a playlist panel: age band, tone, type, time of day, length | `sb1-five-decisions` |

The control is the landing page's own headline, so every other hook is
measured against the line the page already uses.

**The hook under every card** is the landing page's own button and closing
line, word for word: **Create your first playlist** and **Free on one
playlist. No card.** The live page (read 12 November) confirms what free is:
one playlist of at least five videos, one child profile, the discovery
playlists, no card.

**Every screen is real.** Three are the product's own criteria pickers
(`tools/tsb-playlist-card/shots`, captured from the app), two are the live
landing page's panel captured today at 390 points wide, three times the
pixels. No playlist screen showing other creators' thumbnails is used. The
night sky behind card 3 is the Social Billboard's own artwork. The "3–6" on
card 5 is the page's own text inside the capture, not our copy.

**Where the adverts link:** `thesocialbillboard.com/safe-youtube-for-kids`,
without www, with each card's code in `utm_content`. The www address fails to
connect (checked 12 November): worth fixing on the site whatever happens here.

## The creative director's pass

`npm run ad-gate`: passed, five cards, including The Social Billboard's own
rules (never "age appropriate", no numeric ratings, no "expert curated", no
"no adverts", no "free forever", no device lock language).

| Card | Score | Lines it lost |
| :-- | --: | :-- |
| Control | 8 | 1: names no moment (the control, by design). 10 |
| It ends | 9 | 10 |
| Bedtime | 9 | 10 |
| You chose | 8 | 7: our words rather than a parent's. 10 |
| Five decisions | 8 | 1: a mechanism, not a moment. 10 |

Line 10 is Justin's.

## The benchmark: against what has run longest near this parent

Few direct rivals advertise on Meta in the UK (`content/ads/swipe/ads.json`,
brand social-billboard). The longest runner is Super Me Show, a children's
show sold as "safe screen time": a wide banner, logo and cartoon, 471 days.

| Line | Super Me Show (471 days) | Control | It ends | Bedtime | You chose | Five decisions |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 One moment named first | 0 | 0 | 1 | 1 | 1 | 0 |
| 2 Reads at thumbnail size | 1 | 1 | 1 | 1 | 1 | 1 |
| 3 The screen proves the headline | 0 | 1 | 1 | 1 | 1 | 1 |
| 4 One accent, space, nothing glows | 0 | 1 | 1 | 1 | 1 | 1 |
| 5 Nothing looks made | 0 | 1 | 1 | 1 | 1 | 1 |
| 6 Nothing cut off | 1 | 1 | 1 | 1 | 1 | 1 |
| 7 A parent's own words | 0 | 1 | 1 | 1 | 0 | 1 |
| 9 One frame, many lines | 0 | 1 | 1 | 1 | 1 | 1 |
| **Total of 8** | **2** | **7** | **8** | **8** | **7** | **7** |

What a long runner does that ours does not: Blumi Baby's year long video
opens on the parent's own words, "kids always asking for tablets, YouTube, or
just one more video". No card here opens on the child asking. That is the
first video for this brand.

## Before it can run (Justin)

1. **An ad account for The Social Billboard.** The key sees only two ad
   accounts (Justin's old one and Guided Childhood). Create one in a Social
   Billboard business portfolio, as for Guided Childhood (`content/ads/SETUP.md`).
2. **Its Facebook Page and Instagram**, added to that portfolio, and the
   uploader key regenerated to include them. Then `META_AD_ACCOUNT_ID_SB`,
   `META_PAGE_ID_SB` and `META_INSTAGRAM_ID_SB` in `.env.local`.
3. **Budget and audience** in `content/ads/meta/config-social-billboard.json`
   (a placeholder copied from Guided Childhood: £5 a day, UK 25 and over).
4. **Counting.** The site cannot count sign ups per link yet, so results will
   be landing page visits and cost per visit until the developer keeps the
   utm values on each sign up.
