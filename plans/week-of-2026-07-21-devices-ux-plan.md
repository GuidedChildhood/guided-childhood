# Devices Safety Hub — UX pass (2026-07-21)

Justin, on the Device coverage board and guides. Three asks from the screenshot:

1. **Marked as set up should flip away as done.** Marking a device set up should
   collapse its open guide (flip shut) and sink the row into a quiet done group,
   so the active checklist only shows what is still left. Mirrors the kid path
   node that flips to done.

2. **A "we do not have this" escape.** In every guide, next to Mark as set up and
   DiGi walk me through it, a third action: "We do not have this yet". It drops
   the device off the active checklist and the coverage ring, but keeps it in a
   small "Not in our home yet" group they can restore from the day they get it.
   Needs a status on device_setup_progress (migration 090: status done|not_owned).

3. **DiGi asks every 2 weeks about new devices.** A fortnightly nudge on the hub:
   DiGi asks if any new device has come into the house, and to check the settings
   still match the child's age. Reuses digi_device_checkins (prompt_id
   device_sweep) for the 14 day cadence, separate from the usage signal cards.

## Files
- supabase/migrations/090_device_ownership_status.sql (new)
- app/api/devices/complete/route.ts (accept status)
- app/api/devices/sweep/route.ts (new — fortnightly cadence)
- app/(dashboard)/dashboard/devices/page.tsx (load status, pass child)
- app/(dashboard)/dashboard/devices/DeviceHub.tsx (notOwned state + sweep)
- app/(dashboard)/dashboard/devices/DeviceList.tsx (not-have button, flip shut)
- app/(dashboard)/dashboard/devices/DeviceCoverageBoard.tsx (done group, restore)
- components/devices/DeviceSweepCard.tsx (new)

No dashes in copy. Migration 090 given to Justin to paste.
