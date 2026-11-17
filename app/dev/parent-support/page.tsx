import ParentSupport from '@/components/scripts/ParentSupport'

// Dev harness for the "If this one is hard for you" fold on the script reader.
export default function ParentSupportHarness() {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 60px' }}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>Script reader, parent support</p>
      <ParentSupport />
    </div>
  )
}
