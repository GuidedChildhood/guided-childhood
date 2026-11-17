import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getChildren } from '@/lib/children/server'
import { stampedStickerNums } from '@/lib/pathway/passport-stickers-server'
import StickerPrintSheet from '@/components/passport/StickerPrintSheet'
import PrintButton from '../PrintButton'

// THE PARENT'S COLOUR STICKER PAGE (17 November 2026,
// plans/2026-11-17-passport-stickers-plan.md). Reached from the Stage done card
// and the order card on the passport page. ?stage=N leads with that sticker,
// twice, when it has been earned.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Passport stickers · Guided Childhood' }

export default async function PassportStickersPage({ searchParams }: { searchParams: Promise<{ child?: string; stage?: string }> }) {
  const { child: childParam, stage } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const { child } = await getChildren<{ id: string; name: string | null; is_primary: boolean | null }>(supabase, user.id, childParam, 'id, name')
  const kid = child?.name && child.name !== 'Your child' ? child.name : null
  const stamped = await stampedStickerNums(supabase, user.id, child?.id ?? null)
  const focus = Number(stage)
  const back = `/dashboard/pathway${child ? `?child=${encodeURIComponent(child.id)}` : ''}`

  return (
    <StickerPrintSheet kid={kid} stamped={stamped} focus={Number.isInteger(focus) ? focus : null}>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px', maxWidth: '52ch' }}>
        {stamped.length > 0
          ? 'Print in colour on plain paper or sticker paper. Every sticker in colour has been earned in the app.'
          : 'No sticker earned yet. The first one arrives when the first stage is done in the app, and this page fills in by itself.'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <PrintButton />
        <Link href={back} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Back to the passport
        </Link>
      </div>
    </StickerPrintSheet>
  )
}
