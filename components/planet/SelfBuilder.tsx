'use client'

import { useState } from 'react'
import type { KidTheme } from '@/lib/kid/theme'
import { SELF_HAIR_COLOURS, SELF_HAIRS, SELF_SKINS, SELF_SUITS, type Self } from '@/lib/planet/logic'
import { SELF_LINES } from '@/lib/planet/universe'
import SelfFigure from './SelfFigure'

// Build the self (slice 3b): the big live preview on top, three chunky tabs,
// swatch grids a four year old can tap. Every tap redraws the figure at
// once, so the swatches never need naming and Tier 1 needs no words at all.
// Nothing saves until Done, and Done is the only way out, so a half built
// explorer is never stranded in the save.

const INK = '#1A1A2E'

type Tab = 'me' | 'hair' | 'suit'

const swatch = (selected: boolean): React.CSSProperties => ({
  width: 52, height: 52, borderRadius: 16, cursor: 'pointer', padding: 0,
  border: selected ? `3px solid ${INK}` : '2px solid rgba(26,26,46,0.25)',
  boxShadow: selected ? `0 3px 0 ${INK}` : 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
})

export default function SelfBuilder({ initial, theme, words, onDone, onTap }: {
  initial: Self | null
  theme: KidTheme
  /** Tier 1 is pictures and sound: the tabs still show, their labels do not. */
  words: boolean
  onDone: (self: Self) => void
  /** A sound per tap, wired by the parent component. */
  onTap: () => void
}) {
  const [draft, setDraft] = useState<Self>(initial ?? { skin: 2, hair: 0, hairColour: 0, suit: 0 })
  const [tab, setTab] = useState<Tab>('me')

  const pick = (patch: Partial<Self>) => { onTap(); setDraft(d => ({ ...d, ...patch })) }

  const tabButton = (key: Tab, label: string, emoji: string) => (
    <button
      key={key}
      onClick={() => { onTap(); setTab(key) }}
      aria-label={label}
      style={{
        flex: 1, padding: '10px 8px', borderRadius: 14, cursor: 'pointer',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)',
        background: tab === key ? theme.hex : '#fff', color: tab === key ? theme.onAccent : INK,
        border: `2px solid ${INK}`, boxShadow: tab === key ? `0 3px 0 ${INK}` : 'none',
      }}
    >
      {emoji}{words ? ` ${label}` : ''}
    </button>
  )

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 6, background: '#141A3C', display: 'flex', flexDirection: 'column', borderRadius: 22 }}>
      <p style={{ margin: '14px 0 0', textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: '#FFF6DD' }}>
        {SELF_LINES.title} ⭐
      </p>
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', padding: '6px 0 2px' }}>
        <svg viewBox="-90 -175 180 185" width={170} height={175} aria-hidden>
          <SelfFigure self={draft} size={150} wave />
        </svg>
      </div>
      <div style={{ flex: 1, minHeight: 0, background: '#fff', borderRadius: '20px 20px 22px 22px', border: `2px solid ${INK}`, margin: '0 10px 10px', padding: 12, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {tabButton('me', SELF_LINES.me, '🙂')}
          {tabButton('hair', SELF_LINES.hair, '💇')}
          {tabButton('suit', SELF_LINES.suit, '🧑‍🚀')}
        </div>

        {tab === 'me' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {SELF_SKINS.map((c, i) => (
              <button key={c} onClick={() => pick({ skin: i })} aria-label={`Skin ${i + 1}`} style={{ ...swatch(draft.skin === i), background: c }} />
            ))}
          </div>
        )}

        {tab === 'hair' && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {SELF_HAIRS.map((h, i) => (
                <button key={h} onClick={() => pick({ hair: i })} aria-label={`Hair ${h}`} style={{ ...swatch(draft.hair === i), background: '#F6F4EE', width: 60, height: 60 }}>
                  <svg viewBox="-30 -102 60 60" width={48} height={48} aria-hidden>
                    <SelfFigure self={{ ...draft, hair: i }} size={100} />
                  </svg>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {SELF_HAIR_COLOURS.map((c, i) => (
                <button key={c} onClick={() => pick({ hairColour: i })} aria-label={`Hair colour ${i + 1}`} style={{ ...swatch(draft.hairColour === i), background: c, width: 40, height: 40, borderRadius: '50%' }} />
              ))}
            </div>
          </>
        )}

        {tab === 'suit' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {SELF_SUITS.map((c, i) => (
              <button key={c} onClick={() => pick({ suit: i })} aria-label={`Suit ${i + 1}`} style={{ ...swatch(draft.suit === i), background: c }} />
            ))}
          </div>
        )}

        <button
          onClick={() => { onTap(); onDone(draft) }}
          style={{
            marginTop: 'auto', padding: '14px 20px', borderRadius: 16, cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            background: theme.hex, color: theme.onAccent, border: `2px solid ${INK}`, boxShadow: `0 5px 0 ${INK}`,
          }}
        >
          {SELF_LINES.done} ✔
        </button>
      </div>
    </div>
  )
}
