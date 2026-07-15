'use client'

// A warm animated scene for the bare and the celebratory moments on the child
// app: an empty quest list, a finished day. Instead of a line of plain text
// the screen gets a friendly floating star, a soft rainbow, a drift of
// confetti and a cheerful line, so a quiet screen still feels good.
//
// It keeps the animations Justin likes. If a richer illustration is dropped in
// at `image` (a warm storybook png in public/happy), it shows that with the
// same gentle float instead of the built in star, so the art can grow without
// touching any call site.

const CONFETTI = ['#F6C244', '#E5734B', '#2E7D5A', '#7C5CBF', '#4B9CE5']

export default function HappyScene({
  headline, sub, image, tone = 'onDark',
}: {
  headline: string
  sub?: string
  image?: string
  tone?: 'onDark' | 'onLight'
}) {
  const titleColor = tone === 'onDark' ? '#fff' : 'var(--ink)'
  const subColor = tone === 'onDark' ? 'rgba(255,255,255,0.85)' : 'var(--ink-soft)'

  return (
    <div style={{ textAlign: 'center', padding: '10px 8px' }}>
      <style>{`
        @keyframes gcSceneFloat { 0%,100% { transform: translateY(0) rotate(-3deg) } 50% { transform: translateY(-12px) rotate(3deg) } }
        @keyframes gcSceneTwinkle { 0%,100% { transform: scale(1); opacity: 0.85 } 50% { transform: scale(1.35); opacity: 1 } }
        @keyframes gcSceneDrift { 0% { transform: translateY(-6px); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(60px) translateX(var(--drift)); opacity: 0 } }
      `}</style>

      <div style={{ position: 'relative', height: image ? 168 : 140, marginBottom: '6px' }}>
        {/* Soft rainbow arc behind the friend */}
        <svg viewBox="0 0 200 100" style={{ position: 'absolute', left: '50%', top: '18px', width: 200, transform: 'translateX(-50%)', opacity: 0.55 }} aria-hidden>
          {['#E5734B', '#F6C244', '#2E7D5A', '#4B9CE5'].map((c, i) => (
            <path key={c} d={`M ${20 + i * 9} 100 A ${80 - i * 9} ${80 - i * 9} 0 0 1 ${180 - i * 9} 100`} fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
          ))}
        </svg>

        {/* Twinkling stars */}
        {[[24, 30], [168, 22], [40, 74], [156, 70]].map(([x, y], i) => (
          <span key={i} style={{ position: 'absolute', left: x, top: y, fontSize: '15px', animation: `gcSceneTwinkle ${1.4 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }} aria-hidden>⭐</span>
        ))}

        {/* Drifting confetti */}
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={`c${i}`} style={{
            position: 'absolute', left: `${18 + i * 9}%`, top: '8px',
            width: 8, height: 8, borderRadius: i % 2 ? '100px' : '2px',
            background: CONFETTI[i % CONFETTI.length],
            // @ts-expect-error custom prop for the keyframe
            '--drift': `${(i % 2 ? 1 : -1) * (10 + i * 4)}px`,
            animation: `gcSceneDrift ${2.2 + (i % 3) * 0.5}s ease-in ${i * 0.25}s infinite`,
          }} aria-hidden />
        ))}

        {/* The friend: a dropped in illustration if present, otherwise the star */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', animation: 'gcSceneFloat 3.2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image ?? '/digi-squad/DiGi-star.svg'}
            alt=""
            style={{ width: image ? 220 : 96, height: image ? 'auto' : 96, maxWidth: '78vw', objectFit: 'contain', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.22))' }}
          />
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: titleColor, margin: '0 0 4px' }}>
        {headline}
      </p>
      {sub && (
        <p style={{ fontSize: '15px', color: subColor, lineHeight: 1.5, margin: 0, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
          {sub}
        </p>
      )}
    </div>
  )
}
