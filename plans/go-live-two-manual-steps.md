# Two things only Justin can do

Both of these sit outside the repo, so no pull request can finish them. Written
down here because the session that worked them out will be gone tomorrow.

Status at 31 July 2026: neither is done.

---

## 1. Point NEXT_PUBLIC_APP_URL at the real domain

### What is wrong

Vercel Cron invokes a function on the deployment specific host,
`guided-childhood-<hash>.vercel.app`. That host sits behind Deployment
Protection. Any route that calls back to itself through it gets 401 "Protected
deployment" and the work never happens.

`/api/push/cron` does exactly that. It works out which check in is due, then
posts to `${origin}/api/push/send`, where origin is
`process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin`. With the variable
unset it falls back to the protected host, every send 401s, and the route still
replies 200 with the failure tucked inside the body. Nobody has received a push
check in.

### The value to set

    NEXT_PUBLIC_APP_URL = https://www.guidedchildhood.com

No trailing slash. The code builds paths as `${origin}/api/push/send`, so a
trailing slash produces a double slash and a 404.

Checked on 31 July: `www.guidedchildhood.com` resolves to Vercel
(`vercel-dns-017.com`) and the apex resolves to a Vercel address, so the domain
is already attached. `app.guidedchildhood.com` does not resolve, which confirms
the 17 July decision in go-live-domains.md (app on the main domain, not on a
subdomain) is the one that was actually carried out.

### Steps

1. Vercel dashboard, open the project that owns `www.guidedchildhood.com`.
   There are two projects, `guided-childhood` and `guided-childhood-app`, and
   both build this repo. Settings then Domains tells you which one holds the
   real domain. Set the variable on that one, because that is the project whose
   crons are the live ones.
2. Settings, Environment Variables, add `NEXT_PUBLIC_APP_URL` with the value
   above. Tick Production. Tick Preview and Development too if you want preview
   builds to behave the same, though it is not required.
3. Redeploy. This step is not optional and it is the one people skip. Anything
   prefixed `NEXT_PUBLIC_` is baked in at build time, not read at run time, so
   an existing deployment carries on using the old value for ever. Deployments
   tab, most recent production deployment, Redeploy.
4. While you are in Domains, check whether the second project also has crons
   running against production. Both projects deploy a repo whose `vercel.json`
   declares 25 crons. If both are live, every job is firing twice.

### How to know it worked

The push cron only sends inside a ten minute window around 7:30am, 3:30pm and
9pm UK time, and skips every other run. So check just after one of those.

- Vercel logs, filter to `/api/push/cron`. A working run replies with a
  `checkin` name and a send count. A broken one carries an `error` about a
  protected deployment.
- Or open `/dashboard/admin/health` and look at the row for `/api/push/cron`.

### Order matters, and the risky part is already done

Do not do this before the London time fix is on main. That fix has merged, so
it is now safe.

The reason: the route used to read the hour off an Invalid Date, so the distance
from the nearest check in was NaN, and `NaN > WINDOW_MINUTES` is false. It never
skipped. It fell through and sent on every single run, forty eight times a day
instead of three. The only thing preventing forty eight notifications a day to
every parent was that all of them were 401ing and being thrown away. Fixing this
variable first would have turned a silent failure into a very loud one.

---

## 2. Create the daily health watcher

### Why it cannot be created from a Claude Code session

Tried twice. The `connectors` parameter on the trigger tool is not available for
this organisation, and a routine created without it fires sessions that have no
`mcp__*` tools at all. This environment carries no Supabase credentials either,
so such a session has no route to the database whatsoever. It would wake up
every morning, find nothing to read, and stop.

It has to be made from the claude.ai Routines interface, where connectors can be
attached to the routine.

### Steps

1. claude.ai, open Routines.
2. New routine.
3. Name: Guided Childhood daily health sweep.
4. Schedule: `30 9 * * *`. Cron is UTC, so that is 10:30 UK in summer and 9:30
   UK in winter. Either way it lands after every morning job has run, including
   the `health-alert` cron at 9:15 UTC.
5. Set it to start a fresh session on each run rather than resuming an existing
   one. Every run should begin from a clean read of the world.
6. Attach the Supabase and GitHub connectors. This is the whole point of doing
   it here. Without them the routine is worthless.
7. Pick the environment that has this repo cloned.
8. Paste the prompt below.
9. Turn on notifications so a real fault reaches your phone.

### The prompt

    Daily health sweep for Guided Childhood. Work in the
    GuidedChildhood/guided-childhood repo. Read CLAUDE.md first, then
    lib/ops/health.ts and lib/ops/jobs.ts so you are checking the same
    things the board checks.

    FIRST, CHECK YOUR OWN TOOLING

    Confirm you can reach Supabase and GitHub before you start. If either
    is missing, say so in one line and stop, because a sweep that cannot
    read the database will report everything as fine when it is not. Do
    not work around it and do not guess at the state of anything.

    WHAT TO CHECK

    1. Schema. Run the required_columns_present RPC in Supabase with the
    column list from REQUIRED_COLUMNS in lib/ops/health.ts. Any column the
    code names and the database does not have is the highest priority
    thing you will find today. This check exists because trial_ends_at was
    missing for five weeks while every affected route replied 200.

    2. Heartbeats. Run the cron_job_status() RPC. Compare every job in the
    crons block of vercel.json against its last run. A job is overdue when
    the gap since its last run exceeds three of its own cycles, minimum
    fifteen minutes. Treat a job with lastOk false, or with failures in
    the last seven days, as failing even if it ran recently.

    3. Bodies, not status codes. This codebase has a repeated fault where
    a route replies 200 with the failure tucked inside the body. When you
    read a cron_runs row, look at the error column and the processed
    count, not just ok. A run that processed zero rows when it should have
    processed some is a fault even though nothing threw.

    4. Supabase advisors. Run get_advisors for security and performance
    and report anything new.

    WHAT TO DO ABOUT IT

    If everything is green, reply with one line saying so and stop. Do not
    open a pull request when there is nothing to fix, and never open one
    just to say things are fine.

    If something is broken and the fix is small and you are certain of it,
    fix it. Before you touch anything, follow the multi session rules in
    CLAUDE.md: fetch origin main, read decisions.md and the roadmap from
    origin/main rather than the clone, and list open pull requests and
    branches pushed in the last seven days. Anything an open pull request
    already names is claimed by another session, so leave it alone and say
    that you left it alone. Push to a new branch, open a draft pull
    request, and if your change adds a migration, claim the number in the
    pull request title so the next session can see it.

    If something is broken and the fix is ambiguous, architectural, or
    would change how a feature behaves for families, do not guess.
    Describe what is wrong, what you think is causing it, and what the
    options are, then stop.

    Report in plain language, in Justin's voice. No dashes anywhere in
    what you write. Say what is broken, what it breaks for a real family,
    and what you did about it.

### How to know it worked

Fire it once by hand from the Routines interface rather than waiting until
tomorrow. A working run reads the database and reports on the real jobs. A run
that opens with a line about missing tooling means the connectors did not
attach, so go back to step 6.

### The two layers, and why both exist

`/api/cron/health-alert` at 9:15 UTC tells you something is red. The routine at
9:30 UTC is the layer that goes and does something about it. Keep both. The
first is cheap and always fires. The second costs a session and can be wrong,
which is why its prompt tells it to stop rather than guess whenever a fix is
ambiguous.
