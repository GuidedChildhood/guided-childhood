export type SocialMediaLaw = 'none' | 'partial_ban' | 'full_ban_u16'

export const SOCIAL_MEDIA_LAW: SocialMediaLaw =
  (process.env.NEXT_PUBLIC_SOCIAL_MEDIA_LAW as SocialMediaLaw) ?? 'none'

export const banIsActive = SOCIAL_MEDIA_LAW !== 'none'
export const fullBanActive = SOCIAL_MEDIA_LAW === 'full_ban_u16'

export const banContextForDigi: Record<SocialMediaLaw, string> = {
  none: '',
  partial_ban: `UK LEGISLATION ACTIVE: Functionality restrictions are in effect under the Children's Wellbeing and Schools Act 2026. Platforms cannot serve overnight content (10pm to 6am for under-16s), autoplay, infinite scroll, or algorithmic stranger contact. Adjust guidance accordingly. Risk is partially shifting to unregulated platforms including Discord, Telegram, and gaming chat rooms.`,
  full_ban_u16: `UK LEGISLATION ACTIVE: A full access ban for under-16s is now in force. Australian data (2025) shows two thirds of the target group remain on banned platforms through workarounds. Adjust all Stage 4 guidance to this reality. The bedroom conversation is now also a VPN conversation. Open communication work is more important than ever. Address both groups: children who comply (need the cliff edge plan for turning 16) and children who bypass (need safety in unregulated spaces and an open relationship with their parent).`,
}
