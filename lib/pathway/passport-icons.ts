import type { HappyIconName } from '@/components/kid/HappyIcon'

// The story icon for each of the passport's five slots.
//
// The happy news finish (decisions, 5 September 2026): an emoji doing an
// icon's job sits in an ink edged plate, as a HappyIcon story icon where one
// of the names fits. The five slots and the to do rows drew 🔧 💬 📚 ⭐ ⚖️,
// which is five icons' jobs done by emoji on the one object the family keeps.
// One map, read by the slots, the next open row and the to do, so the same
// slot wears the same drawing everywhere.
export const SLOT_ICON: Record<string, HappyIconName> = {
  devices: 'phonebed',
  moments: 'tell',
  lessons: 'lessons',
  jobs: 'jobs',
  balance: 'balance',
}
