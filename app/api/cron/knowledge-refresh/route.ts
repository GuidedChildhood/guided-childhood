import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL } from '@/lib/config/digi'
import { sendEmail, emailConfigured } from '@/lib/email'

// The research updater. Every two weeks (see vercel.json) DiGi's bank grows
// itself, safely. It reads what parents have actually been asking, drafts
// candidate findings from credible researchers and bodies that fit the
// calibrated pathway (educate, never ban), and drops them into the review
// queue as PENDING. Nothing reaches the live bank until the founder clicks OK
// on the insights board. The founder gets an email the moment new candidates
// land, so they know to check. Real sources only, and a human gate always.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
const AGE_BANDS = new Set(['4-7', '8-10', '11-13', '13-15', '16+'])

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

type Candidate = { source_type?: string; source_name?: string; finding?: string; age_bands?: string[]; topics?: string[]; url?: string; rationale?: string }

const SYSTEM = `You curate the evidence bank for DiGi, the AI guide inside Guided Childhood, a UK digital parenting platform. Its philosophy is a calibrated pathway from 4 to 16, educate never ban, never allow or deny, structure and relationship over blanket limits.

Your job: propose new, credible findings to add to the bank. Rules, absolute:
- Only real, verifiable findings from real researchers, clinicians or bodies (for example Candace Odgers, Amy Orben, Andrew Przybylski, Sonia Livingstone, Catherine Knibbs, Dr Becky Kennedy, Lisa Damour, the NHS, NSPCC, NICE, the UK Chief Medical Officers, 5Rights, Internet Matters, the Anna Freud Centre, Cambridge). Never invent a study, a statistic, a quote or a source. If you are not sure a source is real, leave it out.
- Every finding must fit the educate not ban pathway. Nothing that recommends blanket bans, shame, or removing devices as the answer.
- Each finding is one or two plain sentences a parent could act on, in British English, no dashes.
- Prefer findings that fill gaps in what parents are asking about.
Return ONLY a JSON array, no prose, of up to 6 objects: {"source_type":"researcher|clinician|association|report","source_name":"...","finding":"...","age_bands":["4-7","8-10","11-13","13-15","16+"],"topics":["..."],"url":"https://...","rationale":"one line on why it belongs in our bank"}. Use only the age bands that apply. If you can find nothing solid, return [].`

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()

  try {
    // What parents have been asking, and what the bank already holds, so the
    // model fills gaps and does not repeat what is already in.
    const since = new Date(Date.now() - 30 * 86_400_000).toISOString()
    const [questionsRes, bankRes] = await Promise.all([
      admin.from('digi_questions').select('question').gte('created_at', since).limit(120),
      admin.from('expert_knowledge').select('source_name, finding').limit(500),
    ])
    const questions = (questionsRes.data ?? []).map(q => String(q.question)).filter(Boolean)
    const topicSample = questions.slice(0, 40).map(q => `- ${q.slice(0, 160)}`).join('\n')
    const haveSources = [...new Set((bankRes.data ?? []).map(r => String(r.source_name)).filter(Boolean))]
    const existingFindings = new Set((bankRes.data ?? []).map(r => String(r.finding).trim().toLowerCase()))

    const userMsg = `Topics parents have asked DiGi about in the last month${questions.length ? ':\n' + topicSample : ' (none logged yet, so strengthen the core: screen routines, social comparison, gaming, sleep, the pathway to 16, online safety, wellbeing)'}\n\nSources already in the bank (do not repeat their existing findings, but a fresh finding from the same source is welcome):\n${haveSources.join(', ') || 'none yet'}\n\nPropose the new findings now.`

    const tools = [{ type: 'web_search_20250305' as const, name: 'web_search', max_uses: 5 }]
    let text = ''
    try {
      const resp = await anthropic.messages.create({
        model: DIGI_MODEL, max_tokens: 2500, system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
        // @ts-expect-error web search is a server tool the SDK forwards as is
        tools,
      })
      text = resp.content.map(b => (b.type === 'text' ? b.text : '')).join('\n')
    } catch {
      // Web search may not be available on the configured model, fall back to
      // the model's own knowledge, still gated by the human review.
      const resp = await anthropic.messages.create({
        model: DIGI_MODEL, max_tokens: 2500, system: SYSTEM,
        messages: [{ role: 'user', content: userMsg }],
      })
      text = resp.content.map(b => (b.type === 'text' ? b.text : '')).join('\n')
    }

    // Pull the JSON array out of the reply.
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    let parsed: Candidate[] = []
    if (start !== -1 && end > start) {
      try { parsed = JSON.parse(text.slice(start, end + 1)) } catch { parsed = [] }
    }

    // Keep only real looking rows, drop anything already in the bank.
    const rows = parsed
      .filter(c => c && typeof c.finding === 'string' && c.finding.trim().length > 20 && typeof c.source_name === 'string' && c.source_name.trim())
      .filter(c => !existingFindings.has(String(c.finding).trim().toLowerCase()))
      .slice(0, 6)
      .map(c => ({
        source_type: (c.source_type ?? 'source').slice(0, 40),
        source_name: String(c.source_name).slice(0, 160),
        finding: String(c.finding).trim().slice(0, 600),
        age_bands: (c.age_bands ?? []).filter(b => AGE_BANDS.has(b)),
        topics: (c.topics ?? []).map(t => String(t).slice(0, 40)).slice(0, 8),
        url: typeof c.url === 'string' && /^https?:\/\//.test(c.url) ? c.url.slice(0, 400) : null,
        rationale: typeof c.rationale === 'string' ? c.rationale.slice(0, 300) : null,
        status: 'pending',
      }))

    let inserted = 0
    if (rows.length) {
      const { error, count } = await admin.from('expert_knowledge_candidates').insert(rows, { count: 'exact' })
      if (!error) inserted = count ?? rows.length
    }

    // Tell the founder there is something to review.
    if (inserted > 0 && emailConfigured()) {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin
      try {
        await sendEmail({
          to: FOUNDER_EMAIL,
          subject: `${inserted} new finding${inserted === 1 ? '' : 's'} to review for DiGi`,
          html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A2E">
            <p>The research updater found <strong>${inserted}</strong> candidate finding${inserted === 1 ? '' : 's'} for DiGi's bank, all aligned to the pathway.</p>
            <p>They are waiting in the review queue. Open the insights board, read each one, and click OK to send it into the bank or reject it.</p>
            <p><a href="${origin}/dashboard/insights" style="color:#C29018;font-weight:700">Review the findings</a></p>
            <p style="color:#8888A0;font-size:13px">Nothing enters DiGi's live bank until you approve it.</p>
          </div>`,
        })
      } catch { /* email is best effort */ }
    }

    return NextResponse.json({ ok: true, drafted: parsed.length, inserted })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Refresh failed' }, { status: 502 })
  }
}
