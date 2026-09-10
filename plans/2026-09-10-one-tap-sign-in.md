# One tap sign in with Google and Apple

**Justin, 10 September 2026: "Go ahead with Apple and google".**

The answer to the offer made when the starter pack reorder shipped: every app in
the reference set lets a parent make an account in one tap, and we made them
type an email and invent a password. It is the last point between 9 out of 10
and 10 on the funnel that now carries the whole route to £4,000 MRR.

## The shape of it

The code lands first and lands **dark**. Nothing changes for a parent until
Justin sets `NEXT_PUBLIC_AUTH_PROVIDERS`, because a button for a provider that
has not been switched on in Supabase does not fail politely: it answers
"Unsupported provider" on the single highest value screen we own. So the list of
providers is config, the same way `DIGI_MODEL` is, and an unset value means the
screen looks exactly as it does today.

That also gives him a switch he can throw the other way in a minute, from the
Vercel dashboard, without waiting for anybody to deploy code.

## Where the buttons go, and why above

From the Mobbin sweep (iOS, account creation):

- **Strava**, **monday.com**, **Finimize**: providers first, an "or" rule, then
  the email. Finimize even personalises the heading over them ("Sam, finish your
  setup"), which is our screen exactly, since ours reads "Save Nia's pathway".
- **Zocdoc**, **Swarm**: email first, providers underneath.
- **eBay**: providers under three typed fields, which is the pattern we are
  leaving behind.

Ours go **above**. The entire value of the thing is that it is the fast way, and
a fast way printed below the slow way is decoration. The two buttons carry the
official Google mark and Apple mark inline, on our own white plate with the ink
border, the 16px radius and the 5px shadow, so they read as our buttons rather
than as a strip bolted on from a template.

## The hard part: the round trip

A password account is made without leaving the page, so `finishSetup()` can read
the answers straight out of React state. **An OAuth account leaves the site**,
goes to Google, comes back through `/auth/callback`, and lands on a freshly
mounted page with no state at all.

Worse, the answers are not all on disk. `gc_starter_answers` is written at the
reveal but carries no child name and no birthday; `gc_starter_progress`, which
holds the birthday, is deleted at that same moment; the child's name sits in a
key of its own. A parent who tapped Google would have come back and been asked
their child's birthday all over again, which is the exact double asking the July
change set out to kill.

So:

1. On tapping a provider, write **one** blob, `gc_starter_pending`, holding
   everything the write through needs: age band, every worry, the typed worry,
   the time answer, the child's name and the birthday.
2. Send them to `/auth/callback?next=/starter-pack?finish=1`.
3. On return, the page sees `finish=1`, confirms a session really exists, runs
   the same write through, clears the blob and goes to `/dashboard/setup`.

The write through moves out to `lib/starter/finish-setup.ts` and both paths call
it, because two copies of the code that creates a family's first child row is
how they come to disagree.

## What must never regress

`scripts/check-one-tap.mjs`, in CI:

- The provider list is read from config. A hardcoded `['google','apple']` fails.
- The buttons render only when a provider is enabled, so an unconfigured deploy
  cannot show a button that errors.
- The pending blob carries the birthday and the child's name, the two the old
  keys lose.
- The OAuth return checks for a session before writing anything.
- One write through, called by both paths.

Mutation tested before it is trusted, per the house rule.

## What Justin has to do, and the honest cost

**Google: free, about fifteen minutes.** A Google Cloud project, an OAuth client,
the Supabase callback as the redirect URI, client id and secret pasted into
Supabase, provider on.

**Apple: £79 a year and longer.** Sign in with Apple needs a paid Apple Developer
Program membership. Without it there is no Services ID and no key, and no amount
of code makes the button work.

The recommendation is Google now and Apple when the membership exists, which the
config flag supports directly: `NEXT_PUBLIC_AUTH_PROVIDERS=google` turns on one
without promising the other.

## Risk

The account screen is the last screen before the money. Every risk here is
handled by the flag: unset, the screen is byte for byte what merged in PR 1036,
and the guard proves the buttons cannot appear without it.

## The exact steps, in order

Everything below is Justin's. None of it is code, and none of it can be done
from here: it needs his Google account, his Apple account and his Vercel and
Supabase logins.

The one address to have to hand, because both providers ask for it and it is
the piece people get wrong:

    https://zgkdfiwtnzqmtfgfsxzo.supabase.co/auth/v1/callback

That is Supabase's callback, not ours. The provider hands the parent back to
Supabase, Supabase hands them to /auth/callback on our site. Anyone who puts
our own address in here gets a redirect_uri_mismatch and no explanation.

### GOOGLE, free, about fifteen minutes

1. Go to console.cloud.google.com and make a project, or pick one. Any name.
2. APIs and Services, then OAuth consent screen. Choose External. App name
   Guided Childhood, support email his own, authorised domain
   guidedchildhood.com. Save. The default scopes (email, profile, openid) are
   the right ones and nothing needs adding.
3. Still on the consent screen, press Publish app. Left in Testing it works
   only for accounts he has listed by hand, which looks exactly like a broken
   button to everybody else.
4. Credentials, then Create credentials, then OAuth client ID, type Web
   application.
5. Authorised redirect URIs: paste the callback address above. This is the
   field that matters.
6. Authorised JavaScript origins: https://www.guidedchildhood.com and
   https://app.guidedchildhood.com.
7. Create, then copy the Client ID and the Client secret.
8. Supabase, project zgkdfiwtnzqmtfgfsxzo, Authentication, Sign In and
   Providers, Google. Turn it on, paste both, Save.
9. Supabase, Authentication, URL Configuration. Site URL
   https://www.guidedchildhood.com, and add https://www.guidedchildhood.com/**
   to Redirect URLs. Without this Supabase refuses to send the parent back to
   us and drops them on its own error page.
10. Vercel, the guided-childhood project, Settings, Environment Variables. Add
    NEXT_PUBLIC_AUTH_PROVIDERS with the value google, ticked for Production and
    Preview. Redeploy. It is baked in at build time, so nothing changes until a
    build runs.

### APPLE, £79 a year, longer

Only worth starting once the developer membership exists. Steps 4 to 10 have
the same shape; what differs is that Apple wants a Services ID and a signing
key rather than a client secret, and the key expires every six months, so it is
a diary entry as well as a setup.

11. Join the Apple Developer Program. This is the £79 and it is the gate: there
    is no Services ID without it.
12. Certificates, Identifiers and Profiles, Identifiers. Make an App ID first,
    then a Services ID (this is the one that acts as the client id).
13. On the Services ID, enable Sign In with Apple, then Configure. Domain
    guidedchildhood.com. Return URL: the callback address above.
14. Keys, then make a new key with Sign In with Apple enabled. Download the .p8
    ONCE, because Apple never shows it again. Note the Key ID and the Team ID.
15. Supabase, same providers screen, Apple. Turn it on and give it the Services
    ID, the Team ID, the Key ID and the contents of the .p8.
16. Change NEXT_PUBLIC_AUTH_PROVIDERS to google,apple in Vercel and redeploy.

### How to know it worked

Open /starter-pack on a phone, answer the three questions, and look at the last
screen. The buttons appear only when the flag is set AND the build has run.
Tap one, sign in, and the next thing that should happen is the Setup Quest with
the child already there, name and birthday and worries, nothing asked twice.

If a button says the provider is not switched on yet, the flag is ahead of
Supabase. If Google shows an error page instead of a sign in, it is almost
always the redirect URI in step 5.
