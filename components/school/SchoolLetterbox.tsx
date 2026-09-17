'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// THE LETTERBOX SETUP.
//
// Justin, 17 September 2026: "we need to make super easy for user to set up as
// this was the issue."
//
// WHAT WAS WRONG. The old way in was a card in Settings with two text boxes:
// the school's name, and a comma separated list of the school's sender
// addresses. It would not give you an address until you filled the first one
// in. So the opening screen of the feature asked a parent for a thing they do
// not know (what address does ParentPay send from?) in a format they should
// never have been shown (comma separated), in a place they were not looking
// (Settings), in order to earn a thing we could have given them for free (a
// random address). Meanwhile the card on Home that pitched the feature linked
// to /dashboard/school, which had no setup on it at all, only a dashed box
// saying it was coming soon.
//
// THE RULE THIS IS BUILT ON. Nothing is asked before something is given, and
// everything we used to ask for is learned instead.
//
// - The address is minted on the first tap. No name, no senders, no form.
// - It gets emailed to the parent, because the genuinely hard step is moving a
//   random address from this screen into the mail app, not understanding it.
// - The first thing we ask them to do is forward ONE email, which takes ten
//   seconds and proves it works. The automatic rule, which is fiddly and is
//   better on a laptop, is offered afterwards and never blocks anything.
// - The school's name and its sender addresses are read off that first email
//   and confirmed with one tap.
//
// THE REFERENCES (Mobbin, pulled 17 September 2026).
// - Wanderlog, "Forward your confirmation"
//   (https://mobbin.com/screens/e8d1fcf0-0758-4f18-8e7f-1d9c9fc0d588). The
//   address in a box with Copy inside it, and a check status button under it.
//   The tightest version of exactly our screen.
// - Matter, forwarding setup
//   (https://mobbin.com/screens/078e2685-41d0-4d09-b3ec-6001d25c3576). Says out
//   loud that rules take about five minutes and are easier on a desktop. Honest
//   about the cost instead of hiding it, which is why nobody bounces.
// - Fabric (https://mobbin.com/screens/16b0afa2-a1ab-464f-a802-8196588df7ed)
//   and Flighty (https://mobbin.com/screens/9146601f-15e2-474d-9a0d-ceb586b017ab).
//   The sender allowlist as an optional extra under the address, never the
//   price of entry, and the privacy line sitting with it.
// - Monarch, connecting an account
//   (https://mobbin.com/flows/8bb01eee-2e54-4a44-b51f-c9b83f825861). The synced
//   confirmation, and the status rows (last update, healthy) that make a live
//   connection legible afterwards.
//
// Ours in our own clothes: butter and ink, Nunito, the ink ledge on the
// buttons, mono for the address and the labels. Never a copy of theirs.

type Connection = {
  school_name: string | null
  sender_addresses: string[] | null
  forward_token: string
  forward_address: string
  active: boolean
  verification_code: string | null
  verification_link: string | null
  first_email_at: string | null
  last_email_at: string | null
  emails_caught: number
  learned_domain: string | null
}

const GMAIL_FORWARDING_SETTINGS = 'https://mail.google.com/mail/u/0/#settings/fwdandpop'

/** "2 minutes ago", "yesterday". Short, because it sits on one status line. */
function ago(iso: string | null): string {
  if (!iso) return ''
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

const cardStyle: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
  borderRadius: 'var(--radius-card)', padding: '22px',
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
  margin: '0 0 8px',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
  color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 8px',
}

const bodyStyle: React.CSSProperties = {
  fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px',
}

const primaryButton: React.CSSProperties = {
  background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: 'var(--lift)',
  borderRadius: 'var(--radius-btn)', padding: '12px 22px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 900,
  color: 'var(--ink)',
}

const quietButton: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-pill)',
  padding: '10px 18px', cursor: 'pointer', fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink-soft)',
}

export default function SchoolLetterbox() {
  const [conn, setConn] = useState<Connection | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filterCopied, setFilterCopied] = useState(false)
  const [emailedTo, setEmailedTo] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showRule, setShowRule] = useState(false)
  // The first email landing while the parent is on this screen is the moment
  // worth marking. Held separately from the connection so the celebration only
  // fires for an arrival we actually watched, not on every later page load.
  const [justArrived, setJustArrived] = useState(false)
  const hadEmailRef = useRef<boolean | null>(null)

  const load = useCallback(async (): Promise<Connection | null> => {
    try {
      const res = await fetch('/api/school/connect')
      if (!res.ok) return null
      const data = await res.json()
      const next = (data.connection ?? null) as Connection | null
      setConn(next)
      return next
    } catch {
      return null
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  // WATCHING FOR THE FIRST EMAIL.
  //
  // A parent who has just forwarded something is staring at this screen. Making
  // them pull to refresh to find out whether it worked is the difference
  // between a feature that feels alive and one they assume is broken.
  //
  // Only while nothing has ever arrived, because after that there is nothing to
  // wait for and a permanent five second poll on a dashboard is rude. It also
  // stops on its own after ten minutes: a tab left open all afternoon should not
  // keep asking, and by then the answer is not going to change while they watch.
  useEffect(() => {
    if (!loaded || !conn || conn.first_email_at) return
    const startedAt = Date.now()
    const timer = setInterval(async () => {
      if (Date.now() - startedAt > 10 * 60 * 1000) { clearInterval(timer); return }
      const next = await load()
      if (next?.first_email_at) {
        clearInterval(timer)
        if (hadEmailRef.current === false) setJustArrived(true)
      }
    }, 5000)
    hadEmailRef.current = false
    return () => clearInterval(timer)
  }, [loaded, conn, load])

  async function createAddress() {
    setBusy(true)
    try {
      // No body at all: this is the whole point, an address costs nothing and
      // asks nothing.
      await fetch('/api/school/connect', { method: 'POST' })
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function copyAddress() {
    if (!conn) return
    try {
      await navigator.clipboard.writeText(conn.forward_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch { /* no clipboard: the address is on screen and selectable anyway */ }
  }

  async function copyFilter() {
    if (!conn?.learned_domain) return
    try {
      await navigator.clipboard.writeText(`from:(${conn.learned_domain})`)
      setFilterCopied(true)
      setTimeout(() => setFilterCopied(false), 2400)
    } catch { /* no clipboard: it is on screen and selectable */ }
  }

  async function emailMe() {
    setBusy(true)
    setEmailError(null)
    try {
      const res = await fetch('/api/school/connect/email-me', { method: 'POST' })
      const data = await res.json()
      if (data.ok) setEmailedTo(data.sentTo ?? 'your inbox')
      else setEmailError(data.message ?? 'That did not send. Copy the address instead.')
    } catch {
      setEmailError('That did not send. Copy the address instead.')
    } finally {
      setBusy(false)
    }
  }

  /** The one tap that replaces both text boxes the old setup led with. */
  async function confirmSchool() {
    if (!conn?.learned_domain) return
    setBusy(true)
    try {
      await fetch('/api/school/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_name: conn.learned_domain,
          sender_addresses: [conn.learned_domain],
        }),
      })
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function setActive(active: boolean) {
    setBusy(true)
    try {
      await fetch('/api/school/connect', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function disconnect() {
    if (!confirm('Remove your letterbox address? Anything forwarded to it after this stops arriving. The reminders you already have stay.')) return
    setBusy(true)
    try {
      await fetch('/api/school/connect', { method: 'DELETE' })
      setConn(null)
      setEmailedTo(null)
      hadEmailRef.current = null
    } finally {
      setBusy(false)
    }
  }

  // Nothing at all until we know which state we are in. A flash of the offer
  // for a parent who set this up weeks ago reads as having lost their setup.
  if (!loaded) return null

  // ── STATE A: no address yet. One button, nothing to fill in. ───────────────
  if (!conn) {
    return (
      <div style={cardStyle}>
        <p style={eyebrowStyle}>School emails</p>
        <h2 style={headingStyle}>Let DiGi catch the school emails</h2>
        <p style={bodyStyle}>
          You get a private address of your own. Forward the school&apos;s emails to it and the kit days, trips, payments and deadlines turn into reminders here, and on your phone the night before.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
          {[
            'A letterbox, not a key. We never see your inbox.',
            'We keep the reminders, never the emails themselves.',
            'Nothing to fill in. Your address is ready in one tap.',
          ].map(line => (
            <li key={line} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontWeight: 900 }}>✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <button onClick={createAddress} disabled={busy} style={{ ...primaryButton, cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? 'One moment...' : 'Get my address'}
        </button>
      </div>
    )
  }

  const caught = Boolean(conn.first_email_at)
  const needsSchoolConfirm = caught && !conn.school_name && Boolean(conn.learned_domain)

  return (
    <div style={cardStyle}>
      <p style={eyebrowStyle}>School emails</p>

      {/* ── THE ARRIVAL, WHEN IT HAPPENS WHILE THEY WATCH ────────────────── */}
      {justArrived && (
        <div style={{
          background: 'var(--tint-sage)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
          padding: '14px 16px', marginBottom: '16px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '2px' }}>
            Caught it. Your letterbox works.
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Anything DiGi found is in your reminders above.
          </p>
        </div>
      )}

      <h2 style={headingStyle}>
        {caught ? 'Your letterbox is working' : 'Your letterbox is ready'}
      </h2>

      {/* ── THE ADDRESS. Copy sits inside the box, Wanderlog style. ───────── */}
      <div style={{
        background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
        padding: '14px', marginBottom: '12px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
          color: 'var(--ink)', wordBreak: 'break-all', marginBottom: '12px', userSelect: 'all',
        }}>
          {conn.forward_address}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={copyAddress} style={{ ...primaryButton, padding: '9px 18px' }}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={emailMe} disabled={busy} style={{ ...quietButton, cursor: busy ? 'wait' : 'pointer' }}>
            Email it to me
          </button>
        </div>
        {emailedTo && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>
            Sent to {emailedTo}. Forward any school email to it straight from there.
          </p>
        )}
        {emailError && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 0 0' }}>
            {emailError}
          </p>
        )}
      </div>

      {/* ── THE TEN SECOND TEST, while nothing has arrived yet. ───────────── */}
      {!caught && (
        <>
          <p style={bodyStyle}>
            <strong style={{ color: 'var(--ink)' }}>Try it now:</strong> find any email from school, hit forward, and send it to that address. That is the whole test.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--cream)', borderRadius: 'var(--radius-tile)',
            padding: '12px 14px', marginBottom: '14px',
          }}>
            <span aria-hidden style={{
              width: '9px', height: '9px', borderRadius: '50%',
              background: 'var(--terracotta-dark)', flexShrink: 0,
            }} />
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              Watching for your first email. This updates on its own.
            </span>
          </div>
        </>
      )}

      {/* ── WHOSE SCHOOL IT IS: one tap, where two text boxes used to be. ─── */}
      {needsSchoolConfirm && (
        <div style={{
          background: 'var(--terracotta-lt)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
          padding: '14px 16px', marginBottom: '14px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '6px' }}>
            That came from {conn.learned_domain}
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
            Is that your school? Say yes and DiGi will only accept mail from them, so a forwarded advert never becomes a reminder.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={confirmSchool} disabled={busy} style={{ ...primaryButton, padding: '9px 18px', cursor: busy ? 'wait' : 'pointer' }}>
              Yes, that is the school
            </button>
            <button onClick={() => setConn({ ...conn, learned_domain: null })} style={quietButton}>
              Not that one
            </button>
          </div>
        </div>
      )}

      {/* ── THE STATUS LINE, once it is live. Monarch's healthy rows. ─────── */}
      {caught && (
        <div style={{ marginBottom: '14px' }}>
          {conn.school_name && (
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              Accepting mail from <strong style={{ color: 'var(--ink)' }}>{conn.school_name}</strong>
            </div>
          )}
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            Last email {ago(conn.last_email_at)} · {conn.emails_caught} caught so far
          </div>
          {!conn.active && (
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 800, lineHeight: 1.7 }}>
              Paused. Nothing forwarded here is being read.
            </div>
          )}
        </div>
      )}

      {/* ── THE GMAIL CODE, caught by the webhook, shown without leaving. ─── */}
      {(conn.verification_code || conn.verification_link) && (
        <div style={{
          background: 'var(--tint-sage)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)',
          padding: '14px 16px', marginBottom: '14px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', marginBottom: '6px' }}>
            Gmail sent a confirmation code
          </div>
          {conn.verification_code && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em', marginBottom: '8px' }}>
              {conn.verification_code}
            </div>
          )}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Paste that back into the Gmail forwarding screen.
            {conn.verification_link && (
              <> Or <a href={conn.verification_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>confirm it in one tap</a>.</>
            )}
          </p>
        </div>
      )}

      {/* ── THE AUTOMATIC RULE. Offered, never in the way. Matter's honesty
             about what it costs, so nobody starts it on a phone at the school
             gate and gives up halfway through. ──────────────────────────── */}
      <button
        onClick={() => setShowRule(v => !v)}
        style={{
          background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          color: 'var(--terracotta-dark)', marginBottom: showRule ? '12px' : 0,
        }}
      >
        {showRule ? 'Hide the automatic setup' : 'Make it automatic, so you never forward again'}
      </button>

      {showRule && (
        <div style={{ borderTop: '1px solid var(--ink-light)', paddingTop: '14px' }}>
          <p style={bodyStyle}>
            One rule in your email and school messages come here on their own. It takes about five minutes and is much easier on a laptop than a phone.
          </p>
          {/* listStyle is set explicitly because Tailwind's preflight strips
              markers from every ol and ul. Unnumbered, these four read as four
              unrelated paragraphs, and the whole value of this block is that
              they happen in order. */}
          <ol style={{
            margin: '0 0 14px', paddingLeft: '22px', listStyle: 'decimal',
            fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.7,
          }}>
            <li style={{ marginBottom: '8px' }}>
              In Gmail, open{' '}
              <a href={GMAIL_FORWARDING_SETTINGS} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>
                Forwarding and POP/IMAP
              </a>
              , then Add a forwarding address, and paste your address in.
            </li>
            <li style={{ marginBottom: '8px' }}>Gmail emails a confirmation code to it. We catch that code and show it on this screen, so you do not have to go looking for it.</li>
            <li style={{ marginBottom: '8px' }}>
              Then make a filter and choose Forward it to your address.
              {conn.learned_domain
                ? <> Put this in the From box:</>
                : <> Put your school&apos;s address in the From box.</>}
              {/* Its own line, with its own copy button, because this is a
                  string that has to be typed into Gmail exactly and it was
                  wrapping mid expression inside the sentence. */}
              {conn.learned_domain && (
                <span style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', margin: '8px 0 0' }}>
                  <code style={{
                    fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)',
                    background: 'var(--cream)', border: '1px solid var(--ink-light)',
                    borderRadius: '8px', padding: '5px 9px', wordBreak: 'break-all',
                  }}>
                    from:({conn.learned_domain})
                  </code>
                  <button onClick={copyFilter} style={{ ...quietButton, padding: '5px 14px' }}>
                    {filterCopied ? 'Copied' : 'Copy'}
                  </button>
                </span>
              )}
            </li>
            <li><strong style={{ color: 'var(--ink)' }}>Leave Skip the Inbox unticked</strong>, so the school&apos;s emails still arrive with you as normal.</li>
          </ol>
          <p style={{ ...bodyStyle, marginBottom: 0 }}>
            Outlook and the rest do the same thing under Rules: forward messages from your school to your address.
          </p>
        </div>
      )}

      {/* ── MANAGE. Quiet, at the bottom, where it belongs. ───────────────── */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--ink-light)' }}>
        {/* Pause only once there is something to pause. Offering it to a
            parent who has not yet forwarded anything is an option that cannot
            mean anything to them yet, on the one screen where every extra word
            is a reason to give up. Resume always shows, or a paused connection
            would have no way back. */}
        {(caught || !conn.active) && (
          <button
            onClick={() => setActive(!conn.active)}
            disabled={busy}
            style={{ background: 'none', border: 'none', padding: 0, cursor: busy ? 'wait' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}
          >
            {conn.active ? 'Pause' : 'Resume'}
          </button>
        )}
        <button
          onClick={disconnect}
          disabled={busy}
          style={{ background: 'none', border: 'none', padding: 0, cursor: busy ? 'wait' : 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink-muted)' }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
