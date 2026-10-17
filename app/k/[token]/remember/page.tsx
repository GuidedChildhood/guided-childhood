import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import KidRememberCheck from '@/components/kid/KidRememberCheck'
import { loadRememberCheck } from '@/lib/kid/remember-server'
import { resolveTheme } from '@/lib/kid/theme'

// The Remember check on the child's own link: up to three questions from
// lessons they passed weeks ago (lib/kid/remember-due.ts). No account, no
// login, the token scopes everything. No stars, no stamp.

export const dynamic = 'force-dynamic'

export default async function KidRememberPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()
  const supabase = createAdminClient()
  const { data: link } = await supabase.from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()
  const [{ data: child }, check] = await Promise.all([
    supabase.from('children').select('name, accent').eq('id', link.child_id).maybeSingle(),
    loadRememberCheck(supabase, { userId: link.user_id, childId: link.child_id }),
  ])
  return (
    <KidRememberCheck
      token={token}
      childName={(child as { name?: string | null } | null)?.name ?? 'you'}
      questions={check.questions.map(q => ({ q: q.q, options: q.options, answer: q.answer, why: q.why, lessonTitle: q.lessonTitle, flagged: q.flagged }))}
      lessonsHref={`/k/${token}/lessons`}
      tellHref={`/k/${token}/tell`}
      theme={resolveTheme((child as { accent?: string | null } | null)?.accent ?? null)}
    />
  )
}
