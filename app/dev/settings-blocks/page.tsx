'use client'

import YourAgreements from '@/components/settings/YourAgreements'
import SettingsLinks from '@/components/settings/SettingsLinks'

// Dev harness for the two new Settings sections. Both sit behind auth on a
// page that needs a real profile, so this renders them against the same page
// width and background with both consent states side by side.
//
// The withdraw button posts for real, so do not tap it while signed in as
// somebody whose check ins matter.

export default function SettingsBlocksHarness() {
  return (
    <div style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 20px 60px' }}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>Everything else</p>
      <SettingsLinks />

      <p className="eyebrow" style={{ margin: '26px 0 12px' }}>Agreed, consent given</p>
      <YourAgreements joinedAt="2026-03-14T10:00:00Z" consentAt="2026-07-21T19:30:00Z" />

      <p className="eyebrow" style={{ margin: '26px 0 12px' }}>Agreed, no consent</p>
      <YourAgreements joinedAt="2026-03-14T10:00:00Z" consentAt={null} />
    </div>
  )
}
