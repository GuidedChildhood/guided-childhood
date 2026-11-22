import StageSticker from '@/components/passport/StageSticker'
import { STAGE_STICKERS } from '@/lib/pathway/stage-stickers'
import type { KidSteps } from '@/lib/pathway/record-book-server'

// THE CHILD'S OWN PAGE, STEP BY STEP (17 November 2026, plan part 3).
//
// Justin: everything a child does should be recorded and be a clear step
// towards their passport sticker, easy to understand, with catch up, simple
// and fun. This is that, inside the passport the child already opens: their
// Planet Friend sticker and what it says, then every step on their page in the
// order the app teaches it, ticked when done, the next one lit. Earlier pages
// that are still open sit underneath as a short catch up list, never as a
// telling off. The rows are the record book's rows, so the child, the grown up
// and the paper all show the same thing.
//
// Read only, like the rest of the child's book: no links out, nothing to buy.

export default function KidPassportSteps({ steps }: { steps: KidSteps }) {
  const s = STAGE_STICKERS[steps.n - 1]
  if (!s) return null
  const done = steps.steps.filter(x => x.done).length
  const nextKey = steps.steps.find(x => !x.done)?.key ?? null
  return (
    <section data-kid-steps style={{
      background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)',
      padding: '14px 14px 12px', margin: '0 0 14px',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
        <StageSticker s={s} earned={steps.stamped} size={64} showName={false} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Your {s.page} page
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25, marginTop: 2 }}>
            {steps.stamped ? `Done! ${s.friend} is in your passport.` : `${done} of ${steps.steps.length} steps to earn ${s.friend}`}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>
            {s.friend}&rsquo;s sticker says: &ldquo;{s.learnt}&rdquo;
          </div>
        </div>
      </div>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {steps.steps.map((x, i) => {
          const next = x.key === nextKey
          return (
            <li key={x.key} data-step={x.kind} data-done={x.done ? '1' : '0'} style={{
              display: 'flex', gap: 10, alignItems: 'center', padding: '8px 8px', borderRadius: 'var(--radius-tile)',
              background: next ? 'var(--terracotta-lt)' : 'transparent', border: next ? '1.5px solid var(--terracotta)' : '1.5px solid transparent',
              marginBottom: 2,
            }}>
              <span aria-hidden style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                background: x.done ? s.colour : 'var(--white)', border: x.done ? `2px solid ${s.colour}` : '2px dashed var(--ink-muted)',
                color: 'var(--white)', fontWeight: 900, fontSize: 'var(--text-sm)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{x.done ? '✓' : ''}</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: next ? 900 : 700, fontSize: 'var(--text-base)', color: x.done ? 'var(--ink-soft)' : 'var(--ink)', lineHeight: 1.3 }}>
                <span className="sr-only">{x.done ? 'Done: ' : 'Not yet: '}</span>
                {i + 1}. {x.label}
              </span>
              {next && (
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: 'var(--radius-pill)', padding: '3px 8px' }}>
                  Next
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {steps.catchup.length > 0 && (
        <div data-catchup style={{ marginTop: 10, paddingTop: 10, borderTop: '1.5px dashed var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
            Still open from before
          </div>
          {steps.catchup.map(c => {
            const cs = STAGE_STICKERS[c.n - 1]
            return (
              <div key={c.n} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
                <StageSticker s={cs} earned={false} size={34} showName={false} />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.35 }}>
                  {cs.friend}&rsquo;s page: {c.left} {c.left === 1 ? 'step' : 'steps'} left. There is no rush, it stays open.
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
