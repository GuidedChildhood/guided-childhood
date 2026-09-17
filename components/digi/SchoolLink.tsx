import Link from 'next/link'

// The school link, as a signpost rather than a second setup form.
//
// This card used to BE the setup: two text boxes (school name, and a comma
// separated list of the school's sender addresses) and a button that would not
// budge until the first one was filled in. It sat in Settings, greyed out
// behind a Coming soon flag, while the card on Home pitched the same feature
// and linked to /dashboard/school, which had no setup on it at all.
//
// So there were two ways in, one of which was hidden and disabled and the other
// of which led nowhere. On 17 September 2026 the real setup was rebuilt on
// /dashboard/school (components/school/SchoolLetterbox.tsx), where the promo
// card already pointed and where a parent is already thinking about school.
//
// What is left here is a pointer. One way in, one place it lives, per the
// simplification agenda in THE-STORY.md: a page does one job. The old form is
// in git if it is ever wanted, but it should not come back, because the whole
// reason setup was failing is that it asked for things nobody knows before it
// would give anything.

export default function SchoolLink() {
  return (
    <div style={{
      background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
      borderRadius: 'var(--radius-card)', padding: '20px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
        marginBottom: '6px',
      }}>
        School link
      </div>
      <h3 style={{ fontSize: 'var(--text-md)', marginBottom: '8px' }}>Let DiGi catch the school emails</h3>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Forward school emails to your own private address and DiGi pulls out the things that matter: PE kit tomorrow, payment due, homework, trip forms. DiGi never sees your inbox, only what you forward.
      </p>
      <Link
        href="/dashboard/school"
        style={{
          display: 'inline-block', background: 'var(--terracotta)', border: 'var(--edge)',
          boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)', padding: '11px 20px',
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900,
          color: 'var(--ink)', textDecoration: 'none',
        }}
      >
        Set it up
      </Link>
    </div>
  )
}
