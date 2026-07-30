import type { Health } from './health'

// The one email that gets sent when something is actually down.
//
// Deliberately not built on the parent template. That wrapper carries a
// "you get these because you joined" line and an unsubscribe link, and neither
// belongs on an operational alert to the founder. An alert you can accidentally
// unsubscribe from is an alert that will eventually stop arriving on the
// morning it matters most.
//
// It says what is broken and what breaks for a family as a result, because at
// seven in the morning the useful question is never "which key is missing", it
// is "who is not getting what".

const INK = '#1A1A2E'
const INK_SOFT = '#52526A'
const INK_MUTED = '#8888A0'
const BUTTER_DARK = '#C29018'
const CREAM = '#F9F8F6'
const BORDER = '#EAEAF0'
const RED = '#C0392B'

const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

export function healthAlertEmail(h: Health): { subject: string; html: string } {
  const down = [
    ...h.services.filter(s => s.level === 'down').map(s => ({ name: s.label, why: `${s.headline}. ${s.detail}` })),
    ...h.jobs.filter(j => j.level === 'down').map(j => ({
      name: j.job.label,
      why: j.overdueBy !== null
        ? `Has not run for ${j.hoursSince} hours, which is ${j.overdueBy} past due.`
        : `Last run failed. ${j.lastError ?? 'No error recorded.'}`,
    })),
  ]

  const warn = [
    ...h.services.filter(s => s.level === 'warn').map(s => s.label),
    ...h.jobs.filter(j => j.level === 'warn').map(j => j.job.label),
  ]

  const count = down.length
  const subject = count === 1
    ? `Guided Childhood: ${down[0].name} is down`
    : `Guided Childhood: ${count} services need you`

  const rows = down.map(d => `
    <tr><td style="padding:0 0 16px">
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:17px;font-weight:800;color:${INK}">${d.name}</div>
      <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${INK_SOFT}">${d.why}</div>
    </td></tr>`).join('')

  const warnLine = warn.length
    ? `<p style="margin:0 0 16px;font-size:15px;color:${INK_SOFT}">Also worth a look, though nothing is broken: ${warn.join(', ')}.</p>`
    : ''

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:${CREAM}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:32px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid ${BORDER};border-radius:20px">
      <tr><td style="padding:36px 32px 28px">
        <div style="font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${RED};margin-bottom:20px">Service alert</div>
        <h1 style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:24px;font-weight:800;line-height:1.2;color:${INK};margin:0 0 18px">
          ${count === 1 ? 'One thing is down' : `${count} things are down`}
        </h1>
        <div style="font-family:'Nunito',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;color:${INK}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          ${warnLine}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0"><tr><td style="background:#E9B949;border-radius:16px;box-shadow:0 5px 0 ${BUTTER_DARK}">
            <a href="${APP}/dashboard/admin/health" style="display:inline-block;padding:15px 32px;font-family:'IBM Plex Mono',Menlo,monospace;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${INK};text-decoration:none">Open the board</a>
          </td></tr></table>
          <p style="margin:0;font-size:14px;color:${INK_MUTED};line-height:1.6">
            This only sends when something is down, so silence means everything is running.
          </p>
        </div>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`

  return { subject, html }
}
