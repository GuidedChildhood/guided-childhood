'use client'

import { useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { playKidSound } from '@/lib/sound/kidSounds'

// The child's pathway, the Duolingo grammar in our own butter and ink: one
// winding trail of stones for their stage, lessons and games and the daily
// chest mixed along it, passed lessons shining as stars, one obvious next
// stone pulsing. Above it the chase: the Scroll Gremlin creeps along as
// screen minutes are used, and jobs, chests and lesson passes keep the child
// ahead. A pass leaps two stones, so the tests are the fastest way forward.
// Warm gamification, never a lock: every stone stays tappable.

export type PathLesson = { id: string; title: string; emoji: string; done: boolean; score: number | null; locked: boolean }
export type PathGame = { key: string; title: string; emoji: string }

type Node =
  | { type: 'lesson'; lesson: PathLesson }
  | { type: 'chest' }
  | { type: 'game'; game: PathGame }
  | { type: 'reading' }
  | { type: 'finish' }

export default function KidPath({
  token, childName, stageId, stageName, ages, stamp,
  lessons, games, jobsToday, chestClaimed: chestClaimedInitial,
  usedTodayMinutes, guideMinutes, balanceStars, needsMigration = false,
}: {
  token: string
  childName: string
  stageId: number
  stageName: string
  ages: string
  stamp: string
  lessons: PathLesson[]
  games: PathGame[]
  jobsToday: number
  chestClaimed: boolean
  usedTodayMinutes: number
  guideMinutes: number
  balanceStars: number
  needsMigration?: boolean
}) {
  const [chestClaimed, setChestClaimed] = useState(chestClaimedInitial)
  const [chestBusy, setChestBusy] = useState(false)
  const [chestMsg, setChestMsg] = useState<string | null>(null)

  // The trail: lessons in order with the daily chest after the first, a game
  // woven in every couple of stones, a reading stone, and the stage stamp at
  // the end of the road.
  const nodes: Node[] = []
  let gi = 0
  lessons.forEach((l, i) => {
    nodes.push({ type: 'lesson', lesson: l })
    if (i === 0) nodes.push({ type: 'chest' })
    if ((i + 1) % 2 === 0 && gi < games.length) nodes.push({ type: 'game', game: games[gi++] })
    if (i === 2) nodes.push({ type: 'reading' })
  })
  if (lessons.length < 3) nodes.push({ type: 'reading' })
  nodes.push({ type: 'finish' })

  // Progress in leap units: a passed lesson counts double, that is the leap.
  const totalUnits = lessons.length * 2 + 1 + Math.min(games.length, gi || games.length ? gi : 0)
  const doneUnits = lessons.filter(l => l.done).length * 2 + (chestClaimed ? 1 : 0)
  const childFrac = totalUnits > 0 ? Math.min(1, doneUnits / totalUnits) : 0
  const gremlinFrac = guideMinutes > 0 ? Math.min(0.96, Math.max(0.02, usedTodayMinutes / guideMinutes)) : 0.02
  const caught = guideMinutes > 0 && gremlinFrac >= childFrac && usedTodayMinutes > 0

  const nextLessonId = lessons.find(l => !l.done && !l.locked)?.id ?? null

  async function openChest() {
    if (chestBusy || chestClaimed) return
    if (jobsToday < 1) {
      playKidSound('tap')
      window.location.assign(`/k/${token}#my-todo`)
      return
    }
    setChestBusy(true)
    try {
      const r = await fetch('/api/kid/chest-claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok) {
        setChestClaimed(true)
        setChestMsg('+1 star in your bank ⭐')
        playKidSound('tap')
        setTimeout(() => setChestMsg(null), 3500)
      } else if (d?.needsMigration) {
        setChestMsg('The chest is still being built. Soon!')
        setTimeout(() => setChestMsg(null), 3500)
      } else if (/already/.test(String(d?.error))) {
        setChestClaimed(true)
      }
    } catch { /* stays shut, tap again */ } finally { setChestBusy(false) }
  }

  // The winding: stones drift left, centre, right and back as the trail runs.
  const drift = (i: number): 'flex-start' | 'center' | 'flex-end' => {
    const cycle = [
      'center', 'flex-start', 'center', 'flex-end',
    ] as const
    return cycle[i % 4]
  }

  const stoneShell = (opts: { bg: string; border?: string; dim?: boolean; pulse?: boolean }): React.CSSProperties => ({
    width: 84, height: 84, borderRadius: '50%', flexShrink: 0,
    background: opts.bg, border: opts.border ?? 'none',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 0 rgba(0,0,0,0.28)', cursor: 'pointer',
    opacity: opts.dim ? 0.78 : 1, position: 'relative',
    animation: opts.pulse ? 'gcPathPulse 1.8s ease-in-out infinite' : undefined,
    textDecoration: 'none',
  })

  const stoneLabel: React.CSSProperties = {
    marginTop: 8, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
    color: '#F7F7F5', lineHeight: 1.25,
  }
  const stoneSub: React.CSSProperties = {
    marginTop: 3, maxWidth: 150, textAlign: 'center',
    fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700,
    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <style>{`
        @keyframes gcPathPulse {
          0%, 100% { box-shadow: 0 6px 0 rgba(0,0,0,0.28), 0 0 0 0 rgba(237,195,95,0.55); }
          50% { box-shadow: 0 6px 0 rgba(0,0,0,0.28), 0 0 0 14px rgba(237,195,95,0); }
        }
      `}</style>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px' }}>
          <Link href={`/k/${token}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'rgba(255,255,255,0.78)', textDecoration: 'none' }}>
            ← My quests
          </Link>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', background: 'var(--terracotta)', borderRadius: '100px', padding: '5px 12px', boxShadow: '0 3px 0 rgba(0,0,0,0.2)' }}>
            ⭐ {balanceStars} in the bank
          </span>
        </div>

        {/* The stage banner: where the child stands, said big. */}
        <div style={{ background: 'var(--cream)', borderRadius: '22px', padding: '16px 18px', marginBottom: '14px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '3px' }}>
            Stage {stageId} of 5 · ages {ages}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {stageName} path
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)', borderRadius: 100, padding: '4px 12px' }}>
            <span aria-hidden style={{ fontSize: 14 }}>🪪</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
              Stamp at the end: {stamp}
            </span>
          </div>
        </div>

        {/* The chase: the Scroll Gremlin moves as screen minutes are used,
            the child moves by passing lessons and opening the chest. */}
        {guideMinutes > 0 && (
          <div style={{ background: 'var(--cream)', borderRadius: '18px', padding: '13px 16px 15px', marginBottom: '20px', boxShadow: '0 5px 0 rgba(0,0,0,0.22)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: 'var(--ink)' }}>
                {caught ? 'The Scroll Gremlin caught up! 👾' : 'Stay ahead of the Scroll Gremlin'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)' }}>
                {Math.max(0, Math.round(usedTodayMinutes))}/{guideMinutes} min
              </span>
            </div>
            <div style={{ position: 'relative', height: 30 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 7, borderRadius: 100, background: 'rgba(26,26,46,0.12)' }} />
              <div style={{ position: 'absolute', left: 0, top: 12, height: 7, borderRadius: 100, width: `${childFrac * 100}%`, background: 'var(--terracotta)' }} />
              <span aria-hidden style={{ position: 'absolute', top: -1, left: `calc(${gremlinFrac * 100}% - 11px)`, fontSize: 21 }}>👾</span>
              <span aria-hidden style={{ position: 'absolute', top: -3, left: `calc(${childFrac * 100}% - 12px)`, fontSize: 23, filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))' }}>⭐</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '4px 0 0' }}>
              {caught
                ? 'Pass a lesson or open the chest to leap ahead of it.'
                : 'Screen minutes move the Gremlin. Lessons, jobs and the chest move you.'}
            </p>
          </div>
        )}

        {chestMsg && (
          <div style={{ background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, padding: '11px 15px', marginBottom: 14, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, textAlign: 'center', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>
            {chestMsg}
          </div>
        )}

        {/* The trail itself. */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {nodes.map((node, i) => {
            const align = drift(i)
            const connector = i < nodes.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                <span aria-hidden style={{ height: 26, borderLeft: '4px dotted rgba(255,255,255,0.28)' }} />
              </div>
            )

            let stone: React.ReactNode = null
            if (node.type === 'lesson') {
              const l = node.lesson
              const isNext = l.id === nextLessonId
              stone = (
                <Link href={`/k/${token}/lessons/${l.id}`} onClick={() => playKidSound('tap')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                  <span style={stoneShell({ bg: l.done ? 'var(--terracotta)' : 'var(--cream)', dim: !l.done && !isNext, pulse: isNext })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{l.done ? '⭐' : l.locked ? '🔒' : l.emoji}</span>
                    {l.done && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>+2 ⚡ leap</span>}
                  </span>
                  <span style={stoneLabel}>{l.title}</span>
                  <span style={stoneSub}>
                    {l.done ? `Passed${l.score != null ? ` · ${l.score} right` : ''}` : l.locked ? 'Ask your grown up' : isNext ? '▶ Start here' : 'Lesson'}
                  </span>
                </Link>
              )
            } else if (node.type === 'chest') {
              const openable = !chestClaimed && jobsToday > 0 && !needsMigration
              stone = (
                <button onClick={openChest} disabled={chestBusy} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <span style={stoneShell({ bg: chestClaimed ? 'var(--tint-sage)' : openable ? 'var(--terracotta-lt)' : 'var(--cream)', border: openable ? '3px solid var(--terracotta)' : undefined, dim: !openable && !chestClaimed, pulse: openable })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{chestClaimed ? '✨' : '🎁'}</span>
                  </span>
                  <span style={stoneLabel}>{chestClaimed ? 'Chest opened' : 'The daily chest'}</span>
                  <span style={stoneSub}>
                    {chestClaimed ? '+1 star banked' : openable ? 'Tap to open!' : jobsToday > 0 ? 'Nearly ready' : 'Do a job to open'}
                  </span>
                </button>
              )
            } else if (node.type === 'game') {
              stone = (
                <a
                  href={`/k/${token}?tab=games`}
                  onClick={() => playKidSound('tap')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}
                >
                  <span style={stoneShell({ bg: 'var(--tint-blue, #E4ECF7)' })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>{node.game.emoji || '🎮'}</span>
                  </span>
                  <span style={stoneLabel}>{node.game.title}</span>
                  <span style={stoneSub}>Learning game</span>
                </a>
              )
            } else if (node.type === 'reading') {
              stone = (
                <a href={`/k/${token}#my-todo`} onClick={() => playKidSound('tap')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                  <span style={stoneShell({ bg: 'var(--cream)' })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>📚</span>
                  </span>
                  <span style={stoneLabel}>Twenty minutes lost in a book</span>
                  <span style={stoneSub}>A big star job</span>
                </a>
              )
            } else {
              const allDone = lessons.length > 0 && lessons.every(l => l.done)
              stone = (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={stoneShell({ bg: allDone ? 'var(--terracotta)' : 'var(--cream)', dim: !allDone })}>
                    <span style={{ fontSize: 34, lineHeight: 1 }}>🪪</span>
                  </span>
                  <span style={stoneLabel}>The {stamp} stamp</span>
                  <span style={stoneSub}>{allDone ? 'Earned! Your passport shines' : 'Waiting at the end of the path'}</span>
                </div>
              )
            }

            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: align, padding: '0 8%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{stone}</div>
                </div>
                {connector}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.16)', borderRadius: 18, padding: '14px 16px' }}>
          <DigiCharacter mood="wave" size={44} once />
          <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
            Every stone counts, {childName}. Pass the lesson check and you leap two. The road waits for you, the Gremlin does not.
          </p>
        </div>
      </div>
    </div>
  )
}
