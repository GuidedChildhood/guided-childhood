import { magnetEmail } from '@/lib/email/templates'

// The printable delivery email, both ways it can go out, side by side.
//
// Justin, 15 October 2026, reading it on his phone: the starter pack button
// "needs to be clever enough to know if already has an account". A lead gets
// the starter pack through the signed click time link; a member gets the way
// back into their app instead. This renders both so the difference can be
// checked without sending anything.

const files = [
  { label: 'US Letter', url: '#' },
  { label: 'Ink saver A4', url: '#' },
]

export default function MagnetEmailFixture({ searchParams }: { searchParams: Promise<{ reader?: string }> }) {
  return <Both searchParams={searchParams} />
}

async function Both({ searchParams }: { searchParams: Promise<{ reader?: string }> }) {
  const { reader } = await searchParams
  const which = reader === 'member' ? 'member' : 'lead'
  const email = magnetEmail({
    magnetTitle: 'The Planet Post', downloadUrl: '#', files, reader: which,
    cta: '/api/go/starter?e=example&k=example',
    blurb: 'Colour in and fill in, with a screen promise to sign together. No login needed.',
  })
  return (
    <div style={{ background: '#f4f2ee', minHeight: '100dvh', padding: 12 }}>
      <p style={{ fontFamily: 'monospace', fontSize: 12, margin: '0 0 8px' }}>reader: {which} · subject: {email.subject}</p>
      {/* In a frame, because the email is a whole document with its own body
          tag, and pasting that inside this page's body is invalid HTML that
          React rightly complains about on hydration. */}
      <iframe title="email" srcDoc={email.html} style={{ width: '100%', height: 1100, border: 0, background: '#fff' }} />
    </div>
  )
}
