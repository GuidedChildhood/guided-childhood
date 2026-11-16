import { createHmac, timingSafeEqual } from 'crypto'
import { APP_ORIGIN } from '@/lib/config/site'

// THE QUESTIONS WE ASK A PARENT WHO SIGNED UP AND STOPPED.
//
// Justin, 15 November 2026. The one live family made an account and never
// came back, and we had no way to ask why. These are the questions onboarding
// researchers ask, in a parent's words:
//
//   stopped   the reason, as one tap, so a single tap is already an answer
//   why       the moment that made them sign up (the job)
//   hoped     the result they wanted in the first week
//   last      the last screen they remember, which finds the wall without
//             leading them to it
//   early     what has to happen in the first two minutes (the first win)
//   miss      would they mind if it went (the plainest read of value)
//
// One list, read by the page, the route that saves and the founder's page, so
// a question cannot be shown without being saveable or saved without a label.

export type AskQuestion = {
  key: string
  label: string
  /** Tap one. The first question only: it is what makes answering one tap. */
  options?: string[]
  placeholder?: string
}

export const ASK_QUESTIONS: AskQuestion[] = [
  {
    key: 'stopped',
    label: 'What stopped you carrying on?',
    options: [
      'No time that week',
      'The price screen put me off',
      'I was not sure what to do next',
      'It was not what I expected',
      'My child was not interested',
      'Something else',
    ],
  },
  { key: 'why', label: 'What was going on at home that made you sign up?', placeholder: 'A row about the tablet, a new phone, bedtime...' },
  { key: 'hoped', label: 'What were you hoping it would do in the first week?', placeholder: 'One line is plenty' },
  { key: 'last', label: 'What is the last screen you remember?', placeholder: 'And what you expected to happen next' },
  { key: 'early', label: 'What would you want to see in the first two minutes?', placeholder: 'What would tell you it is worth it' },
  { key: 'miss', label: 'If it disappeared tomorrow, would you mind?', placeholder: 'And what you would use instead' },
]

export const ASK_KEYS = new Set(ASK_QUESTIONS.map(q => q.key))

/** Signed with CRON_SECRET, like the unsubscribe link, but under its own
 *  prefix so an unsubscribe token can never be replayed as an answer link. */
export function askToken(userId: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(`ask:${userId}`)
    .digest('hex')
    .slice(0, 32)
}

export function askTokenValid(userId: string | null | undefined, token: string | null | undefined): boolean {
  if (!userId || !token || !/^[0-9a-f-]{36}$/i.test(userId) || token.length !== 32) return false
  const want = Buffer.from(askToken(userId))
  const got = Buffer.from(token)
  return want.length === got.length && timingSafeEqual(want, got)
}

export function askUrl(userId: string): string {
  return `${APP_ORIGIN}/tell-us?u=${userId}&k=${askToken(userId)}`
}

// ── WHEN EACH ASK GOES ─────────────────────────────────────────────────────
//
// Three, spaced, then silence. A parent who has not answered three short
// emails has answered. Each waits on the one before it, so a held send (the
// one programme email a week floor) pushes the rest back rather than bunching.
export const ASK_STEPS = [
  { key: 'ask-1', afterSignupDays: 3 },
  { key: 'ask-2', afterPreviousDays: 4 },
  { key: 'ask-3', afterPreviousDays: 7 },
] as const

/** Which ask is due, or null. `sent` maps an ask key to days since it went. */
export function askDue(daysSinceSignup: number, sent: Record<string, number | undefined>): string | null {
  if (sent['ask-1'] === undefined) return daysSinceSignup >= 3 ? 'ask-1' : null
  if (sent['ask-2'] === undefined) return sent['ask-1'] >= 4 ? 'ask-2' : null
  if (sent['ask-3'] === undefined) return sent['ask-2'] >= 7 ? 'ask-3' : null
  return null
}

// ── THE SAME ASK, BEFORE AN ACCOUNT (16 November 2026) ─────────────────────
//
// Justin: "Yes, two short emails." A parent who did the stage check, saw their
// child's stage and never saved the pathway is asked too. Fewer questions,
// because they gave us less: the reason as one tap, then the moment that
// brought them and what the first two minutes should have shown.
//
// Signed on the lead's own id (starter_leads.id), under its own prefix, so a
// lead link can never open an account's answers or the other way round, and
// no email address is ever put in a URL.

export const LEAD_ASK_QUESTIONS: AskQuestion[] = [
  {
    key: 'stopped',
    label: 'What stopped you saving the pathway?',
    options: [
      'I wanted to look around first',
      'Not ready to make an account',
      'The price put me off',
      'I was not sure it would help',
      'No time just then',
      'Something else',
    ],
  },
  { key: 'why', label: 'What was going on at home that made you try the stage check?', placeholder: 'A row about the tablet, a new phone, bedtime...' },
  { key: 'early', label: 'What would you have wanted to see straight after it?', placeholder: 'What would have told you it is worth it' },
]

export const LEAD_ASK_KEYS = new Set(LEAD_ASK_QUESTIONS.map(q => q.key))

export function leadAskToken(leadId: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(`ask-lead:${leadId}`)
    .digest('hex')
    .slice(0, 32)
}

export function leadAskTokenValid(leadId: string | null | undefined, token: string | null | undefined): boolean {
  if (!leadId || !token || !/^[0-9a-f-]{36}$/i.test(leadId) || token.length !== 32) return false
  const want = Buffer.from(leadAskToken(leadId))
  const got = Buffer.from(token)
  return want.length === got.length && timingSafeEqual(want, got)
}

export function leadAskUrl(leadId: string): string {
  return `${APP_ORIGIN}/tell-us?l=${leadId}&k=${leadAskToken(leadId)}`
}

// Two, then silence: day 2 after the stage check, then four days after the
// first. Only stage checks from the last LEAD_ASK_WINDOW_DAYS are asked, so the
// day this ships nobody from a month ago is asked about "the stage check".
export const LEAD_ASK_WINDOW_DAYS = 14

/** Which lead ask is due, or null. `sent` maps a key to days since it went. */
export function leadAskDue(daysSinceStageCheck: number, sent: Record<string, number | undefined>): 'lead-ask-1' | 'lead-ask-2' | null {
  if (daysSinceStageCheck > LEAD_ASK_WINDOW_DAYS + 6) return null
  if (sent['lead-ask-1'] === undefined) return daysSinceStageCheck >= 2 && daysSinceStageCheck <= LEAD_ASK_WINDOW_DAYS ? 'lead-ask-1' : null
  if (sent['lead-ask-2'] === undefined) return sent['lead-ask-1'] >= 4 ? 'lead-ask-2' : null
  return null
}
