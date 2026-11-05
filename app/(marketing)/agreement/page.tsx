import type { Metadata } from 'next'
import FamilyDealSheet from '@/components/deal/FamilyDealSheet'
import { promisesFrom, agreementTypeLabel } from '@/lib/content/agreement-promises'
import { AGREEMENT_TYPES, scienceForType } from '@/lib/content/agreement-clauses'
import { buddyFor } from '@/lib/kid/buddy'
import { LandingTop, LandingCta, Steps, Section, EYEBROW, BODY } from '@/components/marketing/EmailLanding'

// THE FAMILY AGREEMENT, FOR A PARENT WHO IS NOT SIGNED IN (5 November 2026).
//
// The parent email "One page everyone signs" linked to /dashboard/agreement,
// which a parent with no account meets as the login page. This is where that
// link lands now: what the agreement is, how it is built, the real sheet, and
// one door. The account is made in the starter pack, which brings them back to
// the builder (lib/starter/next.ts). A member signing in goes there directly.
//
// THE PREVIEW IS THE REAL SHEET. FamilyDealSheet is the component the builder
// prints and the child's app shows, rendered here with example rules a family
// might choose, the way /dev/deal-sheet renders it. A made up name and a
// Planet Friend, never a photograph of a child.

const NEXT = '/dashboard/agreement'
const START = `/starter-pack?next=${encodeURIComponent(NEXT)}`
const SIGN_IN = `/login?next=${encodeURIComponent(NEXT)}`

const TITLE = 'The family agreement: one page everyone signs'
const DESCRIPTION = 'Your family’s screen rules on one page: when, where, and where the devices spend the night. Choose the rules together, sign it together and put it on the fridge.'

export const metadata: Metadata = {
  title: 'The family agreement, one page everyone signs',
  description: DESCRIPTION,
  alternates: { canonical: '/agreement' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/agreement',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Guided Childhood, the family agreement' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og.png'] },
}

// Example rules, as a family might write them. Every key is a real clause the
// builder offers for this type (lib/content/agreement-clauses.ts).
const EXAMPLE = {
  agreement_type: 'tablet-games',
  clauses: {
    'screens-off': '7pm on school nights, later at weekends',
    'device-sleep': 'Every device charges in the kitchen overnight',
    'ask-first': 'We look at a new game or app together before it is downloaded',
    'earn-time': 'Jobs earn stars, stars buy screen time',
    'when-wrong': 'Tell us when something goes wrong online. Nobody loses their device for telling',
  },
}

const STEPS = [
  { title: 'Choose the kind of deal', body: 'Five, one for each stage, from first screens at 4 to 7 up to nearly independent at 16. The builder starts on the one for your child’s age.' },
  { title: 'Pick your rules', body: 'Ready made lines for when screens go off, where devices sleep, asking first and what happens when something goes wrong. Keep them, change the words, or write your own.' },
  { title: 'Sign it together', body: 'You and your child both sign, on paper or in the app. It shows on their side too, and they can ask to change a rule rather than break it.' },
  { title: 'Print it for the fridge', body: 'One A4 page. A review date is printed on it, so the deal changes as your child grows.' },
]

export default function AgreementLandingPage() {
  const buddy = buddyFor('bloop')
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <LandingTop signInHref={SIGN_IN} />

      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(20px, 5vw, 48px) 20px clamp(36px, 6vw, 56px)' }}>
        <p style={{ ...EYEBROW, marginBottom: 12 }}>The family agreement</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6.4vw, 3.1rem)', letterSpacing: '-0.03em', lineHeight: 1.06, color: 'var(--ink)', margin: '0 0 18px' }}>
          One page everyone signs.
        </h1>
        <p style={{ ...BODY, fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', marginBottom: 26 }}>
          Your family’s screen rules in one place: when, where, and where the devices spend the night. Not rules handed down, a deal you write together, so everybody knows what was agreed before the argument starts.
        </p>
        <LandingCta
          href={START}
          label="Create your free account"
          signInHref={SIGN_IN}
          note="Free to start, no card. The builder is part of membership, and yours to try in the four free days."
        />
      </section>

      {/* The real sheet, cropped to its top with a fade, on a paper card. */}
      <section aria-label="An example agreement" style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px clamp(44px, 7vw, 72px)' }}>
        <figure style={{ margin: 0 }}>
          <div style={{ position: 'relative', maxHeight: 620, overflow: 'hidden', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', boxShadow: '0 5px 0 var(--border)' }}>
            <div style={{ padding: 'clamp(12px, 3vw, 24px)' }}>
              <FamilyDealSheet
                childName="Alex"
                starMinutes={5}
                recommendedMinutes={75}
                timerRule="Alex asks first, then starts the timer. When it rings, the screen goes off."
                agreedDate="1 November 2026"
                quests={[{ title: 'Tidy my room', emoji: '🧺', stars: 2 }, { title: 'One hour of outside play', emoji: '🌳', stars: 4 }, { title: 'Read for ten minutes', emoji: '📖', stars: 2 }]}
                goal={{ title: 'A new football', starsNeeded: 30 }}
                promises={promisesFrom(EXAMPLE)}
                typeLabel={agreementTypeLabel(EXAMPLE.agreement_type)}
                reviewDate="1 December 2026"
                signedByParent
                signedByChild
                friend={{ name: buddy.name, img: buddy.img }}
                science={scienceForType(EXAMPLE.agreement_type)}
              />
            </div>
            <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(to bottom, transparent, var(--white))' }} />
          </div>
          <figcaption style={{ ...BODY, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 12, textAlign: 'center' }}>
            A real sheet from the builder, with example rules.
          </figcaption>
        </figure>
      </section>

      <Section eyebrow="How it works" title="From a blank page to the fridge" tint>
        <Steps steps={STEPS} />
      </Section>

      <Section eyebrow="One for every stage" title="A deal that grows with them">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {AGREEMENT_TYPES.map(t => (
            <li key={t.key} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span aria-hidden style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>{t.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                  {t.label} <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>{t.ages}</span>
                </div>
                <p style={{ ...BODY, fontSize: 'var(--text-base)', marginTop: 2 }}>{t.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(28px, 5vw, 48px) 20px clamp(64px, 9vw, 96px)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4.6vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 12px' }}>
          One thing to try tonight
        </h2>
        <p style={{ ...BODY, marginBottom: 24 }}>
          Pick one spot outside the bedroom where every device charges overnight, yours included. It makes a good first line for the page.
        </p>
        <LandingCta
          href={START}
          label="Create your free account"
          signInHref={SIGN_IN}
          note="Three questions about your child, then the builder opens."
        />
      </section>
    </div>
  )
}
