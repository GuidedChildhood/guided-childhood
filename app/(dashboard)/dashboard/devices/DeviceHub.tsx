'use client'

import { useState } from 'react'
import DeviceCoverageBoard from './DeviceCoverageBoard'
import DeviceList, { type DeviceGuide } from './DeviceList'

// Owns the one shared truth for the devices page: which devices are set up,
// which the family does not have yet, which guide is open, and what is mid
// save. The coverage board reads it for the ring and the layers, the guide
// list reads it for the ticks, and a board tile opens the matching guide
// below. One state, three views, always in sync.
export default function DeviceHub({
  devices,
  childAge,
  initialCompleted,
  initialNotOwned = [],
}: {
  devices: DeviceGuide[]
  childAge: number
  initialCompleted: string[]
  initialNotOwned?: string[]
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [notOwned, setNotOwned] = useState<Set<string>>(new Set(initialNotOwned))
  const [pending, setPending] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Mark set up, or undo it. When a device flips to done its open guide
  // closes, so the row visibly settles into the done group instead of leaving
  // the walkthrough hanging open.
  async function toggle(key: string) {
    setPending(key)
    const isDone = completed.has(key)
    setCompleted(prev => {
      const next = new Set(prev)
      if (isDone) next.delete(key)
      else next.add(key)
      return next
    })
    if (!isDone) {
      setNotOwned(prev => { const n = new Set(prev); n.delete(key); return n })
      if (openKey === key) setOpenKey(null)
    }
    try {
      await fetch('/api/devices/complete', {
        method: isDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isDone ? { device_key: key } : { device_key: key, status: 'done' }),
      })
    } catch { /* non blocking, the local state already moved */ }
    setPending(null)
  }

  // We do not have this yet: drop it off the active checklist and the ring,
  // but keep it recorded so it can be found again the day it arrives.
  async function markNotOwned(key: string) {
    setPending(key)
    setNotOwned(prev => { const n = new Set(prev); n.add(key); return n })
    setCompleted(prev => { const n = new Set(prev); n.delete(key); return n })
    if (openKey === key) setOpenKey(null)
    try {
      await fetch('/api/devices/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: key, status: 'not_owned' }),
      })
    } catch { /* non blocking */ }
    setPending(null)
  }

  // Bring a not owned device back onto the active checklist (they got it).
  async function restore(key: string) {
    setPending(key)
    setNotOwned(prev => { const n = new Set(prev); n.delete(key); return n })
    try {
      await fetch('/api/devices/complete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: key }),
      })
    } catch { /* non blocking */ }
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
        notOwned={notOwned}
        pending={pending}
        onToggle={toggle}
        onOpen={openGuide}
        onRestore={restore}
      />
      <DeviceList
        devices={devices}
        childAge={childAge}
        completed={completed}
        notOwned={notOwned}
        pending={pending}
        onToggle={toggle}
        onNotOwned={markNotOwned}
        onRestore={restore}
        openKey={openKey}
        setOpenKey={setOpenKey}
      />
    </>
  )
}
