import type { Metadata } from 'next'

// The child's segment overrides the parent app's identity.
//
// Everything under /k/[token] belongs to the child, not the parent, and until
// now it inherited the parent's manifest wholesale. That is what sent a child's
// Home Screen icon to /dashboard and a login screen. The manifest below is
// theirs, generated per token, so the icon opens their own jobs.
//
// This works only because the root layout stopped hardcoding <link rel=
// "manifest"> into the head. Two manifest links in one document is not a merge,
// it is a race the first one wins, so the override had to be metadata on both
// sides before it could take effect.
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  return {
    title: 'My Jobs',
    manifest: `/k/${token}/manifest`,
    // Their own DiGi star, from apple-icon.tsx in this segment, rather than the
    // parent app's logo inherited from the root.
    icons: { apple: `/k/${token}/apple-icon` },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      // What sits under the icon on their phone. Deliberately not their name:
      // a home screen is visible to anyone holding the device.
      title: 'My Jobs',
    },
    // A child's page should never be indexed, and the root sets index: true for
    // the marketing site, so this has to say otherwise explicitly.
    robots: { index: false, follow: false },
  }
}

export default function KidLayout({ children }: { children: React.ReactNode }) {
  // The child's app gets the same no sideways sliding guard as the parent's.
  // See .gc-shell in shared/tokens.css for why it lives on a wrapper rather
  // than on body, which is the version that breaks vertical scrolling.
  return <div className="gc-shell">{children}</div>
}
