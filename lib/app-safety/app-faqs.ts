// THE QUESTIONS PARENTS TYPE ABOUT ONE APP, ANSWERED FROM ITS OWN FACTS.
//
// Justin, 28 November 2026: double down on the pages already bringing parents
// in from Google. PostHog, last 30 days: Fortnite, Snapchat, TikTok, YouTube,
// Among Us, Spotify, Roblox and Instagram pages lead. The general questions
// (what age, is it safe, what controls) are built for every app in content.ts;
// these are the specific ones a parent of that app's user searches next, such
// as "can my child message on TikTok" or "can I see my child's Snapchats".
//
// Evidence or silence. Every answer here restates a fact already sourced in
// lib/app-safety/apps.ts, and carries the same source URL, so a change to the
// fact there is a change to make here too. No answer says yes or no to the
// parent's real question (should they have it): each gives the rule and the
// setting, and leaves the decision with the family.

export type AppFaq = { q: string; a: string; sourceUrl: string }

export const APP_FAQS: Record<string, AppFaq[]> = {
  tiktok: [
    {
      q: 'Can my child send direct messages on TikTok?',
      a: 'Not under 16. TikTok switches direct messages off for 13 to 15 year olds. From 16, other people can send messages and message requests unless the settings say otherwise, and Family Pairing lets you choose who can message a 16 or 17 year old.',
      sourceUrl: 'https://www.tiktok.com/support/faq_detail?id=7543604781667867142',
    },
    {
      q: 'Does TikTok have a screen time limit for teenagers?',
      a: 'Yes, a daily screen time limit is on by default at one hour for 13 to 17 year olds, across all their devices. Through Family Pairing you can change it and lock it, and add Schedule time away for hours when TikTok is unavailable.',
      sourceUrl: 'https://www.tiktok.com/support/faq_detail?id=7543604781667867142',
    },
    {
      q: 'Can my child go LIVE on TikTok?',
      a: 'TikTok\'s terms set 18 as the age for hosting TikTok LIVE and for virtual items. Teens can watch LIVE streams from other accounts, but TikTok does not let them host one.',
      sourceUrl: 'https://www.tiktok.com/safety/en/tools-and-guides/guardians-guide',
    },
    {
      q: 'Do TikTok notifications stop at night?',
      a: 'By default, push notifications are muted from 9pm to 8am for 13 to 15 year olds, and from 10pm to 8am for 16 and 17 year olds. You can add more quiet times through Family Pairing.',
      sourceUrl: 'https://www.tiktok.com/support/faq_detail?id=7543604781667867142',
    },
  ],
  snapchat: [
    {
      q: 'Can I see my child\'s Snapchat messages?',
      a: 'No. Family Centre shows your teen\'s friends, who they have been chatting with and how they spend their time on the app, but not the content of their messages.',
      sourceUrl: 'https://parents.snapchat.com/family-center?lang=en-GB',
    },
    {
      q: 'Do Snapchat messages really disappear?',
      a: 'Snaps are deleted once everyone has viewed them, and chats are deleted 24 hours after viewing by default, unless someone saves them. A saved message lasts.',
      sourceUrl: 'https://help.snapchat.com/hc/en-gb/articles/7012334940948-When-does-Snapchat-delete-Snaps-and-Chats',
    },
    {
      q: 'Can strangers see where my child is on the Snap Map?',
      a: 'Location sharing is off by default. If it is switched on, only the friends your child chooses can see where they are. Ghost Mode hides their location from everyone, for 3 hours, 24 hours or until it is turned off.',
      sourceUrl: 'https://parents.snapchat.com/safeguards-for-teens?lang=en-GB',
    },
    {
      q: 'Can I turn off My AI on my child\'s Snapchat?',
      a: 'Through Family Centre you can restrict My AI, which stops the chatbot replying to your teen\'s chats.',
      sourceUrl: 'https://values.snap.com/news/expanding-our-in-app-parental-tools-2024',
    },
  ],
  instagram: [
    {
      q: 'What is an Instagram Teen Account?',
      a: 'Everyone under 18 is placed in one automatically: a private account, the strictest messaging and sensitive content settings, Hidden Words, a reminder after 60 minutes, and Sleep mode from 10pm to 7am. Under 16s need a parent\'s permission to make those settings less strict.',
      sourceUrl: 'https://about.fb.com/news/2024/09/instagram-teen-accounts/',
    },
    {
      q: 'Can I see who my child messages on Instagram?',
      a: 'With supervision in Family Centre you can see who your teen has messaged in the past seven days, but not the messages themselves.',
      sourceUrl: 'https://about.fb.com/news/2024/09/instagram-teen-accounts/',
    },
    {
      q: 'Who can message my child on Instagram?',
      a: 'In a Teen Account, only people your child follows or is already connected to can message them.',
      sourceUrl: 'https://about.fb.com/news/2024/09/instagram-teen-accounts/',
    },
  ],
  youtube: [
    {
      q: 'Can a child under 13 use YouTube?',
      a: 'YouTube\'s terms set 13, but they also say children of any age may use YouTube and YouTube Kids if a parent enables it. Under 13 that means YouTube Kids, or a supervised child account a parent sets up from Family Centre in the YouTube app or from Family Link.',
      sourceUrl: 'https://support.google.com/youtube/answer/10314074?hl=en-GB',
    },
    {
      q: 'Can I limit YouTube Shorts?',
      a: 'A supervising parent can set a daily time limit on scrolling Shorts. YouTube\'s European announcement says setting it to zero turns the feed off entirely.',
      sourceUrl: 'https://blog.youtube/news-and-events/new-youtube-shorts-parental-controls-europe/',
    },
    {
      q: 'Can my child comment on YouTube?',
      a: 'On a standard or teen account, yes, and they can join live chat. A supervised child account cannot post comments or use live chat, and on the Older children setting it cannot read comments either.',
      sourceUrl: 'https://support.google.com/youtube/answer/10314940?hl=en-GB',
    },
  ],
  roblox: [
    {
      q: 'Can strangers talk to my child on Roblox?',
      a: 'Chat needs an age check. Once a child has passed one, experience chat lets them talk with people of a similar age in the same game, and direct chat reaches people of a similar age who are not their friends. A linked parent account can turn each kind of chat on or off.',
      sourceUrl: 'https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview',
    },
    {
      q: 'Can I set a spending limit on Roblox?',
      a: 'Yes. Parental Controls include a monthly spending limit up to age 13, notifications for every purchase or only high spending, and daily and monthly caps on Robux your child sends to friends.',
      sourceUrl: 'https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview',
    },
    {
      q: 'Does Roblox have a screen time limit?',
      a: 'A linked parent can set a daily time limit in 15 minute steps and see a chart of the last seven days and the top games, up to age 13.',
      sourceUrl: 'https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview',
    },
  ],
  fortnite: [
    {
      q: 'What is a Fortnite Cabined Account?',
      a: 'If a player in the UK says they are under 13, Epic makes it a Cabined Account and asks for a parent\'s email. Until a parent consents they can still play, but some features are held back.',
      sourceUrl: 'https://dev.epicgames.com/documentation/en-us/fortnite/cabined-account',
    },
    {
      q: 'Why is Fortnite rated 12?',
      a: 'PEGI rates Fortnite Battle Royale 12 for moderate violence. The wider Fortnite platform carries islands made by other players, each with its own rating, up to PEGI 16 in the UK, so a content rating limit decides which ones your child can open.',
      sourceUrl: 'https://pegi.info/search-pegi?q=fortnite',
    },
    {
      q: 'Can I stop my child playing Fortnite islands rated above their age?',
      a: 'Yes. In Parental Controls, set the content rating limit, for example PEGI 7 or PEGI 12, and every island above it is locked. Your Parental Controls PIN unlocks one island at a time once you have looked at it.',
      sourceUrl: 'https://dev.epicgames.com/documentation/en-us/fortnite/iarc-overview-and-faqs-in-fortnite-creative',
    },
  ],
  'among-us': [
    {
      q: 'Can my child chat with strangers on Among Us?',
      a: 'A child account, under 13 in the UK, stays in Quick Chat mode, which uses fixed phrases only, until a parent verifies through Kids Web Services and allows Free Chat. Public lobbies do put players with people they do not know.',
      sourceUrl: 'https://innersloth.zendesk.com/hc/en-us/articles/6711536647060-How-do-I-turn-on-Free-Chat',
    },
    {
      q: 'Can my child play Among Us only with friends?',
      a: 'Yes. A host can share a lobby code, and friends join with Enter Code instead of a public lobby. Freeplay mode is the only way to play with nobody else at all.',
      sourceUrl: 'https://innersloth.zendesk.com/hc/en-us/articles/35117411022740-How-do-I-use-the-updated-Matchmaking-in-update-16-0-0',
    },
  ],
  spotify: [
    {
      q: 'Can I block explicit songs on Spotify?',
      a: 'The explicit content filter greys out and skips tracks tagged explicit. It is on automatically for managed accounts, but it depends on rights holders tagging tracks, so tags can be incomplete.',
      sourceUrl: 'https://support.spotify.com/uk/article/explicit-content/',
    },
    {
      q: 'What is a Spotify managed account?',
      a: 'An account for a listener of 13 and under, set up and controlled by a parent, on a free or Premium plan in the UK. It is private by default, with no purchases or Messages, and video and Canvas start off.',
      sourceUrl: 'https://www.spotify.com/uk/safetyandprivacy/parental-guide',
    },
    {
      q: 'Can people message my child on Spotify?',
      a: 'Spotify Messages is for users aged 16 and over. Managed accounts cannot use Messages, Jam or Blend, and cannot be searched for by others.',
      sourceUrl: 'https://www.spotify.com/uk/safetyandprivacy/parental-guide',
    },
  ],
  'brawl-stars': [
    {
      q: 'Why is Brawl Stars rated PEGI 16?',
      a: 'The UK Google Play listing shows PEGI 16 with In game purchases that include random items. PEGI says that from October 2026 digital games rated 3, 7 or 12 that sell paid random items, such as loot boxes, are being moved up to PEGI 16.',
      sourceUrl: 'https://pegi.info/news/pegi-updates-age-ratings-existing-games-paid-random-items',
    },
  ],
  'clash-royale': [
    {
      q: 'Why is Clash Royale rated PEGI 16?',
      a: 'The UK Google Play listing shows PEGI 16 with In game purchases that include random items. PEGI says that from October 2026 digital games rated 3, 7 or 12 that sell paid random items, such as loot boxes, are being moved up to PEGI 16.',
      sourceUrl: 'https://pegi.info/news/pegi-updates-age-ratings-existing-games-paid-random-items',
    },
  ],
  'ea-sports-fc': [
    {
      q: 'Why is EA SPORTS FC 27 rated 16 when FC 25 was rated 3?',
      a: 'PEGI changed its rules from June 2026: a newly rated game with paid random items gets PEGI 16 by default. PEGI says FC 27 received a 16 because it sells loot boxes, the Ultimate Team packs. FC 25 and FC 24 were rated before the change.',
      sourceUrl: 'https://pegi.info/news/pegi-expands-age-rating-criteria-interactive-risk-categories',
    },
    {
      q: 'Can I limit FC Points spending in EA SPORTS FC?',
      a: 'Yes. Turn on FC Playtime, then on the Ultimate Team main menu go to the Club tab, open the Playtime tile and set a Points Purchase Limit. EA teen accounts also start with a spending limit of zero that only a parent\'s Family account can change.',
      sourceUrl: 'https://help.ea.com/en/help/ea-sports-fc/fc-playtime-controls/',
    },
  ],
  'call-of-duty': [
    {
      q: 'Is Call of Duty voice chat recorded?',
      a: 'Yes. Activision says voice chat is monitored and recorded, using an AI system called ToxMod, to find bullying, harassment and other breaks of its Code of Conduct.',
      sourceUrl: 'https://support.activision.com/uk/en/articles/call-of-duty-voice-chat-moderation',
    },
  ],
}

export function appFaqs(slug: string): AppFaq[] {
  return APP_FAQS[slug] ?? []
}
