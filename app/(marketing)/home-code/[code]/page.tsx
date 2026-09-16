import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStarLessonByHomeCode } from '@/lib/quests/star-lesson-catalogue'
import { normaliseHomeCode, shortCode } from '@/lib/school/home-code'

// WHERE THE QR ON THE PARENT NOTE LANDS.
//
// The code has always worked. It has never had a front door: a parent had to
// already have the app, find a quiet card at the foot of the lessons page,
// and type four characters off a sheet in a book bag. Every unredeemed code
// is a family who met us and never arrived.
//
// So the note carries a QR now, and this is the other end of it.
//
//   Signed in  → straight to the card with the code already in it.
//   Signed out → this page, which says what the code is FOR before it asks
//                for anything, then offers the two honest doors.
//
// ITS OWN ROUTE, NOT A QUERY ON /join. Every CTA on /join routes to
// /starter-pack (non negotiable 9) and a code arriving there would either
// break that rule or be swallowed by it. A new parent still goes through the
// starter pack, which is the product's own front door; a parent who already
// has an account goes through login, which already carries ?next.
//
// It names the lesson when it can. "Your child's class did Keep it kind
// online today" is a page about their child; "enter your code" is a form.
// The curriculum is public on the schools site, so nothing is revealed here
// that a search would not find, and a wrong code learns only that it is
// wrong.

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const home = normaliseHomeCode(decodeURIComponent(code))
  return {
    title: home ? `Lesson code ${shortCode(home)}` : 'Lesson code',
    // A code is a private thing on a sheet of paper. It does not belong in
    // anybody's search index.
    robots: { index: false, follow: false },
  }
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65,
}

export default async function HomeCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const home = normaliseHomeCode(decodeURIComponent(code ?? ''))

  // Signed in is the common case and it should feel like no page at all:
  // the card on the lessons page picks the code up from the query and the
  // parent presses one button.
  if (home) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect(`/dashboard/lessons?home=${encodeURIComponent(shortCode(home))}`)
  }

  // The lesson's own title, so the page is about their child rather than
  // about us. Fails soft: a title we cannot read is a line we do not print.
  let title: string | null = null
  let yearBand: string | null = null
  if (home) {
    try {
      const lesson = await getStarLessonByHomeCode(createAdminClient(), home)
      title = lesson?.title ?? null
      yearBand = lesson?.year_band ?? null
    } catch { /* no title, still a page */ }
  }

  const next = home ? `/home-code/${shortCode(home)}` : '/dashboard/lessons'

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 20px 80px' }}>
      <p style={{ ...eyebrow, marginBottom: 10 }}>Brought home from school</p>

      {home ? (
        <>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 5.4vw, 2.3rem)', letterSpacing: '-0.02em', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 14px' }}>
            {title ? <>Today&rsquo;s lesson was {title}</> : <>Your child&rsquo;s class covered one of our lessons</>}
          </h1>
          <p style={{ ...body, marginBottom: 18 }}>
            {yearBand ? `${yearBand}. ` : ''}This code puts it on your child&rsquo;s own passport, the record of everything they
            have learned about being safe, balanced and sharp online between four and sixteen. One page per stage,
            filled by school and by home alike.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '14px 18px', marginBottom: 22 }}>
            <span style={{ ...eyebrow, color: 'var(--ink-muted)' }}>Your code</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xl)', letterSpacing: '0.14em', color: 'var(--ink)' }}>{shortCode(home)}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Link href="/starter-pack" className="btn btn-primary" style={{ minHeight: 48 }}>
              Start your child&rsquo;s passport
            </Link>
            <Link href={`/login?next=${encodeURIComponent(next)}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Already have an account ›
            </Link>
          </div>
          <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 18 }}>
            Keep the sheet. The code does not expire, and nothing about your child is shared back with the school.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 5.4vw, 2.3rem)', letterSpacing: '-0.02em', lineHeight: 1.12, color: 'var(--ink)', margin: '0 0 14px' }}>
            That code does not look right
          </h1>
          <p style={{ ...body, marginBottom: 20 }}>
            A lesson code is four letters or numbers, like HOME 7K3F, printed on the sheet that came home. Check it
            against the paper and try again, or enter it by hand once you are signed in.
          </p>
          <Link href="/starter-pack" className="btn btn-primary" style={{ minHeight: 48 }}>
            Start your child&rsquo;s passport
          </Link>
        </>
      )}
    </div>
  )
}
