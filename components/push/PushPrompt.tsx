'use client'
import { useState, useEffect } from 'react'
import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

interface Props {
  userId: string
  stage?: string
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, c => c.charCodeAt(0))
}

// Byte compare two keys, to tell an existing push subscription's key from the
// current one after a VAPID rotation.
function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}


// What this device can actually show, as opposed to what it will accept.
//
// A push can be accepted by the push service, delivered, and then displayed by
// nobody, and the laptop is where that happens. Two causes, and neither raises
// an error anywhere we can see:
//
//   Safari shows web push only for a site added to the Dock. In an ordinary
//   tab a parent can grant permission, subscribe, send a test and get a
//   cheerful "sent", with nothing ever appearing. Apple has worked this way
//   since Safari 16.4.
//
//   Every desktop browser sits behind the operating system's own notification
//   switch and its Do Not Disturb, either of which swallows the banner in
//   silence.
//
// Phones do not have this problem, which is the reassuring half of the message
// and worth saying out loud: a parent who cannot make the laptop work should
// know their phone is fine rather than assume the feature is broken.
type PushSurface = 'phone' | 'desktop-installed' | 'desktop-safari-tab' | 'desktop-tab'

function pushSurface(): PushSurface {
  if (typeof window === 'undefined') return 'phone'
  const ua = navigator.userAgent
  const phone = /Android|iPhone|iPad|iPod/i.test(ua)
  if (phone) return 'phone'
  const installed = window.matchMedia?.('(display-mode: standalone)')?.matches
    || (window.navigator as { standalone?: boolean }).standalone === true
  if (installed) return 'desktop-installed'
  // Chrome and Edge both carry Safari in their UA, so they have to be ruled
  // out before the Safari test means anything.
  const safari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR/i.test(ua)
  return safari ? 'desktop-safari-tab' : 'desktop-tab'
}

// Dismissed by hand. The big card is an important step, not a permanent
// fixture, and a parent who has read it and decided not now should not be told
// again every single visit on every single page it renders on.
const HIDDEN_KEY = 'gc_push_prompt_hidden'
// Dismissing this used to be permanent, which quietly broke the whole approve
// loop. Justin: "why am I not getting pwa from Yusuf's jobs on parent's
// platform, and if not set up this will stay broken, so how can in app check
// auto prompt parent?"
//
// Exactly right. Push to the parent IS wired: a child ticking a job posts to
// /api/push/send. But with no subscription that call is a silent no-op, and the
// only thing that would have told the parent was this card, which they had
// already tapped away once, for ever. So a single dismissal on day one meant
// never being told a child had done anything, and no way of finding out why.
//
// A fortnight instead of for ever. Long enough that it is not a nag, short
// enough that a family cannot spend a term wondering why the app is silent.
// Anyone who genuinely does not want notifications simply taps it away again
// twice a month, which is a fair price for not silently breaking the loop.
const HIDDEN_DAYS = 14

export default function PushPrompt({ userId, stage }: Props) {
  const [status, setStatus] = useState<'idle' | 'asking' | 'granted' | 'denied' | 'unsupported'>('idle')
  const [testResult, setTestResult] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  const [enableError, setEnableError] = useState<string | null>(null)
  // How many devices this ACCOUNT has, which is the question the card was
  // never asking. null means we have not heard back yet, or could not tell.
  const [accountDevices, setAccountDevices] = useState<number | null>(null)
  // Is THIS browser subscribed? The account count cannot answer it, and it is
  // the only thing that decides whether this device ever hears a ping.
  const [thisDevice, setThisDevice] = useState<boolean | null>(null)
  // This browser's own endpoint, so a test can be aimed at this device rather
  // than at every device on the account.
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  // Read once on the client. Doing it in render would differ between the
  // server pass and the browser and hydrate wrong.
  const [surface, setSurface] = useState<PushSurface>('phone')
  useEffect(() => { setSurface(pushSurface()) }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HIDDEN_KEY)
      // '1' is the old permanent flag. Treat it as a dismissal that has now
      // expired, so existing families get asked once more rather than staying
      // silently broken because of a tap they made weeks ago.
      const until = raw && raw !== '1' ? Number(raw) : 0
      setHidden(Number.isFinite(until) && until > Date.now())
    } catch { /* private mode, show it */ }

    let live = true
    ;(async () => {
      // Find this browser's subscription first, so the status question can be
      // asked about this device and not just about the account.
      let ep: string | null = null
      try {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const reg = await navigator.serviceWorker.getRegistration()
          const sub = await reg?.pushManager.getSubscription()
          ep = sub?.endpoint ?? null
        }
      } catch { /* no worker yet, which reads as not subscribed here */ }
      if (!live) return
      setEndpoint(ep)
      try {
        const res = await fetch(`/api/push/status${ep ? `?endpoint=${encodeURIComponent(ep)}` : ''}`)
        const d = res.ok ? await res.json() : null
        if (!live || !d) return
        if (typeof d.devices === 'number') setAccountDevices(d.devices)
        if (typeof d.thisDevice === 'boolean') setThisDevice(d.thisDevice)
      } catch { /* unknown, and unknown is not none */ }
    })()
    return () => { live = false }
  }, [])

  const dismiss = () => {
    setHidden(true)
    try { localStorage.setItem(HIDDEN_KEY, String(Date.now() + HIDDEN_DAYS * 86400000)) } catch { /* gone on the next load, fine */ }
  }

  // An explicit endpoint wins over state, because the reset flow subscribes and
  // tests in one go and the state from that render is still the old value.
  async function sendTest(target?: string) {
    const aimed = target ?? endpoint
    setTestResult('Sending...')
    try {
      // Aimed at THIS device when we know its endpoint, so the sentence below is
      // true. Without this the test fired at every device on the account and
      // then claimed the result for the one in your hand.
      const res = await fetch('/api/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aimed ? { endpoint: aimed } : {}),
      })
      const data = await res.json()
      if (data.sent > 0) setTestResult(
        // Accepted by the push service is not the same as shown to a person,
        // and on these two surfaces it usually is not. Saying "it should
        // appear within seconds" for something that cannot appear is the
        // false success this whole card exists to avoid.
        surface === 'desktop-safari-tab'
          ? 'Sent, but Safari only shows these once Guided Childhood is added to your Dock. Use File then Add to Dock, open it from there, and it will work. On your phone it already works with no extra step.'
          : surface === 'desktop-tab'
            ? 'Sent. If nothing appears, your computer is holding it back rather than us: check notifications are allowed for this browser in your system settings, and that Do Not Disturb is off. On your phone it works with no extra step.'
            : aimed
              ? 'Sent to this device. It should appear within seconds.'
              : 'Sent to every device you have turned this on for. It should appear within seconds.')
      else if (data.reason) setTestResult(data.scope === 'device'
        ? 'This device is not turned on yet, so nothing was sent to it. Tap Turn on check ins here.'
        : 'No subscription found for this account on any device yet. Tap Turn on check ins first, inside the installed app.')
      else if (data.errors?.length) setTestResult(`The push service refused (code ${data.errors[0]})${data.details?.[0] ? `: ${data.details[0]}` : ''}. Tell Claude this whole message.`)
      else setTestResult(data.error ?? 'Something went wrong, try again.')
    } catch {
      setTestResult('Could not reach the server, try again.')
    }
  }

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    const perm = Notification.permission
    if (perm === 'granted') setStatus('granted')
    else if (perm === 'denied') setStatus('denied')
  }, [])

  async function enable() {
    setStatus('asking')
    setEnableError(null)
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setStatus('unsupported')
        return
      }

      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        setStatus('denied')
        setEnableError('Notifications are blocked for this app. Open your phone settings for Guided Childhood and allow notifications, then try again.')
        return
      }

      // A stale or missing service worker registration is the most common
      // reason subscribe throws. ready can hang if the worker never
      // registered, so nudge a registration first.
      if (!(await navigator.serviceWorker.getRegistration())) {
        try { await navigator.serviceWorker.register('/sw.js') } catch { /* the ready below will surface it */ }
      }
      const reg = await navigator.serviceWorker.ready

      // Self heal a VAPID key rotation. If a subscription already exists but
      // was made with a different public key than the one baked in now, the
      // push service will later reject sends with a 403 invalid JWT, and the
      // browser refuses to re-subscribe with a new key over the old one. So
      // detect the mismatch, drop the stale subscription, and subscribe fresh
      // with the current key. Without this a parent is stuck until they find
      // the Reset link.
      const currentKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      let sub = await reg.pushManager.getSubscription()
      if (sub) {
        const existingKey = sub.options?.applicationServerKey
        const matches = !!existingKey && sameBytes(new Uint8Array(existingKey), currentKey)
        if (!matches) {
          try {
            await fetch('/api/push/subscribe', {
              method: 'DELETE',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ endpoint: sub.endpoint }),
            })
          } catch { /* best effort */ }
          await sub.unsubscribe()
          sub = null
        }
      }
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: currentKey,
        })
      }

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), userId, stage }),
      })
      if (!res.ok) {
        setStatus('idle')
        setEnableError('Turned on here, but saving it to your account failed. Try once more.')
        return
      }

      // This device is now genuinely subscribed, so record both facts. Without
      // this the screen would keep showing "on another device, not this one"
      // immediately after successfully turning it on here.
      setEndpoint(sub.endpoint)
      setThisDevice(true)
      setStatus('granted')
      return sub.endpoint
    } catch (err) {
      // Never die silently: show what actually went wrong so it is fixable
      // rather than a dead button.
      setStatus('idle')
      const msg = err instanceof Error ? err.message : String(err)
      setEnableError(`Could not turn on notifications: ${msg.slice(0, 160)}. On iPhone this needs the app added to your home screen first.`)
    }
  }

  // The browser can say permission is granted while the actual
  // registration underneath has gone stale (a reinstall, a cleared
  // cache, an old service worker). This says on but nothing ever
  // arrives is exactly that state, and there was no way to fix it
  // short of digging into phone settings. Reset clears the old
  // registration and creates a brand new one in two taps.
  async function resetAndRetest() {
    setResetting(true)
    setTestResult(null)
    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) {
        try {
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ endpoint: existing.endpoint }),
          })
        } catch { /* best effort */ }
        await existing.unsubscribe()
      }
      // Test the endpoint we just minted, not the one from the render that
      // scheduled this, which is the subscription we deleted a moment ago.
      const fresh = await enable()
      setTimeout(() => sendTest(fresh ?? undefined), 600)
    } catch {
      setStatus('denied')
    } finally {
      setResetting(false)
    }
  }

  // Never ask for this on a computer.
  //
  // Justin, on Chrome on a laptop: "can we make the pwa reminder not appear if
  // it is not fixable on laptop but other devices."
  //
  // The right rule is stronger than fixability. The alarm's whole purpose is
  // reaching a parent when they are NOT at the screen, and a banner on a laptop
  // that may well be shut does not do that. This is a phone feature, and asking
  // for it on a desktop is asking a parent to turn on something that will
  // barely work and then wondering why they distrust it when it does not.
  //
  // Anyone who has already turned it on here keeps the controls below, because
  // that is a setting they went looking for rather than a nag. An installed
  // desktop app also keeps them: adding it to the Dock or the taskbar is a
  // deliberate act and those notifications do behave.
  // Gated on whether this device actually holds a subscription, not on the
  // permission. The card Justin photographed fires in the state where Chrome
  // has said granted but nothing is registered here, so a check on status
  // alone would have sailed straight past the very card he was pointing at.
  const desktopTab = surface === 'desktop-tab' || surface === 'desktop-safari-tab'
  if (desktopTab && thisDevice !== true) return null

  // Granted AND actually subscribed on the server.
  //
  // The browser saying granted is not the same as us holding a subscription for
  // it: a reinstall, a cleared cache or an old service worker leaves permission
  // on with nothing registered, which is the "says on but nothing ever arrives"
  // state. Showing this branch then claims check ins are working on a device
  // that no send can reach. thisDevice === false is the only case we exclude,
  // because null means the lookup did not answer and a failed lookup must not
  // take a working setup away from a parent.
  if (status === 'granted' && thisDevice !== false) {
    return (
      <div style={{
        background: 'var(--stage-2)',
        borderRadius: '14px',
        padding: '14px 18px',
        fontSize: '.82rem',
        color: 'var(--ink-soft)',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1rem' }}>✓</span>
          <span style={{ flex: 1, minWidth: '180px' }}>Check ins are on. Pick the moments that suit your day.</span>
          <button
            onClick={() => sendTest()}
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px',
              padding: '7px 14px', cursor: 'pointer', flexShrink: 0,
              fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)',
            }}
          >
            Send a test
          </button>
        </div>
        <NudgeSlots />
        {/* Said before the test rather than after it fails, so a parent on a
            laptop knows what to expect and, more importantly, knows their
            phone is fine. Nothing shown on a phone: there is nothing to
            explain there and a warning would only invent a worry. */}
        {surface === 'desktop-safari-tab' && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            On your phone these work with no extra step. Safari on a Mac is the
            exception: it only shows them once Guided Childhood is added to your
            Dock, with File then Add to Dock. Open it from the Dock and test again.
          </p>
        )}
        {surface === 'desktop-tab' && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            On your phone these work with no extra step. On a computer they also
            need notifications allowed for this browser in your system settings,
            and Do Not Disturb switched off, or the message arrives and is never
            shown.
          </p>
        )}
        {testResult && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {testResult}
          </p>
        )}
        <button
          onClick={resetAndRetest}
          disabled={resetting}
          style={{
            background: 'none', border: 'none', cursor: resetting ? 'wait' : 'pointer', padding: 0, marginTop: '10px',
            fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700,
            color: 'var(--ink-muted)', textDecoration: 'underline',
          }}
        >
          {resetting ? 'Resetting...' : 'Test not arriving? Reset and try again'}
        </button>
      </div>
    )
  }

  // Dismissed by hand, so say nothing. The granted branch above still runs
  // first, because once check ins are actually on this device the slot picker
  // is a control a parent came looking for, not a nag.
  if (hidden) return null

  // On somewhere else, and NOT here. Never on a desktop tab: see the note
  // above, this is a phone feature and that card is the nag it produces.
  //
  // This branch used to end with "Nothing more to do." It was the whole reason
  // Justin's pings never arrived. Push is per device, so a parent subscribed on
  // their laptop gets nothing on their phone, and on the phone this card was
  // confidently telling them the setup was finished. The account count was
  // right; the conclusion drawn from it was false, and it closed down the one
  // question that would have found the problem.
  //
  // Now it says what is actually true of the device being held, and leads with
  // turning it on here rather than offering it as an afterthought. Note this
  // sits BELOW the granted branch, so a device that is properly on still gets
  // the slot picker and the test rather than this.
  if (accountDevices !== null && accountDevices > 0 && thisDevice !== true) {
    const blocked = status === 'denied' || status === 'unsupported'
    return (
      <div style={{
        background: 'var(--stage-4)', borderRadius: '14px', padding: '14px 16px',
        border: '1.5px solid var(--terracotta)',
        fontSize: '.82rem', color: 'var(--ink-soft)', fontWeight: 600,
      }}>
        <p style={{ margin: '0 0 10px', lineHeight: 1.55 }}>
          Check ins are on for {accountDevices === 1 ? 'another device' : `${accountDevices} of your devices`}, but not this one. Notifications only reach the devices you turn them on for, so this one will stay silent until you do.
        </p>
        {!blocked ? (
          <button
            onClick={enable}
            disabled={status === 'asking'}
            style={{
              background: 'var(--stage-4-bold)', color: 'var(--stage-4-text)', border: 'none',
              borderRadius: '10px', padding: '9px 16px', cursor: status === 'asking' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-display)', fontSize: '.78rem', fontWeight: 700,
              boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
            }}
          >
            {status === 'asking' ? 'Turning on...' : 'Turn them on here too'}
          </button>
        ) : (
          <p style={{ margin: 0, fontSize: '.76rem', lineHeight: 1.5 }}>
            {enableError ?? 'Notifications are blocked for this app on this device. Open your phone settings for Guided Childhood and allow notifications, then try again. On iPhone the app has to be added to your Home Screen first.'}
          </p>
        )}
        {enableError && !blocked && (
          <p style={{ margin: '10px 0 0', fontSize: '.76rem', fontWeight: 600, color: 'var(--terracotta-dark, #a44)', lineHeight: 1.5 }}>
            {enableError}
          </p>
        )}
      </div>
    )
  }

  // When blocked or unsupported, stay quiet unless we captured a reason
  // worth showing so the parent knows why the button did nothing.
  if ((status === 'denied' || status === 'unsupported') && !enableError) return null
  if (status === 'denied' || status === 'unsupported') {
    return (
      <div style={{
        background: 'var(--stage-4)', borderRadius: '16px', padding: '16px 20px',
        border: '1px solid var(--border)',
      }}>
        <p style={{ margin: 0, fontSize: '.8rem', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          {enableError}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--stage-4)',
      borderRadius: '16px',
      padding: '20px 22px',
      border: '2px solid var(--terracotta)',
      boxShadow: '0 6px 20px rgba(224,122,63,0.16)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
          Important step
        </div>
        {/* Not now. An important step a parent has read and decided against is
            not made more important by saying it again on every visit. */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Not now, hide this"
          title="Not now, hide this"
          style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: 9,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--ink-muted)', fontSize: 15, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 800,
        color: 'var(--ink)',
        marginBottom: '6px',
      }}>
        Turn on your daily check ins
      </p>
      <p style={{
        fontSize: '.8rem',
        color: 'var(--ink-soft)',
        lineHeight: 1.6,
        marginBottom: '10px',
      }}>
        Three gentle nudges a day: morning, after school, bedtime. The moments your child faces screens, so you are ready with the words. This is the thing that keeps the habit alive.
      </p>
      <p style={{
        fontSize: '.72rem',
        color: 'var(--ink-muted)',
        lineHeight: 1.5,
        marginBottom: '14px',
        fontFamily: 'var(--font-mono)',
      }}>
        On iPhone, add the app to your Home Screen first (tap Share, then Add to Home Screen), then open it from there and turn these on.
      </p>
      <button
        onClick={enable}
        disabled={status === 'asking'}
        style={{
          background: 'var(--stage-4-bold)',
          color: 'var(--stage-4-text)',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          cursor: status === 'asking' ? 'wait' : 'pointer',
          boxShadow: '0 3px 0 rgba(0,0,0,0.12)',
        }}
      >
        {status === 'asking' ? 'Turning on...' : 'Turn on check ins'}
      </button>
      {enableError && (
        <p style={{ margin: '12px 0 0', fontSize: '.76rem', fontWeight: 600, color: 'var(--terracotta-dark, #a44)', lineHeight: 1.5 }}>
          {enableError}
        </p>
      )}
    </div>
  )
}

// When do you want your daily nudge? Three moments, tap to toggle, saved to
// every device the parent has. The routine choice as personalisation: the same
// check ins, at the times that fit this family's actual day.
const SLOT_OPTIONS = [
  { key: 'morning', label: 'Morning 7:30am' },
  { key: 'afternoon', label: 'After school 3:30pm' },
  { key: 'evening', label: 'Evening 9pm' },
] as const

function NudgeSlots() {
  const [slots, setSlots] = useState<string[]>(['morning', 'afternoon', 'evening'])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/push/slots')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.slots?.length) setSlots(d.slots) })
      .catch(() => null)
      .finally(() => setLoaded(true))
  }, [])

  function toggle(key: string) {
    const next = slots.includes(key) ? slots.filter(s => s !== key) : [...slots, key]
    if (next.length === 0) return
    setSlots(next)
    fetch('/api/push/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots: next }),
    }).catch(() => null)
  }

  return (
    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '11px', opacity: loaded ? 1 : 0.6, transition: 'opacity 0.2s' }}>
      {SLOT_OPTIONS.map(o => {
        const on = slots.includes(o.key)
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => toggle(o.key)}
            aria-pressed={on}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700,
              letterSpacing: '0.04em', borderRadius: '100px', padding: '7px 13px',
              cursor: 'pointer', transition: 'all 0.12s',
              background: on ? 'var(--terracotta)' : '#fff',
              color: on ? 'var(--ink)' : 'var(--ink-muted)',
              border: on ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
            }}
          >
            {on ? '\u2713 ' : ''}{o.label}
          </button>
        )
      })}
    </div>
  )
}
