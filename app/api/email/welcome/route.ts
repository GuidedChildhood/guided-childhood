import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail, unsubscribeUrl } from '@/lib/email'
import { welcomeEmail } from '@/lib/email/templates'
import { parentFirstName } from '@/lib/email/parent-name'

// ── THE WELCOME, ON THE DAY THEY JOIN ──────────────────────────────────────
//
// Justin, 11 September 2026: "do we send a confirmation email once set up,
// with welcome and user email confirmation?"
//
// The welcome exists and is good. What it was not was prompt. It goes out from
// /api/email/cron, which Vercel runs at 08:00 once a day, so a parent who
// signed up at ten in the morning got nothing at all until the following
// morning. Twenty two hours of silence on the one day they are paying
// attention, and on an account where "Confirm email" is off in Supabase, so
// there is no confirmation mail filling that gap either. Every one of the
// twenty three accounts on the live project was confirmed the instant it was
// made, which is the setting saying so.
//
// So setup finishing sends it, and the daily cron keeps its copy as the safety
// net for anyone this misses (a closed tab, a dead network, an account made
// before this existed).
//
// ── HOW IT CANNOT SEND TWICE ────────────────────────────────────────────────
//
// email_log has a unique key on (user_id, email_key) and the cron's own
// alreadySent reads exactly that table. So the row is claimed BEFORE the send,
// the same order deliver() uses: a unique violation means somebody already has
// this welcome and we stop, and a send that fails still counts, because a
// duplicate welcome is worse than a missing one on an account that will get
// every other email in the programme anyway.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, email_opt_out')
    .eq('id', user.id)
    .maybeSingle()

  // Opting out is opting out, including out of this one.
  if (profile?.email_opt_out) return NextResponse.json({ ok: true, skipped: 'opted_out' })

  // Claimed first. A row here is the whole lock.
  const { error: claimError } = await supabase
    .from('email_log')
    .insert({ user_id: user.id, email_key: 'welcome' })
  if (claimError) return NextResponse.json({ ok: true, skipped: 'already_sent' })

  const { data: child } = await supabase
    .from('children')
    .select('name')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const childName = (child?.name as string | null) && child!.name !== 'Your child'
    ? (child!.name as string)
    : 'your child'

  const sent = await sendEmail({
    to: (profile?.email as string | null) ?? user.email,
    kind: 'programme',
    key: 'welcome',
    ...welcomeEmail({
      parentName: parentFirstName(profile?.full_name as string | null, user.email),
      childName,
      unsubscribe: unsubscribeUrl(user.id),
    }),
  })

  return NextResponse.json({ ok: sent.ok })
}
