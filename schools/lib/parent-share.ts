import { schoolShareRef, signParentShare, parentSharePath, cleanModuleId } from '@gc/shared/parent-share'
import { currentSchool } from './licence'
import { canShareLesson } from './share-rule'

// THE PARENT SHARE LINK, ON THE SCHOOLS SIDE (5 November 2026).
//
// Justin: every lesson a school teaches can go home to parents, and a parent
// sees the whole of it by making a free Guided Childhood account. This mints
// the link for the lesson page; the parents app opens it
// (app/(marketing)/from-school there, shared/parent-share.ts for the shape).
//
// THE LICENCE DECIDES WHAT CAN BE SHARED, here, at the moment of minting
// (lib/share-rule.ts holds the rule): a licence shares every lesson, a pilot
// its two. No code shares nothing: a visitor on the open catalogue or a taster
// lesson is not a school, and a link with no school behind it would be a free
// door to the content with nobody's name on it.
//
// The schools app still holds no session and no personal data: this reads the
// access cookie it already reads, and the link carries a pseudonym of the
// school, never the code (the code is the password to the licence).

const PARENTS_ORIGIN = 'https://www.guidedchildhood.com'

function secret(): string {
  return process.env.PARENT_SHARE_SECRET || ''
}

export type ParentShareLink = { url: string; ref: string }

/** The link for this lesson from the school whose cookie this is, or null. */
export async function parentShareFor(moduleId: string): Promise<ParentShareLink | null> {
  const id = cleanModuleId(moduleId)
  const key = secret()
  if (!id || !key) return null
  const school = await currentSchool()
  if (!school || !canShareLesson(school.access, id)) return null
  const ref = await schoolShareRef(school.code, key)
  if (!ref) return null
  const token = await signParentShare(id, ref, key)
  return token ? { url: `${PARENTS_ORIGIN}${parentSharePath(id, token)}`, ref } : null
}
