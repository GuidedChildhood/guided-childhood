// Transactional email via the Resend REST API. Plain fetch, no SDK
// dependency. Without RESEND_API_KEY every send is a logged no-op, so the
// app builds and runs in every environment and email simply switches on
// when the key lands in Vercel.

const RESEND_URL = 'https://api.resend.com/emails'

const FROM = process.env.EMAIL_FROM ?? 'Justin at Guided Childhood <hello@guidedchildhood.co.uk>'

export interface SendResult {
  sent: boolean
  reason?: string
}

export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log(`[email] RESEND_API_KEY not set, skipping send to ${opts.to}: ${opts.subject}`)
    return { sent: false, reason: 'no_api_key' }
  }

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[email] Resend ${res.status} sending to ${opts.to}: ${body.slice(0, 300)}`)
      return { sent: false, reason: `resend_${res.status}` }
    }

    return { sent: true }
  } catch (err) {
    console.error('[email] send failed', err)
    return { sent: false, reason: 'network' }
  }
}
