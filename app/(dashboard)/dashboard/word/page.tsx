import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BackTo from '@/components/nav/BackTo'
import WordCard from './WordCard'
import type { DigiWord } from '@/lib/digi/word'

// DiGi's word: the proactive insight, in full, newest first. The unread one
// leads; the ones before it sit beneath so a parent can look back at what
// DiGi has said about their child over the weeks.

export const dynamic = 'force-dynamic'

export default async function WordPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const { from } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: rows }, { data: kids }] = await Promise.all([
    supabase.from('digi_prompts').select('id, child_id, title, body, href, cta, source, status, reaction, created_at')
      .eq('user_id', user.id).eq('kind', 'insight').neq('status', 'dismissed')
      .order('created_at', { ascending: false }).limit(6),
    supabase.from('children').select('id, name').eq('parent_id', user.id),
  ])
  const words = (rows ?? []) as DigiWord[]
  const nameOf = new Map(((kids ?? []) as { id: string; name: string | null }[]).map(k => [k.id, k.name]))

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '20px 20px 48px' }}>
      <BackTo from={from ?? 'today'} />
      <p className="eyebrow" style={{ marginBottom: 6 }}>DiGi's word</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 7vw, 2.3rem)', letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 8px', color: 'var(--ink)' }}>
        Something worth knowing
      </h1>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 20px' }}>
        Twice a week DiGi reads how the fortnight went, the research for this age and what has worked for other families, and says one thing.
      </p>

      {words.length === 0 ? (
        <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 20, boxShadow: '0 4px 0 var(--ink)', padding: '22px 18px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }}>
            Nothing yet
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            DiGi's first word arrives on Tuesday or Friday morning, once there is a fortnight to read. The check in and the scripts are what give it something to say.
          </p>
          <Link href="/dashboard/checkin" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>Go to the check in →</Link>
        </div>
      ) : (
        words.map((w, i) => (
          <WordCard key={w.id} word={w} childName={w.child_id ? (nameOf.get(w.child_id) ?? null) : null} latest={i === 0} />
        ))
      )}
    </div>
  )
}
