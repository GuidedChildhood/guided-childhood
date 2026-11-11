# Ad accounts: what to set up, once

Written 11 November 2026. The ad system makes the adverts and can load them
into Facebook and Instagram switched off. These are the parts only Justin can
do, because they are his accounts and his keys. Keys go from the provider's
site into `.env.local` on his laptop and nowhere else. Never into chat.

## Facebook and Instagram (ready to use once the keys exist)

About fifteen minutes, at business.facebook.com.

1. **A Business portfolio** that owns the Guided Childhood Facebook Page, the
   Instagram account and an ad account with a payment card on it. If the ad
   account already exists, skip to 2.
2. **A system user.** Business settings, Users, System users, Add. Name it
   `gc-ad-uploader`, role Admin. Give it the ad account (Manage campaigns) and
   the Page (Create ads).
3. **An app to issue the token.** developers.facebook.com, Create app, type
   Business, add the Marketing API product. It stays in development mode; it
   only ever talks to your own ad account, so it needs no app review.
4. **The token.** Back on the system user, Generate new token, choose that
   app, tick `ads_management`, `pages_read_engagement` and
   `pages_show_list`, set it to never expire. Copy it once.
5. **Four lines in `.env.local`** (the template lists them):
   `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` (the number after `act_` in the
   Ads Manager address), `META_PAGE_ID` (Page, About, Page transparency), and
   optionally `META_INSTAGRAM_ID`.

Then:

```bash
npm run ad-upload -- 2026-11-11-round-1
```

prints what it would send, and

```bash
npm run ad-upload -- 2026-11-11-round-1 --go
```

sends it. Everything arrives PAUSED. Nothing spends until you switch an ad on
in Ads Manager. The audience and budget it writes on the ad set are in
`content/ads/meta/config.json` (UK, 28 to 54, £5 a day for 7 days, so £35 at
most if all of it were switched on). Change them there or in Ads Manager.

The uploader has not yet run against the live API, only against a stand in.
The first real run may need a field adjusting. It keeps a receipt, so a
second run carries on from where the first stopped.

To take the access away: delete the token on the system user. Rotate it the
same way.

## Google Ads (not built yet, and slower to open)

Google is a different job from Facebook, for three reasons:

1. **The key takes days.** The API needs a developer token from a Google Ads
   manager account (Tools, API Center), and Google reviews the application
   before it works on a live account. Apply first; nothing can be built
   against a live account until it is approved.
2. **The adverts are a different shape.** Our cards are 4 by 5 for a feed.
   Google's image adverts (Demand Gen, on YouTube, Discover and Gmail) need a
   1.91 by 1 landscape, a square and a logo, plus up to five short headlines
   and descriptions it mixes itself. Search adverts are words only, sold on
   what a parent types.
3. **We have no winner yet.** The money rule in THE-STORY section 9: pay to
   scale something proven. Round 1 finds the hook; Google gets the hook that
   won.

So the order is: apply for the developer token now (it costs nothing), run
Round 1 on Facebook and Instagram, then build the Google uploader the same
way as this one (dry run, paused, a receipt) around the winning hook.
