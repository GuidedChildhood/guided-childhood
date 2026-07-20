// Picking which child a page is about. Server pages that used to hard read
// the primary child now accept a ?child=<id> search param: when it names one
// of this parent's children, that child drives the page; otherwise the
// primary child (or the first one) does, so every existing link and
// bookmark behaves exactly as before.

export interface SelectableChild {
  id: string
  is_primary?: boolean | null
}

export function pickChild<T extends SelectableChild>(children: T[], childIdParam: string | null | undefined): T | null {
  if (children.length === 0) return null
  if (childIdParam) {
    const match = children.find(c => c.id === childIdParam)
    if (match) return match
  }
  return children.find(c => c.is_primary) ?? children[0]
}
