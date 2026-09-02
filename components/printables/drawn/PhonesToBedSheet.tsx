import { HappyPaper, Caption, WriteLine, Moon, Star, INK, CRAYON, useExample } from './HappyPaper'

// Phones Go To Bed, every age (stages 1 to 5).
//
// Protected time on paper. Bedtime is the window nobody's stars can buy, and
// the product's own rule is that it holds for grown ups too (modelling over
// monitoring). So this is a poster for the charging spot: three phones tucked
// into a drawn bed, the family writes the bedtime and the wake up time, and
// the sheet goes up where the chargers live. When printed from the child's
// app the bedtime the family already set is written on the line.

export type Bedtime = { start: string; end: string } | null

export default function PhonesToBedSheet({ childName, stars, bedtime = null }: {
  childName: string
  stars: number
  bedtime?: Bedtime
}) {
  const ex = useExample()
  const paper = ex ? CRAYON.paper : '#fff'
  return (
    <HappyPaper
      title="Phones go to bed"
      kicker={`${childName ? `${childName}'s house` : 'Our house'} · colour it, fill it in, stick it by the chargers`}
      stars={stars}
      deal="Stick this where the chargers live."
    >
      {/* Night sky, theirs to colour */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 30px', height: 78, flexShrink: 0 }}>
        <Star size={34} />
        <Star size={22} tint="sky" />
        <Moon size={76} />
        <Star size={26} tint="coral" />
        <Star size={38} />
      </div>

      {/* The bed */}
      <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: 6 }}>
        <svg viewBox="0 0 700 330" style={{ width: 704, height: 332 }} aria-hidden>
          {/* headboard */}
          <path d="M60 210 V70 Q60 30 100 30 H600 Q640 30 640 70 V210" fill={ex ? CRAYON.coral : '#fff'} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
          <path d="M100 70 H600 M100 110 H600" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          {/* pillow */}
          <rect x="110" y="128" width="200" height="58" rx="26" fill={paper} stroke={INK} strokeWidth="6" />
          {/* mattress */}
          <rect x="40" y="188" width="620" height="70" rx="18" fill={paper} stroke={INK} strokeWidth="7" />
          {/* blanket with a wavy edge, over the mattress */}
          <path d="M60 205 H640 V250 Q625 262 610 250 Q595 238 580 250 Q565 262 550 250 Q535 238 520 250 Q505 262 490 250 Q475 238 460 250 Q445 262 430 250 Q415 238 400 250 Q385 262 370 250 Q355 238 340 250 Q325 262 310 250 Q295 238 280 250 Q265 262 250 250 Q235 238 220 250 Q205 262 190 250 Q175 238 160 250 Q145 262 130 250 Q115 238 100 250 Q85 262 70 250 Q62 245 60 250 Z" fill={ex ? CRAYON.sky : '#fff'} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          {/* three phones tucked in, sleepy faces peeking over the blanket */}
          {[380, 460, 540].map((x, i) => (
            <g key={x}>
              <rect x={x} y={140 - i * 6} width="52" height="90" rx="10" fill={ex ? [CRAYON.green, CRAYON.butter, CRAYON.coral][i] : '#fff'} stroke={INK} strokeWidth="5" />
              <rect x={x + 8} y={150 - i * 6} width="36" height="46" rx="4" fill={paper} stroke={INK} strokeWidth="3" />
              <path d={`M${x + 14} ${168 - i * 6} q5 -4 10 0 M${x + 28} ${168 - i * 6} q5 -4 10 0`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
              <path d={`M${x + 20} ${182 - i * 6} q6 4 12 0`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
          <text x="600" y="128" fontFamily="var(--font-display)" fontWeight="900" fontSize="26" fill={INK}>z</text>
          <text x="618" y="108" fontFamily="var(--font-display)" fontWeight="900" fontSize="32" fill={INK}>z</text>
          <text x="640" y="84" fontFamily="var(--font-display)" fontWeight="900" fontSize="38" fill={INK}>Z</text>
          {/* legs */}
          <path d="M70 258 V300 M630 258 V300" stroke={INK} strokeWidth="7" strokeLinecap="round" />
          {/* a mat with a smiley, to colour */}
          <ellipse cx="350" cy="308" rx="120" ry="14" fill={ex ? CRAYON.green : '#fff'} stroke={INK} strokeWidth="4" />
        </svg>
      </div>

      {/* The words to fill in */}
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <WriteLine label="In our house, phones go to bed at" width="60%" height={40} size={18} value={bedtime?.start} sample="8 o'clock" />
          <WriteLine label="and wake up at" height={40} size={18} value={bedtime?.end} sample="7 o'clock" />
        </div>
        <WriteLine label="They sleep here:" height={40} size={18} sample="The kitchen drawer, all of them" />
        <WriteLine label="And so do the grown ups' phones, signed:" height={40} size={18} sample="Mum and Dad" />
      </div>

      <Caption size={16} top={4}>
        Bedtime is protected time. No stars can buy it, and that goes for grown ups too.
      </Caption>
    </HappyPaper>
  )
}
