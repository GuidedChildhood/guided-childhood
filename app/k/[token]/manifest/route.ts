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
//
// Which leaves the ICON to tell two children apart on a tablet they share, and
// it now does: the Friend they chose, on that Friend's colour. See
// lib/kid/home-icon.tsx for why that is the right half to vary.

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
    // THIS CHILD'S FRIEND, NOT THE COMPANY MARK.
    //
    // These pointed at the parent app's logo, so an Android or desktop install
    // put the Guided Childhood mark on a child's Home Screen while an iPhone
    // install (apple-icon.tsx) put DiGi there. On a tablet two children share,
    // it also meant two identical icons with no way to tell whose is whose,
    // which is the shared device case in lib/kid/home-icon.tsx.
    //
    // Still no name on it: the picture is the Friend the child chose, which
    // identifies nothing to anyone holding the tablet.
    icons: [
      { src: `${base}/home-icon/192`, sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
      { src: `${base}/home-icon/512`, sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
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
