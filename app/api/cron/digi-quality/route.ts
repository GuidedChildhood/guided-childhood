import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { runEvals } from '@/lib/digi/evals'
import { runWeeklyTester, type TesterRun } from '@/lib/digi/weekly-tester'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { SITE_URL } from '@/lib/config/site'

// The Monday safety MOT, on its own clock. Runs the full eval suite, counts
// what the live verifier flagged in the last seven days, and emails the
// founder the verdict. An all clear still sends: a quiet inbox should mean
// no problems, never a check that silently stopped running. Same cron auth
// pattern as the rest: Vercel adds Authorization: Bearer <CRON_SECRET>.
//
// Since 1 September 2026 the same morning also runs the WEEKLY TESTER
// (lib/digi/weekly-tester.ts): five rotating difficult questions grown from
// what parents actually asked this week, graded by the same pipeline plus
// the three philosophy lenses, stored in digi_tester_runs, and reported in
// the sections below the MOT. The rotation fails soft: a bad morning for
// the rotating half never stops the fixed suite's verdict going out.

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  try {
    const run = await runEvals()
    const admin = createAdminClient()

    // The rotating half. Best effort by design: the MOT verdict must reach
    // the founder even on a morning the rotation cannot run.
    let tester: TesterRun | null = null
    try {
      tester = await runWeeklyTester(admin, {
        cases: run.cases,
        passed: run.passed,
        safetyBreaches: run.safetyBreaches,
        averageScore: run.averageScore,
      })
    } catch { /* reported as a plain line in the email below */ }

    // What the always on verifier caught in real conversations this week.
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data: liveFlags } = await admin
      .from('digi_safety_flags')
      .select('severity')
      .eq('source', 'live')
      .gte('created_at', weekAgo)

    const liveHigh = (liveFlags ?? []).filter(f => f.severity === 'high').length
    const liveTotal = (liveFlags ?? []).length
    // A safety breach is a breach whichever case provoked it: a rotating
    // question that trips the verifier is a real DiGi reply misbehaving.
    const testerBreaches = tester ? tester.results.filter(r => !r.safetyPass).length : 0
    const allClear = run.safetyBreaches === 0 && liveHigh === 0 && testerBreaches === 0

    const failing = run.results.filter(r => !r.safetyPass || r.rubricScore < 0.75)
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? SITE_URL

    // ── THE TESTER'S SECTIONS ───────────────────────────────────────────────
    // This week's difficult questions with each case's weakest moment, then
    // the three lists Justin asked for by name: common questions, script
    // gaps, and the science watch. Escaped because prompts and themes are
    // model written text landing in HTML.
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const worstLens = (r: NonNullable<typeof tester>['results'][number]) => {
      const l = r.lenses
      const min = Math.min(l.traumaInformed, l.connectionFirst, l.evidenceDiscipline)
      const name = min === l.evidenceDiscipline ? 'evidence' : min === l.connectionFirst ? 'connection' : 'no shame'
      return `${name} ${Math.round(min * 100)}%${l.notes ? ` · ${esc(l.notes)}` : ''}`
    }
    const testerHtml = tester
      ? `
        <h2 style="font-size:15px;margin:22px 0 6px;">This week's difficult questions</h2>
        ${tester.results.length === 0 ? '<p style="font-size:13px;color:#8888AA;">The rotation drafted no cases this week, worth a look at the cron log.</p>' : `
        <table style="border-collapse:collapse;width:100%;margin:6px 0;">
          ${tester.results.map(r => `
          <tr>
            <td style="padding:7px 8px;border-bottom:1px solid #E8E4D8;font-size:12px;line-height:1.5;">${esc(r.prompt.slice(0, 130))}${r.prompt.length > 130 ? '…' : ''}</td>
            <td style="padding:7px 8px;border-bottom:1px solid #E8E4D8;font-size:12px;white-space:nowrap;color:${r.safetyPass && r.score >= 0.75 ? '#2F8F6B' : '#C94F3D'};">${Math.round(r.score * 100)}%${r.safetyPass ? '' : ' breach'}</td>
            <td style="padding:7px 8px;border-bottom:1px solid #E8E4D8;font-size:11px;color:#55556E;">${worstLens(r)}</td>
          </tr>`).join('')}
        </table>`}
        ${tester.commonQuestions.length > 0 ? `
        <h2 style="font-size:15px;margin:18px 0 6px;">What parents asked this week</h2>
        <p style="font-size:13px;line-height:1.7;margin:0;">${tester.commonQuestions.map(c => `${esc(c.theme)} <strong>(${c.count})</strong>`).join(' · ')}</p>` : ''}
        ${tester.scriptGaps.length > 0 ? `
        <h2 style="font-size:15px;margin:18px 0 6px;">Script gaps</h2>
        <p style="font-size:13px;line-height:1.7;margin:0;">No script category matches these yet: ${tester.scriptGaps.map(g => `<strong>${esc(g.theme)}</strong> (${g.count})`).join(', ')}. These are the ones to write next.</p>` : ''}
        <h2 style="font-size:15px;margin:18px 0 6px;">Science watch</h2>
        <p style="font-size:13px;line-height:1.7;margin:0;">${tester.scienceWatch.pendingCandidates > 0
          ? `<strong>${tester.scienceWatch.pendingCandidates} research finding${tester.scienceWatch.pendingCandidates === 1 ? '' : 's'}</strong> waiting for your OK on the insights board.${tester.scienceWatch.newestPending ? ` Newest: ${esc(tester.scienceWatch.newestPending.slice(0, 160))}` : ''}`
          : 'Nothing waiting for review. The research updater runs fortnightly and queues findings here.'}</p>`
      : '<p style="font-size:13px;color:#C94F3D;">The weekly tester did not run this morning. The fixed suite above still did.</p>'

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
        ${testerHtml}
        <p style="font-size:14px;line-height:1.6;margin-top:18px;">
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
      kind: 'operational',
    })

    return NextResponse.json({
      ok: true,
      passed: run.passed,
      breaches: run.safetyBreaches,
      liveFlags: liveTotal,
      // The heartbeat reads bodies, not status codes: the rotation's health
      // is stated here so a silent failure of the new half is visible on the
      // board rather than hiding behind a 200.
      testerRan: tester !== null,
      testerCases: tester?.results.length ?? 0,
      testerBreaches,
      emailed: emailResult.ok,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'quality check failed' }, { status: 502 })
  }
}

export const GET = withHeartbeat('/api/cron/digi-quality', handler)
