import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { parentFirstName } from '@/lib/email/parent-name'
import { ASK_KEYS, ASK_QUESTIONS, askTokenValid } from '@/lib/asks/stalled'

// ONE ANSWER FROM A PARENT WHO STOPPED, saved and sent to Justin's phone.
//
// No session: the parent arrives from an email and may never have got past
// the plan choice, so the signed link IS the identity (lib/asks/stalled.ts).
// A token only ever writes that one parent's rows, one row per question, so a
// leaked link can change one family's answers and nothing else.
//
// The push is not a nudge and takes no slot from the two a day cap: it is
// news that something just happened, to the founder, which is the cap's own
// exception.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { u?: string; k?: string; question?: string; answer?: string } | null
  if (!body || !askTokenValid(body.u, body.k)) return NextResponse.json({ error: 'This link has expired.' }, { status: 401 })
  const question = typeof body.question === 'string' ? body.question : ''
  const answer = typeof body.answer === 'string' ? body.answer.trim().slice(0, 2000) : ''
  if (!ASK_KEYS.has(question) || !answer) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })
  const spec = ASK_QUESTIONS.find(q => q.key === question)!
  if (spec.options && !spec.options.includes(answer)) return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 })

  const admin = createAdminClient()
  const userId = body.u as string
  const { data: parent } = await admin.from('profiles').select('id, full_name, email').eq('id', userId).maybeSingle()
  if (!parent) return NextResponse.json({ error: 'This link has expired.' }, { status: 401 })

  const { error } = await admin
    .from('parent_answers')
    .upsert({ user_id: userId, question, answer, updated_at: new Date().toISOString() }, { onConflict: 'user_id,question' })
  if (error) return NextResponse.json({ error: 'That did not save. Please try again.' }, { status: 500 })

  // Tell Justin. Best effort: an answer is saved whether or not his phone hears.
  try {
    const { data: founder } = await admin.from('profiles').select('id').ilike('email', FOUNDER_EMAIL).limit(1).maybeSingle()
    if (founder?.id) {
      const who = parentFirstName(parent.full_name as string | null, parent.email as string | null) ?? 'A parent'
      await sendPush({
        userId: founder.id as string,
        title: `${who} answered: ${spec.label}`,
        body: answer.length > 140 ? `${answer.slice(0, 137)}...` : answer,
        url: '/dashboard/admin/asks',
      })
    }
  } catch { /* the answer is saved; the page shows it either way */ }

  return NextResponse.json({ ok: true })
}
