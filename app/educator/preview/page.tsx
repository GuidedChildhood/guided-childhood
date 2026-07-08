import { redirect } from 'next/navigation'

// The Phase 1 preview URL lives on in bookmarks and older links.
// The real route is /educator/teach/[module].
export default function EducatorPreviewPage() {
  redirect('/educator/teach/ks3-12-misinfo-deepfakes')
}
