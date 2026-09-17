'use client'

import { useEffect, useMemo, useState } from 'react'
import { currentChildId } from '@/lib/children/current'
import type { DeviceKind } from '@/lib/quests/device-time'
import GuideBody from './GuideBody'
import type { DeviceGuide } from '@/app/(dashboard)/dashboard/devices/DeviceList'
import {
  DEVICE_SUGGESTIONS, deviceIcon, deviceIsDone, KIND_LABEL,
  type FamilyDevice,
} from '@/lib/devices/family'

// One list of screens, not two.
//
// The page used to show a parent their own two devices in one card and our
// twenty six published guides in another, with a coverage ring counting a third
// thing again. Justin, looking at his own phone: "still a bit unclear on
// devices, it's confusing, have 2 lists". He was right, and the loop he asked
// for is the one every app in this category already uses.
//
// Checked against the references first, per the Mobbin first rule. Google Home,
// SmartThings, Roku and Alexa all show one list, your devices, plus a single
// add control. None of them shelves a catalogue beside it. Alexa goes further
// and puts the suggestions inside the same list as dashed rows you have not got
// yet, which is exactly the "suggested list of devices by age" Justin
// described. Chime, Deel and Revolut answer the other half: the status lives on
// the row, so you tap it, do the thing, and come back to a row that has
// changed.
//
// So: your devices, each carrying its own status and its own guide. Then the
// suggestions, dashed, clearly not yours yet. Then one way to add anything
// else. The catalogue is still reachable, it is just no longer competing.
//
// The data already worked this way. family_devices.guide_key has always pointed
// at device_guides.device_key and homeSetupCount has always counted the family's
// own list. Only the screen was telling a different story.

type Props = {
  guides: DeviceGuide[]
  childAge: number
  childName?: string | null
  completed: Set<string>
  notOwned: Set<string>
  /** Screens ticked one by one. null when migration 169 has not been run. */
  doneDevices: Set<string> | null
  pending: string | null
  onToggleDevice: (device: FamilyDevice, lastForGuide: boolean) => void
  onNotOwned: (key: string) => void
  /** Screens answered with an agreement rather than settings (migration 306). */
  agreedDevices: Set<string>
  /** What was agreed, keyed by screen id where we have one, guide key otherwise. */
  agreedNotes: Record<string, string>
  onAgreeDevice: (device: FamilyDevice, note: string) => void
}

// ── WHAT A FAMILY MIGHT HAVE AGREED ───────────────────────────────────────
//
// Three starters, so the note is one tap for most people and still their own
// words for anyone who wants to type. Every one of them is a real arrangement
// a family makes rather than a way of saying no controls: the decision is the
// thing being recorded, and a blank note would make this an override button.
const AGREED_STARTERS = [
  'We use it in the front room, not bedrooms',
  'Screens go on the shelf at bedtime',
  'They ask before downloading anything new',
]

const CARD: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
  padding: '18px 18px 20px', marginBottom: 20, boxShadow: 'var(--lift)',
}

const LINK_BTN: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  color: 'var(--terracotta)', letterSpacing: '0.04em', padding: '4px 2px',
}

export default function YourScreens({
  guides, childAge, childName, completed, notOwned, doneDevices, pending, onToggleDevice, onNotOwned,
  agreedDevices, agreedNotes, onAgreeDevice,
}: Props) {
  const [devices, setDevices] = useState<FamilyDevice[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const [showRetired, setShowRetired] = useState(false)
  // SOMETHING ELSE. Justin, 14 September 2026, on the add a device list: "should
  // we have Other, please add, that messages hello@". Fourteen names cover most
  // houses and not every house. A parent with a Steam Deck or a Meta Quest used
  // to reach "Nothing matching" and a pointer to the bottom of the page. Now
  // they name it, say what kind of thing it is (so the timer and the guides
  // still work), and it lands on their list like any other device. The route
  // tells hello@ what was named, so the catalogue grows from real homes rather
  // than guesses, and the next family finds it in the list.
  // Which screen is mid agreement, and the words so far. One at a time, the
  // same as renaming, because two open note fields on a phone is two things
  // half done.
  const [agreeing, setAgreeing] = useState<string | null>(null)
  const [agreeDraft, setAgreeDraft] = useState('')
  const [other, setOther] = useState(false)
  const [otherLabel, setOtherLabel] = useState('')
  const [otherKind, setOtherKind] = useState<DeviceKind | null>(null)
  const [otherAdded, setOtherAdded] = useState<string | null>(null)
  // Suggestions a parent has waved away this visit. Not persisted: a dismissed
  // suggestion is "not today", not "never", and a family that buys a Switch in
  // October should see it offered again.
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch(`/api/devices/family${currentChildId() ? `?child=${currentChildId()}` : ''}`)
      const data = await res.json()
      setDevices(Array.isArray(data.devices) ? data.devices : [])
    } catch { setDevices([]) }
  }

  async function add(label: string, kind: string, guideKey: string | null, isOther = false) {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/devices/family', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // The open child owns what is added here. Justin, 19 August 2026:
        // adding for Tray showed Jody's list too. A device is a per child
        // label since migration 217, so Tray's Smart TV and Jody's Smart TV
        // are two rows with two setups and two timers.
        // `other` marks a device we do not list, so the route can tell hello@.
        body: JSON.stringify({ markAsked: true, child_id: currentChildId(), devices: [{ label, kind, guideKey, other: isOther }] }),
      })
      await load()
    } finally { setBusy(false) }
  }

  function startOther() {
    setOther(true)
    setOtherLabel(query.trim())
    setOtherKind(null)
    setOtherAdded(null)
  }

  async function addOther() {
    const label = otherLabel.trim()
    if (!label || !otherKind || busy) return
    await add(label, otherKind, null, true)
    setOtherAdded(label)
    setOther(false)
    setOtherLabel('')
    setOtherKind(null)
    setPicking(false)
    setQuery('')
  }

  async function patch(id: string, body: Record<string, unknown>) {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/devices/family', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      })
      await load()
    } finally { setBusy(false) }
  }

  const guideFor = useMemo(() => {
    const byKey = new Map(guides.map(g => [g.device_key, g]))
    return (key: string | null) => (key ? byKey.get(key) ?? null : null)
  }, [guides])

  if (devices === null) {
    return <div style={{ ...CARD, height: 160, opacity: 0.4 }} aria-hidden />
  }

  const live = devices.filter(d => !d.retiredAt)
  const retired = devices.filter(d => d.retiredAt)
  const name = childName && childName !== 'Your child' ? childName : null

  // A screen is done when THAT screen has been worked through, not when a guide
  // that happens to cover it has. "iPhone and iPad" is one guide over two
  // devices, and reading the guide is what told Justin an iPad he had just
  // added was already set up. One a parent named themselves, with no guide
  // behind it, is not a job we set them, so it never sits there looking
  // unfinished. See deviceIsDone for the fallback before migration 169.
  const isDone = (d: FamilyDevice) => deviceIsDone(d, completed, doneDevices)
  const doneCount = live.filter(isDone).length
  // Agreed rather than set up. Hoisted rather than worked out per row, because
  // the summary line above the list has to answer the same question the rows
  // do: "4 of 4 set up" over two screens a family deliberately left without
  // controls is the same untruth the row copy exists to avoid, said once at the
  // top where it is read first.
  const isAgreedDevice = (d: FamilyDevice) => isDone(d) && (doneDevices
    ? agreedDevices.has(d.id)
    : !!d.guideKey && agreedDevices.has(d.guideKey))
  const agreedCount = live.filter(isAgreedDevice).length

  // Is this the last screen still ticked for its guide? The guide row only
  // comes off the board when it is.
  const lastForGuide = (d: FamilyDevice) =>
    !live.some(other => other.id !== d.id && other.guideKey === d.guideKey && isDone(other))

  // What to suggest. Age matched, not already in the house, not waved away, and
  // capped at four so it reads as a hint rather than a second catalogue.
  const haveGuideKeys = new Set(live.map(d => d.guideKey).filter(Boolean) as string[])
  const haveLabels = new Set(live.map(d => d.label.toLowerCase()))
  const suggestions = DEVICE_SUGGESTIONS
    .filter(s => !haveLabels.has(s.label.toLowerCase()))
    .filter(s => !s.guideKey || !haveGuideKeys.has(s.guideKey))
    .filter(s => !dismissed.has(s.label))
    .filter(s => !s.guideKey || !notOwned.has(s.guideKey))
    .filter(s => {
      const g = guideFor(s.guideKey)
      return !g || childAge >= g.min_age
    })
    .slice(0, 3)

  // The add picker searches our own suggestion names AND the guide names, so
  // typing Xbox finds it whether the parent thinks of it as a device we list or
  // a guide we publish.
  const q = query.trim().toLowerCase()
  const pickList = DEVICE_SUGGESTIONS.filter(s => {
    if (!q) return true
    if (s.label.toLowerCase().includes(q)) return true
    const g = guideFor(s.guideKey)
    return !!g && (g.name.toLowerCase().includes(q) || g.subtitle.toLowerCase().includes(q))
  })

  return (
    // The anchor the fortnightly sweep card scrolls to. That card asks whether
    // anything new has arrived; the answer to "yes" has to be this list, one
    // tap away, rather than a parent hunting for it down the page.
    <div id="your-screens" style={{ ...CARD, scrollMarginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0, letterSpacing: '-0.02em' }}>
          The screens in your home
        </h2>
        {live.length > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: agreedCount > 0 ? 'var(--stage-2-text)' : doneCount === live.length ? 'var(--retro-green)' : 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
            {agreedCount > 0
              ? `${doneCount} of ${live.length}, ${agreedCount} agreed`
              : `${doneCount} of ${live.length} set up`}
          </span>
        )}
      </div>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        {live.length === 0
          ? `Add what you actually have and each one arrives with its own settings guide, matched to ${name ? `${name}'s` : 'your child’s'} age. Nothing here is a rule, it is what most families set.`
          : 'Tap any screen to walk through its settings. Mark it set up and it ticks off here.'}
      </p>

      {/* The family's own screens. Status on the row, guide inside the row. */}
      {live.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {live.map(d => {
            const guide = guideFor(d.guideKey)
            const done = isDone(d)
            const open = openId === d.id
            // Pending is the screen's own id once each screen ticks on its own,
            // so two Apple devices do not both sit there spinning. Before 169
            // it is still the guide key, which is what toggling falls back to.
            const waiting = pending === d.id || (!doneDevices && !!d.guideKey && pending === d.guideKey)
            // Agreed rather than set up. Read per screen where we can, falling
            // back to the guide before 169, exactly as done does. It is a
            // narrowing of done, never a replacement for it: an agreed screen
            // is counted, and it is described honestly.
            const isAgreed = isAgreedDevice(d)
            const agreedNote = agreedNotes[d.id] ?? (d.guideKey ? agreedNotes[d.guideKey] : undefined)

            return (
              <div key={d.id} style={{
                border: 'var(--edge)',
                borderRadius: 'var(--radius-tile)', overflow: 'hidden',
                background: open ? 'var(--cream)' : '#fff',
                transition: 'background 0.15s',
              }}>
                {editing === d.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px' }}>
                    <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>{deviceIcon(d)}</span>
                    <input
                      className="input"
                      value={draft}
                      autoFocus
                      onChange={e => setDraft(e.target.value.slice(0, 60))}
                      onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) { patch(d.id, { label: draft }); setEditing(null) } }}
                      style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', padding: '8px 12px' }}
                    />
                    <button type="button" onClick={() => { if (draft.trim()) patch(d.id, { label: draft }); setEditing(null) }} style={LINK_BTN}>
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => (guide ? setOpenId(open ? null : d.id) : undefined)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                        padding: '12px 13px', background: 'none', border: 'none',
                        cursor: guide ? 'pointer' : 'default', textAlign: 'left',
                      }}
                    >
                      <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0 }}>{deviceIcon(d)}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
                          {d.label}
                        </span>
                        {/* The status a parent came here to read, on the row,
                            the way every setup checklist worth copying does it. */}
                        {/* AGREED IS NOT GREEN AND DOES NOT SAY SETTINGS.
                            It counts the same for the passport, and it must
                            never read the same on the row, or a parent glancing
                            down this list would believe controls are on where
                            they deliberately are not. Gold, its own word, and
                            the thing they agreed underneath in their own
                            sentence. */}
                        <span style={{
                          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                          letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2,
                          color: isAgreed ? 'var(--stage-2-text)' : done ? 'var(--retro-green)' : 'var(--terracotta-dark)',
                        }}>
                          {isAgreed
                            ? '🤝 Agreed'
                            : done ? (d.guideKey ? '✓ Settings in place' : KIND_LABEL[d.kind]) : 'Not set up yet'}
                        </span>
                        {isAgreed && agreedNote && (
                          <span style={{
                            display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)',
                            lineHeight: 1.4, marginTop: 3,
                          }}>
                            {agreedNote}
                          </span>
                        )}
                      </span>
                      {guide && (
                        <span aria-hidden style={{ fontSize: 'var(--text-md)', color: 'var(--ink-light)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                      )}
                    </button>

                    {open && guide && (
                      <GuideBody
                        guide={guide}
                        childAge={childAge}
                        isDone={done}
                        isAgreed={isAgreed}
                        busy={waiting}
                        onToggle={() => {
                          onToggleDevice(d, lastForGuide(d))
                          // Marking it done settles the row back into the list
                          // rather than leaving the walkthrough hanging open.
                          if (!done) setOpenId(null)
                        }}
                        footer={
                          <>
                            {/* ── THE WAY THROUGH THAT IS NOT A LIE ──────────
                                Justin, 17 September 2026: "don't want to force
                                then never able to complete stage of passport
                                ... maybe override which just means a note added
                                device settings agreed but set trust child."

                                Deliberately under the two buttons and in plain
                                text, not a third button beside them. The
                                settings are still the recommendation, and this
                                is the honest answer for a family who has
                                decided otherwise, not an equal option offered
                                to somebody who has not decided anything yet.

                                The note is required. A blank one would turn
                                this into a skip button, and what makes it worth
                                counting is that a decision was actually made
                                and written down. */}
                            {agreeing === d.id ? (
                              <div style={{
                                marginTop: 14, padding: '14px 14px 15px', background: '#fff',
                                border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
                              }}>
                                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 4px' }}>
                                  What have you agreed about the {d.label}?
                                </p>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 11px' }}>
                                  One line is plenty. It goes on the row so you can both see what was decided, and it counts
                                  towards the stage the same as the settings would.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 11 }}>
                                  {AGREED_STARTERS.map(t => (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => setAgreeDraft(t)}
                                      style={{
                                        background: agreeDraft === t ? 'var(--terracotta-lt)' : '#fff',
                                        border: 'var(--edge)', borderRadius: 'var(--radius-pill)',
                                        padding: '7px 12px', cursor: 'pointer', textAlign: 'left',
                                        fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3,
                                      }}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                </div>
                                <input
                                  className="input"
                                  value={agreeDraft}
                                  onChange={e => setAgreeDraft(e.target.value.slice(0, 160))}
                                  placeholder="Or say it your own way"
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && agreeDraft.trim()) {
                                      onAgreeDevice(d, agreeDraft.trim()); setAgreeing(null); setAgreeDraft(''); setOpenId(null)
                                    }
                                  }}
                                  style={{ width: '100%', fontSize: 'var(--text-base)', padding: '10px 12px', marginBottom: 11 }}
                                />
                                {/* Save full width, Cancel under it. Side by
                                    side on a 390px phone the button had about
                                    115px of room after .btn's 28px sides, so
                                    "Save what we agreed" broke over two lines
                                    and Cancel sat jammed against the edge. The
                                    two are not a pair anyway: one is the thing
                                    you came to do and the other is the way out
                                    of it. */}
                                <button
                                  type="button"
                                  disabled={!agreeDraft.trim() || waiting}
                                  onClick={() => { onAgreeDevice(d, agreeDraft.trim()); setAgreeing(null); setAgreeDraft(''); setOpenId(null) }}
                                  className="btn btn-gold"
                                  style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)' }}
                                >
                                  Save what we agreed
                                </button>
                                <p style={{ textAlign: 'center', margin: '9px 0 0' }}>
                                  <button type="button" onClick={() => { setAgreeing(null); setAgreeDraft('') }} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                                    Cancel
                                  </button>
                                </p>
                              </div>
                            ) : (!done || isAgreed) && (
                              <p style={{ margin: '12px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                                {isAgreed ? 'Changed how you handle this one?' : 'Decided not to put controls on this one?'}{' '}
                                <button
                                  type="button"
                                  onClick={() => { setAgreeing(d.id); setAgreeDraft(agreedNote ?? '') }}
                                  style={{ ...LINK_BTN, display: 'inline', padding: 0, fontFamily: 'inherit', fontSize: 'var(--text-sm)', letterSpacing: 0, textDecoration: 'underline' }}
                                >
                                  {isAgreed ? 'Change what you agreed' : 'Record what you agreed instead'}
                                </button>
                                {isAgreed ? '.' : '. It counts the same.'}
                              </p>
                            )}

                            <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
                              <button type="button" onClick={() => { setEditing(d.id); setDraft(d.label); setOpenId(null) }} style={LINK_BTN}>
                                Rename
                              </button>
                              {/* Not a delete. Sold or broken keeps the row, so
                                  last term's screen time still says which device
                                  it happened on. */}
                              <button type="button" onClick={() => { patch(d.id, { retired: true }); setOpenId(null) }} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                                Gone from the house
                              </button>
                            </div>
                          </>
                        }
                      />
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Suggestions, inside the same list and clearly not yours yet. Dashed,
          the way Alexa marks the ones you have not got. We advise, we do not
          insist, so each one can be waved away and nothing counts down. */}
      {suggestions.length > 0 && !picking && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 9px' }}>
            {live.length === 0 ? 'Most families have these' : `Also common at ${childAge}`}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* The whole row adds it, so the tap target is the row rather than
                a few words of link text. An earlier pass had "We have this" as
                a text button beside a subtitle, and between them they left the
                subtitle about ninety pixels to wrap into, so every suggestion
                stood four lines tall and the card ran off the screen. */}
            {suggestions.map(s => {
              const sub = guideFor(s.guideKey)?.subtitle
              return (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  border: '2px dashed var(--ink)', borderRadius: 'var(--radius-tile)',
                  background: 'var(--cream)', paddingRight: 6,
                }}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => add(s.label, s.kind, s.guideKey)}
                    style={{
                      flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 11,
                      background: 'none', border: 'none', textAlign: 'left',
                      padding: '11px 4px 11px 13px', cursor: busy ? 'default' : 'pointer',
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    <span aria-hidden style={{ fontSize: 'var(--text-xl)', lineHeight: 1, flexShrink: 0, opacity: 0.65 }}>{s.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.2 }}>
                        {s.label}
                      </span>
                      {sub && (
                        <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.35, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub}
                        </span>
                      )}
                    </span>
                    <span aria-hidden style={{
                      flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
                      border: '1.5px solid var(--terracotta)', color: 'var(--terracotta)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', lineHeight: 1,
                    }}>
                      +
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`We do not have a ${s.label}`}
                    onClick={() => {
                      // Local first so the row goes immediately, then recorded
                      // against the guide so it stays gone on the next visit
                      // and drops out of the coverage ring too. A suggestion
                      // with no guide behind it can only be a this visit
                      // dismissal, which is the honest limit rather than a fake
                      // promise.
                      setDismissed(prev => new Set(prev).add(s.label))
                      if (s.guideKey) onNotOwned(s.guideKey)
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', fontSize: 'var(--text-base)', padding: 0, width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* One way to add anything else, with the search that used to sit over
          the whole catalogue. */}
      {picking ? (
        <div style={{ border: '2px dashed var(--ink)', borderRadius: 'var(--radius-tile)', padding: '13px 13px 10px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 10px' }}>
            What arrived?
          </p>
          <input
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search iPhone, Xbox, Fire tablet, Switch"
            style={{ marginBottom: 12, fontSize: 'var(--text-md)' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
            {pickList.map(s => (
              <button
                key={s.label}
                type="button"
                disabled={busy}
                onClick={() => { add(s.label, s.kind, s.guideKey); setPicking(false); setQuery('') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: 'var(--edge)', borderRadius: 'var(--radius-pill)',
                  background: '#fff', padding: '8px 13px', cursor: busy ? 'default' : 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--ink)',
                  opacity: busy ? 0.5 : 1,
                }}
              >
                <span aria-hidden style={{ fontSize: 'var(--text-base)', lineHeight: 1 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
          {pickList.length === 0 && !other && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 10px' }}>
              Nothing matching. Name it below and it goes on the list.
            </p>
          )}
          {/* Something else: the door for the device we do not list. */}
          {!other ? (
            <button
              type="button"
              disabled={busy}
              onClick={startOther}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
                border: '2px dashed var(--ink)', borderRadius: 'var(--radius-pill)',
                background: 'var(--cream)', padding: '8px 13px', cursor: busy ? 'default' : 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
              }}
            >
              <span aria-hidden>➕</span> Something else
            </button>
          ) : (
            <div data-other style={{ background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 13px', marginBottom: 10 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 8px' }}>
                What is it?
              </p>
              <input
                className="input"
                value={otherLabel}
                onChange={e => setOtherLabel(e.target.value)}
                placeholder="Steam Deck, Meta Quest, a kids tablet"
                maxLength={60}
                style={{ marginBottom: 10, fontSize: 'var(--text-md)' }}
              />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 7px' }}>
                What kind of thing is it?
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
                {(Object.keys(KIND_LABEL) as DeviceKind[]).map(k => {
                  const on = otherKind === k
                  return (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setOtherKind(k)}
                      style={{
                        border: 'var(--edge)', borderRadius: 'var(--radius-pill)',
                        background: on ? 'var(--terracotta)' : '#fff', padding: '7px 12px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
                        boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : 'none',
                      }}
                    >
                      {KIND_LABEL[k]}
                    </button>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={busy || !otherLabel.trim() || !otherKind}
                  onClick={addOther}
                  style={{
                    background: 'var(--terracotta)', color: 'var(--ink)', border: 'var(--edge)',
                    borderRadius: 'var(--radius-tile)', padding: '10px 18px',
                    cursor: busy || !otherLabel.trim() || !otherKind ? 'default' : 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
                    boxShadow: 'var(--lift)', opacity: busy || !otherLabel.trim() || !otherKind ? 0.5 : 1,
                  }}
                >
                  Add it
                </button>
                <button type="button" onClick={() => setOther(false)} style={LINK_BTN}>Back</button>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '10px 0 0' }}>
                We will hear about it too, so it gets its own guide and the next family finds it in the list.
              </p>
            </div>
          )}
          <button type="button" onClick={() => { setPicking(false); setQuery(''); setOther(false) }} style={{ ...LINK_BTN, marginBottom: 4 }}>
            Cancel
          </button>
        </div>
      ) : (
        <>
        {otherAdded && (
          <p data-other-added style={{ fontSize: 'var(--text-base)', color: 'var(--retro-green)', fontWeight: 700, lineHeight: 1.45, margin: '0 0 10px' }}>
            ✓ {otherAdded} is on the list. Thanks, we have been told so it gets its own guide.
          </p>
        )}
        <button
          type="button"
          onClick={() => setPicking(true)}
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 'var(--radius-btn)',
            border: 'var(--edge)', background: '#fff', boxShadow: 'var(--lift)',
            color: 'var(--ink)', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          }}
        >
          + Add a device
        </button>
        </>
      )}

      {retired.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={() => setShowRetired(v => !v)} style={LINK_BTN}>
            {showRetired ? 'Hide' : `${retired.length} no longer in the house`}
          </button>
          {showRetired && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
              {retired.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => patch(d.id, { retired: false })}
                  style={{
                    border: 'var(--edge)', borderRadius: 'var(--radius-pill)', background: 'var(--cream)',
                    padding: '7px 12px', cursor: 'pointer', fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
                  }}
                >
                  {d.label} · put back
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
