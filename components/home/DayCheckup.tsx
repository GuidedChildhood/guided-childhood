import Link from 'next/link'
import { MiniRoad, StrandPills, type Strand } from '@/components/pathway/StageRoad'

// The check on the child, after the day's path is cleared.
//
// It used to be step one of DiGi's morning walk, which put it in the wrong
// place twice over. It came BEFORE the day's one thing, so a parent was asked
// to audit their child before they had been asked to do the two minute habit
// that the whole product runs on. And it arrived at the moment a parent has
// least appetite for a list of what is not right yet.
//
// Justin's call, and it is the right one: follow the path first, check on the
// child after. So this now sits with the other after the day checks, and the
// walk is greet, then today, then Home.
//
// ── Silent unless there is something to do ───────────────────────────────────
//
// A check up that appears every single day to say everything is fine is a
// check up nobody reads by week three, and then it is worthless on the day it
// finally matters. So it renders nothing at all when no strand is red and no
// lesson is waiting. Silence here means checked and fine, and it can only mean
// that because the card is genuinely capable of speaking up.
//
// ── Everything it raises, it links ───────────────────────────────────────────
//
// The rule for any DiGi check up from here. Naming a problem and leaving the
// parent to go and find the page that fixes it is a scoreboard, and this
// product does not do scoreboards. Every red strand carries the href that
// getLiteracyStatuses worked out for it, and the lessons line goes to the hub.

export default function DayCheckup({
  childName, stageNum, stageName, strands, lessonsLeft, lessonsTotal,
}: {
  childName: string | null
  stageNum: number
  stageName: string
  strands: Strand[]
  lessonsLeft: number
  lessonsTotal: number
}) {
  const reds = strands.filter(s => s.tone === 'red')
  // Nothing red and nothing waiting: say nothing at all.
  if (reds.length === 0 && lessonsLeft <= 0) return null

  const name = childName && childName !== 'Your child' ? childName : 'your child'

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: 22,
      padding: '20px 22px', marginBottom: 22, boxShadow: '0 3px 14px rgba(26,26,46,0.05)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--terracotta-dark)', marginBottom: 6,
      }}>
        Now check on {name}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22,
        color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.015em', marginBottom: 4,
      }}>
        Stage {stageNum} of 5, {stageName}
      </div>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '0 0 14px' }}>
        Today is done, so this is the wider look. {reds.length === 1 ? 'One thing' : `${reds.length} things`} worth a few minutes when you have them.
      </p>

      <div style={{ marginBottom: 14 }}>
        <MiniRoad currentStage={stageNum} showDigi={false} />
      </div>

      <StrandPills strands={strands} />

      {/* The lessons are the mechanism that moves the strands, so they sit
          under them rather than as a separate concern. */}
      {lessonsLeft > 0 && (
        <Link
          href="/dashboard/lessons"
          style={{
            display: 'flex', alignItems: 'center', gap: 13, marginTop: 14,
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: 16, padding: '14px 16px', textDecoration: 'none',
          }}
        >
          <span aria-hidden style={{ flexShrink: 0, fontSize: 24 }}>🎬</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
              Lessons that move this
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--ink)', lineHeight: 1.3, marginTop: 2 }}>
              {lessonsTotal - lessonsLeft} of {lessonsTotal} passed at {stageName}
            </span>
          </span>
          <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)' }}>Open →</span>
        </Link>
      )}
    </div>
  )
}
