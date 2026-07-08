import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM } from '@/lib/content/schools-curriculum'

// The coverage report: the head and governor view, printable for the
// termly report and the inspection file. Generated from register taps,
// so evidence is a side effect of teaching, never a filing job.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('school_educators')
    .select('school_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()
  if (!membership) redirect('/educator')

  const [{ data: school }, { data: classes }, { data: lessons }] = await Promise.all([
    supabase.from('school_accounts').select('name').eq('id', membership.school_id).maybeSingle(),
    supabase.from('school_classes').select('id, name, year_group').eq('school_id', membership.school_id).order('created_at'),
    supabase.from('school_lessons').select('id, module_id, title, key_stage').order('sort_order'),
  ])

  const classIds = (classes ?? []).map(c => c.id)
  const [{ data: deliveries }, { count: pupilCount }] = await Promise.all([
    classIds.length
      ? supabase.from('lesson_deliveries').select('id, lesson_id, class_id, taught_at').in('class_id', classIds)
      : Promise.resolve({ data: [] as { id: string; lesson_id: string; class_id: string; taught_at: string }[] }),
    supabase.from('pupils').select('id', { count: 'exact', head: true }),
  ])

  const taught = new Map<string, Map<string, string>>() // lesson_id -> class_id -> date
  for (const d of deliveries ?? []) {
    if (!taught.has(d.lesson_id)) taught.set(d.lesson_id, new Map())
    const perClass = taught.get(d.lesson_id)!
    const existing = perClass.get(d.class_id)
    if (!existing || d.taught_at > existing) perClass.set(d.class_id, d.taught_at)
  }

  const manifestByModule = new Map(CURRICULUM.map(m => [m.moduleId, m]))
  const modulesTaught = (lessons ?? []).filter(l => (taught.get(l.id)?.size ?? 0) > 0).length

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator" style={{ ...mono, textDecoration: 'none' }}>← Workspace</Link>
          <PrintButton label="Print the coverage report" />
        </div>

        <div style={mono}>Coverage report · for the head, governors and the inspection file</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 4px' }}>
          {school?.name ?? 'Your school'} · digital literacy coverage
        </h1>
        <p style={{ ...body, marginBottom: '18px' }}>
          Generated {new Date().toLocaleDateString('en-GB')} · {(classes ?? []).length} class{(classes ?? []).length === 1 ? '' : 'es'} ·{' '}
          {pupilCount ?? 0} pupils · {(deliveries ?? []).length} lesson deliveries recorded ·{' '}
          {modulesTaught} of {(lessons ?? []).length} live modules taught at least once
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-display)', fontSize: '12px' }}>Module</th>
                {(classes ?? []).map(c => (
                  <th key={c.id} style={{ padding: '6px 8px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-display)', fontSize: '11.5px', whiteSpace: 'nowrap' }}>
                    {c.name}<br /><span style={{ fontWeight: 400, fontSize: '10px', color: 'var(--ink-muted)' }}>{c.year_group}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(lessons ?? []).map(l => {
                const m = manifestByModule.get(l.module_id)
                const perClass = taught.get(l.id)
                return (
                  <tr key={l.id}>
                    <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ ...mono, fontSize: '9px', display: 'block' }}>{l.key_stage}{m ? ` · M${String(m.n).padStart(2, '0')}` : ''}</span>
                      <strong>{l.title}</strong>
                    </td>
                    {(classes ?? []).map(c => {
                      const date = perClass?.get(c.id)
                      return (
                        <td key={c.id} style={{ textAlign: 'center', padding: '6px 8px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                          {date
                            ? <span style={{ color: 'var(--green-dark)', fontWeight: 700 }}>✓ {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                            : <span style={{ color: 'var(--ink-light)' }}>·</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '16px', maxWidth: '640px' }}>
          Every tick is a recorded delivery with its register date. Per pupil judgements (working towards,
          met, exceeded) sit on each delivery record, and the statutory grounding for every module is in
          the Hub&rsquo;s RSHE 2025 mapping matrix. Together the three documents are the coverage and
          impact evidence trail.
        </p>
      </div>
    </main>
  )
}
