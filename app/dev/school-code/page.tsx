import SchoolCodeBox from '@/components/school/SchoolCodeBox'

// Dev harness for the school code box (27 November 2026). The status comes
// from /api/school-link/mine, which the screenshot script stubs.
export default function Harness() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px' }}>
      <SchoolCodeBox />
    </div>
  )
}
