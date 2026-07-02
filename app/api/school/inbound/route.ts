import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'

// Inbound school email webhook. The email provider (Resend Inbound or
// SendGrid Inbound Parse, configured at deploy time) POSTs forwarded school
// emails here. The to address carries the family's private token. DiGi
// extracts the actionable items, writes school_actions, surfaces a dashboard
// prompt, and the raw body is never stored.
//
// Auth: shared secret header set in the provider's webhook config, plus the
// per family token in the address. Uses the service role because inbound
// mail has no user session; every write is scoped to the token's owner.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function extract(subject: string, body: string, schoolName: string) {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const res = await anthropic.messages.create({
        model,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Extract actionable items for a parent from this school email from ${schoolName}. Only real actions a parent must do or remember: kit to bring (coat, PE kit, water bottle, wellies), payments due, homework or practice (times tables, reading), events and trips with dates, deadlines, important notices. Ignore newsletters with no action. Today is ${new Date().toISOString().slice(0, 10)}.\n\nSubject: ${subject}\n\n${body.slice(0, 4000)}\n\nReturn ONLY a JSON array (empty if no actions): [{"kind":"kit|payment|homework|event|deadline|notice","title":"max 10 words, imperative","detail":"one sentence","due_date":"YYYY-MM-DD or null"}]`,
        }],
      })
      const text = res.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
      const match = text.match(/\[[\s\S]*\]/)
      return match ? JSON.parse(match[0]) as { kind: string; title: string; detail?: string; due_date?: string | null }[] : []
    } catch { /* try next model */ }
  }
  return []
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-inbound-secret') !== process.env.SCHOOL_INBOUND_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await req.json()
  const to: string = payload.to ?? ''
  const from: string = (payload.from ?? '').toLowerCase()
  const subject: string = payload.subject ?? ''
  const body: string = payload.text ?? payload.html ?? ''

  const token = to.split('@')[0]?.replace(/^school\+/, '').trim()
  if (!token) return NextResponse.json({ ok: true, skipped: 'no token' })

  const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: conn } = await supabase
    .from('school_connections')
    .select('user_id, school_name, sender_addresses')
    .eq('forward_token', token)
    .eq('active', true)
    .maybeSingle()
  if (!conn) return NextResponse.json({ ok: true, skipped: 'unknown token' })

  // If the parent listed school senders, only accept those (a forwarded
  // email keeps the school in the payload sender or the forwarding header).
  const senders = (conn.sender_addresses ?? []).map((s: string) => s.toLowerCase())
  if (senders.length > 0 && !senders.some((s: string) => from.includes(s) || body.toLowerCase().includes(s))) {
    return NextResponse.json({ ok: true, skipped: 'sender not allowlisted' })
  }

  const items = (await extract(subject, body, conn.school_name)).slice(0, 5)
  if (items.length === 0) return NextResponse.json({ ok: true, actions: 0 })

  const valid = items.filter(i => ['kit', 'payment', 'homework', 'event', 'deadline', 'notice'].includes(i.kind) && i.title)
  if (valid.length === 0) return NextResponse.json({ ok: true, actions: 0 })

  await supabase.from('school_actions').insert(valid.map(i => ({
    user_id: conn.user_id, kind: i.kind, title: i.title.slice(0, 120),
    detail: i.detail?.slice(0, 300) ?? null, due_date: i.due_date || null,
  })))

  await supabase.from('digi_prompts').insert({
    user_id: conn.user_id,
    kind: 'school',
    title: valid.length === 1 ? valid[0].title : `${valid.length} things from ${conn.school_name}`,
    body: valid.map(i => `${i.title}${i.due_date ? ` (by ${i.due_date})` : ''}`).join('. ') + '.',
    reason: `School email: ${subject.slice(0, 100)}`,
  })

  return NextResponse.json({ ok: true, actions: valid.length })
}
