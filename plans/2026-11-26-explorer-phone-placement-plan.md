# Explorer phone placement, the mood script, and the bedroom evidence (26 November 2026)

Justin's top three builds this week, with his steer after the Mumsnet replies:
"phone in bedroom" reads as obvious, so lead with the pathway's why, say the
parent already knows it, and say this is not about parents being bad.

## Build

1. **New explorer script, "Where the phone sleeps tonight"** (migration 407).
   A calibrated pathway: a shared landing spot, a charger for every phone
   including the parent's, a two week trial with a review, and the three
   answers a child actually gives. The why opens with "you probably knew the
   answer before you opened this", then names the hard part, her agreeing, and
   the evidence as association.
2. **Rewrite explorer 601 "Mood drops after phone use"** (migration 407).
   Same evening opener about the moment the parent saw on Instagram; the
   situation names Instagram, TikTok, Snapchat and YouTube; depth fields filled.
   The tonight line names the Instagram guide, and the script page turns that
   into a link: `lib/scripts/guide-links.ts`, `/dashboard/devices?guide=<key>`
   opens that guide (DeviceHub `initialGuide`).
3. **Evidence**. Carter 2016 (two rows) and Mireku 2019 gain phone, bedtime,
   new_phone; 11-13 confirmed. The second Carter row is restated with the
   paper's access without use figures. `lib/digi/brain.ts` maps bedroom,
   overnight, charger and "in her room" to the sleep topic so DiGi finds them.

## Checks

- Dry run on the live database inside an aborted transaction: insert, update
  and tag merge all work, nothing kept.
- `check-ai-tells`, no dashes, contrast lines removed by hand (migration 406's rule).
- Guide link screenshotted at 390px and 1280px on the fixture page.
- Applying 407 live waits for Justin's yes.
