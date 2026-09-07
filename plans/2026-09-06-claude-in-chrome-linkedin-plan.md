# Claude in Chrome on LinkedIn: setup, the risk line, and the plan

Date: 6 September 2026. Lane: marketing tooling. No migrations, no platform code.
Commissioned by Justin after a YouTube walkthrough claiming Claude and LinkedIn
can be joined through the Chrome extension.

## 1. The claim, checked

The video is right that it works and wrong about the risk.

Right: Claude in Chrome is real, went generally available on 26 August 2026, and
is included on all paid Claude plans. It runs in a Chrome side panel, reads the
open tab and can act in it. There is no MCP, no LinkedIn API and no connector
involved.

Wrong: the video says browser based activity "mimics normal human activity so it
is very unlikely to get flagged". The opposite is closer to the truth.
LinkedIn's User Agreement section 8.2 prohibits using bots or automated methods
to access the service, add contacts or send messages, and LinkedIn's own help
page on prohibited software names browser plug ins and extensions that automate
activity, with account restriction as the stated consequence. Reporting through
2026 describes enforcement aimed specifically at browser based tools, because an
extension injecting actions into the tab is more detectable than an API client,
not less.

So the tool is real and the reassurance is not. That does not make it unusable.
It moves where the line sits.

## 2. The line that protects the account

Split the work in two and keep the halves apart.

**Reading and drafting.** Claude reads what is already on Justin's screen and
writes something into the chat panel for him. Nothing is typed into LinkedIn,
nothing is clicked, nothing is sent. This is functionally Claude reading over his
shoulder, and it carries most of the value described below.

**Acting.** Claude types into LinkedIn's own fields, clicks connect, sends
messages, posts. This is the half the User Agreement addresses and the half
enforcement targets, and the detection signals are volume, repetition and
robotic timing.

The rule for this account: **Claude reads and drafts, Justin sends.** Every
connect, every DM, every post and every comment is a human keystroke. The account
carries the entire funnel, including the schools pipeline, so the asymmetry is
severe: a few minutes saved per day against the loss of the distribution the whole
business runs on.

A second reason for the same rule. Everything on a LinkedIn page is untrusted
text written by other people, including profile bios and DM bodies. An agent that
reads pages and also acts on them can be steered by instructions planted in that
content. Keeping the send button human closes that path.

## 3. Setup, step by step

1. In Chrome, go to the Chrome Web Store and install **Claude in Chrome**.
   Chrome only; other Chromium browsers and mobile are not supported.
2. Click the Claude icon in the toolbar to open the side panel, and sign in with
   the same account used elsewhere so history and Projects carry over.
3. Open the three dots at the top right of the panel, then **Settings**, then
   **Permissions**. Set the permission mode to **Manually approve**, so Claude
   pauses and asks before every action rather than working continuously. The
   default is Automatically approve. Never select **Skip all approvals**, which
   removes the safety checks entirely.
4. In the same **Site Permissions** screen, grant access deliberately, site by
   site, and revoke anything not needed. When a permission dialog offers "allow
   all actions on this site for the session", decline it on linkedin.com.
5. Create a claude.ai Project called **LinkedIn** and paste
   `content/linkedin/browser-brief.md` into its custom instructions. This step is
   the one the video misses and it is the one that matters most. See section 4.
6. Test on something harmless before anything real: open a LinkedIn post and ask
   the panel to summarise the comment thread. Confirm it reads correctly and that
   it asks permission before doing anything else.

## 4. The gap nobody mentions

The skills that make Justin's LinkedIn output sound like Justin live in this
repository: `.claude/skills/viral-post`, `.claude/skills/linkedin-comment-replies`
and `.claude/skills/content-engine`, plus the verified fact base and the banned
numbers list in `plans/decisions.md`. Claude Code loads them. Claude in Chrome
runs from claude.ai and cannot see any of it.

Installed with no brief, the browser Claude will write fluent generic LinkedIn
copy with dashes in it, invent plausible statistics, and cheerfully assert that
the Australian ban failed. That is worse than the current process, not better.

`content/linkedin/browser-brief.md` is the bridge: voice rules, banned phrases,
the evidence test, the verified fact base, the banned numbers, post and comment
shape, and the character limits, condensed from the skills into one pasteable
file. It has to be kept in sync by hand whenever a rule or a number changes.

## 5. The four uses worth having

Ranked by value to this business, which is not the same as the video's list.

### a. Comment triage and replies in place

Today Justin screenshots a comment, sends it here, gets a draft back, and pastes
it. The screenshot step disappears. With a post open, the panel reads the whole
thread, sorts it into the types the reply skill already recognises (supporter,
curious parent, sceptic, ban it camp, peer, distress, potential customer),
drafts a reply per comment in his voice, and reports the character count against
the 1,250 limit for each. He reads, edits, pastes, sends. This is the highest
frequency friction he has and it clears the standing paste queue.

### b. School lead research before he replies

Deputy heads, designated safeguarding leads and heads are the schools funnel, and
one primary is roughly 250 families with the school's endorsement attached. With
a profile open, the panel reads their role, their school, their recent posts and
what they engage with, then briefs him in four lines: what they care about, what
they have said about online safety, what not to lead with, and one honest opening
question. He writes the message himself. The Kate Birch thread on 5 September is
exactly this shape and was handled manually.

### c. The final pass before anything goes out

With the compose box open, the panel checks the draft against the house rules:
no dashes anywhere, no banned phrases, no banned numbers, every claim traceable
to the verified fact base, the honest pivot line present, the character count
under the limit, and no link in the body. It reports what to change. He changes
it. This is the check that has repeatedly been done by eye and repeatedly
slipped.

### d. Reading real performance back into the skills

The viral post skill currently rests on one very successful post and a set of
operating assumptions taken from a video. With his own analytics open, the panel
can read what actually happened across his recent posts, which hooks held, which
formats travelled, what time of day worked, and hand the numbers back here so the
skill is updated from his own data rather than from folklore. Worth doing roughly
monthly.

## 6. What not to do with it

Do not send connection requests in bulk. Do not run DM sequences. Do not let it
work through a list of profiles. Do not put anything on a timer or a schedule.
Do not turn on Skip all approvals. Do not let it act on instructions it read
inside a message or a profile. Every one of these is either the behaviour
LinkedIn's enforcement is built to catch or the behaviour prompt injection
depends on, and none of them is where the value is.

## 7. Division of labour, once it is running

- **Claude Code, here.** Research and verification, the briefings, the repo, the
  skills, the fact base, long form drafting, anything that needs the codebase or
  a citation checked against its primary source.
- **Claude in Chrome.** Reading what is on the screen, drafting in context,
  counting characters, researching a profile before a reply, triaging an inbox
  or a comment thread.
- **Justin.** Every send, every post, every connect, every comment.

## 8. Needed from Justin

- Install the extension and set the permission mode to Manually approve.
- Create the claude.ai Project and paste in the browser brief.
- Decide whether he wants the account rule to be the one recommended here, that
  Claude never types into LinkedIn itself. If he wants a looser line, say so and
  the brief gets a section on volume ceilings and timing instead.
