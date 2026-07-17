'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STEPS, type SetupFlags } from './SetupPath'

// One minute into a visit, one gentle prompt: the next setup step that
// is still waiting (notifications, quests, the school catcher), with
// Start or Not now. Not now snoozes that step for a day, and only one
// nudge ever shows per visit, because prompts that nag get dismissed
// forever.

const SNOOZE_MS = 24 * 60 * 60 * 1000
const SHOW_AFTER_MS = 60 * 1000

export default function SetupNudge({ flags }: { flags: SetupFlags }) {
  const router = useRouter()
  const [step, setStep] = useState<(typeof STEPS)[number] | null>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('gc_nudged') === '1') return
    const now = Date.now()
    const next = STEPS.find(s => {
      if (flags[s.key]) return false
      const snoozed = Number(localStorage.getItem(`gc_nudge_${s.key}`) ?? 0)
      return now - snoozed > SNOOZE_MS
    })
    if (!next) return
    const id = setTimeout(() => {
      sessionStorage.setItem('gc_nudged', '1')
      setStep(next)
      requestAnimationFrame(() => setEntered(true))
    }, SHOW_AFTER_MS)
    return () => clearTimeout(id)
  }, [flags])

  if (!step) return null

  function dismiss() {
    if (step) localStorage.setItem(`gc_nudge_${step.key}`, String(Date.now()))
    setEntered(false)
    setTimeout(() => setStep(null), 400)
  }

  function start() {
    if (!step) return
    setEntered(false)
    router.push(step.href)
    setTimeout(() => setStep(null), 400)
  }

  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 'calc(84px + env(safe-area-inset-bottom))',
      transform: entered ? 'translate(-50%, 0)' : 'translate(-50%, 24px)',
      opacity: entered ? 1 : 0,
      transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
      zIndex: 70, width: 'min(94vw, 430px)',
    }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '22px',
        padding: '18px 20px', boxShadow: '0 2px 4px rgba(26,26,46,0.04), 0 18px 44px -12px rgba(26,26,46,0.26)',
      }}>
        <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <span style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: '14px',
            background: 'var(--terracotta)', boxShadow: '0 4px 0 var(--terracotta-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <DigiCharacter mood="speak" size={30} once />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
              Two minutes, big payoff
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2 }}>
              {step.title}
            </span>
            <span style={{ display: 'block', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {step.what}
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={start}
            style={{
              flex: 1, padding: '13px', background: 'var(--terracotta)', color: 'var(--ink)',
              border: 'none', borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              boxShadow: '0 3px 0 var(--terracotta-dark)',
            }}
          >
            Start
          </button>
          <button
            onClick={dismiss}
            style={{
              padding: '13px 18px', background: '#fff', color: 'var(--ink-soft)',
              border: '1.5px solid var(--border)', borderRadius: '14px', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px',
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
