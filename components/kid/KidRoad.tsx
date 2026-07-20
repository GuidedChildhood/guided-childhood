'use client'

import { StageDot, RoadPulseStyle, type StageDotState } from '@/components/pathway/StageRoad'
import { STAGES } from '@/lib/content/stages'
import { READINESS, KID_STAGE_DEALS } from '@/lib/content/readiness'
import { STAR_MINUTES } from '@/lib/quests/templates'
import { playKidSound } from '@/lib/sound/kidSounds'

// My road: the child's own view of the road to 16, one tap behind the Daily
// Three. The exact same visual grammar as the parent pathway road (the same
// StageDot circles, the same dotted trail, the passport stamps on the road)
// but spoken to the child: your stage is lit, your buddy stands on it, and
// your real numbers (lessons done, stars earned) are the proof you are moving.
// Read only and warm. Nothing here writes anywhere.

// Each stage in the child's own words. Short, plain, no dashes ever.
const KID_STAGE_LINES: Record<number, string> = {
  1: 'You learn to turn screens off calmly, like a pro.',
  2: 'You build your own healthy habits before any app builds them for you.',
  3: 'You find out how the feed really works and why it wants you to stay.',
  4: 'You look after your name online and always know who to tell.',
  5: 'You run your own digital life. That was the whole point.',
}

export default function KidRoad({
  stageId, childName, buddyName, buddyImg, buddyIsStar, lessonsDoneCount, starsBanked, onClose,
  dailyGuideMinutes = 0, usedTodayMinutes = 0, stageLessonsPassed = null, stageLessonsTotal = null, lessonsHref = null,
}: {
  stageId: number
  childName: string
  buddyName: string
  buddyImg: string
  buddyIsStar: boolean
  lessonsDoneCount: number
  starsBanked: number
  onClose: () => void
  // The stage deal numbers, big and obvious: the daily screen guide for this
  // age (the parent's own number when they set one), what is used today, and
  // the stage lesson passes that are the exact count the parent's progress
  // report uses. Nulls fall back to the plain proof chips, so the road never
  // breaks when a surface cannot supply them.
  dailyGuideMinutes?: number
  usedTodayMinutes?: number
  stageLessonsPassed?: number | null
  stageLessonsTotal?: number | null
  lessonsHref?: string | null
}) {
  const current = Math.min(5, Math.max(1, stageId))

  const buddyFace = (size: number) => (
    <span style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#FFF7E8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 0 rgba(26,26,46,0.18)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {buddyIsStar
        ? <img src={buddyImg} alt="" style={{ width: Math.round(size * 0.68), height: Math.round(size * 0.68) }} />
        : <img src={buddyImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />}
    </span>
  )

  return (
    <div
      onClick={() => { onClose(); playKidSound('tap') }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(26,26,46,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, maxHeight: '86vh', overflowY: 'auto', background: 'var(--cream)', borderRadius: '24px', padding: '22px 20px', boxShadow: '0 20px 50px -16px rgba(26,26,46,0.4)' }}>
        <RoadPulseStyle />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            🗺️ My road to 16
          </span>
          <button onClick={onClose} aria-label="Close" style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '16px', color: 'var(--ink-muted)', flexShrink: 0 }}>✕</button>
        </div>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          Five stages, one road. You are on stage {current}, and {buddyName} walks it with you.
        </p>

        <div>
          {STAGES.map((stage, i) => {
            const state: StageDotState = stage.id === current ? 'here' : stage.id < current ? 'behind' : 'ahead'
            const r = READINESS[i]
            const here = state === 'here'
            const behind = state === 'behind'
            const last = i === STAGES.length - 1
            const ages = stage.ageBand === '16+' ? '16 plus' : stage.ageBand.replace('-', ' to ')
            return (
              <div key={stage.id} style={{ display: 'flex', gap: 14 }}>
                {/* The rail: the same dot and dotted trail as the parent road */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                  {here && (
                    <div style={{ position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
                      {buddyFace(34)}
                    </div>
                  )}
                  <StageDot n={stage.id} state={state} size={52} />
                  {!last && (
                    <span aria-hidden style={{
                      flex: 1, minHeight: 28, width: 0, margin: '4px 0',
                      borderLeft: `4px dotted ${state !== 'ahead' ? 'var(--terracotta)' : 'var(--border)'}`,
                    }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, color: here ? 'var(--ink)' : 'var(--ink-soft)', letterSpacing: '-0.01em' }}>
                      {stage.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, color: 'var(--ink-muted)' }}>
                      ages {ages}
                    </span>
                    {here && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--terracotta)', color: 'var(--ink)', padding: '3px 9px', borderRadius: 100 }}>
                        You are here
                      </span>
                    )}
                  </div>

                  {/* The passport stamp this stage earns, same as the big road */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, background: here ? 'var(--terracotta-lt)' : 'var(--cream)', border: `1px solid ${here ? 'var(--terracotta)' : 'var(--border)'}`, borderRadius: 100, padding: '4px 12px' }}>
                    <span aria-hidden style={{ fontSize: 13 }}>🪪</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', color: here ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                      Stamp: {r.stamp}
                    </span>
                  </div>

                  {here ? (
                    <div style={{ marginTop: 10, background: '#fff', border: '1.5px solid var(--border)', borderLeft: '6px solid var(--terracotta)', borderRadius: 16, padding: '14px 14px 12px' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 10px' }}>
                        {KID_STAGE_LINES[stage.id]}
                      </p>

                      {/* My deal at this stage: the boundaries in the child's own
                          words, big numbers first. The same guide the timer uses,
                          so every surface tells one story. */}
                      {dailyGuideMinutes > 0 && (
                        <>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 7 }}>
                            My deal at this stage
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <span style={{ flex: 1, textAlign: 'center', background: 'var(--tint-sage)', borderRadius: 12, padding: '10px 6px' }}>
                              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.55rem', color: 'var(--ink)', lineHeight: 1 }}>{dailyGuideMinutes}</span>
                              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>screen min a day</span>
                            </span>
                            <span style={{ flex: 1, textAlign: 'center', background: 'var(--tint-blue, #E4ECF7)', borderRadius: 12, padding: '10px 6px' }}>
                              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.55rem', color: 'var(--ink)', lineHeight: 1 }}>{Math.max(0, Math.round(usedTodayMinutes))}</span>
                              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>used today</span>
                            </span>
                          </div>
                          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
                            Jobs pay for screens: 1 star is {STAR_MINUTES} minutes. Every screen counts, TV and consoles too, so the timer always goes on.
                          </p>
                        </>
                      )}

                      {/* Great for you now, and what comes later: the passport
                          in kid words, steps earned, never a ban. */}
                      {KID_STAGE_DEALS[stage.id] && (
                        <>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
                            Great for you now
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            {KID_STAGE_DEALS[stage.id].greatNow.map(g => (
                              <span key={g.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 100, padding: '5px 10px' }}>
                                <span aria-hidden style={{ fontSize: 12 }}>{g.emoji}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11.5, color: 'var(--ink)' }}>{g.label}</span>
                              </span>
                            ))}
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                            🪪 {KID_STAGE_DEALS[stage.id].later}
                          </p>
                        </>
                      )}

                      {/* The proof: this child's real numbers, not a promise. The
                          lessons figure is the same count the grown up's progress
                          report uses, so a pass lights up both sides at once. */}
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 7 }}>
                        Your proof so far
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <span style={{ flex: 1, textAlign: 'center', background: 'var(--tint-blue, #E4ECF7)', borderRadius: 12, padding: '9px 6px' }}>
                          {stageLessonsTotal != null && stageLessonsTotal > 0 ? (
                            <>
                              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1 }}>{stageLessonsPassed ?? 0} of {stageLessonsTotal}</span>
                              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>stage lessons passed</span>
                            </>
                          ) : (
                            <>
                              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1 }}>{lessonsDoneCount}</span>
                              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>lessons done</span>
                            </>
                          )}
                        </span>
                        <span style={{ flex: 1, textAlign: 'center', background: 'var(--terracotta-lt)', borderRadius: 12, padding: '9px 6px' }}>
                          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1 }}>{starsBanked}</span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>stars earned</span>
                        </span>
                      </div>
                      {lessonsHref && stageLessonsTotal != null && (stageLessonsPassed ?? 0) < stageLessonsTotal && (
                        <a href={lessonsHref} style={{ display: 'block', textAlign: 'center', marginTop: 9, background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 12, padding: '10px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
                          Pass the next lesson ▶
                        </a>
                      )}
                    </div>
                  ) : (
                    <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '7px 0 0' }}>
                      {behind ? 'You walked this bit already. You can visit it any time.' : KID_STAGE_LINES[stage.id]}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '16px 2px 14px', textAlign: 'center' }}>
          Every lesson, job and stamp moves you along, {childName}. No rush. The road waits for you.
        </p>

        <button onClick={onClose} style={{ width: '100%', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px', padding: '14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
          Back to today
        </button>
      </div>
    </div>
  )
}
