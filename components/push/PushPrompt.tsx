'use client'
import { useState, useEffect } from 'react'
import { enablePush, pushSupport } from '@/lib/push/enable'
import { getDeviceId } from '@/lib/push/device-id'

interface Props {
  userId: string
  stage?: string
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
          ? 'Sent, but Safari only shows these once Guided Childhood is added to your Dock.'
          : surface === 'desktop-tab'
            ? 'Sent. If nothing appears, your computer is holding it back rather than us.'
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

  // ── IS IT THE CHAIN, OR IS IT THE COMPUTER? ───────────────────────────────
  //
  // Justin, 11 September 2026: "do test checkin notifications as didnt seem to
  // work on laptop." The card had told him "Sent to this device. It should
  // appear within seconds", which is true as far as it goes: the push service
  // ACCEPTED it. Accepted and shown are two different events, and the gap
  // between them on a desktop is the operating system.
  //
  // Nothing in JavaScript can see whether a banner was actually drawn, so the
  // only honest test is to have the computer draw one from right here, with no
  // server and no push service involved at all, and ask the parent what they
  // saw. Two outcomes and they point at completely different fixes:
  //
  //   This one appears and the pushed one does not  the delivery chain is
  //   broken, which is ours, and worth telling us about.
  //   Neither appears  the computer is holding both back, which is macOS
  //   Notification Centre or Focus, or Windows quiet hours.
  //
  // It goes through the service worker's own registration rather than `new
  // Notification()`, because an installed app has no page level notification
  // permission surface and that constructor is not supported from a worker
  // backed install on some platforms.
  const [localResult, setLocalResult] = useState<string | null>(null)
  async function testThisComputer() {
    setLocalResult('Showing one now...')
    try {
      const reg = await navigator.serviceWorker.ready
      await reg.showNotification('Test from this computer', {
        body: 'This one came straight from your browser, with nothing sent over the internet.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { url: '/dashboard' },
      })
      setLocalResult('Shown. If you saw that one but not the test above, tell Claude and we will fix the delivery. If you saw neither, it is this computer holding them back: allow notifications for this app in your system settings and turn off Do Not Disturb.')
    } catch {
      setLocalResult('This browser refused to show one at all, which means the block is on this computer rather than with us. Allow notifications for this app in your system settings, then try again.')
    }
  }

  // TURNING IT ON, THROUGH THE SHARED PATH.
  //
  // This sequence used to live here in full, and it was the correct one: ask
  // first, straight off the tap, then register, then heal a rotated VAPID key,
  // then check the save. The CHILD app had its own copy that did none of that,
  // which is why a child tapping Yes please got nothing (Justin, 15 September
  // 2026). Two copies of one sequence is how a fix on one side never reaches
  // the other, so it moved to lib/push/enable.ts and both call it.
  //
  // Nothing about what a parent sees changes. The behaviour below is the same
  // behaviour, in one place, with the child now getting it too.
  async function enable() {
    setStatus('asking')
    setEnableError(null)
    const result = await enablePush(
      subscription => fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // deviceId so this browser keeps ONE row instead of gaining another
        // every time the push service rotates its endpoint. See migration 166.
        body: JSON.stringify({ subscription, userId, stage, deviceId: getDeviceId() }),
      }),
      endpoint => fetch('/api/push/subscribe', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      }),
    )

    if (result.ok) {
      // This device is now genuinely subscribed, so record both facts. Without
      // this the screen would keep showing "on another device, not this one"
      // immediately after successfully turning it on here.
      setEndpoint(result.endpoint)
      setThisDevice(true)
      setStatus('granted')
      return result.endpoint
    }

    if (result.reason === 'unsupported') { setStatus('unsupported'); return }
    // An iPhone in a plain Safari tab is not an unsupported phone, it is a
    // phone one step from working, so it keeps the card and gets the steps.
    if (result.reason === 'ios-needs-install') { setStatus('idle'); setEnableError(result.message); return }
    if (result.reason === 'denied') { setStatus('denied'); setEnableError(result.message); return }
    setStatus('idle')
    setEnableError(result.message)
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
        border: 'var(--edge)', boxShadow: 'var(--lift)',
        borderRadius: 'var(--radius-tile)',
        padding: '14px 18px',
        fontSize: '.82rem',
        color: 'var(--ink-soft)',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--text-md)' }}>✓</span>
          <span style={{ flex: 1, minWidth: '180px' }}>Check ins are on. Pick the moments that suit your day.</span>
          <button
            onClick={() => sendTest()}
            style={{
              background: '#fff', border: 'var(--edge)', borderRadius: '10px', boxShadow: 'var(--lift)',
              padding: '7px 14px', cursor: 'pointer', flexShrink: 0,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)',
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
            On your phone these work with no extra step. Safari on a Mac only
            shows them once Guided Childhood is added to your Dock, with File
            then Add to Dock. Open it from the Dock and test again.
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
        {/* The installed desktop app had no line at all, and it is the surface
            Justin was sitting on. Being installed clears the Safari problem
            and the browser problem; it does not clear the operating system,
            which is the layer that quietly swallows a banner during Focus or
            when the app was never allowed to notify. */}
        {surface === 'desktop-installed' && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            On your phone these work with no extra step. On a computer, if
            nothing appears, check Guided Childhood is allowed to notify and
            that Do Not Disturb or Focus is off.
          </p>
        )}
        {testResult && (
          <p style={{ margin: '10px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {testResult}
          </p>
        )}
        {/* The second half of the test, and the half that tells us which side
            the fault is on. Only on a computer: a phone shows these with no
            help and the extra button would be noise. */}
        {(desktopTab || surface === 'desktop-installed') && testResult && (
          <>
            <button
              onClick={testThisComputer}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '8px',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Nothing arrived? Test this computer on its own
            </button>
            {localResult && (
              <p style={{ margin: '8px 0 0', fontSize: '.78rem', fontWeight: 500, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {localResult}
              </p>
            )}
          </>
        )}
        <button
          onClick={resetAndRetest}
          disabled={resetting}
          style={{
            background: 'none', border: 'none', cursor: resetting ? 'wait' : 'pointer', padding: 0, marginTop: '10px',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
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
        background: 'var(--stage-4)', borderRadius: 'var(--radius-tile)', padding: '14px 16px',
        border: 'var(--edge)', boxShadow: 'var(--lift)',
        fontSize: '.82rem', color: 'var(--ink-soft)', fontWeight: 600,
      }}>
        <p style={{ margin: '0 0 10px', lineHeight: 1.55 }}>
          Check ins are on for {accountDevices === 1 ? 'another device' : `${accountDevices} of your devices`}, but not this one. Notifications only reach the devices you turn them on for.
        </p>
        {!blocked ? (
          <button
            onClick={enable}
            disabled={status === 'asking'}
            style={{
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'var(--edge)',
              borderRadius: '10px', padding: '9px 16px', cursor: status === 'asking' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-display)', fontSize: '.78rem', fontWeight: 900,
              boxShadow: 'var(--lift)',
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

  // AN IPHONE IN A SAFARI TAB IS NOT AN UNSUPPORTED PHONE.
  //
  // Apple only exposes the Push API to a web app added to the Home Screen, so
  // in a plain Safari tab 'PushManager' in window is false and this component
  // set status to 'unsupported' and then rendered NOTHING. A parent on the one
  // platform that needs an extra step was told nothing at all, while the child
  // app, on the same phone, showed them how. That is backwards.
  //
  // So the same offer as the child gets: name the step, then the button works.
  const support = pushSupport()
  const iosNeedsInstall = status === 'unsupported' && !support.ok && support.reason === 'ios-needs-install'

  if (iosNeedsInstall) {
    return (
      <div style={{
        background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
        padding: '16px 18px', margin: '0 0 16px', boxShadow: 'var(--lift)',
      }}>
        <p style={{
          margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2,
        }}>
          Add this to your Home Screen first
        </p>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>
          Tap the Share button at the bottom of Safari, the square with the arrow pointing up, then Add to Home Screen. Open it from the new icon.
        </p>
      </div>
    )
  }

  // When blocked or unsupported, stay quiet unless we captured a reason
  // worth showing so the parent knows why the button did nothing.
  if ((status === 'denied' || status === 'unsupported') && !enableError) return null
  if (status === 'denied' || status === 'unsupported') {
    return (
      <div style={{
        background: 'var(--stage-4)', borderRadius: 'var(--radius-btn)', padding: '16px 20px',
        border: 'var(--edge)', boxShadow: 'var(--lift)',
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
      borderRadius: 'var(--radius-btn)',
      padding: '20px 22px',
      border: 'var(--edge)',
      boxShadow: 'var(--lift)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
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
            border: 'var(--edge)', background: 'transparent',
            color: 'var(--ink-muted)', fontSize: 'var(--text-base)', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-md)',
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
        Three gentle nudges a day: morning, after school, bedtime. The moments your child faces screens, so you are ready with the words.
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
          background: 'var(--terracotta)',
          color: 'var(--ink)',
          border: 'var(--edge)',
          borderRadius: '10px',
          padding: '10px 20px',
          fontSize: '.78rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          cursor: status === 'asking' ? 'wait' : 'pointer',
          boxShadow: 'var(--lift)',
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
  // The evening is at the parent's own time since 13 September 2026: chosen
  // below, or learned from when they usually finish, or 9pm.
  { key: 'evening', label: 'Evening, your time' },
] as const

// Half hours a parent can pick for the evening reminder, 5pm to 10pm. The
// empty value lets it learn: an hour after when they usually finish their
// day (lib/push/evening.ts).
const REMINDER_TIMES: { value: string; label: string }[] = [
  { value: '', label: 'When I usually finish (learned)' },
  ...Array.from({ length: 11 }, (_, i) => {
    const m = 17 * 60 + i * 30
    const h = Math.floor(m / 60), mm = m % 60
    const twelve = h > 12 ? h - 12 : h
    return { value: String(m), label: `${twelve}${mm ? ':30' : ''}pm` }
  }),
]

function ReminderTime() {
  const [minutes, setMinutes] = useState<string>('')
  useEffect(() => {
    fetch('/api/push/reminder-time')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && d.minutes != null) setMinutes(String(d.minutes)) })
      .catch(() => null)
  }, [])
  function pick(v: string) {
    setMinutes(v)
    fetch('/api/push/reminder-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: v === '' ? null : Number(v) }),
    }).catch(() => null)
  }
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--ink-muted)' }}>
      Evening reminder
      <select
        value={minutes}
        onChange={e => pick(e.target.value)}
        style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '8px 10px', minHeight: 40 }}
      >
        {REMINDER_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
    </label>
  )
}

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
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.04em', borderRadius: 'var(--radius-pill)', padding: '7px 13px',
              cursor: 'pointer', transition: 'all 0.12s',
              background: on ? 'var(--terracotta)' : '#fff',
              color: on ? 'var(--ink)' : 'var(--ink-muted)',
              border: 'var(--edge)',
            }}
          >
            {on ? '\u2713 ' : ''}{o.label}
          </button>
        )
      })}
      {slots.includes('evening') && <ReminderTime />}
    </div>
  )
}
