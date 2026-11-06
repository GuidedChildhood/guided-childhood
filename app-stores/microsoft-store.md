# Microsoft Store: the PWA listing

The Microsoft Store takes the website as it is, packaged by PWABuilder
(Microsoft's own tool). There is nothing to build on this Mac: the package
needs three identity values that only exist once the app name is reserved in
Partner Center, and PWABuilder makes the package from them in a minute.

Registration for an individual developer is free (first 20 sign ups plan,
section 7, verified).

## Steps, in order

1. **Make the developer account.** https://storedeveloper.microsoft.com,
   individual account, with the Microsoft account you want to own the
   listing. Identity check may take a day or two.
2. **Reserve the name.** Partner Center, Apps and games, New product, MSIX or
   PWA app, name **Guided Childhood**.
3. **Copy the three identity values.** In the new product, Product
   management, Product identity. Copy:
   - Package/Identity/Name (looks like `12345JustinPhillips.GuidedChildhood`)
   - Package/Identity/Publisher (looks like `CN=ABC123...`)
   - Package/Properties/PublisherDisplayName
4. **Make the package.** https://www.pwabuilder.com, enter
   `https://www.guidedchildhood.com`, Package for stores, Windows, Generate
   package. Fill:
   - Package ID: the Name from step 3
   - Publisher display name and Publisher ID: from step 3
   - App name: Guided Childhood
   - App version 1.0.0, classic package version 1.0.1 (PWABuilder's default
     pairing is fine)
   - Leave everything else on default.
   Download the zip. Keep it with the Android files in
   `~/GuidedChildhood-signing/`.
5. **Start the submission** in Partner Center:
   - Pricing and availability: Free, all markets or UK only (UK first is fine).
   - Properties: category Kids and family (Parenting if offered), privacy
     policy URL https://www.guidedchildhood.com/privacy, website
     https://www.guidedchildhood.com, support contact hello@guidedchildhood.com.
   - Age ratings: the IARC questionnaire, answered as in
     `play-data-safety-and-families.md` section 6.
   - Packages: upload the `.msixbundle` and the `.classic.appxbundle` from
     the zip.
   - Store listings, English (United Kingdom): copy from `listing-copy.md`,
     Microsoft section. Screenshots from `app-stores/screenshots/desktop/`
     and `phone/`. Logo `public/icons/icon-maskable-512.png`.
   - Product declarations: **tick** "this app takes purchases without using
     Microsoft Store commerce" (we bill on the website through Stripe, which
     section 10.8 of the Store Policies allows for non game apps; see
     `play-billing.md`).
6. **Submit.** Certification usually takes one to three working days.

## What the site already gives PWABuilder

- `public/manifest.json`: name, description, `id`, start URL, standalone
  display, theme colours, any and maskable icons at 192 and 512, categories,
  en-GB.
- `public/sw.js`: a service worker with an offline page
  (`public/offline.html`).
- HTTPS on www.guidedchildhood.com.

PWABuilder's report card may suggest screenshots, shortcuts or widgets in the
manifest. None of those is needed to publish.
