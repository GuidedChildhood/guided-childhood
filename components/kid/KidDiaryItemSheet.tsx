'use client'

import { useEffect, useState } from 'react'
import type { KidWeekItem } from './KidSchoolWeek'

// Tap in on a diary item.
//
// Justin, 10 August 2026, on a wrong Show and tell firing in the holidays:
// "we need a way for them to click in and simply stop it edit it if wrong."
//
// So every chip on the child's week opens this. What it offers depends on
// whose item it is:
//
//   THE CHILD'S OWN (the you added this badge): fix it or take it off,
//   because what they put on the diary is theirs to keep true.
//
//   A GROWN UP'S: the details, plus one button that tells the grown up it
//   looks wrong, naming the item. A child never edits or stops a grown up's
//   reminder directly, for the same reason they cannot tick one off: a wrong
//   fact on the parent's list is worse than a wrong fact reported. The fix
//   stays one tap away on the phone that CAN make it.

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const KIND_LABEL: Record<string, string> = {
  kit: '🎒 Kit', homework: '📕 Homework', event: '🎉 Club or event',
  deadline: '⏰ Deadline', payment: '💷 Payment', notice: '📌 Notice',
}

export default function KidDiaryItemSheet({
  item, held, onClose, onEdit, onRemove, onFlag,
}: {
  item: KidWeekItem
  /** On hold for the school holidays right now, said plainly in the sheet. */
  held: boolean
  onClose: () => void
  /** Present only for the child's own items. */
  onEdit?: () => void
  onRemove?: () => Promise<void> | void
  /** Present only for a grown up's items. */
  onFlag?: () => Promise<void> | void
}) {
  const [busy, setBusy] = useState<'remove' | 'flag' | null>(null)
  const [flagged, setFlagged] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const mine = Boolean(onEdit || onRemove)

  const when = item.weekday != null
    ? `Every ${DAY_NAMES[item.weekday]}${item.time ? ` at ${item.time}` : ''}`
    : item.dueDate
      ? `${new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${item.time ? ` at ${item.time}` : ''}`
      : 'No day set'

  const BTN: React.CSSProperties = {
    width: '100%', padding: '14px', borderRadius: 15, cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
    color: 'var(--ink)', border: 'none',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(26,26,46,0.45)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460, background: '#fff',
          borderRadius: '22px 22px 0 0', padding: '20px 18px calc(18px + env(safe-area-inset-bottom))',
          maxHeight: '88vh', overflowY: 'auto',
          boxShadow: '0 -14px 44px -12px rgba(26,26,46,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
          <div style={{ minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
            }}>
              {mine ? 'Yours, on the diary' : 'From your grown up'}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
              color: 'var(--ink)', margin: '3px 0 0', letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              {item.title}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--cream)',
            cursor: 'pointer', fontSize: 'var(--text-md)', color: 'var(--ink-muted)', flexShrink: 0,
          }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '4px 10px',
          }}>
            {KIND_LABEL[item.kind] ?? '📌 Reminder'}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '4px 10px',
          }}>
            {when}
          </span>
          {item.weekday != null && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              color: 'var(--ink-soft)', background: 'var(--cream)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '4px 10px',
            }}>
              {item.runsInHolidays ? '🏖️ holidays too' : '🏫 school time only'}
            </span>
          )}
        </div>

        {held && (
          <p style={{
            fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5,
            background: 'var(--tint-sage, #EAF3EE)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '11px 13px', margin: '0 0 14px',
          }}>
            ⛱️ It is the school holidays, so this one is having a rest. It comes back when school does.
          </p>
        )}

        {mine ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={onEdit}
              style={{ ...BTN, background: 'var(--terracotta)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}
            >
              ✏️ Fix it
            </button>
            <button
              disabled={busy === 'remove'}
              onClick={async () => { setBusy('remove'); try { await onRemove?.() } finally { setBusy(null) } }}
              style={{ ...BTN, background: '#fff', border: '2px solid var(--border)', boxShadow: '0 4px 0 var(--border)', color: 'var(--ink-soft)' }}
            >
              {busy === 'remove' ? 'Taking it off…' : '🗑️ Take it off my diary'}
            </button>
          </div>
        ) : flagged ? (
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink)', background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '12px 14px', margin: 0, textAlign: 'center',
          }}>
            Told them! Your grown up can fix it from their phone.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              disabled={busy === 'flag'}
              onClick={async () => {
                setBusy('flag')
                try { await onFlag?.(); setFlagged(true) } finally { setBusy(null) }
              }}
              style={{ ...BTN, background: 'var(--terracotta)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}
            >
              {busy === 'flag' ? 'Telling them…' : '🙋 This looks wrong, tell my grown up'}
            </button>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '2px 4px 0', textAlign: 'center' }}>
              Your grown up set this one up, so they are the one who can change or stop it. One tap and they know.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
