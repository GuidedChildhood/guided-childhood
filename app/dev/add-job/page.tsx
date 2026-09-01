'use client'

import { useEffect, useState } from 'react'
import JobPicker, { type PickerJob } from '@/components/quests/JobPicker'

// The job picker on its own, with fixture data, so it can be screenshotted
// and tapped through without a parent session. ?age=4-7 picks the stage,
// ?app=0 shows the no app wording, ?fail=1 makes every add fail. The query
// is read after mount so the first client paint matches the server's.
export default function DevAddJob() {
  const [age, setAge] = useState('8-10')
  const [hasApp, setHasApp] = useState(true)
  const [fail, setFail] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setAge(params.get('age') ?? '8-10')
    setHasApp(params.get('app') !== '0')
    setFail(params.get('fail') === '1')
  }, [])
  const [board, setBoard] = useState<string[]>(['Homework before screens'])
  const [log, setLog] = useState<string[]>([])

  async function onAdd(job: PickerJob) {
    await new Promise(r => setTimeout(r, 450))
    if (fail) return false
    setBoard(b => [...b, job.title])
    setLog(l => [...l, `${job.emoji} ${job.title} · ${job.schedule} · ${job.stars} stars · ${job.band ?? 'auto'}`])
    return true
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '22px 20px 120px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>Dev fixture</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
          Alfie&apos;s jobs
        </h1>
        <JobPicker
          childName="Alfie"
          ageBand={age}
          hasApp={hasApp}
          onBoard={board}
          previous={[
            { title: 'My maths practice', emoji: '✏️', stars: 2, schedule: 'weekdays' },
            { title: 'Wash the car', emoji: '🚗', stars: 3, schedule: 'weekend' },
            { title: 'Turn millilitres on bottles into litres and back', emoji: '🧃', stars: 2, schedule: 'once' },
            { title: 'Breakfast eaten and cleared', emoji: '🥣', stars: 1, schedule: 'weekdays' },
          ]}
          onAdd={onAdd}
        />
        {log.length > 0 && (
          <pre data-log style={{ fontSize: 12, whiteSpace: 'pre-wrap', color: 'var(--ink-soft)' }}>{log.join('\n')}</pre>
        )}
      </div>
    </div>
  )
}
