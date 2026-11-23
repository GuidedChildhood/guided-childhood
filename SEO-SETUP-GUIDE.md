# SEO setup guide

For Justin. Plain steps, in order. About an hour the first time, then 15 minutes a week.

What was built (PRs 1635, 1644, 1648, plus this one):

- **Foundations.** A clean sitemap (276 pages), robots.txt that welcomes Google, Bing and the AI search crawlers, proper titles and descriptions on every public page, structured data (Organization, WebSite, SoftwareApplication, FAQ), `/llms.txt` for AI assistants, and PostHog tagging of visits that come from ChatGPT, Perplexity, Gemini, Claude and Copilot.
- **The app safety guide.** `/app-safety-guide`, 20 app pages (`/is-tiktok-safe` and so on) and 200 age pages (`/is-roblox-safe-for-9-year-old` and so on). Each one has a direct answer, the app's own minimum age with its source, the settings to switch on first, the free TRUST check, FAQs, and the stage check at the end.
- **The school parent pack.** `/schools/parent-pack?school=Name` gives a school its own page, a newsletter blurb, a QR code and a tracked short link (`/go/<school>`).
- **Kept at ten every week (22 November).** Search is now lens 11 of the Friday review board (`.claude/agents/review-search.md`): eight parts of search scored out of ten, the skeptic challenges any nine or ten, and the gaps join the task list on the dashboard you already have. Vercel Speed Insights measures real phone speed on the public pages. IndexNow tells Bing (and so ChatGPT search and Copilot) when a page changes, by itself after each deploy.
- **The gum report knows about all of it.** The weekly Search Console report from the gum session (21 October) now reads the 220 app pages too, and folds the age pages to one line per app.

---

## 0. Monday, in order (about 45 minutes)

1. Search Console: add the Domain property (1.1), verify (1.2), submit both sitemaps (1.4), request the top 10 (1.5).
2. Bing Webmaster Tools: import from Search Console (section 2).
3. Ahrefs Webmaster Tools, free: ahrefs.com/webmaster-tools, sign up, choose **Import from Google Search Console**. It audits the site every week and shows who links to us. Send Claude a screenshot of its health score and backlinks.
4. Vercel Speed Insights: Vercel, project **guided-childhood**, **Speed Insights** tab, **Enable**. The code is already in; it only starts counting once this is switched on.
5. PostHog: build the Search dashboard (section 3).

## 1. Google Search Console (30 minutes, once)

Search Console is Google telling you what people searched before they found you, and which pages it has indexed. Nothing else gives you that.

**First, check whether it already exists.** Go to search.google.com/search-console and sign in with the Google account you use for the business. If you see `guidedchildhood.com` in the property list at the top left, skip to step 1.4.

### 1.1 Add the property

Click **Add property** and choose **Domain** (the left box), not URL prefix. Type `guidedchildhood.com` with no www and no https.

Why Domain: one property then covers www, schools and app, and the gum script is already set up for it (`content/seo/config.json` says `sc-domain:guidedchildhood.com`).

### 1.2 Verify with DNS

Google shows a TXT record starting `google-site-verification=`. Copy it.

Add it wherever the domain's DNS lives:

- **If guidedchildhood.com uses Vercel's nameservers:** Vercel, your team, **Domains**, `guidedchildhood.com`, **DNS Records**, add a record. Type `TXT`, Name `@` (or leave blank), Value the text you copied. Save.
- **If it is still at GoDaddy:** GoDaddy, My Products, `guidedchildhood.com`, **DNS**, Add, Type `TXT`, Host `@`, Value the text, TTL default. Save.

Not sure which? In Vercel's Domains page, a domain using Vercel's nameservers shows its DNS records there. If it says the nameservers are elsewhere, use GoDaddy.

Back in Search Console, click **Verify**. It can take a few minutes, sometimes an hour. If it fails, wait and press Verify again. Do not delete the TXT record after it works: Google checks it now and then.

### 1.3 The fallback, if DNS is a pain

Choose **URL prefix** instead, type `https://www.guidedchildhood.com`, and pick the **HTML tag** method. Google gives you a tag like `<meta name="google-site-verification" content="abc123..." />`. Copy only the part inside `content="..."`.

In Vercel, project **guided-childhood**, Settings, Environment Variables, add:

- Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Value: the code you copied
- Environments: Production

Redeploy, then press Verify in Search Console. The site already has the slot for it. Then do the same for `https://schools.guidedchildhood.com` as a second URL prefix property, and change `siteUrl` in `content/seo/config.json` to match (tell Claude, it is a one line change).

### 1.4 Submit the sitemaps

In the property, left menu **Sitemaps**. Add each of these and press Submit:

- `https://www.guidedchildhood.com/sitemap.xml`
- `https://schools.guidedchildhood.com/sitemap.xml`

Status should say **Success** within a day. "Couldn't fetch" on the first try is common: try again the next day.

### 1.5 Request indexing for the top 10

Paste each into the search bar at the very top of Search Console, wait for the result, then click **Request indexing**. Google allows roughly ten a day, so these are the ten:

1. `https://www.guidedchildhood.com/`
2. `https://www.guidedchildhood.com/app-safety-guide`
3. `https://www.guidedchildhood.com/is-roblox-safe`
4. `https://www.guidedchildhood.com/is-tiktok-safe`
5. `https://www.guidedchildhood.com/is-snapchat-safe`
6. `https://www.guidedchildhood.com/is-youtube-safe`
7. `https://www.guidedchildhood.com/is-whatsapp-safe`
8. `https://www.guidedchildhood.com/is-minecraft-safe`
9. `https://www.guidedchildhood.com/guides`
10. `https://www.guidedchildhood.com/starter-pack`

Do not try to request all 276. The sitemap does that job, and the app pages link to every age page.

### 1.6 The reports worth reading

- **Performance, Search results.** Queries (what people typed), Pages, clicks, impressions (times you were shown), average position. Set the date to the last 28 days and compare to the previous period.
- **Indexing, Pages.** How many pages are indexed, and why the rest are not. "Discovered, currently not indexed" and "Crawled, currently not indexed" are normal for weeks on a young site.
- **Experience, Core Web Vitals.** Should say Good. The pages are mostly static, so this is the least likely thing to go wrong.
- **Enhancements.** Shows the structured data Google found. Errors here are worth sending to Claude.

### 1.7 What good looks like

No numbers are promised here. The site is young, and parents searching "is TikTok safe" are mostly shown NSPCC, Internet Matters, Common Sense Media and the app companies themselves. The plan is to win the narrower questions first: a specific app at a specific age.

| When | Good looks like | A worry would be |
| --- | --- | --- |
| **30 days** | Both sitemaps say Success. The 20 app pages and the guide are indexed. Some age pages indexed, many still "discovered". The first impressions appear, mostly at position 30 and below. Few clicks. | Sitemap still failing, or the app pages still not indexed. Tell Claude. |
| **60 days** | Impressions climbing week on week. Long questions like "is roblox safe for a 9 year old" start showing at position 10 to 30. The gum report has striking distance rows. A handful of clicks a week. | Impressions flat at zero. Usually an indexing problem, fixable in code. |
| **90 days** | Some age questions on page one. Clicks every day, small but steady. The first stage checks started from a search page show in PostHog. Some visits tagged from ChatGPT or Perplexity. | Fewer than about a third of the age pages indexed. That means Google sees them as too alike, and the fix is to thin the set (see Risks). |

Search is slow and compounding. It is channel five of six in THE-STORY.md for that reason: it does not replace LinkedIn and the parent groups, it builds underneath them.

---

## 2. Bing Webmaster Tools (5 minutes, once)

Bing matters more than its share suggests: its index feeds ChatGPT search and Copilot answers.

1. Go to bing.com/webmasters and sign in (the same Google account works).
2. Choose **Import from Google Search Console**. Allow access, tick the guidedchildhood.com properties, Import.
3. It brings the sitemaps across. Check **Sitemaps** shows both. If not, add the same two URLs from step 1.4.

Do this after Search Console is verified, since it imports from it.

---

## 3. Where to see the traffic in PostHog

PostHog is already live (you added the key in Vercel during this work). Go to eu.posthog.com, project Guided Childhood.

**AI traffic.**
Product analytics, New insight, **Trends**. Event `Pageview`. Click **Breakdown** and choose `ai_source`. You will see rows for chatgpt, perplexity, gemini, claude, copilot, and "none" for everyone else. Save it as "AI visits".

A second way: event `ai_referral` counted per day is the number of visits that arrived from an AI assistant.

**Which app pages work.**
Trends, event `mini_check_done` (someone finished the TRUST check on an app page), breakdown by `app`. That tells you which apps parents actually care about.

Trends, event `Pageview`, filter **Current URL contains** `/is-`. That is all app page traffic.

**Did it lead anywhere.**
Product analytics, New insight, **Funnel**. Step 1 Pageview where Current URL contains `/is-`. Step 2 `stage_check_step`. That is search page to stage check, the number that matters.

**Schools.**
Trends, event `Pageview`, filter `utm_source` equals `school`, breakdown by `utm_campaign`. Each row is one school's link.

Pin all four to one dashboard called "Search" so the weekly check is one page.

Two things to know: PostHog drops bots, so Google's crawlers never inflate these numbers. And it is cookieless and anonymous by design, so it counts visits, not people.

---

## 4. The weekly 15 minutes (Mondays)

1. **Search Console, Performance (5 min).** Last 28 days against the 28 before. Look at Queries: anything new? Anything at position 8 to 20 (close to page one)?
2. **Search Console, Pages (2 min).** Is the indexed number going up?
3. **PostHog, the Search dashboard (5 min).** AI visits, app page visits, the funnel to the stage check, any school links in use.
4. **Hand it to Claude (3 min).** Either say "run the SEO pass" with a screenshot of the Queries table, or, once gum is set up on the Mac, run `npm run seo -- pull` and commit the file. The seo-gum skill turns it into a short list of page leads, each tied to something real in the product.

**gum** is optional and can wait. It is the tool from the 21 October session that lets Claude read Search Console for you. It needs a one time login on your Mac (steps in `.claude/skills/seo-gum/SKILL.md`, about 15 minutes) and no pull has been committed yet. Set it up once there are a few weeks of data, around mid December. Until then, the browser and a screenshot do the same job.

Once a month: re-read anything marked TODO-JP-REVIEW that you have not cleared, and check one app's settings page against the real app.

---

## 5. Suggestions

### Top 10 pages and tools to build next

Every one of these maps to something the product already does, which is the rule for any search page.

1. **The next guides.** The gum session built three at `/guides` and was waiting for search data to pick the next ones. First candidates: "how much screen time for a 7 year old", "should my child have a phone for secondary school", "how to stop a meltdown when screen time ends". Proof path: the scripts (shown locked), the stage check.
2. **Screen time by age pages.** `/screen-time-for-a-9-year-old` and so on, 4 to 16. Proof path: the stage check and the pathway stage for that age. A very common question with a real answer in the product.
3. **Device guide pages.** The roadmap box "public SEO pages generated from device guides and script problems". The device issues already written (`lib/content/device-issues.ts`) become pages like "how to set up an iPad for a 6 year old".
4. **Compare pages.** "YouTube or YouTube Kids for a 7 year old", "Roblox or Minecraft for an 8 year old". Built from the app data that already exists, so cheap.
5. **More apps.** Brawl Stars, Clash Royale, Telegram, Messenger Kids, Steam, Xbox, PlayStation, Nintendo Switch, Meta AI, Google Gemini. Each needs the same sourced research the first 20 had.
6. **A family phone agreement page that ranks.** "Family phone contract template UK" is a big search, and `/agreement` already exists. It needs the title, the copy and the template on the page for search.
7. **The under 16 rules explainer.** `/ban-workarounds` plus the `social_media_law` flag (docs/11), aimed at "what is the social media ban UK". It moves when the law moves, which is exactly what the flag is for.
8. **IndexNow.** Built 22 November: `npm run indexnow` and a GitHub workflow after each deploy tell Bing (and so ChatGPT search) which pages changed. To send every page once by hand: GitHub, Actions, IndexNow, Run workflow, tick "all".
9. **A named reviewer on the app pages.** "Checked by Justin Phillips, reviewed by [a DSL or a children's online safety professional]". Google judges child safety pages hard on who wrote them. One real reviewer is worth more than any wording change.
10. **The school pack, sent.** Every school that links its pack from its own site is a link from a trusted domain, which is the strongest thing for ranking a young site. This is outreach, not code: one email to the schools already in the pilot.

### Quick wins (this week, mostly yours)

- Search Console, both sitemaps, the top 10 requested (section 1).
- Bing import (section 2).
- Clear the 61 TODO-JP-REVIEW items in `plans/2026-11-22-app-safety-review-list.md`. Every one you confirm lets a fact show on the page instead of "see the source".
- Share `/is-roblox-safe` or `/app-safety-guide` once on the family account and LinkedIn as a free resource. Real visits and links help Google trust new pages.
- Put the app guide link in the next newsletter and in the starter pack emails.

### Risks, honestly

- **Google may not index all 200 age pages.** They share a shape, and Google holds back pages it thinks are too alike. If after 90 days fewer than about a third are indexed, keep the 20 app pages and the ages people actually search (the gum report shows which), and take the rest out of the index. This is a planned check, not a failure.
- **App rules change, sometimes more than once a year.** Every page shows the date it was checked. Recheck each app every three months, or when the news says it changed.
- **FAQ boxes in Google are rare now.** Since 2023 Google shows them mostly for government and health sites. The FAQ data is still there because AI assistants read it, but do not expect the drop down boxes in Google results.
- **AI answers can use the pages without sending a click.** robots.txt lets the AI crawlers in on purpose: being the source ChatGPT or Perplexity names is worth more to a young brand than hiding. The ai_source tag shows whether it pays.
- **Unchecked facts.** Nothing marked unconfirmed is shown as fact (the page links to the source instead), but 61 points are waiting for your eye.
- **Big competitors.** NSPCC, Internet Matters and Common Sense Media will keep the short searches. The age pages and the free check are where we can win, so that is where the effort goes.

### What to build next, in order

1. Wait two weeks for the first Search Console data. Building more pages before Google has indexed these teaches us nothing.
2. Next guides, picked from the first queries (idea 1).
3. The named reviewer (idea 9), before anything else for the app pages.
4. Screen time by age (idea 2), if the data shows age questions coming in.
5. IndexNow (idea 8): done.
6. More apps (idea 5) once the first 20 show which kinds of app parents search for.

---

## Every URL this work created

- `/llms.txt`
- `/app-safety-guide`
- `/is-<app>-safe` for 20 apps: tiktok, instagram, snapchat, whatsapp, youtube, youtube-kids, roblox, minecraft, fortnite, discord, pinterest, bereal, threads, twitch, character-ai, chatgpt, netflix, spotify, among-us, capcut
- `/is-<app>-safe-for-<age>-year-old` for each app and each age from 6 to 15 (200 pages)
- `/schools/parent-pack` (and `?school=<name or code>`, kept out of the index)
- `/go/<school>` (a redirect to `/starter-pack` with the school's tags)

The facts waiting for you: `plans/2026-11-22-app-safety-review-list.md` (61 items across the 20 apps). The plan: `plans/2026-11-19-seo-and-app-safety-pages-plan.md`.
