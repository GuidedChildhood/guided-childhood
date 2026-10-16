import { getStageFromAgeBand } from '@/lib/content/stages'

// WHAT WE ARE NOT, ON THE STAGE CHECK (what-we-are-not-on-stage-check,
// 16 October 2026).
//
// The contrast with control apps lived only on the home page ("We will never
// ask you to spy on your child"). A parent who arrives here from a search for
// a blocking or monitoring app never saw it, and this is the page every advert
// lands on. So it is said once more, plainly, with no other product named:
// what we do not do, what the child does, and the words a parent leaves with.
//
// Every line has its proof in the product: the device settings guides are done
// with the child (lib/devices), nothing on either side reads a child's
// messages, the child has their own app with stars and the weekly family
// agreement (app/k, app/api/agreement/week), the result screen's Tonight card
// gives one thing to try for their age (components/starter/WorryAnswers), and
// the quoted sentence is the stage's own script, read from lib/content/
// stages.ts so it cannot drift. Builder is quoted because primary age is the
// heart of the market, and its line does not change with social_media_law.

const EXAMPLE = getStageFromAgeBand('8-10')

const NOT = [
  { label: 'Not a blocking app.', line: 'We show you the settings worth setting, and you set them with your child. Nothing gets locked behind their back.' },
  { label: 'Not reading their chats.', line: 'We never see your child\'s chats or DMs, and we will never ask you to read them.' },
  { label: 'Not done to them.', line: 'Your child has their own app, earns their own stars and helps write the family rules.' },
]

export default function WhatWeAreNot() {
  return (
    <section aria-label="What this is not" data-what-we-are-not style={{
      marginTop: '30px', background: 'var(--white)', border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-card)', padding: '20px 20px 18px',
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
        What this is not
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {NOT.map(n => (
          <li key={n.label} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>{n.label}</strong>{' '}{n.line}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '16px', background: 'var(--tint-butter)', borderRadius: 'var(--radius-tile)', padding: '14px 16px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 6px' }}>
          What you get is the words for tonight.
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 8px' }}>
          Three questions, then one thing to try tonight, written for their age. For a nine year old, the bedroom rule starts with this:
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
          &ldquo;{EXAMPLE.script.sayThis}&rdquo;
        </p>
      </div>
    </section>
  )
}
