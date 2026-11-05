# The Road to 16 guide: plan

Written 5 November 2026. Claimed in draft PR 1403, branch claude/road-to-16-guide.

## Why

Justin decided on 5 November 2026 that the Road to 16 guide is the free reward
for a Guided Childhood Passport (Etsy product 1, branch
claude/etsy-passport-printable-94aab4, plan plans/2026-11-05-passport-system-plan.md
on that branch). The Passport's grown ups page promises it at
guidedchildhood.com/etsy-bonus, so the Passport cannot be listed until the
guide and the claim exist. Changed the same day: it unlocks when every page up
to the child's age is stamped, not all five (commit b3f4a179 on that branch).

## What it covers (Justin's words)

Balance, behaviour, what to watch for on each platform and the age it usually
turns up, and the usual school pressure points (the Year 6 phone ask, Year 7
group chats).

## Build

1. `content/printables/road-to-16-guide/`, the Passport's approach copied:
   `guide-data.js` holds every word, `print.html` lays it out, `build-guide.mjs`
   prints A4, US Letter and A4 ink saver, page previews, and `guide-text.md`
   (every line as plain text, for the evidence check and `npm run ai-tells`).
2. Burgundy and gold Passport cover, Planet Friends and DiGi from the approved
   cutouts in `public/digi-squad/friends/`, nothing generated.
3. Proof paths: `lib/content/stages.ts` (device, focus, warning signs, scripts,
   your phone), `supabase/migrations/093_social_platform_guides.sql` (the
   platforms, their settings and watch fors, and the stage each surfaces at),
   `lib/content/device-issues.ts` (the school moments). Platform minimum ages
   from each platform's own terms. UK figures from Ofcom.
4. Evidence red team over every factual line, fixes applied, verdict saved
   in the folder.
5. `/etsy-bonus`: a second offer under the Starter Pack, for a family whose pages
   are stamped up to the child's age. Honour based (a tick, then the email gate), a new
   `road-to-16` magnet in `lib/magnets/registry.ts`, PDFs in
   `public/printables/road-to-16/`.

## Not in scope

No Etsy listing (the guide is a reward, not a product). No phone version yet.
Nothing listed on Etsy.
