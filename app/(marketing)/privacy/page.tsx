import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata = {
  title: 'Privacy Policy · Guided Childhood',
  description: 'How Guided Childhood collects, uses and protects your family’s information, and your rights under UK data protection law.',
}

const EFFECTIVE = '15 July 2026'

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', letterSpacing: '-0.02em', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: '15.5px', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }
const LI: CSSProperties = { fontSize: '15.5px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 7px' }

export default function PrivacyPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Privacy</p>
      <h1 style={H1}>Privacy Policy</h1>
      <p style={{ ...P, color: 'var(--ink-muted)' }}>Last updated {EFFECTIVE}</p>

      <p style={P}>
        Guided Childhood helps parents guide their children through the digital world. We take your family’s privacy seriously, and we keep to the data we genuinely need to run the service. This policy explains what we collect, why, who we share it with, and the rights you have under UK data protection law.
      </p>

      <h2 style={H2}>Who we are</h2>
      <p style={P}>
        Guided Childhood is the data controller for the information described here. You can reach us any time at <a href="mailto:hello@guidedchildhood.com" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>hello@guidedchildhood.com</a>.
      </p>

      <h2 style={H2}>What we collect</h2>
      <ul>
        <li style={LI}><strong>Your account:</strong> your name and email address, and your login details.</li>
        <li style={LI}><strong>About your child:</strong> a first name and an age band, so the pathway and lessons fit their stage. We do not ask for a surname, a date of birth, a photo, or a school.</li>
        <li style={LI}><strong>What you tell us:</strong> the wellbeing check ins you record, the concerns you flag, and the questions you ask DiGi.</li>
        <li style={LI}><strong>How you use the app:</strong> the quests, lessons and scripts you complete, so we can show your progress and pick the next step.</li>
        <li style={LI}><strong>Payment:</strong> your subscription is handled by Stripe. We never see or store your card number.</li>
      </ul>

      <h2 style={H2}>Your child’s information</h2>
      <p style={P}>
        Children do not have accounts and never log in. When you share a quest link with your child it is a private code that opens only their quests, with no way back to your account or anyone else’s. We hold the minimum about a child, a first name and an age band, and only because you chose to add it. You are always in control of it and can remove it at any time.
      </p>

      <h2 style={H2}>Why we use it, and our lawful bases</h2>
      <ul>
        <li style={LI}>To provide the service you signed up for (our contract with you).</li>
        <li style={LI}>To personalise DiGi and your pathway from what you have told us (your consent, which you can withdraw).</li>
        <li style={LI}>To send you service and lifecycle emails, which every email lets you unsubscribe from (legitimate interests).</li>
        <li style={LI}>To keep the service safe and improve it using aggregated, non identifying patterns (legitimate interests).</li>
      </ul>

      <h2 style={H2}>Who we share it with</h2>
      <p style={P}>
        We do not sell your data, ever. We use a small number of trusted providers who process it only on our instructions to run the service:
      </p>
      <ul>
        <li style={LI}><strong>Supabase</strong> and <strong>Vercel</strong> for secure database and hosting.</li>
        <li style={LI}><strong>Stripe</strong> for payments.</li>
        <li style={LI}><strong>Resend</strong> for our emails.</li>
        <li style={LI}><strong>Anthropic</strong> to power DiGi: your questions are sent to the AI model to generate a reply. They are not used to train the model, and they are not sold or shared beyond answering you.</li>
      </ul>

      <h2 style={H2}>How long we keep it</h2>
      <p style={P}>
        We keep your information while your account is open. If you close your account or ask us to delete your data, we remove it, other than anything we must keep for a short period by law, such as payment records.
      </p>

      <h2 style={H2}>Your rights</h2>
      <p style={P}>
        Under UK GDPR you can ask to see the data we hold, correct it, delete it, restrict or object to how we use it, or receive a copy to take elsewhere. Email us and we will help. You also have the right to complain to the Information Commissioner’s Office at ico.org.uk, though we hope you will give us the chance to put things right first.
      </p>

      <h2 style={H2}>Cookies</h2>
      <p style={P}>
        We use only the essential cookies needed to keep you logged in and the site working. We do not use advertising or tracking cookies.
      </p>

      <h2 style={H2}>Security</h2>
      <p style={P}>
        Your data is encrypted in transit and held with reputable providers. No system is ever perfect, but we design for the least data, the fewest hands, and the strongest sensible protection.
      </p>

      <h2 style={H2}>Changes</h2>
      <p style={P}>
        If we change this policy we will update the date above and, for anything significant, tell you by email. Questions are always welcome at <a href="mailto:hello@guidedchildhood.com" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>hello@guidedchildhood.com</a>.
      </p>

      <p style={{ ...P, marginTop: '36px' }}>
        <Link href="/terms" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Read our Terms →</Link>
      </p>
    </div>
  )
}
