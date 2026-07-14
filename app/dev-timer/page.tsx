'use client'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'

export default function DevTimer() {
  const future = new Date(Date.now() + 14 * 60000 + 32000).toISOString()
  const started = new Date(Date.now() - 16 * 60000).toISOString()
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--deep-teal)', padding: '22px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 'min(100%, 460px)' }}>
        <p style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 8 }}>IDLE</p>
        <DeviceTimeCard token="000000000000000000" balanceStars={9} initialSession={null} />
        <p style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11, margin: '16px 0 8px' }}>RUNNING</p>
        <DeviceTimeCard token="000000000000000001" balanceStars={9} initialSession={{ id: 's1', device: 'tv', minutes: 30, stars: 6, endsAt: future, startedAt: started }} />
      </div>
    </div>
  )
}
