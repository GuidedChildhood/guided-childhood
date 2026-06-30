'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const STAGE_DEVICE_DATA: Record<number, {
  device: string
  headline: string
  iosSettings: string[]
  recommendedApps: { name: string; note: string }[]
  toolsPath: string
}> = {
  1: {
    device: 'Shared screens and tablets',
    headline: 'Have you set up shared screen rules for ages 4 to 7?',
    iosSettings: [
      'Screen Time → Content and Privacy → Apps: 4+ only, TV Shows: TV-Y only',
      'Screen Time → Downtime: no screens after 7pm, before 7am',
      'No solo streaming. Co-view everything at this stage.',
    ],
    recommendedApps: [
      { name: 'YouTube Kids', note: 'filtered for under 8s' },
      { name: 'BBC Bitesize', note: 'educational content, no feeds' },
      { name: 'Apple Screen Time', note: 'built into iOS, free' },
    ],
    toolsPath: '/stage-1',
  },
  2: {
    device: 'First restricted device',
    headline: 'Have you set up the first device for ages 8 to 10?',
    iosSettings: [
      'Screen Time → Communication Limits → Contacts Only (family and approved friends)',
      'Screen Time → App Limits: Social Networking set to 0 minutes',
      'Screen Time → Content and Privacy → App Store: require approval for all downloads',
    ],
    recommendedApps: [
      { name: 'Google Family Link', note: 'Android supervision' },
      { name: 'Apple Screen Time', note: 'built into iOS, free' },
      { name: 'Bark', note: 'monitors content without reading messages' },
    ],
    toolsPath: '/stage-2',
  },
  3: {
    device: 'Guided smartphone',
    headline: 'Have you set up the guided smartphone for ages 11 to 13?',
    iosSettings: [
      'Screen Time → App Limits: Social Networking and Entertainment, 30 min max per day',
      'Screen Time → Communication Limits → Contacts Only, review monthly',
      'Settings → Privacy → Location Services: While Using only, no background tracking',
    ],
    recommendedApps: [
      { name: 'Bark', note: 'alerts you to risk without invading privacy' },
      { name: 'Circle', note: 'router-based filtering for home network' },
      { name: 'iOS Screen Time', note: 'built in, start here before paid tools' },
    ],
    toolsPath: '/stage-3',
  },
  4: {
    device: 'Monitored social media access',
    headline: 'Have you set up social media monitoring for ages 13 to 15?',
    iosSettings: [
      'Screen Time → Screen Time Reports: review usage together each Sunday',
      'iOS Family Sharing → Screen Distance and Communication Safety: both on',
      'Instagram Supervision: link your account to theirs in Instagram settings',
    ],
    recommendedApps: [
      { name: 'Bark', note: 'monitors social content for risk signals' },
      { name: 'Instagram Supervision', note: 'built into Instagram, free' },
      { name: 'Meta Family Centre', note: 'covers Facebook and Instagram' },
    ],
    toolsPath: '/stage-4',
  },
  5: {
    device: 'Full access, trust-based',
    headline: 'Have you had the digital independence conversation?',
    iosSettings: [
      'Screen Time: consider removing limits together as a joint decision',
      'Focus modes: help them build their own for study, sleep, and social time',
      'Privacy audit together: review which apps have location, microphone, and camera access',
    ],
    recommendedApps: [
      { name: 'Digital Wellbeing', note: 'Android built-in self-monitoring' },
      { name: 'iOS Screen Distance', note: 'eye health reminders, built in' },
      { name: 'BeReal', note: 'lower-pressure social format worth understanding' },
    ],
    toolsPath: '/stage-5',
  },
}

const STAGE_COLORS: Record<number, { bg: string; bold: string; text: string }> = {
  1: { bg: 'var(--stage-1)', bold: '#C8E6C9', text: '#2D5016' },
  2: { bg: 'var(--stage-2)', bold: '#FFE0B2', text: '#7C3D00' },
  3: { bg: 'var(--stage-3)', bold: '#F8BBD9', text: '#880E4F' },
  4: { bg: 'var(--stage-4)', bold: '#BBDEFB', text: '#0D2A6B' },
  5: { bg: 'var(--stage-5)', bold: '#D1C4E9', text: '#3B1080' },
}

interface Props {
  stageId: number
  stageName: string
  childName: string | null
}

export default function DeviceSetupBanner({ stageId, stageName, childName }: Props) {
  const storageKey = `gc_device_setup_confirmed_${stageId}`
  const [confirmed, setConfirmed] = useState(true)
  const [showApps, setShowApps] = useState(false)

  useEffect(() => {
    setConfirmed(localStorage.getItem(storageKey) === '1')
  }, [storageKey])

  const data = STAGE_DEVICE_DATA[stageId]
  const colors = STAGE_COLORS[stageId]
  if (!data || !colors) return null

  if (confirmed) {
    return (
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => { localStorage.removeItem(storageKey); setConfirmed(false) }}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'underline',
          }}
        >
          Review device setup for Stage {stageId} →
        </button>
      </div>
    )
  }

  const name = (childName && childName !== 'Your child') ? childName : null

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        background: colors.bg,
        border: `1.5px solid ${colors.bold}`,
        borderRadius: '20px',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ background: colors.bold, height: '4px' }} />

        <div style={{ padding: '20px 22px 0' }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: colors.text, opacity: 0.7, marginBottom: '8px',
          }}>
            Device setup · Stage {stageId} · {stageName}
          </div>

          {/* Headline */}
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
            color: 'var(--ink)', letterSpacing: '-0.02em',
            lineHeight: 1.25, marginBottom: '4px',
          }}>
            {data.headline}
          </h3>

          {name && (
            <p style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '0', lineHeight: 1.5 }}>
              These are the settings to check before {name} moves on to the next stage.
            </p>
          )}
        </div>

        {/* Device label */}
        <div style={{ padding: '14px 22px 0' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: colors.bold, color: colors.text,
            padding: '3px 10px', borderRadius: '100px',
          }}>
            {data.device}
          </span>
        </div>

        {/* iOS settings checklist */}
        <div style={{ padding: '16px 22px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: colors.text, opacity: 0.6, marginBottom: '10px',
          }}>
            iOS settings to check
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.iosSettings.map((setting, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '6px',
                  background: colors.bold, border: `1.5px solid ${colors.text}20`,
                  flexShrink: 0, marginTop: '1px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '10px', color: colors.text }}>✓</span>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {setting}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended apps toggle */}
        <div style={{ padding: '14px 22px 0' }}>
          <button
            onClick={() => setShowApps(v => !v)}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
              color: colors.text, letterSpacing: '0.08em', textTransform: 'uppercase',
              opacity: 0.75,
            }}
          >
            {showApps ? '▲ Hide' : '▼ Show'} recommended apps
          </button>

          {showApps && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.recommendedApps.map((app, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', background: 'rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: '13px', color: 'var(--ink)',
                  }}>
                    {app.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                    {app.note}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '18px 22px 22px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { localStorage.setItem(storageKey, '1'); setConfirmed(true) }}
            style={{
              background: colors.text, color: colors.bg,
              border: 'none', borderRadius: '16px',
              padding: '11px 22px', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              boxShadow: `0 4px 0 ${colors.text}66`,
            }}
          >
            Done, all set
          </button>
          <Link
            href={`https://tools.guidedchildhood.com${data.toolsPath}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
              color: colors.text, textDecoration: 'underline',
              letterSpacing: '0.04em',
            }}
          >
            Full guide →
          </Link>
        </div>
      </div>
    </div>
  )
}
