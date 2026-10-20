import Link from 'next/link'
import type { CSSProperties } from 'react'
import { SITE_URL } from '@/lib/config/site'
import { MAX_QUESTION } from '@/lib/muse/connector'

// The documentation page for the Meta Muse connector: the URL in the form's
// "API or MCP documentation" field, read by Meta's reviewers and by any parent
// who wonders what the connector does. Built on the privacy page's layout and
// tokens, deliberately: it is a document, not a new surface, so it borrows the
// one we already have rather than inventing a look. The why of the connector
// is in lib/muse/connector.ts.

export const metadata = {
  title: 'Guided Childhood for Muse · Guided Childhood',
  description: 'How the Guided Childhood connector for Meta’s Muse works: ask DiGi a question about screens and phones, or find the exact words for a situation.',
}

const WRAP: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '48px 22px 80px' }
const H1: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 2.8rem)', letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '10px' }
const H2: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', letterSpacing: '-0.02em', margin: '34px 0 10px', color: 'var(--ink)' }
const P: CSSProperties = { fontSize: 'var(--text-base)', lineHeight: 1.65, color: 'var(--ink-soft)', margin: '0 0 12px' }
const LI: CSSProperties = { fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 7px' }
const CODE: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', overflowX: 'auto', whiteSpace: 'pre', color: 'var(--ink)', margin: '0 0 14px' }
const INLINE: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.92em', wordBreak: 'break-all' }
const LINK: CSSProperties = { color: 'var(--terracotta-dark)', fontWeight: 700 }

const ASK_REQUEST = `POST ${SITE_URL}/api/muse/ask
Content-Type: application/json

{ "question": "My 9 year old keeps asking for Roblox. What do I say?",
  "child_age": 9 }`

const ASK_RESPONSE = `{ "answer": "The whole answer as plain text...",
  "signpost": null,
  "where_you_are": "...",
  "next_step": "...",
  "say_this": "...",
  "not_this": "...",
  "script": { "title": "...", "url": "${SITE_URL}/say/..." },
  "stage": { "number": 2, "name": "Builder", "ages": "Ages 8 to 10" },
  "stage_check": { "url": "${SITE_URL}/starter-pack?src=muse", "line": "..." },
  "source": "digi",
  "presentation_note": "..." }`

const SCRIPTS_REQUEST = `GET ${SITE_URL}/api/muse/scripts?q=turning%20the%20tv%20off&child_age=6`

export default function MuseConnectorPage() {
  return (
    <div style={WRAP}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>Connector</p>
      <h1 style={H1}>Guided Childhood for Muse</h1>
      <p style={P}>
        Guided Childhood helps UK parents get their children ready for a phone and social media, ten minutes a day, with parent and child working on it together. This connector lets a parent ask DiGi, our guide, a question inside Meta’s Muse and get back a next step and the actual words to say.
      </p>

      <h2 style={H2}>What it will never do</h2>
      <ul>
        <li style={LI}><strong>Give a yes or no.</strong> Every answer is a pathway: where you are, the next step, the words. Never a verdict on whether a child may have something.</li>
        <li style={LI}><strong>Ask about the child.</strong> It needs no name, school or location and keeps nothing about a child at all.</li>
        <li style={LI}><strong>Answer a crisis with advice.</strong> Words about self harm or immediate danger get the helplines first (999, Samaritans 116 123, Childline 0800 1111), and nothing generated. Words about grooming or images get CEOP and the school’s safeguarding lead first.</li>
      </ul>

      <h2 style={H2}>Ask DiGi</h2>
      <p style={P}>
        Operation <code style={INLINE}>askDigi</code>. Send the parent’s question in their own words, up to {MAX_QUESTION} characters, and the child’s age in years if the parent gave it.
      </p>
      <pre style={CODE}>{ASK_REQUEST}</pre>
      <p style={P}>
        Every field comes back separately and once more as <code style={INLINE}>answer</code>, a single block ready to read out. If <code style={INLINE}>signpost</code> is set, show it before anything else. The <code style={INLINE}>presentation_note</code> asks for the answer to be shared as written, as a pathway rather than a verdict.
      </p>
      <pre style={CODE}>{ASK_RESPONSE}</pre>

      <h2 style={H2}>Find scripts</h2>
      <p style={P}>
        Operation <code style={INLINE}>findScripts</code>. Up to three word for word scripts from our free library that fit a topic, each with the line to say, the line not to say and a page the parent can share. No model is involved, so it is instant.
      </p>
      <pre style={CODE}>{SCRIPTS_REQUEST}</pre>

      <h2 style={H2}>Access</h2>
      <ul>
        <li style={LI}>Free, with no Guided Childhood account needed.</li>
        <li style={LI}>For parents and carers. Written for UK families, and useful anywhere.</li>
        <li style={LI}>A daily limit on fresh DiGi answers across everyone. Past it, Ask DiGi answers from our closest matching script instead, so a parent always gets the words.</li>
        <li style={LI}>The full specification is at <a href="/api/muse/openapi.json" style={{ ...LINK, ...INLINE }}>/api/muse/openapi.json</a>.</li>
      </ul>

      <h2 style={H2}>Privacy and support</h2>
      <p style={P}>
        What happens to a question is set out in our <Link href="/privacy" style={LINK}>privacy policy</Link>, under asking us through Muse. Questions about the connector go to <a href="mailto:hello@guidedchildhood.com" style={LINK}>hello@guidedchildhood.com</a>.
      </p>

      <p style={{ ...P, marginTop: '36px' }}>
        <Link href="/starter-pack?src=muse" style={LINK}>Take the free stage check →</Link>
      </p>
    </div>
  )
}
