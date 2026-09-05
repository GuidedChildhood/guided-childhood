import { HappyPaper, Caption, TickCircle, INK, INK_MUTED, RULE, DEEP, CRAYON, useExample } from './HappyPaper'
import type { CodeMode } from '@/lib/planet/logic'
import { PICTURE_ART } from '@/lib/planet/missions'

// The paper twin of a Planet Friends mission (design 3.2, slice 2b).
//
// Every mission on the child's planet is also one side of A4: the three steps
// as big pictures a child who cannot read can follow, a circle to colour in
// when it is done, the reward named and drawn, and the grown up's prompt at
// the foot. A family with no phone in the child's hand at all can run the
// whole engine from paper and the parent's yes on their own board.
//
// The Moonflower card is the same sheet with a cut out card on it: the code
// the server made for this child, as pictures or letters. The code is on the
// parent's print only. The child's own copy of the sheet says the card is
// printed by a grown up, and never carries the code.

export type MissionSheetSpec = {
  key: string
  title: string
  emoji: string
  steps: string[]
  stepArt: string[]
  rewardLabel: string
  /** The grown up's line: the scripts row when the page could read it, the catalogue's line otherwise. */
  prompt: string
  /** The script's address, printed small so the parent can find the rest. */
  scriptOrder?: number
  /** A card mission. */
  perChild?: boolean
  /** The code made for this child, when the parent is printing the card. */
  card?: { code: string[]; mode: CodeMode } | null
}

const SAMPLE_CARD = { code: ['star', 'moon', 'rocket'], mode: 'pictures' as const }

export default function MissionSheet({ childName, mission }: { childName: string; mission: MissionSheetSpec | null }) {
  const ex = useExample()
  if (!mission) {
    return (
      <HappyPaper title="A mission" stars={0} deal="Missions pay on the planet, never in stars.">
        <Caption>This sheet needs a mission. Open it from the printables page.</Caption>
      </HappyPaper>
    )
  }
  const card = mission.perChild ? (mission.card ?? (ex ? SAMPLE_CARD : null)) : null
  const who = childName ? `${childName}'s` : 'A'
  return (
    <HappyPaper
      title={mission.title}
      kicker={`${who} Planet Friends mission · do it together · colour the circle when it is done`}
      stars={0}
      deal={`When it is done, ${mission.rewardLabel.toLowerCase()} lands on the planet. Missions pay on the planet, never in stars.`}
    >
      {/* The three steps, as pictures first and words second. */}
      <ol style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        {mission.steps.slice(0, 3).map((step, i) => (
          <li key={step} style={{ display: 'flex', alignItems: 'center', gap: 16, border: `3px solid ${INK}`, borderRadius: 18, padding: '10px 16px', background: ex ? [CRAYON.paper, '#fff', CRAYON.paper][i] : '#fff' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, border: `3px solid ${INK}`, background: ex ? CRAYON.butter : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: INK }}>
              {i + 1}
            </span>
            <span aria-hidden style={{ fontSize: 50, lineHeight: 1, flexShrink: 0, width: 66, textAlign: 'center' }}>{mission.stepArt[i] ?? mission.emoji}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: INK }}>{step}</span>
          </li>
        ))}
      </ol>

      {/* The Moonflower card: cut it out, hide it, the code is the child's own. */}
      {mission.perChild && (
        <div style={{ margin: '14px 0 0', border: `3px dashed ${INK}`, borderRadius: 22, padding: '14px 18px 16px', position: 'relative', background: ex ? CRAYON.paper : '#fff', flexShrink: 0 }}>
          <span aria-hidden style={{ position: 'absolute', top: -16, left: 22, background: '#fff', padding: '0 6px', fontSize: 22 }}>✂️</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_MUTED }}>The Moonflower card · cut me out · hide me</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: INK, marginTop: 4 }}>
                {card ? (card.mode === 'pictures' ? 'Tap these, in this order' : 'Tap these letters') : 'A grown up prints this card'}
              </div>
              {!card && (
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: INK, marginTop: 6, lineHeight: 1.35 }}>
                  The code on it is made just for you, on your grown up&apos;s own app. Ask them to print it and hide it.
                </div>
              )}
            </div>
            {card && (
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                {card.code.map((t, i) => (
                  <span key={`${t}-${i}`} style={{ width: card.mode === 'pictures' ? 84 : 66, height: 84, borderRadius: 20, border: `3px solid ${INK}`, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: card.mode === 'pictures' ? 48 : 44, fontFamily: 'var(--font-display)', fontWeight: 900, color: INK }}>
                    {card.mode === 'pictures' ? PICTURE_ART[t] ?? t : t.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Done, and what lands. */}
      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', alignItems: 'center', gap: 22, padding: '14px 8px 0' }}>
        <TickCircle size={78} sample />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, lineHeight: 1.15, color: INK }}>Colour me in when you did it.</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, lineHeight: 1.35, color: INK, marginTop: 4 }}>
            Then tap <span style={{ fontWeight: 900 }}>We did it</span> on your planet, and {mission.rewardLabel.toLowerCase()} lands there. {mission.emoji}
          </div>
        </div>
      </div>

      {/* For the grown up: the one thing to talk about, from the scripts table. */}
      <div style={{ borderTop: `2px solid ${RULE}`, paddingTop: 10, marginTop: 6, flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: DEEP }}>For your grown up</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, lineHeight: 1.35, color: INK, marginTop: 4 }}>{mission.prompt}</div>
        {mission.scriptOrder ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: INK_MUTED, marginTop: 4 }}>The rest of this one: guidedchildhood.com/dashboard/scripts/{mission.scriptOrder}</div>
        ) : null}
      </div>
    </HappyPaper>
  )
}
