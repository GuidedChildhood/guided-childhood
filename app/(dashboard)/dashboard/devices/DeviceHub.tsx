'use client'

import { useState } from 'react'
import { currentChildId } from '@/lib/children/current'
import DeviceCoverageBoard from './DeviceCoverageBoard'
import DeviceList, { type DeviceGuide } from './DeviceList'
import YourScreens from '@/components/devices/YourScreens'
import type { FamilyDevice } from '@/lib/devices/family'

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
  initialDoneDevices = null,
  initialAgreed = [],
  initialAgreedDevices = null,
  initialAgreedNotes = {},
  from = null,
}: {
  devices: DeviceGuide[]
  childAge: number
  childName?: string | null
  initialCompleted: string[]
  initialNotOwned?: string[]
  /** Screens ticked one by one. null when migration 169 has not been run. */
  initialDoneDevices?: string[] | null
  /** Guides answered with an agreement rather than settings (migration 306). */
  initialAgreed?: string[]
  initialAgreedDevices?: string[] | null
  /** What was agreed, keyed by screen id where we have one, guide key otherwise. */
  initialAgreedNotes?: Record<string, string>
  from?: string | null
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted))
  const [notOwned, setNotOwned] = useState<Set<string>>(new Set(initialNotOwned))
  const [doneDevices, setDoneDevices] = useState<Set<string> | null>(
    initialDoneDevices ? new Set(initialDoneDevices) : null
  )
  // ── AGREED, THE THIRD ANSWER (17 September 2026) ──────────────────────────
  //
  // Justin: "don't want to force then never able to complete stage of passport
  // ... maybe override which just means a note added device settings agreed but
  // set trust child."
  //
  // Agreed lives ALONGSIDE done rather than instead of it: an agreed screen is
  // in `completed` and in `doneDevices` too, because that is what makes the
  // passport count it, and it is in these sets as well, because that is what
  // makes every surface say Agreed rather than claim the settings are on. One
  // set answering both questions is how a screen ends up counted but described
  // wrongly, which on this page is the difference between a decision and a lie.
  const [agreed, setAgreed] = useState<Set<string>>(new Set(initialAgreed))
  const [agreedDevices, setAgreedDevices] = useState<Set<string>>(new Set(initialAgreedDevices ?? []))
  const [agreedNotes, setAgreedNotes] = useState<Record<string, string>>(initialAgreedNotes)
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
    // An AGREED guide is counted as done and is not TICKED, so the button on it
    // has to offer the settings rather than offer to untick them. Without this
    // the one gold button on an agreed screen would send a DELETE and quietly
    // take the family's decision off the board.
    const isDone = completed.has(key) && !agreed.has(key)
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
    // Set up and unticked both end an agreement. Settings that are actually on
    // must not keep a line underneath saying they were never turned on, and an
    // untick means there is nothing here to describe at all.
    clearAgreedGuide(key)
    try {
      await fetch('/api/devices/complete', {
        method: isDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isDone ? { device_key: key } : { device_key: key, status: 'done' }),
      })
    } catch { /* non blocking, the local state already moved */ }
    setPending(null)
  }

  // Tick ONE screen, not every screen its guide happens to cover.
  //
  // Justin, 8 August 2026: "I've added these devices and it is automatically
  // saying set up although I haven't." An iPad added that morning was already
  // ticked, because the guide behind it, "iPhone and iPad", had been worked
  // through on the iPhone in July. Screen Time is set on the device, so that
  // tick was the app claiming a child was protected on a screen nobody had
  // touched.
  //
  // The guide still goes green with it, because working through the settings on
  // a real screen is exactly what the coverage board is counting. Only the
  // reverse is no longer true.
  //
  // lastForGuide comes from the list itself: whether any other live screen this
  // guide covers is still ticked. Unticking the iPad should not pull the board
  // out from under an iPhone that is genuinely done.
  async function toggleDevice(d: FamilyDevice, lastForGuide: boolean) {
    if (!d.guideKey) return
    // Before 169 there is nowhere to record a single screen, so this is the old
    // behaviour rather than a button that silently does nothing.
    if (doneDevices === null) { await toggle(d.guideKey); return }

    const isDone = doneDevices.has(d.id) && !agreedDevices.has(d.id)
    setPending(d.id)
    setDoneDevices(prev => {
      const next = new Set(prev)
      if (isDone) next.delete(d.id)
      else next.add(d.id)
      return next
    })
    if (isDone) {
      if (lastForGuide) setCompleted(prev => { const n = new Set(prev); n.delete(d.guideKey as string); return n })
    } else {
      setCompleted(prev => new Set(prev).add(d.guideKey as string))
      setNotOwned(prev => { const n = new Set(prev); n.delete(d.guideKey as string); return n })
    }
    clearAgreedDevice(d)
    try {
      await fetch('/api/devices/complete', {
        method: isDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isDone
            ? { device_key: d.guideKey, family_device_id: d.id }
            : { device_key: d.guideKey, family_device_id: d.id, status: 'done' }
        ),
      })
    } catch { /* non blocking, the local state already moved */ }
    setPending(null)
  }

  // ── AGREED, RATHER THAN SET UP ────────────────────────────────────────────
  //
  // The third answer. This screen is in the house, the family have talked about
  // it, and they have decided it runs on an agreement rather than on controls.
  //
  // It writes status 'agreed' with one line of what was agreed, and it moves
  // the screen into `completed` and `doneDevices` at the same time, because
  // that is the set the passport counts and this is meant to unlock the stage.
  // Never allow or deny: a family who parents by talking has to be able to get
  // through a gate built for a family who parents by settings.
  function clearAgreedGuide(key: string) {
    setAgreed(prev => { const n = new Set(prev); n.delete(key); return n })
    setAgreedNotes(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  function clearAgreedDevice(d: FamilyDevice) {
    setAgreedDevices(prev => { const n = new Set(prev); n.delete(d.id); return n })
    setAgreedNotes(prev => { const n = { ...prev }; delete n[d.id]; return n })
    if (d.guideKey) clearAgreedGuide(d.guideKey)
  }

  async function agreeGuide(key: string, note: string) {
    setPending(key)
    setCompleted(prev => new Set(prev).add(key))
    setNotOwned(prev => { const n = new Set(prev); n.delete(key); return n })
    setAgreed(prev => new Set(prev).add(key))
    setAgreedNotes(prev => ({ ...prev, [key]: note }))
    if (openKey === key) setOpenKey(null)
    try {
      await fetch('/api/devices/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: key, status: 'agreed', note, child_id: currentChildId() }),
      })
    } catch { /* non blocking, the local state already moved */ }
    setPending(null)
  }

  // One screen agreed, not every screen its guide covers, for the same reason
  // ticking one iPad must not tick the iPhone beside it. Before 169 there is
  // nowhere to record a single screen, so it falls back to the guide.
  async function agreeDevice(d: FamilyDevice, note: string) {
    if (!d.guideKey) return
    if (doneDevices === null) { await agreeGuide(d.guideKey, note); return }

    setPending(d.id)
    setDoneDevices(prev => new Set(prev).add(d.id))
    setAgreedDevices(prev => new Set(prev).add(d.id))
    setAgreedNotes(prev => ({ ...prev, [d.id]: note }))
    setCompleted(prev => new Set(prev).add(d.guideKey as string))
    setAgreed(prev => new Set(prev).add(d.guideKey as string))
    setNotOwned(prev => { const n = new Set(prev); n.delete(d.guideKey as string); return n })
    try {
      await fetch('/api/devices/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_key: d.guideKey, family_device_id: d.id, status: 'agreed', note, child_id: currentChildId() }),
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
        body: JSON.stringify({ device_key: key, status: 'not_owned', child_id: currentChildId() }),
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
        body: JSON.stringify({ device_key: key, child_id: currentChildId() }),
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
        doneDevices={doneDevices}
        pending={pending}
        onToggleDevice={toggleDevice}
        onNotOwned={markNotOwned}
        agreedDevices={agreedDevices}
        agreedNotes={agreedNotes}
        onAgreeDevice={agreeDevice}
        from={from}
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
            gap: 10, background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-btn)', boxShadow: 'var(--lift)',
            padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
              Browse every guide
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
              All {devices.length} of them, including things you do not have yet.
            </span>
          </span>
          <span aria-hidden style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', flexShrink: 0, transform: catalogueOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
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
