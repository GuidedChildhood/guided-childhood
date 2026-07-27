# Device coverage: always-on household defaults + passport nudge (sequenced)

Lane: platform code (devices). Branch `claude/etsy-printables-research-izl4ex`,
restarted from main after PR 562 merged. No migration.

## What Justin asked

The device guide should always carry WiFi as a default, then the parent adds
their real devices and the apps on them (YouTube etc). WiFi, Google and a TV
with YouTube should always be there as defaults. The passport should query the
devices: if none are added it links to add a device, once safe settings are
marked done it passes, and devices added but not marked done show as not passed.

## What already exists (from a full read of the code)

- WiFi is already an always-present synthetic row in the coverage board.
- The passport already reads device state (devicesPct reads family_devices +
  device_setup_progress) and already links to /dashboard/devices.
- A device with a guide already shows as not passed until its settings are
  marked done. The gap is only the empty home, which currently reads 100%.

## Decisions from Justin

- Defaults: add Google safe search and a smart TV with YouTube as always-shown
  rows, the same way WiFi is (not auto-inserted into their own device list).
- Empty passport: nudge to add a device but still count it (do not fail the
  stage). Only added-but-unmarked devices show as not passed.

## This PR (devices side, no passport files touched)

- `DeviceCoverageBoard.tsx`: a `DEFAULT_KEYS` set (google_safesearch, smarttv,
  youtube) is force included in the ready list whatever the child's age, so the
  Google, TV and YouTube layers show by default like the network row. A family
  can still mark one not owned and it drops to the not owned pile.

## Deliberately sequenced, not in this PR

The passport nudge (empty home reads "add your devices" while still counting)
lives in `IsItWorkingReport.tsx` / `lib/pathway/progress.ts` / `PassportBook.tsx`.
Those are the exact files another session is rewriting right now ("One passport
page, not two"). Editing them in parallel is the PR 55/56 duplication trap.
Once that rewrite merges I will apply the small change on the final structure:
when homeDeviceCount is 0, the device row reads a clear "Add your devices" nudge
(linking to /dashboard/devices) instead of "All set", with the stage still
counted so onboarding stays green.
