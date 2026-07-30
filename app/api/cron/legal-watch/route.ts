import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL } from '@/lib/config/digi'
import { sendEmail, emailConfigured } from '@/lib/email'

// The quarterly legal watch. See vercel.json.
//
// This product sits on law that moves: UK GDPR, the ICO Children's Code, the
// Online Safety Act and its phased duties, age assurance, and the MHRA line
// between a guide and a medical device. None of them writes to tell us.
//
// The realistic failure is not a breach, it is drift: a duty commences in March
// and nobody is watching, and we find out from a school's procurement
// questionnaire. Four reminders a year is cheap insurance against that.
//
// HARD LIMITS, and they matter more here than in any other cron we run:
//   - it files PENDING rows and nothing else. It never edits a policy, changes
//     a setting, or marks anything compliant
//   - a row with no source URL is dropped, because a legal claim nobody can
//     check is worse than silence
//   - the model is told to report uncertainty rather than resolve it, and that
//     returning nothing is a good answer
//
// It is a prompt to go and read a primary source. It is not advice, and the
// email says so.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

type Item = {
  area?: string
  headline?: string
  summary?: string
  impact?: string
  confidence?: 'low' | 'medium' | 'high'
  effective_on?: string | null
  url?: string
}

const SYSTEM = `You watch UK law for Guided Childhood, a digital parenting platform used by parents, with a companion app used by their children, and a schools product.

What the platform does, so you can judge relevance: it stores a parent account and a child's first name and age band; it lets a parent record weekly wellbeing observations about their child (mood, sleep, how they seem after screens), which is special category health data held on explicit consent; it runs an AI guide called DiGi that gives parenting advice and is explicitly not a diagnostic tool; children access a link based app with no account of their own; there is a schools product used by educators; payments run through Stripe.

Report what may have CHANGED or be about to change in these areas: UK GDPR and the Data Protection Act, the ICO Age Appropriate Design Code (Children's Code), the Online Safety Act and its phased duties and Ofcom codes, age assurance and age verification requirements, the MHRA boundary between wellbeing software and a medical device, and anything on AI regulation that would bind a service like this.

Rules, absolute:
- Only report something you have a real basis for. If you are not sure whether something has changed, say so in the summary rather than asserting it.
- NEVER state that the platform is or is not compliant. That is not your call and you do not have the facts.
- Give a real, checkable source URL for every item, preferring the primary source: legislation.gov.uk, ico.org.uk, ofcom.org.uk, gov.uk, mhra. If you cannot give a source, leave the item out entirely.
- Set confidence honestly. Low is the expected answer for most items and is not a failure. High means you are certain both that it changed and that it applies here.
- Plain British English, no dashes, no legalese where a normal sentence works.
- Returning an empty array is a good answer when nothing has moved.

Return ONLY a JSON array, up to 8 objects:
{"area":"GDPR|Children's Code|Online Safety Act|Age assurance|MHRA|AI|Other","headline":"max 12 words","summary":"2 to 3 sentences on what changed or may be changing","impact":"what this could mean for a platform like the one described, and what to go and check","confidence":"low|medium|high","effective_on":"YYYY-MM-DD or null","url":"https://primary source"}`

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()

  try {
    // What we already raised, so a quarter does not re-file the same thing.
    const { data: seen } = await admin
      .from('legal_watch_items')
      .select('headline, area')
      .order('created_at', { ascending: false })
      .limit(40)
    const already = (seen ?? []).map(s => `${s.area}: ${s.headline}`).join('\n') || 'nothing yet'

    const res = await anthropic.messages.create({
      model: DIGI_MODEL,
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Today is ${new Date().toISOString().slice(0, 10)}. This is the quarterly check.

Already raised in previous quarters, do not repeat unless something has genuinely moved on since:
${already}

What should we be looking at this quarter?`,
      }],
    })

    const text = res.content.find(c => c.type === 'text')?.type === 'text'
      ? (res.content.find(c => c.type === 'text') as { text: string }).text
      : ''
    const match = text.match(/\[[\s\S]*\]/)
    let items: Item[] = []
    try { items = match ? JSON.parse(match[0]) : [] } catch { items = [] }

    const rows = items
      // No source, no row. A legal claim nobody can check is worse than silence.
      .filter(i => i.headline && i.summary && i.url)
      .slice(0, 8)
      .map(i => ({
        area: i.area ?? 'Other',
        headline: i.headline as string,
        summary: i.summary as string,
        impact: i.impact ?? null,
        confidence: i.confidence === 'high' ? 'high' : i.confidence === 'medium' ? 'medium' : 'low',
        effective_on: i.effective_on && /^\d{4}-\d{2}-\d{2}$/.test(i.effective_on) ? i.effective_on : null,
        url: i.url ?? null,
      }))

    if (rows.length) await admin.from('legal_watch_items').insert(rows)

    if (rows.length && emailConfigured()) {
      const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const lines = rows.map(r =>
        `<li><strong>${esc(r.area)}:</strong> ${esc(r.headline)} <em>(${r.confidence} confidence)</em><br/>${esc(r.summary)}${r.url ? `<br/><a href="${esc(r.url)}">source</a>` : ''}</li>`
      ).join('')
      await sendEmail({
        to: FOUNDER_EMAIL,
        subject: `Quarterly legal watch: ${rows.length} to look at`,
        html: `<p>The quarterly check flagged ${rows.length} thing${rows.length === 1 ? '' : 's'} worth reading.</p><ul>${lines}</ul><p><strong>This is not legal advice and none of it says you are compliant.</strong> Each one is a prompt to open the source and check it yourself, or put it to a solicitor. They are on the insights board.</p>`,
      })
    }

    return NextResponse.json({ ok: true, filed: rows.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

export const GET = withHeartbeat('/api/cron/legal-watch', handler)
