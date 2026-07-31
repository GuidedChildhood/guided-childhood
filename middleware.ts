import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedPrefixes = ['/dashboard', '/educator', '/admin', '/onboarding']

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

    // Redirect authed users away from auth pages, honouring the next param
    // (an educator sent to /login?next=/educator must land on /educator,
    // not the parent dashboard).
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
