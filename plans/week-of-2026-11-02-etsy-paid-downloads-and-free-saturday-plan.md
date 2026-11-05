# The old Etsy shop, paid downloads, and a free download every Saturday

Justin, 4 November 2026: "I need to come up with clever ideas for turning the
old Etsy account into Guided Childhood and downloads that are paid for, so come
up with ideas for downloads. Also need a once a week boost of a free download
and capturing email addresses on Insta. Make a plan."

Status: APPROVED by Justin, 4 November 2026. The shop is not switched over
yet, so Part 1 comes first. Paid line in the ship order as written. Keyword
DMs stay banned. £15 a week boost on the winner once four have run.

## What already exists (so none of it is rebuilt)

- `plans/etsy-launch-plan.md` (20 July): the whole Etsy method. Phase 0 revive
  checklist, the 30 listing grid, pricing floor of £4, the funnel rules, the
  seasonal calendar. Still right. This plan does not replace it, it gives it
  a season and a product list for November to January.
- `content/etsy-shop/rebrand-assets.md`: shop title, announcement, About,
  policies, banner and icon, all paste ready.
- 14 listing packages in `content/printables/*/listing/listing.md`, £2.99 to
  £8.99 (star chart, starter pack, earn your screen time, family phone
  agreement, calm down kit, school year planner, seven activity sheets).
- `/etsy-bonus`: the email gated bonus every Etsy PDF points at.
- `/free` and `/free/planet-post`: The Planet Post Issue 1, live, email gated
  download, A4, Letter, ink saver, booklet.
- `plans/2026-10-13-free-printables-lead-magnets-plan.md`: four more freebies
  approved but not built yet (Bored Jar, Screen Time Tickets, Five Screen
  Fights, Seven Night Reset). These become the first weeks of Free Saturday.
- Email: Resend, `starter_leads` with `source: magnet:<slug>`, one email a
  week per address enforced in code.

The gap is not ideas or copy. It is that the shop has not been switched over,
there is nothing seasonal in the grid, and there is no weekly rhythm.

## The rule that ties it together

Free shows one mechanic. Paid is the whole kit for a moment. Every free
download is the taster of one paid one, and both end at the stage check:
*What stage is your child? Three questions, no sign up* (`/starter-pack`).
Free downloads are never listed on Etsy; Etsy sells, the website collects
emails.

## Part 1. Switching the old shop over (one sitting, Justin)

Do `plans/etsy-launch-plan.md` Phase 0 in this order, nothing new to write:

1. Check Finances: has the shop ever crossed 10,000 dollars in a year? If not,
   opt out of Offsite Ads today, while it still can be.
2. Keep every old listing that has reviews. Edit it into a Guided Childhood
   product rather than deleting it, so the reviews carry over.
3. Paste the rebrand assets: name, banner, icon, title, announcement, About,
   policies.
4. List the five strongest existing packages first (star chart, starter pack,
   earn your screen time, family phone agreement, calm down kit), then the
   Christmas line below.

## Part 2. Paid download ideas, ranked by season

Price is the list price; the launch plan's permanent 25 percent sale sits on
top. Every one has a proof path in the real product, which is what makes it
ours and not another screen time ticket.

| # | Product | For | Price | Why it sells now | Proof path in the app | Build |
|---|---|---|---|---|---|---|
| 1 | **The First Phone Kit.** Readiness check, a phone deal the child writes with you, the first 30 days plan, the setup night checklist | Parents of 9 to 13s giving a phone at Christmas | £9.99 | A phone is the biggest Christmas present a lot of 10 year olds get. Nobody sells the plan that goes in the box | The passport and Ready For My Phone, the devices setup guides, the family phone agreement | MEDIUM, mostly reuse |
| 2 | **The Christmas Screen Free Countdown.** 24 doors, 1 to 24 December, one Planet Friend activity a day, a sticker sheet to fill them | 4 to 11 | £5.99 | Advent sells from mid November. Every other advent printable is crafts with no point; this one quietly builds the balance wheel | The balance wheel, five a day, the Planet Friends | MEDIUM |
| 3 | **Screens At Granny's.** The house rules that travel: one card for the grandparents, one for the child, the three kinds of time in plain words | Families visiting over Christmas | £4.99 | The holiday fight is often between adults. A clever, giftable, shareable one | The three kinds of time: theirs, earned, protected | SMALL |
| 4 | **Are We Nearly There.** A screen free car and travel pack: games, a journey map to colour, a "tablet after the next town" deal card | 4 to 11 | £4.99 | Christmas and half term journeys. Bought the night before | Earned time and the jobs (the deal card is the star economy on paper) | SMALL |
| 5 | **The Christmas Phone Bundle.** 1 plus the family phone agreement plus the calm down kit | Same parent as 1 | £14.99 | Bundles are the revenue core; priced well under the sum | As above | Bundle only |
| 6 | **The Personalised Star Chart.** The child's name and their chosen Planet Friend drawn in | 4 to 10 | £6.99 | Personalised listings earn more and get gifted. Our chart is drawn in code, so a name is a field, not an hour of design | The star chart and the buddy a child picks in the app | MEDIUM, one form |
| 7 | **The Holiday Screen Deal.** Two week planner for the school holidays: the daily core, the jobs board, the protected times, a tally | 5 to 12 | £4.99 | Every school holiday, starting 19 December | The child app quests and the weekly cap | SMALL |
| 8 | **The 30 Day Screen Reset Journal.** The free Seven Night Reset grown into a month: one change a day, five faces each night, the line you draw at the end | Whole family | £7.99 | New Year reset is the January peak | The check in, baseline and five faces | MEDIUM |
| 9 | **Our Class Screen Promise poster set.** For teachers: A3 poster, 30 pupil promise slips, a parent letter | KS1 and KS2 teachers | £6.99 | Teacher gifts peak in November and teachers buy for themselves in January. Feeds the schools app | The schools scheme and its lessons | SMALL |
| 10 | **The Whole System Bundle.** Star chart, earn your screen time, calm down kit, the Five Fights words, the 30 day reset | Any parent | £24.99 | The top price point that makes the others look sensible | The whole product on paper | Bundle only |
| 11 | **The Guided Childhood Passport, printable.** The burgundy passport to fold, five stage pages (Pebble to Cosmo), a printable stamp and sticker sheet, and the "what earns each stamp" page so a family can work towards it on paper | 4 to 16 | £7.99 | The banner sells it ("Get your Guided Childhood Passport"), so it must be listed before the new banner goes up | The Passport in the app (`components/pathway/PassportBook.tsx`, `PassportZineSheet.tsx`, the stamps in `PassportStamps.tsx`) | MEDIUM, mostly reuse |
| 12 | **The printed Passport with real stickers.** Later: the £14 printed keepsake already in the app (`components/passport/PassportOrderCard.tsx`, `plans/2026-09-16-personalised-passports-and-stickers.md`) offered as a physical Etsy listing | 4 to 16 | £14 | The keepsake gift; physical, so shipping and a print partner first | As 11, plus the sticker sheet in `public/shop/sticker_sheet.webp` | LARGE, physical |

Ship order: 11 first (the banner names it), then 1, 2, 3 by 20 November (Christmas has to be listed early to rank),
then 5 and 4, then 7 by 12 December, 8 and 9 by 28 December for January.
6 and 10 when there are reviews to carry them.

Each one is made by `.claude/skills/printables-engine`, which produces the
PDFs, the image set, the phone version and the listing package, so nothing
reaches Etsy without its last page pointing at `/etsy-bonus`.

## Part 3. Free Saturday, one free download every week

Saturday is already the family account's Happy News day. From 7 November it
carries one free download every week. Every free download is the taster for
a paid one in Part 2.

| Saturday | Free download | Taster for | Build |
|---|---|---|---|
| 7 Nov | The Planet Post, Issue 1 | The whole series | Built, relaunch it |
| 14 Nov | The Bored Jar, 40 slips | Are We Nearly There | SMALL |
| 21 Nov | The Christmas Countdown, the first 7 doors | The 24 door Countdown | Part of paid 2 |
| 28 Nov | Five Questions Before The Phone Goes Under The Tree | The First Phone Kit | Exists as `five-questions`, a new cover |
| 5 Dec | Screen Time Tickets, where bedtime is never for sale | The Holiday Screen Deal | MEDIUM |
| 12 Dec | The Words For The Five Screen Fights | The Whole System Bundle | SMALL to MEDIUM |
| 19 Dec | The Planet Post, Issue 2: Phones Go To Bed Too | The series | Content only |
| 26 Dec | Rest week, repost the Countdown for the last days | | None |
| 2 Jan | The Seven Night Screen Reset | The 30 Day Reset Journal | MEDIUM |

The weekly boost, in this order and never more:

1. **Organic first.** Saturday feed carousel built by `social-week` (the real
   rendered page as the hero, house visual system), a Story with the link
   sticker on Saturday and again Sunday, then it joins a "Free" Story
   Highlight so every past one stays findable.
2. **Email.** The leads list gets this week's free download as its one email
   of the week. That is the reason to stay subscribed, the Big Life Journal
   pattern, and it fits the one email a week rule already in code.
3. **Paid only on the winner.** Every Monday look at the last download's
   numbers (downloads and emails from Instagram). Once four have run, put a
   small boost (£5 a day for 3 days, UK parents) behind the one with the best
   saves to downloads, not behind every one. Logged in
   `content/ads/results-log.md` per `.claude/skills/ad-studio`.

On honesty: we do not say "free for a limited time" unless it is true. The
hook is the series ("a new one every Saturday"), which is true and does not
fall foul of the no fake urgency rule in `content/brand-story/funnel.md`.

Change to note: `family-social` currently says roughly one Saturday in three is
a printable. This makes it every Saturday. If approved, update the skill.

## Part 4. Capturing emails from Instagram

Instagram does not allow links in captions, so the whole job falls on three
places, all pointing at the same page:

1. **Bio link** to `guidedchildhood.com/free?src=ig`. Bio line: "A free
   printable every Saturday. Ages 4 to 16." The page opens on this week's
   download, the preview is visible straight away, and the download asks for
   an email. Below it, the stage check.
2. **Story link sticker** every Saturday and Sunday, straight to that week's
   `/free/<slug>?src=ig-story`.
3. **The Free Story Highlight** pinned first on the profile.

What the caption says, never just "link in bio" (funnel rule 3): "Free, every
Saturday. Tap the link in our bio, pop in your email and it lands in your
inbox to print."

**The comment a keyword and get a DM tool (ManyChat).** This is what most
accounts use and it works. It is currently against your own rule 4 in
`content/brand-story/funnel.md` ("it reads as a marketer"). It is your call,
see question 3. If yes, it is used on the Saturday free download only, the DM
sends the `/free` link (the email is still captured on our page, so we own
it), and it is never used on LinkedIn, where it gets reach cut.

## What gets built (small, in the platform lane)

1. `/free` opens on "This week's free download": a `week_of` date on each
   magnet in `lib/magnets/registry.ts`, newest one shown first. SMALL.
2. `?src=ig`, `?src=ig-story`, `?src=etsy` recorded against the lead in
   `app/api/magnet/route.ts`, so we can see which door the emails come
   through. SMALL.
3. The Saturday free download email for leads, as their weekly email. SMALL
   to MEDIUM.
4. The four freebies, as already planned, one PR each.
5. The paid line, by the printables engine, ship order above.

No migration needed for 1 and 2 if `source` carries the `src`; check at build
time and claim a number in the draft PR if one is needed.

## How we will know it is working

- Etsy: visits to sale 2 to 4 percent in the first 90 days, 15 reviews on the
  First Phone Kit by the end of January.
- Instagram: emails per week from `src=ig`, the number that decides the boost.
- The north star from the Etsy plan stays: stage checks and members that came
  through Etsy and Instagram.

## Questions for Justin

1. Has the old shop been switched over yet (Part 1), and what is it called now?
2. The ten paid ideas: approve the ship order as written (recommended), or
   pick your top three.
3. Comment a keyword for the DM on Instagram: keep it banned (current rule),
   or allow it on the Saturday free download only?
4. The boost budget: £15 a week on the winner once four have run
   (recommended), or organic only for now?
