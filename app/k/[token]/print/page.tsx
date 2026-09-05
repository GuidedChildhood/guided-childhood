import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPrintable } from '@/lib/printables/registry'
import { unpackFromUrl } from '@/lib/kid/print-anywhere'
import KidPrintPage, { type PrintJob } from '@/components/kid/KidPrintPage'
import type { BucketIdea } from '@/components/printables/BucketSheet'
import type { SheetJob } from '@/components/printables/StarChartSheet'
import { MAX_ROWS } from '@/components/printables/StarChartSheet'
import { getTimeSettings } from '@/lib/quests/time-tiers'
import { dealFactsFrom } from '@/lib/printables/deal-facts'
import type { DrawnSpec } from '@/components/printables/drawn'
import { missionSheetFor } from '@/lib/printables/mission-sheets'

// The child's print page. See lib/kid/print-anywhere for why it exists:
// inside an installed iOS app window.print() does nothing, so every print
// button there opens this page in real Safari instead, and this page prints
// itself.
//
// ?sheet=<key>       a sheet from the registry
// ?bucket=<packed>   the bucket list, picks in the URL
// ?star=<packed>     the star chart, jobs in the URL
//
// Same trust model as the rest of the child app: the link token scopes
// everything, no account, no login. Only the token is checked against the
// database; the picks are the child's own words, drawn as text, never run.

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Print it 🖨️' }

type Params = { token: string }
type Query = { sheet?: string; bucket?: string; star?: string }

const clean = (s: unknown, max: number) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '')

export default async function KidPrintRoute({ params, searchParams }: { params: Promise<Params>; searchParams?: Promise<Query> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  const q = (await searchParams) ?? {}

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  let job: PrintJob | null = null

  if (q.sheet) {
    const p = getPrintable(q.sheet)
    if (!p || p.pdfColourIn) notFound()
    // A drawn sheet carries the child's name and the family's real deal
    // (minutes per star, the daily core, the bedtime, the protected windows)
    // so the paper on the fridge never disagrees with the app. Each read
    // fails soft to a dotted line the family writes on.
    let drawn: DrawnSpec | undefined
    if (p.drawn) {
      const { data: child } = await supabase
        .from('children').select('name, age_band').eq('id', link.child_id).maybeSingle()
      const childName = child?.name && child.name !== 'Your child' ? String(child.name) : ''
      let facts = {}
      try {
        const settings = await getTimeSettings(supabase, link.user_id as string, [{ id: link.child_id as string, age_band: (child?.age_band as string | null) ?? null }])
        const s = settings.get(link.child_id as string)
        if (s) facts = dealFactsFrom(s)
      } catch { /* dotted lines */ }
      // A mission sheet on the child's link carries no code: the card is the grown up's print.
      drawn = { key: p.drawn, childName, stars: p.stars, facts, mission: missionSheetFor(p.key) }
    }
    job = {
      kind: 'sheet', key: p.key,
      sheet: { url: p.sheetUrl, title: p.title, extraUrls: p.extraSheetUrls, heading: p.sheetHeading, writeIn: p.writeIn, drawn },
    }
  } else if (q.bucket) {
    const d = unpackFromUrl<{ title?: string; childName?: string; picked?: BucketIdea[] }>(q.bucket)
    if (!d) notFound()
    const picked = (Array.isArray(d.picked) ? d.picked : [])
      .map(i => ({ emoji: clean(i?.emoji, 4) || '⭐', text: clean(i?.text, 40) }))
      .filter(i => i.text.length > 0)
      .slice(0, 12)
    job = { kind: 'bucket', title: clean(d.title, 30) || 'My Bucket List', childName: clean(d.childName, 20), picked }
  } else if (q.star) {
    const d = unpackFromUrl<{ name?: string; weekLabel?: string | null; jobs?: SheetJob[]; starMinutes?: number }>(q.star)
    if (!d) notFound()
    const jobs = (Array.isArray(d.jobs) ? d.jobs : [])
      .map(j => ({ emoji: clean(j?.emoji, 4) || '⭐', text: clean(j?.text, 40), stars: Math.min(5, Math.max(1, Number(j?.stars) || 1)) }))
      .filter(j => j.text.length > 0)
      .slice(0, MAX_ROWS)
    const starMinutes = Math.min(60, Math.max(1, Number(d.starMinutes) || 5))
    job = { kind: 'star', name: clean(d.name, 20), weekLabel: typeof d.weekLabel === 'string' ? clean(d.weekLabel, 40) : null, jobs, starMinutes }
  }

  if (!job) notFound()

  return <KidPrintPage job={job} token={token} />
}
