import LegalDocument from '@/components/LegalDocument'
import { TERMS } from '@/lib/legal/terms'

export const metadata = { title: TERMS.title, description: TERMS.description }

export default function TermsPage() {
  return <LegalDocument doc={TERMS} />
}
