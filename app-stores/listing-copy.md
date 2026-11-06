# Store listing copy

Written 6 November 2026 for Google Play and the Microsoft Store. Justin's voice,
no dashes, every line traceable to something the app really does (proof paths
at the bottom). Checked with `node scripts/check-ai-tells.mjs app-stores/listing-copy.md`.

Payments stay on the website, and the Play app is consumption only
(see `app-stores/play-billing.md`), so no copy here mentions a price or asks
anyone to buy. Creating a free account is fine and is said plainly.

---

## Google Play

**App name** (30 max)

Guided Childhood

**Short description** (80 max)

Get your child ready for a phone by sixteen. Ten minutes a day, together.

**Full description** (4,000 max)

If screens are a fight in your house most nights, you are not alone. Most of us were never told what to do instead of just taking the phone away.

Guided Childhood is the plan. Ten minutes a day, parent and child working on it together, so your child reaches sixteen ready for a phone and social media.

FOR YOU

• A daily path with one clear thing to do today.
• The words for the hard conversations. The stopping point, bedtime, the first phone, the group chat. Short scripts you can read once and say tonight.
• DiGi, a guide built on the research, who answers with where you are, the next step and the words to use. DiGi never just says yes or no.
• A quick check in on the worries you name. Five faces, from really tough to going great, so you can see whether things are moving.
• Lessons for every stage from 4 to 16, and a passport that shows what your child can actually handle.

FOR YOUR CHILD

• Their own app, opened from a link you share. No account, no password, no chat.
• Jobs earn stars and stars buy screen time, at a rate you set. Bedtime and mealtimes stay protected.
• Five small things a day, lessons with a buddy they choose, and printables for the fridge if you would rather keep it on paper.

YOUR FAMILY'S INFORMATION

• No adverts and no advertising trackers.
• Your child never chats with an AI. From age 10 a child can ask for a homework hint card, and the question is not kept.
• You can delete your account and everything in it from Settings.

Made in the UK by Justin Phillips, a dad who wanted a plan for his own family.

Create your free account in the app, or sign in if you already have one.

**Category**

Parenting

**Tags** (pick up to five in Play Console)

Parenting, Education, Family, Kids, Productivity

**Contact details**

Email: hello@guidedchildhood.com (the address the privacy policy already gives)
Website: https://www.guidedchildhood.com
Privacy policy: https://www.guidedchildhood.com/privacy

**Graphics**

| Asset | File | Spec |
|---|---|---|
| App icon | `public/icons/icon-maskable-512.png` | 512 x 512 PNG |
| Feature graphic | `app-stores/screenshots/play-feature-graphic.png` | 1024 x 500 PNG |
| Phone screenshots | `app-stores/screenshots/phone/01` to `06` | 1080 x 1920 JPEG |

Upload the phone screenshots in number order. 01 is the parent's daily path,
02 DiGi, 03 a script, 04 the check in, 05 and 06 the child's own app.

---

## Microsoft Store

**Product name**

Guided Childhood

**Short description** (shown on the listing, 1,000 max)

Get your child ready for a phone by sixteen. Ten minutes a day, parent and child together, with the actual words for the hard conversations.

**Description** (10,000 max)

Use the Google Play full description above, unchanged.

**Product features** (up to 20, 200 characters each)

1. A daily path with one clear thing to do today
2. Scripts with the words for the hard conversations about screens
3. DiGi, a guide built on the research, who gives a next step rather than a yes or no
4. A quick check in on the worries you name, five faces from really tough to going great
5. Lessons for every stage from age 4 to 16
6. A passport that shows what your child can actually handle
7. Your child's own app, from a link you share, with jobs that earn stars and stars that buy screen time
8. No adverts and no advertising trackers

**Search terms** (up to 7)

parenting, screen time, first phone, social media, kids, family, digital parenting

**Category**

Kids and family (subcategory: Parenting, if offered). Education is the fallback.

**Screenshots**

Desktop, 1920 x 1080: `app-stores/screenshots/desktop/d1-home.jpg`,
`d2-kids-app.jpg`, `d3-starter-pack.jpg` (the live site).
Mobile: the six phone screenshots above.

**Store logos**

`public/icons/icon-maskable-512.png` for the 1:1 logo (300 x 300 is the
minimum; Partner Center scales it).

**Privacy policy URL**

https://www.guidedchildhood.com/privacy

**Website**

https://www.guidedchildhood.com

---

## Proof paths

| Claim | Where it lives |
|---|---|
| Daily path, one thing today | `components/daily/TodayPathBig.tsx`, `lib/home/next-up.ts` |
| Scripts for hard conversations | `scripts` table, `app/ref-script-deck` |
| DiGi never yes or no | `lib/digi/system.ts` rails, non negotiable 1 |
| Five faces check in | `components/daily/ConcernCheckIn.tsx` |
| Lessons 4 to 16, passport | lessons hub, `components/pathway/PassportBook.tsx` |
| Child app, link, no login | `app/k/[token]`, token only auth |
| Stars buy screen time, protected time | THE-STORY section 3, point 4; `components/quests/TimeTiersCard.tsx` |
| Printables | `app/(dashboard)/dashboard/printables` |
| No ads, no ad trackers | no ad SDK in `package.json`; PostHog is cookieless and marketing pages only (`lib/analytics/posthog-policy.ts`) |
| Child never chats with AI, hint card not kept | `scripts/check-child-has-no-model.mjs`, `app/api/kid/homework-help/route.ts` |
| Delete from Settings | `components/settings/DeleteAccount.tsx` |
