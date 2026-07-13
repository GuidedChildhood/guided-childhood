import Link from 'next/link'
import { QUEST_GAMES } from '@/lib/quest-games/registry'

// The quest games gallery: our own built games a child completes to earn
// stars. A parent can open and play any of them here to see what they send.
// Sending to a child and paying the stars comes with the mission flow.

export default function QuestGamesIndex() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '4px' }}>Quest games</p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Games that earn their stars
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '15px', lineHeight: 1.55, marginBottom: '22px' }}>
        Short, age matched games a child plays to earn stars. Calm and finite, they teach something and end warmly. Tap any to play it yourself first.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
        {QUEST_GAMES.map(g => (
          <div key={g.key} style={{
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '18px',
            boxShadow: '0 6px 22px rgba(46,40,24,0.06)', display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '30px' }}>{g.emoji}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--terracotta-lt)', color: 'var(--terracotta-dark)', padding: '3px 9px', borderRadius: '100px' }}>
                {g.stage}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
              {'⭐'.repeat(g.stars)} {g.stars} stars
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.01em' }}>{g.title}</div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, flex: 1 }}>{g.blurb}</p>
            <Link href={`/dashboard/quests/play/${g.key}`} style={{
              alignSelf: 'flex-start', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
              background: 'var(--gold, #EDC35F)', color: 'var(--ink)', borderRadius: '13px', padding: '10px 20px',
              textDecoration: 'none', boxShadow: '0 4px 0 var(--gold-dark, #C99A28)',
            }}>Play</Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link href="/dashboard/quests" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'underline' }}>
          Back to quests
        </Link>
      </div>
    </div>
  )
}
