'use client'
import { useState } from 'react'
import { STAGES } from '@/lib/content/stages'
import { STAGE_READINESS } from '@/lib/content/passport'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The passport, openable. Justin, 8 Aug 2026: each page should be clickable.
// The five stamps are tabs; picking one turns the book to that stage's page,
// with the readiness copy that already powers the dashboard card, so the
// story never drifts from the product.

const STAGE_RING = ['var(--stage-1)', 'var(--stage-2)', 'var(--stage-3)', 'var(--stage-4)', 'var(--stage-5)']
const STAMP_TILT = [-4, 3, -2, 4, 0]

export default function PassportPages() {
  const [open, setOpen] = useState(1)
  const r = STAGE_READINESS[open]
  const stage = STAGES.find(s => s.id === open)
  const friend = STAGE_CHARACTERS.find(c => c.stageId === open)

  return (
    <div style={{
      flex: '2 1 420px', minWidth: 300,
      background: '#fff', borderRadius: '18px', border: '1.5px solid var(--border)',
      padding: '26px 24px', boxShadow: '0 14px 40px rgba(0,0,0,0.07)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '18px' }}>
        One stamp earned each stage · tap a stamp to open its page
      </div>

      {/* The stamps, now tabs */}
      <div role="tablist" aria-label="Passport pages" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
        {STAGES.map((s, i) => {
          const isFinal = s.id === 5
          const active = open === s.id
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              aria-label={`Open the ${s.name} page, ${s.ages}`}
              onClick={() => setOpen(s.id)}
              style={{
                width: 72, height: 72, borderRadius: '50%', cursor: 'pointer',
                border: `2.5px ${active ? 'solid' : 'dashed'} ${isFinal ? 'var(--terracotta)' : `var(--stage-${s.id}-bold)`}`,
                background: isFinal ? 'var(--terracotta-lt)' : `color-mix(in srgb, ${STAGE_RING[i]} 45%, white)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transform: `rotate(${active ? 0 : STAMP_TILT[i]}deg) scale(${active ? 1.08 : 1})`,
                transition: 'transform .18s ease, border .18s ease, box-shadow .18s ease',
                boxShadow: active ? '0 5px 0 var(--border)' : 'none',
                fontFamily: 'inherit', padding: 0,
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                Stage
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', lineHeight: 1, color: isFinal ? 'var(--terracotta-dark)' : 'var(--ink)' }}>
                {s.id}
              </span>
              {isFinal && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.5rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--terracotta-dark)', textTransform: 'uppercase' }}>
                  Ready
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* The open page */}
      {stage && r && (
        <div key={open} role="tabpanel" style={{ background: STAGE_RING[open - 1], border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 20px 18px', animation: 'passportPageIn .25s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
                {stage.name} · {stage.ages.replace('Ages ', '')} · {r.moment}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', letterSpacing: '-.01em', marginTop: '4px' }}>
                {r.title}
              </div>
            </div>
            {friend && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={friend.cutout} alt={`${friend.name}, this stage's Planet Friend`} loading="lazy" style={{ width: '52px', height: 'auto', flexShrink: 0 }} />
            )}
          </div>
          <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.7, margin: '0 0 12px' }}>
            {r.body}
          </p>
          <p style={{ fontSize: '.82rem', color: 'var(--ink)', lineHeight: 1.65, margin: 0, paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
            <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: '4px' }}>This stage in one habit</strong>
            {r.focus}
          </p>
        </div>
      )}

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        At 16, when social media and the first vote arrive together, the cliff edge is just a step. Your child is prepared, educated and safe, and so are you.
      </p>

      <style>{`@keyframes passportPageIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } } @media (prefers-reduced-motion: reduce) { [role="tabpanel"] { animation: none !important; } }`}</style>
    </div>
  )
}
