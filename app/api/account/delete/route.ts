import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Delete this account and everything in it.
//
// The privacy policy already promised this: "If you close your account or ask
// us to delete your data, we remove it." Nothing delivered it. There was no
// route and no button, so the only way to honour the promise was for Justin to
// do it by hand in the Supabase dashboard, which is not a process, and under
// UK GDPR the right to erasure has a one month deadline attached.
//
// The database does the actual work and always did. auth.users cascades to
// profiles, profiles cascades to children, and children now cascades to the
// wellbeing rows (migration 120). So deleting the auth user takes the whole
// family with it. What was missing was a way to ask.
//
// Typed confirmation rather than a single tap. This is the one destructive
// action in the product that cannot be undone, and a mis-tap on a phone should
// not end a family's history.

export async function POST(req: NextRequest) {
  const { confirm } = await req.json().catch(() => ({}))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // The word is DELETE, and it has to be typed. Nothing else counts.
  if (typeof confirm !== 'string' || confirm.trim().toUpperCase() !== 'DELETE') {
    return NextResponse.json({ error: 'Type DELETE to confirm' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Delete the auth user. Everything else follows on cascade.
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    return NextResponse.json({ error: 'Could not delete the account. Email us and we will do it by hand.' }, { status: 500 })
  }

  // Sign the now deleted session out so the browser is not holding a token for
  // an account that no longer exists.
  await supabase.auth.signOut().catch(() => { /* the account is already gone */ })

  return NextResponse.json({ ok: true })
}
