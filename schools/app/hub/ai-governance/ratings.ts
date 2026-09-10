// HOW A RATING LOOKS, IN TOKENS THAT ALREADY EXIST.
//
// The brief asked for calm and evidence led rather than a cybersecurity
// product: no scary warning graphics and no red everywhere. So the strongest
// state uses rose 900 on the barely there coral tint, which reads as serious
// without shouting, and every pair here was measured before it was used:
//
//   low concern       #236F52 on #E8F4EE   5.37
//   needs a decision  #713F12 on #FFFBEE   8.38
//   material concern  #881337 on #FFF4F2   8.87
//   not established   #52526A on #F9F8F6   7.13
//
// All four clear WCAG AA. No new colours were added to the palette.

import type { CSSProperties } from 'react'
import type { Rating, OverallStatus } from '@gc/shared/ai-governance/types'

export const RATING_STYLE: Record<Rating, CSSProperties> = {
  green:   { background: 'var(--tint-green)', color: 'var(--retro-green-dark)', borderColor: 'var(--retro-green-dark)' },
  amber:   { background: 'var(--stage-1)',    color: 'var(--stage-1-text)',     borderColor: 'var(--stage-1-text)' },
  red:     { background: 'var(--stage-3)',    color: 'var(--stage-3-text)',     borderColor: 'var(--stage-3-text)' },
  unknown: { background: 'var(--warm)',       color: 'var(--ink-soft)',         borderColor: 'var(--border)' },
}

/** The overall status borrows the same four looks, so a school learns one
 *  vocabulary rather than two. */
export const STATUS_RATING: Record<OverallStatus, Rating> = {
  'approve': 'green',
  'approve-with-conditions': 'amber',
  'review-required': 'unknown',
  'do-not-deploy-yet': 'red',
}

export const chip = (rating: Rating): CSSProperties => ({
  display: 'inline-block',
  padding: '5px 12px',
  borderRadius: '100px',
  border: '1.5px solid',
  fontFamily: 'var(--font-mono)',
  fontSize: '11.5px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  ...RATING_STYLE[rating],
})
