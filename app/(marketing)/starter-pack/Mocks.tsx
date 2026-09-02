'use client'

import DigiCharacter from '@gc/shared/components/DigiCharacter'

// The product, drawn in code, for the reveal page.
//
// Justin, 2 September 2026: the reveal should "introduce exactly how the
// platform works", at "Mobbin and Apple UX level". Every reference worth
// copying (Hers, Gentler Streak, Withings) shows the real product beside one
// short line, and never a paragraph beside an icon. We have no screenshots
// that survive a redesign, so each beat gets a small drawing of the real
// screen in our own tokens: the check in, today's one thing, the stars, a
// DiGi answer, the ask pop up, the child's app. They are pictures, not
// working UI, and they are marked aria hidden because the sentence beside
// each one says the same thing in words.

const INK = 'var(--ink)'
const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
  boxShadow: '0 2px 10px rgba(26,26,46,0.05)',
}
const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const TITLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: INK, letterSpacing: '-0.01em', lineHeight: 1.25,
}

/** A soft stage on which every drawing sits: the app's own cream, rounded, a hair of border. */
export function Stage({ children, tint = 'var(--cream)', pad = 18 }: { children: React.ReactNode; tint?: string; pad?: number }) {
  return (
    <div aria-hidden style={{ background: tint, border: '1.5px solid var(--border)', borderRadius: 22, padding: pad, overflow: 'hidden' }}>
      {children}
    </div>
  )
}

function StarRow({ filled, size = 22 }: { filled: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
            fill={n <= filled ? 'var(--terracotta)' : '#fff'} stroke={n <= filled ? 'var(--terracotta-dark)' : 'var(--ink-light)'} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

/** Step 1: the day as tappable moments, one flagged, and the one tap check in. */
export function MockCheckIn({ concern }: { concern: string }) {
  const moments = [
    { label: 'Morning', state: 'ok' },
    { label: 'Homework', state: 'ok' },
    { label: 'Gaming handover', state: 'flag' },
    { label: 'Bedtime', state: 'todo' },
  ]
  return (
    <Stage>
      <div style={{ ...EYEBROW, marginBottom: 10 }}>Today, how did it go?</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
        {moments.map(m => (
          <div key={m.label} style={{
            ...CARD, padding: '10px 6px', textAlign: 'center',
            background: m.state === 'flag' ? 'var(--stage-3)' : '#fff',
            borderColor: m.state === 'flag' ? 'var(--stage-3-bold)' : 'var(--border)',
          }}>
            <div style={{ fontSize: 18, lineHeight: 1 }}>{m.state === 'ok' ? '✓' : m.state === 'flag' ? '!' : '·'}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xs)', color: INK, marginTop: 5, lineHeight: 1.15 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...CARD, padding: '14px 16px' }}>
        <div style={{ ...TITLE, marginBottom: 8 }}>{concern}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <StarRow filled={2} />
          <span style={{ ...EYEBROW, color: 'var(--ink-soft)' }}>Two of five</span>
        </div>
      </div>
    </Stage>
  )
}

/** Step 2: today's one thing and the words, the way Home shows it. */
export function MockToday({ action, words }: { action: string; words: string }) {
  return (
    <Stage>
      <div style={{ ...EYEBROW, marginBottom: 10 }}>Today's one thing · 5 minutes</div>
      <div style={{ ...CARD, padding: '14px 16px', marginBottom: 10 }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: INK, lineHeight: 1.4 }}>{action}</p>
      </div>
      <div style={{ ...CARD, padding: '14px 16px', background: 'var(--terracotta-lt)', borderColor: 'var(--terracotta)' }}>
        <div style={{ ...EYEBROW, marginBottom: 6 }}>Say this</div>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: INK, lineHeight: 1.45 }}>&ldquo;{words}&rdquo;</p>
      </div>
    </Stage>
  )
}

/** Step 3: a worry filling to five stars over the weeks, then the stamp. */
export function MockProgress({ concern }: { concern: string }) {
  const weeks = [1, 2, 2, 3, 4, 5]
  return (
    <Stage>
      <div style={{ ...EYEBROW, marginBottom: 10 }}>{concern}</div>
      <div style={{ ...CARD, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 92 }}>
          {weeks.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: `${v * 16}px`, background: i === weeks.length - 1 ? 'var(--terracotta)' : 'var(--stage-3-bold)', borderRadius: 8, border: `1.5px solid ${i === weeks.length - 1 ? 'var(--terracotta-dark)' : 'var(--border)'}` }} />
              <span style={{ ...EYEBROW, fontSize: 10 }}>W{i + 1}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1.5px dotted var(--border)' }}>
          <StarRow filled={5} size={20} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--retro-green)' }}>Stamped in the passport</span>
        </div>
      </div>
    </Stage>
  )
}

/** DiGi: a real shaped answer, never a flat yes or no. */
export function MockDigi({ question, answer, words }: { question: string; answer: string; words: string }) {
  return (
    <Stage tint="#fff">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ maxWidth: '86%', background: 'var(--deep-teal)', color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.45 }}>
          {question}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: 2 }}><DigiCharacter mood="idle" size={32} /></div>
        <div style={{ flex: 1, minWidth: 0, background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '4px 18px 18px 18px', padding: '12px 14px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 'var(--text-sm)', color: INK, lineHeight: 1.5 }}>{answer}</p>
          <div style={{ background: '#fff', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '9px 11px' }}>
            <div style={{ ...EYEBROW, marginBottom: 4 }}>The words</div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: INK, lineHeight: 1.45 }}>&ldquo;{words}&rdquo;</p>
          </div>
        </div>
      </div>
    </Stage>
  )
}

/** The ask and the yes: the child picks, it pops up on the parent's phone. */
export function MockAsk({ kid }: { kid: string }) {
  return (
    <Stage>
      <div style={{ ...EYEBROW, marginBottom: 10 }}>On your phone</div>
      <div style={{ background: '#fff', border: '2.5px solid var(--ink)', borderRadius: 20, boxShadow: '0 5px 0 var(--ink)', padding: '14px 16px 14px' }}>
        <div style={{ ...EYEBROW, marginBottom: 6 }}>Screen time ask</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta)', border: '2px solid var(--ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📺</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: INK, lineHeight: 1.15 }}>{kid} is asking for 30 minutes</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: 3 }}>On the TV. That is 6 stars, they have 6.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <span style={{ flex: 1, textAlign: 'center', padding: '11px 0', borderRadius: 14, background: 'var(--terracotta)', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: INK }}>Yes ⭐</span>
          <span style={{ padding: '11px 16px', borderRadius: 14, background: '#fff', border: '2px solid var(--ink)', boxShadow: '0 4px 0 var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: INK }}>Not now</span>
        </div>
      </div>
    </Stage>
  )
}

/** Three kinds of time, as the three jars on the child's own deal sheet. */
export function MockJars() {
  const jars = [
    { label: 'Theirs', body: 'A small core every day. No strings.', fill: 'var(--tint-blue)' },
    { label: 'Earned', body: 'Jobs earn stars. Stars buy minutes.', fill: 'var(--terracotta-lt)' },
    { label: "Nobody's", body: 'Bedtime, meals, school. Not for sale.', fill: 'var(--stage-3)' },
  ]
  return (
    <Stage>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {jars.map(j => (
          <div key={j.label} style={{ ...CARD, padding: '12px 10px 12px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 52, margin: '0 auto 8px', borderRadius: '8px 8px 14px 14px', background: j.fill, border: '2px solid var(--ink)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -8, left: 8, right: 8, height: 8, background: '#fff', border: '2px solid var(--ink)', borderRadius: 4 }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: INK }}>{j.label}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{j.body}</div>
          </div>
        ))}
      </div>
    </Stage>
  )
}

/** The child's app: the tabs, the balance, the five a day. */
export function MockKidApp({ kid }: { kid: string }) {
  const five = [
    { t: 'Tidy my room', done: true, s: 2 },
    { t: 'Lesson: the algorithm', done: true, s: 1 },
    { t: '20 minutes outside', done: false, s: 1 },
  ]
  return (
    <Stage tint="#3B3F47" pad={14}>
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, padding: 6, display: 'flex', gap: 4, marginBottom: 10 }}>
        {['Quests', 'Lessons', 'Printables'].map((t, i) => (
          <span key={t} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 12, background: i === 0 ? 'var(--terracotta)' : 'transparent', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: INK }}>{t}</span>
        ))}
      </div>
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 4px 0 var(--ink)', padding: '14px 16px', marginBottom: 10 }}>
        <div style={{ ...EYEBROW, marginBottom: 4 }}>{kid}'s balance</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)', color: INK, lineHeight: 1 }}>30</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink-soft)' }}>minutes ready · 6 ⭐</span>
        </div>
      </div>
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 4px 0 var(--ink)', padding: '12px 14px' }}>
        <div style={{ ...EYEBROW, marginBottom: 8 }}>Five a day</div>
        {five.map(f => (
          <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: '1.5px dotted var(--border)' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--ink)', background: f.done ? 'var(--retro-green)' : '#fff', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0 }}>{f.done ? '✓' : ''}</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: INK }}>{f.t}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: INK }}>⭐ {f.s}</span>
          </div>
        ))}
      </div>
    </Stage>
  )
}
