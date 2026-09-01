import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// "I tried this." Which is a different sentence from "I opened this."
//
// THE ONE THIS REPLACES. /api/moments/complete records that a card was opened,
// and its own comment says so: "A parent opening a moment card and reading it
// counts as doing today's moment". That is right for the daily streak, which is
// about showing up, and it stays exactly as it is. It is wrong for the passport,
// which is claiming a family fixed something.
//
// So this is the second, heavier signal, and it does not tick anything. It
// schedules the question. In a week DiGi asks how it went, the existing
// follow up machinery delivers the card, and the passport counts the answer.
//
// WHY A WEEK. Long enough that a morning routine has had five real goes at it,
// short enough that a parent still remembers what they changed. Justin's
// instinct was to review at the end of the stage, and the end of a stage is two
// to three years away: by then the answer is not knowable and the review is a
// dreaded task. The stage end then becomes a summary of verdicts already
// gathered, which is a thing you read rather than an exam you sit.

const CHECK_BACK_DAYS = 7

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { momentId, concernId, solution, child_id } = await request.json().catch(() => ({})) as {
    momentId?: string
    concernId?: string
    solution?: string
    child_id?: string
  }
  const uuid = (v?: string) => !!v && /^[0-9a-f-]{36}$/i.test(v)
  // One of the two, and they mean different things. A concern is the worry the
  // passport counts; a moment is the card the parent used to work on it. Most
  // taps carry both, a concern resolved without opening a card carries only the
  // first, and neither is a request worth scheduling a question about.
  if (!uuid(momentId) && !uuid(concernId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const [{ data: kids }, { data: moment }, { data: concern }] = await Promise.all([
    // Every child, so the follow up can land on the one this moment was
    // about (off the wire, validated) instead of always the primary child.
    supabase.from('children').select('id, age_band, is_primary').eq('parent_id', user.id),
    uuid(momentId)
      ? supabase.from('daily_moments').select('title, category').eq('id', momentId!).maybeSingle()
      : Promise.resolve({ data: null }),
    // Scoped to this user, so an id from somewhere else cannot schedule a
    // question about a stranger's worry.
    uuid(concernId)
      ? supabase.from('concerns').select('label, slug').eq('id', concernId!).eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  if (!moment && !concern) return NextResponse.json({ error: 'not found' }, { status: 404 })

  type Kid = { id: string; age_band: string | null; is_primary: boolean | null }
  const kidList = (kids ?? []) as Kid[]
  const child = (typeof child_id === 'string' && kidList.find(k => k.id === child_id))
    || kidList.find(k => k.is_primary)
    || kidList[0]
    || null
  const childId = child?.id ?? null
  const m = moment as { title: string; category: string } | null
  const c = concern as { label: string; slug: string } | null
  // The concern names the worry, the moment names the card. The worry is the
  // better thing to say back to a parent, so it wins when both are present.
  const title = c?.label ?? m?.title ?? 'that'
  const topic = (c?.slug ?? m?.category ?? '').toLowerCase() || null

  // Already waiting on an answer for this moment, so do not stack a second
  // question about the same thing. A parent who taps twice gets one check back,
  // not two cards a week apart asking the same question.
  const { data: existing } = await supabase
    .from('digi_followups')
    .select('id')
    .eq('user_id', user.id)
    .eq(uuid(concernId) ? 'concern_id' : 'moment_id', (uuid(concernId) ? concernId : momentId)!)
    .eq('status', 'pending')
    .maybeSingle()
  if (existing) return NextResponse.json({ ok: true, alreadyPending: true })

  const due = new Date(Date.now() + CHECK_BACK_DAYS * 86_400_000).toISOString().slice(0, 10)

  const { error } = await supabase.from('digi_followups').insert({
    user_id: user.id,
    child_id: childId,
    moment_id: uuid(momentId) ? momentId : null,
    concern_id: uuid(concernId) ? concernId : null,
    due_on: due,
    question: `A week ago you tried something for "${title}". How has it gone since?`,
    // The situation shape, so a verdict on this moment can be counted alongside
    // every other family's verdict on the same shape. Same fields
    // getProvenSolutions already ranks on.
    situation: { topic, time_band: null, trigger: title },
    suggestion: solution?.trim() || m?.title || title,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, dueOn: due })
}
