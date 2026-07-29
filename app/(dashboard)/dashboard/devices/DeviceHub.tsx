'use client'

import { useState } from 'react'
import DeviceCoverageBoard from './DeviceCoverageBoard'
import DeviceList, { type DeviceGuide } from './DeviceList'
import YourScreens from '@/components/devices/YourScreens'

// Owns the one shared truth for the devices page: which devices are set up,
// which the family does not have yet, which guide is open, and what is mid
// save.
//
// The order here is the point. The family's own screens come first and carry
// their own guides, because that is the list a parent came to read. The
// coverage board sits under it for the layers it alone covers, the network and
// the apps. The full catalogue is last and folded away, so it is still there
// for the parent who wants to read the Xbox guide without owning an Xbox, and
// is no longer a second list of devices competing with the first.
export default function DeviceHub({
  devices,
  childAge,
  childName,
  initialCompleted,
  initialNotOwned = [],
}: {
  devices: DeviceGuide[]
  childAge: number
  childName?: string | null
  initialCompleted: string[]
  initialNotOwned?: string[]
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [notOwned, setNotOwned] = useState<Set<string>>(new Set(initialNotOwned))
  const [pending, setPending] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  // The catalogue is shut until asked for. A coverage board tile still opens
  // it, because that tile's job is to take you to the guide behind it and a
  // guide inside a collapsed section is a dead link.
  const [catalogueOpen, setCatalogueOpen] = useState(false)

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
      <YourScreens
        guides={devices}
        childAge={childAge}
        childName={childName}
        completed={completed}
        notOwned={notOwned}
        pending={pending}
        onToggleGuide={toggle}
        onNotOwned={markNotOwned}
      />

      <DeviceCoverageBoard
        devices={devices}
        childAge={childAge}
        completed={completed}
        notOwned={notOwned}
        pending={pending}
        onToggle={toggle}
        onOpen={key => { setCatalogueOpen(true); openGuide(key) }}
        onRestore={restore}
      />

      {/* The whole catalogue, folded away. Before this it was a permanent
          second list of devices sitting under the family's own, which is the
          two lists Justin could not tell apart. It is still one tap from here,
          because a parent who wants to read a guide for something they do not
          own yet should be able to. */}
      <div style={{ marginTop: 8 }}>
        <button
          type="button"
          onClick={() => setCatalogueOpen(o => !o)}
          aria-expanded={catalogueOpen}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 10, background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16,
            padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.25 }}>
              Browse every guide
            </span>
            <span style={{ display: 'block', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
              All {devices.length} of them, including things you do not have yet.
            </span>
          </span>
          <span aria-hidden style={{ fontSize: 16, color: 'var(--ink-muted)', flexShrink: 0, transform: catalogueOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </button>

        {catalogueOpen && (
          <div style={{ marginTop: 16 }}>
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
          </div>
        )}
      </div>
    </>
  )
}
