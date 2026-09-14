import { CHARACTERS, type CharacterKey } from '@gc/shared/schools-curriculum'
import { characterKeyFor, registerFor, type Register } from '@gc/shared/friend-register'

// THE PRINT KIT (14 September 2026).
//
// Justin: colour print outs with the Planet Friends on the page, a finish
// children and teachers are amazed by. Every sheet a child or a teacher
// holds now carries the key stage's own friend, in colour, doing something
// on that page: waving on a cover, thinking beside a question, happy on a
// finished record, holding the ring on a passport page. The friend
// demonstrates; it never decorates.
//
// COLOUR THAT PHOTOCOPIES. Colour comes from the friend: its soft tint as
// the header band and the sticker fill, its accent as 2px rules, chips and
// the name, its ink for words on the tint. Body text is always ink, never
// on an accent, and every box keeps an ink border, so a black and white
// copy keeps the structure and a colour print keeps the joy. No gradients.
//
// THE REGISTER IN PRINT is the wall's ladder (shared/friend-register.ts):
// a Reception sheet gets one idea a page, giant boxes and a friend at 60mm;
// a Year 11 sheet gets an editorial grid and the friend as an 18mm mark.
// Chosen by key stage, never per page, so a KS4 sheet cannot accidentally
// look like a colouring book.
//
// Server components only. No hooks, no state: paper does not re-render.

export type Friend = (typeof CHARACTERS)[CharacterKey] & { key: CharacterKey }
export type Mood = 'happy' | 'wave' | 'thinking'

/** The friend a module prints with: the first one its cast line names, or
 *  the key stage's own friend when the cast line names none. */
export function friendFor(castLine: string | null | undefined, keyStage: string | null | undefined): Friend {
  const named = characterKeyFor(castLine)
  const ks = (keyStage ?? '').toUpperCase()
  const byStage: CharacterKey = ks === 'EYFS' || ks === 'KS1' ? 'pebble' : ks === 'KS2' ? 'bloop' : ks === 'KS3' ? 'orbit' : ks === 'KS4' ? 'nova' : ks === 'KS5' ? 'cosmo' : 'digi'
  const key = named ?? byStage
  return { key, ...CHARACTERS[key] }
}

export type PrintRegister = {
  key: Register
  /** The friend's size on a cover, in millimetres. */
  friendMm: number
  /** The friend's size beside a question or a card. */
  markMm: number
  title: string
  body: string
  /** The height of a line a child writes on. */
  lineHeight: number
  /** A box a child draws or writes in. */
  boxHeight: number
  radius: number
}

const REGISTERS: Record<Register, PrintRegister> = {
  bouncy:  { key: 'bouncy',  friendMm: 60, markMm: 26, title: 'var(--text-3xl)', body: 'var(--text-lg)',   lineHeight: 44, boxHeight: 150, radius: 22 },
  playful: { key: 'playful', friendMm: 40, markMm: 20, title: 'var(--text-2xl)', body: 'var(--text-md)',   lineHeight: 34, boxHeight: 110, radius: 18 },
  level:   { key: 'level',   friendMm: 28, markMm: 16, title: 'var(--text-xl)',  body: 'var(--text-base)', lineHeight: 28, boxHeight: 84,  radius: 14 },
  still:   { key: 'still',   friendMm: 18, markMm: 12, title: 'var(--text-xl)',  body: 'var(--text-base)', lineHeight: 26, boxHeight: 72,  radius: 12 },
}

export function printRegister(keyStage: string | null | undefined): PrintRegister {
  return REGISTERS[registerFor(keyStage)]
}

export const mm = (n: number) => `${Math.round(n * 3.7795)}px`

// Type styles shared by every sheet.
export const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
export const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.12, margin: 0 }
export const text: React.CSSProperties = { fontFamily: 'var(--font-body)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }

/** The friend, at a size in millimetres, in a mood. */
export function FriendArt({ friend, mood = 'wave', size }: { friend: Friend; mood?: Mood; size: number }) {
  const src = friend.moods?.[mood] ?? friend.img
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={friend.name} width={Math.round(size * 3.7795)} height={Math.round(size * 3.7795)} style={{ width: mm(size), height: mm(size), objectFit: 'contain', display: 'block', flexShrink: 0 }} />
}

/** One A4 sheet. The footer names the sheet so a pile on a desk sorts itself. */
export function PrintSheet({ children, footer, last = false, center = false }: {
  children: React.ReactNode
  footer: string
  last?: boolean
  center?: boolean
}) {
  return (
    <section style={{ pageBreakAfter: last ? 'auto' : 'always', breakAfter: last ? 'auto' : 'page', minHeight: '258mm', display: 'flex', flexDirection: 'column', justifyContent: center ? 'center' : 'flex-start', padding: '6px 4px 0' }}>
      <div style={{ flex: center ? '0 0 auto' : '1 1 auto' }}>{children}</div>
      <div style={{ ...mono, fontSize: '10px', color: 'var(--ink-light)', textAlign: 'center', paddingTop: '14px', letterSpacing: '0.14em' }}>
        Guided Childhood Schools · {footer}
      </div>
    </section>
  )
}

/** The tint band at the top of a sheet: the friend, the eyebrow, the title, and a line for a name where a child holds it. */
export function FriendHeader({ friend, register, mood = 'wave', eyebrow, title, sub, nameLine, small = false }: {
  friend: Friend
  register: PrintRegister
  mood?: Mood
  eyebrow: string
  title: string
  sub?: string
  nameLine?: string
  /** A teacher sheet: the friend as a mark, the band low. */
  small?: boolean
}) {
  // A header band never needs the cover's 60mm friend; 44mm keeps the words
  // beside it readable on a phone screen too.
  const size = small ? register.markMm : Math.min(register.friendMm, 44)
  return (
    <header className="gc-avoid-break" style={{ background: friend.soft, border: `2px solid ${friend.accent}`, borderRadius: `${register.radius}px`, padding: small ? '14px 18px' : '18px 22px', display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '16px' }}>
      <FriendArt friend={friend} mood={mood} size={size} />
      <div style={{ flex: '1 1 auto', minWidth: 0 }}>
        <div style={{ ...mono, color: friend.ink }}>{eyebrow}</div>
        <h1 style={{ ...display, fontSize: small ? 'var(--text-xl)' : register.title, margin: '4px 0 0' }}>{title}</h1>
        {sub && <p style={{ ...text, fontSize: small ? 'var(--text-sm)' : register.body, color: 'var(--ink-soft)', marginTop: '6px' }}>{sub}</p>}
        {nameLine && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <span style={{ ...mono, color: friend.ink }}>{nameLine}</span>
            <span style={{ flex: '1 1 80px', borderBottom: `2px solid ${friend.accent}`, height: '22px' }} />
          </div>
        )}
      </div>
    </header>
  )
}

/** A boxed block with a mono label. `accent` colours the label and the rule; `tint` fills it. */
export function Box({ label, children, friend, tint = false, dashed = false, radius = 14, style }: {
  label?: string
  children: React.ReactNode
  friend?: Friend
  tint?: boolean
  dashed?: boolean
  radius?: number
  style?: React.CSSProperties
}) {
  const accent = friend?.accent ?? 'var(--ink)'
  return (
    <div className="gc-avoid-break" style={{ border: `${dashed ? '1.5px dashed' : '1.5px solid'} ${tint ? accent : 'var(--ink-light)'}`, background: tint && friend ? friend.soft : '#fff', borderRadius: `${radius}px`, padding: '12px 16px', marginTop: '10px', ...style }}>
      {label && <div style={{ ...mono, color: friend ? friend.ink : 'var(--ink-muted)', marginBottom: '6px' }}>{label}</div>}
      {children}
    </div>
  )
}

/** Lines a child writes on. */
export function WriteLines({ n = 1, height = 30, color = 'var(--ink-light)' }: { n?: number; height?: number; color?: string }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => <div key={i} style={{ borderBottom: `1.5px solid ${color}`, height: `${height}px` }} />)}
    </div>
  )
}

/** A big empty box to draw or write in, with what it is for in the corner. */
export function BigBox({ label, height, friend }: { label: string; height: number; friend?: Friend }) {
  return (
    <div className="gc-avoid-break" style={{ border: `2px solid ${friend?.accent ?? 'var(--ink)'}`, borderRadius: '18px', height: `${height}px`, position: 'relative', marginTop: '10px' }}>
      <span style={{ ...mono, position: 'absolute', left: '14px', top: '10px', color: friend?.ink ?? 'var(--ink-muted)' }}>{label}</span>
    </div>
  )
}

/** A cut here line, with the scissors where a child starts. */
export function CutLine({ label = 'Cut here' }: { label?: string }) {
  return (
    <div aria-hidden style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
      <span style={{ fontSize: '16px', lineHeight: 1 }}>✂</span>
      <span style={{ flex: '1 1 auto', borderTop: '1.5px dashed var(--ink)' }} />
      <span style={{ ...mono, fontSize: '9px' }}>{label}</span>
    </div>
  )
}

/** A fold here line: a fine dotted rule with the word at the end. */
export function FoldLine({ vertical = false }: { vertical?: boolean }) {
  return vertical
    ? <div aria-hidden style={{ borderLeft: '1px dotted var(--ink-muted)', alignSelf: 'stretch' }} />
    : <div aria-hidden style={{ borderTop: '1px dotted var(--ink-muted)', display: 'flex', justifyContent: 'flex-end' }}><span style={{ ...mono, fontSize: '9px', marginTop: '2px' }}>fold</span></div>
}

/** A row of choices to tick, each in its own chip with an empty square. */
export function TickRow({ options, friend, big = false }: { options: string[]; friend?: Friend; big?: boolean }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
      {options.map(o => (
        <span key={o} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1.5px solid ${friend?.accent ?? 'var(--ink)'}`, borderRadius: '999px', padding: big ? '8px 14px' : '5px 12px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: big ? 'var(--text-md)' : 'var(--text-sm)', color: 'var(--ink)', background: '#fff' }}>
          <span style={{ width: big ? '18px' : '14px', height: big ? '18px' : '14px', border: '1.5px solid var(--ink)', borderRadius: '4px', display: 'inline-block' }} />
          {o}
        </span>
      ))}
    </div>
  )
}

/** A round sticker to cut out: the friend's face on its tint, a word or two under it. */
export function Sticker({ friend, label, size = 34, mood = 'happy', star = false }: { friend: Friend; label: string; size?: number; mood?: Mood; star?: boolean }) {
  return (
    <div className="gc-avoid-break" style={{ width: mm(size), height: mm(size), borderRadius: '50%', border: '1.5px dashed var(--ink)', padding: '5px', display: 'inline-flex', flexShrink: 0 }}>
      <div style={{ flex: '1 1 auto', borderRadius: '50%', background: friend.soft, border: `2px solid ${friend.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '4px', textAlign: 'center' }}>
        {star ? <span style={{ fontSize: mm(size * 0.42), lineHeight: 1 }}>⭐</span> : <FriendArt friend={friend} mood={mood} size={size * 0.46} />}
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: size >= 34 ? '11px' : '9px', lineHeight: 1.1, color: friend.ink, maxWidth: '90%' }}>{label}</span>
      </div>
    </div>
  )
}

/** A ring a sticker goes in. Empty until the child sticks it. */
export function Stamp({ friend, label, size = 36, hint = 'Stick here' }: { friend: Friend; label: string; size?: number; hint?: string }) {
  return (
    <div className="gc-avoid-break" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: mm(size + 6) }}>
      <div style={{ width: mm(size), height: mm(size), borderRadius: '50%', border: `3px solid ${friend.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ width: mm(size - 8), height: mm(size - 8), borderRadius: '50%', border: '1.5px dotted var(--ink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...mono, fontSize: '9px', color: 'var(--ink-light)', textAlign: 'center' }}>{hint}</span>
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', textAlign: 'center', lineHeight: 1.15 }}>{label}</span>
    </div>
  )
}

/** A numbered marker in the friend's colour. */
export function Number({ n, friend, size = 32 }: { n: number | string; friend: Friend; size?: number }) {
  return (
    <span style={{ flexShrink: 0, width: `${size}px`, height: `${size}px`, borderRadius: '50%', background: friend.accent, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: `${Math.round(size * 0.55)}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
  )
}

/** A star to colour in, for the youngest sheets. */
export function ColourStar({ size = 64, label = 'Colour me in' }: { size?: number; label?: string }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <polygon points="50,6 61,38 95,38 68,58 78,92 50,72 22,92 32,58 5,38 39,38" fill="#fff" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeDasharray="6 4" />
      </svg>
      <span style={{ ...mono, fontSize: '9px' }}>{label}</span>
    </div>
  )
}

/** The slim strip at the top of an inner page: the eyebrow, a rule, and the friend as a mark, so the friend is on every sheet without a band on every sheet. */
export function FriendStrip({ friend, register, eyebrow, mood = 'thinking' }: { friend: Friend; register: PrintRegister; eyebrow: string; mood?: Mood }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <span style={{ ...mono, color: friend.ink }}>{eyebrow}</span>
      <span style={{ flex: '1 1 40px', borderTop: `2px solid ${friend.accent}` }} />
      <FriendArt friend={friend} mood={mood} size={register.markMm} />
    </div>
  )
}
