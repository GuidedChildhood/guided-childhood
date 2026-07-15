import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Terms of Service · Guided Childhood',
  description: 'The terms for using Guided Childhood, including your subscription, the founder rate, cancellation, and important limits.',
}

const EFFECTIVE = '15 July 2026'

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', letterSpacing: '-0.02em', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }
const LI: CSSProperties = { fontSize: '15.5px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 7px' }

export default function TermsPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Terms</p>
      <h1 style={H1}>Terms of Service</h1>
      <p style={{ ...P, color: 'var(--ink-muted)' }}>Last updated {EFFECTIVE}</p>

      <p style={P}>
        These terms are the agreement between you and Guided Childhood when you use our website and app. By creating an account you accept them. Please read them, they are written to be plain.
      </p>

      <h2 style={H2}>Who can use Guided Childhood</h2>
      <p style={P}>
        You must be at least 18 and the parent or guardian of any child you add. You are responsible for your account and for keeping your login safe.
      </p>

      <h2 style={H2}>What Guided Childhood is, and is not</h2>
      <p style={P}>
        Guided Childhood is an educational and wellbeing service that helps you guide your child through screens and social media. It is guidance and support, not medical, psychological or clinical advice, and it is not a substitute for a professional. It is not a monitoring tool and not an emergency service. If you are worried about a child’s immediate safety, contact your GP, call NHS 111, call Childline on 0800 1111, or in an emergency call 999.
      </p>

      <h2 style={H2}>Your subscription</h2>
      <ul>
        <li style={LI}><strong>Free trial:</strong> new members get a 7 day free trial with everything unlocked. A card is collected at signup and your plan begins when the trial ends unless you cancel before then.</li>
        <li style={LI}><strong>Plans:</strong> the Founder rate is £7.99 a month, held for life while your subscription stays active, and limited to the first 50 members. After that, membership is £12.99 a month or £99 a year.</li>
        <li style={LI}><strong>Billing:</strong> payments are taken by Stripe and renew automatically each period until you cancel.</li>
        <li style={LI}><strong>Cancelling:</strong> you can cancel any time from your account. You keep access until the end of the period you have paid for, and we do not lock you out afterwards, you simply move to the free tier.</li>
        <li style={LI}><strong>Refunds:</strong> if something has gone wrong, email us and we will always try to put it right fairly.</li>
      </ul>

      <h2 style={H2}>The founder rate</h2>
      <p style={P}>
        The founder rate is limited to the first 50 members and is honoured for as long as that subscription remains active without a break. If a founder subscription lapses, the founder price may no longer be available.
      </p>

      <h2 style={H2}>Using the service fairly</h2>
      <p style={P}>
        Please use Guided Childhood for your own family. Do not copy, resell or redistribute the lessons, scripts, printables or other content, and do not try to break, misuse or gain unauthorised access to the service. The content is ours or our licensors’, and your membership gives you a personal licence to use it with your family.
      </p>

      <h2 style={H2}>DiGi</h2>
      <p style={P}>
        DiGi gives calibrated, supportive suggestions using an AI model. It can be wrong, and it never replaces your own judgement or a professional. Always use your judgement, and treat anything urgent as urgent.
      </p>

      <h2 style={H2}>Limits of our responsibility</h2>
      <p style={P}>
        We work hard to keep the service running and accurate, but we provide it as is and cannot promise it will always be uninterrupted or error free. To the extent the law allows, we are not liable for indirect or consequential loss. Nothing in these terms limits any right you have that cannot be limited by law, including under UK consumer law.
      </p>

      <h2 style={H2}>Changes</h2>
      <p style={P}>
        We may update these terms as the service grows. We will update the date above and, for anything significant, tell you by email. Continuing to use Guided Childhood means you accept the updated terms.
      </p>

      <h2 style={H2}>Law</h2>
      <p style={P}>
        These terms are governed by the law of England and Wales, and the courts of England and Wales have jurisdiction. Questions? Email <a href="mailto:hello@guidedchildhood.com" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>hello@guidedchildhood.com</a>.
      </p>

      <p style={{ ...P, marginTop: '36px' }}>
        <Link href="/privacy" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Read our Privacy Policy →</Link>
      </p>
    </div>
  )
}
