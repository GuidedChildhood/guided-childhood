'use client'

import Link from 'next/link'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

// Grouped settings rows, the Apple Settings pattern in our own finish.
//
// Built for the Quests setup page (18 November 2026), where fourteen screens
// of cards became three short groups. One row is one place: an icon on a
// tinted plate, a label, one line saying what is there, and a chevron. A row
// either links to the page that owns the thing or runs an onClick that opens
// its section in place. A badge is only for something not done yet.

export type SettingsRow = {
  icon: HappyIconName
  label: string
  sub: string
  href?: string
  onClick?: () => void
  badge?: string
}

const TINTS = ['var(--tint-butter)', 'var(--tint-blue)', 'var(--tint-sage)']

export default function SettingsList({ groups }: { groups: { title: string; rows: SettingsRow[] }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 18 }}>
      {groups.map((g, gi) => (
        <section key={g.title}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 7px 4px' }}>
            {g.title}
          </p>
          <div style={{ background: 'var(--white)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
            {g.rows.map((r, i) => {
              const inner = (
                <>
                  <span aria-hidden style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 'var(--radius-tile)', background: TINTS[gi % TINTS.length],
                    border: '1.5px solid var(--ink)', boxSizing: 'border-box',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HappyIcon name={r.icon} size={28} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>{r.label}</span>
                    <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: 1 }}>{r.sub}</span>
                  </span>
                  {r.badge && (
                    <span style={{ flexShrink: 0, background: 'var(--terracotta)', border: '1.5px solid var(--ink)', borderRadius: 'var(--radius-pill)', padding: '2px 10px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--ink)' }}>
                      {r.badge}
                    </span>
                  )}
                  <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-light)' }}>›</span>
                </>
              )
              const style: React.CSSProperties = {
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 64, boxSizing: 'border-box',
                padding: '11px 14px', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
              }
              return r.href
                ? <Link key={r.label} href={r.href} style={style}>{inner}</Link>
                : <button key={r.label} type="button" onClick={r.onClick} style={style}>{inner}</button>
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
