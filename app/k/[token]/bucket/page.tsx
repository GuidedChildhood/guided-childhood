import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import BucketBuilder from '@/app/(dashboard)/dashboard/printables/builder/BucketBuilder'

// The child's own bucket list builder.
//
// Justin, 12 August 2026, on the builder living only on the parent
// dashboard: "but should be on child app also."
//
// The SAME BucketBuilder the parent dashboard runs, the StarChartBuilder
// precedent exactly: one component on both phones so the two can never
// drift. The kid variant prefills their name, points the back link home,
// and turns Add to quests into an ask through the child request pipeline,
// so finishing the printed page still pays 5 stars once a grown up says
// yes.
//
// Same trust model as the rest of the child app: the link token scopes
// everything to one child, no account, no login.

export const dynamic = 'force-dynamic'

export const metadata = { title: 'My bucket list 🪣' }

export default async function KidBucketPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name').eq('id', link.child_id).maybeSingle()
  const name = child?.name && child.name !== 'Your child' ? (child.name as string) : ''

  return (
    // A light surface, the star chart builder's rule: the sheet is white
    // paper and the anthracite child background would swallow its edges.
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <BucketBuilder
        variant="kid"
        kidToken={token}
        defaultChildName={name}
        backHref={`/k/${token}?tab=print`}
        backLabel="My quests"
      />
    </div>
  )
}
