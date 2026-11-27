// Which device settings guides a script points a parent to.
//
// Justin, 26 November 2026: the rewritten explorer script "Mood drops after
// phone use" names Instagram and has to link out to the Instagram guide for the
// feed and the Teen Account settings, because the words are tonight's job and
// the settings are the step after. Scripts are database rows (non negotiable
// 6), so the link cannot be typed into the copy as markup: the script names the
// app's guide in plain words in its tonight line, and the page turns that into
// a link here.
//
// Only the tonight line is read, and only when it names the app's GUIDE, so a
// script that merely mentions TikTok in passing does not grow a settings
// button it never asked for. The keys are device_guides.device_key values on
// the live bank.

export type GuideLink = { key: string; name: string; href: string }

const GUIDES: { key: string; name: string; pattern: RegExp }[] = [
  { key: 'instagram', name: 'Instagram', pattern: /\binstagram guide\b/i },
  { key: 'tiktok', name: 'TikTok', pattern: /\btiktok guide\b/i },
  { key: 'snapchat', name: 'Snapchat', pattern: /\bsnapchat guide\b/i },
  { key: 'youtube', name: 'YouTube', pattern: /\byoutube guide\b/i },
]

export function guideLinksFor(tonight: string | null | undefined): GuideLink[] {
  if (!tonight) return []
  return GUIDES
    .filter(g => g.pattern.test(tonight))
    .map(g => ({ key: g.key, name: g.name, href: `/dashboard/devices?guide=${g.key}` }))
}
