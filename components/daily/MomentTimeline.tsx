'use client'

import Link from 'next/link'
import { DAILY_MOMENTS, DAILY_MOMENT_GROUPS } from '@/lib/content/daily-moments'
import { momentImageSrc } from '@/lib/content/moment-images'

// The day, drawn as a day: a thin spine down the left with mono time marks,
// and each part of the day as a row of small picture tiles the parent taps.
// Selection lifts the tile, rings it in butter and pins a tick badge.
// All motion is CSS transforms at half a second, nothing faster.

// Soft pastel tile washes, one per group, rotating down the day.
const GROUP_TINTS = [
  'var(--stage-1)',
  'var(--tint-blue)',
  'var(--tint-sage)',
  'var(--stage-3)',
  'var(--stage-5)',
]

// A couple of labels are too long for a 64px column. Display only:
// the key sent to the API never changes.
const TILE_LABELS: Record<string, string> = {
  lunch: 'Packed lunch',
}

const MOMENT_BY_KEY = new Map(DAILY_MOMENTS.map(m => [m.key as string, m]))

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function MomentTile({
  momentKey,
  tint,
  selected,
  onToggle,
}: {
  momentKey: string
  tint: string
  selected: boolean
  onToggle: (key: string) => void
}) {
  const moment = MOMENT_BY_KEY.get(momentKey)
  if (!moment) return null

  const imageSrc = momentImageSrc(momentKey)
  const label = TILE_LABELS[momentKey] ?? moment.label

  return (
    <button
      onClick={() => onToggle(momentKey)}
      aria-pressed={selected}
      style={{
        width: '68px',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: tint,
        border: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        transform: selected ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: selected
          ? '0 0 0 2.5px var(--terracotta), 0 8px 16px rgba(26,26,46,0.14)'
          : '0 1px 2px rgba(26,26,46,0.04)',
        transition: `transform 0.5s ${EASE}, box-shadow 0.5s ${EASE}`,
      }}>
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            width={64}
            height={64}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '14.5px',
            }}
          />
        ) : (
          <span aria-hidden style={{ fontSize: '28px', lineHeight: 1 }}>{moment.icon}</span>
        )}

        {/* Tick badge */}
        <span aria-hidden style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--terracotta)',
          border: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 800,
          color: 'var(--ink)',
          transform: selected ? 'scale(1)' : 'scale(0)',
          opacity: selected ? 1 : 0,
          transition: `transform 0.5s ${EASE}, opacity 0.5s ease`,
        }}>✓</span>
      </span>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: selected ? 700 : 500,
        lineHeight: 1.25,
        // Every label block reserves two lines so tiles in a row share one
        // footprint and wrapped rows grid up level, whatever the label length.
        minHeight: '28px',
        textAlign: 'center',
        color: selected ? 'var(--ink)' : 'var(--ink-soft)',
        transition: 'color 0.5s ease',
      }}>
        {label}
      </span>
    </button>
  )
}

export default function MomentTimeline({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (key: string) => void
}) {
  return (
    <div style={{ position: 'relative' }}>
      {/* The spine */}
      <div aria-hidden style={{
        position: 'absolute',
        left: '43px',
        top: '8px',
        bottom: '12px',
        width: '2px',
        borderRadius: '2px',
        background: 'var(--border)',
      }} />

      {DAILY_MOMENT_GROUPS.map((group, gi) => (
        <div
          key={group.name}
          style={{
            position: 'relative',
            paddingLeft: '62px',
            marginBottom: gi === DAILY_MOMENT_GROUPS.length - 1 ? 0 : '28px',
          }}
        >
          {/* Time mark */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '32px',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            letterSpacing: '.04em',
            lineHeight: '14px',
          }}>
            {group.time}
          </div>

          {/* Node on the spine */}
          <div aria-hidden style={{
            position: 'absolute',
            left: '39px',
            top: '2.5px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#fff',
            border: '2px solid var(--ink-light)',
          }} />

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
            lineHeight: '14px',
            marginBottom: '12px',
          }}>
            {group.name}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {group.keys.map(key => (
              <MomentTile
                key={key}
                momentKey={key}
                tint={GROUP_TINTS[gi % GROUP_TINTS.length]}
                selected={selected.includes(key)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}

      {/* The day picker shows the child's slice; the full library, with the
          science and DiGi's words behind every card, is one tap away. */}
      <Link
        href="/dashboard/moments"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '4px', marginLeft: '64px', padding: '12px 16px',
          background: 'var(--cream)', border: '1.5px solid var(--border)',
          borderRadius: '14px', textDecoration: 'none',
        }}
      >
        <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          Every moment, with the science behind it
        </span>
        <span style={{ color: 'var(--terracotta-dark)', fontSize: '16px' }}>→</span>
      </Link>
    </div>
  )
}
