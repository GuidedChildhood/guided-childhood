import { day2StageEmail, printablesRevealEmail, passportRevealEmail } from '@/lib/email/templates'

// The three emails that carry a Planet Friend, and the same three with no
// Friend at all.
//
// Both columns matter equally. The right hand column is what a family with no
// age band on their child gets, and what EVERY email that has not earned art
// looks like, so this fixture is the check that the no art path is still a
// finished email rather than one with a hole in it.
//
// It is also the only way to see them: the reveal emails send on days 49 and
// 70 of a real account's life, so there is no other way to look at one without
// waiting ten weeks.

export const dynamic = 'force-dynamic'

const UNSUB = 'https://example.com/unsubscribe'

function build(stageId: number | null) {
  return [
    {
      key: 'day2-stage',
      when: 'Day 2, to a member',
      content: day2StageEmail({
        childName: 'Olga',
        stageName: 'Builder',
        stageFocus: 'building the habits that hold when you are not in the room',
        unsubscribe: UNSUB,
        stageId,
      }),
    },
    {
      key: 'reveal-printables',
      when: 'Day 49, to a member',
      content: printablesRevealEmail({ childName: 'Olga', unsubscribe: UNSUB, stageId }),
    },
    {
      key: 'reveal-passport',
      when: 'Day 70, to a member',
      content: passportRevealEmail({ childName: 'Olga', unsubscribe: UNSUB, stageId }),
    },
  ]
}

export default function FriendEmailsDevPage() {
  // Stage 2 is Bloop. Any of 1 to 5 works; 2 is picked because Builder is the
  // band most families land in first.
  const withFriend = build(2)
  const without = build(null)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Dev fixture</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--ink)', margin: '0 0 8px' }}>
          The emails that carry a Planet Friend
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 28px', maxWidth: '70ch' }}>
          Three of them, and only three. Left is a family whose child has a stage,
          right is one whose child has no age band, which is the same thing every
          email that has not earned art shows. Check both read as finished.
          Turn images off in the browser to see what most readers get on a first open.
        </p>

        {withFriend.map((e, i) => (
          <div key={e.key} style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
                {e.key}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>{e.when}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '10px' }}>
              {e.content.subject}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '0 0 6px' }}>WITH A FRIEND (stage 2)</p>
                <iframe title={`${e.key} with`} srcDoc={e.content.html} style={{ width: '100%', height: '620px', border: '1px solid var(--border)', borderRadius: '14px', background: '#fff' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '0 0 6px' }}>NO STAGE, SO NO ART</p>
                <iframe title={`${e.key} without`} srcDoc={without[i].content.html} style={{ width: '100%', height: '620px', border: '1px solid var(--border)', borderRadius: '14px', background: '#fff' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
