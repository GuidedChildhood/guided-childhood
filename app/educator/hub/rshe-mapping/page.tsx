import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM, RSHE_2025_TOPICS, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'

// The RSHE 2025 mapping matrix: the document that survives the September
// 2026 statutory switchover. Renders live from the curriculum manifest so
// it can never drift from what the modules actually teach.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }

export default async function RsheMappingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, efcw_strands')

  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Statutory coverage · for the PSHE lead, SLT and inspection file</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          RSHE 2025 mapping matrix
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '6px' }}>
          The revised RSHE statutory guidance was published on 15 July 2025 and becomes compulsory on
          1 September 2026. The matrix below maps every Guided Childhood module to the guidance topics
          it substantively teaches, including the newly named content: harms of pornography, misogynistic
          online cultures and incel groups, deepfakes, online gambling, and illegal online behaviours.
        </p>
        <p style={{ ...body, fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px' }}>
          Honesty note: a module is marked only where it substantively teaches the topic. This scheme is a
          digital literacy and online safety programme designed to sit inside your wider PSHE provision,
          not to replace it. Each lesson additionally carries its KCSIE 2025 hooks and Education for a
          Connected World strands, shown beneath the matrix.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11.5px', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-display)', fontSize: '12px' }}>Module</th>
                {RSHE_2025_TOPICS.map(t => (
                  <th key={t.key} style={{ padding: '6px 4px', borderBottom: '2px solid var(--ink)', fontWeight: 700, fontSize: '10px', lineHeight: 1.3, maxWidth: '76px' }}>
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEY_STAGE_ORDER.flatMap(ks => CURRICULUM.filter(m => m.keyStage === ks)).map(m => (
                <tr key={m.moduleId}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
                    <span style={{ ...mono, fontSize: '9px', display: 'block' }}>{m.keyStage} · M{String(m.n).padStart(2, '0')}</span>
                    {m.title}
                  </td>
                  {RSHE_2025_TOPICS.map(t => (
                    <td key={t.key} style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--green-dark)', fontWeight: 900, fontSize: '14px' }}>
                      {m.rshe?.includes(t.key) ? '✓' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={mono}>Per module statutory hooks (KCSIE 2025 and framework anchors)</div>
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CURRICULUM.map(m => {
            const db = dbByModule.get(m.moduleId)
            return (
              <p key={m.moduleId} style={{ ...body, fontSize: '12px' }}>
                <strong>M{String(m.n).padStart(2, '0')} {m.title}:</strong>{' '}
                {(db?.statutory_hooks ?? []).join(' · ') || 'Statutory hooks load when the module row is live.'}
                {db?.efcw_strands?.length ? ` · EfCW strand${db.efcw_strands.length === 1 ? '' : 's'} ${db.efcw_strands.join(', ')}` : ''}
              </p>
            )
          })}
        </div>

        <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '24px' }}>
          Generated live from the curriculum data on {new Date().toLocaleDateString('en-GB')}. This document
          regenerates automatically whenever a module changes, so the printed copy in your file is always
          reproducible from the page.
        </p>
      </div>
    </main>
  )
}
