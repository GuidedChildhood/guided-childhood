'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// The year a teacher picked, remembered on this laptop only, so the second
// visit opens straight on their lessons. Nothing leaves the browser.
const KEY = 'gc-start-stage'

export default function RememberYear({ stage, stages, picking }: { stage: string | null; stages: string[]; picking: boolean }) {
  const router = useRouter()
  useEffect(() => {
    try {
      if (stage) { localStorage.setItem(KEY, stage); return }
      // Change year: show the picker, never bounce back to the saved one.
      if (picking) return
      const saved = localStorage.getItem(KEY)
      if (saved && stages.includes(saved)) router.replace(`/start?stage=${saved}`)
    } catch { /* private window: the picker simply shows */ }
  }, [stage, stages, picking, router])
  return null
}
