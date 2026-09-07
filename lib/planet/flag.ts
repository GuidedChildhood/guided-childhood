// Whether Planet Friends is live on the child link.
//
// Justin, 6 September 2026: "as this is nowhere near the level of Toca Boca can
// we hide it from the app until we get it good." So the toy is built behind a
// flag: nothing on the child link points at it, and the route itself is not
// there, until the flag says otherwise. The work carries on in the repo, the
// dev fixture (/dev/planet) still drives every screen with no database, and a
// preview key opens the real thing on a real child link for us to look at.
//
// PLANET_FRIENDS: 'live' shows it to every child; anything else, or unset,
// hides it. PLANET_FRIENDS_PREVIEW_KEY: a secret; /k/<token>/planet?preview=<key>
// opens the toy while it is hidden. Config values, never hardcoded, the same
// rule the rest of the platform's switches run on.

export const PLANET_FRIENDS_LIVE = (process.env.PLANET_FRIENDS ?? '').trim().toLowerCase() === 'live'

/** The preview key opens the toy while it is hidden. No key set, no preview. */
export function planetPreviewOk(given: string | null | undefined): boolean {
  const key = (process.env.PLANET_FRIENDS_PREVIEW_KEY ?? '').trim()
  return key.length > 0 && given === key
}

/** May this request see the toy at all: live for everyone, or the preview key. */
export const planetVisible = (preview: string | null | undefined): boolean =>
  PLANET_FRIENDS_LIVE || planetPreviewOk(preview)
