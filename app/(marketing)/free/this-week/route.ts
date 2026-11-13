import { NextRequest, NextResponse } from 'next/server'
import schedule from '@/content/printables/free-saturdays.json'
import { thisWeeksSlug, londonDate, type FreeSaturday } from '@/lib/magnets/free-saturday'
import { getTaster } from '@/lib/magnets/tasters'
import { readUtm, utmQuery, cleanUtmValue } from '@gc/shared/utm'

// /free/this-week: always this Saturday's free taster (13 November 2026).
//
// The Instagram bio link and every Story link sticker point here, so they never
// need changing: on Saturday the link moves to the new taster by itself. It
// keeps only the src and the four utm_* values, each cleaned to a slug about
// the post (shared/utm.ts), so the free page counts the claim against the post
// that sent it and nothing about the person can ride along. Anything it cannot
// place lands on /free, the full list, never an error.

export const dynamic = 'force-dynamic'

export function GET(req: NextRequest) {
  const slug = thisWeeksSlug((schedule as { saturdays: FreeSaturday[] }).saturdays, londonDate())
  const taster = getTaster(slug)
  const ok = taster && taster.status !== 'hold'
  const to = new URL(ok ? `/free/${taster.slug}` : '/free', req.nextUrl.origin)
  const src = cleanUtmValue(req.nextUrl.searchParams.get('src'))
  to.search = [src ? `src=${src}` : '', utmQuery(readUtm(req.nextUrl.searchParams))].filter(Boolean).join('&')
  const res = NextResponse.redirect(to, 307)
  // The answer changes on Saturday morning, so no cache may keep last week's.
  res.headers.set('Cache-Control', 'no-store')
  return res
}
