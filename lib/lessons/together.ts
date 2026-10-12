// A LESSON DONE TOGETHER, PROVED BY THE GROWN UP'S OWN SESSION (plan v10, 1.5).
//
// A pass done together counts every prove question answered rather than every
// one right, because the grown up is the check. That makes "together" worth
// faking: a child who failed twice could reopen alone, tap anything and bank
// the pass. So it is never a query string and never set from the child's
// token. The grown up opens the lesson from their own signed in session
// (app/(dashboard)/dashboard/lessons/together/route.ts), which sets this
// short lived httpOnly cookie, signed, naming the child and the lesson, and
// the completion route requires it before a run counts as together.
//
// Under 7 the whole lesson is together by its audience and needs no cookie.

import { createHmac, timingSafeEqual } from 'node:crypto'

export const TOGETHER_COOKIE = 'gc_together'
/** Long enough for a lesson and a cup of tea, short enough not to linger. */
export const TOGETHER_TTL_SECONDS = 2 * 60 * 60

function secret(): string {
  return process.env.KID_TOGETHER_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SERVICE_KEY
    || ''
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

/** The cookie's value for this child and lesson, valid for the TTL. */
export function togetherToken(childId: string, lessonId: string, now: number = Date.now()): string {
  const exp = Math.floor(now / 1000) + TOGETHER_TTL_SECONDS
  const payload = `${childId}.${lessonId}.${exp}`
  return `${payload}.${sign(payload)}`
}

/** Whether a cookie value proves a grown up opened this lesson with this child. Fails closed without a secret. */
export function isTogether(value: string | null | undefined, childId: string, lessonId: string, now: number = Date.now()): boolean {
  if (!value || !secret()) return false
  const parts = value.split('.')
  if (parts.length !== 4) return false
  const [c, l, exp, mac] = parts
  if (c !== childId || l !== lessonId) return false
  if (!/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false
  const want = Buffer.from(sign(`${c}.${l}.${exp}`))
  const got = Buffer.from(mac)
  return want.length === got.length && timingSafeEqual(want, got)
}
