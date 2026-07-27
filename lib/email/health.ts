// Is the email programme actually sending?
//
// It is a fair question with no answer today. The lifecycle cron runs at eight
// every morning and, with no Resend key, returns {skipped: true} and stops. From
// the outside that is indistinguishable from a morning where nobody happened to
// be due an email: no error, no alert, no record that it ran at all. A dead
// programme and a quiet one look exactly the same, and you find out weeks later
// when a parent mentions they never got anything.
//
// So this reads the two things that actually settle it. What the environment is
// missing, and when an email last genuinely went out. Every send writes to
// email_log or lead_email_log before it leaves, so the most recent row in either
// is the honest heartbeat.
//
// Kept out of the route so the reasoning is testable on its own and the page
// stays a view.

export type EmailConfigCheck = {
  key: string
  set: boolean
  // Shown only when it is safe to show. Never a secret's value.
  value?: string
  why: string
  fatal: boolean
}

export type EmailHealth = {
  live: boolean
  headline: string
  detail: string
  config: EmailConfigCheck[]
  lastSendAt: string | null
  hoursSinceLastSend: number | null
  sent24h: number
  sent7d: number
  byKey: { key: string; count: number }[]
}

// The heartbeat is stale once a full day and a bit has passed. The cron runs
// daily, so anything past about 26 hours means at least one morning produced
// nothing, which is worth looking at even though it is not proof of a fault:
// a small list on a quiet week genuinely can send nothing.
const STALE_HOURS = 26

export function readEmailConfig(env: NodeJS.ProcessEnv = process.env): EmailConfigCheck[] {
  return [
    {
      key: 'RESEND_API_KEY',
      set: Boolean(env.RESEND_API_KEY),
      why: 'Without it the daily cron returns skipped and no email is ever sent. This is the one that matters.',
      fatal: true,
    },
    {
      key: 'CRON_SECRET',
      set: Boolean(env.CRON_SECRET),
      why: 'The cron authorises with it. Unset, every run is rejected before it starts. It also signs the unsubscribe links.',
      fatal: true,
    },
    {
      key: 'EMAIL_FROM',
      set: Boolean(env.EMAIL_FROM),
      // The from address is not a secret and is the thing most likely to be
      // wrong in a way nothing else catches: an unverified domain fails at
      // Resend, not here.
      value: env.EMAIL_FROM ?? 'Justin at Guided Childhood <hello@guidedchildhood.com> (the default)',
      why: 'The sending domain has to be verified in Resend or every send is rejected there, with nothing wrong on our side.',
      fatal: false,
    },
    {
      key: 'NEXT_PUBLIC_APP_URL',
      set: Boolean(env.NEXT_PUBLIC_APP_URL),
      value: env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com (the default)',
      why: 'Every button and the unsubscribe link are built from it. Wrong here means emails that land but go nowhere useful.',
      fatal: false,
    },
  ]
}

export function judge(config: EmailConfigCheck[], lastSendAt: string | null, sent7d: number): {
  live: boolean
  headline: string
  detail: string
  hoursSinceLastSend: number | null
} {
  const missing = config.filter(c => c.fatal && !c.set)
  const hours = lastSendAt
    ? Math.floor((Date.now() - new Date(lastSendAt).getTime()) / 3600000)
    : null

  if (missing.length > 0) {
    return {
      live: false,
      headline: 'Not sending',
      detail: `${missing.map(m => m.key).join(' and ')} ${missing.length === 1 ? 'is' : 'are'} not set, so the daily run stops before it does anything.`,
      hoursSinceLastSend: hours,
    }
  }

  if (lastSendAt === null) {
    return {
      live: false,
      headline: 'Configured, but nothing has ever sent',
      detail: 'The settings are right and no email has left yet. Either nobody has been due one, or the cron has not run since it was set up.',
      hoursSinceLastSend: null,
    }
  }

  if (hours !== null && hours > STALE_HOURS) {
    return {
      live: false,
      headline: 'Configured, but quiet',
      detail: `Nothing has sent for ${hours} hours. The cron runs daily, so at least one morning produced nothing. On a small list that can be genuine, but it is worth a look.`,
      hoursSinceLastSend: hours,
    }
  }

  return {
    live: true,
    headline: 'Sending',
    detail: `${sent7d} email${sent7d === 1 ? '' : 's'} in the last seven days, the most recent ${hours === 0 ? 'within the hour' : `${hours} hours ago`}.`,
    hoursSinceLastSend: hours,
  }
}
