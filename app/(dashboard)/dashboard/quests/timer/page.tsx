import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'
import ShareQrButton from '@/components/quests/ShareQrButton'

// The screen timer, on its own page.
//
// It was a card at the top of Balance and stats, which meant starting twenty
// minutes of TV required opening a page about weekly averages and scrolling
// past a chart. Justin asked for it as its own button and its own page, and he
// is right: starting a timer is a thing you do in the moment with a child
// standing next to you, and reading the week is a thing you do sitting down.
// They do not belong on the same screen.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Screen timer · Guided Childhood' }

export default async function TimerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // ── AND IF THEY DO HAVE A PHONE, A WAY TO SET IT UP ──────────────────────
  //
  // Justin, 16 August 2026: "where it says 'no phone of their own' it should
  // have the link 'set it up here' and take them to the QR code."
  //
  // The line below has always opened by naming the case where a child has no
  // device, which is right, and then left the other case with nowhere to go. A
  // parent whose child DOES have a phone read a page explaining the workaround
  // for not having one, with no route to the thing they actually wanted. That
  // is why this page came back reported as broken: it is not broken, it is a
  // dead end.
  //
  // Ordered rather than .eq('is_primary', true).maybeSingle(), because
  // is_primary is not unique and maybeSingle ERRORS on more than one row: four
  // of five children on the live account carried the flag. See lib/setup/flags.
  const { data: kids } = await supabase
    .from('children').select('id, name, is_primary, created_at')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1)
  const child = (kids ?? [])[0] as { id: string; name: string | null } | undefined

  // Only offer it when there is nothing to offer yet. A family already handed
  // over does not need a second invitation on a page about the timer.
  const { data: links } = await supabase
    .from('kid_links').select('child_id').eq('user_id', user.id)
  const alreadyLinked = (links ?? []).some(l => l.child_id === child?.id)

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Quests
      </Link>
      <p className="eyebrow" style={{ marginBottom: 4 }}>Screen timer</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        Start some screen time
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 20px' }}>
        No phone of their own? Start it here and it still counts in the balance, on the same countdown you both watch.
      </p>

      {child && !alreadyLinked && (
        <div style={{
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: 16, padding: '14px 16px', marginBottom: 18,
        }}>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 10px', fontWeight: 600 }}>
            {child.name && child.name !== 'Your child' ? child.name : 'Your child'} does have their own phone? Set it up here and they can start their own time, on the same countdown.
          </p>
          <ShareQrButton
            childId={child.id}
            childName={child.name}
            label="Set it up here"
            style={{ fontSize: 'var(--text-base)', padding: '11px 18px', boxShadow: '0 4px 0 var(--terracotta-dark)' }}
          />
        </div>
      )}

      <ParentDeviceTime userId={user.id} />

      <Link
        href="/dashboard/stats"
        className="btn btn-outline"
        style={{ display: 'flex', justifyContent: 'center', marginTop: 22, padding: '15px 20px', fontSize: 'var(--text-md)', textDecoration: 'none' }}
      >
        See the week and the balance →
      </Link>
    </div>
  )
}
