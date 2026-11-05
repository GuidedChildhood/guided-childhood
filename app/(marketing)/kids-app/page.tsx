import type { Metadata } from 'next'
import Image from 'next/image'
import { LandingTop, LandingCta, TickList, Steps, Section, EYEBROW, BODY } from '@/components/marketing/EmailLanding'

// THE CHILD'S APP, FOR A PARENT WHO IS NOT SIGNED IN (5 November 2026).
//
// The parent email "Their own app, and stars for getting outside" linked to
// /dashboard/setup#share, which a parent with no account meets as the login
// page. This is the page that link lands on now: what the child sees, what the
// parent sets, how it goes on the home screen, and one door. The account is
// made in the starter pack, which sends them on to the share step of the Setup
// Quest (lib/starter/next.ts). A member signing in goes there directly.
//
// Every line here is something the app does today: the rate per star and the
// weekly cap, protected time no stars can buy, the free daily core, the ask
// before a start, no login for the child, the paper star chart. The picture is
// a real capture of the child's page, a made up name and no face.

const NEXT = '/dashboard/setup#share'
const START = `/starter-pack?next=${encodeURIComponent(NEXT)}`
const SIGN_IN = `/login?next=${encodeURIComponent(NEXT)}`

const TITLE = 'Your child’s own app: jobs earn stars, stars buy screen time'
const DESCRIPTION = 'The star quest is your child’s own app on their home screen. Jobs earn stars, outside and play jobs earn the most, and stars buy screen time on rules you set. No app store, no login for them.'

export const metadata: Metadata = {
  title: 'The star quest, your child’s own app',
  description: DESCRIPTION,
  alternates: { canonical: '/kids-app' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/kids-app',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood, the star quest' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og.png'] },
}

const SEES = [
  { title: 'Today’s jobs', body: 'The jobs you have agreed, with outside and play jobs paying the most stars.' },
  { title: 'Their star bank', body: 'How many stars they have, and how many minutes of screen time those stars are worth.' },
  { title: 'Something to save for', body: 'A goal of their own, like a film night, with a bar that fills as they earn.' },
  { title: 'Short lessons', body: 'Lessons about life online with the Planet Friend they choose, at their own stage.' },
]

const SETS = [
  { title: 'Which jobs, and what each one pays', body: 'You approve every job, including the ones your child suggests, and set its stars.' },
  { title: 'What a star is worth', body: 'Five minutes a star unless you change it, with a weekly cap you choose.' },
  { title: 'Time no stars can buy', body: 'Bedtime, meals and school hours stay protected. A start inside them comes to you as an ask.' },
  { title: 'A free daily core, if you want one', body: 'Some time that is simply theirs, so the screen is never the only prize.' },
]

const STEPS = [
  { title: 'Make your free account', body: 'Three questions about your child, then an email and a password. No card needed.' },
  { title: 'Open Share the app', body: 'It is a step on your Setup Quest. Your child scans the QR code on their phone or tablet.' },
  { title: 'Add it to the home screen', body: 'On an iPhone or iPad tap Share, then Add to Home Screen. On Android open the menu, then Add to home screen. No app store, no login and no account for them.' },
  { title: 'No device of their own?', body: 'Print the star chart and run the same quest on paper, or let them open it on your phone.' },
]

export default function KidsAppPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <LandingTop signInHref={SIGN_IN} />

      <section style={{ maxWidth: 1080, margin: '0 auto', padding: 'clamp(20px, 5vw, 48px) 20px clamp(44px, 7vw, 72px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(28px, 6vw, 64px)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 340px', maxWidth: 520 }}>
          <p style={{ ...EYEBROW, marginBottom: 12 }}>The star quest</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6.4vw, 3.1rem)', letterSpacing: '-0.03em', lineHeight: 1.06, color: 'var(--ink)', margin: '0 0 18px' }}>
            Their own app. Jobs earn stars, and stars buy screen time.
          </h1>
          <p style={{ ...BODY, fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', marginBottom: 26 }}>
            Your child sees their jobs, their stars and the time those stars have bought. You set the rules behind it, so screen time is something you agreed rather than something you fight about.
          </p>
          <LandingCta
            href={START}
            label="Create your free account"
            signInHref={SIGN_IN}
            note="Free to start, no card. The child’s app is part of membership, and yours to try in the four free days."
          />
        </div>

        {/* A real capture of the child's page, framed as a phone. Made up
            name, no photograph of anybody. */}
        <figure style={{ flex: '0 1 300px', margin: 0, textAlign: 'center' }}>
          <div style={{ width: 'min(300px, 78vw)', margin: '0 auto', borderRadius: 34, padding: 10, background: 'var(--ink)', boxShadow: '0 18px 40px rgba(26,26,46,0.18)' }}>
            <Image
              src="/marketing/kid-page.png"
              alt="The child’s app: their star bank worth 105 minutes, today’s goal, a film night they are saving for, and today’s jobs"
              width={390}
              height={780}
              priority
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 26 }}
            />
          </div>
          <figcaption style={{ ...BODY, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 12 }}>
            The real app, on a child’s phone.
          </figcaption>
        </figure>
      </section>

      <Section eyebrow="On their side" title="What your child sees" tint>
        <TickList items={SEES} />
      </Section>

      <Section eyebrow="On your side" title="What you control">
        <TickList items={SETS} />
      </Section>

      <Section eyebrow="Set up in a few minutes" title="On their home screen like any other app" tint>
        <Steps steps={STEPS} />
      </Section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(44px, 7vw, 72px) 20px clamp(64px, 9vw, 96px)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4.6vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 12px' }}>
          Start with three questions about your child
        </h2>
        <p style={{ ...BODY, marginBottom: 24 }}>
          The stage check sets up your account and your child, then takes you straight to sharing their app.
        </p>
        <LandingCta
          href={START}
          label="Create your free account"
          signInHref={SIGN_IN}
          note="No card needed to start."
        />
      </section>
    </div>
  )
}
