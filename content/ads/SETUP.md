# Ad accounts: what to set up, once

Rewritten 11 November 2026 after looking at both accounts (read only, in
Justin's browser). The ad system makes the adverts and can load them into
Facebook and Instagram switched off. These are the parts only Justin can do,
because they are his accounts and his keys. Keys go from the provider's site
into `.env.local` on his laptop and nowhere else. Never into chat.

## What is there today

- **Facebook Page:** "The Guided Childhood" exists, and Justin has full access
  to it (so does Natalia). It is owned by the **Inspired by Alma** business
  portfolio. That portfolio has two people: Justin with partial access, and
  **Anna Quiles with full access**, who left a long time ago. She is the only
  person who can move the Page, add an admin or remove one.
- **Facebook ad account:** the one that opens is an old personal account
  (19251331) holding 2018 Etsy campaigns, with an expired card. Not the place
  for Guided Childhood.
- **Google Ads:** the login opens another business's account (Pro Corporate),
  with a paused campaign that is nothing to do with us.

So Guided Childhood needs an ad account of its own on each, kept apart from
the other businesses. That is also what stops one business's problem (an
unpaid bill, a rejected advert) reaching another's.

## Facebook and Instagram, step by step (about 30 minutes)

None of this needs Anna. The Page stays where it is for now, and the key is
Justin's own, because he personally has full access to the Page. A system
user would need the Page moved first, which only Anna can do.

### A. A business portfolio of its own
1. Go to business.facebook.com. Open the menu at the top left that shows
   "Inspired by Alma" and choose **Create a business portfolio**.
2. Name it **Guided Childhood**, with your name and the Guided Childhood
   email. Confirm the email Meta sends. You have full control of this one.

### B. A new ad account
3. In the new portfolio: Settings, Accounts, Ad accounts, **Add**, Create a
   new ad account.
4. Name **Guided Childhood**. Time zone **Europe/London**, currency **GBP**.
   Neither can be changed afterwards.
5. It is for **My business**. Give yourself full control.
6. Add a card: Billing and payments, Add payment method. Nothing is charged
   until an advert is switched on.

### C. The key the uploader uses
7. Go to developers.facebook.com, My Apps, **Create app**. Choose Other, then
   Business. Name it `GC ad uploader` and attach it to the Guided Childhood
   portfolio. Add the **Marketing API** product.
8. Switch the app to **Live** (the toggle at the top; it asks for a privacy
   policy address, which is guidedchildhood.com/privacy). Left in
   development, Meta is likely to refuse the adverts it makes.
9. In the app: Tools, **Graph API Explorer**. Choose the app, then **Get User
   Access Token**, and tick `ads_management`, `pages_show_list` and
   `pages_read_engagement`. Generate, and approve as yourself, choosing The
   Guided Childhood when it asks which Pages.
10. Tools, **Access Token Debugger**, paste the token, **Extend Access Token**.
    That one lasts about 60 days. Copy it. When it runs out, repeat steps 9
    and 10, which is two minutes.

### D. Four lines on your laptop
11. Open `.env.local` in the `guided-childhood` folder and add (the template
    lists them):

    ```
    META_ACCESS_TOKEN=      the token from step 10
    META_AD_ACCOUNT_ID=     the number after act_ in the Ads Manager address
    META_PAGE_ID=1560723440917227
    META_INSTAGRAM_ID=      optional
    ```

If the upload is refused because of who owns the Page, nothing is lost: the
five cards, their words and their links are in
`content/packs/2026-11-11-round-1/`, and loading them by hand in Ads Manager
takes about fifteen minutes. You can pick the Page there because you have
full access to it.

### E. Make the Page safe, separately, and soon
This is not about adverts. The only person who controls the portfolio that
owns your Page no longer works with you. She can remove you from it, and if
her Facebook account is ever closed or taken over, so can whoever holds it.

- **If Anna can be reached:** ask for one thing, two minutes of her time. In
  Inspired by Alma: Settings, People, Justin Phillips, change to **Full
  access**. After that you can do everything yourself, including removing her.
- **If she cannot:** Meta Business Support (business.facebook.com/help,
  Contact support) has a process for a business whose admin has left. It asks
  for proof that the business is yours and it is slow, so start it early.
- Once you have full access: move the Page into the Guided Childhood
  portfolio (Pages, The Guided Childhood, Remove; then add it in the new
  one), and swap the 60 day key for a system user key that does not expire.

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

To take the access away: Facebook Settings, Business integrations, remove
`GC ad uploader`.

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
