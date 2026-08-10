import { METHOD_WEEK } from '@/lib/email/method-week'

// The four method week emails, rendered as they will land.
//
// Justin, 10 August 2026: "emails to show this one week." Email copy is the one
// thing in this repo that cannot be checked by reading the code, because what
// arrives is the wrapper, the bands and the tone rotation together. So they get
// a page, and scripts/check-method-week.mjs drives this page rather than
// importing the templates: node cannot resolve the extensionless imports the
// app uses, and a check that runs the real render is worth more than one that
// runs a copy of it.

export const dynamic = 'force-static'

export default function MethodWeekFixture() {
  const built = METHOD_WEEK.map(step => ({
    ...step,
    content: step.make({ childName: 'Teo', unsubscribe: 'https://example.com/unsubscribe' }),
  }))

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 6px' }}>
          The method week
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 24px' }}>
          Four emails over seven days, anchored to the day this family first used the loop rather than to their signup date. Days {METHOD_WEEK.map(s => s.day).join(', ')}.
        </p>

        {built.map(b => (
          <section key={b.key} style={{ marginBottom: 34 }} data-email={b.key}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
              Day {b.day} &middot; {b.key}
            </div>
            <h2 data-subject style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 10px' }}>
              {b.content.subject}
            </h2>
            {/* srcDoc so the email's own styles cannot leak into this page and
                the page's cannot leak into the email. What is in the frame is
                what lands in an inbox. */}
            <iframe
              title={b.content.subject}
              data-body
              srcDoc={b.content.html}
              style={{ width: '100%', height: 900, border: '1.5px solid var(--border)', borderRadius: 16, background: '#fff' }}
            />
          </section>
        ))}
      </div>
    </div>
  )
}
