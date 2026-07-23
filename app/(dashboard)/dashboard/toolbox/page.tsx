import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ToolCard, { type Tool } from '@/components/tools/ToolCard'

// DiGi's toolbox: the honest, evidence graded set of outside tools that help
// with the common problems, each shown as the problem, the fix and its
// science, and the benefit. Not an affiliate wall: a short vetted list, graded
// on show, that only ever names a service once it has earned its place.

export const dynamic = 'force-dynamic'

export default async function ToolboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fails soft to an empty list before migration 091 is applied.
  const { data, error } = await supabase
    .from('recommended_tools')
    .select('id, category, name, problem, fix, science, benefit, url, cost_note, evidence_grade, affiliate')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  const tools = (error ? [] : (data ?? [])) as Tool[]

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>The toolbox</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '10px' }}>
        What actually helps
      </h1>
      <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 22px', maxWidth: '560px' }}>
        A short, honest set of outside tools for the common problems. For each one: the problem, the fix and the science behind it, and what it changes at home. We grade the evidence in plain sight, and we only ever recommend what we would use ourselves.
      </p>

      {tools.length === 0 ? (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '22px', textAlign: 'center' }}>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
            The toolbox is being stocked. In the meantime, DiGi can point you to the right kind of tool for whatever you are facing.
          </p>
          <Link href="/dashboard/digi" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Ask DiGi →
          </Link>
        </div>
      ) : (
        tools.map(t => <ToolCard key={t.id} tool={t} />)
      )}
    </div>
  )
}
