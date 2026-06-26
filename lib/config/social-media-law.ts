export type SocialMediaLaw = 'none' | 'partial_ban' | 'full_ban_u16'

export const SOCIAL_MEDIA_LAW: SocialMediaLaw =
  (process.env.NEXT_PUBLIC_SOCIAL_MEDIA_LAW as SocialMediaLaw) ?? 'none'

// Switch NEXT_PUBLIC_SOCIAL_MEDIA_LAW to full_ban_u16 when Spring 2027 ban goes live.
// Set partial_ban now (June 2026): full access ban confirmed, Regulations due end 2026.
export const banIsActive = SOCIAL_MEDIA_LAW !== 'none'
export const fullBanActive = SOCIAL_MEDIA_LAW === 'full_ban_u16'

// Config-driven platform list. Edit here when Regulations finalise the UK list.
// Current status (June 2026): confirmed in scope per government announcement.
// YouTube in-scope status is the open question — treat as in-scope until confirmed otherwise.
export const BANNED_PLATFORMS: string[] =
  (process.env.BANNED_PLATFORMS ?? 'Instagram,YouTube,TikTok,Snapchat,Facebook,X')
    .split(',')
    .map(p => p.trim())

// Explicitly out of scope (messaging, not named social media platforms)
export const EXEMPT_PLATFORMS = ['WhatsApp', 'Signal']

export const banContextForDigi: Record<SocialMediaLaw, string> = {
  none: '',
  partial_ban: `UK POLICY UPDATE (confirmed 15 June 2026): The government has confirmed a full access ban for under-16s on social media, following the Australian model. Named in-scope platforms include Instagram, YouTube, TikTok, Snapchat, Facebook and X. Messaging services (WhatsApp, Signal) are explicitly excluded. Gaming keeps the apps but loses high-risk features for under-16s (livestreaming, strangers contacting children). Regulations land before the end of 2026. The ban goes live Spring 2027. The final UK platform list is not yet fixed in regulation. The ban is not yet in force — children are still legally on these platforms — but prepare parents for the transition and the education gap it leaves behind. Never position as a compliance or enforcement tool. Never give or imply circumvention advice. Stay the education the ban leaves behind.`,
  full_ban_u16: `UK LEGISLATION IN FORCE: Full access ban for under-16s on social media is now live. Named platforms are banned for under-16s. Australian data shows two thirds of the target group remain on banned platforms through workarounds. The bedroom conversation is now also a VPN conversation. Open communication work is more important than ever. Address both groups: children who comply (need the cliff edge plan for turning 16) and children who bypass (need safety in unregulated spaces and an open relationship with their parent). Never give or imply circumvention or workaround instructions. Pivot to the legal surface: messaging known friends, gaming, watching. The non-banned surface is where the pathway earns its place.`,
}
