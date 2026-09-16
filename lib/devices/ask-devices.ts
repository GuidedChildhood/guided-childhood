import { KID_DEVICES } from '@/lib/quests/device-time'
import { deviceIcon, type FamilyDevice } from '@/lib/devices/family'

// The device list the child picks from on Ask for screen time.
//
// ── WHY THIS IS ITS OWN MODULE AND NOT A HELPER IN THE COMPONENT ────────────
//
// Justin, 14 September 2026, from his phone: "clicked use device time in
// child's app and error." Every child, every time, with no live timer: the
// page threw before it rendered a pixel and they got the error screen.
//
// This function used to live at the bottom of components/kid/KidAskScreenTime
// .tsx, which is a 'use client' module, and the server page imported it by
// name. That does not work, and it does not fail quietly.
//
// Next compiles a 'use client' module into the SERVER graph as a set of client
// references, not as code. Its own flight loader (next/dist/build/webpack/
// loaders/next-flight-loader) replaces every named export with:
//
//   export const askDevicesFrom = registerClientReference(
//     function () { throw new Error("Attempted to call askDevicesFrom() from
//       the server but askDevicesFrom is on the client...") }, ...)
//
// So on the server the name still imports, still typechecks, and is a function
// whose only behaviour is to throw. Calling it is the crash. No row state is
// involved, which is why it hit every child rather than one.
//
// ── WHY NOTHING CAUGHT IT ───────────────────────────────────────────────────
//
// Three things lined up. TypeScript sees a normal function and is happy. The
// route is `force-dynamic`, so `next build` never renders it and the build
// passed. And the only other place the screen was exercised, the dev fixture
// at /dev/kid-ask, is itself a client page importing the default export, so it
// never crossed the boundary.
//
// scripts/check-client-boundary.mjs now fails the build on this shape
// anywhere in the repo, because the toolchain will not.
//
// A type-only import of AskDevice back into the component is fine and stays:
// types are erased, so they never cross the boundary.

export type AskDevice = { id: string | null; kind: string; label: string; emoji: string }

/**
 * What the child sees on "What screen?".
 *
 * The family's own devices when they have added any, so a child taps "Ella's
 * iPad" rather than "Tablet". Otherwise the four kinds, so the page still
 * works on day one before anybody has set anything up.
 */
export function askDevicesFrom(familyDevices: FamilyDevice[]): AskDevice[] {
  if (familyDevices.length > 0) return familyDevices.map(d => ({ id: d.id, kind: d.kind, label: d.label, emoji: deviceIcon(d) }))
  return KID_DEVICES.map(d => ({ id: null, kind: d.key, label: d.label, emoji: d.emoji }))
}
