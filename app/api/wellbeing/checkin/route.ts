import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHALLENGE_OPTIONS } from '@/lib/content/stages'
import { logConcernEvents } from '@/lib/concerns/events'
import { markFirstCheckIn } from '@/lib/checkin/first'

// The check in speaks the starter quiz's concern language, so a tick maps
// straight to a ledger slug and label.
const CHALLENGE_LABEL = new Map(CHALLENGE_OPTIONS.map(o => [o.value, o.label]))

// Save a monthly wellbeing check in: how the parent is doing, what has got
// better, and anything new. One row per check in, RLS keeps it to the owner.
// New worries are also folded into the concerns ledger so DiGi and the daily
// follow up carry them forward, and anything marked better nudges its concern
// along the arc, exactly like the daily concern check.
export async function POST(req: NextRequest) {
  let body: { parentMood?: number; fixed?: string[]; newConcerns?: string[]; note?: string; child_id?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const mood = typeof body.parentMood === 'number' && body.parentMood >= 1 && body.parentMood <= 5
    ? Math.round(body.parentMood) : null
  const fixed = Array.isArray(body.fixed) ? body.fixed.slice(0, 20).map(String) : []
  const newConcerns = Array.isArray(body.newConcerns) ? body.newConcerns.slice(0, 20).map(String) : []
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 1000) || null : null

  const { error } = await supabase.from('wellbeing_checkins').insert({
    user_id: user.id, parent_mood: mood, fixed, new_concerns: newConcerns, note,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fold the check in into the concerns ledger. Best effort: a ledger write
  // that fails must never fail the check in itself.
  try {
    const now = new Date().toISOString()
    const knownSlugs = [...newConcerns, ...fixed].filter(s => CHALLENGE_LABEL.has(s as never))
    if (knownSlugs.length > 0) {
      // Whose worries these are: the child off the wire (validated as this
      // parent's), the primary child only as a fallback. This read is_primary
      // unconditionally, so a worry raised about the second child was
      // permanently attached to the first and surfaced on the wrong check in.
      const { data: kids } = await supabase
        .from('children').select('id, is_primary').eq('parent_id', user.id)
      const childId = ((typeof body.child_id === 'string' && (kids ?? []).find(k => k.id === body.child_id))
        || (kids ?? []).find(k => k.is_primary)
        || (kids ?? [])[0]
        || null)?.id ?? null
      // Prior rows for THIS child only: the upsert keys on (user, child, slug),
      // so reading a sibling's row here would bump the wrong counter.
      const priorQuery = supabase.from('concerns')
        .select('slug, status, times_flagged').eq('user_id', user.id).in('slug', knownSlugs)
      const { data: existing } = await (childId ? priorQuery.eq('child_id', childId) : priorQuery)
      const priorBySlug = new Map((existing ?? []).map(c => [c.slug, c]))

      // New worries: open a concern (reopen if it had been resolved) and bump
      // the count, so a repeat theme lands on the same row.
      const newRows = newConcerns
        .filter(s => CHALLENGE_LABEL.has(s as never))
        .map(slug => {
          const prior = priorBySlug.get(slug)
          return {
            user_id: user.id, child_id: childId, source: 'checkin', slug,
            label: CHALLENGE_LABEL.get(slug as never) as string,
            status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
            times_flagged: prior ? prior.times_flagged + 1 : 1,
            last_flagged_at: now,
          }
        })
      if (newRows.length > 0) {
        await supabase.from('concerns').upsert(newRows, { onConflict: 'user_id,child_id,slug' })
        await logConcernEvents(supabase, user.id, newRows.map(r => r.slug), {
          event: 'flagged',
          source: 'checkin',
        })
      }

      // Things that got better: nudge an existing concern along its arc, the
      // same rule as the daily concern check (better once is improving, better
      // again is resolved). Only touches concerns that already exist.
      for (const slug of fixed) {
        const prior = priorBySlug.get(slug)
        if (!prior || newConcerns.includes(slug)) continue
        const status = prior.status === 'improving' ? 'resolved' : 'improving'
        // Scoped to this child: unscoped, "better" here marked every
        // sibling's same worry better too.
        const upd = supabase.from('concerns')
          .update({ status, last_checked_at: now })
          .eq('user_id', user.id).eq('slug', slug)
        await (childId ? upd.eq('child_id', childId) : upd)
      }
    }
  } catch { /* the ledger never blocks the check in */ }

  // First one ever is the baseline, and the moment the two doors may be
  // shown. Same stamp as the daily check, so either route can be a family's
  // first. See lib/checkin/first.
  await markFirstCheckIn(supabase, user.id)

  return NextResponse.json({ ok: true })
}
