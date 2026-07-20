// REFERENCE ONLY, never linked from the app. The proposed narrowed daily
// flow for the parent home: one screen, one next action, everything else
// folded to slim rows. Sample for Justin to red pen before anything real
// changes. Delete this route once the direction is agreed.

const mono = 'var(--font-mono, "IBM Plex Mono", monospace)'
const display = 'var(--font-display, Nunito, sans-serif)'
const body = 'var(--font-body, Nunito, sans-serif)'

const INK = '#1A1A2E'
const INK_SOFT = '#4A4A5E'
const INK_MUTED = '#7A7A8A'
const CREAM = '#FFFBEE'
const BUTTER = '#EDC35F'
const BUTTER_DARK = '#C99A28'
const BUTTER_LT = '#FEF7E0'
const GREEN = '#2F8F6B'
const GREEN_DARK = '#236F52'
const BORDER = '#EDE5D0'
const PILL_BLUE = '#DCE7FB'
const PILL_INK = '#1B2A4A'

function Dot({ state }: { state: 'done' | 'now' | 'ahead' }) {
  return (
    <span style={{
      width: state === 'now' ? 16 : 12, height: state === 'now' ? 16 : 12, borderRadius: '50%',
      background: state === 'done' ? GREEN : state === 'now' ? '#fff' : CREAM,
      border: state === 'now' ? `3px solid ${BUTTER_DARK}` : `2px solid ${state === 'done' ? GREEN_DARK : BORDER}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 8, fontWeight: 900, flexShrink: 0,
    }}>{state === 'done' ? '✓' : ''}</span>
  )
}

function SlimRow({ emoji, title, meta, badge }: { emoji: string; title: string; meta: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: 16, padding: '13px 14px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)' }}>
      <span style={{ width: 38, height: 38, borderRadius: 12, background: BUTTER_LT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{emoji}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: display, fontWeight: 800, fontSize: 15, color: INK, lineHeight: 1.2 }}>{title}</span>
        <span style={{ display: 'block', fontFamily: body, fontSize: 12.5, color: INK_MUTED, marginTop: 2 }}>{meta}</span>
      </span>
      {badge && (
        <span style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 700, background: PILL_BLUE, color: PILL_INK, borderRadius: 100, padding: '4px 10px', flexShrink: 0 }}>{badge}</span>
      )}
      <span aria-hidden style={{ color: INK_MUTED, fontWeight: 800 }}>›</span>
    </div>
  )
}

export default function RefDailyFlow() {
  return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 430, padding: '18px 16px 90px', position: 'relative' }}>

        {/* DiGi greets first, one line, with the road position folded in */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: BUTTER, border: `2px solid ${BUTTER_DARK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>⭐</span>
          <div style={{ background: '#fff', border: `1.5px solid ${BORDER}`, borderRadius: '4px 18px 18px 18px', padding: '11px 14px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)' }}>
            <p style={{ margin: 0, fontFamily: body, fontSize: 14.5, color: INK, lineHeight: 1.45 }}>
              Evening Justin. Teo is two stamps from Explorer, and today takes about ten minutes.
            </p>
          </div>
          <span style={{ marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontFamily: mono, fontSize: 11, fontWeight: 700, color: BUTTER_DARK, background: BUTTER_LT, border: `1px solid ${BUTTER}`, borderRadius: 100, padding: '5px 9px' }}>🔥 6 wk</span>
        </div>

        {/* THE one card: your ten minutes, next step only */}
        <div style={{ background: '#fff', border: `2px solid ${BUTTER}`, borderRadius: 20, padding: '18px 16px', boxShadow: '0 5px 0 rgba(201,154,40,0.25)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: INK_MUTED }}>Your ten minutes today</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot state="done" /><Dot state="done" /><Dot state="now" /><Dot state="ahead" />
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: display, fontWeight: 900, fontSize: 22, color: INK, lineHeight: 1.2 }}>
            Next: tonight&rsquo;s script
          </p>
          <p style={{ margin: '5px 0 14px', fontFamily: body, fontSize: 14, color: INK_SOFT, lineHeight: 1.5 }}>
            The wind down before bed, word for word. About 4 minutes.
          </p>
          <button style={{ width: '100%', fontFamily: display, fontWeight: 800, fontSize: 17, color: INK, background: BUTTER, border: 'none', borderRadius: 16, padding: '15px 0', boxShadow: `0 5px 0 ${BUTTER_DARK}`, cursor: 'pointer' }}>
            Do it now
          </button>
          <p style={{ margin: '11px 0 0', textAlign: 'center', fontFamily: mono, fontSize: 11, fontWeight: 700, color: INK_MUTED }}>
            6 min done today · about 4 more to your 10
          </p>
        </div>

        {/* Everything else folds to three slim rows */}
        <div style={{ display: 'grid', gap: 9 }}>
          <SlimRow emoji="🧹" title="Family quests" meta="Tidy room is waiting for your tick" badge="2 to approve" />
          <SlimRow emoji="🛣️" title="The road to 16" meta="Builder stage · stamp 3 of 5 on the way" />
          <SlimRow emoji="💬" title="Ask DiGi anything" meta="He knows your setup, your timer and your week" />
        </div>

        {/* Sunday only: the round up row appears here, nothing else moves */}
        <p style={{ margin: '16px 4px 0', fontFamily: body, fontSize: 12, color: INK_MUTED, lineHeight: 1.5 }}>
          Sundays add one row here: the weekly round up. Nothing else on this screen changes day to day, so the habit has one shape.
        </p>

        {/* Bottom nav, four tabs, Today always lands first */}
        <nav style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 0, width: '100%', maxWidth: 430, background: '#fff', borderTop: `1.5px solid ${BORDER}`, display: 'flex', padding: '10px 6px calc(10px + env(safe-area-inset-bottom))' }}>
          {[
            { e: '☀️', l: 'Today', on: true },
            { e: '🛣️', l: 'Road', on: false },
            { e: '⭐', l: 'Quests', on: false },
            { e: '💬', l: 'DiGi', on: false },
          ].map(t => (
            <span key={t.l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: t.on ? 1 : 0.45 }}>
              <span style={{ fontSize: 20 }}>{t.e}</span>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: t.on ? BUTTER_DARK : INK_MUTED }}>{t.l}</span>
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}
