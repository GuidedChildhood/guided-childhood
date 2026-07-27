# Week of 2026-07-20: DiGi device check ins

From real parent feedback. Parents face recurring device battles ("I bought my
daughter a Switch for her 10th birthday, how do I make sure she uses it the
best way", "my sons are always on the Xbox"). DiGi should proactively ask
about them, per child, based on that child's actual device data.

Migration claim: **082** (081 is claimed by the open ask first PR #408).

## Pieces

1. **Signals** (read only, `lib/digi/device-checkins.ts`)
   Per child from `device_sessions`, last 14 days:
   - dominant device (console, tv, phone, tablet) by minutes
   - weekly minutes vs `recommendedDailyMinutes(age_band) * 7` (lib/quests/screen-balance.ts)
   - frequent early stops (`ended_at` well before `ends_at`)
   - new device: a device with its first ever session in the last 7 days,
     for a child who already had history before that
   - after school pattern: console or tv sessions landing straight after school

2. **Prompt bank** (same lib, one place, not scattered strings)
   8 situational prompts keyed by signal, DiGi's voice, no dashes. Each
   carries its pathway: the matching device guide (/dashboard/devices), the
   come off the game script (looked up from the scripts table by title, never
   a hardcoded copy of the script), and a ready chat message.

3. **Surface** (extends the existing DiGi wondering system)
   - `app/api/digi/device-checkin/route.ts`: GET computes the strongest
     signal per child, dedupes against open concerns, applies the caps.
     POST records seen / yes / not really.
   - `components/digi/DigiDeviceCheckin.tsx`: card beside DigiWondering on
     Home, with Yes this is us / Not really. Yes opens DiGi chat prefilled
     via the existing `?q=` param. Not really suppresses that prompt for
     3 weeks. When the card shows it stamps the wondering gap key so DiGi
     never speaks twice in one visit.
   - At most one device check in per child per week, enforced by the
     `digi_device_checkins` table (migration 082).

4. **Not touched**: `app/api/digi/route.ts` (owned elsewhere), the
   digi-insights founder email cron stays as is.

## Verify

- npx tsc --noEmit clean
- Fixture page screenshot of the card (dev only route)
