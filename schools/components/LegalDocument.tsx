import Link from 'next/link'
import { COMPANY, LEGAL_LINE } from '@gc/shared/legal'
import PrintButton from '@/components/PrintButton'
import type { LegalDoc, SignatureBlock } from '@/lib/legal/types'

// ONE RENDERER FOR THE THREE LEGAL DOCUMENTS (13 September 2026).
//
// The terms, the privacy notice and the data processing agreement are data
// (lib/legal/*.ts); this draws any of them the same way, so a business
// manager who has read one knows where everything is in the other two: the
// eyebrow and the version line, the plain words box in Justin's voice, a
// contents list, numbered sections with numbered clauses a solicitor can
// cite, annex tables, and for the DPA two signature cards side by side.
//
// Mobbin references, redrawn in our own type: Workable and Bonsai contract
// pages (numbered clauses, bold lead ins, hairlines between sections) and
// Remote's agreement page (two signature blocks side by side). Prints to A4
// through the same rules as the hub documents; the nav, the contents and the
// related links are hidden on paper.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 14px', lineHeight: 1.15 }
const rule: React.CSSProperties = { borderTop: '1px solid var(--border)', padding: '26px 0 12px' }

function Signature({ block }: { block: SignatureBlock }) {
  return (
    <div className="gc-avoid-break" style={{ border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', background: '#fff' }}>
      <div style={{ ...mono, marginBottom: '14px' }}>{block.heading}</div>
      {block.lines.map(line => (
        <div key={line.label} style={{ display: 'grid', gridTemplateColumns: '88px 1fr', alignItems: 'end', gap: '10px', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', paddingBottom: '4px' }}>{line.label}</span>
          <span style={{ borderBottom: '1.5px solid var(--ink)', minHeight: '30px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', paddingBottom: '3px' }}>{line.value ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const versionLine = `Version ${doc.version} · ${doc.dated} · ${COMPANY.name}`
  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <article style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <span style={mono}>{doc.eyebrow}</span>
          <PrintButton />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.1 }}>
          {doc.title}
        </h1>
        <p style={{ ...mono, margin: '0 0 22px' }}>{versionLine}</p>

        <section aria-label="In plain words" style={{ border: '2px solid var(--terracotta)', background: 'var(--cream)', borderRadius: '20px', padding: '20px 22px 12px', marginBottom: '26px' }}>
          <div style={{ ...mono, marginBottom: '8px' }}>In plain words</div>
          {doc.plain.map(p => <p key={p} style={{ ...body, marginBottom: '10px' }}>{p}</p>)}
        </section>

        <nav aria-label="Contents" className="no-print" style={{ marginBottom: '22px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2px 20px' }}>
          {doc.sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', textDecoration: 'none', padding: '6px 0' }}>
              <span style={{ ...mono, marginRight: '8px' }}>{s.n}</span>{s.title}
            </a>
          ))}
          {doc.annexes?.map((a, i) => (
            <a key={a.id} href={`#${a.id}`} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', textDecoration: 'none', padding: '6px 0' }}>
              <span style={{ ...mono, marginRight: '8px' }}>Annex {i + 1}</span>{a.title}
            </a>
          ))}
        </nav>

        {doc.sections.map(s => (
          <section key={s.id} id={s.id} style={rule}>
            <h2 style={h2}>
              <span style={{ ...mono, display: 'block', marginBottom: '6px' }}>Section {s.n}</span>
              {s.title}
            </h2>
            {s.lead && <p style={{ ...body, marginBottom: '14px' }}>{s.lead}</p>}
            {s.clauses.map(c => (
              <div key={c.n} className="gc-avoid-break" style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: '8px', marginBottom: '14px' }}>
                <span style={{ ...mono, paddingTop: '7px' }}>{c.n}</span>
                <div>
                  <p style={body}>{c.text}</p>
                  {c.bullets && (
                    <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                      {c.bullets.map(b => <li key={b} style={{ ...body, marginBottom: '6px' }}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        ))}

        {doc.annexes?.map((a, i) => (
          <section key={a.id} id={a.id} style={rule}>
            <h2 style={h2}>
              <span style={{ ...mono, display: 'block', marginBottom: '6px' }}>Annex {i + 1}</span>
              {a.title}
            </h2>
            {a.intro && <p style={{ ...body, marginBottom: '14px' }}>{a.intro}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {a.rows.map(r => (
                  <tr key={r.label} style={{ borderTop: '1px solid var(--border)' }}>
                    <th scope="row" style={{ ...mono, textAlign: 'left', verticalAlign: 'top', padding: '12px 12px 12px 0', width: '104px' }}>{r.label}</th>
                    <td style={{ ...body, padding: '12px 0', verticalAlign: 'top' }}>{r.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        {doc.signatures && (
          <section id="signatures" style={rule}>
            <h2 style={h2}>
              <span style={{ ...mono, display: 'block', marginBottom: '6px' }}>Signatures</span>
              Agreed and signed
            </h2>
            <p style={{ ...body, marginBottom: '16px' }}>{doc.signatures.note}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <Signature block={doc.signatures.left} />
              <Signature block={doc.signatures.right} />
            </div>
          </section>
        )}

        <footer style={{ borderTop: '1px solid var(--border)', marginTop: '18px', paddingTop: '18px' }}>
          <p style={{ ...mono, margin: '0 0 8px' }}>{versionLine}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '0 0 18px' }}>{LEGAL_LINE}</p>
          <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {doc.related.map(r => (
              <Link key={r.href} href={r.href} className="btn btn-outline">{r.label}</Link>
            ))}
          </div>
        </footer>
      </article>
    </main>
  )
}
