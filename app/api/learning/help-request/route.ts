import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailConfigured } from '@/lib/email'
import { CONTACT } from '@/lib/content/contact'
import { yearGroupFromDob } from '@/lib/learning/calendar'

// A parent asking us for help with a homework topic.
//
// Justin, 1 November 2026: "a system where they can click a button for
// assistance, then it arrives as a message to hello@ ... once I have enough
// requests we can build a school framework tool that helps the child step by
// step."
//
// So this is demand capture before build. Each request lands in the hello@
// inbox with the same subject shape, "Homework help: Year 6 · Maths: Number
// and place value", so a search on "Homework help:" counts them and the
// topic in the subject shows which one to build first. Nothing is stored here:
// the inbox is the ledger until the volume earns a table.
//
// Operational, not programme: it goes to us, not to a parent, so the weekly
// floor and suppression do not apply. The reply address is the parent's, so a
// reply from the inbox reaches them directly.

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Please log in again, then send it.' }, { status: 401 })

  const body = await req.json().catch(() => ({} as { childId?: string; topic?: string; note?: string }))
  const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 160) : ''
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 1000) : ''
  if (!topic && !note) return NextResponse.json({ error: 'Say what you would like help with.' }, { status: 400 })

  // The child, validated as this parent's, for the year group in the subject.
  let childName: string | null = null
  let yearLabel = 'Year unknown'
  if (typeof body.childId === 'string' && body.childId) {
    const { data: child } = await supabase
      .from('children').select('name, date_of_birth').eq('id', body.childId).eq('parent_id', user.id).maybeSingle()
    if (child) {
      childName = (child.name as string | null) ?? null
      const y = yearGroupFromDob(child.date_of_birth as string | null)
      if (y !== null) yearLabel = y === 0 ? 'Reception' : `Year ${y}`
    }
  }

  if (!emailConfigured()) {
    return NextResponse.json({ ok: false, error: 'That did not send. Please try again later.' }, { status: 503 })
  }

  const subject = `Homework help: ${yearLabel}${topic ? ` · ${topic}` : ''}`.slice(0, 200)
  const html = `
    <p><strong>A parent asked for help with homework.</strong></p>
    <p>Year: ${esc(yearLabel)}${childName ? ` (${esc(childName)})` : ''}<br>
    Topic: ${topic ? esc(topic) : 'not given'}<br>
    Parent: ${esc(user.email)}</p>
    ${note ? `<p>What they said:<br>${esc(note).replace(/\n/g, '<br>')}</p>` : '<p>No note added.</p>'}
    <p>Search the inbox for "Homework help:" to count requests by topic.</p>`

  const res = await sendEmail({ to: CONTACT.email, subject, html, kind: 'operational' })
  if (!res.ok) return NextResponse.json({ ok: false, error: 'That did not send. Please try again.' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
