// Where DiGi looks for platform changes.
//
// Justin, 13 September 2026: DiGi should be "aware of the social media use
// changes happening on platforms, making sure we stay on top, relevant and a
// unique must have tool." My recommendation, which he approved: platform
// change awareness needs a SOURCE, not a feature. The living AI updates layer
// (ai_updates) had a drafting route nothing called and a table nothing read.
//
// Four families of source, by domain, so the weekly watch searches a short,
// named list rather than the whole web: the UK regulators who write the rules,
// the research body parents already trust, and the platforms' own newsrooms,
// which is where a new age check, a new teen account setting or a new AI
// feature is announced first. Config rather than prompt, so adding a fifth is
// a line here and a guard can hold that the four are present.

export type PlatformSource = {
  name: string
  domain: string
  kind: 'regulator' | 'research' | 'platform'
}

export const PLATFORM_SOURCES: PlatformSource[] = [
  { name: 'Ofcom', domain: 'ofcom.org.uk', kind: 'regulator' },
  { name: 'ICO', domain: 'ico.org.uk', kind: 'regulator' },
  { name: 'Common Sense Media', domain: 'commonsensemedia.org', kind: 'research' },
  { name: 'TikTok newsroom', domain: 'newsroom.tiktok.com', kind: 'platform' },
  { name: 'Meta newsroom', domain: 'about.fb.com', kind: 'platform' },
  { name: 'YouTube blog', domain: 'blog.youtube', kind: 'platform' },
  { name: 'Snap newsroom', domain: 'newsroom.snap.com', kind: 'platform' },
]

/** How far back the weekly watch looks. Eight days so a Monday run never misses the previous Monday. */
export const PLATFORM_WATCH_DAYS = 8
