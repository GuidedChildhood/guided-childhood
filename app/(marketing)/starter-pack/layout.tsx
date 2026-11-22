import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/seo/meta'

// The stage check page is a client component, which cannot export metadata, so
// it went out under the home page's title and with no canonical. This layout
// only names it; it renders nothing of its own.
export const metadata: Metadata = pageMetadata({
  title: 'What stage is your child? Three questions, no sign up',
  description: 'Three questions, two minutes. Tell us your child\'s age and the screen battle you are facing, and see their stage and a plan for their exact age before you make an account.',
  path: '/starter-pack',
})

export default function StarterPackLayout({ children }: { children: React.ReactNode }) {
  return children
}
