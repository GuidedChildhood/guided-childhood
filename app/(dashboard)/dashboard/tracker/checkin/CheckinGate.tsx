'use client'

import { useState } from 'react'
import TrackerForm, { type WellbeingCheck } from '../TrackerForm'
import WellbeingConsent from '@/components/tracker/WellbeingConsent'

// Consent first, then the form. Nothing about a child's wellbeing is written
// until a parent has said yes to it specifically.

export default function CheckinGate({
  hasConsent, history, currentWeekCheck, streakWeeks, actionsThisWeek,
}: {
  hasConsent: boolean
  history: WellbeingCheck[]
  currentWeekCheck: WellbeingCheck | null
  streakWeeks: number
  actionsThisWeek: number
}) {
  const [agreed, setAgreed] = useState(hasConsent)
  if (!agreed) return <WellbeingConsent onAgreed={() => setAgreed(true)} />
  return (
    <TrackerForm
      history={history}
      currentWeekCheck={currentWeekCheck}
      streakWeeks={streakWeeks}
      actionsThisWeek={actionsThisWeek}
    />
  )
}
