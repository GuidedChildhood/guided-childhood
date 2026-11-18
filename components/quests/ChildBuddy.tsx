import { buddyFor } from '@/lib/kid/buddy'
import { childColour } from '@/lib/children/colour'

// A child's face on the parent's side: the buddy they picked in their own app,
// on a disc in their stage colour.
//
// Justin, 18 November 2026, on the top of the Quests page: "better Happy News
// styled icons". The child rows were a name and nothing else, so Teo and Olga
// read as two lines of the same table. The buddy is the child's own choice
// (migration 067), drawn from the reference art, and it is the same picture
// their app greets them with, so the two sides of the product finally show
// the same child. Falls back to DiGi, exactly as the child's app does.
export default function ChildBuddy({ buddy, ageBand, size = 44 }: {
  buddy?: string | null
  ageBand?: string | null
  size?: number
}) {
  const b = buddyFor(buddy)
  const c = childColour(ageBand)
  return (
    <span aria-hidden style={{
      flexShrink: 0, width: size, height: size, borderRadius: '50%',
      background: c.tint, border: size >= 36 ? 'var(--edge)' : '1.5px solid var(--ink)', boxSizing: 'border-box',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.img} alt="" width={Math.round(size * 0.82)} height={Math.round(size * 0.82)} style={{ objectFit: 'contain', display: 'block' }} />
    </span>
  )
}
