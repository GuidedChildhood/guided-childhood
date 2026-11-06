# Google Play billing, and why payments stay on the website

Researched 6 November 2026. V means read on the page that day, L means likely.

## What the rules mean for us

The Play app opens the whole of www.guidedchildhood.com, so today a parent in
the app can reach `/dashboard/upgrade`, `/dashboard/choose`, the pricing page
and Stripe Checkout. For a UK user that breaks Play's Payments policy.

- V. Digital subscriptions must use Google Play's billing system, and apps
  "may not lead users to a payment method other than Google Play's billing".
  Buttons, links and web views all count as leading.
  https://support.google.com/googleplay/android-developer/answer/9858738
- V. Google's own Trusted Web Activity docs say the same rule applies to a
  wrapped site. https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing
- V. **Any app may be consumption only**, even when it is part of a paid
  service: subscribers sign in and use what they bought elsewhere. Allowed in
  the app: plain text such as "Go to our website to upgrade", with no link.
  Not allowed: a link to a page that could lead to payment, or wording that
  pushes people to buy outside. Links to account, privacy and help pages are
  fine if they never lead on to payment.
  https://support.google.com/googleplay/android-developer/answer/10281818
- L. Showing the price inside a consumption only app is not addressed. Leave
  it out.
- V. Emails sent outside the app can promote web pricing freely (same page).

## The programmes that would allow a web payment link, and why not now

| Programme | Countries | What it costs us | Verdict |
|---|---|---|---|
| Billing choice (from 30 June 2026) | UK and EEA | Must offer Google Play Billing alongside ours, its choice screens, report every sale within 24 hours, 10 percent service fee on subscriptions. https://support.google.com/googleplay/android-developer/answer/17161464 | Not now: a full Play Billing build first |
| User choice billing (pilot) | Lists the UK | Same: Play Billing alongside, 10 percent on recurring sales. https://support.google.com/googleplay/android-developer/answer/13821247 | Not now |
| Alternative billing only | EEA only | | Not available in the UK |
| External offers | EEA only, business accounts, not apps aimed only at children | https://support.google.com/googleplay/android-developer/answer/14372887 | Ruled out twice |
| External links after Epic v Google | US users only | https://support.google.com/googleplay/android-developer/answer/16470497 | Does not help UK families |
| UK CMA steering rule | Consulted June 2026, no final rule as of 20 October 2026 | https://www.gov.uk/guidance/the-cmas-programme-of-work-across-mobile-platforms | Watch it |

## Recommendation: consumption only

1. The Play app opens `/dashboard?source=play` (set in
   `app-stores/android/twa-manifest.json`). The site remembers that marker in
   a cookie for that browser session.
2. While the marker is present, every route that leads to payment (`/pricing`,
   `/dashboard/upgrade`, `/dashboard/choose`'s paid door, `/starter-pack`
   checkout, the Stripe portal and every upgrade button) shows plain text with
   no link: "Your free days have finished. You can manage your plan on our
   website." No price, no button, no link.
3. Sign up, sign in, the free days, everything a paying family uses, and the
   whole child side work exactly as on the web.
4. Selling happens on the website and by email only.
5. Revisit billing choice if the CMA steering rule lands, or if the app ever
   brings in enough families to justify a Play Billing build.

Step 2 is real code across the paywall surfaces, so it is its own pull
request, and it has to land **before the first upload to the closed test**:
closed test releases are reviewed too.

One consequence to accept: a parent who signs up inside the Play app and
reaches the end of their free days is told to go to the website, and will not
get a link. The welcome and nurture emails already carry links, which is
where that parent converts.

## Microsoft Store

Microsoft allows our own payments. Store Policies section 10.8 (version 7.20)
lets a non game product on PC bill subscriptions through "a secure
third-party" service, and lets users be sent to a browser to pay after
installation. Two things follow:

- In Partner Center, Product declarations, **tick** the box saying the app
  takes purchases without Microsoft Store commerce.
  https://learn.microsoft.com/windows/apps/publish/publish-your-app/pwa/product-declarations
- No consumption only mode is needed on Windows.

Source: https://learn.microsoft.com/windows/apps/publish/store-policies
