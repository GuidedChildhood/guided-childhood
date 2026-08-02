'use client'
import { deviceIcon, KIND_LABEL, type FamilyDevice } from '@/lib/devices/family'
import type { DeviceKind } from '@/lib/quests/device-time'

// Which screen is this time for?
//
// The whole app used to answer that with four words, so a house with two
// tablets could start twenty minutes on "tablet" and nobody could say which
// one. When the family has listed what they own, this offers those: Ella's
// iPad, the living room TV, the Switch. When they have not, it offers the four
// kinds exactly as before, so nothing is broken by not having answered yet.
//
// The picked value is always a kind, because that is what the session, the
// request and the weekly breakdown have always been keyed on. A real device
// simply rides alongside it, and the kind comes from the device.

export type DevicePick = { kind: DeviceKind; familyDeviceId: string | null }

export default function DevicePickerChips({
  devices, fallback, value, onChange, disabled,
}: {
  /** The family's own devices. Empty falls back to the generic kinds. */
  devices: FamilyDevice[]
  fallback: { key: DeviceKind; label: string; emoji: string }[]
  /** Null shows nothing selected, for a flow that must not guess the screen. */
  value: DevicePick | null
  onChange: (pick: DevicePick) => void
  disabled?: boolean
}) {
  const live = devices.filter(d => !d.retiredAt)

  const chip = (on: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 14px', borderRadius: 100,
    border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
    background: on ? 'var(--terracotta-lt)' : '#fff',
    color: on ? 'var(--terracotta)' : 'var(--ink)',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.55 : 1,
    transition: 'border-color 0.12s, background 0.12s, color 0.12s',
  })

  if (live.length > 0) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {live.map(d => {
          const on = value?.familyDeviceId === d.id
          return (
            <button
              key={d.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange({ kind: d.kind, familyDeviceId: d.id })}
              style={chip(on)}
            >
              <span aria-hidden style={{ fontSize: 'var(--text-md)', lineHeight: 1 }}>{deviceIcon(d)}</span>
              {d.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {fallback.map(d => {
        const on = value != null && value.familyDeviceId === null && value.kind === d.key
        return (
          <button
            key={d.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ kind: d.key, familyDeviceId: null })}
            style={chip(on)}
          >
            <span aria-hidden style={{ fontSize: 'var(--text-md)', lineHeight: 1 }}>{d.emoji}</span>
            {d.label}
          </button>
        )
      })}
    </div>
  )
}

/** What to call the device a running block is on: its name when we have one,
 *  its kind when we do not. Used in countdowns and push messages. */
export function pickedDeviceLabel(devices: FamilyDevice[], familyDeviceId: string | null, kind: string): string {
  const found = familyDeviceId ? devices.find(d => d.id === familyDeviceId) : null
  return found?.label ?? KIND_LABEL[(kind as DeviceKind)] ?? 'device'
}
