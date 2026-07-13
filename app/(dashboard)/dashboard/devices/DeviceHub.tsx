'use client'

import { useState } from 'react'
import DeviceCoverageBoard from './DeviceCoverageBoard'
import DeviceList, { type DeviceGuide } from './DeviceList'

// Owns the one shared truth for the devices page: which devices are set up,
// which guide is open, and what is mid save. The coverage board reads it for
// the ring and the layers, the guide list reads it for the ticks, and a
// board tile opens the matching guide below. One state, two views, always in
// sync.
export default function DeviceHub({
  devices,
  childAge,
  initialCompleted,
}: {
  devices: DeviceGuide[]
  childAge: number
  initialCompleted: string[]
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [pending, setPending] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)

  async function toggle(key: string) {
    setPending(key)
    const isDone = completed.has(key)
    setCompleted(prev => {
      const next = new Set(prev)
      if (isDone) next.delete(key)
      else next.add(key)
      return next
    })
    try {
      await fetch('/api/devices/complete', {
        method: isDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: key }),
      })
    } catch { /* non blocking, the local state already moved */ }
    setPending(null)
  }

  // A board tile opens its guide below and scrolls it into view.
  function openGuide(key: string) {
    setOpenKey(key)
    if (typeof document !== 'undefined') {
      requestAnimationFrame(() => {
        document.getElementById(`device-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  return (
    <>
      <DeviceCoverageBoard
        devices={devices}
        childAge={childAge}
        completed={completed}
        pending={pending}
        onToggle={toggle}
        onOpen={openGuide}
      />
      <DeviceList
        devices={devices}
        childAge={childAge}
        completed={completed}
        pending={pending}
        onToggle={toggle}
        openKey={openKey}
        setOpenKey={setOpenKey}
      />
    </>
  )
}
