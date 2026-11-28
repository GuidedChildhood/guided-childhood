import type { AppEntry } from './types'

// THE APPS, one sourced entry each (plans/2026-11-19-seo-and-app-safety-pages-plan.md).
//
// Researched 22 November 2026 from each company's own terms and help pages,
// pegi.info, and the UK App Store and Google Play listings. The minimum ages,
// controls and wording for TikTok, Instagram, Snapchat, WhatsApp, YouTube,
// Roblox and Discord build on the Road to 16 evidence check of 5 November 2026
// (content/printables/road-to-16-guide/evidence-check.md).
//
// Every line starting TODO-JP-REVIEW is a point nobody could confirm at its
// source: Justin checks each before it is treated as settled. A value marked
// `checked: false` is never shown as fact; the page links to the source instead.
//
// Built from the research files by a script, then reviewed by hand. To change
// a fact, change it here and update `checked`.

export const APPS: AppEntry[] = [
  // TODO-JP-REVIEW (TikTok): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (TikTok): Manage blocked accounts: TikTok says it is not available everywhere; UK availability was not confirmed.
  // TODO-JP-REVIEW (TikTok): No PEGI database entry was found for TikTok when searching pegi.info.
  {
    "slug": "tiktok",
    "name": "TikTok",
    "maker": "TikTok",
    "category": "social",
    "whatItIs": "A short video app where an endless For You feed, chosen by TikTok's recommendation system, plays one video after another.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "TikTok sets its own minimum age at 13",
      "note": "No account under 13. TikTok's terms set higher ages for some features: 16 for direct messages, and 18 for TikTok LIVE and virtual items.",
      "sourceName": "TikTok Terms of Service (EEA and UK), clauses 4.3 and 4.4, last updated July 2026",
      "sourceUrl": "https://www.tiktok.com/legal/page/eea/terms-of-service/en",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/tiktok-videos-music-live/id835599320",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.zhiliaoapp.musically&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=TikTok",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "A feed chosen for them",
        "detail": "The For You feed is built by a recommendation system from what your child likes, comments on and watches to the end, so no two feeds are the same.",
        "sourceUrl": "https://www.tiktok.com/safety/en/tools-and-guides/guardians-guide"
      },
      {
        "title": "LIVE streams",
        "detail": "Teens can watch LIVE streams from other accounts, but TikTok does not let them host one.",
        "sourceUrl": "https://www.tiktok.com/safety/en/tools-and-guides/guardians-guide"
      },
      {
        "title": "Messages from 16",
        "detail": "Direct messages are switched off under 16. From 16, other people can send messages and message requests unless the settings say otherwise.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "title": "Comments and reuse of videos",
        "detail": "Other people can comment on posts, and from 16 others can Duet, Stitch or make stickers from a teen's videos unless this is limited.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "title": "Search",
        "detail": "Search reaches videos, hashtags and LIVE videos from anyone on TikTok, not just accounts your child follows.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      }
    ],
    "controls": [
      {
        "name": "Family Pairing",
        "what": "Links your TikTok account to your teen's so you can set and lock their safety settings; your teen can make them stricter but cannot loosen them.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Daily screen time",
        "what": "Sets how long your teen can use TikTok each day across all their devices; it is on by default at one hour for 13 to 17 year olds.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Schedule time away",
        "what": "Sets recurring times when TikTok is unavailable, and your teen can ask you for more time.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Mute push notifications",
        "what": "Notifications are muted from 9pm to 8am for 13 to 15 year olds and from 10pm to 8am for 16 and 17 year olds by default, and you can add more quiet times.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Restricted Mode",
        "what": "Limits your teen's exposure to content that may not be appropriate or comfortable for them.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Filter keywords",
        "what": "Hides videos matching words or hashtags you choose from your teen's feeds.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Discoverability, comments and direct messages",
        "what": "Lets you keep the account private, stop it being suggested to others, and choose who can comment and who can message.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      },
      {
        "name": "Manage blocked accounts",
        "what": "Lets you block accounts you do not want your teen to interact with, though TikTok says this is not available everywhere yet.",
        "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://www.tiktok.com/support/faq_detail?id=7543604781667867142",
      "steps": [
        "On your own phone, open TikTok, tap Profile, tap the Menu button, then Settings and privacy.",
        "Tap Family Pairing, tap Continue, choose Parent, tap Next and follow the steps to link with your teen's account.",
        "Set the daily screen time limit for your teen.",
        "Add Schedule time away for the hours you want TikTok off, such as overnight or school hours.",
        "Turn on Restricted Mode and add any filter keywords.",
        "Under Discoverability, keep the account private, and turn off Suggest account to others.",
        "Choose who can comment, and for a 16 or 17 year old, who can send messages."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "Manage blocked accounts: TikTok says it is not available everywhere; UK availability was not confirmed.",
      "No PEGI database entry was found for TikTok when searching pegi.info."
    ],
    "similar": [
      "instagram",
      "youtube",
      "snapchat",
      "capcut"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Instagram): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (Instagram): The Instagram terms page loaded here showed the US version; the minimum age of 13 matches the UK terms verified on 5 November 2026.
  // TODO-JP-REVIEW (Instagram): Limited Content: the steps to switch it on were not found on Meta's pages.
  // TODO-JP-REVIEW (Instagram): Instagram Map (location sharing) was left out: Meta's post says it launched in the US, and UK availability was not confirmed.
  {
    "slug": "instagram",
    "name": "Instagram",
    "maker": "Meta",
    "category": "social",
    "whatItIs": "A photo and video sharing app with a main feed, Stories, Reels, an Explore page and private messages.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Instagram sets its own minimum age at 13",
      "note": "No account under 13. Everyone under 18 is placed in a Teen Account with stricter settings, and under 16s need a parent's permission to make those settings less strict.",
      "sourceName": "Instagram Terms of Use",
      "sourceUrl": "https://help.instagram.com/581066165581870",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/instagram/id389801252",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.instagram.android&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "Parental Guidance Recommended (no age number), for user generated content",
        "url": "https://pegi.info/search-pegi?q=Instagram",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Feeds of accounts they do not follow",
        "detail": "Explore and Reels are mostly recommendations from accounts your child does not follow, ranked by signals such as their activity and how popular a post is.",
        "sourceUrl": "https://about.instagram.com/blog/announcements/instagram-ranking-explained"
      },
      {
        "title": "Messages and message requests",
        "detail": "Messaging is built in. In a Teen Account, only people your child follows or is already connected to can message them.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      },
      {
        "title": "Live video",
        "detail": "Instagram Live lets an account broadcast video to viewers. Under 16s cannot use Live without a parent's permission.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      },
      {
        "title": "Comments, tags and mentions",
        "detail": "Posts can collect comments, tags and mentions. In a Teen Account only people they follow can tag or mention them, and offensive words are filtered by Hidden Words.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      },
      {
        "title": "Protections follow the birthday entered",
        "detail": "Teen Account settings depend on the date of birth on the account. Meta says teens may lie about their age and is adding age checks in more places.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      }
    ],
    "controls": [
      {
        "name": "Teen Accounts",
        "what": "Private account, strictest messaging, strictest sensitive content setting, Hidden Words, a reminder after 60 minutes, and Sleep mode from 10pm to 7am, all on automatically for teens.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      },
      {
        "name": "Supervision in Family Centre",
        "what": "Links your account to your teen's so you can approve or refuse requests to loosen settings and see who they follow and message, without reading messages.",
        "sourceUrl": "https://familycenter.meta.com/uk/supervision/"
      },
      {
        "name": "Daily limit and sleep mode",
        "what": "Sets a daily time limit and sleep hours, and lets you choose whether your teen is reminded or blocked from Instagram when time is up.",
        "sourceUrl": "https://familycenter.meta.com/uk/supervision/"
      },
      {
        "name": "13+ content setting and Limited Content",
        "what": "Teen Accounts default to a 13+ content setting that teens cannot loosen without a parent; Limited Content is a stricter option that filters more and turns off comments.",
        "sourceUrl": "https://familycenter.meta.com/uk/resources/instagram-13-content-settings-for-teens/"
      },
      {
        "name": "Who they have messaged",
        "what": "With supervision you can see who your teen has messaged in the past seven days, but not the messages themselves.",
        "sourceUrl": "https://about.fb.com/news/2024/09/instagram-teen-accounts/"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.instagram.com/iphone-app/472274307935829",
      "steps": [
        "Make sure your child's account has their real date of birth, so it is a Teen Account.",
        "Follow your child's account from your own Instagram account, as you must follow them to send an invitation.",
        "On your profile, tap Menu at the top right, then below For families, tap Supervision.",
        "Tap Create invitation, review the information, then tap Continue.",
        "Choose Find your teen on Instagram or Send your teen a link, and ask your teen to accept within 7 days.",
        "Once supervision is on, set a daily limit and sleep hours, and look at the stricter Limited Content setting."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "The Instagram terms page loaded here showed the US version; the minimum age of 13 matches the UK terms verified on 5 November 2026.",
      "Limited Content: the steps to switch it on were not found on Meta's pages.",
      "Instagram Map (location sharing) was left out: Meta's post says it launched in the US, and UK availability was not confirmed."
    ],
    "similar": [
      "tiktok",
      "threads",
      "snapchat",
      "bereal"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Snapchat): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (Snapchat): Snap announced on 10 June 2026 a friends only Stories and Spotlight experience for under 16s, but the post does not name the countries, so it is not stated as a UK fact here.
  {
    "slug": "snapchat",
    "name": "Snapchat",
    "maker": "Snap Inc.",
    "category": "social",
    "whatItIs": "A camera and messaging app for sending photos, videos and chats to friends, with Stories, a Spotlight video feed and a map.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Snapchat sets its own minimum age at 13",
      "note": "No account under 13; Snap says it terminates accounts it finds belong to under 13s. Teens aged 13 to 17 get stricter default settings that cannot be turned off.",
      "sourceName": "Snap Inc. Terms of Service (UK)",
      "sourceUrl": "https://snap.com/en-GB/terms",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/snapchat-chat-with-friends/id447188370",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.snapchat.android&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "Parental Guidance Recommended (no age number), for user generated content",
        "url": "https://pegi.info/search-pegi?q=Snapchat",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Messages that delete themselves",
        "detail": "Snaps are deleted once everyone has viewed them, and chats are deleted 24 hours after viewing by default, unless someone saves them.",
        "sourceUrl": "https://help.snapchat.com/hc/en-gb/articles/7012334940948-When-does-Snapchat-delete-Snaps-and-Chats"
      },
      {
        "title": "Location on the Snap Map",
        "detail": "Location sharing is off by default. If it is switched on, friends your child chooses can see where they are on the map.",
        "sourceUrl": "https://parents.snapchat.com/safeguards-for-teens?lang=en-GB"
      },
      {
        "title": "Stories and Spotlight from people they do not know",
        "detail": "Part of the app serves a personalised feed of public Stories and Spotlight videos. Snap says it reviews public content and keeps some of it from being recommended to teens.",
        "sourceUrl": "https://parents.snapchat.com/safeguards-for-teens?lang=en-GB"
      },
      {
        "title": "Friend suggestions",
        "detail": "Snapchat suggests people to add. Snap says teens are kept out of search results unless there are signs of an existing connection, such as several mutual friends.",
        "sourceUrl": "https://parents.snapchat.com/safeguards-for-teens?lang=en-GB"
      },
      {
        "title": "An AI chatbot in the chat list",
        "detail": "My AI is a chatbot that sits among your child's chats and replies to messages.",
        "sourceUrl": "https://values.snap.com/news/expanding-our-in-app-parental-tools-2024"
      }
    ],
    "controls": [
      {
        "name": "Family Centre",
        "what": "Shows your teen's friends, who they have been chatting with and how they spend their time on the app, without showing the content of their messages.",
        "sourceUrl": "https://parents.snapchat.com/family-center?lang=en-GB"
      },
      {
        "name": "Share location as a family",
        "what": "Lets you request your teen's location and share yours in return.",
        "sourceUrl": "https://parents.snapchat.com/family-center?lang=en-GB"
      },
      {
        "name": "Hide Sensitive Content",
        "what": "A Family Centre setting that limits sensitive or suggestive content in Stories and Spotlight, though Snap says no filter is perfect.",
        "sourceUrl": "https://help.snapchat.com/hc/en-gb/articles/13904198624276-How-do-I-restrict-content-for-my-teen-in-Family-Centre"
      },
      {
        "name": "Restrict My AI",
        "what": "Stops My AI from replying to your teen's chats.",
        "sourceUrl": "https://values.snap.com/news/expanding-our-in-app-parental-tools-2024"
      },
      {
        "name": "Ghost Mode",
        "what": "Hides your child's location from everyone on the Snap Map, for 3 hours, 24 hours or until turned off.",
        "sourceUrl": "https://help.snapchat.com/hc/en-gb/articles/7012322854932-How-do-I-turn-on-Ghost-Mode"
      },
      {
        "name": "Teen default settings",
        "what": "Teens can only be contacted by accepted friends or phone contacts, and see an in app warning when messaging someone with no mutual friends.",
        "sourceUrl": "https://parents.snapchat.com/safeguards-for-teens?lang=en-GB"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://parents.snapchat.com/family-center?lang=en-GB",
      "steps": [
        "Download Snapchat on your own phone and sign up for an account.",
        "Swap usernames with your teen and accept each other as friends.",
        "Open Family Centre by searching for family or parent, or from Settings on your Profile page.",
        "Invite your teen to Family Centre and ask them to tap Accept.",
        "In Family Centre, open Settings at the bottom and turn on Hide Sensitive Content.",
        "With your teen, open the Snap Map, tap the gear icon and turn on Ghost Mode until turned off."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "Snap announced on 10 June 2026 a friends only Stories and Spotlight experience for under 16s, but the post does not name the countries, so it is not stated as a UK fact here."
    ],
    "similar": [
      "instagram",
      "whatsapp",
      "bereal",
      "tiktok"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (WhatsApp): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (WhatsApp): Parental controls for teens and parent managed accounts are both rolling out gradually according to WhatsApp, and UK availability was not confirmed.
  // TODO-JP-REVIEW (WhatsApp): The PEGI database entry for WhatsApp is PEGI 3 dated 2017, while the current Google Play UK listing shows Parental guidance. Both were read on 22 November 2026; the newer store label is likely the current one.
  {
    "slug": "whatsapp",
    "name": "WhatsApp",
    "maker": "Meta",
    "category": "messaging",
    "whatItIs": "A messaging app for texts, voice notes, photos, calls and group chats, linked to a phone number.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "WhatsApp sets its own minimum age at 13",
      "note": "The UK minimum age is 13. A younger child can only use WhatsApp through a parent managed account, if that is available in your country.",
      "sourceName": "WhatsApp Terms of Service (UK), effective 17 August 2026",
      "sourceUrl": "https://www.whatsapp.com/legal/terms-of-service-uk",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/whatsapp-messenger/id310633997",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.whatsapp&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 3 (an entry dated 2017 in the PEGI database)",
        "url": "https://pegi.info/search-pegi?q=WhatsApp",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Added to groups by anyone",
        "detail": "By default anyone, including people who are not in your child's contacts, can add them to a group without asking.",
        "sourceUrl": "https://faq.whatsapp.com/1131457590844955/?cms_platform=android"
      },
      {
        "title": "Messages and calls from unknown numbers",
        "detail": "People who have your child's number can message and call them. Blocking stops them, but each new number has to be blocked separately.",
        "sourceUrl": "https://faq.whatsapp.com/414631957536067/?cms_platform=web"
      },
      {
        "title": "Disappearing messages",
        "detail": "Either person in a chat can switch on messages that disappear after 24 hours, 7 days or 90 days, and in groups anyone can by default.",
        "sourceUrl": "https://faq.whatsapp.com/673193694148537"
      },
      {
        "title": "Channels and Status",
        "detail": "The Updates tab holds Status posts and Channels, where your child can browse and follow broadcasts from people and organisations they do not know.",
        "sourceUrl": "https://www.whatsapp.com/channels"
      }
    ],
    "controls": [
      {
        "name": "Parental controls for teens",
        "what": "Optional for 13 to 17 year olds: you link to your teen's account, and loosening their privacy settings needs your parent PIN. You also get alerts, such as when they add a contact, and can limit Channels, Status and Meta AI. You cannot read their messages.",
        "sourceUrl": "https://faq.whatsapp.com/1343233450663117"
      },
      {
        "name": "Parent managed accounts",
        "what": "Simplified accounts for children under 13, where only saved contacts can message or call and you approve unknown contacts and group invites.",
        "sourceUrl": "https://faq.whatsapp.com/899820539143195"
      },
      {
        "name": "Group privacy",
        "what": "Settings, Privacy, Groups lets you choose My contacts so only saved contacts can add your child to groups; others must send an invite they can refuse.",
        "sourceUrl": "https://faq.whatsapp.com/1131457590844955/?cms_platform=android"
      },
      {
        "name": "Privacy Checkup",
        "what": "One place to choose who can contact your child, who sees their profile photo, last seen and online status, and to add two step verification.",
        "sourceUrl": "https://faq.whatsapp.com/143990998547188/?cms_platform=android"
      },
      {
        "name": "Silence unknown callers and block",
        "what": "Calls from unknown numbers stop ringing, and blocking stops a person's messages, calls and status updates without telling them.",
        "sourceUrl": "https://faq.whatsapp.com/414631957536067/?cms_platform=web"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://faq.whatsapp.com/143990998547188/?cms_platform=android",
      "steps": [
        "On your child's phone, open WhatsApp, go to Settings, Privacy, then Privacy Checkup.",
        "Under Choose who can contact you, turn on Silence unknown callers.",
        "In Settings, Privacy, Groups, choose My contacts.",
        "Under Control your personal info, set profile photo, last seen and online to My contacts.",
        "Under Add more privacy to your chats, check the default message timer is off.",
        "Under Add more protection to your account, set up two step verification.",
        "If Parental controls appears in Settings, link it to your own account and create a parent PIN."
      ]
    },
    "underAge": {
      "text": "Children under 13 can use WhatsApp only through a parent managed account, which focuses on messaging and calling with contacts a parent approves. WhatsApp says these accounts are rolling out gradually and may not be available in your region.",
      "sourceUrl": "https://faq.whatsapp.com/899820539143195"
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "Parental controls for teens and parent managed accounts are both rolling out gradually according to WhatsApp, and UK availability was not confirmed.",
      "The PEGI database entry for WhatsApp is PEGI 3 dated 2017, while the current Google Play UK listing shows Parental guidance. Both were read on 22 November 2026; the newer store label is likely the current one."
    ],
    "similar": [
      "snapchat",
      "discord",
      "instagram"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (YouTube): Whether the zero minute Shorts setting is live in the UK. YouTube's January 2026 post said zero was coming soon, and its April 2026 post says zero turns the feed off across Europe without naming the UK.
  // TODO-JP-REVIEW (YouTube): The UK version of the YouTube terms was not opened separately; the 13 and parental enablement wording is from youtube.com/t/terms.
  {
    "slug": "youtube",
    "name": "YouTube",
    "maker": "Google",
    "category": "video",
    "whatItIs": "A video site and app where anyone can watch, upload and comment on videos, including a scrolling feed of short videos called Shorts.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "YouTube sets its own minimum age at 13",
      "note": "YouTube's terms say you must be at least 13. They also say children of all ages may use YouTube and YouTube Kids if a parent or legal guardian enables it. Under 13, that means YouTube Kids, or YouTube itself through a supervised child account a parent sets up from Family Centre in the YouTube app or from Family Link.",
      "sourceName": "YouTube Terms of Service",
      "sourceUrl": "https://www.youtube.com/t/terms",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/youtube/id544007664",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. Users interact, In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.google.android.youtube",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=YouTube",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Autoplay starts the next video",
        "detail": "When autoplay is on, a related video plays automatically after the one being watched ends. YouTube turns it off by default for users aged 13 to 17, and it is off by default on child accounts, but a teen can switch it back on unless a supervising parent has turned it off.",
        "sourceUrl": "https://support.google.com/youtube/answer/6327615?hl=en-GB"
      },
      {
        "title": "Shorts is a scrolling feed",
        "detail": "Shorts are short videos shown one after another in a feed that loads more as you scroll. Parents of supervised accounts can set a limit on the time spent scrolling it.",
        "sourceUrl": "https://blog.youtube/news-and-events/updates-youtube-supervised-accounts-teens/"
      },
      {
        "title": "Comments and live chat with other viewers",
        "detail": "On a standard or teen account a child can read and write comments and join live chat during streams. Supervised child accounts cannot post comments or use live chat, and on the Older children setting they cannot read comments either.",
        "sourceUrl": "https://support.google.com/youtube/answer/10314940?hl=en-GB"
      },
      {
        "title": "Their own public channel",
        "detail": "A standard or teen account can create a channel, upload videos and Shorts, and go live. None of these are available on a supervised child account.",
        "sourceUrl": "https://support.google.com/youtube/answer/10314940?hl=en-GB"
      },
      {
        "title": "Paid extras inside videos",
        "detail": "Viewers can pay for Super Chat, channel memberships and creator merchandise. These purchases are switched off on supervised child accounts.",
        "sourceUrl": "https://support.google.com/youtube/answer/10314940?hl=en-GB"
      }
    ],
    "controls": [
      {
        "name": "Supervised child account",
        "what": "A parent managed account for a child under 13 that limits what can be watched to the content setting the parent picks, with comments, uploads, live chat and purchases switched off.",
        "sourceUrl": "https://support.google.com/youtube/answer/10314074?hl=en-GB"
      },
      {
        "name": "Content settings (Older children, Teens, Older teens)",
        "what": "For a supervised child account the parent chooses Older children (generally 9 and over), Teens (generally 13 and over) or Older teens (generally 16 and over).",
        "sourceUrl": "https://support.google.com/youtube/answer/10315420?hl=en-GB"
      },
      {
        "name": "Supervised teen account",
        "what": "An optional link between a parent and a teen's account; teens are placed by age in Teens (13 to 15) or Older teens (16 and 17), and the parent manages screen time limits and a Shorts feed limit through Family Centre.",
        "sourceUrl": "https://support.google.com/youtube/answer/10315420?hl=en-GB"
      },
      {
        "name": "Shorts feed limit",
        "what": "Lets a supervising parent set a daily time limit on scrolling Shorts; YouTube's European announcement says setting it to zero turns the feed off entirely.",
        "sourceUrl": "https://blog.youtube/news-and-events/new-youtube-shorts-parental-controls-europe/"
      },
      {
        "name": "Bedtime and Take a Break reminders",
        "what": "Reminders that are on by default for teen accounts, and that parents of supervised accounts can customise.",
        "sourceUrl": "https://www.youtube.com/intl/en-GB/myfamily"
      },
      {
        "name": "Block channel for children",
        "what": "From a channel page, a linked parent can block that channel for a supervised child.",
        "sourceUrl": "https://support.google.com/youtube/answer/13887963?hl=en-GB"
      },
      {
        "name": "Restricted Mode",
        "what": "An optional filter that screens out potentially mature videos and hides comments, set per browser, device or profile. Through Family Link it can only be locked on for a child who is not eligible for a supervised experience, so a supervised child uses content settings instead.",
        "sourceUrl": "https://support.google.com/youtube/answer/174084?hl=en-GB"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://support.google.com/youtube/answer/10314074?hl=en-GB",
      "steps": [
        "For a child under 13, open the YouTube app signed in as yourself, go to Settings, then Family Centre, and choose add a child account. Or open Family Link, select your child, then Controls, YouTube, YouTube and YouTube Music.",
        "Pick the content setting that fits their age: Older children (generally 9 and over), Teens (generally 13 and over) or Older teens (generally 16 and over).",
        "Check autoplay is off on the child account. YouTube says child accounts have it off by default.",
        "In Family Centre, set a daily Shorts feed limit and custom Bedtime and Take a Break reminders.",
        "If a channel is not right for them, open its page while signed in as the parent, tap More, then Block channel for children.",
        "For a child of 13 or over, link a supervised teen account so you can manage screen time and the Shorts limit from Family Centre.",
        "Use the Who's watching page so your child watches on their own account, not yours."
      ]
    },
    "underAge": {
      "text": "YouTube Kids, or a supervised child account on YouTube set up by a parent. Google describes supervised accounts as the way a child moves from YouTube Kids to YouTube with parental controls.",
      "sourceUrl": "https://support.google.com/youtubekids/answer/10495678?hl=en-GB"
    },
    "uncertain": [
      "Whether the zero minute Shorts setting is live in the UK. YouTube's January 2026 post said zero was coming soon, and its April 2026 post says zero turns the feed off across Europe without naming the UK.",
      "The UK version of the YouTube terms was not opened separately; the 13 and parental enablement wording is from youtube.com/t/terms."
    ],
    "similar": [
      "youtube-kids",
      "tiktok",
      "twitch",
      "netflix"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (YouTube Kids): Google does not state a single age at which to move from YouTube Kids to YouTube; the move on guidance is inferred from Google's description of supervised accounts and their content settings, not stated as an age.
  // TODO-JP-REVIEW (YouTube Kids): Block steps are for the app signed in with a Google Account; blocks made while signed in do not apply when signed out (as Google states).
  {
    "slug": "youtube-kids",
    "name": "YouTube Kids",
    "maker": "Google",
    "category": "video",
    "whatItIs": "A separate YouTube app for children, with videos picked for younger viewers and controls a parent sets behind a passcode.",
    "minAge": {
      "value": null,
      "label": "None set, built up to 12",
      "gapAge": 0,
      "maxAge": 12,
      "rule": "YouTube Kids is built for children up to 12",
      "note": "There is no minimum age. YouTube Kids has content settings for Preschool (4 and under), Younger (5 to 8) and Older (9 to 12), chosen by a parent. Google does not give one age to move on. It describes a supervised YouTube account as the way a child moves from YouTube Kids to YouTube with parental controls, and its supervised content settings start at Older children, generally 9 and over.",
      "sourceName": "YouTube Kids Help: Important info for parents",
      "sourceUrl": "https://support.google.com/youtubekids/answer/6130561?hl=en-GB",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "4+ (listed as Made for Ages 0 to 5)",
        "url": "https://apps.apple.com/gb/app/youtube-kids/id936971630",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 3",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.google.android.apps.youtube.kids",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=YouTube",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Videos are picked by automated systems",
        "detail": "Google says it cannot manually review every video and no automated system is perfect, so a child may find a video a parent would not choose.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6130561?hl=en-GB"
      },
      {
        "title": "Search opens a wide library",
        "detail": "With Search on, a child can search for videos. Turning it off limits them to videos and channels verified by YouTube Kids.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6162907?hl=en-GB"
      },
      {
        "title": "Autoplay plays the next video",
        "detail": "Videos can play on automatically, which is why there is a parent setting to disable autoplay.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      },
      {
        "title": "Paid adverts",
        "detail": "Google allows limited paid adverts in the app so that it can be free.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6130561?hl=en-GB"
      },
      {
        "title": "Recommendations follow what they watch",
        "detail": "What a child watches and searches for is used to recommend more videos unless a parent pauses watch and search history.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      }
    ],
    "controls": [
      {
        "name": "Content settings",
        "what": "Choose Preschool, Younger, Older, or Approve content yourself for each child's profile.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      },
      {
        "name": "Approved content only",
        "what": "The child can only watch videos, channels and collections the parent has picked, and cannot search.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      },
      {
        "name": "Search on or off",
        "what": "With Search off the child cannot search and only sees videos and channels verified by YouTube Kids.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6162907?hl=en-GB"
      },
      {
        "name": "Timer",
        "what": "Sets a time limit; when it runs out the child sees a Time's up message and the app locks.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6130558?hl=en-GB"
      },
      {
        "name": "Block a video or channel",
        "what": "Hides a video or a whole channel from the child; it does not block reuploads on other channels.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/7178746?hl=en-GB"
      },
      {
        "name": "Disable autoplay",
        "what": "Stops the child from turning autoplay on.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      },
      {
        "name": "Pause watch and search history, custom passcode",
        "what": "Pausing history stops new views and searches shaping recommendations, and a custom passcode protects the settings.",
        "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://support.google.com/youtubekids/answer/6172308?hl=en-GB",
      "steps": [
        "Open YouTube Kids on your child's device, tap Settings, complete the sum or enter your custom passcode, then select your child's profile and enter your password.",
        "Choose a content setting: Preschool (4 and under), Younger (5 to 8), Older (9 to 12), or Approve content yourself for the tightest setup.",
        "If you choose Approve content yourself, tap Select, add each collection, channel or video you are happy with, then tap Done.",
        "If you use an age setting instead, switch Search off so only videos and channels verified by YouTube Kids are available.",
        "Turn on Disable autoplay so videos do not run on.",
        "Set a timer from Settings: tap Set timer, choose the time with the slider, then Start timer.",
        "Block any video or channel you do not want by tapping More beside it, then Block."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google does not state a single age at which to move from YouTube Kids to YouTube; the move on guidance is inferred from Google's description of supervised accounts and their content settings, not stated as an age.",
      "Block steps are for the app signed in with a Google Account; blocks made while signed in do not apply when signed out (as Google states)."
    ],
    "similar": [
      "youtube",
      "netflix",
      "spotify"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Roblox): Roblox Help pages were read through the help centre's own article data, because the web pages block automated reading. The text is Roblox's own.
  // TODO-JP-REVIEW (Roblox): Roblox says it will move to IARC ratings (PEGI in the UK) for games, starting in Australia in January 2027. The UK date is not given.
  // TODO-JP-REVIEW (Roblox): Parent mode is described by Roblox as rolling out gradually and may not be available on every account.
  {
    "slug": "roblox",
    "name": "Roblox",
    "maker": "Roblox Corporation",
    "category": "gaming",
    "whatItIs": "A platform of millions of games made by its own users, where players build, play and chat as avatars.",
    "minAge": {
      "value": 5,
      "label": "5, set up by a parent",
      "gapAge": 5,
      "rule": "Roblox allows accounts from 5, set up with a parent",
      "note": "Roblox says users aged 5 and older may create an account, but a child under 18 must create it with a parent, who accepts the terms for them. Some features can only be switched on by a parent through Parental Controls, and chat needs an age check. Accounts are sorted by age into Roblox Kids (5 to 8), Roblox Select (9 to 15) and Roblox (16 and over). Under 9s need a parent's consent to turn on experience chat, and under 13s need it for direct chat.",
      "sourceName": "Roblox Terms of Use, effective 1 November 2026, and Roblox Help, Parental Controls Overview",
      "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/roblox/id431946152",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance",
        "url": "https://play.google.com/store/apps/details?id=com.roblox.client&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "Parental guidance recommended, In game purchases",
        "url": "https://pegi.info/search-pegi?q=roblox",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Chat with players they have not met",
        "detail": "Once a child has passed an age check, experience chat lets them talk with people of a similar age in the same game, and direct chat reaches people of a similar age who are not their friends.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "title": "A currency bought with real money",
        "detail": "Robux is bought with real money and spent inside games. A child can also send Robux to trusted friends, within limits a parent can set.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "title": "Games made by other users",
        "detail": "Most of Roblox is made by its users and changes all the time. Each game carries a content maturity label from Minimal to Restricted, based on a questionnaire the creator fills in.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "title": "Trusted friends open more chat",
        "detail": "A trusted friend may unlock chat across age groups and chat without filters, depending on age and region. Under 13s need a parent's permission to add one.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "title": "Chat built into individual games",
        "detail": "Roblox's chat settings cover experience chat and direct chat, not chat features a game's creator has added themselves.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      }
    ],
    "controls": [
      {
        "name": "Linked parent account",
        "what": "Your own Roblox account, linked to your child's, so you can manage their settings from your phone and get emails about their activity.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428321333140-Parents-How-to-Link-Your-Account"
      },
      {
        "name": "Parent mode",
        "what": "Approve requests and change most settings on your child's own device without a Roblox account of your own, where it has rolled out.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428321333140-Parents-How-to-Link-Your-Account"
      },
      {
        "name": "Content maturity",
        "what": "A slider that limits games to Minimal, Mild, Moderate or Restricted, plus lists of blocked and allowed games.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "name": "Communication",
        "what": "Turn experience chat and direct chat on or off, and choose whether friends chat is open to all friends, trusted friends or no one.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "name": "Spending restrictions",
        "what": "A monthly spending limit up to age 13 and notifications for every purchase or only high spending.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "name": "Robux transfers",
        "what": "Daily and monthly caps on Robux your child sends, and a choice to approve every transfer.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      },
      {
        "name": "Screen time",
        "what": "A daily time limit in 15 minute steps, with a chart of the last seven days and top games, managed by a parent up to age 13.",
        "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/30428310121620-Parental-Controls-Overview",
      "steps": [
        "On your child's account, open Settings, then Parental controls, then Add parent, verify your age with ID or a card, and select Agree to link the accounts.",
        "Check the birthday on your child's account is right, because it decides which games and features they get. You can correct it through your linked parent account.",
        "Open Settings, Parental controls, your child's account, then Content restrictions, and set Content maturity to Minimal or Mild.",
        "In Communication, leave Experience chat and Direct chat off until you are ready, and set Friends chat to Trusted friends or No one.",
        "In Spending restrictions, set a Monthly spending limit (it can be 0) and choose All transactions for spending notifications.",
        "Under Robux, select Approvals and choose Always ask, so you approve every transfer.",
        "Under Screen time, select Manage and choose a daily limit."
      ]
    },
    "underAge": {
      "text": "Roblox Kids is the account type for children aged 5 to 8: games rated Minimal or Mild only, and chat off by default, switched on only through a linked parent account for a child who has passed an age check.",
      "sourceUrl": "https://en.help.roblox.com/hc/en-us/articles/48163847200532-What-are-Roblox-Kids-and-Roblox-Select"
    },
    "uncertain": [
      "Roblox Help pages were read through the help centre's own article data, because the web pages block automated reading. The text is Roblox's own.",
      "Roblox says it will move to IARC ratings (PEGI in the UK) for games, starting in Australia in January 2027. The UK date is not given.",
      "Parent mode is described by Roblox as rolling out gradually and may not be available on every account."
    ],
    "similar": [
      "minecraft",
      "fortnite",
      "among-us",
      "discord"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Minecraft): Minecraft's end user licence agreement did not load for reading, so it is not quoted. The age position comes from the Minecraft Parents' Guide and Microsoft's UK age list (13).
  // TODO-JP-REVIEW (Minecraft): help.minecraft.net articles were read through the help centre's article data under the same article numbers, because the pages render by script.
  // TODO-JP-REVIEW (Minecraft): minAge.value is null on purpose: Minecraft publishes no minimum age, only the Microsoft child account rule.
  {
    "slug": "minecraft",
    "name": "Minecraft",
    "maker": "Mojang Studios (Microsoft)",
    "category": "gaming",
    "whatItIs": "A block building game where players explore, mine and build worlds, alone or online with others.",
    "minAge": {
      "value": null,
      "label": "None set",
      "gapAge": 13,
      "rule": "Minecraft keeps under 13s on a child account a parent manages",
      "note": "Minecraft sets no minimum age of its own. You need a Microsoft account to buy and play, and in the UK a child under 13 must have a child account managed by a parent in a Microsoft family group. Child accounts have online multiplayer and chat off by default.",
      "sourceName": "Minecraft Parents' Guide, and Microsoft Support, statutory age limits for children",
      "sourceUrl": "https://www.minecraft.net/en-us/article/parents--guide-minecraft",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "9+",
        "url": "https://apps.apple.com/gb/app/minecraft-dream-it-build-it/id479516143",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 7",
        "url": "https://play.google.com/store/apps/details?id=com.mojang.minecraftpe&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 7, Violence, Fear, In game purchases",
        "url": "https://pegi.info/search-pegi?q=Minecraft",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Online play and chat with others",
        "detail": "Players can join multiplayer games, Realms and servers and chat with the people there, including players on other platforms when cross network play is allowed.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/34348636148877"
      },
      {
        "title": "A currency bought with real money",
        "detail": "Minecoins buy worlds and add ons in the Minecraft Marketplace, some of which cost money. PEGI lists In game purchases.",
        "sourceUrl": "https://www.minecraft.net/en-us/article/parents--guide-minecraft"
      },
      {
        "title": "Servers and mods run by other people",
        "detail": "Players can join third party servers, and the Java Edition supports mods that are not made by Mojang, some of which Mojang says are not suitable for younger players.",
        "sourceUrl": "https://www.minecraft.net/en-us/article/parents--guide-minecraft"
      },
      {
        "title": "Sharing creations and profiles",
        "detail": "Settings decide whether a child can see and post to Realms Stories and screenshot galleries, and who can see their friends list.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/35235782484237"
      }
    ],
    "controls": [
      {
        "name": "Microsoft family group",
        "what": "Links a child account to a parent account so only the parent can change the child's settings.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/43411035215373"
      },
      {
        "name": "Join multiplayer games",
        "what": "Allow or block your child joining multiplayer games, Realms and other servers.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/34348636148877"
      },
      {
        "name": "Manage online communication",
        "what": "Choose who your child can chat with in multiplayer games; Friends limits chat to their friends list and Block hides chat.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/35235782484237"
      },
      {
        "name": "Add friends and follow others",
        "what": "Decide whether your child can find other players and add them as friends.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/35235782484237"
      },
      {
        "name": "Cross network play",
        "what": "Allow or block play with people on other platforms such as PlayStation and Nintendo.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/34348636148877"
      },
      {
        "name": "Ask to buy",
        "what": "Sends you each purchase your child wants to make so you can approve it, alongside an account balance you top up.",
        "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/34927628528397"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.minecraft.net/hc/en-us/articles/43411035215373",
      "steps": [
        "Create a Microsoft family group on the Microsoft Family Safety website or in the Xbox Family Settings app, and add or create your child's account.",
        "In the Xbox Family Settings app, tap your child's tile, then the Settings cog in the top right.",
        "Under online safety, leave join multiplayer games set to Block until you are ready for online play.",
        "When you allow multiplayer, set manage online communication to Friends, and decide whether they can add friends without you.",
        "In Spending, turn on Ask to buy so purchases come to you for approval.",
        "Ask your child to sign out of Minecraft and restart it so the new settings take effect."
      ]
    },
    "underAge": {
      "text": "There is no separate children's version. A child account starts with online play and chat off, so a younger child can play offline, and the Peaceful difficulty setting stops hostile mobs appearing.",
      "sourceUrl": "https://www.minecraft.net/en-us/article/parents--guide-minecraft"
    },
    "uncertain": [
      "Minecraft's end user licence agreement did not load for reading, so it is not quoted. The age position comes from the Minecraft Parents' Guide and Microsoft's UK age list (13).",
      "help.minecraft.net articles were read through the help centre's article data under the same article numbers, because the pages render by script.",
      "minAge.value is null on purpose: Minecraft publishes no minimum age, only the Microsoft child account rule."
    ],
    "similar": [
      "roblox",
      "fortnite",
      "among-us"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Fortnite): Epic's own help and safety pages (safety.epicgames.com and epicgames.com/help) blocked every attempt to read them. The voice chat, text chat and purchase controls, and setup step 5, are as Epic's pages were summarised by a search engine, not read at the page.
  // TODO-JP-REVIEW (Fortnite): Epic's terms of service could not be opened, so no minimum age from the terms is given. minAge.value is null on purpose.
  // TODO-JP-REVIEW (Fortnite): Which features a Cabined Account holds back (search summaries of Epic's pages say voice chat, free text chat and real money purchases) was not confirmed at an Epic page that could be opened.
  // TODO-JP-REVIEW (Fortnite): Epic's IARC page says parents can also turn off the ability to build games in Creative mode, but in future tense from launch. Not confirmed as live, so left out.
  // TODO-JP-REVIEW (Fortnite): Adult verification methods for the UK were read from Epic's parental consent page: card (no charge outside the US), ID scan and face scan.
  {
    "slug": "fortnite",
    "name": "Fortnite",
    "maker": "Epic Games",
    "category": "gaming",
    "whatItIs": "An online game platform with Epic's own modes, such as the Battle Royale shooter, and islands made by other players.",
    "minAge": {
      "value": null,
      "label": "None set, Cabined under 13",
      "gapAge": 13,
      "rule": "Fortnite puts under 13s on a Cabined Account until a parent consents",
      "note": "If a player says they are under 13, or under their country's age of digital consent if that is higher, Epic makes it a Cabined Account and asks for a parent's email. Until a parent consents, they can still play but cannot use certain features. In the UK the threshold is 13.",
      "sourceName": "Epic Developer Community, Cabined Account",
      "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/cabined-account",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/fortnite/id6483539426",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance",
        "url": "https://play.google.com/store/apps/details?id=com.epicgames.fortnite&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "Parental guidance recommended, In game purchases (Fortnite platform); Fortnite Battle Royale PEGI 12, Violence, In game purchases",
        "url": "https://pegi.info/search-pegi?q=fortnite",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Voice and text chat with other players",
        "detail": "Voice chat lets players talk to each other during a game. A Cabined Account holds back certain features until a parent consents.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/voice-chat"
      },
      {
        "title": "A currency for buying items",
        "detail": "V Bucks is an in game currency used for Battle Passes and cosmetics, and PEGI labels Fortnite with In game purchases.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/v-bucks"
      },
      {
        "title": "Islands made by other players",
        "detail": "Fortnite includes islands built by players. Each must carry an age rating, and in the UK islands can be rated up to PEGI 16.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/iarc-overview-and-faqs-in-fortnite-creative"
      },
      {
        "title": "Combat in the main mode",
        "detail": "PEGI rates Fortnite Battle Royale 12 for moderate violence.",
        "sourceUrl": "https://pegi.info/search-pegi?q=fortnite"
      }
    ],
    "controls": [
      {
        "name": "Cabined Account",
        "what": "A limited account for players under 13 in the UK, with some features held back until a parent gives consent.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/cabined-account"
      },
      {
        "name": "Parental Controls PIN",
        "what": "A PIN a parent uses to unlock a single island that is above the rating limit.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/iarc-overview-and-faqs-in-fortnite-creative"
      },
      {
        "name": "Content rating limit",
        "what": "Blocks every island above the age rating you choose, with a lock icon on any island above it.",
        "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/iarc-overview-and-faqs-in-fortnite-creative"
      },
      {
        "name": "Voice chat and text chat settings",
        "what": "Choose who your child can talk to by voice and text, or switch chat off.",
        "sourceUrl": "https://safety.epicgames.com/en-US/parental-controls"
      },
      {
        "name": "Purchase settings",
        "what": "Settings for real money purchases on the account.",
        "sourceUrl": "https://safety.epicgames.com/en-US/parental-controls"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://dev.epicgames.com/documentation/en-us/fortnite/iarc-overview-and-faqs-in-fortnite-creative",
      "steps": [
        "When your child signs up, make sure the birthday is real. Under 13 in the UK, Epic makes a Cabined Account and asks for your email.",
        "Use the link in Epic's email to verify you are an adult (in the UK by card check, ID scan or face scan) and finish setting up the account.",
        "Open Parental Controls in Fortnite, or sign in to the Epic Account Portal, and set your Parental Controls PIN.",
        "In Parental Controls, set the content rating limit, for example PEGI 7 or PEGI 12, so islands above it are locked. Unlock a single island with your PIN when you have looked at it.",
        "On the same Parental Controls page, check who can voice chat and text chat with your child, and the purchase settings."
      ]
    },
    "underAge": {
      "text": "There is no separate children's app. A rating limit of PEGI 7 keeps a child to lower rated islands, such as LEGO Fortnite Odyssey, which PEGI rates 7.",
      "sourceUrl": "https://pegi.info/search-pegi?q=fortnite"
    },
    "uncertain": [
      "Epic's own help and safety pages (safety.epicgames.com and epicgames.com/help) blocked every attempt to read them. The voice chat, text chat and purchase controls, and setup step 5, are as Epic's pages were summarised by a search engine, not read at the page.",
      "Epic's terms of service could not be opened, so no minimum age from the terms is given. minAge.value is null on purpose.",
      "Which features a Cabined Account holds back (search summaries of Epic's pages say voice chat, free text chat and real money purchases) was not confirmed at an Epic page that could be opened.",
      "Epic's IARC page says parents can also turn off the ability to build games in Creative mode, but in future tense from launch. Not confirmed as live, so left out.",
      "Adult verification methods for the UK were read from Epic's parental consent page: card (no charge outside the US), ID scan and face scan."
    ],
    "similar": [
      "roblox",
      "minecraft",
      "among-us",
      "twitch"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Discord): Discord's teen safety page carries its own note saying it is out of date, and says the global age assurance rollout was delayed to the second half of 2026. The UK teen by default statement is from that page and was not reconfirmed elsewhere.
  // TODO-JP-REVIEW (Discord): support.discord.com returned an error, so setting names come from Discord's own safety pages on discord.com, not the help centre; menu names may differ slightly in the current app.
  {
    "slug": "discord",
    "name": "Discord",
    "maker": "Discord Inc.",
    "category": "messaging",
    "whatItIs": "A chat app built around servers, group spaces where people talk by text, voice and video, often around games.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Discord sets its own minimum age at 13",
      "note": "Discord's terms set a minimum age of 13. There is no version for younger children.",
      "sourceName": "Discord Terms of Service (29 September 2025)",
      "sourceUrl": "https://discord.com/terms",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/discord-talk-play-hang-out/id985746746",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. Users interact, In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.discord",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=Discord",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Servers full of people they do not know",
        "detail": "Discord is built for friend groups and for worldwide communities, so one server can mix friends with thousands of strangers.",
        "sourceUrl": "https://apps.apple.com/gb/app/discord-talk-play-hang-out/id985746746"
      },
      {
        "title": "Direct messages and friend requests",
        "detail": "Members of a shared server can send direct messages and friend requests unless the settings are changed.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "title": "Voice, video and screen streaming",
        "detail": "Users drop in and out of voice and video chats and stream their screen to others without needing to call.",
        "sourceUrl": "https://apps.apple.com/gb/app/discord-talk-play-hang-out/id985746746"
      },
      {
        "title": "Images and video shared in chat",
        "detail": "Sensitive images and videos can be shared in messages; for teens Discord blurs them in DMs from friends and blocks them from non friends by default.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "title": "Purchases",
        "detail": "Discord sells Nitro subscriptions and Shop items; Family Center shows a parent the week's purchases.",
        "sourceUrl": "https://discord.com/safety/family-center-is-getting-an-update"
      }
    ],
    "controls": [
      {
        "name": "Family Center",
        "what": "Links a parent and teen so the parent sees seven days of activity, including purchases, call minutes and the top users and servers messaged or called, but not message contents, and can manage the sensitive content filter and who can message the teen.",
        "sourceUrl": "https://discord.com/safety/family-center-is-getting-an-update"
      },
      {
        "name": "Sensitive media filter",
        "what": "Blurs or blocks sensitive images and video, set in Content and Social settings.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "name": "Allow direct messages from server members",
        "what": "Switching this off in Privacy and Safety stops people in shared servers messaging your child directly.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "name": "Friend request settings",
        "what": "Choose whether Everyone, Friends of friends or Server members can send a friend request; untick all three to stop them.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "name": "Direct message spam filter",
        "what": "Filters messages from non friends by default, and can be set to filter all direct messages.",
        "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord"
      },
      {
        "name": "Teen default settings",
        "what": "Discord says it launched teen by default settings in the UK, where safety settings such as blurred sensitive content and message requests stay on unless a user is confirmed as an adult.",
        "sourceUrl": "https://discord.com/safety/how-discord-is-building-safer-experiences-for-teens"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://discord.com/safety/360044153831-helping-your-teen-stay-safe-on-discord",
      "steps": [
        "You and your teen each open Discord, go to User Settings, then Family Center, and follow the steps to link your accounts.",
        "On their account, go to User Settings, Privacy and Safety, and under Server Privacy Defaults switch off Allow direct messages from server members, applying it to existing servers too.",
        "In User Settings, Friend Requests, untick Everyone so only Friends of friends or Server members can send requests, or untick all three.",
        "In Content and Social, keep sensitive media blurred or blocked.",
        "Set the direct message spam filter to Filter all direct messages.",
        "Show them how to block someone (right click or long press their name, Block) and how to report a message."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Discord's teen safety page carries its own note saying it is out of date, and says the global age assurance rollout was delayed to the second half of 2026. The UK teen by default statement is from that page and was not reconfirmed elsewhere.",
      "support.discord.com returned an error, so setting names come from Discord's own safety pages on discord.com, not the help centre; menu names may differ slightly in the current app."
    ],
    "similar": [
      "whatsapp",
      "roblox",
      "twitch",
      "minecraft"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Pinterest): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  {
    "slug": "pinterest",
    "name": "Pinterest",
    "maker": "Pinterest",
    "category": "social",
    "whatItIs": "A visual search and ideas app where people save images and videos, called Pins, to boards.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Pinterest sets its own minimum age at 13",
      "note": "No account under 13. Pinterest's terms say 13 to 18 year olds may only use it with the permission of a parent or legal guardian.",
      "sourceName": "Pinterest Terms of Service (UK), effective 12 November 2026",
      "sourceUrl": "https://policy.pinterest.com/en-gb/terms-of-service",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/pinterest-lifestyle-ideas/id429047995",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.pinterest&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "Parental Guidance Recommended (no age number), as it may contain sex references",
        "url": "https://pegi.info/search-pegi?q=Pinterest",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Recommendations based on activity",
        "detail": "What your child sees is mainly shaped by how they use Pinterest, the topics it thinks they like, and what similar users like.",
        "sourceUrl": "https://policy.pinterest.com/en-gb/terms-of-service"
      },
      {
        "title": "Messages",
        "detail": "Under 16s can message mutual followers only. As they get older, the settings open up to let them contact more people.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      },
      {
        "title": "Group boards",
        "detail": "Under 16s can collaborate on group boards with people they know, and may receive message requests from group board collaborators.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/privacy-for-parents-of-teens-on-pinterest"
      },
      {
        "title": "Public comments",
        "detail": "Comments your child leaves on other people's Pins can be seen by others.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      },
      {
        "title": "A public profile from 16",
        "detail": "Profiles are private for all under 18s, but from 16 a teen can choose to make theirs public if no parental passcode is set.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      }
    ],
    "controls": [
      {
        "name": "Parental passcode",
        "what": "A four digit code that locks email, password, profile visibility, messaging, mentions, comments and some recommendation settings until your teen turns 18.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/manage-a-parental-passcode"
      },
      {
        "name": "Private profile by default",
        "what": "Teen accounts are private, so only your child and people they invite to follow them see their Pins and boards, and 13 to 15 year olds cannot go public.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      },
      {
        "name": "Comments off by default",
        "what": "Comments are turned off on Pins your child creates until they turn 18.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      },
      {
        "name": "No ad personalisation",
        "what": "Under 18s in the UK and EU are opted out of all ad personalisation settings.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      },
      {
        "name": "Block and report",
        "what": "Your child can block people from following, messaging or interacting with their Pins, and report anything that does not seem right.",
        "sourceUrl": "https://help.pinterest.com/en-gb/article/teen-safety-options"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.pinterest.com/en-gb/article/manage-a-parental-passcode",
      "steps": [
        "Open the Pinterest app and log in to your teen's account.",
        "Tap their profile picture at the bottom right, then the profile picture at the top left.",
        "Tap Account management, then Parental passcode.",
        "Create a four digit passcode and add your own email address.",
        "Open the confirmation email from Pinterest and tap the link within 24 hours.",
        "Keep the profile private and leave messaging and comments as they are, now locked by the passcode."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age."
    ],
    "similar": [
      "instagram",
      "tiktok",
      "youtube"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (BeReal): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (BeReal): BeReal's help centre sat behind a bot check and could not be opened, so exact menu names for the setup steps were not confirmed. The steps come from BeReal's child safety page and privacy policy.
  // TODO-JP-REVIEW (BeReal): No parental control or family linking tool was found on BeReal's own pages.
  // TODO-JP-REVIEW (BeReal): Whether the friends of friends and discovery feed options are offered in the UK was not confirmed; BeReal's privacy policy describes them without naming regions.
  // TODO-JP-REVIEW (BeReal): No PEGI database entry was found for BeReal when searching pegi.info.
  {
    "slug": "bereal",
    "name": "BeReal",
    "maker": "BeReal",
    "category": "social",
    "whatItIs": "A photo app that asks everyone to post one front and back camera photo at the same random moment each day.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "BeReal sets its own minimum age at 13",
      "note": "No account under 13. BeReal's terms add that where a child is under their country's age of consent, a parent or guardian may also need to agree.",
      "sourceName": "BeReal Terms of Service, last updated 11 September 2026",
      "sourceUrl": "https://bereal.com/terms",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/bereal-photos-friends-daily/id1459645446",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.bereal.ft&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=BeReal",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "A daily nudge to post now",
        "detail": "Every day a notification opens a random two minute window to post, which is the core of how the app works.",
        "sourceUrl": "https://bereal.com/"
      },
      {
        "title": "Two cameras at once",
        "detail": "Each post uses the front and back cameras together, so it shows your child and whatever and whoever is around them.",
        "sourceUrl": "https://bereal.com/"
      },
      {
        "title": "Audience can widen",
        "detail": "Posts go to friends, but each time your child posts they can choose to let friends of friends see it, or publish it to BeReal's discovery feed.",
        "sourceUrl": "https://bereal.com/privacy"
      },
      {
        "title": "Location on posts",
        "detail": "A location can be attached to a post. For under 18s it is approximate by default and only shared if they choose.",
        "sourceUrl": "https://bereal.com/privacy"
      },
      {
        "title": "Friend suggestions from contacts",
        "detail": "BeReal suggests friends from the address book if allowed, and can also suggest people using contact details other users have shared.",
        "sourceUrl": "https://bereal.com/privacy"
      }
    ],
    "controls": [
      {
        "name": "Private account by default",
        "what": "BeReal says a child's account is private, has no public profile, and can only be found by someone who already knows their phone number or username.",
        "sourceUrl": "https://bereal.com/child-safety"
      },
      {
        "name": "Audience choice",
        "what": "Each time your child posts they choose whether friends only, friends of friends, or the discovery feed can see it.",
        "sourceUrl": "https://bereal.com/privacy"
      },
      {
        "name": "Location sharing",
        "what": "Location is only added to a post if your child chooses, and is approximate for under 18s.",
        "sourceUrl": "https://bereal.com/privacy"
      },
      {
        "name": "Block and report",
        "what": "Your child can block anyone without them being told, and report any post, profile, comment or message from inside the app.",
        "sourceUrl": "https://bereal.com/child-safety"
      },
      {
        "name": "Address book permission",
        "what": "BeReal only reads the address book with permission, and the permission can be withdrawn.",
        "sourceUrl": "https://bereal.com/privacy"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://bereal.com/child-safety",
      "steps": [
        "Help your child sign up with their real date of birth.",
        "Each time they post, keep the audience to friends only rather than friends of friends or the discovery feed.",
        "Leave location off when posting.",
        "Decide together whether to allow access to the phone's contacts, and remember the permission can be withdrawn.",
        "Show them how to block someone and how to report a post, profile or message from where they see it.",
        "Choose which BeReal notifications they get, in the app's settings or the phone's own settings."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "BeReal's help centre sat behind a bot check and could not be opened, so exact menu names for the setup steps were not confirmed. The steps come from BeReal's child safety page and privacy policy.",
      "No parental control or family linking tool was found on BeReal's own pages.",
      "Whether the friends of friends and discovery feed options are offered in the UK was not confirmed; BeReal's privacy policy describes them without naming regions.",
      "No PEGI database entry was found for BeReal when searching pegi.info."
    ],
    "similar": [
      "snapchat",
      "instagram",
      "threads"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Threads): Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.
  // TODO-JP-REVIEW (Threads): Meta's Threads help page says Teen Accounts are currently only available in some locations and are being rolled out account by account; it was not confirmed that every UK teen has one yet.
  // TODO-JP-REVIEW (Threads): Who can message a teen on Threads was not confirmed. Meta's messaging post limited messages to people aged 18 and over at launch in July 2025 and does not say whether that still applies.
  // TODO-JP-REVIEW (Threads): No PEGI database entry was found for Threads when searching pegi.info.
  {
    "slug": "threads",
    "name": "Threads",
    "maker": "Meta",
    "category": "social",
    "whatItIs": "A text based app from Meta for posting short updates and replying to other people's posts.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Threads sets its own minimum age at 13",
      "note": "Threads follows Instagram's rules on who can use it, and Meta says users under 13 are not allowed. Profiles for under 18s start as private, and 13 to 15 year olds need a parent's approval to make Teen Account settings less protective.",
      "sourceName": "Threads Supplemental Terms of Use, last updated 28 May 2025",
      "sourceUrl": "https://help.instagram.com/769983657850450",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/threads/id6446901002",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (PEGI Parental Guidance Recommended)",
        "url": "https://play.google.com/store/apps/details?id=com.instagram.barcelona&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=Threads",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "A feed with recommended posts",
        "detail": "The main feed mixes posts from people your child follows with recommended posts chosen by a ranking system. A Following view shows only accounts they follow.",
        "sourceUrl": "https://transparency.meta.com/features/explaining-ranking/ig-threads-feed/"
      },
      {
        "title": "Public conversations",
        "detail": "Under 18s start with a private profile, but 16 and 17 year olds can switch to public, so anyone can see and reply to their posts. Name, photo, username and bio are always public.",
        "sourceUrl": "https://help.instagram.com/225222310104065/"
      },
      {
        "title": "Direct messages",
        "detail": "Threads has direct messages and group chats. Messages from people your child does not follow go to a Message Requests folder.",
        "sourceUrl": "https://about.fb.com/news/2025/07/introducing-messaging-highlighted-perspectives-threads/"
      },
      {
        "title": "Sharing beyond Threads",
        "detail": "If the fediverse option is switched on, posts can be shared to other services that Meta does not control.",
        "sourceUrl": "https://help.instagram.com/769983657850450"
      }
    ],
    "controls": [
      {
        "name": "Private profile for under 18s",
        "what": "Profiles for under 18s are set to private when created, and only 16 and 17 year olds can switch to public themselves.",
        "sourceUrl": "https://help.instagram.com/225222310104065/"
      },
      {
        "name": "Supervision in Family Centre",
        "what": "Lets you approve or refuse requests to loosen settings, and see who your teen follows, who follows them and who they have blocked.",
        "sourceUrl": "https://help.instagram.com/1523174366122511"
      },
      {
        "name": "Daily time limit and sleep mode",
        "what": "Sets how long your teen can use Threads each day and quiet hours, with a reminder or a block when time is up.",
        "sourceUrl": "https://help.instagram.com/1523174366122511"
      },
      {
        "name": "Following feed",
        "what": "Shows only accounts your child follows, newest first, with no recommended posts.",
        "sourceUrl": "https://transparency.meta.com/features/explaining-ranking/ig-threads-feed/"
      },
      {
        "name": "Only People You Follow",
        "what": "A Messages setting that turns off message requests from people your child does not follow.",
        "sourceUrl": "https://about.fb.com/news/2025/07/introducing-messaging-highlighted-perspectives-threads/"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.instagram.com/iphone-app/1676706666927669",
      "steps": [
        "Make sure your child's account has their real date of birth, so the teen settings apply.",
        "In your own Threads app, go to your profile and tap Menu at the top right.",
        "Tap Supervision for Teen Accounts, then Get Started, review the information and tap Continue.",
        "Choose Find your teen on Threads or Send your teen a link, and ask your teen to accept within 7 days.",
        "Once supervision is on, set a daily time limit and sleep mode, and check their profile is still private."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Google Play label read on 22 November 2026 from a connection outside the UK, with the UK country setting (gl=GB). Changing the setting to US or Germany changed the label, so the UK setting was applied. Parental guidance is PEGI's non numeric Parental Guidance Recommended label for apps, not an age.",
      "Meta's Threads help page says Teen Accounts are currently only available in some locations and are being rolled out account by account; it was not confirmed that every UK teen has one yet.",
      "Who can message a teen on Threads was not confirmed. Meta's messaging post limited messages to people aged 18 and over at launch in July 2025 and does not say whether that still applies.",
      "No PEGI database entry was found for Threads when searching pegi.info."
    ],
    "similar": [
      "instagram",
      "tiktok",
      "bereal"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Twitch): Twitch's help and safety pages (help.twitch.tv and safety.twitch.tv) would not load for a direct read. The Family Center controls, the Whispers setting, the label filters and the setup steps come from search summaries of those Twitch pages and from news reports of the July 2026 launch. Confirm each at the page before publishing.
  // TODO-JP-REVIEW (Twitch): Whether Family Center is available in the UK was not confirmed.
  // TODO-JP-REVIEW (Twitch): The exact menu names for linking Family Center and for content label filters were not confirmed.
  // TODO-JP-REVIEW (Twitch): Which labels are filtered by default for under 18s was not confirmed at the page.
  {
    "slug": "twitch",
    "name": "Twitch",
    "maker": "Twitch Interactive (Amazon)",
    "category": "video",
    "whatItIs": "A live streaming site and app where people broadcast games, music and chat in real time while viewers talk to them and each other in chat.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Twitch sets its own minimum age at 13",
      "note": "Twitch's terms say it is not available to anyone under 13. Between 13 and adulthood (18 in the UK) a young person may only use Twitch under the supervision of a parent or guardian who agrees to the terms.",
      "sourceName": "Twitch Terms of Service (last modified 12 August 2026)",
      "sourceUrl": "https://legal.twitch.com/en/legal/terms-of-service/",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/twitch-live-streaming/id460177396",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. Users interact, In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=tv.twitch.android.app",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=Twitch",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Live chat with strangers during streams",
        "detail": "Every stream has a chat where viewers talk to the streamer and each other in real time, and anything said is live, not reviewed first.",
        "sourceUrl": "https://apps.apple.com/gb/app/twitch-live-streaming/id460177396"
      },
      {
        "title": "Private messages called Whispers",
        "detail": "Whispers are direct messages between users. A setting can block Whispers from strangers, meaning people your child does not follow or subscribe to.",
        "sourceUrl": "https://help.twitch.tv/s/article/how-to-use-whispers?language=en_US"
      },
      {
        "title": "Going live from the app",
        "detail": "Twitch promotes the app as one of the easiest ways to start streaming: create an account and go live directly from the phone.",
        "sourceUrl": "https://apps.apple.com/gb/app/twitch-live-streaming/id460177396"
      },
      {
        "title": "Paying streamers",
        "detail": "Viewers can subscribe to streamers and buy Bits to support them, sold as in app purchases.",
        "sourceUrl": "https://apps.apple.com/gb/app/twitch-live-streaming/id460177396"
      },
      {
        "title": "Streams carry content labels, not age gates",
        "detail": "Streamers apply Content Classification Labels such as Mature Rated Games, Sexual Themes, Gambling or Significant Profanity, and a viewer sees a notice and agrees before watching.",
        "sourceUrl": "https://blog.twitch.tv/en/2023/06/20/introducing-content-classification-labels/"
      }
    ],
    "controls": [
      {
        "name": "Family Center",
        "what": "Optional parental controls for linked teen accounts aged 13 to 17: stop the teen going live, turn off Whispers, set a daily time limit across devices, restrict labelled content, and receive a weekly email summary.",
        "sourceUrl": "https://help.twitch.tv/s/article/family-center?language=en_US"
      },
      {
        "name": "Block Whispers from Strangers",
        "what": "Stops people your child does not follow, subscribe to or moderate for from starting a private message.",
        "sourceUrl": "https://help.twitch.tv/s/article/how-to-use-whispers?language=en_US"
      },
      {
        "name": "Content Classification Label filters",
        "what": "Lets a viewer hide streams carrying chosen labels; Twitch's safety pages say some labels are filtered by default for under 18s.",
        "sourceUrl": "https://safety.twitch.tv/s/article/Viewer-Controls?language=en_US"
      },
      {
        "name": "Block and report",
        "what": "Block a user to stop contact, and report a stream, message or user to Twitch.",
        "sourceUrl": "https://safety.twitch.tv/s/article/Guide-Parents-Educators?language=en_US"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.twitch.tv/s/article/family-center?language=en_US",
      "steps": [
        "Create your own separate Twitch account. Twitch asks the parent to have their own account to link with.",
        "On your teen's account, open account settings, go to Family Center and send a link request to your account, then accept it on yours.",
        "In Family Center, turn off going live, turn off Whispers, and set a daily time limit.",
        "Also in Family Center, restrict the content labels you do not want them to see.",
        "On your teen's account, go to Settings, then Security and Privacy, and switch on Block Whispers from Strangers.",
        "Show them how to block a user and report a stream or message."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Twitch's help and safety pages (help.twitch.tv and safety.twitch.tv) would not load for a direct read. The Family Center controls, the Whispers setting, the label filters and the setup steps come from search summaries of those Twitch pages and from news reports of the July 2026 launch. Confirm each at the page before publishing.",
      "Whether Family Center is available in the UK was not confirmed.",
      "The exact menu names for linking Family Center and for content label filters were not confirmed.",
      "Which labels are filtered by default for under 18s was not confirmed at the page."
    ],
    "similar": [
      "youtube",
      "discord",
      "fortnite"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Character.AI): The terms were read from the text Character.AI's own website loads for its terms page (last updated 27 August 2025); the page itself renders by script.
  // TODO-JP-REVIEW (Character.AI): pegi.info was not searched: it rates games, and this is not one. The Google Play label uses PEGI symbols through IARC.
  // TODO-JP-REVIEW (Character.AI): The date open ended chat ended for under 18s in the UK is not given; Character.AI said other markets would follow the US in short order.
  // TODO-JP-REVIEW (Character.AI): The teen safety page describes the earlier teen chat experience and does not mention the end of open ended chat; the blog posts of 29 October 2025 and 3 September 2026 do.
  // TODO-JP-REVIEW (Character.AI): Whether Character.AI keeps running depends on its sale, with an auction set for 1 December 2026. Recheck before publishing.
  {
    "slug": "character-ai",
    "name": "Character.AI",
    "maker": "Character Technologies, Inc.",
    "category": "ai",
    "whatItIs": "An app of AI characters, most made by other users, that adults can chat with and teens can use in story and creative formats.",
    "minAge": {
      "value": 16,
      "label": "16 in the UK",
      "gapAge": 16,
      "rule": "Character.AI's terms say no one under 16 in the UK may sign up",
      "note": "The terms say anyone under 13, or under 16 and living in the UK or the EEA, must not sign up. Since late 2025 (from 24 November 2025 in the US, with other countries following), users under 18 can no longer have open ended chat with Characters; they get Stories and other formats instead, and Character.AI uses age assurance to place users.",
      "sourceName": "Character.AI Terms of Service, last updated 27 August 2025, and Character.AI blog, 29 October 2025",
      "sourceUrl": "https://character.ai/tos",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "18+",
        "url": "https://apps.apple.com/gb/app/character-ai-chat-talk-text/id1671705818",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 18",
        "url": "https://play.google.com/store/apps/details?id=ai.character.app&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "",
        "url": "",
        "checked": false
      }
    },
    "risks": [
      {
        "title": "Characters made by other users",
        "detail": "Most Characters are created by users. Teen accounts see a narrower set, filtered to remove Characters about sensitive or mature topics.",
        "sourceUrl": "https://character.ai/safety/teen-safety"
      },
      {
        "title": "A chatbot that stays in character",
        "detail": "For adults, Characters hold open ended conversations in role. Character.AI removed this for users under 18, so the right birthday and age check decide which experience your teen gets.",
        "sourceUrl": "https://blog.character.ai/u18-chat-announcement/"
      },
      {
        "title": "Sharing stories with the community",
        "detail": "Teens can create Stories with Characters and share them widely on the Feed.",
        "sourceUrl": "https://blog.character.ai/introducing-stories-a-new-way-to-create-play-and-share-adventures-with-your-favorite-characters/"
      },
      {
        "title": "Paid subscriptions",
        "detail": "Character.AI sells a paid subscription, Character.AI+, listed in the UK App Store at £9.99.",
        "sourceUrl": "https://blog.character.ai/an-update-on-character-ai/"
      },
      {
        "title": "A service up for sale",
        "detail": "Character.AI entered a Chapter 11 sale process in October 2026 and says the platform will be wound down if no suitable bid comes.",
        "sourceUrl": "https://blog.character.ai/an-update-on-character-ai/"
      }
    ],
    "controls": [
      {
        "name": "Parental Insights",
        "what": "A weekly email to a parent with daily average time, top Characters and time per Character, without chat content. The teen sends the invite.",
        "sourceUrl": "https://character.ai/safety/parental-insights"
      },
      {
        "name": "Under 18 experience",
        "what": "No open ended chat, a more cautious model and a narrower set of Characters for users under 18.",
        "sourceUrl": "https://character.ai/safety/teen-safety"
      },
      {
        "name": "Age assurance",
        "what": "Character.AI's own age estimation model, used with outside tools such as Persona, to place users in the right experience.",
        "sourceUrl": "https://blog.character.ai/u18-chat-announcement/"
      },
      {
        "name": "Block a user",
        "what": "Hides another user and their Characters, posts, voices and scenes from search, discovery and profiles, in both directions.",
        "sourceUrl": "https://blog.character.ai/continuing-to-build-upon-our-safety-priorities/"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://character.ai/safety/parental-insights",
      "steps": [
        "Check your teen's account uses their real birthday. In the UK the terms do not allow anyone under 16.",
        "Ask your teen to open Preferences and select the Parental insights tab.",
        "They enter your email address to invite you.",
        "Open the invitation email (check spam if it is not there) and click Agree.",
        "Read the weekly report: time spent and the top Characters they use. It does not show their chats.",
        "If your teen asks to remove your email, you get an email asking you to confirm, so you will know."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "The terms were read from the text Character.AI's own website loads for its terms page (last updated 27 August 2025); the page itself renders by script.",
      "pegi.info was not searched: it rates games, and this is not one. The Google Play label uses PEGI symbols through IARC.",
      "The date open ended chat ended for under 18s in the UK is not given; Character.AI said other markets would follow the US in short order.",
      "The teen safety page describes the earlier teen chat experience and does not mention the end of open ended chat; the blog posts of 29 October 2025 and 3 September 2026 do.",
      "Whether Character.AI keeps running depends on its sale, with an auction set for 1 December 2026. Recheck before publishing."
    ],
    "similar": [
      "chatgpt",
      "snapchat",
      "discord"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (ChatGPT): pegi.info was not searched: it rates games, and this is not one.
  // TODO-JP-REVIEW (ChatGPT): OpenAI's age prediction help page does not say whether age prediction is live in the UK.
  // TODO-JP-REVIEW (ChatGPT): OpenAI says safety notifications are rolling out gradually and may not be on every teen account yet.
  {
    "slug": "chatgpt",
    "name": "ChatGPT",
    "maker": "OpenAI",
    "category": "ai",
    "whatItIs": "An AI chatbot that answers questions, writes, talks by voice and makes images in conversation.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "ChatGPT sets its own minimum age at 13",
      "note": "OpenAI's terms for the UK, EEA and Switzerland say users must be at least 13, or the minimum age to consent in their country, and under 18s need a parent or legal guardian's permission. Accounts thought to be under 18 get ChatGPT for Teens protections, and age prediction can move an account into it.",
      "sourceName": "OpenAI Europe Terms of Use, updated 16 January 2026",
      "sourceUrl": "https://openai.com/policies/eu-terms-of-use/",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/chatgpt/id6448311069",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance",
        "url": "https://play.google.com/store/apps/details?id=com.openai.chatgpt&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "",
        "url": "",
        "checked": false
      }
    },
    "risks": [
      {
        "title": "A chatbot that is always available",
        "detail": "ChatGPT replies in conversation at any hour and can use saved memories to personalise its answers.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "title": "Answers that can be wrong",
        "detail": "OpenAI's terms say output may not always be accurate and should not be relied on as the only source of facts or in place of professional advice.",
        "sourceUrl": "https://openai.com/policies/eu-terms-of-use/"
      },
      {
        "title": "Spoken conversation",
        "detail": "Voice Mode lets a user talk with ChatGPT out loud.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "title": "Making and editing images",
        "detail": "Image generation lets a user create and edit images in ChatGPT.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "title": "Age decides the protections",
        "detail": "Teen protections depend on the age on the account, a verified age or OpenAI's age prediction.",
        "sourceUrl": "https://help.openai.com/en/articles/12652064-age-prediction-in-chatgpt"
      }
    ],
    "controls": [
      {
        "name": "Parental controls (linked accounts)",
        "what": "Links your account to your teen's so you manage their settings, without access to their conversations.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "name": "Reduce sensitive content",
        "what": "Extra safeguards against graphic content, viral challenges, sexual or romantic roleplay, violent roleplay and extreme beauty ideals.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "name": "Quiet hours",
        "what": "Times when your teen cannot use ChatGPT at all.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "name": "Voice Mode, Image generation and saved memories",
        "what": "Switch each feature off or on for your teen.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "name": "Improve the model for everyone",
        "what": "Controls whether your teen's conversations can be used to improve ChatGPT models.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      },
      {
        "name": "Safety notifications",
        "what": "In limited situations, such as a serious self harm concern identified by trained reviewers, OpenAI tells the linked parent, without sharing the conversation.",
        "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.openai.com/en/articles/12315553-managing-parental-controls-in-chatgpt",
      "steps": [
        "In ChatGPT, open Settings, then Parental controls, then Add family member, and enter your teen's phone number or email.",
        "Your teen accepts the invitation from the text, email or ChatGPT notification.",
        "Select your teen under Family members and keep Reduce sensitive content switched on.",
        "Turn off Voice Mode, Image generation and Reference saved memories if you prefer, and turn off Improve the model for everyone.",
        "Turn on Quiet hours and choose a start and end time, for example overnight.",
        "Under Safety notifications, select Manage notifications to choose how alerts reach you."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "pegi.info was not searched: it rates games, and this is not one.",
      "OpenAI's age prediction help page does not say whether age prediction is live in the UK.",
      "OpenAI says safety notifications are rolling out gradually and may not be on every teen account yet."
    ],
    "similar": [
      "character-ai",
      "snapchat",
      "youtube"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Netflix): Netflix does not publish an age at which a child should leave a Kids profile; the help page does not state the Kids experience age range directly.
  {
    "slug": "netflix",
    "name": "Netflix",
    "maker": "Netflix",
    "category": "video",
    "whatItIs": "A paid streaming service for films, series and games, watched on profiles inside one household account.",
    "minAge": {
      "value": 18,
      "label": "18, held by an adult",
      "gapAge": 0,
      "rule": "Netflix accounts are held by an adult, with Kids profiles for children",
      "note": "This is the age to open an account. Netflix's terms say you must be at least 18 to create an account, and minors may only use the service under the supervision of an adult. A child watches on a parent's account, ideally on a Kids profile or a profile with a maturity rating set.",
      "sourceName": "Netflix Terms of Use (last updated 10 April 2026)",
      "sourceUrl": "https://help.netflix.com/legal/termsofuse?locale=en-GB",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/netflix/id363590051",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.netflix.mediaclient",
        "checked": true
      },
      "pegi": {
        "value": "Parental Guidance Recommended (app rating, Google Play Store and Microsoft Windows Store, 2017)",
        "url": "https://pegi.info/search-pegi?q=Netflix",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Autoplay starts the next episode",
        "detail": "Netflix can automatically play the next episode in a series. It is a profile setting called Autoplay Next Episode.",
        "sourceUrl": "https://help.netflix.com/en/node/121518"
      },
      {
        "title": "Previews play while browsing",
        "detail": "Netflix can play previews automatically as you browse, a profile setting called Autoplay Previews.",
        "sourceUrl": "https://help.netflix.com/en/node/2102"
      },
      {
        "title": "Any unlocked profile can be opened",
        "detail": "Profiles are picked from the Who's watching screen, and only a Profile Lock PIN stops someone opening a profile. Netflix also notes anyone with the account password can change parental controls.",
        "sourceUrl": "https://help.netflix.com/en/node/114277"
      },
      {
        "title": "Games sit alongside shows",
        "detail": "Netflix includes games, rated by IARC and the Apple App Store rather than the BBFC, and profiles see games at or below their maturity level.",
        "sourceUrl": "https://help.netflix.com/en/node/121877"
      }
    ],
    "controls": [
      {
        "name": "Kids profile (Netflix Kids experience)",
        "what": "A simplified profile that plays only shows, films and games selected for kids, removes access to account settings and cannot have its own email login.",
        "sourceUrl": "https://help.netflix.com/en/node/114275"
      },
      {
        "name": "Maturity rating",
        "what": "Sets the highest rating a profile can see; in the UK Netflix uses BBFC ratings U, PG, 12, 15 and 18.",
        "sourceUrl": "https://help.netflix.com/en/node/2064/gb"
      },
      {
        "name": "Block titles",
        "what": "Removes named shows or films from a profile.",
        "sourceUrl": "https://help.netflix.com/en/node/114276"
      },
      {
        "name": "Profile Lock",
        "what": "A four digit PIN needed to open a profile or play titles downloaded from it.",
        "sourceUrl": "https://help.netflix.com/en/node/114277"
      },
      {
        "name": "Require PIN to add new profiles",
        "what": "Stops anyone creating a new, unrestricted profile without the main profile's PIN.",
        "sourceUrl": "https://help.netflix.com/en/node/122551"
      },
      {
        "name": "Autoplay settings",
        "what": "Turn Autoplay Next Episode and Autoplay Previews off for each profile.",
        "sourceUrl": "https://help.netflix.com/en/node/121518"
      },
      {
        "name": "Viewing activity",
        "what": "Shows what has been watched on each profile.",
        "sourceUrl": "https://help.netflix.com/en/node/101917"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.netflix.com/en/node/264",
      "steps": [
        "Create a profile for your child from Manage Profiles and select Kids, or set a maturity rating that fits their age (U, PG, 12, 15 or 18).",
        "Add a Profile Lock PIN to your own profile and every adult profile: Account, Profiles, choose the profile, Profile Lock, Create a Profile Lock.",
        "On the main profile's Profile Lock, tick Require PIN to add new profiles.",
        "Block any specific titles you do not want on their profile under Viewing Restrictions, Block Titles (use a web browser for a Kids profile).",
        "Turn off Autoplay Next Episode and Autoplay Previews on their profile under Playback settings.",
        "Check Viewing activity on their profile from your Account page now and then."
      ]
    },
    "underAge": {
      "text": "A Kids profile on a parent's account, which shows only titles and games selected for kids.",
      "sourceUrl": "https://help.netflix.com/en/node/114275"
    },
    "uncertain": [
      "Netflix does not publish an age at which a child should leave a Kids profile; the help page does not state the Kids experience age range directly."
    ],
    "similar": [
      "youtube-kids",
      "youtube",
      "spotify"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Spotify): The UK terms say 13 or the equivalent minimum age in your home country but give no country table, so a UK specific age other than 13 was not confirmed.
  // TODO-JP-REVIEW (Spotify): Spotify Kids: the UK page does not state an age range.
  {
    "slug": "spotify",
    "name": "Spotify",
    "maker": "Spotify",
    "category": "music",
    "whatItIs": "A music, podcast and audiobook streaming app with free and paid plans.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Spotify sets its own minimum age at 13",
      "note": "Spotify's terms say you must be 13 or older (or the minimum age in your country), with a parent's consent if you are a minor. Under that age, a parent can create a managed account for a child of 13 and under, on a free or Premium plan in the UK, or use the separate Spotify Kids app with Premium Family.",
      "sourceName": "Spotify Terms of Use, UK (last updated 26 August 2025)",
      "sourceUrl": "https://www.spotify.com/uk/legal/end-user-agreement/",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/spotify-music-and-podcasts/id324684580",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.spotify.music",
        "checked": true
      },
      "pegi": {
        "value": "Parental Guidance Recommended (app rating, Google Play Store and Microsoft Windows Store, 2017)",
        "url": "https://pegi.info/search-pegi?q=Spotify",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Explicit lyrics unless filtered",
        "detail": "Explicit tracks play unless the filter is set, and the filter depends on rights holders tagging content as explicit, so tags can be incomplete.",
        "sourceUrl": "https://support.spotify.com/uk/article/explicit-content/"
      },
      {
        "title": "Autoplay keeps the music going",
        "detail": "When a playlist or album ends, Spotify plays similar songs automatically so the music never stops.",
        "sourceUrl": "https://support.spotify.com/uk/article/autoplay/"
      },
      {
        "title": "Podcasts and video alongside music",
        "detail": "Standard accounts include podcasts, audiobooks and video. Managed accounts for younger children are music only, with video and Canvas off by default.",
        "sourceUrl": "https://www.spotify.com/uk/safetyandprivacy/parental-guide"
      },
      {
        "title": "Messages and shared listening",
        "detail": "Spotify has Messages for users aged 16 and over, and shared listening features called Jam and Blend. Managed accounts cannot use Messages, Jam or Blend, and cannot be searched for by others.",
        "sourceUrl": "https://www.spotify.com/uk/safetyandprivacy/parental-guide"
      }
    ],
    "controls": [
      {
        "name": "Managed account",
        "what": "An account for a listener of 13 and under, set up and controlled by a parent, private by default, with no purchases or Messages.",
        "sourceUrl": "https://newsroom.spotify.com/2026-07-15/managed-accounts-for-families-expansion/"
      },
      {
        "name": "Explicit content filter",
        "what": "Greys out and skips tracks tagged explicit; on automatically for managed accounts, and a Premium Family manager can switch it off for each member.",
        "sourceUrl": "https://support.spotify.com/uk/article/explicit-content/"
      },
      {
        "name": "Manage artists or songs",
        "what": "Blocks specific artists or tracks on a managed account.",
        "sourceUrl": "https://support.spotify.com/uk/article/setting-up-a-managed-account/"
      },
      {
        "name": "Videos and Canvas",
        "what": "Parents can turn video and Canvas on or off for a managed account; both start off.",
        "sourceUrl": "https://www.spotify.com/uk/safetyandprivacy/parental-guide"
      },
      {
        "name": "Parental controls PIN",
        "what": "A PIN that protects the managed account's parental controls.",
        "sourceUrl": "https://support.spotify.com/uk/article/setting-up-a-managed-account/"
      },
      {
        "name": "Spotify Kids",
        "what": "A separate app with audio chosen for younger or older kids, available only with Premium Family.",
        "sourceUrl": "https://www.spotify.com/uk/kids/"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://support.spotify.com/uk/article/setting-up-a-managed-account/",
      "steps": [
        "For a child of 13 or under, open Spotify on your phone, tap your profile picture, then Settings and privacy, then Parental controls, and tap Create next to Create a managed account.",
        "Give parental consent, choose a parental controls PIN, and enter your child's name and date of birth.",
        "Set the parental controls: keep explicit content off, and leave videos and Canvas off.",
        "Use Manage artists or songs to block anything specific, then log your child in to the managed account.",
        "For a teen on Premium Family, log in to the Premium Family account page, choose their name and switch Explicit content off.",
        "On a teen's own phone, Settings and privacy, Content and display, switch off Allow Explicit Content. The setting is per device.",
        "If you want listening to stop when an album ends, switch off Autoplay under Settings and privacy, Playback."
      ]
    },
    "underAge": {
      "text": "A managed account for listeners of 13 and under, on a free or Premium plan in the UK, or the Spotify Kids app with Premium Family.",
      "sourceUrl": "https://newsroom.spotify.com/2026-07-15/managed-accounts-for-families-expansion/"
    },
    "uncertain": [
      "The UK terms say 13 or the equivalent minimum age in your home country but give no country table, so a UK specific age other than 13 was not confirmed.",
      "Spotify Kids: the UK page does not state an age range."
    ],
    "similar": [
      "youtube",
      "netflix",
      "tiktok"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (Among Us): The PEGI 7 rating on pegi.info is for Among Us Crewmate Edition, the console and PC release from Maximum Entertainment. No separate pegi.info entry for Innersloth's own digital edition was found.
  // TODO-JP-REVIEW (Among Us): Innersloth's terms of use are dated 26 May 2021 and its privacy policy 1 July 2023. The privacy policy defines a child by each country's age of consent; the UK age of 13 comes from Innersloth's Free Chat age list.
  // TODO-JP-REVIEW (Among Us): minAge.value is null on purpose: the terms set 18, or younger with a parent's consent, rather than a minimum.
  {
    "slug": "among-us",
    "name": "Among Us",
    "maker": "Innersloth",
    "category": "gaming",
    "whatItIs": "A party game where a group of crewmates on a spaceship try to work out which players are the impostors.",
    "minAge": {
      "value": null,
      "label": "18, or younger with a parent",
      "gapAge": 13,
      "rule": "Among Us keeps under 13s in Quick Chat until a parent allows more",
      "note": "Innersloth's terms say you must be 18 or have a parent's consent. A child, under 13 in the UK, is put into Quick Chat mode, using fixed phrases only, until a parent verifies through Kids Web Services and allows Free Chat. In the UK, Free Chat is open from 13.",
      "sourceName": "Innersloth Privacy Policy, and Among Us Help, How do I change my age?",
      "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/6711707830804-How-do-I-change-my-age",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "9+",
        "url": "https://apps.apple.com/gb/app/among-us/id1351168404",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 7",
        "url": "https://play.google.com/store/apps/details?id=com.innersloth.spacemafia&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 7, Violence, In game purchases",
        "url": "https://pegi.info/search-pegi?q=among+us",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Public lobbies with players they have not met",
        "detail": "Players without a group of friends can join public lobbies to play with people they do not know.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/9688377408276-Can-you-play-Among-Us-alone"
      },
      {
        "title": "Free Chat",
        "detail": "Lobbies can use Free Chat, where players type their own messages, or Quick Chat, which uses fixed phrases. Children need a parent's permission for Free Chat.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/6711536647060-How-do-I-turn-on-Free-Chat"
      },
      {
        "title": "A currency bought with real money",
        "detail": "Stars are the premium currency, bought with real money or earned by watching ads on mobile, and spent on special items and Cosmicubes.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/7094991564820-Currencies-Items-Stars-Beans-Cosmicubes-Explanation"
      },
      {
        "title": "Optional ads on mobile",
        "detail": "On phones, players can watch up to three ads a day to earn Stars. Child accounts without a verified parent cannot watch them.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/43729614956180-How-do-Ad-Rewards-work-Can-I-get-free-Stars"
      }
    ],
    "controls": [
      {
        "name": "Quick Chat mode",
        "what": "The default for any child account: fixed phrases only, a random name and no personal details shown.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/6711707830804-How-do-I-change-my-age"
      },
      {
        "name": "Innersloth Parent Portal (Kids Web Services)",
        "what": "After verifying, a parent chooses whether a child account gets Free Chat and a custom name, and can change this at any time.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/14016329973524-I-m-a-parent-guardian-What-is-the-process-and-flow-for-verifying-my-child-s-account"
      },
      {
        "name": "Chat type for a lobby",
        "what": "The host sets a lobby to Free Chat or Quick Chat, and players can filter for Quick Chat Only games.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/35117411022740-How-do-I-use-the-updated-Matchmaking-in-update-16-0-0"
      },
      {
        "name": "Private games by code",
        "what": "A host can share a lobby code so friends join with Enter Code instead of a public lobby.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/35117411022740-How-do-I-use-the-updated-Matchmaking-in-update-16-0-0"
      },
      {
        "name": "Report a player",
        "what": "Report a player from the chat during the lobby or meetings, or from recent players after a match, for moderators to review.",
        "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/6739782626196-How-do-I-report-someone-in-the-game-What-does-reporting-do"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/14016329973524-I-m-a-parent-guardian-What-is-the-process-and-flow-for-verifying-my-child-s-account",
      "steps": [
        "When the game asks for a parent's email on your child's account, enter yours and select Send.",
        "Open the email from Kids Web Services within 24 hours and follow it to verify you are an adult.",
        "In the Innersloth Parent Portal, choose the permissions: leave Free Chat off to keep Quick Chat only, and decide on a custom display name.",
        "Check the light in the top left of the game menu: cyan means waiting for you, green means verified.",
        "For games with friends, have one person select Create Game with Quick Chat and share the code, and the others join with Enter Code.",
        "Show your child how to report: open the chat, select the kick icon, choose the player, then Report."
      ]
    },
    "underAge": {
      "text": "A child account stays in Quick Chat mode unless you allow more. Freeplay mode is the only way to play without other people.",
      "sourceUrl": "https://innersloth.zendesk.com/hc/en-us/articles/9688377408276-Can-you-play-Among-Us-alone"
    },
    "uncertain": [
      "The PEGI 7 rating on pegi.info is for Among Us Crewmate Edition, the console and PC release from Maximum Entertainment. No separate pegi.info entry for Innersloth's own digital edition was found.",
      "Innersloth's terms of use are dated 26 May 2021 and its privacy policy 1 July 2023. The privacy policy defines a child by each country's age of consent; the UK age of 13 comes from Innersloth's Free Chat age list.",
      "minAge.value is null on purpose: the terms set 18, or younger with a parent's consent, rather than a minimum."
    ],
    "similar": [
      "roblox",
      "minecraft",
      "fortnite"
    ],
    "checked": "2026-11-22"
  },
  // TODO-JP-REVIEW (CapCut): The UK version of CapCut's terms could not be opened; the page served the United States terms. The UK minimum age is not confirmed: CapCut's help centre says typically 13, or 16 in some regions such as the EU, and the UK is not named.
  // TODO-JP-REVIEW (CapCut): Whether UK users under 18 need parental consent is from the United States terms only.
  // TODO-JP-REVIEW (CapCut): No CapCut parental controls or family linking feature was found in its help centre, but that absence was not confirmed by CapCut.
  // TODO-JP-REVIEW (CapCut): The App Store lists Messaging and Chat for CapCut; no CapCut help page describing a messaging feature was found.
  {
    "slug": "capcut",
    "name": "CapCut",
    "maker": "ByteDance",
    "category": "creative",
    "whatItIs": "A video editing app from the company behind TikTok, with templates, effects and music for making short videos to share.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "CapCut usually sets its minimum age at 13",
      "note": "CapCut's terms say the service is only intended for people aged 13 and over, and that anyone under 18 needs a parent's consent. CapCut's help centre says the minimum is typically 13, or 16 in some regions such as the EU, and is applied automatically by region.",
      "sourceName": "CapCut Terms of Service (United States version, last updated 15 April 2026) and CapCut Help Centre",
      "sourceUrl": "https://www.capcut.com/clause/terms-of-service",
      "checked": false
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/capcut-photo-video-editor/id1500855883",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance (Parental guidance recommended. Users interact, In app purchases)",
        "url": "https://play.google.com/store/apps/details?hl=en_GB&gl=GB&id=com.lemon.lvoverseas",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=CapCut",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Sharing to the community feed is public",
        "detail": "CapCut has no private account setting. Projects stay private until shared, but anything shared to the CapCut Community feed or by public link is visible to other users.",
        "sourceUrl": "https://www.capcut.com/help/make-account-private"
      },
      {
        "title": "One tap posting to TikTok",
        "detail": "Linking a TikTok account lets a video go straight from CapCut to TikTok, and brings TikTok trending templates and sounds into CapCut.",
        "sourceUrl": "https://www.capcut.com/help/how-to-link-tiktok-with-capcut"
      },
      {
        "title": "Templates made by other users",
        "detail": "Users publish templates for others to drop their own photos and clips into, found through in app search, TikTok or shared links.",
        "sourceUrl": "https://www.capcut.com/resource/how-to-make-a-capcut-template"
      },
      {
        "title": "Paid subscriptions",
        "detail": "CapCut sells Standard and Pro monthly subscriptions as in app purchases.",
        "sourceUrl": "https://apps.apple.com/gb/app/capcut-photo-video-editor/id1500855883"
      }
    ],
    "controls": [
      {
        "name": "Keep projects unshared",
        "what": "Projects saved in My Projects or to the device stay private unless exported with a public link or shared to the community.",
        "sourceUrl": "https://www.capcut.com/help/make-account-private"
      },
      {
        "name": "Unlink TikTok",
        "what": "In Settings, Manage Account, a linked TikTok account can be unlinked, which removes one tap posting.",
        "sourceUrl": "https://www.capcut.com/help/how-to-link-tiktok-with-capcut"
      },
      {
        "name": "Delete a shared project",
        "what": "Deleting a project shared by mistake removes it from public access.",
        "sourceUrl": "https://www.capcut.com/help/make-account-private"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://www.capcut.com/help/make-account-private",
      "steps": [
        "Agree with your child that videos are saved to the device or kept in My Projects, not shared by public link.",
        "Agree that nothing goes to the CapCut Community feed unless you have both decided it can be public.",
        "Open Settings (the gear icon), then Manage Account, and check Connected accounts. If a TikTok account is linked and you do not want one tap posting, tap Unlink.",
        "Look through My Projects together now and then, and delete anything that was shared by mistake."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "The UK version of CapCut's terms could not be opened; the page served the United States terms. The UK minimum age is not confirmed: CapCut's help centre says typically 13, or 16 in some regions such as the EU, and the UK is not named.",
      "Whether UK users under 18 need parental consent is from the United States terms only.",
      "No CapCut parental controls or family linking feature was found in its help centre, but that absence was not confirmed by CapCut.",
      "The App Store lists Messaging and Chat for CapCut; no CapCut help page describing a messaging feature was found."
    ],
    "similar": [
      "tiktok",
      "instagram",
      "youtube"
    ],
    "leadControl": "private, unshared projects",
    "checked": "2026-11-22"
  },
  // ── THE GAMES BATCH, 28 November 2026 ──────────────────────────────────────
  // Brawl Stars, Clash Royale, Call of Duty, Grand Theft Auto, EA SPORTS FC and
  // Steam: the games parents of 8 to 14 year olds search for that were missing.
  // Read on 28 November 2026 at each maker's own help pages, pegi.info, and the
  // UK App Store and Google Play listings (gl=GB). PEGI's own news pages of 12
  // March and 6 October 2026 explain why so many games with paid random items
  // now show PEGI 16.
  // TODO-JP-REVIEW (Brawl Stars): Supercell's privacy policy says the Young Player age is under 16 "or the applicable age in their territory", and may be lower in some places. The threshold that applies in the UK was not confirmed.
  // TODO-JP-REVIEW (Brawl Stars): No entry for Brawl Stars was found in the PEGI database; the PEGI 16 is the IARC label on the UK Google Play listing.
  {
    "slug": "brawl-stars",
    "name": "Brawl Stars",
    "maker": "Supercell",
    "category": "gaming",
    "whatItIs": "A fast team battle game for phones, where short matches of three against three or five against five are played with other players online.",
    "minAge": {
      "value": null,
      "label": "None set, Young Player under 16",
      "gapAge": 16,
      "rule": "Supercell gives players under 16 a Young Player account, with stricter chat filters and Family Friendly clubs only",
      "note": "Supercell's games have no general age limit, but a player under the legal age of majority needs a parent or guardian to agree to the terms. A player who gives an age under 16 gets Young Player features, and support cannot change the age on the account afterwards.",
      "sourceName": "Supercell Parents' Guide, and Supercell Support, Young Players",
      "sourceUrl": "https://support.supercell.com/brawl-stars/en/articles/younger-players.html",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/brawl-stars/id1229016807",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 16 (Users interact, In game purchases, includes random items)",
        "url": "https://play.google.com/store/apps/details?id=com.supercell.brawlstars&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=brawl+stars",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Paid random items",
        "detail": "Google Play lists In game purchases that include random items. PEGI says digital games rated 3, 7 or 12 that sell paid random items, such as loot boxes, are being moved up to PEGI 16 from October 2026.",
        "sourceUrl": "https://pegi.info/news/pegi-updates-age-ratings-existing-games-paid-random-items"
      },
      {
        "title": "Chat in clubs",
        "detail": "Players can join clubs and chat with other members by text. Young Players can only join clubs labelled Family Friendly, and their chat filters are stricter.",
        "sourceUrl": "https://support.supercell.com/brawl-stars/en/articles/younger-players.html"
      },
      {
        "title": "Playing with people they do not know",
        "detail": "Matches put your child in teams with other players online, and the App Store lists Messaging and Chat.",
        "sourceUrl": "https://apps.apple.com/gb/app/brawl-stars/id1229016807"
      },
      {
        "title": "A shop inside the game",
        "detail": "Purchases are optional and never needed to play, and Supercell also sells items through the Supercell Store on the web.",
        "sourceUrl": "https://supercell.com/en/parents/"
      }
    ],
    "controls": [
      {
        "name": "Young Player account",
        "what": "Switches on when the age given is under 16: Family Friendly clubs only, stricter chat filters, and no personalised offers or ads.",
        "sourceUrl": "https://support.supercell.com/brawl-stars/en/articles/younger-players.html"
      },
      {
        "name": "Supercell ID on your email",
        "what": "Create your child's Supercell ID with an email address you control, so login codes come to you and you can see and manage their friends list.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "No card on the Supercell Store",
        "what": "Supercell says that while no payment details are added to the Supercell Store, no purchases can be made there.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "Purchase approval on the phone",
        "what": "Google Family Link can ask for your approval for every in app purchase, and Apple Screen Time can restrict them.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "Report a message",
        "what": "Tap a chat message and choose Report. The reporter stays confidential, and Supercell may take up to 72 hours to review it.",
        "sourceUrl": "https://supercell.com/en/parents/"
      }
    ],
    "leadControl": "a Young Player account on your own email",
    "setupSteps": {
      "sourceUrl": "https://supercell.com/en/parents/",
      "steps": [
        "When the game first asks, make sure your child's real age goes in, so the Young Player features switch on.",
        "Create their Supercell ID with an email address you control, so the login codes come to you.",
        "Leave payment details off the Supercell Store, so nothing can be bought there.",
        "On the phone itself, turn on purchase approval in Google Family Link, or restrict in app purchases in Apple Screen Time.",
        "Look at their friends list together, and show them how to tap a message and choose Report."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Supercell's privacy policy says the Young Player age is under 16 or the age that applies in each country, which may be lower in some places. The threshold that applies in the UK was not confirmed.",
      "No entry for Brawl Stars was found in the PEGI database; the PEGI 16 is the IARC label on the UK Google Play listing."
    ],
    "similar": [
      "clash-royale",
      "fortnite",
      "roblox",
      "among-us"
    ],
    "checked": "2026-11-28"
  },
  // TODO-JP-REVIEW (Clash Royale): The Young Player threshold for the UK was not confirmed, as for Brawl Stars.
  // TODO-JP-REVIEW (Clash Royale): No PEGI database entry; the PEGI 16 is the IARC label on the UK Google Play listing.
  {
    "slug": "clash-royale",
    "name": "Clash Royale",
    "maker": "Supercell",
    "category": "gaming",
    "whatItIs": "A card battle game for phones, where players build a deck of characters and play short matches against other players online.",
    "minAge": {
      "value": null,
      "label": "None set, Young Player under 16",
      "gapAge": 16,
      "rule": "Supercell gives players under 16 a Young Player account, with stricter chat filters and Family Friendly clans only",
      "note": "Supercell's games have no general age limit, but a player under the legal age of majority needs a parent or guardian to agree to the terms. A player who gives an age under 16 gets Young Player features, and support cannot change the age on the account afterwards.",
      "sourceName": "Supercell Parents' Guide, and Supercell Support, Young Players",
      "sourceUrl": "https://support.supercell.com/clash-royale/en/articles/younger-players.html",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "9+",
        "url": "https://apps.apple.com/gb/app/clash-royale/id1053012308",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 16 (Users interact, In game purchases, includes random items)",
        "url": "https://play.google.com/store/apps/details?id=com.supercell.clashroyale&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=clash+royale",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Paid random items",
        "detail": "Google Play lists In game purchases that include random items. PEGI says digital games rated 3, 7 or 12 that sell paid random items, such as loot boxes, are being moved up to PEGI 16 from October 2026.",
        "sourceUrl": "https://pegi.info/news/pegi-updates-age-ratings-existing-games-paid-random-items"
      },
      {
        "title": "Clan chat",
        "detail": "Clans have a text chat with an automatic filter set by the player's age. Young Players can only join clans labelled Family Friendly.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "title": "A shop inside the game",
        "detail": "Purchases are optional and never needed to play. Supercell gives prices from 99 cents to 99.99 dollars on US stores, and also sells items through the Supercell Store on the web.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "title": "Matches against other players",
        "detail": "Every match is against another player online, and the App Store lists Messaging and Chat.",
        "sourceUrl": "https://apps.apple.com/gb/app/clash-royale/id1053012308"
      }
    ],
    "controls": [
      {
        "name": "Young Player account",
        "what": "Switches on when the age given is under 16: Family Friendly clans only, stricter chat filters, and no personalised offers or ads.",
        "sourceUrl": "https://support.supercell.com/clash-royale/en/articles/younger-players.html"
      },
      {
        "name": "Supercell ID on your email",
        "what": "Create your child's Supercell ID with an email address you control, so login codes come to you and you can see and manage their friends list.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "No card on the Supercell Store",
        "what": "Supercell says that while no payment details are added to the Supercell Store, no purchases can be made there.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "Purchase approval on the phone",
        "what": "Google Family Link can ask for your approval for every in app purchase, and Apple Screen Time can restrict them.",
        "sourceUrl": "https://supercell.com/en/parents/"
      },
      {
        "name": "Report a message",
        "what": "Tap a chat message and choose Report. The reporter stays confidential, and Supercell may take up to 72 hours to review it.",
        "sourceUrl": "https://supercell.com/en/parents/"
      }
    ],
    "leadControl": "a Young Player account on your own email",
    "setupSteps": {
      "sourceUrl": "https://supercell.com/en/parents/",
      "steps": [
        "When the game first asks, make sure your child's real age goes in, so the Young Player features switch on.",
        "Create their Supercell ID with an email address you control, so the login codes come to you.",
        "Leave payment details off the Supercell Store, so nothing can be bought there.",
        "On the phone itself, turn on purchase approval in Google Family Link, or restrict in app purchases in Apple Screen Time.",
        "Choose a Family Friendly clan together, and show them how to tap a message and choose Report."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Supercell's privacy policy says the Young Player age is under 16 or the age that applies in each country, which may be lower in some places. The threshold that applies in the UK was not confirmed.",
      "No entry for Clash Royale was found in the PEGI database; the PEGI 16 is the IARC label on the UK Google Play listing."
    ],
    "similar": [
      "brawl-stars",
      "among-us",
      "fortnite",
      "roblox"
    ],
    "checked": "2026-11-28"
  },
  // TODO-JP-REVIEW (Call of Duty): Activision's terms of use and callofduty.com timed out, so no minimum age from the terms is given. The age at which Activision asks for parental consent in the UK was not confirmed.
  // TODO-JP-REVIEW (Call of Duty): The App Store and Google Play ratings are for Call of Duty: Mobile, a separate game from the console and PC series.
  {
    "slug": "call-of-duty",
    "name": "Call of Duty",
    "maker": "Activision",
    "category": "gaming",
    "whatItIs": "A series of first person shooter games on console and PC, including the free Warzone, with Call of Duty: Mobile as a separate game for phones.",
    "minAge": {
      "value": null,
      "label": "PEGI 18 rating",
      "gapAge": 18,
      "basis": "rating",
      "rule": "PEGI rates every recent Call of Duty game 18, for violence and bad language",
      "note": "Activision asks every account for a date of birth, and some accounts cannot play until a parent or guardian gives consent by email.",
      "sourceName": "PEGI database, Call of Duty titles, and Activision Support, Parental Consent",
      "sourceUrl": "https://pegi.info/search-pegi?q=call+of+duty",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "18+ (Call of Duty: Mobile)",
        "url": "https://apps.apple.com/gb/app/call-of-duty-mobile/id1287282214",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 16 (Call of Duty: Mobile)",
        "url": "https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 18 (Modern Warfare 4, Black Ops 7 and Warzone; Violence, Bad language, In game purchases)",
        "url": "https://pegi.info/search-pegi?q=call+of+duty",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Realistic combat",
        "detail": "PEGI rates Modern Warfare 4 18 for extreme violence, and Black Ops 7 and Warzone 18 for violence and bad language.",
        "sourceUrl": "https://pegi.info/search-pegi?q=call+of+duty"
      },
      {
        "title": "Voice chat with everyone in the lobby",
        "detail": "With voice chat on, every player in the lobby before a match can talk to each other, and proximity chat lets nearby opponents be heard during a match.",
        "sourceUrl": "https://support.activision.com/uk/en/modern-warfare-4/articles/communication-features-in-modern-warfare-4"
      },
      {
        "title": "Recorded voice chat",
        "detail": "Activision monitors and records voice chat with an AI system called ToxMod to find bullying and harassment against its Code of Conduct.",
        "sourceUrl": "https://support.activision.com/uk/en/articles/call-of-duty-voice-chat-moderation"
      },
      {
        "title": "In game purchases",
        "detail": "PEGI lists In game purchases for every recent title, and the App Store lists loot boxes for Call of Duty: Mobile.",
        "sourceUrl": "https://apps.apple.com/gb/app/call-of-duty-mobile/id1287282214"
      }
    ],
    "controls": [
      {
        "name": "Game Chat Voice set to Friends and Chat Channels",
        "what": "Limits voice chat to players on your child's friends list and their own chat channels, instead of the whole lobby.",
        "sourceUrl": "https://support.activision.com/uk/en/modern-warfare-4/articles/communication-features-in-modern-warfare-4"
      },
      {
        "name": "Text Chat off",
        "what": "In Account and Network settings, text chat can be On, My Chat Channels Only, or Off.",
        "sourceUrl": "https://support.activision.com/uk/en/modern-warfare-4/articles/communication-features-in-modern-warfare-4"
      },
      {
        "name": "Mute",
        "what": "Mute one player, or the whole lobby for the next match, from the lobby or during a match.",
        "sourceUrl": "https://support.activision.com/uk/en/modern-warfare-4/articles/communication-features-in-modern-warfare-4"
      },
      {
        "name": "Parental consent on the Activision account",
        "what": "Where consent is needed, the account cannot play until a parent follows the instructions Activision emails to them.",
        "sourceUrl": "https://support.activision.com/parental-consent"
      },
      {
        "name": "Console age limits",
        "what": "PlayStation family management and Xbox family settings let a parent restrict games by age rating, limit communication with other players, and set playtime and spending limits.",
        "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/"
      }
    ],
    "leadControl": "your console's age rating limit",
    "setupSteps": {
      "sourceUrl": "https://support.activision.com/uk/en/modern-warfare-4/articles/communication-features-in-modern-warfare-4",
      "steps": [
        "Set up your child's own account on the console with their real date of birth, inside your PlayStation family or Xbox family group, and choose the age rating limit for games.",
        "If Activision asks for a parent's consent, use the link in its email to approve the account.",
        "In the game's Settings, open the Voice Chat tab and set Game Chat Voice to Friends and Chat Channels, or turn Voice Chat off.",
        "In the Account and Network section of Settings, set Text Chat to My Chat Channels Only, or Off.",
        "Show your child how to mute a player, or the whole lobby, from the lobby screen."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Activision's terms of use and callofduty.com did not load, so no minimum age from the terms is given. The age at which Activision asks for parental consent in the UK was not confirmed.",
      "The App Store and Google Play ratings are for Call of Duty: Mobile, a separate game from the console and PC series."
    ],
    "similar": [
      "fortnite",
      "gta",
      "ea-sports-fc",
      "discord"
    ],
    "checked": "2026-11-28"
  },
  // TODO-JP-REVIEW (GTA): Rockstar's terms and support pages did not load, so GTA Online's own settings are not described; the controls named are the consoles' own, from Sony and Microsoft.
  // TODO-JP-REVIEW (GTA): The App Store and Google Play ratings are for Grand Theft Auto: San Andreas on phones.
  {
    "slug": "gta",
    "name": "GTA",
    "maker": "Rockstar Games",
    "category": "gaming",
    "whatItIs": "Grand Theft Auto, a series of open world crime games, with GTA Online as the version played with other people over the internet.",
    "minAge": {
      "value": null,
      "label": "PEGI 18 rating",
      "gapAge": 18,
      "basis": "rating",
      "rule": "PEGI rates Grand Theft Auto V and VI 18",
      "note": "PEGI lists violence, bad language and gambling for Grand Theft Auto V, and extreme violence, sex and drugs for Grand Theft Auto VI.",
      "sourceName": "PEGI database, Grand Theft Auto titles",
      "sourceUrl": "https://pegi.info/search-pegi?q=grand+theft+auto",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "18+ (Grand Theft Auto: San Andreas)",
        "url": "https://apps.apple.com/gb/app/grand-theft-auto-san-andreas/id763692274",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 18 (Grand Theft Auto: San Andreas)",
        "url": "https://play.google.com/store/apps/details?id=com.rockstargames.gtasa&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 18 (Grand Theft Auto V and VI)",
        "url": "https://pegi.info/search-pegi?q=grand+theft+auto",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Adult content throughout",
        "detail": "PEGI lists extreme violence, sex and drugs for Grand Theft Auto VI, and violence, bad language and gambling for the 2022 release of Grand Theft Auto V.",
        "sourceUrl": "https://pegi.info/search-pegi?q=grand+theft+auto"
      },
      {
        "title": "Playing online with adults",
        "detail": "GTA Online is played with other people over the internet, and console accounts allow text and voice chat with other players unless a parent restricts it.",
        "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/"
      },
      {
        "title": "In game purchases",
        "detail": "PEGI lists In game purchases for Grand Theft Auto V and VI.",
        "sourceUrl": "https://pegi.info/search-pegi?q=grand+theft+auto"
      }
    ],
    "controls": [
      {
        "name": "Console age rating limit",
        "what": "On a child account, PlayStation and Xbox can restrict games above the age rating you choose, so an 18 rated game asks for you.",
        "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/"
      },
      {
        "name": "Communication limits",
        "what": "PlayStation lets a family manager restrict communication with other players; Xbox family settings manage social interactions and privacy.",
        "sourceUrl": "https://www.xbox.com/en-GB/family-hub"
      },
      {
        "name": "Spending limits",
        "what": "PlayStation sets a monthly spending limit on each child account, and Xbox family settings manage online purchases.",
        "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/"
      },
      {
        "name": "Playtime limits",
        "what": "Both consoles let a parent set playtime for each child account.",
        "sourceUrl": "https://www.xbox.com/en-GB/family-hub"
      }
    ],
    "leadControl": "your console's age rating limit",
    "setupSteps": {
      "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/",
      "steps": [
        "Make yourself the family manager on PlayStation, or create a family group in the Xbox Family Settings app.",
        "Give your child their own child account with their real date of birth, so the age limits apply to them.",
        "Set the age rating limit for games, and decide together what happens when a friend's game is above it.",
        "Restrict communication with other players, and set a monthly spending limit.",
        "Stop new accounts being made without you: PlayStation lets you turn off new user creation and guest login and set a passcode."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Rockstar's terms and support pages did not load, so GTA Online's own settings are not described; the controls named are the consoles' own, from Sony and Microsoft.",
      "The App Store and Google Play ratings are for Grand Theft Auto: San Andreas on phones."
    ],
    "similar": [
      "call-of-duty",
      "fortnite",
      "roblox",
      "minecraft"
    ],
    "checked": "2026-11-28"
  },
  // TODO-JP-REVIEW (EA SPORTS FC): The age at which an EA account counts as a teen account in the UK was not confirmed; EA says it varies by country.
  // TODO-JP-REVIEW (EA SPORTS FC): The App Store and Google Play ratings are for EA SPORTS FC Mobile, a separate game from the console and PC release.
  {
    "slug": "ea-sports-fc",
    "name": "EA SPORTS FC",
    "maker": "Electronic Arts",
    "category": "gaming",
    "whatItIs": "The football game that used to be called FIFA, on console and PC each autumn, with EA SPORTS FC Mobile as a separate game for phones.",
    "minAge": {
      "value": null,
      "label": "None set, PEGI 16 for FC 27",
      "gapAge": 16,
      "basis": "rating",
      "rule": "PEGI rates EA SPORTS FC 27 16, because it sells loot boxes",
      "note": "EA SPORTS FC 25 and 24 were rated PEGI 3. Under PEGI's new rules from June 2026, a game with paid random items is rated 16 by default.",
      "sourceName": "PEGI database, EA SPORTS FC 27, and PEGI, new rating criteria, 12 March 2026",
      "sourceUrl": "https://pegi.info/search-pegi?q=EA+SPORTS+FC",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "9+ (EA SPORTS FC Mobile)",
        "url": "https://apps.apple.com/gb/app/ea-sports-fc-mobile-football/id1094930513",
        "checked": true
      },
      "googlePlay": {
        "value": "PEGI 3 (EA SPORTS FC Mobile)",
        "url": "https://play.google.com/store/apps/details?id=com.ea.gp.fifamobile&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "PEGI 16 (EA SPORTS FC 27; In game purchases, Paid random items)",
        "url": "https://pegi.info/search-pegi?q=EA+SPORTS+FC",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Ultimate Team packs",
        "detail": "PEGI gives EA SPORTS FC 27 a 16 because it sells loot boxes: packs of players bought with FC Points or coins, where you do not know what is inside before you pay.",
        "sourceUrl": "https://pegi.info/search-pegi?q=EA+SPORTS+FC"
      },
      {
        "title": "FC Points bought with real money",
        "detail": "FC Points are bought in the Ultimate Team store, and the App Store lists loot boxes and advertising for FC Mobile.",
        "sourceUrl": "https://apps.apple.com/gb/app/ea-sports-fc-mobile-football/id1094930513"
      },
      {
        "title": "Chat and shared content on FC Mobile",
        "detail": "The App Store lists Messaging and Chat and User Generated Content for EA SPORTS FC Mobile.",
        "sourceUrl": "https://apps.apple.com/gb/app/ea-sports-fc-mobile-football/id1094930513"
      }
    ],
    "controls": [
      {
        "name": "FC Playtime",
        "what": "Shows time played, matches played each week, FC Points bought and packs opened, and lets you set limits on matches, packs and FC Points. It is off until you turn it on.",
        "sourceUrl": "https://help.ea.com/en/help/ea-sports-fc/fc-playtime-controls/"
      },
      {
        "name": "EA Family account",
        "what": "Add your teen's EA account to your own Family account to see their playtime, set limits for weekdays and weekends, and get a weekly Family Activity Report.",
        "sourceUrl": "https://help.ea.com/en/help/ea/ea-app/player-controls-ea/"
      },
      {
        "name": "Teen spending limit",
        "what": "EA teen accounts start with a spending limit of zero, and only a parent's Family account can change it.",
        "sourceUrl": "https://help.ea.com/en/help/ea/ea-app/player-controls-ea/"
      },
      {
        "name": "Console spending and age limits",
        "what": "PlayStation and Xbox child accounts can carry a monthly spending limit and an age rating limit for games.",
        "sourceUrl": "https://www.playstation.com/en-gb/support/account/psn-safety-parents-guide/"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.ea.com/en/help/ea-sports-fc/fc-playtime-controls/",
      "steps": [
        "Turn on FC Playtime: in the game's Playtime menu, or in the FC Web or Companion App under Playtime, toggle on Enable Playtime.",
        "On the Ultimate Team main menu, go to the Club tab, open the Playtime tile, and set a Points Purchase Limit and a pack limit you have agreed together.",
        "Set a weekly match limit from the in game Playtime menu on the console or PC.",
        "In the EA app, open Family playtime, choose Add Teen Account and enter the email on your child's EA account; they accept the invite within 24 hours.",
        "Leave the teen spending limit at zero unless you have agreed a monthly amount, and check the weekly Family Activity Report together."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "EA says the age for a teen account varies by country; the UK age was not confirmed.",
      "The App Store and Google Play ratings are for EA SPORTS FC Mobile, a separate game from the console and PC release."
    ],
    "similar": [
      "fortnite",
      "call-of-duty",
      "roblox",
      "brawl-stars"
    ],
    "checked": "2026-11-28"
  },
  // TODO-JP-REVIEW (Steam): Steam has no PEGI rating of its own as a store; each game on it carries its own.
  {
    "slug": "steam",
    "name": "Steam",
    "maker": "Valve",
    "category": "gaming",
    "whatItIs": "Valve's shop and library for PC games, with a friends list, chat and community pages, and a mobile app to go with it.",
    "minAge": {
      "value": 13,
      "label": "13",
      "gapAge": 13,
      "rule": "Steam sets its own minimum age at 13",
      "note": "Valve says Steam is not intended for children under 13. A Steam Family lets an adult set parental controls on a child's account.",
      "sourceName": "Steam Subscriber Agreement",
      "sourceUrl": "https://store.steampowered.com/subscriber_agreement/",
      "checked": true
    },
    "ratings": {
      "appStore": {
        "value": "13+",
        "url": "https://apps.apple.com/gb/app/steam-mobile/id495369748",
        "checked": true
      },
      "googlePlay": {
        "value": "Parental guidance",
        "url": "https://play.google.com/store/apps/details?id=com.valvesoftware.android.steam.community&hl=en_GB&gl=GB",
        "checked": true
      },
      "pegi": {
        "value": "none",
        "url": "https://pegi.info/search-pegi?q=steam",
        "checked": true
      }
    },
    "risks": [
      {
        "title": "Games of every rating in one shop",
        "detail": "Steam sells games for every age, and Steam Families lets an adult choose which games a child's account can play.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      },
      {
        "title": "Chat and the community",
        "detail": "Steam has its own chat and community pages. Steam Families can restrict both on a child's account.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      },
      {
        "title": "Buying games and items",
        "detail": "Steam is a shop first. In a Steam Family a child can send their basket to an adult to pay for, and the adult approves it by phone or email.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      }
    ],
    "controls": [
      {
        "name": "Steam Families parental controls",
        "what": "An adult in the family chooses which games a child can play, restricts the Steam Store, community and chat, and sets playtime limits.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      },
      {
        "name": "Playtime limits and reports",
        "what": "Set how long a child can play and see a report of their playtime; they can ask for more, and an adult approves or declines on the computer or the Steam app.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      },
      {
        "name": "Child purchase requests",
        "what": "Your child sends their basket to you, and nothing is bought until an adult approves and pays.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      },
      {
        "name": "Child account recovery",
        "what": "An adult can recover a child's login once they have been in the family for 30 days.",
        "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4"
      }
    ],
    "setupSteps": {
      "sourceUrl": "https://help.steampowered.com/en/faqs/view/054C-3167-DD7F-49D4",
      "steps": [
        "On the Steam Store, open Account Details, then Family Management, and choose Create a Family.",
        "Choose Invite a Member, find your child's account, and add them as a child.",
        "In Account Settings, then Family Management, then Manage, open your child's entry and turn on Enable Parental controls.",
        "Choose which games they can play, which Steam features they can use, including the store, community and chat, and their playtime limits.",
        "Agree together how a request for more time or a new game will be answered, before the first one arrives."
      ]
    },
    "underAge": {
      "text": "",
      "sourceUrl": ""
    },
    "uncertain": [
      "Steam has no PEGI rating of its own as a store; each game on it carries its own."
    ],
    "similar": [
      "discord",
      "twitch",
      "minecraft",
      "call-of-duty"
    ],
    "checked": "2026-11-28"
  },
]

export function appBySlug(slug: string): AppEntry | null {
  return APPS.find(a => a.slug === slug) ?? null
}
