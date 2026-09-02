import { HappyPaper, Caption, TickCircle, Phone, INK, INK_MUTED, CRAYON, useExample } from './HappyPaper'

// Ready For My Phone, ages 10 to 15 (stages 3 and 4).
//
// The whole product in one sentence is getting a child to sixteen ready for
// a phone, and this is that sentence on paper: ten things that are true
// before the phone, coloured in one at a time when a grown up agrees each
// is true. No test, no date, no rush. It is the ladder to self regulation
// drawn as a road, and the phone at the top is the destination the family
// walks to together rather than a prize dropped from the sky.

const STOPS = [
  'I put it down when someone talks to me.',
  'I know my phone goes to bed before I do.',
  'I can spend my stars a bit at a time, not all at once.',
  'I know exactly who I would tell if something felt wrong.',
  'I can make a strong password and keep it to myself.',
  'I know a stranger online is still a stranger.',
  'I have done a whole week of my five a day.',
  'I can leave it in another room and not mind.',
  'I have shown a grown up how I would ask for help.',
  'We have signed our screen time deal, both of us.',
]
/** How far along the road the filled in example has got. */
const SAMPLE_DONE = 4
const STOP_CRAYONS = [CRAYON.butter, CRAYON.sky, CRAYON.coral, CRAYON.green]

export default function ReadyForMyPhoneSheet({ childName, stars }: { childName: string; stars: number }) {
  const ex = useExample()
  return (
    <HappyPaper
      title="Ready for my phone"
      kicker={`${childName ? `${childName}'s road` : 'My road'} · colour a stop when a grown up agrees it is true`}
      stars={stars}
      deal="All ten coloured? Sit down together and talk about what comes next."
    >
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* The road: a dashed line down the middle the stops hang off */}
        <div aria-hidden style={{ position: 'absolute', left: '50%', top: 30, bottom: 10, borderLeft: `4px dashed ${INK}`, transform: 'translateX(-2px)', opacity: 0.35 }} />

        {/* The destination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, position: 'relative', flexShrink: 0 }}>
          <div style={{ background: ex ? CRAYON.paper : '#fff', border: `3px solid ${INK}`, borderRadius: 16, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Phone size={64} face="happy" />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_MUTED }}>The last stop</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: INK, lineHeight: 1.1 }}>My own phone</div>
            </div>
          </div>
        </div>

        {/* The ten stops, zigzagging down the road */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', flex: 1, justifyContent: 'space-evenly', padding: '6px 0' }}>
          {[...STOPS].reverse().map((s, idx) => {
            const n = STOPS.length - idx
            const left = n % 2 === 1
            const done = ex && n <= SAMPLE_DONE
            return (
              <div key={n} style={{ display: 'flex', justifyContent: left ? 'flex-start' : 'flex-end' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '52%',
                  flexDirection: left ? 'row-reverse' : 'row',
                  background: done ? STOP_CRAYONS[(n - 1) % STOP_CRAYONS.length] : '#fff', border: `2.5px solid ${INK}`, borderRadius: 14, padding: '7px 10px',
                }}>
                  <TickCircle size={30} sample={n <= SAMPLE_DONE} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, flexDirection: left ? 'row-reverse' : 'row' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, lineHeight: 1.25, color: INK, textAlign: left ? 'right' : 'left', flex: 1 }}>{s}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: done ? INK : INK_MUTED, flexShrink: 0 }}>{n}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Start */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
          <span style={{ background: ex ? CRAYON.butter : '#fff', border: `3px solid ${INK}`, borderRadius: 100, padding: '5px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: INK }}>START HERE</span>
        </div>
      </div>

      <Caption size={14} top={8}>
        Ten things that are true before the phone. There is no rush and no test, just the road.
      </Caption>
    </HappyPaper>
  )
}
