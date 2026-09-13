import LegalDocument from '@/components/LegalDocument'
import { PRIVACY } from '@/lib/legal/privacy'

export const metadata = { title: 'Privacy notice for schools', description: PRIVACY.description }

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY} />
}
