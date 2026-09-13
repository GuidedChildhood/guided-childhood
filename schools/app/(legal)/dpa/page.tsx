import LegalDocument from '@/components/LegalDocument'
import { DPA } from '@/lib/legal/dpa'

export const metadata = { title: DPA.title, description: DPA.description }

export default function DpaPage() {
  return <LegalDocument doc={DPA} />
}
