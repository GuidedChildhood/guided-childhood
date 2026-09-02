import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { milestonesEarned, runsFromDays, type Milestone } from '@/lib/kid/milestones'
import { streakCurrency, friendsFromStreaks } from '@/lib/pathway/streak-unlock'
import { characterForStage } from '@/lib/content/stage-characters'
import { childWorries } from '@/lib/concerns/sorted'
import { getStarBanks } from '@/lib/quests/bank'
import { ukToday } from '@/lib/kid/five-a-day'

// The child's wins: what is waiting to be celebrated, and marking them seen.
//
// Same trust model as every other child route. The link token is the auth, there
// is no account and no login, and the token scopes everything to one child.
//
// GET does two things, and the second one is a write. That is deliberate and it
// is the pattern /api/kid/day already uses: the row is created on first read
// rather than by an overnight job, so nothing has to run for the feature to
// work and a child who never opens the app leaves no rows. The unique index on
// (child_id, kind, key) makes it safe to run on every single load, forever.
//
// WHY THE FIRST EVER SYNC IS QUIET. A child who already has forty streaks when
// this ships has earned ten Friends and six run milestones, and popping all
// sixteen at them one after another is not a celebration, it is a queue. So the
// first sync writes the history with celebrated_at already set and pops nothing.
// From then on, anything new is genuinely new.
//
// This replaces three localStorage keys (gc_kid_friends_earned, gc_kid_bank_mile,
// gc_kid_streak_seen), which celebrated once per DEVICE: twice for a child with
// a tablet and a phone, never again on a cleared browser, and never at all on a
// new one. And because nothing was written down, no parent could be told and no
// child could show a sibling what they had done.

export const dynamic = 'force-dynamic'

async function linkFor(token: string) {
  if (!/^[0-9a-f]{18}$/.test(token)) return null
  const admin = createAdminClient()
  const { data } = await admin
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  return data ? { admin, userId: data.user_id as string, childId: data.child_id as string } : null
}

type Admin = Awaited<ReturnType<typeof linkFor>> extends infer T
  ? T extends { admin: infer A } ? A : never
  : never

/** The three numbers the ladders are read from. Each fails soft to zero: a win
 *  that cannot be counted must never take a child's home screen down. */
async function currentTotals(admin: Admin, userId: string, childId: string) {
  const since = new Date(Date.now() - 400 * 86_400_000).toISOString().slice(0, 10)

  const [jobStreaksRes, daysRes, banks] = await Promise.all([
    admin.from('job_streaks').select('id', { count: 'exact', head: true })
      .eq('child_id', childId)
      .then(r => r, () => ({ count: 0 })),
    admin.from('kid_days').select('day')
      .eq('child_id', childId).not('completed_at', 'is', null)
      .gte('day', since).order('day', { ascending: true }).limit(500)
      .then(r => r, () => ({ data: [] as { day: string }[] })),
    // The child's own age band, so the weekly ceiling behind the balance is
    // theirs rather than the middle band fallback.
    admin.from('children').select('age_band').eq('id', childId).maybeSingle()
      .then(
        r => getStarBanks(admin as never, userId, [childId], { [childId]: (r.data?.age_band as string | null) ?? null }).catch(() => []),
        () => [] as Awaited<ReturnType<typeof getStarBanks>>,
      ),
  ])

  const days = ((daysRes as { data?: { day: string }[] }).data ?? []).map(d => String(d.day))
  const { best, current } = runsFromDays(days, ukToday())
  return {
    completedStreaks: streakCurrency((jobStreaksRes as { count?: number }).count ?? 0, days.length),
    bestRun: best,
    currentRun: current,
    bankBalance: (banks as { balance?: number }[])[0]?.balance ?? 0,
    completedDays: days.length,
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const link = await linkFor(token)
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })

  const totals = await currentTotals(link.admin, link.userId, link.childId)
  // The worries the parent has sorted for this child, delivered by the
  // child's own newest Planet Friend, or Pebble before any have come home.
  const worries = await childWorries(link.admin, link.userId, link.childId)
  const friend = characterForStage(Math.max(1, Math.min(5, friendsFromStreaks(totals.completedStreaks))))?.key ?? 'pebble'
  const earned = milestonesEarned({
    ...totals,
    sorted: worries.filter(w => w.sorted).map(w => ({ id: w.id, label: w.label })),
    friend,
  })

  // What is already written down. A read error here means the table is not there
  // yet, so the route hands back an empty queue rather than pretending: the home
  // screen simply shows no pop, which is exactly what it did before.
  const { data: existingRows, error: readErr } = await link.admin
    .from('kid_milestones')
    .select('kind, key, value, label, detail, character, earned_on, celebrated_at')
    .eq('child_id', link.childId)
  if (readErr) {
    return NextResponse.json({ pending: [], record: null, needsMigration: true })
  }

  const existing = existingRows ?? []
  const have = new Set(existing.map(r => `${r.kind}:${r.key}`))
  const missing = earned.filter(m => !have.has(`${m.kind}:${m.key}`))

  // The quiet first sync. If this child has no rows at all, everything they have
  // already earned is history, not news.
  const firstEver = existing.length === 0
  const nowIso = new Date().toISOString()

  let inserted: Milestone[] = []
  if (missing.length > 0) {
    const { error } = await link.admin.from('kid_milestones').insert(
      missing.map(m => ({
        user_id: link.userId,
        child_id: link.childId,
        kind: m.kind,
        key: m.key,
        value: m.value,
        label: m.label,
        detail: m.detail,
        character: m.character,
        celebrated_at: firstEver ? nowIso : null,
        // Backfilled history is not news for the grown up either, and a parent
        // who gets an email listing sixteen things their child did months ago
        // learns to ignore the next one.
        told_parent_at: firstEver ? nowIso : null,
      })),
      // Two tabs open at once both notice the same new win. The unique index
      // stops the second one, and ignoring the conflict stops it becoming a 500
      // on a child's screen over something that is already correct.
      { onConflict: 'child_id,kind,key', ignoreDuplicates: true } as never,
    )
    if (!error && !firstEver) inserted = missing
  }

  // Everything still waiting to be seen: what was already pending plus whatever
  // just landed. Oldest first, so a child who earned two things while away meets
  // them in the order they happened.
  const pending = [
    ...existing
      .filter(r => !r.celebrated_at)
      .map(r => ({
        kind: String(r.kind), key: String(r.key), value: Number(r.value) || 0,
        label: String(r.label), detail: r.detail ? String(r.detail) : '',
        character: String(r.character), earnedOn: String(r.earned_on),
      })),
    ...inserted.map(m => ({
      kind: m.kind, key: m.key, value: m.value,
      label: m.label, detail: m.detail, character: m.character,
      earnedOn: ukToday(),
    })),
  ].sort((a, b) => a.earnedOn.localeCompare(b.earnedOn))

  // The record: what this child has done, plainly, so they can hold it up next
  // to a sibling's. Their own numbers only. One child's screen never shows
  // another's, and we never draw the comparison ourselves.
  const all = [...existing.map(r => ({ kind: String(r.kind), value: Number(r.value) || 0 })), ...inserted]
  return NextResponse.json({
    pending,
    record: {
      streaks: totals.completedStreaks,
      completedDays: totals.completedDays,
      bestRun: totals.bestRun,
      currentRun: totals.currentRun,
      friends: all.filter(m => m.kind === 'friend').length,
      wins: all.length,
      stars: totals.bankBalance,
    },
  })
}

/**
 * The child has seen these. Fired as the pop closes, so the moment never
 * repeats on any device.
 *
 * Marks by (kind, key) rather than by id, because the ids the client holds came
 * from this route's own response and a client sending an arbitrary row id is a
 * thing worth simply not allowing. The child scope is the token's, always.
 */
export async function POST(request: NextRequest) {
  const { token, seen } = await request.json().catch(() => ({}))
  const link = await linkFor(typeof token === 'string' ? token : '')
  if (!link) return NextResponse.json({ error: 'unknown link' }, { status: 404 })
  if (!Array.isArray(seen) || seen.length === 0) return NextResponse.json({ ok: true })

  const pairs = seen
    .filter((s): s is { kind: string; key: string } =>
      !!s && typeof s.kind === 'string' && typeof s.key === 'string')
    .slice(0, 40)
  if (pairs.length === 0) return NextResponse.json({ ok: true })

  const { error } = await link.admin
    .from('kid_milestones')
    .update({ celebrated_at: new Date().toISOString() })
    .eq('child_id', link.childId)
    .is('celebrated_at', null)
    .in('kind', [...new Set(pairs.map(p => p.kind))])
    .in('key', [...new Set(pairs.map(p => p.key))])

  if (error) return NextResponse.json({ ok: true, needsMigration: true })
  return NextResponse.json({ ok: true })
}
