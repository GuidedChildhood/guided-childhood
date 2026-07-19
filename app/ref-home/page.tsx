/* eslint-disable @next/next/no-img-element */
// THROWAWAY example for Justin to approve BEFORE the real homepage changes.
// The proposal: the marketing page tells the same one road story as the app,
// the road from 4 to 16 with the passport stamps on it, the real illustrated
// moments, the parent held too, and 16 as a ramp. Nothing here ships as is.

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'
const TILES = [
  { img: 'hf_20260718_154040_b03ac5de-cdbd-4933-afdc-a9889edbcd97.png', label: 'Big tantrums and meltdowns' },
  { img: 'hf_20260712_195232_a89d2990-1ae2-4faf-9f25-24a6ce8ac899.png', label: 'Cannot come off the game' },
  { img: 'hf_20260719_000905_771cbb77-4119-4d9b-a672-25e8c1d1988c.png', label: 'Saw something upsetting online' },
  { img: 'hf_20260719_000912_1c4ed3f1-0bd9-4dce-984f-c96a0e327d63.png', label: 'Worry and anxiety' },
  { img: 'hf_20260712_195628_1bbd76a4-02cd-4793-bbdd-c7ee4c609ac4.png', label: 'Bedtime stalling' },
  { img: 'hf_20260719_000848_9ee5c6a3-c6d6-4c3b-afc8-81dfabc26e44.png', label: 'Only wants the same few foods' },
]

const STAGES = [
  { n: 1, name: 'Foundation', ages: '4 to 7', stamp: 'Steady stops', line: 'Screens go off calmly, so the off switch is never a battle.' },
  { n: 2, name: 'Builder', ages: '8 to 10', stamp: 'Healthy habits', line: 'The habits get set before an app tries to set them first.' },
  { n: 3, name: 'Explorer', ages: '11 to 13', stamp: 'How it works', line: 'They learn how the feed and the algorithm are built to hold them.' },
  { n: 4, name: 'Shaper', ages: '13 to 15', stamp: 'Real footprint', line: 'Reputation, judgement, and a footprint they would be proud of.' },
  { n: 5, name: 'Independent', ages: '16', stamp: 'Ready', line: 'Social media with their eyes open. The ramp, not the cliff.' },
]

export default function RefHome() {
  return (
    <div style={{ background: '#FFFBEE' }}>

      {/* ── THE ROAD: the service IS the pathway, same road as inside the app ── */}
      <section style={{ padding: '88px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', textAlign: 'center', margin: '0 0 14px' }}>
          The pathway
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.06, color: 'var(--ink)', textAlign: 'center', margin: '0 0 16px' }}>
          One road, from 4 to 16.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 620, margin: '0 auto 56px', textAlign: 'center' }}>
          A digital passport, stamped one stage at a time. Safe online, digitally literate, using technology well, and social media ready at the right age. Built a little each day, so 16 arrives as a gentle ramp, never a cliff edge.
        </p>

        {/* The road itself: the same circles, dotted trail and stamps the
            parent then meets inside the app. Site and app, one language. */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div aria-hidden style={{ position: 'absolute', left: '9%', right: '9%', top: 29, borderTop: '4px dotted var(--terracotta)' }} />
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            {STAGES.map((s, i) => (
              <div key={s.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{
                  width: 60, height: 60, borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22,
                  background: i === 4 ? 'var(--terracotta)' : '#fff',
                  border: '3px solid var(--terracotta)',
                  color: i === 4 ? 'var(--ink)' : 'var(--terracotta-dark)',
                  boxShadow: '0 5px 0 var(--terracotta-dark)', position: 'relative', zIndex: 1,
                }}>
                  {i === 4 ? '🎓' : s.n}
                </span>
                <div style={{ marginTop: 14, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--ink)' }}>{s.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-muted)', marginTop: 2 }}>Ages {s.ages}</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)', borderRadius: 100, padding: '5px 12px' }}>
                  <span aria-hidden style={{ fontSize: 12 }}>🪪</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--terracotta-dark)' }}>{s.stamp}</span>
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '10px 0 0', maxWidth: 180 }}>{s.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVERY MOMENT: the real illustrated tiles, the battles named ── */}
      <section style={{ background: 'var(--deep-teal)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)', textAlign: 'center', margin: '0 0 14px' }}>
            Every moment, covered
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', letterSpacing: '-0.03em', lineHeight: 1.08, color: '#fff', textAlign: 'center', margin: '0 0 16px' }}>
            The battles you are actually in,<br />with the words that work.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 48px', textAlign: 'center' }}>
            The meltdown at switch off. The game they cannot leave. The thing they saw that they should not have. 160 scripts and moment cards, grounded in the research, one tap away when it is happening.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {TILES.map(t => (
              <div key={t.label} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.22)' }}>
                <div aria-hidden style={{ width: '100%', aspectRatio: '1', background: `var(--terracotta-lt) center/cover no-repeat url(${CDN + t.img})` }} />
                <div style={{ padding: '10px 12px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.3 }}>
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PARENT HELD TOO ── */}
      <section style={{ padding: '84px 32px', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 14px' }}>
          For you, not just them
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', letterSpacing: '-0.03em', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 18px' }}>
          You are not doing this wrong,<br />and you are not doing it alone.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 28px' }}>
          DiGi remembers your week, checks in on a Sunday, and hands you the plan for the next one. The midnight battles stop being yours to carry by yourself, and a calmer parent is half the outcome.
        </p>
        <span style={{ display: 'inline-flex', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 16, padding: '16px 34px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Start the pathway free
        </span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-muted)', marginTop: 14 }}>
          Free access, no card needed · First 50 families, 7.99 a month for life
        </p>
      </section>
    </div>
  )
}
