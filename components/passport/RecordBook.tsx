import PassportCover from '@/components/passport/PassportCover'
import StageSticker from '@/components/passport/StageSticker'
import { STAGE_STICKERS } from '@/lib/pathway/stage-stickers'
import { PASSPORT_PRINT_RESET } from '@/lib/pathway/passport-print-style'
import type { RecordStage, RecordRow } from '@/lib/pathway/record-book-server'

// THE PASSPORT RECORD BOOK, ON PAPER (17 November 2026).
//
// Justin: "give them a book like a swimming passport", simple, fun, and clear
// on how to achieve each step. A swimming record book works because every
// badge is a short list of things you can actually do, each one ticked and
// signed by the person who saw it. This is that, for each passport stage:
//   the cover, with how the book works in four steps and a QR code to the app
//   one page per stage: the Planet Friend sticker spot and the line it says,
//     then every step in the order the app teaches it, each with how to do it,
//     a tick and date when the app already has it, and a grown up's initials
// The ticks come from the app (lib/pathway/record-book-server.ts), so the
// paper only ever shows what the passport page counts. Steps done since the
// last print get ticked by hand and checked against the app next time.
//
// A4 portrait, one stage a page, millimetres, the shared print reset so the
// app's zoom and Chrome's background graphics setting cannot spoil it.

const HOW: Record<RecordRow['kind'], string> = {
  lesson: 'A lesson in the app, then its short check',
  talk: 'A talk together, from the grown up’s app',
  check: 'The end of stage check in the app',
}
const WHO: Record<RecordRow['kind'], string> = { lesson: 'Child', talk: 'Grown up', check: 'Child' }

function fmt(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'Europe/London' })
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

export default function RecordBook({ kid, stages, currentStage, qrSvg, children }: {
  kid: string | null
  stages: RecordStage[]
  currentStage: number | null
  qrSvg: string | null
  children?: React.ReactNode
}) {
  const name = kid || 'Your child'
  const stamped = stages.filter(s => s.stamped).map(s => s.n)
  const page: React.CSSProperties = {
    background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
    padding: '20px 18px', margin: '0 auto 18px', maxWidth: '210mm', boxSizing: 'border-box',
  }
  return (
    <div className="gc-record" style={{ maxWidth: 820, margin: '0 auto', padding: '20px 16px 60px' }}>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          ${PASSPORT_PRINT_RESET}
          .gc-record { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .gc-rb-screen { display: none !important; }
          .gc-rb-page { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 0 !important; margin: 0 !important; max-width: none !important; width: 190mm !important; break-after: page; page-break-after: always; }
          .gc-rb-page:last-child { break-after: auto; page-break-after: auto; }
          .gc-rb-row { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {children && <div className="gc-rb-screen" style={{ marginBottom: 16 }}>{children}</div>}

      {/* THE COVER */}
      <section className="gc-rb-page" data-page="cover" style={page}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <PassportCover kid={kid} stamped={stamped} width={150} tilt={-3} />
          <div style={{ minWidth: 0, flex: '1 1 220px' }}>
            <p style={{ ...mono, margin: '0 0 4px' }}>Passport record book</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.1 }}>
              {name}&rsquo;s record book
            </h1>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Five stages from four to sixteen. Each stage is a short list of steps. Finish them all and the stage is done, and its Planet Friend sticker goes on the page.
            </p>
          </div>
        </div>
        <p style={{ ...mono, color: 'var(--ink)', margin: '0 0 8px' }}>How it works</p>
        <ol style={{ listStyle: 'none', margin: '0 0 16px', padding: 0, display: 'grid', gap: 8 }}>
          {[
            'Do the step. Lessons and the big check are in the child’s app, talks are in the grown up’s app.',
            'Tick it here and write the date. Steps the app already has are ticked for you when you print.',
            'A grown up who saw it writes their initials. That is the sign off, like a swimming badge.',
            'Every step ticked means the stage is done. Print the colour sticker and stick it on the page.',
          ].map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span aria-hidden style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{i + 1}</span>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, paddingTop: 3 }}>{t}</span>
            </li>
          ))}
        </ol>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', borderTop: '1.5px dashed var(--border)', paddingTop: 12 }}>
          {qrSvg && (
            <span aria-label="QR code to the passport in the app" role="img" style={{ width: 84, height: 84, flexShrink: 0, display: 'block' }}
              dangerouslySetInnerHTML={{ __html: qrSvg }} />
          )}
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
            Scan to open the passport in the app, where every step is counted as it happens. Print this book again any time and the new ticks come with it.
          </p>
        </div>
      </section>

      {/* ONE PAGE PER STAGE */}
      {stages.map(st => {
        const s = STAGE_STICKERS[st.n - 1]
        const done = st.rows.filter(r => r.done).length
        const isCurrent = currentStage === st.n
        return (
          <section key={st.n} className="gc-rb-page" data-page={`stage-${st.n}`} style={{ ...page, borderTop: `8px solid ${s.colour}` }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              {st.stamped
                ? <StageSticker s={s} earned size={84} showName={false} />
                : (
                  <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: '50%', border: '2px dashed var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <span style={{ ...mono, fontSize: 9, lineHeight: 1.35 }}>Stick<br />{s.friend}<br />here</span>
                  </div>
                )}
              <div style={{ minWidth: 0 }}>
                <p style={{ ...mono, margin: '0 0 2px' }}>Stage {st.n} of 5{isCurrent ? ' · this year' : ''}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.15 }}>
                  {s.page}
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: 0 }}>
                  {s.friend}&rsquo;s sticker says: &ldquo;{s.learnt}&rdquo;
                </p>
              </div>
            </div>
            <p style={{ ...mono, color: 'var(--ink)', margin: '0 0 6px' }}>
              {st.stamped ? 'Stage done' : `${done} of ${st.rows.length} steps done`}
            </p>
            <div role="table" aria-label={`Steps for ${s.page}`}>
              <div role="row" className="gc-rb-row" style={{ display: 'grid', gridTemplateColumns: '28px 1fr 64px 64px', gap: 8, padding: '0 0 4px', borderBottom: '1.5px solid var(--ink)' }}>
                <span role="columnheader" style={{ ...mono, fontSize: 9 }}>Done</span>
                <span role="columnheader" style={{ ...mono, fontSize: 9 }}>Step</span>
                <span role="columnheader" style={{ ...mono, fontSize: 9 }}>Date</span>
                <span role="columnheader" style={{ ...mono, fontSize: 9 }}>Initials</span>
              </div>
              {st.rows.map((r, i) => (
                <div key={r.key} role="row" className="gc-rb-row" data-done={r.done ? '1' : '0'} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 64px 64px', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span role="cell" aria-label={r.done ? 'Done' : 'Not yet'} style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${r.done ? s.colour : 'var(--ink-muted)'}`,
                    background: r.done ? s.colour : 'transparent', color: 'var(--white)', fontWeight: 900, fontSize: 13,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r.done ? '✓' : ''}</span>
                  <span role="cell" style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.25 }}>
                      {i + 1}. {r.title}
                    </span>
                    <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.3 }}>
                      {WHO[r.kind]} &middot; {HOW[r.kind]}
                    </span>
                  </span>
                  <span role="cell" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)', borderBottom: '1px dotted var(--ink-muted)', minHeight: 18, paddingBottom: 2 }}>{fmt(r.doneOn)}</span>
                  <span role="cell" style={{ borderBottom: '1px dotted var(--ink-muted)', minHeight: 18 }} />
                </div>
              ))}
            </div>
            <div className="gc-rb-row" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Stage done on ____________</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Signed by a grown up ____________</span>
            </div>
          </section>
        )
      })}
    </div>
  )
}
