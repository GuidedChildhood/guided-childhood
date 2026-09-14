'use client'

import { useEffect, useState } from 'react'
import JobPicker, { type PickerJob } from '@/components/quests/JobPicker'
import JobComposer from '@/components/quests/JobComposer'
import JobGuideCard from '@/components/quests/JobGuideCard'
import { jobGuide } from '@/lib/quests/job-guide'

// The add a job screen, with fixture data, so it can be screenshotted and
// tapped through without a parent session. ?age=4-7 picks the stage, ?app=0
// shows the no app wording, ?fail=1 makes every add fail. The query is read
// after mount so the first client paint matches the server's.
//
// The COMPOSER is here too, not just the picker. Justin's complaint on
// 10 September 2026 was about the page, and the page is the composer and the
// picker stacked: measuring the picker alone would have missed the thirty one
// word help sentence sitting above it, which was the single longest block of
// text on the screen.
export default function DevAddJob() {
  const [age, setAge] = useState('8-10')
  const [hasApp, setHasApp] = useState(true)
  const [fail, setFail] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setAge(params.get('age') ?? '8-10')
    setHasApp(params.get('app') !== '0')
    setFail(params.get('fail') === '1')
    // ?board=12 seeds twelve daily jobs on the board, the state Justin hit on
    // 14 September 2026; ?weeks=2 says two weeks went well. The guide card
    // reads both.
    const n = Number(params.get('board') ?? '1')
    if (Number.isFinite(n) && n > 1) setBoard(Array.from({ length: n }, (_, i) => i === 0 ? 'Homework before screens' : `Seeded job ${i + 1}`))
    const w = Number(params.get('weeks') ?? '0')
    if (Number.isFinite(w) && w > 0) {
      // Four ticks inside each week, Monday to Thursday, so a week reads as
      // going well whatever today's weekday is.
      const monday = new Date(); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
      const dates: string[] = []
      for (let k = 0; k < w; k++) for (let d = 0; d < 4; d++) {
        const x = new Date(monday); x.setDate(monday.getDate() - k * 7 + d)
        dates.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`)
      }
      setApproved(dates)
    }
  }, [])
  const [board, setBoard] = useState<string[]>(['Homework before screens'])
  const [approved, setApproved] = useState<string[]>([])
  const guide = jobGuide(age, board.length, approved)
  const [log, setLog] = useState<string[]>([])

  async function onAdd(job: PickerJob) {
    await new Promise(r => setTimeout(r, 450))
    if (fail) return false
    setBoard(b => [...b, job.title])
    const when = job.scheduleDays?.length ? `days ${job.scheduleDays.join(',')}` : job.schedule
    setLog(l => [...l, `${job.emoji} ${job.title} · ${when} · ${job.stars} stars · ${job.band ?? 'auto'}`])
    return true
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '22px 20px 120px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>Dev fixture</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
          Alfie&apos;s jobs
        </h1>
        <section style={{ background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '18px 14px 16px', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Add a job</h2>
          <JobComposer
            countToday={board.length}
            comfortable={guide.guide}
            ageBand={age}
            childName="Alfie"
            placeholder="Feed the dog, violin"
            help="Worth one star, or make it a family job. You pick how often next."
            onAdd={(t, when, band, days, familyJob) => { setBoard(b => [...b, t]); setLog(l => [...l, `typed: ${t} · ${when} · ${band ?? 'auto'} · ${familyJob ? 'family job' : '1 star'}`]) }}
          />
        </section>
        <JobGuideCard guide={guide} childName="Alfie" onSeeJobs={() => setLog(l => [...l, 'trim: see their jobs'])} />
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
