import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL } from '@/lib/config/digi'
import { sendEmail, emailConfigured } from '@/lib/email'

// The script writer. Every two weeks (see vercel.json) DiGi drafts new scripts
// for the library from what parents actually asked for and could not find,
// grounded in the research bank (Dr Becky, Knibbs, the rest). Each draft lands
// in the review queue as PENDING. Nothing reaches the live library until the
// founder approves it on the insights board. The founder gets an email the
// moment new drafts land. Real demand in, a human gate always.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
const STAGES = new Set(['foundation', 'builder', 'explorer', 'shaper', 'independent'])

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

type Draft = { stage_id?: string; category?: string; title?: string; situation?: string; say_this?: string; not_this?: string; why_it_works?: string; tonight?: string; grounded_in?: string; rationale?: string }

const SYSTEM = `You write conversation scripts for Guided Childhood, a UK digital parenting platform. A script gives a parent the exact words for a hard screen moment. Philosophy: a calibrated pathway from 4 to 16, educate never ban, never allow or deny, structure and relationship over blanket limits. Justin's voice: warm, plain, direct, British, no AI-isms.

ABSOLUTE RULES:
- No dashes of any kind anywhere, not even a hyphen between words.
- Never invent a study, statistic, quote or source. Ground the "why it works" in the real research provided, naming the researcher or body inside the sentence. If nothing fits, teach from the principle and say it is our own approach, never a made up study.
- Every script fits the educate not ban pathway. Never a blanket ban, shame, or removing devices as the answer.
- say_this is the words a parent actually says, warm and specific. not_this is the common mistake to avoid. why_it_works is one short paragraph grounded in the research. tonight is one concrete thing to try in the next 24 hours.
- stage_id is one of: foundation (4 to 7), builder (8 to 10), explorer (11 to 13), shaper (13 to 15), independent (16+).
- Prefer scripts that answer the direct parent requests below, and fill gaps the library does not already cover. Never duplicate an existing title.

Return ONLY a JSON array, no prose, of up to 5 script drafts: {"stage_id":"...","category":"screen-time|social-media|gaming|online-safety|daily-moments|first-device|...","title":"...","situation":"one or two sentences on the moment","say_this":"the words to say","not_this":"the words to avoid","why_it_works":"grounded in named research","tonight":"one concrete step","grounded_in":"which researcher or body it leans on","rationale":"one line on why this belongs, tied to demand"}. If you cannot draft anything solid, return [].`

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()

  try {
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString()
    const [reqRes, scriptsRes, bankRes] = await Promise.all([
      admin.from('script_requests').select('problem').eq('status', 'new').gte('created_at', since).limit(120),
      admin.from('scripts').select('title, stage_id'),
      admin.from('expert_knowledge').select('source_name, finding').limit(400),
    ])
    const requests = [...new Set((reqRes.data ?? []).map(r => String(r.problem).trim()).filter(Boolean))].slice(0, 40)
    const haveTitles = (scriptsRes.data ?? []).map(s => `${s.title} (${s.stage_id})`)
    const research = (bankRes.data ?? []).slice(0, 60).map(r => `${r.source_name}: ${String(r.finding).slice(0, 180)}`)

    const userMsg = `Parents asked for scripts and could not find them (the demand to serve first)${requests.length ? ':\n' + requests.map(r => `- ${r}`).join('\n') : ' (none logged, so fill obvious gaps in the pathway instead)'}\n\nScripts we already have (never duplicate a title):\n${haveTitles.join('; ') || 'none yet'}\n\nResearch you may ground the why it works in (name the source inside the sentence):\n${research.join('\n')}\n\nDraft the new scripts now.`

    const resp = await anthropic.messages.create({
      model: DIGI_MODEL, max_tokens: 3000, system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    })
    const text = resp.content.map(b => (b.type === 'text' ? b.text : '')).join('\n')

    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    let parsed: Draft[] = []
    if (start !== -1 && end > start) {
      try { parsed = JSON.parse(text.slice(start, end + 1)) } catch { parsed = [] }
    }

    const req6 = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    const existing = new Set((scriptsRes.data ?? []).map(s => String(s.title).trim().toLowerCase()))
    const rows = parsed
      .filter(d => d && STAGES.has(req6(d.stage_id)) && req6(d.title) && req6(d.situation) && req6(d.say_this) && req6(d.not_this) && req6(d.why_it_works) && req6(d.tonight))
      .filter(d => !existing.has(req6(d.title).toLowerCase()))
      .slice(0, 5)
      .map(d => ({
        stage_id: req6(d.stage_id),
        category: req6(d.category).slice(0, 60) || null,
        title: req6(d.title).slice(0, 200),
        situation: req6(d.situation).slice(0, 2000),
        say_this: req6(d.say_this).slice(0, 4000),
        not_this: req6(d.not_this).slice(0, 4000),
        why_it_works: req6(d.why_it_works).slice(0, 4000),
        tonight: req6(d.tonight).slice(0, 2000),
        grounded_in: req6(d.grounded_in).slice(0, 200) || null,
        rationale: req6(d.rationale).slice(0, 400) || null,
        status: 'pending',
      }))

    let inserted = 0
    if (rows.length) {
      const { error, count } = await admin.from('script_candidates').insert(rows, { count: 'exact' })
      if (!error) inserted = count ?? rows.length
    }

    if (inserted > 0 && emailConfigured()) {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin
      try {
        await sendEmail({
          to: FOUNDER_EMAIL,
          subject: `${inserted} new script draft${inserted === 1 ? '' : 's'} to review`,
          html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A2E">
            <p>DiGi drafted <strong>${inserted}</strong> new script${inserted === 1 ? '' : 's'} from what parents asked for, grounded in the research bank.</p>
            <p>They are waiting in the review queue. Read each one, then approve to add it to the library or reject it.</p>
            <p><a href="${origin}/dashboard/insights" style="color:#C29018;font-weight:700">Review the drafts</a></p>
            <p style="color:#8888A0;font-size:13px">Nothing enters the live library until you approve it.</p>
          </div>`,
        })
      } catch { /* email is best effort */ }
    }

    return NextResponse.json({ ok: true, drafted: parsed.length, inserted })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Refresh failed' }, { status: 502 })
  }
}
