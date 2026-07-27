# Device timer accountability — plan

Lane: platform code. Branch claude/device-timer-accountability. Migration 078 claimed in the draft PR title.

Justin's brief: the child uses the timer whether on a device or watching TV. The parent can see the timer has started and when it hits the healthy daily amount. Keep tabs on sessions and total time per device. Alerts for parent and child. The child app auto diverts them away when the healthy amount is hit, based on the age approved levels. Calibrated, never allow or deny. Per device aggregates so heavy console or TV use gets an age based read with advice links and offline suggestions.

## The four pieces

1. Migration 078 (supabase/migrations/078_device_session_guide.sql): two columns on device_sessions. `treat boolean not null default false` (the parent knowingly granted time beyond the day's guide) and `guide_alerted_at timestamptz` (set once when the crossing alert fires, so it never double fires).

2. Mid session guide crossing, two halves.
   a. Child side in DeviceTimeCard.tsx: compute when the running block will cross the daily guide. When it crosses during a block that is not a treat, end the block there through the existing stop endpoint (unused minutes and stars trim exactly like an early stop) and show the reached guide state with the offline ideas, one warm line, never a telling off. A treat block runs its full length untouched.
   b. Cron backstop in app/api/cron/device-time/route.ts: same every minute run also finds active, unexpired sessions where today's total including the elapsed part of the running block has reached the age guide, treat false, guide_alerted_at null. Sets guide_alerted_at and pushes the parent. The cron never ends the session; the child screen does the divert, the cron is the parent's eyes.

3. Treat grants: wire wouldExceedGuide at last. In the parent grant and approve paths, when the grant would take the child past the day's guide, show one warm inline line before confirming and write treat true on the session parent-start creates. Child started sessions never set treat.

4. Per device aggregate: /api/quests/time/active also returns, per child, the last 7 days from device_sessions grouped by device (minutes and session count) plus sessions today. ParentDeviceTime.tsx renders a compact Where the time goes block, heaviest device first, with one age calibrated advice line and a link to the lessons hub under the heaviest device, and a sessions today count near the today bar.

Verify: npx tsc --noEmit, then dev server screenshots of the parent quests page and the kid screen if the sandbox allows.
