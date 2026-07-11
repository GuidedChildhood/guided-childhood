import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { sendEmail, emailConfigured } from '@/lib/email'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// The daily insight agent. It reads what parents have actually been asking
// DiGi, themes it, checks each theme against what the platform already has (a
// script, a lesson, a device guide, a piece of research), and hands Justin a
// ranked list of what to add or change. This is how the product learns from
// real demand instead of guesswork.
//
// Privacy is the hard line: only the questions themselves reach the model,
// aggregated and stripped of any family identifier. No user id, no child, no
// names. Founder only.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 120_000,
  maxRetries: 1,
})

export const maxDuration = 120
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

// Trim a free text field so a big corpus stays inside the token budget.
function clip(s: string | null, n: number): string {
  if (!s) return ''
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length > n ? t.slice(0, n) + '...' : t
}

async function callModel(prompt: string): Promise<string> {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({
        model,
        max_tokens: 2400,
        messages: [{ role: 'user', content: prompt }],
      })
      return msg.content[0]?.type === 'text' ? msg.content[0].text : ''
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

export async function POST(request: Request) {
  // Founder only. A cron can also call it with the shared secret so the daily
  // run does not need a logged in session.
  const secret = request.headers.get('x-insights-secret')
  const cronOk = !!process.env.INSIGHTS_CRON_SECRET && secret === process.env.INSIGHTS_CRON_SECRET

  if (!cronOk) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
      return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
    }
  }

  const body = await request.json().catch(() => ({}))
  const days: number = Math.min(Math.max(Number(body.days) || 30, 1), 90)
  const alsoEmail: boolean = body.email === true

  const admin = createAdminClient()
  const since = new Date(Date.now() - days * 86_400_000).toISOString()

  // The questions parents actually asked, de-identified. Only the question and
  // the stage travel onward, never a user or child id.
  const { data: questionsRaw } = await admin
    .from('digi_questions')
    .select('question, stage_id, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(400)

  const questions = (questionsRaw ?? []).map(q => ({ q: clip(q.question, 220), stage: q.stage_id }))

  if (questions.length === 0) {
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      days, count: 0,
      report: { summary: 'No DiGi questions in this window yet, so nothing to theme.', themes: [], gaps: [], recommendations: [] },
    })
  }

  // What we already have, so the model can tell a real gap from a covered one.
  const [scriptsRes, lessonsRes, guidesRes, knowledgeRes] = await Promise.all([
    admin.from('scripts').select('title, situation, stage_id'),
    admin.from('ai_lessons').select('title, strand'),
    admin.from('device_guides').select('name, category'),
    admin.from('expert_knowledge').select('source_name, topics'),
  ])

  const inventory = {
    scripts: (scriptsRes.data ?? []).map(s => `${s.title} (${s.stage_id})`),
    lessons: (lessonsRes.data ?? []).map(l => l.title),
    deviceGuides: (guidesRes.data ?? []).map(g => g.name),
    research: (knowledgeRes.data ?? []).map(k => `${k.source_name}: ${(k.topics as string[] | null)?.join(', ') ?? ''}`),
  }

  const prompt = `You are the product insight analyst for Guided Childhood, a digital parenting platform. Below are the real questions parents asked our AI advisor DiGi in the last ${days} days, de-identified, plus an inventory of what the platform already offers. Find what parents actually need that we are not yet serving well.

PARENT QUESTIONS (${questions.length}, most recent first, "[stage]" is the child's stage):
${questions.map(q => `- [${q.stage}] ${q.q}`).join('\n')}

WHAT WE ALREADY HAVE:
Scripts (${inventory.scripts.length}): ${inventory.scripts.join('; ')}
Lessons (${inventory.lessons.length}): ${inventory.lessons.join('; ')}
Device guides (${inventory.deviceGuides.length}): ${inventory.deviceGuides.join('; ')}
Research base topics: ${inventory.research.join(' | ')}

Do this:
1. Theme the questions into the recurring things parents are dealing with, with a rough count and which stages they cluster in.
2. Find the gaps: themes that come up but that our scripts, lessons, guides or research do not cover well. Mark whether we have nothing or only partial coverage.
3. Recommend concrete additions, ranked by how often the need came up and how load bearing it is. Each recommendation is a specific thing to build: a named script, a named lesson, a device guide, a research addition, or a philosophy or voice adjustment.

Guardrails: never suggest anything that would have DiGi allow or deny rather than give a calibrated pathway. Justin's voice is warm, plain, direct, no dashes. Ground every gap in the actual questions above, never invent demand.

Reply with ONLY valid JSON, no prose, in exactly this shape:
{"summary":"2 to 3 sentences on the headline of what parents needed this period","themes":[{"label":"short name","count":number,"stages":["stage names"],"example":"one real paraphrased question"}],"gaps":[{"topic":"short name","whatParentsAsk":"one line","coverage":"none|partial","note":"why it matters"}],"recommendations":[{"type":"script|lesson|device_guide|research|philosophy","title":"the specific thing to build","why":"one or two lines tied to the questions","priority":1}]}
Priority is 1 highest to 5 lowest.`

  let report: unknown
  try {
    const text = await callModel(prompt)
    const match = text.match(/\{[\s\S]*\}/)
    report = match ? JSON.parse(match[0]) : { summary: text.slice(0, 800), themes: [], gaps: [], recommendations: [] }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Insight run failed' }, { status: 502 })
  }

  const payload = { generatedAt: new Date().toISOString(), days, count: questions.length, report }

  // The daily drop: email the report to the founder when asked (or on the
  // cron run), so it lands without anyone opening the dashboard.
  if (alsoEmail && emailConfigured()) {
    try { await sendEmail({ to: FOUNDER_EMAIL, subject: `DiGi insight: ${questions.length} questions, ${days} days`, html: renderEmail(payload) }) }
    catch { /* email is best effort, the report still returns */ }
  }

  return NextResponse.json(payload)
}

type Report = {
  summary?: string
  themes?: { label: string; count: number; stages?: string[]; example?: string }[]
  recommendations?: { type: string; title: string; why: string; priority: number }[]
}

function renderEmail(payload: { generatedAt: string; days: number; count: number; report: unknown }): string {
  const r = payload.report as Report
  const recs = (r.recommendations ?? []).slice().sort((a, b) => a.priority - b.priority)
  return `<div style="font-family:system-ui,sans-serif;max-width:600px;color:#1A1A2E">
    <h2 style="color:#1A1A2E">What parents asked DiGi</h2>
    <p style="color:#52526A;font-size:14px">${payload.count} questions over ${payload.days} days</p>
    <p style="font-size:15px;line-height:1.6">${r.summary ?? ''}</p>
    <h3 style="margin-top:24px">Top things to build</h3>
    <ol style="font-size:14px;line-height:1.6;color:#1A1A2E">
      ${recs.map(x => `<li><strong>${x.title}</strong> <span style="color:#8888AA">(${x.type})</span><br>${x.why}</li>`).join('')}
    </ol>
    <p style="color:#8888AA;font-size:12px;margin-top:24px">Open the dashboard insights page for the full themes and gaps.</p>
  </div>`
}
