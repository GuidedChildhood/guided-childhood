# Guided Childhood on Google Play and the Microsoft Store

Built 6 November 2026 for section 7 of the first 20 sign ups plan
(`plans/week-of-2026-11-02-first-20-signups-plan.md`). The stores are there to
make the product look real to a parent who heard about it somewhere else, not
to bring volume.

## What is here

| File | What it is |
|---|---|
| `android/twa-manifest.json` | The Google Play app's settings: package `com.guidedchildhood.app`, opens `https://www.guidedchildhood.com/dashboard?source=play` |
| `../scripts/app-stores/build-android.sh` | `npm run android-build` rebuilds the Play package from scratch |
| `../public/.well-known/assetlinks.json` | Tells Android the app and the site belong together, so the app opens with no browser bar |
| `../scripts/app-stores/add-play-fingerprint.mjs` | `npm run play-fingerprint -- <SHA-256>` adds Google's signing key to assetlinks |
| `listing-copy.md` | Store copy for both stores, with proof paths |
| `play-data-safety-and-families.md` | Every Play Console form answer, from the code |
| `play-billing.md` | Why payments stay on the website, with sources |
| `microsoft-store.md` | The Microsoft Store steps through PWABuilder |
| `tester-invite-email.md` | The email for the 12 testers |
| `screenshots/` | Real app screens (phone, desktop) and the Play feature graphic |

Site changes that came with it: separate maskable icons
(`public/icons/icon-maskable-*.png`, `npm run app-icons`), a manifest `id`,
and an offline page (`public/offline.html`) the service worker shows when
there is no connection.

## The signing key

`~/GuidedChildhood-signing/` on Justin's Mac, never in git:

- `android-upload.keystore`, alias `guidedchildhood`
- `keystore-password.txt`
- `app-release-bundle.aab` and `app-release-signed.apk`, the first build

Upload key SHA-256:
`79:A5:F0:07:A1:F7:BA:9C:B1:9C:9F:BD:48:05:AA:DA:E7:0A:3B:EB:28:05:A2:13:93:9C:16:9B:D1:13:4B:B2`

Put the password in the password manager and copy the folder somewhere off
this laptop. It is the upload key: with Play App Signing (on by default)
Google holds the key phones see, so a lost upload key can be reset through
Play support, but that takes days and blocks every update meanwhile. Treat it
as if losing it loses the listing.

## Rebuilding the Play package

```bash
npm run android-build
```

Bump `appVersionCode` (and `appVersion`) in `android/twa-manifest.json` for
every new upload. The one time Mac setup is in the script's header. A
release only needs a rebuild when the Android side changes (icon, name,
colours, start URL); changes to the website reach the app the moment they
deploy.

## What Justin does, in order

**Before anything is uploaded to Google**

1. Merge this PR so `assetlinks.json`, the maskable icons and the offline page
   are live. Check https://www.guidedchildhood.com/.well-known/assetlinks.json
   opens.
2. Land the consumption only follow up (no payment links inside the Play
   app, `play-billing.md`) and the hint card report button
   (`play-data-safety-and-families.md` section 5). Closed tests are reviewed
   too.
3. Bring the privacy policy up to date with section 4 of
   `play-data-safety-and-families.md`.
4. Put the keystore password in the password manager and back up
   `~/GuidedChildhood-signing/`.

**Google Play**

5. Create the developer account at https://play.google.com/console as a
   personal account, pay the $25 fee, and complete the identity check.
6. Create the app: name Guided Childhood, app (not game), free.
7. Fill App content from `play-data-safety-and-families.md`, including App
   access with a reviewer login (a fresh test family, never a real one).
8. Store listing from `listing-copy.md` and `screenshots/`.
9. Testing, Closed testing: create a track, attach a Google Group of testers,
   upload `~/GuidedChildhood-signing/app-release-bundle.aab`, roll out.
10. App integrity, App signing: copy the **App signing key certificate**
    SHA-256 and run `npm run play-fingerprint -- <that value>`, then merge and
    deploy. Without this, Play installs show a browser bar.
11. Send `tester-invite-email.md` to at least 15 people. The 14 days start
    when 12 are opted in.
12. Day 15: Apply for production in the Dashboard and answer Google's
    questions about the test.

**Microsoft Store**

13. Follow `microsoft-store.md`: free developer account, reserve the name,
    PWABuilder package, submit.
