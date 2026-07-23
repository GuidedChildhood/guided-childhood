'use client'

// A single Spark: one of DiGi's five star points as a cute standalone triangle
// character, in DiGi's own gold with a friendly face. The accent colour and the
// sparkle count set the stage apart. `outline` renders it as clean black line
// art on white for the colouring printables, empty and ready to colour.

const SPARK_OFFSETS = [
  { x: 70, y: 8 },
  { x: 116, y: 44 },
  { x: 24, y: 46 },
  { x: 104, y: 100 },
  { x: 30, y: 100 },
]

export default function ShardCharacter({
  accent = 'var(--terracotta)',
  sparkles = 1,
  size = 96,
  outline = false,
  idle = true,
}: {
  accent?: string
  sparkles?: number
  size?: number
  outline?: boolean
  idle?: boolean
}) {
  const body = outline ? 'none' : 'url(#shardBody)'
  const stroke = outline ? '#1A1A2E' : '#D4A318'
  const strokeW = outline ? 4 : 22
  const face = outline ? '#1A1A2E' : '#6B4500'
  const eyeFill = outline ? 'none' : '#18120A'
  const sparkFill = outline ? 'none' : accent
  const n = Math.max(0, Math.min(5, sparkles))

  return (
    <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="A DiGi Spark"
      style={idle && !outline ? { animation: 'gcShardBob 3s ease-in-out infinite' } : undefined}>
      <defs>
        <radialGradient id="shardBody" cx="44%" cy="34%" r="66%">
          <stop offset="0%" stopColor="#FFFEF4" />
          <stop offset="16%" stopColor="#FFF3C0" />
          <stop offset="55%" stopColor="#F5CD3A" />
          <stop offset="100%" stopColor="#D4A318" />
        </radialGradient>
      </defs>

      {/* The rounded triangle body */}
      <polygon
        points="70,26 116,108 24,108"
        fill={body} stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round"
      />

      {/* Face, sitting in the lower middle where the triangle is widest */}
      <path d="M 55 78 Q 62 72 69 78" stroke={face} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 75 78 Q 82 72 89 78" stroke={face} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="62" cy="88" r="6" fill={eyeFill} stroke={outline ? '#1A1A2E' : 'none'} strokeWidth={outline ? 2.5 : 0} />
      <circle cx="82" cy="88" r="6" fill={eyeFill} stroke={outline ? '#1A1A2E' : 'none'} strokeWidth={outline ? 2.5 : 0} />
      {!outline && <circle cx="60" cy="85.5" r="1.8" fill="#fff" />}
      {!outline && <circle cx="80" cy="85.5" r="1.8" fill="#fff" />}
      <path d="M 62 99 Q 72 108 82 99" stroke={face} strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Sparkles, more with each level */}
      {Array.from({ length: n }).map((_, i) => {
        const p = SPARK_OFFSETS[i % SPARK_OFFSETS.length]
        return (
          <path key={i}
            d="M0,-8 L2.2,-2.2 L8,0 L2.2,2.2 L0,8 L-2.2,2.2 L-8,0 L-2.2,-2.2 Z"
            fill={sparkFill} stroke={outline ? '#1A1A2E' : 'none'} strokeWidth={outline ? 2 : 0}
            transform={`translate(${p.x} ${p.y}) scale(${outline ? 0.9 : 1})`}
            style={outline ? undefined : { transformOrigin: `${p.x}px ${p.y}px`, animation: `gcShardSpark 1.9s ease-in-out ${(i * 0.2) % 1.9}s infinite` }}
          />
        )
      })}

      <style>{`
        @keyframes gcShardBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes gcShardSpark { 0%,100% { opacity: 0.4; transform: scale(0.8) } 50% { opacity: 1; transform: scale(1.15) } }
      `}</style>
    </svg>
  )
}
