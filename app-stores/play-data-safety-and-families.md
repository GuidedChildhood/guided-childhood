# Google Play: Data safety, target audience and Families answers

Drafted 6 November 2026 from the code, not from the privacy policy, so where
the two disagree the code wins and the policy needs catching up (section 4).
Every answer carries the file that proves it. Fill the Play Console forms from
this file, in this order: App content, Target audience and content, Data
safety, Content rating, then the rest.

## 1. Target audience and content

**Target age groups:** 5 and under, 6 to 8, 9 to 12, 13 to 15, and 18 and over.

Why all of them, honestly: the parent side is for adults, and the child side
(`app/k/[token]`) is used by children from age 4 to 16. A child's link opens
inside this app on any Android phone that has it installed, because the app
claims the whole www.guidedchildhood.com domain. Children are in the audience,
so the Families policy applies to the whole app. We do not play that down.

**Does the app unintentionally appeal to children?** Not applicable: it
appeals to children on purpose, on the child side.

**Store presence:** opt out of the "Teacher Approved" and Kids tab programmes
for now (optional, extra review). The Families policy applies either way.

### How the app meets the Families policy

| Families requirement | Our answer | Proof |
|---|---|---|
| Ads only from Families self certified ad SDKs | No ads at all, no ad SDK | `package.json`; nothing matches AdMob, gtag, fbq, adsbygoogle |
| No advertising ID, IMEI, MAC from children | None collected anywhere | The Android wrapper has no SDKs beyond Google's own browser helper; the web app never reads device identifiers |
| No precise location from children | No location API is used anywhere | No geolocation call in the code |
| SDKs approved for child directed services | The Android package contains only `androidbrowserhelper` (Google). The site loads PostHog analytics on public marketing pages only, cookieless, never on a child page or inside an account | `lib/analytics/posthog-policy.ts` (`TRACKED_PATHS`), `components/Analytics.tsx` |
| Disclose all data collected from children | Section 3 below, child column | |
| No account creation for children | Children have no account and no password. A parent shares an 18 character link | token check in every `app/api/kid` route |
| Purchases not pushed at children | No purchases anywhere inside the app (consumption only, see `play-billing.md`). The child side has no shop and no payment link | |
| AI generated content: safe for children, users can report it | The child never chats with a model. Ages 10 and over can ask for one homework hint card, one call, fixed format, nothing kept, capped each day. Parent DiGi has an in app flag button. **Gap: the child's hint card has no report button yet** (section 5) | `app/api/kid/homework-help/route.ts`, `lib/homework/help.ts`, `/api/digi/flag` in `DigiChat.tsx` |

### What the child side collects, in plain words

- Nothing to sign in with. The child opens a link the parent shares.
- The child's first name, age band and birthday are typed by the **parent**, not the child.
- What the child does: ticks a job, asks for screen time, answers a lesson question, picks a buddy and colour, plays the planet game.
- What the child can type, all short and all shown to the parent: an idea for a job (60 characters), a step idea (80), a school item (140), a homework note (up to 2,000), and a wish and reason when asking to change the family deal.
- A homework photo or question, ages 10 and over only, sent once to the AI model (Anthropic) to make a hint card, then dropped. Not stored. Under 10 the button asks a grown up instead, with a push to the parent and no model.
- A push notification subscription on the child's device, if allowed.
- **The child never chats with a model.** `scripts/check-child-has-no-model.mjs` fails the build if any child page or child API route calls one, with the hint card the single, fenced exception (one call, no streaming, no chat history).

One honest gap worth knowing: if the hint card model judges a child's
question unsafe, the child is told to go to a grown up, but the parent is not
alerted and nothing is logged.

## 2. Data safety form: the top questions

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | Yes |
| Is all of the user data collected by your app encrypted in transit? | Yes. HTTPS only, on Vercel |
| Do you provide a way for users to request that their data is deleted? | Yes. In app: Settings, Delete account (`components/settings/DeleteAccount.tsx`). Web link for Play: https://www.guidedchildhood.com/privacy (the "How long we keep it" section says how) |
| Has your app been independently validated against a global security standard? | No |
| Does your app share data with third parties? | No. Under Play's definitions, sending data to a service provider that processes it on our behalf (Supabase, Vercel, Stripe, Resend, Anthropic, the embeddings provider, PostHog) is not sharing. We sell nothing |

## 3. Data safety form: each data type

"Collected" means it leaves the phone. "Ephemeral" means processed in memory
and not stored. Required means the feature cannot work without it.

| Play data type | Collected? | What it is | Ephemeral? | Required or optional | Purposes |
|---|---|---|---|---|---|
| Personal info: Name | Yes | Parent's name; children's first names typed by the parent | No | Parent name optional, child name required for a child | App functionality, Account management |
| Personal info: Email address | Yes | Parent's login and email | No | Required | App functionality, Account management, Developer communications |
| Personal info: User IDs | Yes | Account ID; Google or Apple sign in ID if used | No | Required | App functionality, Account management |
| Personal info: Address | Yes | Postal address, only for a printed shop order, taken by Stripe Checkout | No | Optional | App functionality |
| Personal info: Phone number | Yes | A child's phone number, optional, if the parent adds it | No | Optional | App functionality |
| Personal info: Other info | Yes | Children's age band, date of birth, interests; school region | No | Age band required, rest optional | App functionality, Personalisation |
| Financial info: Purchase history | Yes | Subscription status, shop orders | No | Optional | App functionality, Account management |
| Financial info: Payment info | No | Card details are taken by Stripe on Stripe's own page and never reach us | | | |
| Health and fitness: Health info | Yes | Wellbeing check ins on a child (mood, sleep and the like), only after the parent consents | No | Optional | App functionality, Personalisation |
| Messages | No | There is no messaging between users | | | |
| Photos and videos: Photos | Yes | A school letter photo (parent) and a homework photo (child, 10 and over), each read once by the AI model | **Yes** | Optional | App functionality |
| Audio | No | Dictation to DiGi uses the phone's own speech to text; we receive only the words | | | |
| Files and docs | No | | | | |
| Calendar, Contacts | No | | | | |
| App activity: App interactions | Yes | Jobs ticked, lessons and quizzes done, check ins, screen time asks; page views on public marketing pages (PostHog, anonymous) | No | Required | App functionality, Analytics |
| App activity: Other user generated content | Yes | Questions to DiGi and DiGi's memory of the family; the child's short notes and ideas; homework pasted for the decoder | No (except the hint card text, which is ephemeral) | Optional | App functionality, Personalisation |
| App activity: In app search, Installed apps, Other actions | No | | | | |
| Web browsing | No | | | | |
| App info and performance | No | No crash reporting or diagnostics SDK in the app | | | |
| Device or other IDs | Yes | The push notification subscription for this phone | No | Optional | App functionality |
| Location | No | | | | |

For each "Yes" above, answer **"Is this data shared?" No**, and **"Is this
data processed ephemerally?"** as in the table.

## 4. Fix the privacy policy before submitting

Play checks the Data safety form against the privacy policy. The code does
these things and `app/(marketing)/privacy/page.tsx` (dated 21 October 2026)
does not say so yet:

1. **A child's homework text or photo goes to Anthropic** for the hint card,
   ages 10 and over, not stored. The policy says children only get quests and
   that "your questions" go to Anthropic.
2. **The policy says "We do not ask for a photo".** Two features take one
   (school letter, homework hint), neither stores it.
3. **A child's phone number** can be added (`children.phone`) and is not in
   the list.
4. **The embeddings provider** (Voyage AI or OpenAI, whichever key is set in
   `lib/digi/embeddings.ts`) receives DiGi text and is not named.
5. **Shop postal address and personalisation** are not listed under payments.
6. **"Check ins kept for two years then removed"**: no job that does this was
   found. Either build the job or change the sentence.
7. **Suppression after deletion**: the email address is kept as a do not
   contact row after an account is deleted. Defensible, but say so.
8. Google and Apple sign in exist and the policy says only "login details".

## 5. Gaps in the product for Play, before the closed test

1. **Consumption only mode** (no upgrade links inside the app). See `play-billing.md`.
2. **A report button on the child's hint card.** Play's AI generated content
   policy asks for in app reporting of offensive AI output. Parent DiGi has
   one (`/api/digi/flag`), the hint card does not.
3. **A reviewer account.** Play Console, App access: the app opens on a login
   screen, so give Google a test parent login with full access and one child
   link. Make it a fresh account with sample data, never a real family.

## 6. Content rating (IARC questionnaire)

Category: Reference, News or Educational (closest fit; it is not a game).
Violence, fear, sex, language, drugs, gambling: No to all.
Users can interact or exchange content: Yes, but only within one family
(a child's asks and notes go to their own parent). No public chat, no
strangers.
Shares the user's location: No.
Digital purchases: No (none inside the app).
Expected result: PEGI 3 / Everyone.

## 7. Other App content declarations

- **Ads:** No ads.
- **Government app:** No. **Financial features:** None. **News app:** No.
- **Health apps declaration:** the wellbeing check in is not a medical
  feature. If the form asks, choose the wellness option and state that it is
  a parent's record of how a child is doing, with no diagnosis or treatment.
- **Account deletion:** Yes, in app and by web link (above).
