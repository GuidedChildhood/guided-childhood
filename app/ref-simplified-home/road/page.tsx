import StageRoad from '@/components/pathway/StageRoad'

// REFERENCE ONLY, never linked from the app. The REAL big road component with
// fixture props, so the reworked pathway hero can be screenshotted and
// reviewed without live data. Delete once the direction is agreed.

export default function RefBigRoad() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 20px 60px' }}>
        <StageRoad currentStageNum={2} progressPct={45} childName="Teo" />
      </div>
    </div>
  )
}
