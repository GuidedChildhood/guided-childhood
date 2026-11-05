import type { Access } from './access'
import { pilotModulesFor } from './pilot'
import { isStandaloneModule } from './taster'

// WHICH LESSONS A SCHOOL MAY SEND HOME AS A PARENT LINK (5 November 2026).
//
// The licence decides, at the moment the link is minted (lib/parent-share.ts):
//
//   licence    every lesson in the scheme
//   pilot      its two lessons for its phase (lib/pilot.ts), nothing else
//   no code    nothing, which the caller decides before it gets here
//
// Standalone lessons stand outside the scheme and the passport, so they have
// no parent note in the scheme's sense and no link.
//
// Pure, so lib/parent-share.test.ts runs it under plain node.
export function canShareLesson(access: Access, moduleId: string): boolean {
  if (isStandaloneModule(moduleId)) return false
  if (access.tier === 'licence') return true
  return pilotModulesFor(access.phase).includes(moduleId)
}
