'use client'

import { useEffect, useMemo, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { canBuy, characterForKey, formatPence, lockedReason, MAX_QTY, type Product } from '@/lib/shop/catalogue'
import { shopArt } from '@/lib/shop/art'

// The keepsake shop. The physical end of the same pathway: a passport printed
// from the stamps a child actually earned, and the Planet Friends as things you
// can hold.
//
// The rule that makes it ours is visible in the layout. A charm a child has not
// earned is not hidden and it is not buyable, it sits there greyed with the
// exact thing still to do, so the shop becomes one more reason to keep the
// streak going rather than a way to buy your way past it. The server refuses
// the same purchases independently, so the greying is the courtesy and the
// checkout route is the lock.
//
// Everything not yet through toy safety testing shows honestly as coming soon
// with an interest form, because taking money for a charm still in the lab
// would be the one thing that breaks trust here.

type Basket = Record<string, number>

const ART: Record<string, string> = {
  passport: '🛂',
  bracelet: '🧷',
  plush: '🧸',
  chart: '🧲',
}

export default function Shop({
  products,
  earned,
  childName,
  email = '',
  ordered = false,
  cancelled = false,
}: {
  products: Product[]
  earned: number
  childName: string | null
  email?: string
  ordered?: boolean
  cancelled?: boolean
}) {
  const [basket, setBasket] = useState<Basket>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forSale = products.filter(p => p.active)
  const soon = products.filter(p => !p.active)

  const lines = useMemo(
    () => Object.entries(basket)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => ({ product: products.find(p => p.key === key)!, qty }))
      .filter(l => l.product),
    [basket, products],
  )
  const total = lines.reduce((sum, l) => sum + l.product.price_pence * l.qty, 0)
  const count = lines.reduce((sum, l) => sum + l.qty, 0)

  function add(key: string, by: number) {
    setError(null)
    setBasket(b => {
      const next = Math.max(0, Math.min(MAX_QTY, (b[key] ?? 0) + by))
      return { ...b, [key]: next }
    })
  }

  async function checkout() {
    if (busy || !lines.length) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map(l => ({ key: l.product.key, qty: l.qty })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error ?? 'We could not open the payment page. Try again in a moment.')
    } catch {
      setError('We could not reach the payment page. Check your connection and try again.')
    }
    setBusy(false)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 120px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: 8 }}>Keepsakes</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10 }}>
        Make the journey real
      </h1>
      <p style={{ fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: 22, maxWidth: 520 }}>
        The passport and the Planet Friends live on a screen. The proudest moments deserve something you can hold, printed from the stamps {childName ?? 'your child'} actually earned.
      </p>

      {ordered && (
        <Banner tone="good" title="Thank you. We are making it now.">
          Your confirmation is on its way by email. Everything here is made to order, so give it up to two weeks.
        </Banner>
      )}
      {cancelled && (
        <Banner tone="quiet" title="Nothing was taken">
          You closed the payment page, so your basket is still here whenever you want it.
        </Banner>
      )}

      {forSale.map(p => (
        <Card key={p.key} product={p} qty={basket[p.key] ?? 0} onAdd={add} childName={childName} earned={earned} />
      ))}

      {soon.length > 0 && (
        <>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)', margin: '30px 0 6px', letterSpacing: '-0.01em' }}>
            Coming soon
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 16px' }}>
            Anything a child can hold and chew is a toy in law, so the magnetic chart, the charms and the plush go through proper safety testing before we sell one. Tell us which you want and you will hear first.
          </p>
          {soon.map(p => (
            <Card key={p.key} product={p} qty={0} onAdd={add} childName={childName} earned={earned} />
          ))}
          <Interest email={email} childName={childName} />
        </>
      )}

      {error && (
        <p role="alert" style={{ fontSize: 16, fontWeight: 700, color: 'var(--terracotta-dark)', margin: '14px 0 0', lineHeight: 1.5 }}>
          {error}
        </p>
      )}

      {/* The basket only appears once there is something in it, so an empty
          shop is not covered by a bar saying nothing. */}
      {count > 0 && (
        <div className="above-tab-bar" style={{
          background: '#fff', borderTop: '1.5px solid var(--border)',
          boxShadow: '0 -6px 24px rgba(26,26,46,0.09)',
          padding: '14px 20px 16px',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {count === 1 ? '1 item' : `${count} items`}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--ink)' }}>
                {formatPence(total)}
              </div>
            </div>
            <button
              onClick={checkout}
              disabled={busy}
              style={{
                background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
                padding: '15px 26px', cursor: busy ? 'wait' : 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18.5,
                boxShadow: '0 5px 0 var(--terracotta-dark)', opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? 'Opening…' : 'Checkout'}
            </button>
          </div>
          <p style={{ maxWidth: 600, margin: '8px auto 0', fontSize: 14, color: 'var(--ink-muted)', textAlign: 'center' }}>
            Posted within the UK. Payment handled by Stripe.
          </p>
        </div>
      )}
    </div>
  )
}

function Card({
  product, qty, onAdd, childName, earned,
}: {
  product: Product
  qty: number
  onAdd: (key: string, by: number) => void
  childName: string | null
  earned: number
}) {
  const buyable = canBuy(product, earned)
  const character = characterForKey(product.character_key)
  const showsWholeFamily = product.kind === 'stickers' || product.kind === 'charm_set' || product.kind === 'chart'
  // A picture of the actual thing beats a picture of the character on it, so
  // the product shot wins where one exists and the character art is the
  // fallback for anything added without one.
  const photo = shopArt(product.key, product.image_url)
  const [photoBroken, setPhotoBroken] = useState(false)
  const shownPhoto = photoBroken ? null : photo

  // Arrived from the passport or the sticker book, which name the product they
  // are sending you to. Landing on the shop and having to find it again is the
  // moment a parent gives up, so the card is scrolled to and briefly ringed.
  // The ring fades rather than sticking, because a permanent highlight on one
  // card reads as a state rather than as an answer to where am I.
  const [flash, setFlash] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== `#p-${product.key}`) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 2400)
    return () => clearTimeout(t)
  }, [product.key])

  return (
    <div id={`p-${product.key}`} style={{
      background: '#fff',
      border: `1.5px solid ${flash ? 'var(--terracotta)' : 'var(--border)'}`,
      borderRadius: 20,
      boxShadow: flash ? '0 0 0 4px var(--terracotta-lt)' : '0 4px 22px rgba(26,26,46,0.06)',
      padding: 20, marginBottom: 14, scrollMarginTop: 84,
      transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
      opacity: buyable ? 1 : 0.72,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{
          flexShrink: 0, width: shownPhoto ? 84 : 62, height: shownPhoto ? 84 : 62, borderRadius: 16,
          background: 'var(--cream)',
          // A photo carries its own edge, so it takes the quiet border. Only
          // character art gets the Friend's colour ring.
          border: shownPhoto ? '1.5px solid var(--border)' : `2px solid ${character?.colour ?? 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          fontSize: 30, lineHeight: 1,
          // A charm nobody has earned is shown in grey, so the colour arriving
          // is itself the reward.
          filter: buyable ? 'none' : 'grayscale(1)',
        }} aria-hidden={!character && !shownPhoto}>
          {shownPhoto
            // A remote photo that fails takes the card down to the character
            // art rather than leaving a broken image on a page that sells
            // things. The vendored ones cannot fail, this covers the coming
            // soon items still served from the generator's CDN.
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={shownPhoto} alt={product.name} width={84} height={84} onError={() => setPhotoBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : character
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={character.cutout} alt={character.name} width={52} height={52} style={{ objectFit: 'contain' }} />
            // Anything that is the whole family leads with DiGi, the one who is
            // on every sheet and in every set, rather than a generic star.
            : showsWholeFamily
              ? <DigiCharacter size={40} />
              : <span aria-hidden>{ART[product.kind] ?? '⭐'}</span>}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20.5, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {product.name}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--terracotta-dark)' }}>
              {formatPence(product.price_pence)}
            </span>
          </div>
          <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px 0 0' }}>
            {product.blurb}
          </p>
          {product.personalised && childName && (
            <p style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', margin: '8px 0 0' }}>
              Printed for {childName}, from their real stamps.
            </p>
          )}
        </div>
      </div>

      {/* Six across on one line, even on a 390 wide phone. Note the sums have
          to allow for the global zoom of 1.07 on body, which shrinks the usable
          width to about 285px inside the card. Wrapped, the family reads as two
          groups rather than one set, which is the opposite of the point. */}
      {showsWholeFamily && (
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'nowrap', marginTop: 14 }}>
          {/* DiGi first, because the copy promises six and DiGi is the sixth. A
              row of five under a line that says DiGi and all five Planet
              Friends is a small lie a child would spot immediately. */}
          <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream)', border: '2px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <DigiCharacter size={26} />
          </span>
          {STAGE_CHARACTERS.map(c => (
            <span key={c.key} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream)', border: `2px solid ${c.colour}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.cutout} alt={c.name} width={33} height={33} style={{ objectFit: 'contain' }} />
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        {buyable ? (
          qty > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Step label="One fewer" onClick={() => onAdd(product.key, -1)}>–</Step>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 21, minWidth: 22, textAlign: 'center' }}>{qty}</span>
              <Step label="One more" onClick={() => onAdd(product.key, 1)} disabled={qty >= MAX_QTY}>+</Step>
              <span style={{ fontSize: 15.5, color: 'var(--ink-muted)', fontWeight: 700 }}>In your basket</span>
            </div>
          ) : (
            <button
              onClick={() => onAdd(product.key, 1)}
              style={{
                background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
                padding: '13px 24px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17.5,
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              Add to basket
            </button>
          )
        ) : (
          <div style={{
            display: 'inline-block', background: 'var(--cream)', border: '1.5px solid var(--border)',
            borderRadius: 12, padding: '10px 16px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--ink-soft)',
          }}>
            {lockedReason(product)}
          </div>
        )}
      </div>
    </div>
  )
}

function Step({ children, onClick, label, disabled }: { children: React.ReactNode; onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick} aria-label={label} disabled={disabled}
      style={{
        width: 42, height: 42, borderRadius: 14, background: '#fff',
        border: '1.5px solid var(--border)', cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: 'var(--ink)',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  )
}

function Banner({ tone, title, children }: { tone: 'good' | 'quiet'; title: string; children: React.ReactNode }) {
  const good = tone === 'good'
  return (
    <div style={{
      background: good ? 'var(--tint-sage)' : 'var(--cream)',
      border: `1.5px solid ${good ? '#D6E5DF' : 'var(--border)'}`,
      borderRadius: 18, padding: '16px 18px', marginBottom: 18,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--ink)' }}>{title}</div>
      <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '5px 0 0' }}>{children}</p>
    </div>
  )
}

// The interest capture, kept for the lines we cannot sell yet. Unchanged in
// behaviour from the old keepsakes page, just moved under the coming soon list
// where it now makes sense.
function Interest({ email, childName }: { email: string; childName: string | null }) {
  const [value, setValue] = useState(email)
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  async function register() {
    if (state !== 'idle') return
    const clean = value.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return
    setState('sending')
    try {
      await fetch('/api/keepsakes/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The passport is on sale now, so the only interest left to register is
        // in the physical Friends. One value, honestly recorded, rather than a
        // chip that files plush under the passport.
        body: JSON.stringify({ email: clean, item: 'charm_set', childName }),
      })
    } catch { /* best effort */ }
    setState('done')
  }

  return (
    <div style={{ background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF', borderRadius: 20, padding: 20, marginTop: 4 }}>
      {state === 'done' ? (
        <div style={{ textAlign: 'center', padding: '8px 4px' }}>
          <div style={{ fontSize: 34, marginBottom: 6 }}>💛</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink)' }}>You are on the list</div>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px auto 0', maxWidth: 380 }}>
            We will let you know the moment these are ready to order. Thank you for building the journey with us.
          </p>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19.5, color: 'var(--ink)', marginBottom: 4 }}>
            Want the charms and the plush
          </div>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            No payment now. We make these in the order families ask for them, and you will hear the day they land.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="email" value={value} onChange={e => setValue(e.target.value)} placeholder="Your email"
              style={{ flex: 1, minWidth: 180, padding: '13px 15px', borderRadius: 12, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 17, background: '#fff' }}
            />
            <button
              onClick={register} disabled={state === 'sending'}
              style={{ background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 12, padding: '13px 22px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, boxShadow: '0 4px 0 var(--terracotta-dark)' }}
            >
              {state === 'sending' ? 'Sending…' : 'Notify me'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
