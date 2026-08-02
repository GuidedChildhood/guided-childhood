import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { clearLaneKeywordCache } from '@/lib/digi/keywords'

// The words DiGi did not know, and the button that teaches it one.
//
// Justin: "can we get a report of any fail in future so I can review weekly in
// insights and click a button to add common ones".
//
// The failure being reported is a routing miss: a message the keyword pass
// could not place, which cost a model call to classify. His own message about
// Teo and the television was one, and it cost 1332ms, because tv was not in the
// list. This is the loop that stops that happening twice.
//
// TWO RAILS, both load bearing.
//
// 1. FOUNDER ONLY, checked here and not only on the page. A page gate protects
//    a page; an API route with no gate of its own is reachable by anybody who
//    can type a URL. Same rule the insights page already follows.
//
// 2. NOTHING SURFACES UNTIL TWO SEPARATE FAMILIES HAVE SAID IT. This is the
//    whole privacy design rather than a nicety. digi_lane_misses holds single
//    words already stripped of names and stopwords, but one family's unusual
//    word is still one family's word. The having clause below is the line
//    between "the vocabulary of parents" and "what that parent typed", and it
//    is the same de-identification rule that governs rebuildWisdom.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function requireFounder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) return null
  return user
}

export async function GET(request: Request) {
  if (!await requireFounder()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const days = Math.min(90, Math.max(1, Number(new URL(request.url).searchParams.get('days')) || 7))
  const since = new Date(Date.now() - days * 86_400_000).toISOString()
  const admin = createAdminClient()

  try {
    const [missRows, keywordRows, latencyRows] = await Promise.all([
      admin.from('digi_lane_misses').select('word, user_id, created_at').gte('created_at', since),
      admin.from('digi_lane_keywords').select('word').eq('active', true),
      admin.from('digi_latency').select('replied, lane_ms, total_ms').gte('created_at', since),
    ])

    // A failed read is not an empty week. Saying "no misses" when the query
    // fell over is exactly the fault this whole week has been about.
    if (missRows.error || keywordRows.error) {
      return NextResponse.json({ error: missRows.error?.message ?? keywordRows.error?.message }, { status: 500 })
    }

    const known = new Set((keywordRows.data ?? []).map(r => r.word as string))

    // Count families per word, not mentions. One parent saying "roblox" nine
    // times in one afternoon is one family's habit, not a pattern.
    const byWord = new Map<string, { families: Set<string>; hits: number }>()
    for (const row of missRows.data ?? []) {
      const word = row.word as string
      if (known.has(word)) continue
      const entry = byWord.get(word) ?? { families: new Set<string>(), hits: 0 }
      if (row.user_id) entry.families.add(row.user_id as string)
      entry.hits += 1
      byWord.set(word, entry)
    }

    const suggestions = [...byWord.entries()]
      .map(([word, v]) => ({ word, families: v.families.size, hits: v.hits }))
      // The line. Below two families this is one person's vocabulary and it
      // does not get shown, to Justin or to anybody.
      .filter(s => s.families >= 2)
      .sort((a, b) => b.families - a.families || b.hits - a.hits)
      .slice(0, 40)

    // The health half of the report, so "any fail" means what it says rather
    // than only routing misses.
    const latency = latencyRows.data ?? []
    const answered = latency.filter(r => r.replied === true).length
    const failed = latency.filter(r => r.replied === false).length
    const fellThrough = latency.filter(r => (r.lane_ms as number | null ?? 0) > 200).length

    return NextResponse.json({
      days,
      suggestions,
      // Words seen but held back by the two family rule. A count only, never
      // the words themselves, so the board can be honest that it is holding
      // something back without leaking what.
      heldBack: [...byWord.values()].filter(v => v.families.size < 2).length,
      health: {
        messages: latency.length,
        answered,
        failed,
        fellThrough,
        medianTotalMs: median(latency.map(r => r.total_ms as number | null)),
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Report failed' }, { status: 500 })
  }
}

function median(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => typeof v === 'number').sort((a, b) => a - b)
  if (!nums.length) return null
  return nums[Math.floor(nums.length / 2)]
}

export async function POST(request: Request) {
  if (!await requireFounder()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { word } = await request.json().catch(() => ({ word: '' }))
  const clean = String(word ?? '').trim().toLowerCase()
  if (!clean || clean.length < 3 || clean.length > 40) {
    return NextResponse.json({ error: 'That is not a word we can add.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('digi_lane_keywords')
    .upsert({ word: clean, category: 'learned', source: 'founder', active: true }, { onConflict: 'word' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // This instance's cache only. Others expire within five minutes on their own,
  // which is the right trade: a word going live a few minutes later everywhere
  // costs nothing, and a cross instance invalidation would be real machinery
  // for a list that changes when somebody taps a button.
  clearLaneKeywordCache()

  return NextResponse.json({ ok: true, word: clean })
}
