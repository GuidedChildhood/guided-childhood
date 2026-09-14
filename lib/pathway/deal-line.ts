// The one line about the family deal, and the one thing to do about it.
//
// Justin, 14 September 2026: the agreement "determines how jobs, device time
// is all agreed and passports and device all stem from that, and we need to
// agree, to remind, maybe print". Four states, one door each: make it, finish
// it, review it, print it. Lives in lib rather than in the strip so the guard
// can run the real function (a .tsx cannot be stripped and imported by node),
// and so the road or an email can say the same line without a second copy.

export type StripDeal = { signed: boolean; agreedDate: string | null; reviewDate: string | null }

function niceDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}

export function dealLine(deal: StripDeal | null, childName: string | null, childId: string | null, today = new Date().toISOString().slice(0, 10)): { text: string; cta: string; href: string } {
  const them = childName ?? 'them'
  const child = childId ? `&child=${childId}` : ''
  if (!deal) {
    return {
      text: `No family deal yet. It is what the jobs, the stars and the screen time all rest on.`,
      cta: `Make it with ${them}`,
      href: `/dashboard/agreement?from=passport${child}`,
    }
  }
  if (!deal.signed) {
    return {
      text: 'The deal is started but not signed by you both.',
      cta: 'Finish it together',
      href: `/dashboard/agreement?from=passport${child}`,
    }
  }
  const agreed = deal.agreedDate ? `Agreed on ${niceDate(deal.agreedDate)}.` : 'Agreed together.'
  if (deal.reviewDate && deal.reviewDate <= today) {
    return {
      text: `${agreed} The review was due ${niceDate(deal.reviewDate)}.`,
      cta: 'Sit down and review it',
      href: `/dashboard/agreement?from=passport${child}`,
    }
  }
  return {
    text: deal.reviewDate ? `${agreed} Review together on ${niceDate(deal.reviewDate)}.` : agreed,
    cta: 'Print it for the fridge',
    href: '/dashboard/agreement/print',
  }
}

