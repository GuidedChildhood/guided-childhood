'use client'

// Building DiGi. DiGi is the golden star, so the journey to 16 is drawn as the
// child assembling that very star, one arm per stage. Each stage is a cute gold
// triangle shard in DiGi's own style; earn the stage and the shard locks into
// place. The sparkles grow with every level, so the sparkle count is itself the
// progress, and when all five arms have joined, DiGi is whole and the face
// appears. The five arms and the core reuse the exact coordinates of
// DiGi-star.svg, so the finished star is pixel identical to DiGi everywhere
// else.

// The five arms of the star, top then clockwise, each a triangle from an outer
// point to its two neighbouring inner vertices. Order is the stage order, so
// arm 0 is Foundation and arm 4 is Independent.
const ARMS: { pts: string; tip: [number, number] }[] = [
  { pts: '200,62 162,165 238,165', tip: [200, 40] },   // top — stage 1
  { pts: '345,165 238,165 263,228', tip: [362, 150] }, // right — stage 2
  { pts: '293,338 263,228 200,272', tip: [312, 356] }, // lower right — stage 3
  { pts: '107,338 200,272 137,228', tip: [88, 356] },  // lower left — stage 4
  { pts: '55,165 137,228 162,165', tip: [38, 150] },   // left — stage 5
]

const CORE = '162,165 238,165 263,228 200,272 137,228'

// Fixed sparkle offsets from an arm's tip, used in order so a higher stage
// simply shows more of them. Deterministic, never random.
const SPARK_OFFSETS: { dx: number; dy: number; s: number }[] = [
  { dx: 0, dy: -2, s: 1 },
  { dx: 20, dy: 10, s: 0.7 },
  { dx: -20, dy: 12, s: 0.8 },
  { dx: 14, dy: -16, s: 0.6 },
  { dx: -16, dy: -14, s: 0.65 },
]

function Sparkle({ x, y, s, delay }: { x: number; y: number; s: number; delay: number }) {
  return (
    <path
      d="M0,-7 L2,-2 L7,0 L2,2 L0,7 L-2,2 L-7,0 L-2,-2 Z"
      fill="#FFF3C0"
      transform={`translate(${x} ${y}) scale(${s})`}
      style={{ transformOrigin: `${x}px ${y}px`, animation: `gcSparkle 1.8s ease-in-out ${delay}s infinite` }}
    />
  )
}

export default function DigiStarBuild({
  earned,
  currentIndex = null,
  size = 168,
}: {
  // How many stages are complete, 0 to 5. Arms 0..earned-1 are locked in.
  earned: number
  // The stage being worked on now (0 based), gently pulsing to show it is next.
  currentIndex?: number | null
  size?: number
}) {
  const done = Math.max(0, Math.min(5, earned))
  const complete = done >= 5

  return (
    <svg width={size} height={(size * 430) / 400} viewBox="0 0 400 430" role="img" aria-label={`DiGi's star, ${done} of 5 stages built`}>
      <defs>
        <radialGradient id="dsbBody" cx="44%" cy="36%" r="62%">
          <stop offset="0%" stopColor="#FFFEF4" />
          <stop offset="15%" stopColor="#FFF3C0" />
          <stop offset="55%" stopColor="#F5CD3A" />
          <stop offset="100%" stopColor="#D4A318" />
        </radialGradient>
      </defs>

      {/* The core pentagon: a faint ghost of the whole star, so the shape it is
          building towards is always visible. */}
      <polygon points={CORE} fill={complete ? 'url(#dsbBody)' : 'var(--cream)'} stroke="var(--border)" strokeWidth="2" strokeLinejoin="round" />

      {ARMS.map((arm, i) => {
        const isDone = i < done
        const isNext = i === currentIndex && !isDone
        const sparks = isDone ? i + 1 : 0 // more sparkles the higher the stage
        return (
          <g key={i}>
            <polygon
              points={arm.pts}
              fill={isDone ? 'url(#dsbBody)' : 'transparent'}
              stroke={isDone ? '#D4A318' : isNext ? 'var(--terracotta)' : 'var(--border)'}
              strokeWidth={isNext ? 4 : 3}
              strokeLinejoin="round"
              strokeDasharray={isDone ? undefined : isNext ? undefined : '5 5'}
              style={{
                transition: 'fill 0.5s ease, stroke 0.3s ease',
                transformOrigin: '200px 200px',
                animation: isDone ? `gcArmIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.08}s both` : isNext ? 'gcArmPulse 1.6s ease-in-out infinite' : undefined,
              }}
            />
            {Array.from({ length: sparks }).map((_, s) => {
              const off = SPARK_OFFSETS[s % SPARK_OFFSETS.length]
              return <Sparkle key={s} x={arm.tip[0] + off.dx} y={arm.tip[1] + off.dy} s={off.s} delay={(i * 0.2 + s * 0.15) % 1.8} />
            })}
          </g>
        )
      })}

      {/* DiGi's face lands only when the star is whole. */}
      {complete && (
        <g style={{ animation: 'gcArmIn 0.5s ease 0.5s both' }}>
          <path d="M 163 207 Q 173 199 183 207" stroke="#6B4500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 217 207 Q 227 199 237 207" stroke="#6B4500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="173" cy="226" r="12.5" fill="#18120A" />
          <circle cx="168" cy="220" r="4" fill="white" />
          <circle cx="227" cy="226" r="12.5" fill="#18120A" />
          <circle cx="222" cy="220" r="4" fill="white" />
          <path d="M 183 248 Q 200 264 217 248" stroke="#6B4500" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      <style>{`
        @keyframes gcSparkle { 0%,100% { opacity: 0.35; transform: scale(0.8) } 50% { opacity: 1; transform: scale(1.15) } }
        @keyframes gcArmIn { 0% { opacity: 0; transform: scale(0.6) } 100% { opacity: 1; transform: scale(1) } }
        @keyframes gcArmPulse { 0%,100% { opacity: 0.55 } 50% { opacity: 1 } }
      `}</style>
    </svg>
  )
}
