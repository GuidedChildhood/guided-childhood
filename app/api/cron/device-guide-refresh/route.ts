import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL } from '@/lib/config/digi'
import { sendEmail, emailConfigured } from '@/lib/email'

// The device guide freshness check. Monthly (see vercel.json).
//
// The guides are the most perishable thing we hold. Apple, Google, Meta and the
// rest move menus, rename toggles and add controls constantly, and the social
// apps change fastest of all. A guide that has quietly gone stale is worse than
// no guide: a parent follows it, cannot find the setting or finds it does
// nothing, and walks away believing the house is covered.
//
// So this reads the guides that have gone longest without a look, asks what has
// actually changed, and files the answer as PENDING. It never edits a live
// guide. That gate matters more here than anywhere else in the product, because
// these are safety instructions and a confidently wrong step is the failure
// mode that hurts a family. A human approves, always.
//
// It also proposes apps we do not cover yet, since staying current means new
// arrivals as much as changed menus.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

// How many guides to look at per run. The whole bank every month would be a
// large model bill for content that mostly has not moved, and a review queue
// nobody can face is a review queue nobody reads.
const BATCH = 6

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

type Candidate = {
  device_key?: string
  kind?: 'update' | 'new'
  name?: string
  summary?: string
  steps?: string[]
  age_notes?: Record<string, string>
  url?: string
  rationale?: string
}

const SYSTEM = `You maintain the device safety guides for Guided Childhood, a UK digital parenting platform. Each guide tells a parent the exact settings to change on a device or app to make it safer for a child.

Your job is to find what has CHANGED and what is MISSING. Rules, absolute:
- Only report a change you are genuinely confident about. These are safety instructions. A parent who follows a wrong step believes their child is covered when they are not, which is worse than us saying nothing.
- If a guide still looks correct, do not invent a change to seem useful. Returning nothing is a good answer.
- Never invent a menu path, a toggle name or a feature. If you are unsure whether a setting still exists or is named the same, say so in the rationale rather than asserting it.
- UK context. British English, no dashes anywhere in the copy.
- The platform's philosophy is a calibrated pathway from 4 to 16: educate, never ban. Guides advise and explain, they never tell a parent to confiscate or forbid as the answer.
- Where the right setting genuinely differs by a child's age, put that in age_notes keyed by band: "4-7", "8-10", "11-13", "13-15", "16+". Only include a band when the guidance for it is actually different, not just softer wording.
- Steps stay in our house style: a bold instruction in **double asterisks** followed by the plain detail, one action per step.

Return ONLY a JSON array, no prose, of up to 8 objects:
{"device_key":"the existing key, or null for an app we do not cover","kind":"update|new","name":"the device or app","summary":"one or two sentences on what changed","steps":["**Do this.** detail", "..."],"age_notes":{"8-10":"..."},"url":"https://a real source","rationale":"why this matters, and any uncertainty you have"}
If nothing has meaningfully changed and nothing is missing, return [].`

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()

  try {
    // Oldest looked at first, so every guide comes round rather than the same
    // handful being checked forever.
    const { data: guides } = await admin
      .from('device_guides')
      .select('device_key, name, category, subtitle, min_age, steps, note, last_reviewed_at')
      .order('last_reviewed_at', { ascending: true, nullsFirst: true })
      .limit(BATCH)

    if (!guides?.length) return NextResponse.json({ ok: true, reviewed: 0, candidates: 0 })

    // What we already cover, so it does not propose a "new" app we have.
    const { data: allKeys } = await admin.from('device_guides').select('device_key, name')
    const covered = (allKeys ?? []).map(g => `${g.device_key} (${g.name})`).join(', ')

    const bank = guides.map(g => {
      const steps = ((g.steps as string[] | null) ?? []).map((s, i) => `    ${i + 1}. ${s}`).join('\n')
      return `GUIDE ${g.device_key} — ${g.name} (${g.category})\n  Subtitle: ${g.subtitle}\n  Last reviewed: ${g.last_reviewed_at ?? 'never'}\n  Steps:\n${steps}\n  Note: ${g.note}`
    }).join('\n\n')

    const res = await anthropic.messages.create({
      model: DIGI_MODEL,
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{
        role: 'user',
        content: `Today is ${new Date().toISOString().slice(0, 10)}.

We already cover: ${covered}

Review these guides and tell me what has changed since they were written, and whether any app a UK family actually uses is missing from the list above. Pay particular attention to the social and messaging apps, which change most often.

${bank}`,
      }],
    })

    const text = res.content.find(c => c.type === 'text')?.type === 'text'
      ? (res.content.find(c => c.type === 'text') as { text: string }).text
      : ''
    const match = text.match(/\[[\s\S]*\]/)
    let candidates: Candidate[] = []
    try { candidates = match ? JSON.parse(match[0]) : [] } catch { candidates = [] }

    // A candidate with no source cannot be checked, so it is not reviewable and
    // does not go in the queue.
    const rows = candidates
      .filter(c => c.summary && c.url)
      .slice(0, 8)
      .map(c => ({
        device_key: c.device_key ?? null,
        kind: c.kind === 'new' ? 'new' : 'update',
        name: c.name ?? null,
        summary: c.summary as string,
        steps: Array.isArray(c.steps) ? c.steps : null,
        age_notes: c.age_notes && typeof c.age_notes === 'object' ? c.age_notes : {},
        url: c.url ?? null,
        rationale: c.rationale ?? null,
      }))

    if (rows.length) await admin.from('device_guide_candidates').insert(rows)

    // Mark this batch as looked at whether or not anything came back. A guide
    // that was checked and found correct HAS been reviewed, and leaving it at
    // the front of the queue would mean the same six forever.
    await admin
      .from('device_guides')
      .update({ last_reviewed_at: new Date().toISOString() })
      .in('device_key', guides.map(g => g.device_key))

    if (rows.length && emailConfigured()) {
      const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const lines = rows.map(r =>
        `<li><strong>${esc(r.name ?? r.device_key ?? 'unknown')}</strong> (${r.kind}): ${esc(r.summary)}${r.url ? ` <a href="${esc(r.url)}">source</a>` : ''}</li>`
      ).join('')
      await sendEmail({
        to: FOUNDER_EMAIL,
        subject: `${rows.length} device guide ${rows.length === 1 ? 'change' : 'changes'} to review`,
        html: `<p>The monthly device guide check found ${rows.length} thing${rows.length === 1 ? '' : 's'} worth your eye.</p><ul>${lines}</ul><p>Nothing is live until you approve it. Every one needs checking against its source first, because a wrong setting is worse than no setting.</p>`,
      })
    }

    return NextResponse.json({ ok: true, reviewed: guides.length, candidates: rows.length })
  } catch (err) {
    // Never throw. A failed freshness check is not worth a paging alert, but a
    // silent one that nobody notices for months defeats the point.
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 })
  }
}

export const GET = withHeartbeat('/api/cron/device-guide-refresh', handler)
