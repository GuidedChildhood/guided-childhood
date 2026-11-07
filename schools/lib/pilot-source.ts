import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { isStandaloneModule } from './taster'
import { readUtm, cleanUtmValue, getParam, UTM_KEYS, type Utm, type ParamSource } from '@gc/shared/utm'

/** Where a pilot request came from, when a button said so: /pilot?from=<module>
 *  (21 October 2026, the Request a pilot button on the free standalone
 *  lessons). Only a module id we know, so the notes line Justin reads never
 *  carries whatever somebody typed into the address bar. Kept out of
 *  lib/pilot.ts because that file is in the proxy, and the curriculum list is
 *  not something the proxy should carry. */
export function pilotSource(raw: string | null | undefined): string | null {
  const id = String(raw ?? '').trim()
  if (!id) return null
  if (isStandaloneModule(id) || CURRICULUM.some(m => m.moduleId === id)) return id
  return null
}

// ── WHICH POST SENT THEM (funnel audit, 6 November 2026, fix 8) ─────────────
//
// A pilot request kept only ?from=<module>, so a LinkedIn post or a school
// group seed that brought a head to /pilot left no trace. Now the page also
// reads ?src=<code> (the parent app's source link codes) and the four utm_*
// values, and the form carries them as hidden fields to the notes line. Each
// is cleaned by shared/utm.ts: a short slug about the post or nothing, so an
// email address or a name pasted into a link never reaches the notes.

export type PilotAttribution = { src?: string } & Utm

/** The source fields worth keeping from the page's query or the submitted form. */
export function pilotAttribution(from: ParamSource): PilotAttribution {
  const out: PilotAttribution = readUtm(from)
  const src = cleanUtmValue(getParam(from, 'src'))
  if (src) out.src = src
  return out
}

/** The notes segment Justin reads: "source li-1106-pilot · linkedin / social / 1106-pilot". Null when there is none. */
export function attributionNote(a: PilotAttribution): string | null {
  const utm = UTM_KEYS.map(k => a[k]).filter(Boolean).join(' / ')
  const parts = [a.src, utm].filter(Boolean)
  return parts.length ? `source ${parts.join(', ')}` : null
}
