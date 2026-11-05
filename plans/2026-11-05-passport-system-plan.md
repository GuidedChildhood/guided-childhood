# The Passport as a system: plan for Justin's yes

Written 5 November 2026, after product 1 (the printable Passport) was built
on branch claude/etsy-passport-printable-94aab4. Nothing here is built yet.

## What Justin asked for (his words, tidied)

The Passport needs to be a system. Use it as the way to get families signed
up to the platform, and also to work with downloads: say clearly that the app
gives the full effect, but let a family buy a download for each stage and
each part of a passport page. They tick it off when done, add the sticker,
and the page fills up. Packs for parents and for kids: a birthday pack, a
school pack and so on. And a final document at the end covering balance,
behaviour, what to watch for on each platform and the age it usually
arrives, and the usual school pressures.

## How it fits what already exists

- Every stage page already has three parts: the talk, the doing, the check.
  Those are the natural slots for packs. A pack is "the kit for this part".
- The app already stamps the same five pages on lessons, scripts and the
  stage check. So the honest line is: paper does it by hand, the app does it
  for you. Product 1 now says this on the grown ups page ("For the full
  effect, the app").
- `lib/content/stages.ts` already holds, per stage, the device the child
  usually has, the warning signs and the script. That is most of the final
  document's raw material, with a proof path.

## The proposal

1. **A "Go further" strip on each stage page** of the printable, naming the
   packs that fit that page and part, by name only (an Etsy listing title),
   never a link to a checkout. Each pack ships with its own small stage
   sticker, so buying it and finishing it ends with a sticker on the Passport.
2. **Packs mapped to page parts.** First pass from the printables we already
   have, to be checked against each pack's age band:
   - Pebble, 4 to 7: Earn Your Screen Time (5 to 7 chart), Star Chart,
     Starter Pack, Calm Down Kit, the early learning cards
   - Bloop, 8 to 10: Earn Your Screen Time (8 to 11), Family Phone
     Agreement, Back to School Escape
   - Orbit, 11 to 12: Family Phone Agreement, School Year Planner
   - Nova and Cosmo: gaps, so these are where new packs earn their place
3. **Occasion packs** (birthday, school, Christmas) each say which Passport
   page they belong to, so a gift still fills the book.
4. **The final document, The Road to 16 guide:** balance, behaviour, what to
   watch for, each platform with its own minimum age and when it usually
   turns up in a class, and the school pressure points (the Year 6 phone ask,
   Year 7 group chats). Every fact goes through the evidence red team before
   it ships, and platform ages come from each platform's own terms.
5. **The sign up hook:** every pack's last page offers the free bonus at
   /etsy-bonus as now, plus one line that the app keeps the Passport for you.

## Rules that limit it

- Etsy: no checkout link and no cheaper elsewhere line inside a file or a
  listing. Naming other listings in the shop is fine.
- No outcome or medical claims about a child. Packs say what the family does.
- Planet Friends and DiGi only.

## What Justin needs to decide

1. Yes to the "Go further" strip on product 1 now, or wait until the packs
   for it are listed?
2. Which of the 12 products in the 5 November brief map to which page part
   (that brief's list is in the other session, not in the repo).
3. Is the Road to 16 guide a paid product, or the free reward for a
   completed Passport?
