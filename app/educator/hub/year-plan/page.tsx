import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'

// The year at a glance: every key stage's modules spread across the three
// terms, printable for the staffroom wall and the subject lead's file.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink)', lineHeight: 1.55 }

const TERMS = ['Autumn', 'Spring', 'Summer']

export default async function YearPlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Long term plan · suggested sequence, teach in any order you need</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          The year at a glance
        </h1>
        <p style={{ ...body, fontSize: '13px', marginBottom: '22px', maxWidth: '620px' }}>
          A suggested spread of each key stage&rsquo;s modules across the three terms. The sequence
          builds deliberately (each starter revisits the previous module), but every lesson stands
          alone, so reordering around your timetable loses nothing except the retrieval thread.
        </p>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          // Spread modules across terms as evenly as possible, in order.
          const perTerm = Math.ceil(modules.length / 3)
          const terms = TERMS.map((t, i) => ({ term: t, modules: modules.slice(i * perTerm, (i + 1) * perTerm) }))
          return (
            <section key={ks} style={{ marginBottom: '22px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)', margin: '0 0 8px' }}>
                {meta.label} <span style={{ fontWeight: 700, fontSize: '0.8em', color: 'var(--ink-muted)' }}>{meta.years}</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {terms.map(({ term, modules: termModules }) => (
                  <div key={term} style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 14px' }}>
                    <div style={{ ...mono, fontSize: '9.5px', color: 'var(--green-dark)', marginBottom: '6px' }}>{term}</div>
                    {termModules.length === 0 && <p style={{ ...body, color: 'var(--ink-muted)' }}>Revisit and embed</p>}
                    {termModules.map(m => (
                      <p key={m.moduleId} style={{ ...body, margin: '0 0 6px' }}>
                        <strong>M{String(m.n).padStart(2, '0')}</strong> {m.title}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
