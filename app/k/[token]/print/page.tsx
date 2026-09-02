import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPrintable } from '@/lib/printables/registry'
import { unpackFromUrl } from '@/lib/kid/print-anywhere'
import KidPrintPage, { type PrintJob } from '@/components/kid/KidPrintPage'
import type { BucketIdea } from '@/components/printables/BucketSheet'
import type { SheetJob } from '@/components/printables/StarChartSheet'
import { MAX_ROWS } from '@/components/printables/StarChartSheet'

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
    .from('kid_links').select('child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  let job: PrintJob | null = null

  if (q.sheet) {
    const p = getPrintable(q.sheet)
    if (!p || p.pdfColourIn) notFound()
    job = {
      kind: 'sheet', key: p.key,
      sheet: { url: p.sheetUrl, title: p.title, extraUrls: p.extraSheetUrls, heading: p.sheetHeading, writeIn: p.writeIn },
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
