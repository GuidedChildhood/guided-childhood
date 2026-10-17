// The child's ask to change a promise in the family deal (migration 381).
//
// Justin, 16 October 2026: yes to the child asking to change the deal from
// their own app, with a reason, and the grown up deciding. Plan:
// plans/2026-10-16-ask-to-change-the-deal-plan.md.
//
// One place for the limits and the cleaning, so the child's route, the
// parent's route and the two screens can never disagree about what an ask is.
// No model anywhere in here: the child's route imports this file, and the
// child side never calls a model (scripts/check-child-has-no-model.mjs).

export type DealChangeStatus = 'pending' | 'yes' | 'not_now' | 'talk'

export type DealChangeAsk = {
  id: string
  child_id: string
  promise_title: string
  wish: string
  reason: string
  status: DealChangeStatus
  parent_reply: string | null
  decided_at: string | null
  created_at: string
}

/** One open ask at a time keeps it an ask, not a campaign. */
export const MAX_OPEN_DEAL_ASKS = 1
/** And three in any seven days, whatever happened to them. */
export const MAX_DEAL_ASKS_PER_WEEK = 3
/** An answered ask stays on the child's screen this long, then the button returns alone. */
export const ANSWER_SHOWN_DAYS = 14

export const WISH_MAX = 200
export const REASON_MAX = 200
export const REPLY_MAX = 200

/** Squash whitespace, trim, cap. Returns '' for anything that is not text. */
export function cleanLine(v: unknown, max: number): string {
  if (typeof v !== 'string') return ''
  return v.replace(/\s+/g, ' ').trim().slice(0, max)
}

export function isDealChangeStatus(v: unknown): v is DealChangeStatus {
  return v === 'pending' || v === 'yes' || v === 'not_now' || v === 'talk'
}

/** What the child reads once their grown up has answered. Plain, warm, never a flat no. */
export function answerLineForChild(status: DealChangeStatus): string {
  switch (status) {
    case 'yes': return 'Your grown up said yes. They will change the deal, then you both agree it again.'
    case 'not_now': return 'Not this time. You can ask about something else another day.'
    case 'talk': return 'Your grown up wants to talk it through with you. Find a good moment together.'
    default: return 'Sent. Your grown up will look at it.'
  }
}

/** The DiGi question a parent gets when they choose Let's talk. */
export function talkPromptFor(childName: string, ask: Pick<DealChangeAsk, 'promise_title' | 'wish' | 'reason'>): string {
  const who = childName || 'My child'
  return `${who} has asked to change our family deal. The promise is "${ask.promise_title}". They would like: "${ask.wish}". Their reason: "${ask.reason}". Help me talk it through with them so they feel heard, whatever we decide.`
}
