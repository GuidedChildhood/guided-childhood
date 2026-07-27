import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Founder only. A directory of DiGi's brain: every researcher, expert, body and
// source in the expert_knowledge bank, grouped so the whole evidence base is
// visible at a glance, with the topics and age bands each one covers. This is
// the human readable view of what DiGi is actually grounded in, and the surface
// the research updater will grow over time.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

type Row = { source_type: string | null; source_name: string | null; finding: string | null; age_bands: string[] | null; topics: string[] | null; url: string | null; active: boolean | null }

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const admin = createAdminClient()
  try {
    const { data, error } = await admin
      .from('expert_knowledge')
      .select('source_type, source_name, finding, age_bands, topics, url, active')
    if (error) return NextResponse.json({ error: error.message }, { status: 502 })

    const rows = (data ?? []) as Row[]
    const live = rows.filter(r => r.active !== false)

    // One entry per source, with what it covers and one sample finding.
    const bySource = new Map<string, {
      source: string; type: string; count: number; topics: Set<string>; ageBands: Set<string>; url: string | null; sample: string
    }>()
    for (const r of live) {
      const name = (r.source_name ?? 'Unknown').trim()
      let e = bySource.get(name)
      if (!e) { e = { source: name, type: r.source_type ?? 'source', count: 0, topics: new Set(), ageBands: new Set(), url: null, sample: '' }; bySource.set(name, e) }
      e.count += 1
      for (const t of r.topics ?? []) e.topics.add(t)
      for (const b of r.age_bands ?? []) e.ageBands.add(b)
      if (!e.url && r.url) e.url = r.url
      if (!e.sample && r.finding) e.sample = r.finding.length > 220 ? `${r.finding.slice(0, 217)}...` : r.finding
    }

    const sources = [...bySource.values()]
      .map(e => ({ source: e.source, type: e.type, findings: e.count, topics: [...e.topics].sort(), ageBands: [...e.ageBands].sort(), url: e.url, sample: e.sample }))
      .sort((a, b) => b.findings - a.findings || a.source.localeCompare(b.source))

    const byType: Record<string, number> = {}
    for (const s of sources) byType[s.type] = (byType[s.type] ?? 0) + 1
    const allTopics = [...new Set(live.flatMap(r => r.topics ?? []))].sort()

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      totalFindings: live.length,
      totalSources: sources.length,
      byType,
      topics: allTopics,
      sources,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Bank read failed' }, { status: 502 })
  }
}
