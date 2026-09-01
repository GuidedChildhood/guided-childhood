'use client'

import { useState } from 'react'
import DayCompleteFlow from '@/components/daily/DayCompleteFlow'

// Dev fixture for the day complete walk: done, balance, quests, tomorrow.
// The real thing opens once a day from TodayPathBig when the lead rung
// lands; this is the only way to tap through all four beats on demand.
export default function DayCloseFixture() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: 20 }}>
      {!open && (
        <button onClick={() => setOpen(true)} className="btn btn-gold" style={{ padding: '12px 20px' }}>
          Replay the close
        </button>
      )}
      {open && (
        <DayCompleteFlow
          childName="Teo"
          childId={null}
          streakCount={4}
          facts={{
            next_line: 'A lesson day: the next one Teo needs for their age',
            guide_mins: 75,
            band_label: '8 to 10',
          }}
          quests={{ label: 'Approve', href: '#', done: false }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
