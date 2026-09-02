import { HappyPaper, Caption, WriteLine, Heart, INK, INK_MUTED } from './HappyPaper'

// My Helping Hand, ages 4 to 12 (stages 1 to 3).
//
// Connection is the protection. A child who knows five grown ups they can
// tell is safer than a child with every filter switched on, and this is the
// sheet that makes those five real: draw round your own hand, write one
// grown up on each finger, and on the palm finish the sentence about what
// you would do if something online felt odd. It goes on the wall so the
// names are there on the day they are needed.

const FINGERS = ['1', '2', '3', '4', '5']

export default function HelpingHandSheet({ childName, stars }: { childName: string; stars: number }) {
  return (
    <HappyPaper
      title="My helping hand"
      kicker={`${childName ? `${childName}'s` : 'My'} five grown ups · one on each finger`}
      stars={stars}
      deal="All five fingers filled in? Show your grown up."
    >
      <div style={{ display: 'flex', gap: 18, flex: '1 1 auto', minHeight: 0, alignItems: 'stretch' }}>
        {/* The hand, with a number on each finger */}
        <div style={{ position: 'relative', width: 330, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <svg viewBox="0 0 300 420" style={{ width: 330, height: 462 }} aria-hidden>
            <path
              d="M85 415 L85 300 C60 270 30 225 25 198 C22 182 40 176 52 189 C65 203 80 226 90 241 L90 112 C90 88 120 88 120 112 L120 205 L128 62 C130 38 160 38 160 62 L160 205 L168 84 C170 58 200 58 200 84 L200 214 L206 124 C208 102 236 102 236 124 L236 255 C236 305 230 345 215 415 Z"
              fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
            />
            {/* finger numbers */}
            {[[44, 200], [105, 128], [144, 78], [184, 100], [221, 140]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="14" fill="#fff" stroke={INK} strokeWidth="3" />
                <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="15" fill={INK}>{FINGERS[i]}</text>
              </g>
            ))}
            {/* a heart on the palm, to colour */}
            <path d="M150 335 S118 312 118 292 a16 16 0 0 1 32 -8 a16 16 0 0 1 32 8 c0 20 -32 43 -32 43 z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </svg>
        </div>

        {/* The five lines */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_MUTED }}>
            Grown ups I can always tell
          </div>
          {FINGERS.map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', border: `3px solid ${INK}`, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: INK, flexShrink: 0 }}>{n}</span>
              <WriteLine height={44} size={15} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <Heart size={30} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: INK, lineHeight: 1.35 }}>
              Draw round your own hand on the back if you like. Bigger hands, more room for names.
            </span>
          </div>
        </div>
      </div>

      {/* The palm sentence */}
      <div style={{ border: `3px solid ${INK}`, borderRadius: 18, padding: '12px 18px 14px', flexShrink: 0, marginTop: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: INK, lineHeight: 1.3 }}>
          If something online feels odd, wrong or scary, I stop, I do not reply, and I tell
        </div>
        <WriteLine height={40} size={16} />
      </div>

      <Caption size={15} top={8}>
        Telling is never telling tales. Nobody on this hand will be cross that you asked.
      </Caption>
    </HappyPaper>
  )
}
