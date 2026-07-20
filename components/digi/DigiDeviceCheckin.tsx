'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi noticing a device pattern and checking in about it, per child, from
// that child's real device data. The server decides whether there is
// anything honest to ask (at most one per child per week, strongest signal
// first, never something that is already an open concern, never a prompt
// waved away in the last three weeks); this card just asks it.
//
// Yes this is us opens the DiGi chat already primed with the situation.
// Not really quiets that prompt for three weeks. Either way the card also
// stamps the shared wondering gap key, so DiGi never asks two questions on
// the same visit.

const WONDERING_KEY = 'gc_digi_wondering'

type Checkin = {
  promptId: string
  childId: string
  childName: string
  device: string | null
  question: string
  chatMessage: string
  pathway: { label: string; href: string }
}

// Fixture lets the dev only preview page render the card without a signed
// in parent or any session data behind it. Never set in the real app.
export default function DigiDeviceCheckin({ fixture }: { fixture?: Checkin }) {
  const router = useRouter()
  const [checkin, setCheckin] = useState<Checkin | null>(fixture ?? null)
  const [rowId, setRowId] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState<'yes' | 'not_really' | null>(null)
  const seenSent = useRef(false)

  useEffect(() => {
    if (fixture) return
    fetch('/api/digi/device-checkin')
      .then(r => r.json())
      .then(d => { if (d?.checkin) setCheckin(d.checkin) })
      .catch(() => { /* stay quiet on error */ })
  }, [fixture])

  // The moment the card actually shows: start the weekly clock for this
  // child, and hold the generic wondering back so DiGi speaks once.
  useEffect(() => {
    if (!checkin || seenSent.current) return
    seenSent.current = true
    try { localStorage.setItem(WONDERING_KEY, new Date().toISOString()) } catch { /* private mode */ }
    if (fixture) return
    fetch('/api/digi/device-checkin', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'seen', promptId: checkin.promptId, childId: checkin.childId, device: checkin.device }),
    })
      .then(r => r.json())
      .then(d => { if (d?.id) setRowId(d.id) })
      .catch(() => { /* best effort */ })
  }, [checkin, fixture])

  const answer = (event: 'yes' | 'not_really') => {
    if (!checkin) return
    if (!fixture && rowId) {
      fetch('/api/digi/device-checkin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, id: rowId }),
      }).catch(() => { /* best effort */ })
    }
    if (event === 'yes') {
      router.push(`/dashboard/digi?q=${encodeURIComponent(checkin.chatMessage)}`)
      return
    }
    setDismissed('not_really')
  }

  if (!checkin) return null

  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '16px 18px', marginBottom: '20px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: dismissed ? 0 : '12px' }}>
        <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DigiCharacter size={26} mood={dismissed ? 'happy' : 'idle'} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>DiGi noticed</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.35 }}>
            {dismissed ? 'No problem. DiGi will leave it for a few weeks.' : checkin.question}
          </div>
        </div>
      </div>
      {!dismissed && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => answer('yes')}
            style={{ padding: '11px 17px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}
          >
            Yes this is us
          </button>
          <button
            onClick={() => answer('not_really')}
            style={{ padding: '11px 17px', borderRadius: '12px', border: '1.5px solid var(--border)', cursor: 'pointer', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px' }}
          >
            Not really
          </button>
          <a
            href={checkin.pathway.href}
            style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 600, color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            {checkin.pathway.label}
          </a>
        </div>
      )}
    </div>
  )
}
