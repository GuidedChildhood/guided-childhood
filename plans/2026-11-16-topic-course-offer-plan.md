# The topic email course, offered on the stage check result page

Written 16 November 2026. Justin chose this on 14 November ("Build the course
offer") after the first WhatsApp group pack merged (PR 1542) with nowhere to
send people for its seven day course.

## What it does

On the stage check result page, a parent whose child is 10 to 12 (Builder at
the top, Explorer) sees one offer: "The first group chat. Seven short emails,
one a day." An email box and an unticked consent line. Ticking and sending
starts the seven emails from `content/packs/2026-11-14-first-whatsapp-group/pack.md`,
one a morning, on the existing daily series rails.

## How, on what exists

- The lead lands in `starter_leads` like every other capture, with
  `marketing_consent = true` (migration 396). No consent, no course.
- The seven emails live in one registry, keyed by topic, so the next topic is
  a new entry and not new plumbing.
- The email cron sends one a morning as kind `series` (no weekly floor; the
  stop link wins), the same way the taster series does.
- No new table if the existing sent log and lead tags can carry it.

## Not in this PR

Other topics. Any change to the stage check questions. Anything sent: the
cron sends only once this is merged and deployed.
