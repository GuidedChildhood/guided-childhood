import { NextResponse } from 'next/server'

// The child's own web app manifest.
//
// Adding the jobs page to a Home Screen never worked, and this is why. The root
// layout serves /manifest.json to every route, and that manifest says
// "start_url": "/dashboard" with "scope": "/". So a child who followed our own
// instructions and tapped Add to Home Screen installed the PARENT app: the icon
// opened the parent dashboard, which has no session for them, and bounced them
// to a login screen they cannot pass. On Android the install prompt did the same
// thing under the name Guided Childhood.
//
// A manifest per token fixes it because the token IS the child's identity here.
// start_url and scope both point at their own page, so the icon opens their
// jobs, standalone, already signed in by the link itself.
//
// Not a security boundary and never was: the token is already in the URL, and
// this returns nothing that the page it points at does not already show. It is
// only here so the icon lands in the right place.
//
// No child's name in it. A manifest ends up in the phone's app list and in
// backups, and "My Jobs" on a home screen is a thing a child can own without
// their name being printed on a device that might be shared or handed on. The
// Children's Code data minimisation point, applied to the one bit of the
// product that literally lives on their phone.

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  // The token shape the kid routes already validate on. Anything else gets a
  // 404 rather than a manifest pointing at a URL that will not resolve.
  if (!/^[0-9a-f]{18}$/.test(token)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const base = `/k/${token}`

  return NextResponse.json({
    name: 'My Jobs',
    short_name: 'My Jobs',
    description: 'Your jobs, your stars, and the screen time you have earned.',
    start_url: base,
    scope: base,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#2E2818',
    theme_color: '#2E2818',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
    ],
    lang: 'en-GB',
    dir: 'ltr',
  }, {
    headers: {
      'Content-Type': 'application/manifest+json',
      // Private: this is one child's manifest, not a shared asset.
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
