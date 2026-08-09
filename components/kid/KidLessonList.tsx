import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import { resolveTheme, type KidTheme } from '@/lib/kid/theme'

// My lessons, the child's own list: the age right stage lessons from the
// family library, on whatever colour the child picked in Make it mine. Presentational only, so the real
// token page and the dev fixture render the exact same thing. Passing a
// lesson here writes the same pass the parent side shows as a tick, so the
// child's work and the sofa lesson land in the same place.

export type KidLessonItem = {
  id: string
  title: string
  emoji: string
  keyMessage: string
  done: boolean
  score: number | null
  locked: boolean
}

export default function KidLessonList({
  backHref, childName, stageName, ages, items, hrefFor, checkHref, checkPassed, theme,
}: {
  backHref: string
  childName: string
  stageName: string
  ages: string
  items: KidLessonItem[]
  hrefFor: (id: string) => string
  // The big end of stage check. Absent when there is no link to send them to.
  checkHref?: string | null
  checkPassed?: boolean
  // The child's chosen colour. Optional so the dev fixture still renders, and
  // the fallback is the same anthracite this was hardcoded to before.
  theme?: KidTheme
}) {
  const doneCount = items.filter(i => i.done).length
  const t = theme ?? resolveTheme(null)
  return (
    <div style={{ minHeight: '100dvh', background: t.bg, padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '10px' }}>
          <Link href={backHref} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: t.inkSoft, textDecoration: 'none',
          }}>
            ← My quests
          </Link>
          {items.length > 0 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)',
              borderRadius: '100px', padding: '5px 12px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
            }}>
              {doneCount} of {items.length} passed
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <DigiCharacter mood="wave" size={56} once />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              My lessons
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.inkMuted, margin: '5px 0 0' }}>
              {stageName} stage · {ages}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-base)', color: t.inkSoft, lineHeight: 1.6, margin: '10px 0 20px' }}>
          Picked for your age, {childName}. Do them in order, top to bottom, one a week is perfect. Pass one and your grown up sees the tick straight away.
        </p>

        {items.length === 0 ? (
          <div style={{ background: t.panel, border: `1.5px solid ${t.panelBorder}`, borderRadius: '20px', padding: '26px 20px', textAlign: 'center', color: t.inkSoft, fontSize: 'var(--text-md)', lineHeight: 1.6 }}>
            No lessons for your stage just yet. New ones land all the time, so check back soon.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item, idx) => {
              // The one obvious next thing: the first lesson not yet passed and
              // not locked gets the big Next up treatment, everything else waits
              // its numbered turn.
              const isNext = !item.done && !item.locked && items.findIndex(i => !i.done && !i.locked) === idx
              const inner = (
                <>
                  <span style={{ position: 'relative', flexShrink: 0 }}>
                    <span style={{
                      width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                      background: item.done ? 'var(--terracotta-lt)' : 'var(--stage-2)',
                      border: item.done ? '2px solid var(--terracotta)' : '1.5px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)',
                    }}>
                      {item.emoji}
                    </span>
                    <span style={{
                      position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px',
                      borderRadius: '50%', background: item.done ? 'var(--terracotta)' : 'var(--ink)',
                      color: item.done ? 'var(--ink)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
                      border: '2px solid var(--cream)',
                    }}>
                      {idx + 1}
                    </span>
                  </span>
                  {/* The words get the whole width. This was a third column
                      holding the chip or the Go button, and at the child
                      app's big text scale it starved the title into one word
                      a line with a field of empty card beside it (Justin's
                      screenshot, 8 August: "looks untidy text"). The chip,
                      the padlock and Go now sit UNDER the words, where they
                      cost the sentence nothing at any scale. */}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {isNext && (
                      <span style={{
                        display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)',
                        background: 'var(--terracotta)', borderRadius: '100px', padding: '3px 9px', marginBottom: '5px',
                      }}>
                        ⭐ Do this one next
                      </span>
                    )}
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                      {item.title}{item.locked ? ' 🔒' : ''}
                    </span>
                    <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '4px' }}>
                      {item.locked ? 'Ask your grown up to open this one' : isNext ? item.keyMessage : item.done ? item.keyMessage : `After lesson ${idx}, this one is waiting for you`}
                    </span>
                    {item.done ? (
                      <span style={{
                        display: 'inline-block', marginTop: '8px',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em',
                        textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                        background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                        borderRadius: '100px', padding: '4px 10px',
                      }}>
                        ✓ Passed{item.score != null ? ` · ${item.score}` : ''}
                      </span>
                    ) : !item.locked ? (
                      <span style={{
                        display: 'inline-block', marginTop: '10px',
                        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
                        color: 'var(--ink)', background: isNext ? 'var(--terracotta)' : '#fff',
                        border: isNext ? 'none' : '1.5px solid var(--border)',
                        borderRadius: '12px', padding: '9px 15px',
                        boxShadow: isNext ? '0 4px 0 var(--terracotta-dark)' : 'none',
                      }}>
                        Go ▶
                      </span>
                    ) : null}
                  </span>
                </>
              )
              const shell: React.CSSProperties = {
                display: 'flex', gap: '13px', alignItems: 'flex-start', textDecoration: 'none',
                background: 'var(--cream)', borderRadius: '20px', padding: '15px 16px',
                boxShadow: isNext ? '0 5px 0 var(--terracotta-dark), 0 0 0 3px var(--terracotta)' : '0 5px 0 rgba(0,0,0,0.22)',
                opacity: item.locked ? 0.75 : 1,
              }
              return item.locked
                ? <div key={item.id} style={shell}>{inner}</div>
                : <Link key={item.id} href={hrefFor(item.id)} style={shell}>{inner}</Link>
            })}
          </div>
        )}

        {/* The big check, at the END of the stage rather than after each lesson.
            It asks the questions these lessons already asked, so it only makes
            sense once they are all passed, and it stays visible but shut until
            then so the child can see what they are working towards. */}
        {checkHref && items.length > 0 && (() => {
          const left = items.filter(i => !i.done).length
          const ready = left === 0
          const body = checkPassed
            ? 'You passed it. Your stamp is on the passport.'
            : ready
            ? `All ${items.length} passed, ${childName}. Five questions from the lessons you have done, and the stamp is yours.`
            : `Pass your last ${left} ${left === 1 ? 'lesson' : 'lessons'} and this opens. It only asks things your lessons already asked you.`
          const inner = (
            <>
              <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }} aria-hidden>
                {checkPassed ? '🏅' : ready ? '🎯' : '🔒'}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2,
                }}>
                  The big {stageName} check
                </span>
                <span style={{
                  display: 'block', fontSize: 'var(--text-md)', color: 'var(--ink-soft)',
                  lineHeight: 1.45, marginTop: 3,
                }}>
                  {body}
                </span>
              </span>
              {ready && !checkPassed && (
                <span style={{
                  flexShrink: 0, alignSelf: 'center', fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-base)', color: 'var(--ink)', background: 'var(--butter)',
                  borderRadius: '12px', padding: '9px 15px', boxShadow: '0 4px 0 rgba(0,0,0,0.22)',
                }}>
                  Go ▶
                </span>
              )}
            </>
          )
          const shell: React.CSSProperties = {
            display: 'flex', gap: '13px', alignItems: 'flex-start', textDecoration: 'none',
            background: checkPassed ? 'var(--sage)' : 'var(--cream)', borderRadius: '20px',
            padding: '15px 16px', marginTop: '12px',
            boxShadow: ready && !checkPassed
              ? '0 5px 0 rgba(0,0,0,0.22), 0 0 0 3px var(--butter)'
              : '0 5px 0 rgba(0,0,0,0.22)',
            opacity: ready || checkPassed ? 1 : 0.75,
          }
          return ready || checkPassed
            ? <Link href={checkHref} style={shell}>{inner}</Link>
            : <div style={shell}>{inner}</div>
        })()}
      </div>
    </div>
  )
}
