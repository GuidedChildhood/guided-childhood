"""Builds the two read card decks for 7 October 2026 from every script written
for Justin to say out loud (swept from the repo and Drive on 7 October).
Run: python3 tools/read-cards/deck-2026-10-07.py  then
     node tools/read-cards/build.mjs content/read-cards/2026-10-07-main.json content/read-cards/2026-10-07-main.pdf
Sources are named on each piece. Scripts are reproduced as written; only the
chunking into cards is new. No dashes anywhere."""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from chunk import cards

COVER = [
    "One clip per card. Hold up the card number on your fingers for one second, then say the card. Pause two seconds before and after. Mistakes do not matter: say the line again on the same clip and carry on. I cut the pauses, the retakes and the finger counts.",
    "Setup, every time: kitchen table, window in front of you (never behind), phone upright on a stand at eye level, an arm's length away, 1080p or 4K at 30 frames. Wipe the lens. Vertical for Instagram, Facebook, TikTok and Shorts. Landscape for YouTube and the one to one video. Nobody else in frame. No child's face, ever.",
    "Say it to one person you know, not to everyone. The second take is usually the one. Three takes of a card at most. Finish each social piece with the hook exactly as written on its last card.",
    "AirDrop the clips to the Mac uncut, or drop them in Drive, 05 New Footage Inbox. Do not trim in Photos. I do the rest: cut, caption, titles, the cream and ink frame, and the vertical and landscape versions.",
    "Order below is the order to film. The first block is this week. Film in one sitting on Saturday if you can; the three handover pieces first, easiest to hardest.",
]

HOOK = "What stage is your child? Three questions, no sign up."

def piece(id, title, platform, length, setup, text, extra_cards=None, limit=170):
    cs = cards(text, limit)
    if extra_cards: cs += extra_cards
    return {"id": id, "title": title, "platform": platform, "length": length, "setup": setup, "cards": cs}

main = {"title": "Read cards: everything to record, October 2026", "printed": "7 October 2026", "cover": COVER, "pieces": []}
P = main["pieces"].append

# ---------- A. This week ----------
P(piece("H1", "Handover post 1, the heads up", "Family Instagram and Facebook, Monday", "45 seconds to camera, vertical",
    ["Film first. Warms you up.", "Thumbnail frame: you mid sentence, the first cake topper on the table.", "Natalia is named in card 1: she has said yes before this goes out.", "Source: content/packs/2026-10-02-handover-justin-only"],
    """Hi. I'm Justin. If you have followed this account for a while you probably know Natalia better than me. She was the one you saw. I was behind the scenes, building things.

In two weeks this account is going to change its name. I wanted to tell you before it happened, because a lot of you have been here since the beginning.

Nothing is being deleted. Ten years of cake toppers and weddings are staying exactly where they are.

But our children grew, and the questions changed. Phones. YouTube. Gaming. Now AI. We built something for that, for our own family first.

Over the next fortnight I will tell you the whole story, from the bedroom in 2015 to now. If you came for cake toppers, I hope you stay."""))

P(piece("H5", "Handover post 5, the new name", "Family Instagram and Facebook, the day the handle changes", "30 seconds to camera, vertical",
    ["Film second, while fresh.", "Thumbnail: you holding up the phone with the new bio on screen (film that frame even if the bio is not changed yet; hold the phone up anyway).", "Also film a ten second screen recording of the bio changing on the day."],
    """Today this account becomes Guided Childhood.

Same family. Same hands. For ten years we made things out of card and sugar. Some of them still are. Some of them now run on a phone.

Over the next few weeks I will show you what it actually does. One thing at a time. Starting Friday."""))

P(piece("H3", "Handover post 3, the bit we do not usually say", "Family Instagram and Facebook, Friday", "90 seconds to camera, vertical",
    ["Film last in the sitting, when you have stopped noticing the camera.", "Plain. No performance. Do not dress it up.", "Thumbnail: you looking down, hands on the table.", "Olga is named in card 1: your yes is needed before it posts. Teo is not mentioned."],
    """With Alma it never really came up. With Olga it did.

YouTube turned into a battle. And it was not just about the screen. The mood of the whole house moved with it. The tone of the afternoon depended on how the handover went at five o'clock.

Then Covid happened. Two little girls at home. A business that was our living. Orders that still had to go out.

And I am going to say the thing most parents I know did, and almost none of us say out loud. We used YouTube as a babysitter. To survive.

Not every day. But enough. And I felt guilty every time, and then guilty about feeling guilty, because what was the alternative that week.

I am not going to blame YouTube. It was doing a job that needed doing. I needed those twenty minutes.

And I am not going to say it was all fine, because if I thought that we would not have built anything.

Nobody had built the version of that tool that also taught them something, or gave the time back on purpose, or made switching it off the start of something instead of a fight. So we built that.

Did you do the same in 2020? You can tell me. Nobody here is judging."""))

P(piece("H6", "The stage check, voice over the screen", "Family post 6, the LinkedIn Wednesday post, Reels and Shorts: one clip, used four times", "30 seconds, screen recording with your voice",
    ["Screen record your own phone doing the three questions at guidedchildhood.com/starter-pack, start to result.", "Read the cards while you tap. Quiet room; the phone mic is fine.", "Then a second clip: camera on you at the table, phone in hand, doing the same thing. No child's face."],
    """Three questions. No sign up.

How old they are. What the fight is about in your house. How much time you have.

It tells you which of five stages your child is at, and gives you one thing to say tonight.

That is the whole front door. Everything else we built sits behind it."""))

P(piece("S2", "The Social Billboard demo reel", "Social Billboard Instagram Reel and Facebook, post 2", "25 to 35 seconds: five seconds of you, then a screen recording with your voice",
    ["Card 1 is to camera. Cards 2 to 5 are read over a screen recording of the real product: the criteria controls, the playlist preview, the Discovery shelf, the free offer.", "Only show screens that exist in the product today. If the playlist takes time to build, say so; do not cut to pretend it is instant.", "Holds until the site links are fixed. Film it anyway; it waits ready.", "Source: Social Billboard parent launch plan, 30 September, Post 2"],
    """Here's what I mean by a playlist built around your choices.

You choose the age band, tone, type of content, time of day and how long you want the playlist to run.

Then you can look through the selection and decide whether it fits your child.

There are also hand curated Discovery playlists matched to their age band.

The first playlist is free, with no card needed. Try it, then tell me the one thing you'd change."""))

P(piece("S5", "Why I built this, chapter 1", "Social Billboard Instagram Reel and Facebook, any day you have filmed", "40 seconds to camera, vertical",
    ["Window light, plain wall or the kitchen. The seven cards are the carousel words, said to camera.", "Source: tools/tsb-playlist-card/decks/series-01-why-i-built-this-ch1.json and plans/sb-parent-launch-control.md"],
    """Justin, dad of three. I was never worried about the first video.

YouTube has extraordinary things on it for children. I still think that. My three have learned real things from it.

Then a video about relationships turned up in the recommendations. I hadn't gone looking for it. The recommendations brought it.

A parent chooses the first video. Who chooses the next one?

I watched my children go from one video to the next in ways I could never have guessed. And I saw how little say a parent has over where a run of recommended videos ends up.

That question is why I built The Social Billboard.

What does your child usually watch after the video you chose? Tell me in the comments. I read every one."""))

P(piece("S7", "I tried it as a dad", "Social Billboard Instagram Reel and Facebook, the product demo", "Face to camera opener and closer around a screen recording",
    ["Card 1 to camera. Then screen record: sign in (blur the email later, I do that), choose the age band saying it out loud, content type, tone, time of day, 20 minutes. If it waits, let it wait. The playlist appears: scroll it, read two titles out loud. Play the first for two seconds, then go to the end of the last video and show what happens.", "Card 2 to camera at the end.", "The last step is also the test of what happens at the end of a playlist; film it even if nothing else works.", "Source: plans/sb-parent-launch-control.md"],
    """I've got twenty minutes and one of mine wants space. Let's see what this gives me.

That's it. First one's free, no card. Tell me what you'd change."""))

P(piece("S6", "Top 5 review show, episode 1: space", "Social Billboard TikTok, Reels and Shorts, this week", "60 to 70 seconds to camera, one take, front camera",
    ["Plain wall, window light. One take; the five picks go at about nine seconds each.", "Every line in square brackets is a suggestion: replace it with what you actually saw in that video. Only say what you watched.", "Waits on the Space playlist being live in Discover and the site links fixed.", "Source: content/ugc/sb-top-five-review-show.md"],
    """If you're sick of scrolling YouTube trying to find something your child can actually watch, these are the five space videos that made this week's playlist. We opened eighteen. Only five made it.

I'm Justin, dad of three. Follow for a new playlist every week, and tell me your child's age in the comments.

Number 5. Testing a space telescope. [How do you test something you can't fix once it's in space? This shows you.] Go and watch it.

Number 4. Tim Peake's space station tour. [A real astronaut, showing you where he slept and ate.] Brilliant.

Number 3. The Moon. [Everything they ask you about the Moon, in one go.] Go and see it.

Number 2. 8 planets, 8 experiments. [Eight experiments you can do at the kitchen table.] Get the kids doing this one.

Number 1. Start stargazing. It's top of the list because it ends with them going outside. The Draconids peak this Friday, just after dark. No telescope. Just a coat.

Get this week's playlist free. Link in bio."""))

# ---------- B. One to one ----------
P(piece("P1", "Reply to Penny at VotesforSchools, the smart glasses discussion", "One to one video, sent to Penny for the pupils, not published", "55 to 70 seconds to camera, landscape, calm",
    ["Landscape, chest up, window light in front, plain top with no logo. Say card 1 twice.", "This is the 30 September version, which replaced the earlier cards: no Meta product lines, and the name is Guided Childhood, not Guided Digital Childhood.", "Confirm the fifty nine thousand figure with Penny before it is sent.", "Source: Drive, Daily Briefs, 2026-09-30 morning brief"],
    """Hi, I'm Justin Phillips, founder of Guided Childhood.

Thank you to the 59,000 pupils who discussed smart glasses.

You considered how they might help someone with sight loss, and what happens if people nearby are filmed without agreeing.

That is the important tension. A feature can be useful for the person wearing the glasses and still create a difficult question for somebody else. You considered both people.

We already teach children about AI, privacy, permission and difficult digital choices. Your feedback will help us draft a smart glasses lesson about helpful uses, recording, distraction, accessibility and what device makers should do. We'll show you how your ideas shaped it.

Teachers, if you would like to see or pilot the lesson free, please get in touch through VotesforSchools.

Thank you, everyone. Next time, I'd love to introduce some of our Planet Friends, who help children explore life online."""))

# ---------- C. LinkedIn, when you want a video instead of text ----------
P(piece("L1", "Everyone asked for Hey DiGi", "LinkedIn, Justin's profile, the second DiGi talks back post", "60 seconds to camera, kitchen, phone in hand",
    ["Kitchen, phone in your hand, landscape or square.", "Optional: the text post is the alternative.", "Source: content/packs/2026-10-02-digi-talks-back/linkedin-posts.md"],
    """Everyone asked us for a 'Hey DiGi'. We said no.

A wake word is a microphone listening all day in your home.

So instead, you tap, you talk, it says back the one line to say to your child, and one tap shuts it up.

It is off until you turn it on. Hands free only while the page is open. No recordings kept.

The browser does the listening, so Google or Apple turn your voice into words, same as your keyboard mic.

I would rather tell you that than bury it. What should the tech in your house never do?"""))

P(piece("L2", "The strongest predictor (In Proportion, founder video)", "LinkedIn Sunday founder slot", "60 seconds face to camera, one continuous take if you can",
    ["Real home setting, warm light. Say the blame line straight down the lens.", "Source: content/packs/2026-07-17-not-the-phones-verified/post5-founder-video-script.md"],
    """[Still. Straight to camera] The strongest predictor of your child's mental health is not their phone. It is not their school.

[Small pause] It is the mental health of the adult raising them. And almost nobody is legislating for that.

[Softer. Right down the lens] That comes from Candice Odgers, one of the calmest researchers in this field. And I want to hold it gently, because it sounds like blame and it is the opposite of blame.

A parent under financial strain, or grief, or their own anxiety with a two year wait for help, is not failing their child. They are carrying something heavy with almost no support.

[Beat. Wry] Now look at where the money goes.

[A touch faster] Six platforms made close to eleven billion dollars in one year from advertising to children. Your child is not the customer. Your child is the product on the shelf.

[Slow back down] None of this means phones do nothing. But if we spend the whole decade fighting the thing in a child's hand, we will miss the things doing the real damage.

[Warm, direct] Look after the adult in the house too. Then build the real world back up, one brick at a time. Follow along for the rest."""))

P(piece("L3", "The children's own voice (Children and AI, day 7)", "LinkedIn Sunday founder slot", "60 seconds face to camera",
    ["Plain background. Captions and the lower third are added after.", "The figures are from Girlguiding 2025; the sources are in the pack. Check them still stand before this goes out.", "Source: content/packs/2026-07-17-children-and-ai/linkedin-posts.md"],
    """Only 15 percent of girls aged 10 to 16 in the UK think a ban would actually make them safer. Ask them what they want instead, and 69 percent say the same thing. They want to know the platform itself is safe.

This is In Proportion, continued. We have spent this whole series on what the researchers found. Let me end it on the group we keep talking over. The children themselves.

Girlguiding asked them in 2025. Fifteen percent think a ban would make them safer. 62 percent say a ban feels less like protection and more like punishment.

And a clear majority would rather the thing in their hand were built to be safe than have it taken away. That is not a child begging for a screen. That is a child asking to be trusted and taught, which is a very different thing.

It fits what Mimi Ito has been saying for years. It is not the device, it is the activity. A blanket rule cannot tell the difference between a child hiding and a child learning, because it never asks. The children can tell the difference. They are asking us to.

None of this means children should write the policy. They should not, and wanting something is not the same as it being good for you. Adults hold the line. That is the job.

But when 85 percent of the children a rule is built for do not believe it will protect them, and most of them can tell you exactly what would, an adult who is actually listening writes a different plan.

Not a wall. A pathway you walk with them. The tools made safer, the child taught to see the machinery, the home built up beside the screen so it is not the only warm place in the house.

That does not promise a perfect child. It promises a calmer home, and a child who arrives at sixteen ready instead of blindsided.

That is the whole of it. Listen to the count. Then listen to the children. They have been telling us the answer while we argued about the ban."""))

P(piece("L4", "The age rating is not the whole safety system (GDC-029)", "LinkedIn first, then Instagram and Facebook", "55 to 70 seconds, one natural vertical take, five sections",
    ["Record only once the GDC-029 post is approved. Props: two or three seconds of the eSafety report title page on screen, and a real notebook page reading GAME, MODE, CONTACT, MODERATION, EXIT and REPORT.", "Source: Drive, GDC Daily Content Pack, 2 October"],
    """A parent can ask, "Can they play Minecraft?" and still be asking the wrong sized question.

Australia's eSafety Commissioner has just looked behind Roblox, Minecraft, Fortnite and Steam. The report shows that experiences we group together as gaming can have very different age checks, chat features and moderation.

So I've stopped asking only which app or game a child uses. I want to know what they can actually do inside it. Who can contact them? Can chat move somewhere private? Who moderates the space? Can they block and report?

That is why Guided Childhood is being built around capabilities, not an approved app list. Two children can name the same game and be having very different digital experiences.

The platform has the first responsibility to make the environment safer. But an age rating is not the whole safety system."""))

# ---------- D. YouTube, on hold until the site links are fixed ----------
P(piece("Y1", "YouTube video 1: how we check a channel before your child watches it", "The Social Billboard YouTube channel", "About three minutes: you to camera plus a screen recording of a real check",
    ["Landscape. The hook in the first fifteen seconds, the ask by ninety seconds and again at the end.", "Film a screen recording of one real channel check for the middle section.", "On hold until the site links resolve and the channel decision is made. Film it when you film the rest; it waits.", "Videos 2 to 4 are outlines only; I write them before you film them.", "Source: content/packs/2026-10-01-launch-content-pack/README.md Part 4"],
    """Every "safe for kids" list has the same problem. Nobody tells you how they decided. I am Justin, a dad of three, and this is the method we use, the same way every time, with the date on it.

The three hard gates. Child safety. The broadcaster test. Where the content leads. A channel that fails any gate is out before we look at anything else.

[Screen recording of a real check starts here] After the gates: age fit, teaching quality, tone and pacing, purpose.

Your first playlist is free, link below.

The honest limits. A single mild word in one video. Open comments on YouTube. What we re check and how often.

If you want to see what happens after the video ends on YouTube Kids versus one of these playlists, that is the next video."""))

json.dump(main, open("content/read-cards/2026-10-07-main.json", "w"), indent=1, ensure_ascii=False)

# ---------- Appendix: the long series, optional ----------
appx = {"title": "Read cards, appendix: the founder series and the interview, optional", "printed": "7 October 2026",
    "cover": ["Written in July 2026 for a ten episode series before launch, never recorded. Kept here because the words are good and the interview is the raw material for every founder story. Film these only after the main deck is done.",
              "Episodes are voice over for drawn films or straight to camera. Where a card says YOUR TRUTH, the words are yours: answer the matching interview question in your own words, one story, as short as you like."],
    "pieces": []}
A = appx["pieces"].append

A(piece("Q", "The interview: fifteen questions, answered once, unscripted", "Raw material for the founder series and every founder post", "As long as each answer takes; one take, do not edit",
    ["Phone on the table, you talking. One story per answer. Say the number first.", "Share only what you are willing to share. Nothing here goes out without your yes.", "Source: content/packs/2026-07-15-founder-journey/02-interview-sheet.md"],
    """1. The day you noticed your daughter had changed. Not the theory, the afternoon. Where were you, what did you see, what did you first assume?

2. What did you feel before you knew anything? The parent fear, before the founder plan.

3. When you went looking for answers, what were you told, and by whom, and why did you not believe it?

4. What was the single finding in two years of research that stopped you cold and made you think, everyone is building the wrong thing?

5. Why you? What is it about your own life, your own childhood, your own family, that made this yours to build and not just a business idea?

6. When you say the real drivers are poverty and adverse experiences and the mental health of the adults, is there something in your own family that makes you believe that in your gut, not just from the data? Only share what you are willing to.

7. What do you want to have built by the time your daughter actually needs it? Say it to her, not to the camera.

8. The fifteenth of June, the day the ban was announced. Where were you? What was the first hour like, knowing you had built for this and now had to deliver it?

9. The night the whole site went down during the fundraise. What actually went through your head when you saw every page was broken? Be honest about the fear.

10. When someone implied you only believe this because you are selling something, how did it land? What did you want to say back, and what did you choose to say instead?

11. Why schools, when selling to parents would be easier? Who is the specific child you are picturing when you build the schools side?

12. What has this cost you? Time, sleep, money, moments with the family. Warts and all.

13. What is a moment you nearly quit?

14. Who has been in this with you? Name them if they are happy to be named.

15. What is the thing you are most proud of that nobody would ever notice?""", limit=400))

EPISODES = [
("E1", "Episode 1: the day I noticed my daughter had changed", """I did not set out to build a company.

I set out to understand what happened to my daughter.

[YOUR TRUTH: the small specific moment, interview answer 1]

Everyone around me had the same answer. It is the phones. Take them away.

But I could not shake the feeling that the easy answer was hiding a bigger one.

So I did the thing almost nobody does. I went to check if it was even true.

Everyone told me it was the screens. What I found made me angrier than the screens ever did."""),
("E2", "Episode 2: it was never the hours", """Back in 2012, a paper predicted that social media would become the next thing we blame our children's problems on.

That was published fourteen years before the ban.

So I spent two years reading the actual evidence. And here is the quiet part.

The things doing the most damage to children's mental health are poverty, hard experiences at home, and the mental health of the adults raising them.

The screen is real. But it is a smaller piece than the noise around it.

I am not dismissing the harm. I am pointing at the proportion.

The people I trust on this, Odgers, Orben, Przybylski, Ferguson, have been saying it for years.

[YOUR TRUTH: the one finding that stopped you, interview answer 4]

If it was never really about the hours on the screen, everyone was building the wrong tool.

So I decided to build the right one. With no money, no team, and a daughter watching."""),
("E3", "Episode 3: not a wall, a pathway", """The ban takes the apps away at sixteen.

Nobody is asking the obvious question. Ready for what, and built how?

A wall is not a plan.

So I built the opposite of a wall. A pathway.

Social media arrives at sixteen. Ready is built from age four, one stage at a time.

And a friend to walk it with. This is DiGi.

DiGi never just says no. It always gives the next small step.

Arriving with habits beats arriving with rules.

I am building all of it alone, at night, with no money. Fifty founder places, and I capped it in the code so I can never cheat it.

I had a plan for a world that did not exist yet. Then on the fifteenth of June, the government did the one thing that could make it, or break it."""),
("E4", "Episode 4: I built for a ban I did not know was coming", """On the fifteenth of June, the UK confirmed a full social media ban for under sixteens.

And I realised I had already built for it. Before I knew it was coming.

On the first day of this whole project, I put in one switch. A setting that let the entire product respond to a ban without a rewrite.

I had architected for a future I could not have known was weeks away.

[YOUR TRUTH: where you were when you heard, interview answer 8]

Suddenly I did not have years. I had weeks.

I had built for the ban before it existed. But building in public, alone, with real families already using the site, is a special kind of chaos.

And that week, I nearly lost all of it in a single day."""),
("E5", "Episode 5: the part nobody puts in the launch video", """Two things went wrong on the same day, and either one could have ended it.

The work was moving fast, with help running in parallel. And two streams quietly built the exact same thing twice.

A week of effort, duplicated. Gone.

And on the same day, I found the live database, with real families on it, had quietly fallen ten steps behind where it should have been.

Both were caught. Both were fixed. Calmly. But it was close.

This is the messy part nobody puts in the launch video. I am showing you because you should see who is building the thing you might trust with your kid.

I patched it, verified every record, and went to bed. The build survived.

But the thing I was most proud of, the front door, still was not good enough. So I tore it down. Five times. In one day."""),
("E6", "Episode 6: basic and AI looking, start again", """My own note on my own homepage was two words.

Basic, and AI looking.

So I deleted it and started again. Then again. Then again. Five times in one day.

I would not ship a front door that felt like a template made by a machine.

Clear like the apps my kids love. Warm like the best people in parenting. Made by a person who cared.

Even the small things. No black backgrounds. A booklet a child would actually want to keep. No dashes, anywhere, ever.

[YOUR TRUTH: why the detail matters to you]

It finally looked like something a real person made with love. It was beautiful.

And then a real person tried to use it, and the entire thing went down."""),
("E7", "Episode 7: every page, one error, fundraise live", """The site was live for the fundraise.

Then it returned one error. On every single page. And I had no idea why.

It turned out the updates had been quietly failing for a week. So a week of changes all shipped at once and buried the very pages I needed live.

The waitlist investors were meant to see. Gone.

[YOUR TRUTH: what went through your head, interview answer 9. Be honest about the fear]

So I did the only thing you can do. I did not panic. I found the last version that worked, rolled the whole site back to it by hand, and locked it so it would hold.

Then I gave the new platform its own separate home, so it could never take the front door down again.

I got it back at two in the morning.

I thought that was the hardest thing that would happen that week. Then someone tried to discredit me publicly, and it had nothing to do with the code."""),
("E8", "Episode 8: they said follow the money, so I did", """The message said, follow the money.

It implied I only believe what I believe because I am selling something.

I sat with that for a day before I answered.

[YOUR TRUTH: how it felt, interview answer 10]

Then I answered the way I answer everything. With the evidence, and without ever naming the person.

Because here is the thing. My position does not depend on my product. The evidence stands on its own, and I can show every bit of it.

Being accused of a motive is what happens when your argument starts to land.

The attack did not shake the mission. It sharpened it.

Because the children this is really for are not on social media arguing. They are in classrooms. And the classrooms were the biggest fight left."""),
("E9", "Episode 9: better than everything they already use, combined", """I gave myself one instruction for the schools.

Do not stop until this is better than everything a teacher already uses. Combined.

Because the children the mission is really about are not going to be reached by a parent buying an app.

They are reached at school. Every one of them.

So I built the whole thing. A full curriculum, a lesson engine, a dashboard for teachers, and the safeguarding backing a school actually needs.

And I sent real lessons to real children.

[YOUR TRUTH: why schools, the child you picture, interview answer 11]

The platform was ready. The curriculum was ready. Fifty founder places, capped in the code so I could never cheat it.

There was one thing left to do. Open the doors."""),
("E10", "Episode 10: fifty spots, come build it with me", """This is the last one before we launch. So I want to tell you the truth about who this is really for.

The thing hurting children most is not the screen. It is poverty, and hard starts, and the weight the adults are carrying.

This is the calm, evidence led answer to a panic that keeps aiming at the wrong thing.

Not a ban. A pathway. Education, not eradication. Ready, built from age four.

[YOUR TRUTH: spoken to your daughter, or to the parent you were in episode one, interview answer 7]

Fifty founder places. Real. Capped in the code, so it is not a fake countdown.

The people who watched this from the beginning are the first fifty.

The apps arrive at sixteen whether we are ready or not. I would rather my daughter, and yours, arrived with judgement than with a countdown timer.

The doors are open. Come build it with me."""),
]
for eid, title, text in EPISODES:
    A(piece(eid, title, "The Last Stretch, Reels, TikTok, Shorts, LinkedIn", "60 to 110 seconds, voice over or to camera",
        ["Voice over: read it at the table, phone recording audio close by, quiet room. Or to camera.", "Facts in this series were written in July 2026; I re check every number before it goes out.", "Source: content/packs/2026-07-15-founder-journey/03-illustrated-scripts.md"], text))

A(piece("D1", "Desk show, film 1: what happens inside a Guided Childhood lesson (host only cut)", "LinkedIn, schools lane; vertical cut for the family account", "75 to 90 seconds at your desk",
    ["Real desk, mug, notebook, a printed lesson or the Passport. Charcoal top. Landscape.", "Host only: the guest lines are left out until the character cast is settled.", "Source: Drive, Campaign v3, 14 Desk show and visuals (22 September)"],
    """We've made the Guided Childhood school pilot live. Let me show you what a teacher and a class actually get to do.

These are the characters you'll meet in the lessons. They help introduce different parts of digital life, from early kindness and privacy to checking AI and making more independent decisions.

The character opens the idea. Then the teacher has a task to work through with the class. Here's one from the lesson: pause, make a choice, and explain why.

There are materials for the teacher and a way to carry the conversation home. The aim is to give children something they can practise, and adults a clear place to start.

If you're responsible for this in your school, you can see the pilot here. Try the lesson, see what the pupils make of it, and tell me what needs improving."""))

A(piece("D2", "Desk show, episode 2: a better AI answer, what did the child learn? (host only cut)", "LinkedIn, schools lane", "2 to 3 minutes at your desk",
    ["Same desk setup. Host only.", "Source: Drive, Campaign v3, 14 Desk show and visuals"],
    """An AI answer can look very good. What I find harder to judge is how much the child understood. Here's a small exercise you can try with a practice question.

Choose a question that's suitable for their age and the rules of the task. After they've had whatever help is allowed, close the answer. Ask them to explain the reasoning in their own words. You're listening for what makes sense to them and where the explanation becomes vague.

For example, use this fictional practice question: a plant has been kept in a dark cupboard. Why might it struggle? An answer might mention light and photosynthesis. Ask the child to explain that idea at the level they've been taught. Knowing the word isn't quite the same as being able to explain what it does.

Let's try another situation. What might change if the plant is moved beside a window? The next question helps us hear whether the explanation carries over.

This isn't a test that proves learning, and a child struggling to explain may need a different way to show you. It gives us a more useful conversation than asking only whether the page looks finished. We can decide what they can do independently and what still needs practice.

That is the kind of judgement I want Guided Childhood to help build. If you're teaching it, the school pilot is live. If you're trying this at home, start with one ordinary practice question."""))

A(piece("R1", "Before the scrolling (GDC-012 reel)", "Instagram Reel", "About 40 seconds to camera in an ordinary room",
    ["The study figures were written on 9 September; I re check them before it goes out.", "Source: Drive, GDC-012 Content Waterfall"],
    """When a child starts spending more time on their phone, I want to know how their day was going beforehand.

A small study followed 40 young people for 90 days. When they felt worse in the morning, they used their phones more passively later that day.

That does not prove the phone was helping, or that it could not make things worse. But it is a reason to ask another question before we decide what the problem is.

How was today before you picked up your phone?

That is the kind of conversation I want Guided Childhood to help families have, alongside the boundaries they need."""))

A(piece("R2", "Almost seven times (the feed study reel)", "Reels, TikTok, Shorts", "About 45 seconds, voice over or to camera, six beats",
    ["Written in July as a worked example; the figures are re checked before it goes out.", "Source: Drive, Guided Childhood Research, example reel"],
    """A team built 396 fake social media accounts and taught them to behave like children.

Then they watched what the feeds decided to show them. The accounts acting like eight year olds were served almost seven times more child directed content than the ones acting like sixteen.

Not after weeks. After a single session. The platform was told every account was an adult, and it worked out who was really a child from behaviour alone.

To be precise, that number is about age targeted content, not harmful content. But it proves the thing that matters. The feed can read a child, and it sorts itself around them, in the researchers' words, not for their protection.

A locked away phone cannot touch this. What protects a child for life is learning to see the machine and steer it. That is a skill, taught by age.

Read the machine. Do not just remove it."""))

json.dump(appx, open("content/read-cards/2026-10-07-appendix.json", "w"), indent=1, ensure_ascii=False)
for d, name in ((main, 'main'), (appx, 'appendix')):
    n = sum(len(p['cards']) for p in d['pieces'])
    print(name, len(d['pieces']), 'pieces', n, 'cards')
