'use client'

import { useEffect, useState } from 'react'
import DigiWelcomeSheet from '@/components/digi/DigiWelcomeSheet'

// Dev fixture: DiGi's once a day greeting, in the two states it can drive.
//
//   /dev/digi-welcome            setup unfinished, so DiGi drives the setup
//                                steps: "Let us finish setting you up", the one
//                                step named, its place in the run, and a button
//                                that goes to it
//   /dev/digi-welcome?done=1     setup finished, so DiGi hands over to the day,
//                                which is the behaviour that was there before
//
// The real sheet needs a signed in parent whose setup is in exactly one of
// those states, which is why neither could be looked at before it shipped. It
// also gates itself on a day key, a session key and a cadence, so this clears
// them on mount: a fixture that shows nothing certifies nothing.

export default function DigiWelcomeFixture() {
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setDone(q.get('done') === '1')
    try {
      sessionStorage.removeItem('gc_digi_welcome_session')
      const today = new Date().toISOString().slice(0, 10)
      localStorage.removeItem(`gc_digi_welcome_${today}`)
      localStorage.removeItem(`gc_digi_prompt_${today}`)
      localStorage.removeItem('gc_welcome_count')
      localStorage.removeItem('gc_welcome_lastshown')
      localStorage.removeItem('gc_digi_setup_seen')
    } catch { /* private mode, the sheet simply may not show */ }
    setReady(true)
  }, [])

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '28px 20px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
      }}>
        Reference · DiGi comes up first · {done ? 'setup finished' : 'setup running'}
      </p>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 10, maxWidth: 420 }}>
        The sheet arrives on its own after a moment, the same as it does on Home.
        Tap through the two beats: the greeting, then the one thing.
      </p>

      {ready && (
        <DigiWelcomeSheet
          childrenInfo={[{ name: 'Nia', ageBand: '8-10' }]}
          guide={{
            stageNum: 2,
            stageName: 'Builder',
            childName: 'Nia',
            nextTask: { label: 'Your check in', href: '/dashboard/checkin' },
            setup: done ? null : {
              label: 'Add your other children',
              href: '/dashboard/setup#children',
              doneCount: 1,
              total: 4,
            },
            strands: [],
          }}
        />
      )}
    </main>
  )
}
