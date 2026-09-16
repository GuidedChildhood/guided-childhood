'use client'

import { deviceLabel } from '@/lib/quests/device-time'
import HappyIcon from '@/components/kid/HappyIcon'
import { CRAYON } from '@/components/printables/drawn/crayon'

// WHAT THE QUESTS BADGE IS COUNTING, ON THE PAGE THE BADGE OPENS.
//
// Justin, 16 September 2026, with two photos of the child app: "the quest tab
// has a 2 first image but when I click on quests there is none?"
//
// The badge was right. The page was not.
//
// The number on Quests is `waitingOnGrownUp`: the child's own pending job
// ideas plus a live screen time ask, both sitting with their grown up. Tapping
// it opens the jobs page, and that page lists only jobs a grown up has SENT.
// So a child with two asks outstanding tapped a red 2 and landed on the words
// "No jobs today", with the badge itself gone from the bar, because the jobs
// page passes no count at all.
//
// Read against the live database for the child in the photo: one pitched job
// idea, one screen time ask, both pending. Two real things, in a place the
// child could not see them.
//
// A badge is a promise that something is there. This card is the something.
//
// It is deliberately the same vocabulary as KidAskBanner, which already says
// "Waiting for their yes" on the home screen: white card, ink edge, hard
// ledge, a drawn icon in a crayon well. A child should recognise the thing,
// not meet a second design for the same idea.

export type WaitingAsk =
  | { kind: 'job'; id: string; title: string; emoji: string }
  | { kind: 'screen'; id: string; device: string; minutes: number }

function Well({ tint, children }: { tint: string; children: React.ReactNode }) {
  return (
    <span aria-hidden style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0, boxSizing: 'border-box',
      background: tint, border: 'var(--edge)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--text-lg)', lineHeight: 1,
    }}>
      {children}
    </span>
  )
}

export default function KidWaitingAsks({ asks }: { asks: WaitingAsk[] }) {
  if (asks.length === 0) return null

  return (
    <div style={{
      background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--lift)', padding: '16px 16px 14px', marginBottom: 18,
    }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        color: 'var(--ink)', margin: '0 0 4px', lineHeight: 1.2,
      }}>
        Waiting for their yes
      </p>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        {asks.length === 1 ? 'You asked for this.' : `You asked for these ${asks.length} things.`} Your grown up has not answered yet.
      </p>

      {asks.map(ask => (
        <div
          key={`${ask.kind}-${ask.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '9px 0', borderTop: '2px dotted rgba(26,26,46,0.15)',
          }}
        >
          {ask.kind === 'screen' ? (
            <Well tint={CRAYON.sky}><HappyIcon name="time" size={28} /></Well>
          ) : (
            <Well tint={CRAYON.butter}>{ask.emoji || '⭐'}</Well>
          )}
          {/* No per row badge. Every row here is in the same state and the
              heading above has already said it, so a pill on each one adds
              nothing except the look of a button a child can press. */}
          <span style={{
            flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3,
          }}>
            {ask.kind === 'screen'
              ? `${ask.minutes} minutes on the ${deviceLabel(ask.device)}`
              : ask.title}
          </span>
        </div>
      ))}
    </div>
  )
}
