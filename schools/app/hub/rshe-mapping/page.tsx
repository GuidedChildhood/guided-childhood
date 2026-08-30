import { anon as supabase } from '@/lib/supabase/anon'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { CURRICULUM, RSHE_2025_TOPICS, KEY_STAGE_ORDER } from '@gc/shared/schools-curriculum'

// The RSHE 2025 mapping matrix: the document that survives the September
// 2026 statutory switchover. Renders live from the curriculum manifest so
// it can never drift from what the modules actually teach.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6 }

export const revalidate = 3600

export default async function RsheMappingPage() {

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, statutory_hooks, efcw_strands')

  const dbByModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Statutory coverage · for the PSHE lead, SLT and inspection file</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          RSHE 2025 mapping matrix
        </h1>
        <p style={{ ...body, maxWidth: '640px', marginBottom: '6px' }}>
          The revised RSHE statutory guidance was published on 15 July 2025 and becomes compulsory on
          1 September 2026. The matrix below maps every Guided Childhood module to the guidance topics
          it substantively teaches, including the newly named content: harms of pornography, misogynistic
          online cultures and incel groups, deepfakes, online gambling, and illegal online behaviours.
        </p>
        <p style={{ ...body, fontSize: 'var(--text-base)', color: 'var(--ink-muted)', marginBottom: '20px' }}>
          Honesty note: a module is marked only where it substantively teaches the topic. This scheme is a
          digital literacy and online safety programme designed to sit inside your wider PSHE provision,
          not to replace it. Each lesson additionally carries its KCSIE hooks and Education for a
          Connected World strands, shown beneath the matrix.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid var(--ink)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)' }}>Module</th>
                {RSHE_2025_TOPICS.map(t => (
                  <th key={t.key} style={{ padding: '6px 4px', borderBottom: '2px solid var(--ink)', fontWeight: 700, fontSize: 'var(--text-sm)', lineHeight: 1.3, maxWidth: '76px' }}>
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEY_STAGE_ORDER.flatMap(ks => CURRICULUM.filter(m => m.keyStage === ks)).map(m => (
                <tr key={m.moduleId}>
                  <td style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
                    <span style={{ ...mono, fontSize: 'var(--text-sm)', display: 'block' }}>{m.keyStage} · M{String(m.n).padStart(2, '0')}</span>
                    {m.title}
                  </td>
                  {RSHE_2025_TOPICS.map(t => (
                    <td key={t.key} style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--green-dark)', fontWeight: 900, fontSize: 'var(--text-md)' }}>
                      {m.rshe?.includes(t.key) ? '✓' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KCSIE 2026, in force 1 September 2026, names four additions a DSL
            will be asked about this term. Each row resolves its modules from
            the live manifest, so a renamed module can never leave this table
            pointing at a title that no longer exists. The wording stays
            honest: where coverage is a foundation rather than the full
            treatment, the row says so. */}
        <div style={mono}>KCSIE 2026 · the newly named risks, and where this scheme teaches them</div>
        <p style={{ ...body, maxWidth: '640px', margin: '8px 0 12px' }}>
          Keeping Children Safe in Education 2026 is in force from 1 September 2026. Alongside the four
          Cs of online risk it now names generative AI, deepfakes, misinformation, disinformation and
          conspiracy theories. Where those are taught here:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
          {([
            { risk: 'Generative AI and AI chatbots', note: 'seeded in the early years, taught in full at KS3 and KS5', ns: [3, 9, 12, 20] },
            { risk: 'Deepfakes and AI generated images', note: 'real and made up from Reception, the full treatment at KS3', ns: [3, 12] },
            { risk: 'Misinformation and disinformation', note: 'foundations at KS1, taught substantively at KS3, applied to persuasion at KS4', ns: [3, 12, 15] },
            { risk: 'Conspiracy theories', note: 'how false things spread at KS3, the communities that weaponise them at KS4', ns: [12, 18] },
          ] as { risk: string; note: string; ns: number[] }[]).map(row => (
            <p key={row.risk} style={{ ...body, fontSize: 'var(--text-base)' }}>
              <strong>{row.risk}:</strong>{' '}
              {row.ns
                .map(n => CURRICULUM.find(m => m.n === n))
                .filter(Boolean)
                .map(m => `M${String(m!.n).padStart(2, '0')} ${m!.title}`)
                .join(' · ')}
              <span style={{ color: 'var(--ink-muted)' }}> ({row.note})</span>
            </p>
          ))}
        </div>

        <div style={mono}>Per module statutory hooks (KCSIE and framework anchors)</div>
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CURRICULUM.map(m => {
            const db = dbByModule.get(m.moduleId)
            return (
              <p key={m.moduleId} style={{ ...body, fontSize: 'var(--text-base)' }}>
                <strong>M{String(m.n).padStart(2, '0')} {m.title}:</strong>{' '}
                {(db?.statutory_hooks ?? []).join(' · ') || 'Statutory hooks load when the module row is live.'}
                {db?.efcw_strands?.length ? ` · EfCW strand${db.efcw_strands.length === 1 ? '' : 's'} ${db.efcw_strands.join(', ')}` : ''}
              </p>
            )
          })}
        </div>

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '24px' }}>
          Generated live from the curriculum data on {new Date().toLocaleDateString('en-GB')}. This document
          regenerates automatically whenever a module changes, so the printed copy in your file is always
          reproducible from the page.
        </p>
      </div>
    </main>
  )
}
