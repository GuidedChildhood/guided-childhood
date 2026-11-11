# Ad accounts: what to set up, once

Rewritten 11 November 2026 after looking at both accounts (read only, in
Justin's browser). The ad system makes the adverts and can load them into
Facebook and Instagram switched off. These are the parts only Justin can do,
because they are his accounts and his keys. Keys go from the provider's site
into `.env.local` on his laptop and nowhere else. Never into chat.

## What is there today

- **Facebook Page:** "The Guided Childhood" exists, and Justin has full access
  to it. It is owned by the **Inspired by Alma** business portfolio, where
  Justin has only partial access.
- **Facebook ad account:** the one that opens is an old personal account
  (19251331) holding 2018 Etsy campaigns, with an expired card. Not the place
  for Guided Childhood.
- **Google Ads:** the login opens another business's account (Pro Corporate),
  with a paused campaign that is nothing to do with us.

So Guided Childhood needs an ad account of its own on each, kept apart from
the other businesses. That is also what stops one business's problem (an
unpaid bill, a rejected advert) reaching another's.

## Facebook and Instagram, step by step (about 30 minutes)

### A. A business portfolio of its own
1. Go to business.facebook.com. Open the menu at the top left that shows
   "Inspired by Alma" and choose **Create a business portfolio**.
2. Name it **Guided Childhood**, with your name and the Guided Childhood
   email. Confirm the email Meta sends.

### B. Bring the Page across
The Page belongs to Inspired by Alma, so this needs whoever has full control
there. Either:
- **Cleanest:** in Inspired by Alma, Settings, Pages, The Guided Childhood,
  **Remove**. The Page is not deleted, only released. Then in Guided
  Childhood, Settings, Accounts, Pages, **Add**, Add an existing Facebook
  Page. You are its admin, so it arrives at once.
- **Quickest:** in Inspired by Alma, Settings, Pages, The Guided Childhood,
  **Assign partner**, paste the Guided Childhood portfolio's business ID
  (Settings, Business info), and allow Create ads.

Then add the Instagram account: Settings, Accounts, Instagram accounts, Add.

### C. A new ad account
3. Settings, Accounts, Ad accounts, **Add**, Create a new ad account.
4. Name **Guided Childhood**. Time zone **Europe/London**, currency **GBP**.
   Neither can be changed afterwards.
5. It is for **My business**. Give yourself full control.
6. Add a card: Billing and payments, Add payment method. Nothing is charged
   until an advert is switched on.

### D. The key the uploader uses
7. Settings, Users, System users, **Add**. Name `gc-ad-uploader`, role Admin.
8. On that system user, **Assign assets**: the new ad account (full control)
   and the Page (full control).
9. Go to developers.facebook.com, My Apps, **Create app**. Choose Other, then
   Business. Name it `GC ad uploader` and attach it to the Guided Childhood
   portfolio. Add the **Marketing API** product. Leave it in development
   mode; it only ever talks to your own ad account, so it needs no review.
10. Back on the system user, **Generate token**. Pick that app, expiry
    **Never**, and tick `ads_management`, `pages_read_engagement` and
    `pages_show_list`. Copy the token once; Meta does not show it again.

### E. Four lines on your laptop
11. Open `.env.local` in the `guided-childhood` folder and add (the template
    lists them):

    ```
    META_ACCESS_TOKEN=      the token from step 10
    META_AD_ACCOUNT_ID=     the number after act_ in the Ads Manager address
    META_PAGE_ID=1560723440917227
    META_INSTAGRAM_ID=      optional, from Instagram accounts in Settings
    ```

Then tell Claude the keys are in. It runs

```bash
npm run ad-upload -- 2026-11-11-round-1
```

which prints what it would send, and after you have read that,

```bash
npm run ad-upload -- 2026-11-11-round-1 --go
```

which sends it. Everything arrives **PAUSED**. Nothing spends until you
switch an advert on in Ads Manager. The audience and budget written on the ad
set come from `content/ads/meta/config.json` (UK, 28 to 54, £5 a day for 7
days, so £35 at most if all of it were switched on). Change them there or in
Ads Manager.

The uploader has not yet run against the live API, only against a stand in.
The first real run may need a field adjusting. It keeps a receipt, so a
second run carries on from where the first stopped.

To take the access away: delete the token on the system user.

## Google Ads, step by step (20 minutes, then a wait of some days)

The uploader for Google is not built yet. Steps 1 to 4 can be done now, and
the wait in step 4 is the slow part, so start it first.

1. **A new account for Guided Childhood.** At ads.google.com, open the account
   menu at the top right and choose **New Google Ads account**. When it tries
   to build a campaign, choose **Switch to Expert Mode**, then **Create an
   account without a campaign**. Country United Kingdom, time zone London,
   currency GBP (fixed for good). Note the ten digit customer ID at the top.
2. **Billing.** Billing, Settings, add a card. Nothing is charged until a
   campaign runs.
3. **A manager account**, which is the only place Google gives out an API
   key. Go to ads.google.com/home/tools/manager-accounts, Create a manager
   account, name it `Guided Childhood manager`. In it, Accounts, the plus
   button, Link existing account, enter the customer ID from step 1, then
   accept the link from inside the Guided Childhood account (Admin, Access
   and security, Managers).
4. **The developer token.** In the manager account: Admin, API Center. Fill
   in the form (the tool is internal, it uploads our own adverts, paused).
   The token appears straight away at test level. Apply for **Basic access**
   on the same page. Google reviews it, usually within a few days, and it
   does not work on a live account until then.
5. **A sign in for the tool.** At console.cloud.google.com make a project
   `gc-ads`, enable the **Google Ads API**, set the OAuth consent screen to
   External and publish it to **In production** (left in Testing, the sign in
   expires every seven days), then Credentials, Create OAuth client ID,
   **Desktop app**. Keep the client ID and secret.
6. **What goes in `.env.local` when the uploader exists:** the developer
   token, the client ID and secret, the customer ID, the manager's ID, and a
   refresh token the uploader will make by walking you through one sign in.

Google's adverts are a different shape from ours. The cards are 4 by 5 for a
feed. Google's picture adverts (Demand Gen, on YouTube, Discover and Gmail)
want a 1.91 by 1 landscape, a square and a logo, with up to five short
headlines and descriptions it mixes itself. Those versions are made when the
uploader is, around whichever hook wins Round 1.
