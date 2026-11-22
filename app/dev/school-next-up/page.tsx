'use client'

import { useEffect, useState } from 'react'
import type { SchoolAction } from '@/components/school/SchoolActionsCard'
import SchoolNextUp from '@/components/school/SchoolNextUp'
import SchoolCatch from '@/components/school/SchoolCatch'
import SchoolMore from '@/components/school/SchoolMore'
import SchoolActionsCard from '@/components/school/SchoolActionsCard'

// Dev harness for the Next up view (22 November 2026). Dates are worked out
// from today so it never ages. ?empty=1 shows the all clear state.
const day = (n: number) => { const d = new Date(Date.now() + n * 86_400_000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const dow = (n: number) => new Date(Date.now() + n * 86_400_000).getDay()

const ACTIONS: SchoolAction[] = [ // stable identity: the card follows its prop
  { id: 'a1', kind: 'payment', title: 'Pay for the pantomime trip', detail: 'Six pounds on ParentPay.', due_date: day(-2), child_name: 'Olga' },
  { id: 'a2', kind: 'kit', title: 'Wellies for forest school', detail: 'In a named bag.', due_date: day(0), child_name: 'Teo' },
  { id: 'a3', kind: 'kit', title: 'PE kit', detail: null, due_date: null, recurs_weekday: dow(1), child_name: 'Olga' },
  { id: 'a4', kind: 'homework', title: 'Spelling test: words with ough', detail: null, due_date: day(3), child_name: 'Teo' },
  { id: 'a5', kind: 'notice', title: 'Inset day, school closed', detail: null, due_date: day(5) },
  { id: 'a6', kind: 'homework', title: 'Anderson shelter project', detail: 'Shoebox size.', due_date: day(12), child_name: 'Teo' },
  { id: 'a7', kind: 'event', title: 'Christmas jamboree', detail: null, due_date: day(24) },
  { id: 'a8', kind: 'kit', title: 'Library books', detail: null, due_date: null, recurs_weekday: dow(4) },
]

export default function Harness() {
  const [empty, set] = useState(false)
  useEffect(() => { set(new URLSearchParams(window.location.search).get('empty') === '1') }, [])
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '8px' }}>
        Coming up at school
      </h1>
      <SchoolNextUp key={String(empty)} actions={empty ? [] : ACTIONS} />
      <div style={{ height: 18 }} />
      <SchoolCatch />
      <SchoolMore label="Week view, routines and settings" hint="The whole week, weekly routines, your child's phone, email forwarding" ids={['school-actions', 'letterbox']}>
        <div id="school-actions"><SchoolActionsCard actions={empty ? [] : ACTIONS} childName="Teo" /></div>
        <div id="letterbox" style={{ marginTop: 24 }}><p>Letterbox goes here.</p></div>
      </SchoolMore>
    </div>
  )
}
