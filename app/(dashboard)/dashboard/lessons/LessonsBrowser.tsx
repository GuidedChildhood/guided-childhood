'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrowseTile from '@/components/ui/BrowseTile'
import { literacyAreaFor } from '@/lib/content/literacy'
import { sceneCoverForStage } from '@/lib/content/lesson-scene-covers'
import LessonSendButton from './together/LessonSendButton'
import PrintableActions from '../printables/PrintableActions'
import type { Printable } from '@/lib/printables/registry'

// The Lessons browser. The old page was one long scroll of every lesson at
// every stage; this splits it into three tidy views with a segmented
// control at the top (Watch together, Lessons, Printables) and a stage
// chip row that defaults to the child's own stage, so a parent lands on a
// short, relevant shelf they can act on, not a wall of forty cards. Every
// card leads with a thumbnail and carries its two real actions.

export type WatchItem = {
  code: string; stageNum: number; stageName: string; title: string
  catchphrase: string; strand: string; posterUrl: string | null
  journeyStep: number; duration: string | null; done: boolean
}
export type LibraryItem = {
  id: string; href: string; stageNum: number; stageLabel: string; stageAges: string
  categoryLabel: string; title: string; keyMessage: string; locked: boolean; done: boolean
  // Started but not passed, so the tile can say "attempted, retake".
  attempted: boolean
  // Choice questions answered right on the passing run, when the deck had any.
  score: number | null
  // The honest curriculum mapping: Key Stage from the stage, Education for a
  // Connected World strand from the category. Null when there is no clean fit.
  ks: string | null
  strand: string | null
  // The drawn badge for the tile, resolved on the server so AI modules get one
  // by category. deep marks the full seven beat Rosenshine decks: those are the
  // route that passes the stage, everything else is linked bonus.
  coverUrl: string | null
  deep: boolean
}

type View = 'together' | 'library' | 'printables'

const STAGE_LIST = [
  { num: 1, label: 'Foundation', ages: '4 to 7' },
  { num: 2, label: 'Builder', ages: '8 to 10' },
  { num: 3, label: 'Explorer', ages: '11 to 13' },
  { num: 4, label: 'Shaper', ages: '13 to 15' },
  { num: 5, label: 'Independent', ages: '16 and up' },
]

const STRAND_EMOJI: Record<string, string> = {
  screens: '📱', screen: '📱', bodies: '🧠', feelings: '💛', wellbeing: '💛',
  kindness: '🤝', privacy: '🛡️', gaming: '🎮', misinformation: '🔍',
  algorithms: '🎯', money: '💷', identity: '✨', default: '🎬',
}
function strandEmoji(strand: string): string {
  const k = (strand || '').toLowerCase()
  for (const key of Object.keys(STRAND_EMOJI)) if (k.includes(key)) return STRAND_EMOJI[key]
  return STRAND_EMOJI.default
}

// The library lessons carry a category label rather than a strand, so they get
// their own lookup with a book default, never the film emoji.
function categoryEmoji(category: string): string {
  const k = (category || '').toLowerCase()
  for (const key of Object.keys(STRAND_EMOJI)) if (key !== 'default' && k.includes(key)) return STRAND_EMOJI[key]
  return '📘'
}

export default function LessonsBrowser({
  childId, childName, childStageNum, watchItems, libraryItems, printables, isPaid,
  initialStage = null, initialView,
}: {
  childId: string | null
  childName: string
  childStageNum: number
  watchItems: WatchItem[]
  libraryItems: LibraryItem[]
  printables: Printable[]
  isPaid: boolean
  // A deep link (from the passport) can open a specific stage's route straight
  // away, otherwise the browser opens on its usual Watch together, All ages view.
  initialStage?: number | null
  initialView?: View
}) {
  const [view, setView] = useState<View>(initialView ?? 'together')
  // Watch together opens on All ages so a parent can send any illustrated
  // video. Lessons open on the child's own age, the set that moves their
  // progress, in a clear numbered order to work through; the chips still let
  // a parent step to another stage. A deep link overrides both.
  const [stage, setStage] = useState<number | 'all'>(
    initialStage ?? ((initialView ?? 'together') === 'library' ? childStageNum : 'all')
  )

  const inStage = (n: number) => stage === 'all' || n === stage
  const watchForStage = watchItems.filter(w => inStage(w.stageNum))
  const libForStage = libraryItems.filter(l => inStage(l.stageNum))
  const printForStage = printables.filter(p => p.stages.some(inStage))

  // Group stage keyed items (videos, lessons) by stage for the All ages
  // view, so everything is on screen at once under clear age headers; a
  // single stage renders as just its own group.
  function groupByStage<T extends { stageNum: number }>(items: T[]): { s: typeof STAGE_LIST[number]; items: T[] }[] {
    return STAGE_LIST
      .map(s => ({ s, items: items.filter(i => i.stageNum === s.num) }))
      .filter(g => g.items.length > 0)
  }

  // Stage chips only offer stages that hold something in the current view,
  // plus All ages at the front.
  const stagesWith = new Set(
    (view === 'together' ? watchItems.map(w => w.stageNum)
      : view === 'library' ? libraryItems.map(l => l.stageNum)
      : printables.flatMap(p => p.stages))
  )
  const stageChips = STAGE_LIST.filter(s => stagesWith.has(s.num))

  const TABS: { key: View; icon: string; label: string; count: number }[] = [
    { key: 'together', icon: '🎬', label: 'Watch together', count: watchItems.length },
    { key: 'library', icon: '📚', label: 'Lessons', count: libraryItems.length },
    { key: 'printables', icon: '🖨️', label: 'Printables', count: printables.length },
  ]

  return (
    <div>
      {/* Sticky control strip: the segmented view switch and the stage chips
          ride together, frosted, so navigation stays put as the shelf
          scrolls under it. */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5, margin: '0 -20px', padding: '10px 20px 12px',
        background: 'rgba(249,248,246,0.86)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', gap: '6px', background: '#fff', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px', boxShadow: '0 2px 10px rgba(26,26,46,0.05)' }}>
          {TABS.map(t => {
            const on = view === t.key
            return (
              <button
                key={t.key}
                onClick={() => { setView(t.key); if (t.key === 'library') setStage(childStageNum) }}
                style={{
                  flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  padding: '9px 8px', borderRadius: '100px', cursor: 'pointer', border: 'none',
                  background: on ? 'var(--deep-teal)' : 'transparent',
                  color: on ? '#fff' : 'var(--ink-soft)',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                  boxShadow: on ? '0 2px 8px -1px rgba(46,40,24,0.45)' : 'none',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>{t.icon}</span>
                <span>{t.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, opacity: on ? 0.85 : 0.5 }}>{t.count}</span>
              </button>
            )
          })}
        </div>

        {stageChips.length > 1 && (
          <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingTop: '10px', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setStage('all')}
              style={{
                flexShrink: 0, padding: '7px 13px', borderRadius: '100px', cursor: 'pointer',
                border: `1.5px solid ${stage === 'all' ? 'var(--terracotta)' : 'var(--border)'}`,
                background: stage === 'all' ? 'var(--terracotta-lt)' : '#fff',
                color: stage === 'all' ? 'var(--terracotta-dark)' : 'var(--ink-soft)',
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
              }}
            >
              All ages
            </button>
            {stageChips.map(s => {
              const on = s.num === stage
              return (
                <button
                  key={s.num}
                  onClick={() => setStage(s.num)}
                  style={{
                    flexShrink: 0, padding: '7px 13px', borderRadius: '100px', cursor: 'pointer',
                    border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                    background: on ? 'var(--terracotta-lt)' : '#fff',
                    color: on ? 'var(--terracotta-dark)' : 'var(--ink-soft)',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                  }}
                >
                  Stage {s.num} · {s.ages}
                  {s.num === childStageNum ? ` · ${childName}` : ''}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ paddingTop: '20px' }}>
        {/* ── Watch together ── the drawn films, thumbnail led, two taps:
            watch on the sofa or send to their phone. */}
        {view === 'together' && (
          <>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
              The illustrated films that already live on {childName}&apos;s phone. Watch one together here, or send it for them to watch on their own. First watch earns 10 stars.
            </p>
            {watchForStage.length === 0 ? (
              <Empty>No films at this stage yet. Try another stage above.</Empty>
            ) : (
              groupByStage(watchForStage).map(g => (
              <div key={g.s.num} style={{ marginBottom: '22px' }}>
                {stage === 'all' && <StageSubHead s={g.s} childStageNum={childStageNum} childName={childName} />}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '14px' }}>
                {g.items.map(w => (
                  <div key={w.code} style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 18px rgba(26,26,46,0.06)' }}>
                    <Link href={`/dashboard/lessons/together/${w.code}`} style={{ position: 'relative', display: 'block', textDecoration: 'none', aspectRatio: '16 / 10', overflow: 'hidden', background: `linear-gradient(150deg, var(--stage-${w.stageNum}-bold) 0%, var(--stage-${w.stageNum}) 100%)` }}>
                      {w.posterUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={w.posterUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '26px' }}>{strandEmoji(w.strand)}</span>
                      )}
                      {w.done && (
                        <span style={{ position: 'absolute', top: '10px', right: '10px', fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, color: '#1F7A54', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#D4EDDF', borderRadius: '100px', padding: '2px 8px' }}>✓ Done</span>
                      )}
                      <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                        <span style={{ fontSize: '16px', color: 'var(--ink)', marginLeft: '3px' }}>▶</span>
                      </span>
                      <span style={{ position: 'absolute', bottom: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.75)', borderRadius: '100px', padding: '2px 8px' }}>
                        Lesson {w.journeyStep}{w.duration ? ` · ${w.duration}` : ''}
                      </span>
                    </Link>
                    <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '4px' }}>{w.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>&ldquo;{w.catchphrase}&rdquo;</div>
                        {(() => {
                          const area = literacyAreaFor(w.strand)
                          return area ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: '8px', background: 'var(--tint-sage)', borderRadius: '100px', padding: '3px 9px' }}>
                              <span aria-hidden style={{ fontSize: '11px' }}>{area.icon}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-soft)' }}>Builds {area.name}</span>
                            </div>
                          ) : null
                        })()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link href={`/dashboard/lessons/together/${w.code}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '11px', padding: '9px 10px', fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 800, boxShadow: '0 3px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
                          {w.done ? 'Watch again ↻' : '▶ Watch together'}
                        </Link>
                        <LessonSendButton childId={childId} childName={childName} title={w.title} />
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
              ))
            )}
          </>
        )}

        {/* ── Lessons ── the interactive library the parent leads, grouped by
            age when showing all. */}
        {view === 'library' && (
          <>
            <ProgressLessonsBanner
              childId={childId}
              childName={childName}
              childStageNum={childStageNum}
              libraryItems={libraryItems}
              onSeeStage={() => setStage(childStageNum)}
            />
            <Link href="/dashboard/lessons/preview" style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
              <div style={{ background: '#DEF0E7', border: '1.5px solid #2F8F6B', borderRadius: '18px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2F8F6B', marginBottom: '3px' }}>New · 15 min together · ages 11 to 15</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)' }}>Is That Real?</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '2px' }}>The sofa lesson on fake images and deepfakes.</div>
                </div>
                <span style={{ background: 'var(--terracotta)', color: 'var(--ink)', flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>Start</span>
              </div>
            </Link>
            {libForStage.length === 0 ? (
              <Empty>No library lessons at this stage yet. Try another stage above.</Empty>
            ) : (
              // The child's own stage leads the All ages view: those are the
              // lessons that move their progress report, so they come first.
              // Within each stage the deep seven beat lessons show first as the
              // route that passes the stamp, then the thinner lessons and AI
              // modules sit below as linked bonus, so it is always clear which
              // ones earn the level and which are extra.
              [...groupByStage(libForStage)]
                .sort((a, b) => Number(b.s.num === childStageNum) - Number(a.s.num === childStageNum))
                .map(g => {
                  const route = g.items.filter(i => i.deep)
                  const bonus = g.items.filter(i => !i.deep)
                  // The route lessons carry their place in the stage order, so
                  // a parent reads a clear numbered path of what to do next.
                  const tile = (l: LibraryItem, number?: number) => (
                    <BrowseTile
                      key={l.id}
                      href={l.href}
                      stageNum={l.stageNum}
                      title={l.title}
                      sub={literacyAreaFor(l.categoryLabel)?.name ?? l.categoryLabel}
                      emoji={categoryEmoji(l.categoryLabel)}
                      coverUrl={l.coverUrl}
                      done={l.done}
                      doneLabel={l.score != null ? `✓ Passed · ${l.score} right` : '✓ Passed'}
                      attempted={l.attempted}
                      number={number}
                      locked={l.locked}
                      chips={[l.ks, l.strand].filter((c): c is string => Boolean(c))}
                    />
                  )
                  return (
                    <div key={g.s.num} style={{ marginBottom: '26px' }}>
                      {stage === 'all' && <StageSubHead s={g.s} childStageNum={childStageNum} childName={childName} />}

                      {route.length > 0 && (
                        <div style={{ marginBottom: bonus.length > 0 ? '20px' : 0 }}>
                          <RouteHeader s={g.s} count={route.length} childName={childName} />
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                            {route.map((l, i) => tile(l, i + 1))}
                          </div>
                        </div>
                      )}

                      {bonus.length > 0 && (
                        <div>
                          <SectionLabel
                            eyebrow={route.length > 0 ? 'Bonus · dip in any time' : 'Lessons'}
                            title={route.length > 0 ? `More for Stage ${g.s.num}` : `Stage ${g.s.num} lessons`}
                            note={route.length > 0 ? 'Extra lessons and AI modules that add to the route. Lovely to do, not needed to pass the stage.' : undefined}
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                            {bonus.map(l => tile(l))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
            )}
          </>
        )}

        {/* ── Printables ── the paper sheets, every one a real thumbnail with
            print and add to quests right on the card. */}
        {view === 'printables' && (
          <>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
              Colouring sheets to print and finish away from screens. Print it, or add it to {childName}&apos;s quests so the finished page pays stars.
            </p>
            {printForStage.length === 0 ? (
              <Empty>No printables at this stage yet. Try another stage above.</Empty>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '14px' }}>
                {printForStage.map(p => (
                  <div key={p.key} style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 18px rgba(26,26,46,0.06)' }}>
                    <div style={{ position: 'relative', aspectRatio: '16 / 11', overflow: 'hidden', background: '#EFE9DD' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.previewUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: '10px', left: '12px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink)', background: 'rgba(255,255,255,0.85)', borderRadius: '100px', padding: '3px 9px' }}>⭐ {p.stars}</span>
                    </div>
                    <div style={{ padding: '13px 15px 15px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2, marginBottom: '3px' }}>{p.emoji} {p.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.4 }}>{p.skill} · {p.minutes}</div>
                      </div>
                      <PrintableActions printable={p} isPaid={isPaid} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// A small age header for the All ages view, so a parent can see at a glance
// which video sits at which stage and judge what fits their child.
function StageSubHead({ s, childStageNum, childName }: { s: typeof STAGE_LIST[number]; childStageNum: number; childName: string }) {
  const mine = s.num === childStageNum
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px', flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--ink)', background: `var(--stage-${s.num})`, padding: '4px 11px', borderRadius: '100px',
      }}>
        Stage {s.num} · Ages {s.ages}
      </span>
      {mine && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          {childName}&apos;s stage · counts for progress now
        </span>
      )}
    </div>
  )
}

// The route header: the warm age scene for the stage, then the plain promise
// that these deep lessons are the ones that fill the stamp. One scene per age
// band, cosy for the little ones and side by side for the teens, so the parent
// sees themselves and their child in the work, not a stock icon.
function RouteHeader({ s, count, childName }: { s: typeof STAGE_LIST[number]; count: number; childName: string }) {
  const scene = sceneCoverForStage(s.num)
  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', overflow: 'hidden', marginBottom: '13px' }}>
      {scene && (
        <div style={{ position: 'relative', aspectRatio: '5 / 2', background: `var(--stage-${s.num})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={scene} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
        <span aria-hidden style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '11px', background: '#fff', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>🪪</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>
            Pass this stage · {count} lesson{count === 1 ? '' : 's'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.15 }}>
            The {s.label} route
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 0' }}>
            The deep lessons that fill this stamp. Work through them in order, open one to do together, or send the set to {childName}.
          </p>
        </div>
      </div>
    </div>
  )
}

// A quiet section label, used to head the bonus shelf under a route.
function SectionLabel({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div style={{ margin: '0 0 12px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '2px' }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{title}</div>
      {note && <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '3px 0 0' }}>{note}</p>}
    </div>
  )
}

// The one clear answer to "which lessons do I send?": the child's own stage
// lessons are the ones their progress report counts, so this names them, shows
// the real passed fraction, and sends the child a nudge to their own My
// lessons page in one tap. Everything else in the library stays browsable,
// this just makes the progress moving set unmissable.
function ProgressLessonsBanner({
  childId, childName, childStageNum, libraryItems, onSeeStage,
}: {
  childId: string | null
  childName: string
  childStageNum: number
  libraryItems: LibraryItem[]
  onSeeStage: () => void
}) {
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'nodevice' | 'noserver'>('idle')
  // Only the family library lessons count for the progress report ticks, the
  // same set the child's own page shows, so the AI module extras stay out of
  // this count.
  const stageLessons = libraryItems.filter(l => l.id.startsWith('lesson-') && l.stageNum === childStageNum)
  const total = stageLessons.length
  if (total === 0) return null
  const passed = stageLessons.filter(l => l.done).length
  const left = total - passed
  const stageMeta = STAGE_LIST.find(s => s.num === childStageNum)

  async function send() {
    if (!childId || sendState === 'sending') return
    setSendState('sending')
    try {
      const res = await fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: childId, message: `Your ${stageMeta?.label ?? 'stage'} lessons are ready on your page. Pass one to light up your pathway ⭐` }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setSendState('noserver')
      else if (data?.sent > 0) setSendState('sent')
      else setSendState('nodevice')
      setTimeout(() => setSendState('idle'), 5000)
    } catch { setSendState('noserver') }
  }

  const sendLabel = sendState === 'sending' ? 'Sending...'
    : sendState === 'sent' ? `Pinged ${childName} ✓`
    : sendState === 'nodevice' ? 'On their page (no ping set up)'
    : sendState === 'noserver' ? 'Pings not switched on yet'
    : `📲 Send to ${childName}`

  return (
    <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '18px', padding: '16px 18px', marginBottom: '14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '4px' }}>
        These move {childName}&apos;s progress
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2 }}>
        {left > 0
          ? <>Stage {childStageNum} lessons, {passed} of {total} passed</>
          : <>All {total} Stage {childStageNum} lessons passed 🌱</>}
      </div>
      <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '4px 0 12px' }}>
        {left > 0
          ? <>These are the right ones for {childName}&apos;s age{stageMeta ? ` (${stageMeta.ages.toLowerCase()})` : ''}. {childName} sees exactly this set on their own page, in order with the next one marked. One a week is plenty, and each pass ticks the progress report.</>
          : <>The progress report shows the full tick for this stage. New lessons arrive as {childName} ages up.</>}
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onSeeStage}
          style={{
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '11px',
            padding: '9px 14px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '12.5px',
            fontWeight: 800, boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}
        >
          See {childName}&apos;s lessons
        </button>
        <button
          onClick={send}
          disabled={!childId || sendState === 'sending'}
          title={childId ? `Ping ${childName} to open My lessons on their page` : 'Add your child first'}
          style={{
            background: sendState === 'sent' ? 'var(--tint-sage)' : '#fff',
            border: '1.5px solid var(--border)', borderRadius: '11px', padding: '8px 12px',
            cursor: childId && sendState !== 'sending' ? 'pointer' : 'default',
            fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: 'var(--ink)',
            whiteSpace: 'nowrap', opacity: childId ? 1 : 0.55,
          }}
        >
          {sendLabel}
        </button>
      </div>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
      {children}
    </div>
  )
}
