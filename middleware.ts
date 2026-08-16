import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { hasFullAccess, needsMembership, needsPlanChoice } from '@/lib/access'

// Where the two doors live. Exempt from its own redirect, or the block would
// bounce against itself for ever.
const CHOOSE_PATH = '/dashboard/choose'

// /educator left this list at the split cutover: the schools product lives
// at schools.guidedchildhood.com with no login at all, and next.config.ts
// redirects the old routes there.
const protectedPrefixes = ['/dashboard', '/admin', '/onboarding']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The ref- fixture pages are for us, not for the public.
  //
  // There are twelve of them, one per fiddly surface, and every one is a real
  // route on the live site: guidedchildhood.co.uk/ref-shop would serve a page.
  // Nothing leaks, they all render made up props, but they are half finished
  // looking pages under our own domain with our own branding, and robots.txt
  // never disallowed them either. app/dev/layout.tsx already says why that is
  // a problem, in exactly these words: a parent or a school finding one does
  // not think "test harness", they think the product is broken.
  //
  // /dev got that treatment and the ref- pages were missed. Here rather than in
  // twelve separate layouts, because they are twelve sibling directories with
  // no shared parent, and one check that also covers the thirteenth nobody has
  // written yet is worth more than twelve that have to be remembered.
  //
  // VERCEL_ENV, not NODE_ENV, for the same reason the dev layout gives:
  // NODE_ENV is production on preview builds too, and these earn their keep on
  // the preview attached to a pull request. VERCEL_ENV is 'production' only on
  // the live deployment.
  if (process.env.VERCEL_ENV === 'production' && pathname.startsWith('/ref-')) {
    return new NextResponse(null, { status: 404 })
  }

  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p))
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // Public marketing and content pages never need auth. Skip Supabase entirely
  // so a missing env var or an auth outage can never take these routes down.
  if (!isProtected && !isAuthPage) {
    return NextResponse.next({ request })
  }

  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }

    // ── THE PAYWALL ────────────────────────────────────────────────────────
    //
    // Justin, 11 August 2026: "yes everything is behind the paywall after 4
    // days and if not subscribed."
    //
    // HERE RATHER THAN IN THE PAGES, and that is the whole point. The paywall
    // used to be a per feature check and only about fifteen files out of the
    // thirty seven dashboard routes had one, which is not a policy, it is a
    // list of the places somebody remembered. One gate on the way in covers
    // every route that exists and, more usefully, every route nobody has
    // written yet. A new page is behind the paywall by being a page.
    //
    // needsMembership is a pure function of the path and it runs FIRST, so the
    // profile read below only happens on a path that could actually be
    // blocked. Settings, billing and the upgrade page cost no query at all.
    if (user && isProtected && needsMembership(pathname)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, trial_ends_at, created_at, plan_choice, onboarding_complete')
        .eq('id', user.id)
        .maybeSingle()

      if (!hasFullAccess(profile, user.email)) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/upgrade'
        // Where they were going, so the upgrade page can say what it opens and
        // send them back there afterwards rather than dumping them on Home.
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
      }

      // ── THE TWO PATHS, AT THE END OF SIGN UP ─────────────────────────────
      //
      // The same read, one more question, no extra round trip: both columns
      // ride along on the profile this gate already loads.
      //
      // AFTER hasFullAccess on purpose. A family whose free days have run out
      // cannot take the no card path any more, so they meet the upgrade page
      // and its standard pricing rather than a choice with one live option.
      //
      // AND THIS IS WHAT MAKES THE OFFER UNSKIPPABLE. It is the whole reason
      // the choice is a route with the middleware in front of it rather than a
      // screen at the end of the wizard, which is how it was lost once
      // already. See lib/access.ts for that story. A reload, a locked phone,
      // a closed tab, a bookmark straight into Quests: all of them land back
      // here until the parent has answered.
      //
      // The open prefixes above are untouched, so settings, billing, orders
      // and the upgrade page stay reachable throughout. A block a parent
      // cannot get out of, or cancel from, is a chargeback rather than a
      // customer, and that argument is already written into needsMembership.
      // JUST PAID, WEBHOOK NOT LANDED YET. Stripe sends them back carrying
      // upgraded=1 and the profile can take a second or two to say active.
      // Without this, a parent who has just typed their card number is thrown
      // back onto the screen asking them to choose, which reads as the payment
      // having failed. It skips one screen and grants nothing: access is still
      // hasFullAccess's answer, above, and the block returns on the next
      // navigation if the payment genuinely never completed.
      const justPaid = request.nextUrl.searchParams.has('upgraded')

      if (pathname !== CHOOSE_PATH && !justPaid && needsPlanChoice(profile)) {
        const url = request.nextUrl.clone()
        url.pathname = CHOOSE_PATH
        url.search = ''
        // Where they were headed, so both doors put them back on it rather
        // than on Home. A parent who tapped Quests wanted Quests.
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
      }
    }

    // Redirect authed users away from auth pages, honouring the next param
    // (a parent following a deep link into /dashboard/... must land there,
    // not on the dashboard home).
    if (user && isAuthPage) {
      const url = request.nextUrl.clone()
      const next = url.searchParams.get('next')
      url.pathname = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
      url.searchParams.delete('next')
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch {
    // Auth infrastructure failed (missing env, Supabase outage). Fail safe:
    // send protected routes to login, let auth pages render normally. Never
    // 500 the whole site over an auth check.
    if (isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
