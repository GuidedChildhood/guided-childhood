import { CURRICULUM } from '@gc/shared/schools-curriculum'
import { isStandaloneModule } from './taster'

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
