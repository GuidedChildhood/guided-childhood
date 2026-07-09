'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// The school email switch on flow. Four screens:
// pitch  → the letterbox promise and the six reassurances
// form   → school or club name plus one sender address to start
// steps  → the private forwarding address. The default path is the easy
//          one: save the address and forward school emails by hand, which
//          needs no rules and no verification. The automatic rule (with
//          the Gmail verification code surfaced live via polling) sits
//          behind an optional toggle for parents who want set and forget.
// manage → the connection with active toggle, senders, and delete

type Connection = {
  school_name: string
  sender_addresses: string[]
  forward_address: string
  active: boolean
  verification_code: string | null
  verification_link: string | null
  verification_received_at: string | null
}

type Screen = 'loading' | 'pitch' | 'form' | 'steps' | 'manage'

const REASSURANCES: { title: string; body: string }[] = [
  { title: 'We never access your inbox.', body: 'No login, no password, no permissions. Forwarding happens inside your own email account, under your control.' },
  { title: 'You choose the senders.', body: 'Only the addresses you pick ever reach us.' },
  { title: 'We keep the actions, not the email.', body: 'DiGi reads it once, pulls out the dates, kit, payments and homework, and the original email is deleted straight away. It is never stored.' },
  { title: 'Everything stays in your account.', body: 'Nothing is shared, nothing is sold, delete it all any time.' },
  { title: 'Switching off is instant.', body: 'Delete the forwarding rule in your email and it is over. Your private address is useless to anyone else.' },
  { title: 'Your inbox does not change.', body: 'Forwarding sends us a copy. The school’s email still lands in your inbox exactly as it does today, nothing moved, nothing missed.' },
]

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: '16px', padding: '22px', marginBottom: '16px',
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: '12px',
  border: '1.5px solid var(--border)', background: 'var(--cream)',
  fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)',
  outline: 'none',
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
  borderRadius: '16px', padding: '14px 26px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
  boxShadow: '0 5px 0 var(--terracotta-dark)', textDecoration: 'none',
}

const quietBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)',
  padding: '6px 0',
}

function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch { /* clipboard unavailable */ }
      }}
      style={{
        background: copied ? 'var(--tint-green)' : 'var(--deep-teal)',
        color: copied ? 'var(--ink)' : '#fff',
        border: 'none', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
        fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, flexShrink: 0,
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}

function StepRow({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
        background: 'var(--stage-1-bold)', color: 'var(--stage-1-text)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, marginTop: '1px',
      }}>{n}</div>
      <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6, flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

export default function SchoolSetup() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [connection, setConnection] = useState<Connection | null>(null)
  const [schoolName, setSchoolName] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [newSender, setNewSender] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [provider, setProvider] = useState<'gmail' | 'other'>('gmail')
  const [showAuto, setShowAuto] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)
  // Whether the forwarding domain can actually receive mail yet (has an MX
  // record). Null while unknown, false warns the parent before they forward
  // into a silent bounce.
  const [inboundLive, setInboundLive] = useState<boolean | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const testLetterbox = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/school/test', { method: 'POST' })
      const data = await res.json()
      setTestResult({ ok: Boolean(data.ok), message: data.message ?? 'Something went wrong running the test.' })
    } catch {
      setTestResult({ ok: false, message: 'Could not reach the server to run the test.' })
    } finally {
      setTesting(false)
    }
  }

  const load = useCallback(async (): Promise<Connection | null> => {
    try {
      const res = await fetch('/api/school/connect')
      const data = await res.json()
      const conn: Connection | null = data.connection ?? null
      setConnection(conn)
      return conn
    } catch { return null }
  }, [])

  useEffect(() => {
    load().then(conn => setScreen(conn ? 'manage' : 'pitch'))
  }, [load])

  // Check once whether the forwarding domain is live, so the address screen
  // can warn instead of letting a forward bounce silently.
  useEffect(() => {
    fetch('/api/school/health').then(r => r.json()).then(d => setInboundLive(!!d.live)).catch(() => {})
  }, [])

  // While the parent is on the provider steps and no code has arrived yet,
  // poll every five seconds so the Gmail confirmation code appears live.
  useEffect(() => {
    if (screen === 'steps' && !connection?.verification_code && !connection?.verification_link) {
      pollRef.current = setInterval(load, 5000)
      return () => { if (pollRef.current) clearInterval(pollRef.current) }
    }
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [screen, connection?.verification_code, connection?.verification_link, load])

  const createConnection = async () => {
    setErrorMsg(null)
    const email = senderEmail.trim().toLowerCase()
    if (!schoolName.trim()) { setErrorMsg('Give the school or club a name so you recognise it later.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg('That sender address does not look like an email address yet.'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/school/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: schoolName.trim(), sender_addresses: [email] }),
      })
      if (!res.ok) throw new Error('save failed')
      await load()
      setScreen('steps')
    } catch {
      setErrorMsg('Something went wrong saving that. Try again in a moment.')
    } finally { setSaving(false) }
  }

  const addSender = async () => {
    if (!connection) return
    const email = newSender.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg('That does not look like an email address yet.'); return }
    if (connection.sender_addresses.includes(email)) { setNewSender(''); return }
    setErrorMsg(null)
    setSaving(true)
    try {
      await fetch('/api/school/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: connection.school_name, sender_addresses: [...connection.sender_addresses, email] }),
      })
      setNewSender('')
      await load()
    } catch { /* leave the field as typed */ } finally { setSaving(false) }
  }

  const removeSender = async (email: string) => {
    if (!connection) return
    setSaving(true)
    try {
      await fetch('/api/school/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_name: connection.school_name, sender_addresses: connection.sender_addresses.filter(s => s !== email) }),
      })
      await load()
    } catch { /* non blocking */ } finally { setSaving(false) }
  }

  const toggleActive = async () => {
    if (!connection) return
    const next = !connection.active
    setConnection({ ...connection, active: next })
    try {
      await fetch('/api/school/connect', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next }),
      })
    } catch { await load() }
  }

  const deleteConnection = async () => {
    setSaving(true)
    try {
      await fetch('/api/school/connect', { method: 'DELETE' })
      setConnection(null)
      setConfirmDelete(false)
      setSchoolName('')
      setSenderEmail('')
      setScreen('pitch')
    } catch { /* stay put */ } finally { setSaving(false) }
  }

  if (screen === 'loading') {
    return <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>One moment...</p>
  }

  /* ── Screen 1: the letterbox pitch ─────────────────────────────── */
  if (screen === 'pitch') {
    return (
      <div>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>School emails</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '14px' }}>
          Never miss a PE kit day again
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '18px' }}>
          Forward your school&apos;s emails to your own private Guided Childhood address and DiGi pulls out the things you actually need: kit days, trips, payments, homework and deadlines. They land on your dashboard as reminders, and your phone buzzes when something new arrives.
        </p>

        <div style={{
          background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
          borderRadius: '16px', padding: '18px 20px', marginBottom: '20px',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            You are giving us a letterbox, not a key. We never see your inbox. You choose exactly which senders get forwarded, and we keep the actions, never the email.
          </p>
        </div>

        <div style={{ ...card, padding: '20px 22px' }}>
          <div style={eyebrow}>How we keep it private</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {REASSURANCES.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                  background: 'var(--tint-green)', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                }}>✓</span>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  <strong style={{ color: 'var(--ink)' }}>{r.title}</strong> {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setScreen('form')} style={{ ...primaryBtn, width: '100%' }}>
          Get my private address
        </button>
      </div>
    )
  }

  /* ── Screen 2: add the source ──────────────────────────────────── */
  if (screen === 'form') {
    return (
      <div>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Step 1 of 2</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '12px' }}>
          Who emails you?
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '20px' }}>
          Start with one sender, usually the school office. You can add clubs and more addresses any time.
        </p>

        <div style={card}>
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            School or club name
          </label>
          <input
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
            placeholder="Burrington Primary"
            style={{ ...inputStyle, marginBottom: '18px' }}
            maxLength={120}
          />
          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            The address their emails come from
          </label>
          <input
            value={senderEmail}
            onChange={e => setSenderEmail(e.target.value)}
            placeholder="office@yourschool.co.uk"
            type="email"
            style={inputStyle}
            maxLength={200}
          />
          <p style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '10px', marginBottom: 0 }}>
            Open a recent school email and copy the address it came from. Only emails from senders you list ever reach us.
          </p>
        </div>

        {errorMsg && (
          <p style={{ fontSize: '13px', color: 'var(--danger)', marginBottom: '14px' }}>{errorMsg}</p>
        )}

        <button onClick={createConnection} disabled={saving} style={{ ...primaryBtn, width: '100%', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Creating your address...' : 'Create my private address'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button onClick={() => setScreen('pitch')} style={quietBtn}>Back</button>
        </div>
      </div>
    )
  }

  /* ── Screen 3: the address and the provider steps ──────────────── */
  if (screen === 'steps' && connection) {
    const filterText = `from:(${connection.sender_addresses.join(' OR ')})`
    const hasVerification = Boolean(connection.verification_code || connection.verification_link)

    return (
      <div>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Step 2 of 2</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '12px' }}>
          Your private forwarding address
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '18px' }}>
          This address belongs to your family alone. Anything you forward to it gets read once for the actions, then deleted.
        </p>

        {/* Not receiving yet: if the domain has no MX record, a forward will
            bounce. Warn plainly rather than let the parent hit a silent bounce. */}
        {inboundLive === false && (
          <div style={{
            background: '#FBEAEA', border: '1.5px solid var(--danger, #c0392b)', borderRadius: '14px',
            padding: '14px 16px', marginBottom: '18px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--danger, #c0392b)', marginBottom: '6px' }}>
              Not ready to receive yet
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
              This address is not live on our mail servers yet, so a forward may bounce back for now. We are finishing the setup. Save the address, and try forwarding again a little later or tap Test the letterbox below.
            </p>
          </div>
        )}

        <div style={{
          background: 'var(--deep-teal)', borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'clamp(13px, 3.4vw, 16px)', fontWeight: 700,
            color: '#fff', wordBreak: 'break-all', flex: 1, minWidth: '200px', lineHeight: 1.5,
          }}>
            {connection.forward_address}
          </div>
          <CopyButton value={connection.forward_address} label="Copy address" />
        </div>

        {/* Test the letterbox: proves the platform side is live before the
            parent goes fishing for a code that might never arrive. */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', marginBottom: '2px' }}>
              Is the letterbox working?
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Run a quick check that your address is live and reading emails.
            </div>
          </div>
          <button
            onClick={testLetterbox}
            disabled={testing}
            style={{
              background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: '12px',
              padding: '11px 18px', cursor: testing ? 'wait' : 'pointer', flexShrink: 0,
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
            }}
          >
            {testing ? 'Testing...' : 'Test the letterbox'}
          </button>
          {testResult && (
            <div style={{
              width: '100%',
              background: testResult.ok ? 'var(--tint-green)' : 'var(--stage-1)',
              border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 14px',
              fontSize: '13px', color: 'var(--ink)', lineHeight: 1.55,
            }}>
              <strong>{testResult.ok ? '✓ Platform ready. ' : 'Heads up. '}</strong>
              {testResult.message}
            </div>
          )}
        </div>

        {/* The easy way: no rules, no codes, works straight away */}
        <div style={card}>
          <div style={eyebrow}>The easy way, start here</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            <StepRow n={1}>Copy your private address above and save it in your phone&apos;s contacts as <strong>DiGi School</strong>.</StepRow>
            <StepRow n={2}>When a school email lands, tap <strong>Forward</strong> and send it to DiGi, exactly like forwarding it to a friend.</StepRow>
            <StepRow n={3}>That is the whole setup. The actions appear under <strong>Things you need to know</strong> and your phone buzzes.</StepRow>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: '14px', marginBottom: 0 }}>
            Try it now: forward the last email {connection.school_name} sent you and watch your dashboard.
          </p>
        </div>

        {/* The automatic rule, for parents who want set and forget */}
        {!showAuto ? (
          <button
            onClick={() => setShowAuto(true)}
            style={{ ...card, width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
          >
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', marginBottom: '4px' }}>
                Want it fully automatic?
              </span>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                A one time rule in your email forwards the school for you, so you never even press Forward. Takes about three minutes, and you can come back for this any time.
              </span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--terracotta-dark)', flexShrink: 0 }}>→</span>
          </button>
        ) : (
          <>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {([['gmail', 'Gmail'], ['other', 'Outlook and others']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setProvider(key)}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '100px', cursor: 'pointer',
                border: '1.5px solid var(--border)',
                background: provider === key ? 'var(--deep-teal)' : '#fff',
                color: provider === key ? '#fff' : 'var(--ink-soft)',
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {provider === 'gmail' ? (
          <div style={card}>
            <div style={eyebrow}>Gmail, step by step</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              <StepRow n={1}>Open Gmail on a computer, click the gear at the top right, then <strong>See all settings</strong>.</StepRow>
              <StepRow n={2}>Open the <strong>Forwarding and POP/IMAP</strong> tab and click <strong>Add a forwarding address</strong>. Paste your private address from above.</StepRow>
              <StepRow n={3}>
                Google sends a confirmation code, or sometimes a one tap confirm link, to that address. Whichever it is appears right here, so stay on this page:
                <div style={{
                  marginTop: '10px', padding: '14px 16px', borderRadius: '12px',
                  background: hasVerification ? 'var(--tint-green)' : 'var(--cream)',
                  border: `1.5px solid ${hasVerification ? 'var(--tint-green)' : 'var(--border)'}`,
                }}>
                  {connection.verification_code ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>Your confirmation code</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em' }}>{connection.verification_code}</div>
                      </div>
                      <CopyButton value={connection.verification_code} label="Copy code" />
                    </div>
                  ) : connection.verification_link ? (
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>Confirmation received</div>
                      <a href={connection.verification_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                        Confirm the forwarding with one tap →
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--terracotta)', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Waiting for Google. Your code or confirm link usually arrives within a minute of clicking Add in Gmail.</span>
                    </div>
                  )}
                  {connection.verification_code && connection.verification_link && (
                    <div style={{ marginTop: '10px' }}>
                      <a href={connection.verification_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                        Or confirm with one tap instead →
                      </a>
                    </div>
                  )}
                </div>
              </StepRow>
              <StepRow n={4}>If you got a code, type it back into Gmail and click <strong>Verify</strong>. If we showed a <strong>Confirm</strong> link above instead, tap that, it does the same job.</StepRow>
              <StepRow n={5}>Still on the Forwarding tab, keep <strong>Disable forwarding</strong> selected. The filter you make next forwards only the school, not your whole inbox.</StepRow>
              <StepRow n={6}>
                Paste this into the search box at the top of Gmail, press Enter, then click <strong>Create filter</strong> just under the search box:
                <div style={{
                  marginTop: '10px', padding: '12px 14px', borderRadius: '12px',
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--ink)', wordBreak: 'break-all', flex: 1, minWidth: '160px' }}>
                    {filterText}
                  </code>
                  <CopyButton value={filterText} label="Copy filter" />
                </div>
              </StepRow>
              <StepRow n={7}>Tick <strong>Forward it to</strong> and choose your private address. Leave <strong>Skip the Inbox</strong> unticked, so school emails still land in your inbox exactly as they do today.</StepRow>
              <StepRow n={8}>Click <strong>Create filter</strong>. That is it.</StepRow>
            </div>
          </div>
        ) : (
          <div style={card}>
            <div style={eyebrow}>Outlook and other providers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              <StepRow n={1}>Open your email settings and find <strong>Rules</strong>. In Outlook that is Settings, then Mail, then Rules.</StepRow>
              <StepRow n={2}>
                Add a new rule: when a message arrives from <strong>{connection.sender_addresses.join(' or ')}</strong>, forward a copy to your private address (copy it above).
              </StepRow>
              <StepRow n={3}>Choose <strong>forward a copy</strong> rather than move or redirect, so everything still lands in your inbox as normal.</StepRow>
              <StepRow n={4}>Save the rule. If your provider sends a confirmation email to the new address, the code or link will appear on this page within a minute.</StepRow>
            </div>
            {hasVerification && (
              <div style={{ marginTop: '14px', padding: '14px 16px', borderRadius: '12px', background: 'var(--tint-green)' }}>
                {connection.verification_code && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: connection.verification_link ? '8px' : 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{connection.verification_code}</span>
                    <CopyButton value={connection.verification_code} label="Copy code" />
                  </div>
                )}
                {connection.verification_link && (
                  <a href={connection.verification_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--terracotta-dark)', fontWeight: 700 }}>
                    Confirm the forwarding with one tap →
                  </a>
                )}
              </div>
            )}
          </div>
        )}
          </>
        )}

        <div style={{ ...card, background: 'var(--stage-2)', border: '1.5px solid var(--stage-2)' }}>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            The next time {connection.school_name} emails you, the actions appear on your dashboard under <strong>Things you need to know</strong> and your phone buzzes if notifications are on.
          </p>
        </div>

        <button onClick={() => setScreen('manage')} style={{ ...primaryBtn, width: '100%' }}>
          Done, show my connection
        </button>
      </div>
    )
  }

  /* ── Screen 4: the connection list ─────────────────────────────── */
  if (screen === 'manage' && connection) {
    return (
      <div>
        <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>School emails</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 1.9rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px' }}>
          Your school connection
        </h1>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '4px' }}>
                {connection.school_name}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: connection.active ? 'var(--tint-green)' : 'var(--border)',
                color: connection.active ? 'var(--ink)' : 'var(--ink-muted)',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                {connection.active ? 'Active' : 'Paused'}
              </span>
            </div>
            {/* Active toggle */}
            <button
              onClick={toggleActive}
              aria-label={connection.active ? 'Pause this connection' : 'Resume this connection'}
              style={{
                width: '48px', height: '28px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                background: connection.active ? 'var(--terracotta)' : 'var(--border)',
                position: 'relative', transition: 'background .15s ease', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: '3px', left: connection.active ? '23px' : '3px',
                width: '22px', height: '22px', borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(26,26,46,.25)', transition: 'left .15s ease',
              }} />
            </button>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
            Your private address
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
            padding: '12px 14px', borderRadius: '12px', background: 'var(--cream)',
            border: '1.5px solid var(--border)', marginBottom: '16px',
          }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink)', wordBreak: 'break-all', flex: 1, minWidth: '160px' }}>
              {connection.forward_address}
            </code>
            <CopyButton value={connection.forward_address} />
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
            Senders you allow
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {connection.sender_addresses.map(s => (
              <div key={s} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                padding: '9px 12px', borderRadius: '10px', background: 'var(--cream)', border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '13px', color: 'var(--ink)', wordBreak: 'break-all' }}>{s}</span>
                {connection.sender_addresses.length > 1 && (
                  <button onClick={() => removeSender(s)} disabled={saving} style={{ ...quietBtn, padding: 0 }}>Remove</button>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <input
              value={newSender}
              onChange={e => setNewSender(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addSender() }}
              placeholder="Add another sender, like the PTA or a club"
              type="email"
              style={{ ...inputStyle, padding: '10px 14px', fontSize: '13px', flex: 1 }}
              maxLength={200}
            />
            <button
              onClick={addSender}
              disabled={saving}
              style={{
                background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: '12px',
                padding: '10px 18px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                fontSize: '12px', fontWeight: 700, flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>
          {errorMsg && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '8px', marginBottom: 0 }}>{errorMsg}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setScreen('steps')} style={{ ...quietBtn, color: 'var(--terracotta-dark)', fontWeight: 700 }}>
            View the setup steps again →
          </button>
          {confirmDelete ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>Sure? This forgets the address and all reminders stop.</span>
              <button onClick={deleteConnection} disabled={saving} style={{ ...quietBtn, color: 'var(--danger)', fontWeight: 700 }}>Yes, delete</button>
              <button onClick={() => setConfirmDelete(false)} style={quietBtn}>Keep it</button>
            </span>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ ...quietBtn, color: 'var(--danger)' }}>
              Delete this connection
            </button>
          )}
        </div>
      </div>
    )
  }

  // A deleted or missing connection while on a connection screen: back to the pitch.
  return (
    <div>
      <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '14px' }}>No connection yet.</p>
      <button onClick={() => setScreen('pitch')} style={primaryBtn}>Start again</button>
    </div>
  )
}
