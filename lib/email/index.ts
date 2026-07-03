import { Resend } from 'resend'
import { createHmac } from 'crypto'

let _resend: Resend | null = null

function client(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'Justin at Guided Childhood <hello@guidedchildhood.com>'

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

// The unsubscribe link carries the user id plus an HMAC so it cannot be
// forged for other accounts. Keyed off CRON_SECRET which already exists
// in every environment that sends email.
export function unsubscribeToken(userId: string): string {
  return createHmac('sha256', process.env.CRON_SECRET ?? 'dev')
    .update(userId)
    .digest('hex')
    .slice(0, 32)
}

export function unsubscribeUrl(userId: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'
  return `${origin}/api/email/unsubscribe?u=${userId}&k=${unsubscribeToken(userId)}`
}

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
}): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured()) return { ok: false, error: 'RESEND_API_KEY not set' }
  try {
    const { error } = await client().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' }
  }
}
