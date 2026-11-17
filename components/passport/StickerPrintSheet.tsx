import StageSticker from '@/components/passport/StageSticker'
import PassportCover from '@/components/passport/PassportCover'
import { STAGE_STICKERS, PAPER_RULE } from '@/lib/pathway/stage-stickers'
import { PASSPORT_PRINT_RESET } from '@/lib/pathway/passport-print-style'

// THE COLOUR STICKER SHEET, ONE A4 PAGE (17 November 2026).
//
// Justin: when a stage is done in the app, the family can print a colour page
// with that Planet Friend's sticker on it to stick in the paper passport, and
// the sticker says what was learnt. This is that page, the simple paper
// version of the passport. It prints the whole set so the sheet reads as a
// collection: every sticker earned in the app is in full colour with a cut
// line round it; the rest are outlines saying which page brings them, so
// nothing here can be cut out before the app has given it.
//
// The same sheet serves the parent and the child (their token print route).
// Sized in millimetres for A4 with the shared print reset, so the zoom and the
// background graphics setting cannot spoil it (lib/pathway/passport-print-style).

export default function StickerPrintSheet({ kid, stamped, focus = null, children }: {
  kid: string | null
  stamped: number[]
  /** A stage just done: its sticker leads the sheet, twice, so one can go on the fridge. */
  focus?: number | null
  /** The on screen controls (print button, links), hidden on paper. */
  children?: React.ReactNode
}) {
  const name = kid || 'Your child'
  const lead = focus && stamped.includes(focus) ? STAGE_STICKERS[focus - 1] : null
  return (
    <div className="gc-sticker-print" style={{ maxWidth: 820, margin: '0 auto', padding: '20px 16px 60px' }}>
      <style>{`
        .gc-sp-sheet { width: 100%; max-width: 210mm; box-sizing: border-box; }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          ${PASSPORT_PRINT_RESET}
          .gc-sticker-print { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .gc-sp-screen { display: none !important; }
          .gc-sp-sheet { box-shadow: none !important; border: none !important; padding: 0 !important; width: 190mm !important; max-width: none !important; }
        }
      `}</style>

      {children && <div className="gc-sp-screen" style={{ marginBottom: 16 }}>{children}</div>}

      <div className="gc-sp-sheet" data-sheet="stickers" style={{
        background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
        padding: '20px 18px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <PassportCover kid={kid} stamped={stamped} width={104} tilt={-3} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 4px' }}>
              Planet Friend stickers
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.15 }}>
              {name}&rsquo;s passport stickers
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
              One sticker for each stage. Cut round the ones in colour and stick each on its page. A stage is done when: {PAPER_RULE.charAt(0).toLowerCase() + PAPER_RULE.slice(1)}
            </p>
          </div>
        </div>

        {lead && (
          <div data-lead style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', padding: '6px 0 14px', borderBottom: '1.5px dashed var(--border)', marginBottom: 14 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ padding: 6, border: '1.5px dashed var(--ink-muted)', borderRadius: '50%' }}>
                <StageSticker s={lead} earned size={150} showName={false} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '18px 12px' }}>
          {STAGE_STICKERS.map(s => {
            const earned = stamped.includes(s.n)
            return (
              <div key={s.n} data-stage={s.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', breakInside: 'avoid' }}>
                <div style={{ padding: 5, border: earned ? '1.5px dashed var(--ink-muted)' : '1.5px solid transparent', borderRadius: '50%' }}>
                  <StageSticker s={s} earned={earned} size={118} showName={false} />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '8px 0 0', lineHeight: 1.15 }}>
                  {s.friend}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '2px 0 0' }}>
                  Stage {s.n} · {s.page}
                </p>
                <p style={{ fontSize: 'var(--text-sm)', color: earned ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.4, margin: '6px 0 0', maxWidth: 200 }}>
                  {earned ? `“${s.learnt}”` : `Comes when the ${s.page} page is done in the app.`}
                </p>
              </div>
            )
          })}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '18px 0 0', textAlign: 'center', letterSpacing: '0.06em' }}>
          guidedchildhood.com · {stamped.length} of 5 stickers earned
        </p>
      </div>
    </div>
  )
}
