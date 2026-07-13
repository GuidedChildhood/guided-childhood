import { NextResponse } from 'next/server'
import { runEvals } from '@/lib/digi/evals'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'

// The Monday safety MOT, on its own clock. Runs the full eval suite, counts
// what the live verifier flagged in the last seven days, and emails the
// founder the verdict. An all clear still sends: a quiet inbox should mean
// no problems, never a check that silently stopped running. Same cron auth
// pattern as the rest: Vercel adds Authorization: Bearer <CRON_SECRET>.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  try {
    const run = await runEvals()

    // What the always on verifier caught in real conversations this week.
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data: liveFlags } = await createAdminClient()
      .from('digi_safety_flags')
      .select('code, severity')
      .eq('source', 'live')
      .gte('created_at', weekAgo)

    const liveHigh = (liveFlags ?? []).filter(f => f.severity === 'high').length
    const liveTotal = (liveFlags ?? []).length
    const allClear = run.safetyBreaches === 0 && liveHigh === 0

    const failing = run.results.filter(r => !r.safetyPass || r.rubricScore < 0.75)
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.guidedchildhood.com'

    const rows = failing.map(r => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #E8E4D8;font-family:monospace;font-size:12px;">${r.id}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8E4D8;font-size:12px;">${Math.round(r.score * 100)}%</td>
        <td style="padding:8px 10px;border-bottom:1px solid #E8E4D8;font-size:12px;">${r.violations.map(v => v.code).join(', ') || r.rubricNotes}</td>
      </tr>`).join('')

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1A1A2E;">
        <p style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#8888AA;">DiGi weekly quality check</p>
        <h1 style="font-size:22px;margin:6px 0 14px;">${allClear ? 'All clear this week.' : 'Something needs your eyes.'}</h1>
        <p style="font-size:14px;line-height:1.6;">
          Evals: <strong>${run.passed}/${run.cases} passed</strong>, ${run.safetyBreaches} safety breach${run.safetyBreaches === 1 ? '' : 'es'}, average score ${Math.round(run.averageScore * 100)}%.<br/>
          Live conversations flagged this week: <strong>${liveTotal}</strong>${liveHigh > 0 ? ` (${liveHigh} high severity)` : ''}.
        </p>
        ${failing.length > 0 ? `
        <table style="border-collapse:collapse;width:100%;margin:14px 0;">
          <tr>
            <th align="left" style="padding:8px 10px;border-bottom:2px solid #1A1A2E;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Case</th>
            <th align="left" style="padding:8px 10px;border-bottom:2px solid #1A1A2E;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Score</th>
            <th align="left" style="padding:8px 10px;border-bottom:2px solid #1A1A2E;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Why</th>
          </tr>
          ${rows}
        </table>` : ''}
        <p style="font-size:14px;line-height:1.6;">
          <a href="${origin}/dashboard/insights" style="color:#3D6478;font-weight:bold;">Open the insights page</a> for the full picture, or paste any of this to Claude and it gets fixed at the cause.
        </p>
        <p style="font-size:12px;color:#8888AA;line-height:1.6;">Runs every Monday. An all clear email means the check ran and DiGi behaved. Silence would only ever mean the check itself is broken.</p>
      </div>`

    const emailResult = await sendEmail({
      to: FOUNDER_EMAIL,
      subject: allClear
        ? `DiGi weekly check: all clear, ${run.passed}/${run.cases}`
        : `DiGi weekly check: ${run.safetyBreaches} breach${run.safetyBreaches === 1 ? '' : 'es'}, ${run.passed}/${run.cases} passed`,
      html,
    })

    return NextResponse.json({
      ok: true,
      passed: run.passed,
      breaches: run.safetyBreaches,
      liveFlags: liveTotal,
      emailed: emailResult.ok,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'quality check failed' }, { status: 502 })
  }
}
