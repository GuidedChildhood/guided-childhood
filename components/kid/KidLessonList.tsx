import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'

// My lessons, the child's own list: the age right stage lessons from the
// family library, on the kid dark theme. Presentational only, so the real
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
  backHref, childName, stageName, ages, items, hrefFor,
}: {
  backHref: string
  childName: string
  stageName: string
  ages: string
  items: KidLessonItem[]
  hrefFor: (id: string) => string
}) {
  const doneCount = items.filter(i => i.done).length
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '10px' }}>
          <Link href={backHref} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
          }}>
            ← My quests
          </Link>
          {items.length > 0 && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
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
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', color: '#F7F7F5', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
              My lessons
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.66)', margin: '5px 0 0' }}>
              {stageName} stage · {ages}
            </p>
          </div>
        </div>
        <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '10px 0 20px' }}>
          Picked for your age, {childName}. Do them in order, top to bottom, one a week is perfect. Pass one and your grown up sees the tick straight away.
        </p>

        {items.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.16)', borderRadius: '20px', padding: '26px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.6 }}>
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
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                    }}>
                      {item.emoji}
                    </span>
                    <span style={{
                      position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px',
                      borderRadius: '50%', background: item.done ? 'var(--terracotta)' : 'var(--ink)',
                      color: item.done ? 'var(--ink)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '13px',
                      border: '2px solid var(--cream)',
                    }}>
                      {idx + 1}
                    </span>
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {isNext && (
                      <span style={{
                        display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)',
                        background: 'var(--terracotta)', borderRadius: '100px', padding: '3px 9px', marginBottom: '5px',
                      }}>
                        ⭐ Do this one next
                      </span>
                    )}
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17.5px', color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </span>
                    <span style={{ display: 'block', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '4px' }}>
                      {item.locked ? 'Ask your grown up to open this one' : isNext ? item.keyMessage : item.done ? item.keyMessage : `After lesson ${idx}, this one is waiting for you`}
                    </span>
                  </span>
                  <span style={{ flexShrink: 0, alignSelf: 'center' }}>
                    {item.done ? (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.06em',
                        textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                        background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                        borderRadius: '100px', padding: '4px 10px',
                      }}>
                        ✓ Passed{item.score != null ? ` · ${item.score}` : ''}
                      </span>
                    ) : item.locked ? (
                      <span style={{ fontSize: '20px' }}>🔒</span>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px',
                        color: 'var(--ink)', background: isNext ? 'var(--terracotta)' : '#fff',
                        border: isNext ? 'none' : '1.5px solid var(--border)',
                        borderRadius: '12px', padding: '9px 15px',
                        boxShadow: isNext ? '0 4px 0 var(--terracotta-dark)' : 'none',
                      }}>
                        Go ▶
                      </span>
                    )}
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
      </div>
    </div>
  )
}
