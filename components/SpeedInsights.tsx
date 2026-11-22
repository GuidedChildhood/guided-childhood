'use client'

import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'
import { speedBeforeSend } from '@/lib/analytics/speed-policy'

// Real phone page speed for the public pages only. The rule is in
// lib/analytics/speed-policy.ts; this wrapper exists because the layout is a
// server component and cannot hand a function to a client one.
export default function SpeedInsights() {
  return <VercelSpeedInsights beforeSend={speedBeforeSend} />
}
