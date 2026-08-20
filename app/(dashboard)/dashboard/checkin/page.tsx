import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ConcernCheckIn from '@/components/daily/ConcernCheckIn'
import { getTodayCheckIn } from '@/lib/checkin/today'

export const dynamic = 'force-dynamic'

// ── THE CHECK IN, ON ITS OWN PAGE AT LAST ───────────────────────────────────
//
// Justin, 13 August 2026: "check in going to wrong section both on the welcome
// from DiGi link and the top of things to do today... the check is the 1 to 10
// we designed, where has that gone? That is the check in page... check in is
// different from moments."
//
// Nothing had been lost. The five word card was exactly where it was built,
// rendered above the moments deck on /dashboard/daily, and all three links to
// it pointed at /dashboard/daily#checkin. So every route to the check in
// dropped a parent onto the moments page and asked them to find it, and on a
// phone the deck is what fills the screen.
//
// The fix is the separation he is naming. A reading and a moment are the two
// things this product keeps most carefully apart: one asks how it is going,
// the other asks what happened. They were sharing a screen and a URL, so they
// read as one step and the first rung of the day looked like it went to the
// wrong place, because it did.
// ── ONE CHILD AT A TIME (18 August 2026) ────────────────────────────────────
//
// Justin, after doing one line for Olgie and being told the day was done:
// "the check in needs to be done for each child ... show both Olgie and Teo
// clearly showing name, and make sure we have to do the check in for each
// child's issues before it clears." Then: "maybe the parent runs through one
// child first then says done, onto next child?"
//
// That second shape is the one built, and it is the better of the two. A single
// list of every child's worries is eight rows on a phone with a name to check
// before each answer and no point at which anything is finished. One child's
// four, then the next child's four, is two short jobs, and it matches how the
// rest of the app already works now that ?child= means "which child" everywhere.
export default async function CheckInPage({
  searchParams,
}: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { rows, baseline, queue, childId, childName } = await getTodayCheckIn(supabase, user.id, childParam)

  // ── THE URL SAYS WHOSE CHECK IN THIS IS ───────────────────────────────────
  //
  // Justin: "when it finishes it goes to the next child, which is right, but
  // the toggle should then highlight that it is on Olgie."
  //
  // The loader picks the next child with something outstanding, which is the
  // behaviour he wants. It did it WITHOUT telling the URL, so the page said
  // "How is it going with Olgie?" while ?child= still named Teo, or named
  // nobody, and the switcher in the layout reads the URL. So the heading and
  // the pills disagreed, and the pills are the thing a parent trusts to tell
  // them where they are.
  //
  // Redirecting makes the URL the single truth, the same rule as everywhere
  // else. Guarded on childId being real and different, so there is no loop: the
  // next load arrives with the param already matching and falls straight
  // through.
  if (childId && childParam !== childId) redirect(`/dashboard/checkin?child=${childId}`)

  const nextChild = queue.find(k => k.id !== childId) ?? null

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 20px 40px' }}>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>
          Today · first thing
        </p>
        {/* THE NAME, BIG, NOT A SUFFIX. It used to sit as "· Olgie" in grey
            beside each row, which is readable only if you go looking. A parent
            answering five questions about a child needs to know whose day they
            are describing before the first one, not per line. */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4.5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 6px' }}>
          {childName
            ? (baseline ? `Where things are with ${childName}` : `How is it going with ${childName}?`)
            : (baseline ? 'Where things are now' : 'How is it going?')}
        </h1>

        {/* Only when there is genuinely a queue. On a one child family this
            whole line is noise about a choice that does not exist. */}
        {queue.length > 1 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 18px' }}>
            {queue.length} children to check in on · {childName ?? 'this one'} first
          </p>
        )}
        {queue.length <= 1 && <div style={{ height: '12px' }} />}

        {rows.length > 0 ? (
          <ConcernCheckIn baseline={baseline} concerns={rows} childName={childName} nextChild={nextChild} />
        ) : (
          // NOTHING TO CHECK IN ON IS NOT A FAILURE, and it must not read as
          // one. A family who has answered everything today lands here from a
          // link they tapped a minute ago, so it says so and offers the next
          // real thing rather than an empty page.
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: 20, padding: '26px 22px', textAlign: 'center',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 6px' }}>
              All done for today
            </p>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
              Nothing is waiting on you. Whatever comes up today, tell DiGi and it will be here tomorrow.
            </p>
            <Link href="/dashboard" style={{
              display: 'inline-flex', padding: '12px 20px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: 14, textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
              boxShadow: '0 4px 0 var(--terracotta-dark)',
            }}>
              Back to today
            </Link>
          </div>
        )}

        {rows.length > 0 && (
          <p style={{ textAlign: 'center', marginTop: '18px' }}>
            <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              Back to today
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
