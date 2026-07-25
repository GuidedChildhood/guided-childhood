import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The monthly community bite. GET hands back this month's question, whether
// this parent has already answered, and the totals. POST records one answer.
//
// Totals are counted with the service role on purpose: a parent's own row is
// all they can read under RLS, so the crowd number has to come from the server
// rather than from a client that can see everyone's vote. Nothing identifying
// is ever returned, only counts.

export const dynamic = 'force-dynamic'

type PollRow = { id: string; question: string; options: string[]; month: string }

function firstOfThisMonth(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}

async function activePoll(admin: ReturnType<typeof createAdminClient>): Promise<PollRow | null> {
  // This month's poll, or the most recent one still active, so a month with no
  // question set never leaves an empty hole where the bite should be.
  const { data } = await admin
    .from('community_polls')
    .select('id, question, options, month')
    .eq('active', true)
    .lte('month', firstOfThisMonth())
    .order('month', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!data) return null
  const options = Array.isArray(data.options) ? (data.options as string[]) : []
  return { id: String(data.id), question: String(data.question), options, month: String(data.month) }
}

async function countsFor(admin: ReturnType<typeof createAdminClient>, pollId: string, optionCount: number) {
  const { data } = await admin
    .from('community_poll_votes').select('choice').eq('poll_id', pollId).limit(20000)
  const counts = new Array(optionCount).fill(0) as number[]
  for (const v of data ?? []) {
    const c = Number(v.choice)
    if (Number.isInteger(c) && c >= 0 && c < optionCount) counts[c] += 1
  }
  return { counts, total: (data ?? []).length }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ poll: null })

  const admin = createAdminClient()
  try {
    const poll = await activePoll(admin)
    if (!poll) return NextResponse.json({ poll: null })

    const [{ data: mine }, tally] = await Promise.all([
      admin.from('community_poll_votes').select('choice').eq('poll_id', poll.id).eq('user_id', user.id).maybeSingle(),
      countsFor(admin, poll.id, poll.options.length),
    ])

    return NextResponse.json({
      poll: { id: poll.id, question: poll.question, options: poll.options, month: poll.month },
      myChoice: mine ? Number(mine.choice) : null,
      counts: tally.counts,
      total: tally.total,
    })
  } catch {
    // Before migration 099 the tables are not there yet: no bite, no error.
    return NextResponse.json({ poll: null })
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { poll_id, choice } = await req.json().catch(() => ({}))
  if (typeof poll_id !== 'string' || !Number.isInteger(choice) || choice < 0) {
    return NextResponse.json({ error: 'poll_id and choice required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const poll = await activePoll(admin)
  if (!poll || poll.id !== poll_id) return NextResponse.json({ error: 'unknown poll' }, { status: 404 })
  if (choice >= poll.options.length) return NextResponse.json({ error: 'bad choice' }, { status: 400 })

  // One vote per parent: the unique index is the gate, so a double tap or a
  // second device changes the answer rather than adding a second one.
  const { error } = await admin
    .from('community_poll_votes')
    .upsert({ poll_id: poll.id, user_id: user.id, choice }, { onConflict: 'poll_id,user_id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // DiGi remembers what they said, so next month it can pick the thread back
  // up: last month you told me the hardest moment was the handover, how has
  // that been? Written as a plain memory row, so it flows through the same
  // retrieval as everything else DiGi knows about this family rather than
  // needing its own lookup. Best effort: the vote stands either way.
  try {
    await admin.from('digi_memory').insert({
      user_id: user.id,
      kind: 'community_poll',
      active: true,
      content: `Community poll (${poll.month}). Asked: ${poll.question} This parent answered: ${poll.options[choice]}`,
    })
  } catch { /* the vote is recorded regardless */ }

  const tally = await countsFor(admin, poll.id, poll.options.length)
  return NextResponse.json({ ok: true, counts: tally.counts, total: tally.total, myChoice: choice })
}
