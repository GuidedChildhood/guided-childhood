import { db as supabase } from '@/lib/supabase/server-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { KEY_STAGE_META, KEY_STAGE_ORDER } from '@gc/shared/schools-curriculum'
import { lessonsForYear, yearName, YEARS_OF } from '@gc/shared/schools-progression'
import { PAGE_SHELL } from '@gc/shared/page-scale'

export const metadata = { title: 'The year at a glance' }

// The year at a glance: every key stage's modules spread across the three
// terms, printable for the staffroom wall and the subject lead's file.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55 }

const TERMS = ['Autumn', 'Spring', 'Summer']

export default async function YearPlanPage() {

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Long term plan · suggested sequence, teach in any order you need</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          The year at a glance
        </h1>
        <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '22px', maxWidth: '620px' }}>
          A suggested year and term for every lesson. The sequence builds deliberately (each starter
          looks back at an earlier lesson), but every lesson stands alone, so reordering around your
          timetable loses nothing except that look back.
        </p>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          return (
            <section key={ks} style={{ marginBottom: 'var(--space-5)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
                {meta.label} <span style={{ fontWeight: 700, fontSize: '0.8em', color: 'var(--ink-muted)' }}>{meta.years}</span>
              </h2>
              {/* YEAR BY YEAR (11 November 2026). This page used to lay a whole
                  key stage across three terms, as if nine KS2 lessons were one
                  year's work. Each year group now has its own three terms, from
                  the suggested years in shared/schools-progression.ts, in the
                  scheme's own order. A term with nothing new in it says what
                  it is for. */}
              {YEARS_OF[ks].map(year => {
                const lessons = lessonsForYear(year)
                const terms = TERMS.map((t, i) => ({ term: t, modules: lessons.filter((_, k) => Math.floor((k * 3) / lessons.length) === i) }))
                return (
                  <div key={year} style={{ marginBottom: 'var(--space-3)', pageBreakInside: 'avoid' }}>
                    <h3 style={{ ...mono, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>{yearName(year)}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                      {terms.map(({ term, modules: termModules }) => (
                        <div key={term} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: 'var(--space-2) var(--space-3)' }}>
                          <div style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>{term}</div>
                          {termModules.length === 0 && <p style={{ ...body, color: 'var(--ink-muted)', margin: 0 }}>Revisit and embed</p>}
                          {termModules.map(m => (
                            <p key={m.moduleId} style={{ ...body, margin: '0 0 var(--space-1)' }}>
                              <Link href={`/lesson/${m.moduleId}`} style={{ color: 'var(--ink)', fontWeight: 700 }}>{m.title}</Link>
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </section>
          )
        })}

        <p style={{ ...body, color: 'var(--ink-muted)', maxWidth: '620px' }}>
          For what each lesson builds on and leads to, see{' '}
          <Link href="/hub/progression" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>the progression map</Link>.
        </p>
      </div>
    </main>
  )
}
