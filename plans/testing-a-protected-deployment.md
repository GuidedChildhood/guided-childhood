# Testing an endpoint on a protected deployment

**Why this file exists.** A curl at a Vercel deployment URL came back 401 and it
read like the keepsake interest endpoint was broken. It was not. This is the
note so the next hour is not spent debugging working code.

## The symptom

```
curl -s -X POST https://guided-childhood-<hash>-guided-childhood.vercel.app/api/keepsakes/interest \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","item":"charm_set"}'

{"protection":{"vercel_auth_enabled":true,"vercel_auth_callback":"https://vercel.com/sso-api?...","auto_vercel_auth_redirect":true,"password_enabled":false},"error":{"code":"401","message":"Protected deployment"}}
```

## What it actually is

`vercel_auth_enabled: true` is Vercel Deployment Protection, the setting under
Project Settings, Deployment Protection, Vercel Authentication. It sits at the
edge in front of the deployment. The request is refused before `middleware.ts`
runs and before any route handler loads, so:

- No change to `app/api/**/route.ts` can affect it.
- No change to `middleware.ts` can affect it.
- No change to `vercel.json` can affect it.

It is a project setting, changed in the Vercel dashboard, nowhere else.

Standard Protection covers every preview deployment and every generated
`*.vercel.app` deployment URL. It does not cover a custom production domain.
That is why a link that works in the browser can 401 from the terminal: the
browser follows the SSO redirect using the Vercel session already in it
(`auto_vercel_auth_redirect: true`), and curl has no session to follow it with.

**So a browser test of the form is a real test.** If the page submits and the
founder email arrives, the endpoint works. Only the headless curl is blocked.

## Three ways through, in the order to reach for them

### 1. Hit the real domain, not the deployment URL

Once the app is on a custom domain, curl that instead. Standard Protection does
not apply to custom production domains, so the same request goes straight
through. Nothing to configure.

Blocked while the app has only a `*.vercel.app` URL. See `go-live-domains.md`.

### 2. Protection Bypass for Automation (the repeatable one)

Project Settings, Deployment Protection, Protection Bypass for Automation,
generate the secret. Then send it as a header:

```
curl -s -X POST https://<deployment>.vercel.app/api/keepsakes/interest \
  -H 'Content-Type: application/json' \
  -H 'x-vercel-protection-bypass: <secret>' \
  -d '{"email":"you@example.com","item":"charm_set"}'
```

Notes worth having:

- It also works as a query param, `?x-vercel-protection-bypass=<secret>`, which
  is handy in a browser but leaks the secret into history and logs. Prefer the
  header.
- Add `-H 'x-vercel-set-bypass-cookie: true'` to have Vercel set a cookie so a
  browser session keeps working across pages.
- Vercel exposes the same value to the running deployment as
  `VERCEL_AUTOMATION_BYPASS_SECRET`. It is a real credential. It belongs in the
  Vercel dashboard and in a password manager, never in this repo.

### 3. Turn Vercel Authentication off

Project Settings, Deployment Protection, Vercel Authentication, set to
Disabled. Correct once the deployment is meant to be public anyway, wrong while
previews carry unreleased work. Choose deliberately rather than to unblock one
curl.

## What a working response looks like

```json
{"ok":true,"stored":true,"notified":true}
```

`stored` is the row in `keepsake_interest` (migration 097). `notified` is the
founder email. Either one true is enough to return 200, because either one means
a person can act on the signup. Both false returns 502 and the parent is told
plainly, rather than shown a warm confirmation for something that did not
happen.

So the two numbers to read are not just the status code:

- `{"ok":true,"stored":false,"notified":true}` means the table is missing in
  that environment. Run migration 097.
- `{"ok":true,"stored":true,"notified":false}` means the email did not send.
  Usually `RESEND_API_KEY` is unset, or Resend rejected an unverified from
  domain. The reason is logged in the deployment's runtime logs.

## One thing to watch when quoting a curl in zsh

`zsh: event not found: ...` is history expansion eating a `!` inside a double
quoted string. Use single quotes around the JSON body, exactly as above.
