'use client'

// Film time: the booked Watch together film leading the child's page
// (migration 400). The server only sends this card from the booked time until
// the end of that day, and only while it is unwatched, so the child never sees
// a countdown (Justin's answer 2, 16 November 2026). Fixed words: a booking is
// not a way to send a child a message.

export type WatchTime = {
  code: string
  title: string
  posterUrl: string | null
}

export default function WatchTimeCard({ token, watch, grownUp }: { token: string; watch: WatchTime; grownUp: string }) {
  return (
    <a
      href={`/k/${token}/adventures/${watch.code}`}
      style={{
        display: 'block', width: '100%', textDecoration: 'none', marginBottom: '16px',
        background: 'var(--white)', borderRadius: 'var(--radius-card)', overflow: 'hidden',
        boxShadow: '0 5px 0 var(--gold-dark)', border: '3px solid var(--gold)',
      }}
    >
      {watch.posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={watch.posterUrl} alt="" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} />
      )}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '4px' }}>
          Film time 🍿
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.15, marginBottom: '4px' }}>
          {watch.title}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink-soft)', marginBottom: '12px' }}>
          Watch it with {grownUp}
        </div>
        <span className="btn btn-gold" style={{ display: 'flex', justifyContent: 'center', minHeight: '52px', fontSize: 'var(--text-lg)' }}>
          ▶ Play
        </span>
      </div>
    </a>
  )
}
