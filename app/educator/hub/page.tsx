import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// THE HUB: everything a school needs around the lessons, one click deep.
// The anti Jigsaw: their Knowledge Hub buries compliance gold in a messy
// portal. Ours is one clean page: statutory mapping, policy and parents,
// data protection, safeguarding, CPD, FAQs. Every document prints.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

const DOCS = [
  {
    href: '/educator/hub/rshe-mapping', emoji: '📋', accent: 'var(--green-dark)',
    title: 'RSHE 2025 mapping matrix',
    body: 'Every module mapped to the named topics of the statutory guidance that becomes compulsory on 1 September 2026, plus KCSIE 2025 and Education for a Connected World. The document your PSHE lead files.',
  },
  {
    href: '/educator/hub/policy', emoji: '📜', accent: 'var(--green-dark)',
    title: 'Policy ready text',
    body: 'Paragraphs written to paste straight into your published RSE and online safety policy, including the parental transparency wording the 2025 guidance requires.',
  },
  {
    href: '/educator/hub/parents', emoji: '👪', accent: 'var(--gold-dark)',
    title: 'The parent pack',
    body: 'The whole programme explained for parents, module by module, with our transparency promise: parents can view any material on request, and our licence explicitly permits it. Built for your consultation.',
  },
  {
    href: '/educator/hub/data-protection', emoji: '🔒', accent: 'var(--deep-teal, #173C46)',
    title: 'Data protection pack',
    body: 'What we hold (almost nothing), why, and for how long. Written for your DPO: data minimisation by design, age differentiated notes per phase, and the DPIA support your records need.',
  },
  {
    href: '/educator/hub/dsl', emoji: '🛡️', accent: 'var(--coral-dark)',
    title: 'Safeguarding crosswalk',
    body: 'The DSL view: every safeguarding flagged module, its statutory hook and its disclosure guidance on one page, ready to reference from your safeguarding policy.',
  },
  {
    href: '/educator/hub/cpd', emoji: '🎓', accent: 'var(--coral-dark)',
    title: 'Staff briefings',
    body: 'Ten minute briefings for the sensitive modules: what the lesson covers, the register to hold, disclosure handling, and what to watch for in the room.',
  },
  {
    href: '/educator/hub/faq', emoji: '💬', accent: 'var(--ink-muted)',
    title: 'Common questions',
    body: 'The answers heads, governors and parents ask for most, in plain words.',
  },
]

export default async function HubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>Compliance, safeguarding and staff support</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The Hub
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '580px', marginBottom: '28px' }}>
          Everything your school needs around the lessons: the statutory mapping, the policy text,
          the parent pack, data protection and staff briefings. Every document prints from the page,
          and every one regenerates automatically when the curriculum changes, so nothing here can go stale.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {DOCS.map(d => (
            <Link key={d.href} href={d.href} style={{
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
              padding: '18px 20px', textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: '26px', flexShrink: 0 }}>{d.emoji}</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: d.accent, marginBottom: '4px' }}>
                  {d.title} →
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  {d.body}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
