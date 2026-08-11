'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import KidTodayList, { type TodayQuest } from '@/components/kid/KidTodayList'
import KidSwapSheet from './KidSwapSheet'
import HappyNews, { type HappyNewsItem, type CharacterKey } from '@/components/celebrate/HappyNews'
import { playKidSound } from '@/lib/sound/kidSounds'
import { buddyFor } from '@/lib/kid/buddy'
import { STAR_MINUTES } from '@/lib/quests/templates'

// The jobs page's client half: the real KidTodayList (the exact component the
// home screen used to render, in its jobs only shape), wired to the same tick
// endpoint with the same optimistic flow and the same celebrations. Nothing
// here is a copy of markup; the one list component keeps one behaviour.

export default function KidJobsScreen({
  token, childName, buddy, stageId, quests, todayTicks, giftStarsOwed,
}: {
  token: string
  childName: string
  buddy: string | null
  stageId: number
  quests: TodayQuest[]
  todayTicks: { quest_id: string; status: string }[]
  giftStarsOwed: number
}) {
  const [ticks, setTicks] = useState<Record<string, string>>(
    Object.fromEntries(todayTicks.map(t => [t.quest_id, t.status]))
  )
  const [burst, setBurst] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [happyNews, setHappyNews] = useState<HappyNewsItem | null>(null)
  const [swapFor, setSwapFor] = useState<TodayQuest | null>(null)
  const who = buddyFor(buddy)

  // The same tick flow as the home screen: optimistic to pending, a burst and
  // a friendly face, the server reconciling underneath.
  async function toggle(quest: TodayQuest) {
    const current = ticks[quest.id]
    if (current === 'approved') return
    const untick = current === 'pending'
    setTicks(prev => {
      const next = { ...prev }
      if (untick) delete next[quest.id]
      else next[quest.id] = 'pending'
      return next
    })
    if (!untick) {
      setBurst(quest.id)
      setTimeout(() => setBurst(null), 900)
      playKidSound('star')
      const cast: CharacterKey[] = ['orbit', 'nova', 'digi']
      setHappyNews({
        character: cast[quest.title.length % cast.length],
        headline: `${quest.stars} star${quest.stars === 1 ? '' : 's'} on the way!`,
        sub: 'Sent to your grown up. They tap approve and the stars are yours.',
      })
      setToast('Sent to your grown up! ⭐ Stars land when they tap approve.')
      setTimeout(() => setToast(null), 3000)
    }
    try {
      await fetch('/api/quests/tick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, quest_id: quest.id, untick }),
      })
    } catch { /* optimistic state stands, the next load reconciles */ }
  }

  // A grown up's yes landing while this page is open flips Waiting to Done
  // live, the same gentle poll the home screen keeps.
  const seenApprovedRef = useRef<Set<string>>(new Set(todayTicks.filter(t => t.status === 'approved').map(t => t.quest_id)))
  useEffect(() => {
    let live = true
    const poll = async () => {
      try {
        const res = await fetch(`/api/quests/tick?token=${token}`)
        if (!res.ok || !live) return
        const d = await res.json()
        const fresh = d.ticks as Record<string, string> | undefined
        if (!fresh) return
        const justApproved = Object.keys(fresh).find(qid => fresh[qid] === 'approved' && !seenApprovedRef.current.has(qid))
        if (justApproved) {
          Object.keys(fresh).forEach(qid => { if (fresh[qid] === 'approved') seenApprovedRef.current.add(qid) })
          const q = quests.find(x => x.id === justApproved)
          if (q) {
            setHappyNews({
              character: 'digi',
              headline: 'Your grown up said yes! ⭐',
              sub: `${q.title} is done. That is ${q.stars * STAR_MINUTES} minutes of screen time earned. Superstar!`,
            })
            playKidSound('star')
          }
        }
        setTicks(fresh)
      } catch { /* offline, the next poll tries again */ }
    }
    const id = setInterval(poll, 12000)
    const onVis = () => { if (!document.hidden) poll() }
    document.addEventListener('visibilitychange', onVis)
    return () => { live = false; clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--butter)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      {/* The list's tick animations, the same frames the home screen defines.
          Without them a finished row here would simply vanish. */}
      <style>{`
        @keyframes kid-done-leave {
          0% { opacity: 1; transform: scale(1); }
          12% { transform: scale(1.03); }
          75% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.96); }
        }
        @keyframes kid-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.25) rotate(-4deg); }
          100% { transform: scale(1); }
        }
      `}</style>
      <HappyNews item={happyNews} onClose={() => setHappyNews(null)} />

      {/* The swap sheet: propose trading this job for a different task. */}
      {swapFor && (
        <KidSwapSheet
          token={token}
          quest={swapFor}
          onClose={() => setSwapFor(null)}
          onSent={msg => {
            setSwapFor(null)
            setToast(msg)
            setTimeout(() => setToast(null), 4200)
          }}
        />
      )}

      {toast && (
        <div style={{
          position: 'fixed', top: 'max(16px, env(safe-area-inset-top))', left: '16px', right: '16px', zIndex: 50,
          display: 'flex', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <div style={{
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '14px', padding: '12px 18px', maxWidth: '420px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', textAlign: 'center',
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}>
            {toast}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link
          href={`/k/${token}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.04em',
            color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: 16,
          }}
        >
          ← Back
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 6px', color: 'var(--ink)' }}>
          Do these jobs
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          Tick a job when it is done in real life. Your grown up approves it and the stars are yours.
        </p>

        {quests.length === 0 ? (
          <div style={{
            background: '#fff', border: '2px solid var(--border)', borderRadius: 20,
            boxShadow: '0 5px 0 var(--border)', padding: '20px 18px',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3 }}>
              No jobs today
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              When your grown up sends one, it lands here. You can pitch your own idea from your home screen any time.
            </p>
          </div>
        ) : (
          <KidTodayList
            jobsOnly
            childName={childName}
            stageId={stageId}
            buddyName={who.name}
            buddyImg={who.img}
            buddyIsStar={who.key === 'digi'}
            quests={quests}
            ticks={ticks}
            onToggleQuest={q => toggle(q)}
            burstQuestId={burst}
            giftStarsOwed={giftStarsOwed}
            inkSoft="rgba(26,26,46,0.60)"
            onSwapAsk={q => { playKidSound('tap'); setSwapFor(q) }}
            onCelebrate={() => {
              playKidSound('done')
              setHappyNews({
                character: who.key === 'digi' ? 'digi' : (who.key as CharacterKey),
                headline: 'Every job is done! 🎉',
                sub: `The whole list, ${childName}. Back to your five a day…`,
              })
              // Straight back to the next step, no tap needed. Justin, 11
              // August 2026: "Once today's jobs are done can it return
              // straight to next step on homepage."
              //
              // Two halves. The step is ticked FROM HERE, fire and forget
              // (the ask page's own pattern), so the five a day already shows
              // the next step the moment home paints rather than ticking jobs
              // in front of the child a beat after they arrive. Then a short
              // pause so the celebration lands as a celebration, and a full
              // navigation rather than a client push, so home renders fresh
              // from the server exactly as if they had walked back.
              fetch('/api/kid/day', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, step: 'jobs' }),
              }).catch(() => { /* home's own effect ticks it on arrival */ })
              setTimeout(() => { window.location.assign(`/k/${token}`) }, 1800)
            }}
          />
        )}
      </div>
    </div>
  )
}
