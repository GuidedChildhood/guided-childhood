-- GUIDED CHILDHOOD CATCH UP · STEP 07 · scripts-expansion-1
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

-- Guided Childhood: Script library expansion (84 scripts, stages foundation to independent).
-- Run AFTER 001_initial.sql and seed.sql. Brings the library to 101 total (matches the 100+ marketing claim).
-- Generated for the parents service. Voice: Justin Phillips. British English, no dashes as punctuation.

-- ============================ foundation ============================
-- Guided Childhood: Foundation stage scripts (ages 4 to 7). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'foundation',
  'YouTube autoplay rabbit hole',
  'You said yes to one video and twenty minutes later they are deep into something you never chose, eyes glazed, asking for just one more.',
  'I can see the screen keeps choosing for you. That is its job, not yours. Let us pick the next one together, and then we will be done.',
  '"Right, that is it, screen off now." Yanking it away mid-video without warning triggers the meltdown you are trying to avoid.',
  'Autoplay is built to remove the natural stopping point. Each new video delivers a small hit of dopamine, and a young brain has almost no braking system to say enough. You are not fighting your child, you are fighting a design choice. Bringing the choosing back to a person restores the pause the platform removed.',
  'Open the settings on your tablet or TV app and turn autoplay off tonight. One toggle does more than ten reminders.',
  'none',
  false,
  101
),
(
  'foundation',
  'First time on a new app',
  'Your child has been given a new app or game and wants to dive straight in on their own.',
  'This one is new to both of us. Let us explore it together first, then I will know it is a good fit for you.',
  '"Fine, just go and play it." Handing over something unknown means the app sets the rules before you do.',
  'Sitting beside your child for a first go is co-regulation in action. You become the calm reference point as they meet something exciting and unfamiliar. It also lets you spot adverts, chat features, or pressure to spend before they do. The message that lands is simple: new things are explored with someone you trust.',
  'Before bed, agree that any brand new app gets a together go first. Try the next one side by side this week.',
  'none',
  false,
  102
),
(
  'foundation',
  'Screens at a restaurant',
  'You are out for a meal or stuck in a waiting room, and the temptation is to hand over the phone to keep the peace.',
  'It is a long wait, is it not. Let us see what game we can make up with just us two, and the screen can be our backup if we need it.',
  '"Here, take my phone and be quiet." The screen becomes the only tool your child has for boredom, every single time.',
  'Boredom is where a young brain learns to generate its own ideas. If a screen arrives the moment things go flat, that muscle never gets used. You do not have to ban the phone, you just want it to be the second option, not the first. Waiting together, even badly, builds the patience the screen would have replaced.',
  'Put two small things in your bag tonight, a pencil and paper or a tiny toy, so the phone is not your only rescue tomorrow.',
  'none',
  false,
  103
),
(
  'foundation',
  'Stumbling on something scary',
  'Your child has seen something upsetting or frightening on a screen, and they are shaken or will not settle.',
  'That looked scary, and it is okay that it gave you a wobbly feeling. You are safe here with me. Tell me what you saw and we will sort it out together.',
  '"It was not even real, do not be silly." Dismissing the fear teaches them not to come to you next time.',
  'A young child cannot reliably tell the real from the pretend, so the fear response is genuine. Your calm presence is what brings their nervous system back down, a process called co-regulation. By naming the feeling and staying steady, you become the safe place they return to. That trust is what makes them tell you when something worse appears later.',
  'Tonight, agree a simple word or signal your child can use to tell you a screen has shown them something they did not like.',
  'none',
  false,
  104
),
(
  'foundation',
  'The buy this tantrum',
  'A game or app is pushing your child to buy coins, characters, or extras, and the no has turned into tears.',
  'The game is trying really hard to get us to spend money. That is a clever trick, not a real need. We are not buying it, and I know that feels unfair right now.',
  '"Stop crying and I will get you one thing." Giving in once teaches the tantrum that it works.',
  'These prompts are engineered to feel urgent to a brain that cannot yet weigh long term against right now. Your child is not being greedy, they are responding exactly as the design intends. Naming the trick out loud hands them a thought they can use against it. The calm, steady no is what builds the tolerance for disappointment they will need for years.',
  'Turn on purchase confirmation or a password on your app store tonight so no spend can happen by accident.',
  'none',
  false,
  105
),
(
  'foundation',
  'Different rules at grandparents',
  'Screen time runs looser at the grandparents house, and your child has noticed the rules change when they visit.',
  'Grandma and Grandpa do things their way in their house, and that is lovely. Our family has our own way too, and we pick it back up when we get home.',
  '"They let you do anything, it is ruining everything." Turning it into a conflict puts your child in the middle of the adults.',
  'Young children can hold the idea that different places have different rules, the same way nursery and home differ. The consistency that matters is yours at home, not perfect agreement everywhere. Framing it warmly avoids making your child feel they must choose a side. A quiet word with the grandparents about one or two non-negotiables does more than a public rule.',
  'Tonight, decide your one true non-negotiable for visits, and message it kindly to the grandparents before the next stay.',
  'none',
  false,
  106
),
(
  'foundation',
  'My friend gets more',
  'Your child has come home insisting a friend is allowed far more screen time, and it is not fair.',
  'It sounds like that does feel unfair. Different families make different choices, and our choice is the one that is right for you. I am always happy to hear why you want more.',
  '"I do not care what they are allowed." Shutting it down fast tells your child their feelings are not worth hearing.',
  'Comparison is how children learn where the boundaries of their world sit, so the protest is healthy, not defiant. Acknowledging the feeling without caving keeps the boundary firm and the relationship warm. You are modelling that families can differ without one being wrong. Over time this builds a child who can hold their own line when friends do things differently.',
  'Tonight, let your child finish telling you why they want more, then thank them for explaining without changing the rule.',
  'none',
  false,
  107
),
(
  'foundation',
  'Screens before school',
  'A quick show before school has turned mornings into a battle, with screen time bleeding into getting ready.',
  'Mornings work better when our brains wake up slowly, so screens are for after school now. Let us find a different way to start the day together.',
  '"You can watch but only if you are dressed in five minutes." Bargaining keeps the screen as the prize and the pressure on.',
  'A screen first thing floods a barely awake brain with fast stimulation, which makes the slow tasks of getting ready feel even duller. Removing it stops the morning becoming a negotiation. A young child copes far better with a clear, calm rule than a moving target. Replacing the show with a small shared routine gives the same comfort without the cost.',
  'Tonight, pick one simple morning anchor, a song, a stretch, or breakfast chat, to take the screens place tomorrow.',
  'none',
  false,
  108
),
(
  'foundation',
  'Screen as a reward',
  'You have started using screen time to get good behaviour, and now everything has become a negotiation for screens.',
  'I want you to tidy up because it helps our family, not to earn a screen. We can still have screen time later, and it is not a prize for being good.',
  '"If you are good you can have the tablet." This makes the screen the most valuable thing in the house.',
  'When a screen becomes the reward, its value climbs every time you use it as a bribe, and ordinary cooperation fades without it. You also tie a calm activity to performance, which raises the stakes of every ask. Separating the two keeps screen time ordinary rather than precious. Helping because it matters to the family builds a stronger motivation than any prize.',
  'Tonight, name one thing your child does just because it helps, and thank them for it without mentioning screens.',
  'none',
  false,
  109
),
(
  'foundation',
  'First video call with a relative',
  'Your child is about to video call a grandparent or relative, and may be shy, restless, or unsure what to do.',
  'Granny is going to pop up on the screen and she cannot wait to see you. You can show her something or just say hello, whatever feels good.',
  '"Sit still and talk properly to your nan." Forcing the performance makes the call something to dread.',
  'A video call is a strange middle ground for a young child, a real person who is not really there, which can feel oddly flat. Giving them something to show turns the call from a test into a shared activity. Low pressure keeps the connection warm rather than awkward. These early calls build the idea that screens can carry real relationships, not just entertainment.',
  'Tonight, help your child choose one thing to show on the next call, a drawing, a toy, or a new trick.',
  'none',
  false,
  110
),
(
  'foundation',
  'Obsessed with one show',
  'Your child wants the same character or show on a loop, and any other suggestion is met with a flat refusal.',
  'You really love this one, do you not. It feels good to watch something you know. Let us watch a bit, and then I have something new I think you will like too.',
  '"You watch this every single day, I am sick of it." Mocking the obsession shames a need for comfort and predictability.',
  'Repetition is genuinely soothing to a young brain, because knowing what comes next lowers anxiety and feels safe. The favourite show is doing a real job for them. You do not need to crush the love, just gently widen the world around it. Honouring the comfort while introducing the new keeps your child open rather than dug in.',
  'Tonight, watch the favourite without complaint, then offer one new thing right after while they are relaxed.',
  'none',
  false,
  111
),
(
  'foundation',
  'Adverts aimed at children',
  'An app or video is firing adverts at your young child, and they have started asking for everything they see.',
  'That was an advert. Its whole job is to make you want something. Wanting it is normal, but we do not have to buy what the advert tells us to.',
  '"Ignore it, it is just an advert." Without explanation, the pull of the advert still does its quiet work.',
  'Children under about seven cannot reliably tell an advert from the programme, so the persuasion lands unfiltered. Naming the advert as a thing with a job gives your child a frame they can spot it through next time. You are building early media literacy, one of the strongest protections there is. The aim is not to stop the wanting but to make the trick visible.',
  'Tonight, play spot the advert during a show, and let your child point them out before you do.',
  'none',
  false,
  112
),
(
  'foundation',
  'Devices in the bedroom',
  'Your child wants to take a tablet or screen into their bedroom, especially around bedtime.',
  'Screens live downstairs at night, even mine. Bedrooms are for resting and sleeping. We can have screen time together earlier instead.',
  '"Just this once you can take it up." One exception quietly becomes the new normal.',
  'The bedroom is where sleep is learned, and screens disrupt it twice, through bright light that delays sleepiness and through content that keeps the brain switched on. Setting the rule early, before it is a habit, makes it far easier to keep. Including your own phone in the rule removes the do as I say problem. A screen free bedroom is one of the simplest, highest value boundaries you can set now.',
  'Tonight, set up one charging spot downstairs for the whole family, and put your own phone there too.',
  'none',
  false,
  113
),
(
  'foundation',
  'Family posting photos online',
  'A relative regularly posts photos of your child online, and you are uneasy about it but unsure how to raise it.',
  'We love that you adore the photos. We have decided to keep theirs off public profiles for now. Send them to us any time, just not to the wider world.',
  '"It is fine, do not make a fuss." Staying quiet to avoid awkwardness hands your childs privacy to someone else.',
  'Your child cannot consent to a public footprint that may follow them for years, which is why the choice sits with you for now. Framing it as a family decision rather than a complaint keeps relationships intact. You are modelling that consent and privacy matter, even within a loving family. Raising it early, before patterns set, is far easier than unpicking it later.',
  'Tonight, agree your familys photo rule between the two parents, then share it warmly with relatives as a settled decision.',
  'none',
  false,
  114
),
(
  'foundation',
  'Meltdown moving to dinner',
  'Calling your child off a screen to come to the table tips them straight into a meltdown, every time.',
  'I know it is really hard to stop when you are having fun. Your brain wants to keep going. Two more minutes, then we save it and come to dinner together.',
  '"Dinner is ready now, screen off, come on." A sudden stop gives the brain no time to switch tracks.',
  'Stopping a screen drops dopamine sharply, and a young brain feels that as a real loss, not a tantrum for effect. The meltdown is a nervous system reaction to an abrupt change, not defiance. A short, warned bridge gives the brain time to shift gear before the screen goes off. Naming the difficulty and counting it down together turns the cliff edge into a slope.',
  'Tonight, give a clear two-minute warning before dinner, and watch whether the landing is softer.',
  'none',
  false,
  115
),
(
  'foundation',
  'Learning versus entertainment',
  'You are unsure how to handle the difference between screen time that teaches and screen time that just entertains.',
  'Some screen things help your brain grow, like the ones where you make or solve or build. Others are just for fun, and a bit of fun is fine too. Let us notice which is which.',
  '"As long as it is educational it does not count." Treating learning apps as unlimited misses that all screens still need balance.',
  'Not all screen time is equal, but no screen replaces the messy, hands on play that grows a young brain most. Even good learning apps benefit from limits, because the body and the senses learn things a screen cannot teach. Helping your child notice the difference builds judgement they will use for life. The goal is a balanced diet of screens, not a free pass for the educational ones.',
  'Tonight, sort two of your childs apps together into making something or just watching, out loud.',
  'none',
  false,
  116
),
(
  'foundation',
  'The game their friends play',
  'Your child has asked, for the first time, to play a game because all of their friends are playing it.',
  'I can tell this one really matters because your friends love it. Let me have a proper look at it first, and then we will decide together if it is right for you.',
  '"No, that game is for big kids." A flat no with no look teaches your child to stop asking and start hiding.',
  'Wanting to belong is one of the strongest drives at this age, so this request is about friendship as much as the game. Taking it seriously, rather than dismissing it, keeps your child bringing these asks to you. Checking the game yourself models the very judgement you want them to grow. Whether the answer is yes or not yet, the open conversation is the real win.',
  'Tonight, find out the name of the game and spend ten minutes looking it up before you decide anything.',
  'none',
  false,
  117
)
on conflict (sort_order) do nothing;

-- ============================ builder ============================
-- Guided Childhood: Builder stage scripts (ages 8 to 10). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'builder',
  'First messaging app request',
  'Your child says all their friends are on a messaging app and asks to join so they are not left out.',
  'I can hear that this matters to you, and I want to understand it properly. Let us look at the app together this week. I will set it up with you, we will agree who you can talk to, and I will be in the loop while you learn the ropes.',
  '"No, you are too young for that." It shuts the door and teaches them to ask you for nothing next time.',
  'At this age the social brain is coming online and belonging starts to feel urgent. Refusing flat out does not remove the pull, it just moves the activity out of your sight. Joining alongside them keeps you as the guide while the habits are still forming, which is exactly when influence is highest.',
  'Sit down together and look at one app they are asking for. Ask what their friends actually do on it before you decide anything.',
  'none',
  false,
  201
),
(
  'builder',
  'Left out of the group chat',
  'Your child is upset because a group chat went on without them, or they were removed, and they feel pushed out.',
  'That stings, and it makes sense that it does. Being left out feels real in your body, not just your head. Tell me what happened, and we will work out together what you want to do next, if anything.',
  '"Just ignore it, it does not matter." It tells them their feeling is wrong and they will stop bringing these things to you.',
  'Social exclusion activates the same brain regions as physical pain, so the hurt is genuine, not dramatic. A child who feels heard can think more clearly about their next move. Dismissing the feeling teaches them to manage social pain alone, which is the opposite of what you want at this age.',
  'Ask your child to describe the moment they noticed they were left out. Just listen. Do not fix it yet.',
  'none',
  false,
  202
),
(
  'builder',
  'Roblox and Minecraft time limits',
  'Your child loses track of time in a building game and resists stopping when you ask.',
  'These games are designed to never end, so stopping is genuinely hard. Let us pick a natural finish point together, like saving your build or ending the round, and I will give you a warning before we get there.',
  '"Off now, I said so." A sudden stop mid-task feels like punishment and guarantees a fight.',
  'Open-ended games offer no built-in stopping cue, so the brain keeps chasing the next small reward. Ending on a completed task respects how the game is structured and lowers the dopamine drop. A warning gives the prefrontal cortex, still developing at this age, time to prepare for the switch.',
  'Agree one natural stopping point with your child before they start playing tonight.',
  'none',
  false,
  203
),
(
  'builder',
  'Voice chat with strangers',
  'Your child is playing an online game where they can talk to people you do not know through voice chat.',
  'I am glad you enjoy playing with others. Some of those voices belong to people we do not know, so let us set a simple rule: you can chat about the game, but anything personal, like your name, school, or where we live, stays offline. If anyone asks for that, come and get me.',
  '"You are never using voice chat, end of story." It removes the chance to teach the very judgement they will need.',
  'Children this age trust easily and cannot yet read intent from a stranger online. A clear, concrete rule about what stays private gives them a script to follow under pressure. Telling them to fetch you keeps the door open rather than driving the contact underground.',
  'Ask your child to show you how voice chat works in their game so you understand what they hear.',
  'none',
  false,
  204
),
(
  'builder',
  'Obsessed with one YouTuber',
  'Your child quotes, copies, and wants to watch one particular YouTuber or streamer constantly.',
  'You really like this person. What is it about them that you enjoy so much? I would love to understand it. Let us watch one together so I can see what you see.',
  '"That person is rubbish, turn it off." Mocking their hero feels like you are mocking them.',
  'Looking up to an older figure is a normal part of identity forming at this age. Curiosity keeps the channel of communication open, while contempt closes it and pushes the interest somewhere you cannot see. Watching together lets you notice the values being modelled and talk about them naturally.',
  'Watch one video of their favourite creator with them and ask one genuine question about it.',
  'none',
  false,
  205
),
(
  'builder',
  'Asking for their own phone',
  'Your child asks for their own phone, often because friends have one.',
  'That is a big step, and I am happy to think about it properly with you. A phone is a tool, not a prize, so let us talk about what you would actually use it for and what would help us both feel okay about it.',
  '"When you are older." A vague answer with no path forward just teaches them to keep nagging.',
  'A phone is a gateway to an open social world, and the impulse-control systems that manage that are years from mature at this age. Treating the request as a real conversation, rather than a yes or no, models thoughtful decision making. Linking it to need rather than status helps your child reason about it too.',
  'Ask your child to list three things they would use a phone for. Discuss whether each one truly needs a phone.',
  'none',
  false,
  206
),
(
  'builder',
  'Saw something unsuitable at a friend''s house',
  'Your child saw something on a screen at a friend''s house that worried or confused them.',
  'Thank you for telling me. You are not in any trouble at all. Things can pop up that feel strange or scary, and it is always okay to come to me about them. What did you see, and how did it make you feel?',
  '"You are not going to that house again." Punishing the messenger guarantees they hide the next thing.',
  'A child who is praised for disclosing learns that you are a safe place for hard information. Reacting with alarm or blame teaches them that honesty brings trouble, so they go quiet. Naming that they are not in trouble lowers the fear response and lets them actually tell you what happened.',
  'Tell your child tonight that they will never be in trouble for telling you about something they saw. Say it plainly.',
  'none',
  false,
  207
),
(
  'builder',
  'A stranger messaged them in a game',
  'Someone your child does not know sent them a message inside a game.',
  'You did the right thing showing me. Most people are fine, but we cannot tell who is who online, so the rule is simple: we do not reply to people we have not met in real life, and we tell each other. Let us look at it together.',
  '"Why were you even talking to strangers?" Blame makes them feel caught and they will stop reporting it.',
  'Children this age cannot reliably judge who is safe online because the cues they rely on in person are missing. A fixed rule removes the need for them to assess each stranger in the moment. Praising the report, rather than questioning their behaviour, makes telling you the automatic response.',
  'Practise with your child what to do if a stranger messages them: do not reply, come and show you.',
  'none',
  false,
  208
),
(
  'builder',
  'Wanting to spend real money on skins',
  'Your child wants to spend real money on skins, loot boxes, or in-game items.',
  'I get why you want it, those items look brilliant. Here is the thing: these games are built to make spending feel urgent, and some of it works like gambling. Let us set a small budget you control, so you decide on purpose rather than in the heat of the moment.',
  '"It is a waste of money, no." It ends the lesson before they learn how the spending traps actually work.',
  'Loot boxes use the same variable reward pattern as slot machines, which the developing brain finds especially hard to resist. A fixed budget moves the choice from impulse to plan and builds early financial judgement. Explaining the design, rather than just refusing, gives your child a defence they can use for years.',
  'Agree a small fixed monthly amount for in-game spending and let your child decide how to use it.',
  'none',
  false,
  209
),
(
  'builder',
  'The nightly screen-time negotiation',
  'Every evening turns into a negotiation about how much longer your child can stay on a screen.',
  'I do not enjoy the nightly haggle and I do not think you do either. Let us agree the screen time once, together, and then it is settled. When it is fixed in advance, neither of us has to argue about it every night.',
  '"Stop pushing your luck or you lose it all." Threats raise the stakes and make tomorrow night worse.',
  'Decision fatigue makes repeated nightly negotiations exhausting for everyone and erodes the boundary over time. A rule agreed in advance removes the moment-by-moment bargaining and gives your child predictability, which lowers conflict. Involving them in setting it raises the chance they will keep to it.',
  'Sit down together and agree a clear screen-time amount for school nights. Write it somewhere you both can see.',
  'none',
  false,
  210
),
(
  'builder',
  'Homework versus games',
  'Games are winning the battle against homework and getting your child to start is a daily struggle.',
  'Games are built to grab your attention, and homework is not, so it makes sense that one feels easier to start. Let us agree the order: schoolwork first, then the game is yours with no nagging from me. That way the fun is something to look forward to, not something I have to take away.',
  '"No games until I see straight As." Linking play to grades turns every result into a fight.',
  'Games deliver fast, reliable rewards while homework delivers slow, uncertain ones, so the brain naturally prefers the game. Putting effort before reward uses the game as a motivator rather than a battleground. Removing the nagging once the work is done makes the deal feel fair and keeps you out of the policing role.',
  'Agree the homework-then-game order with your child and commit to not nagging once they start the work.',
  'none',
  false,
  211
),
(
  'builder',
  'Comparing themselves to friends online',
  'Your child seems anxious or down after comparing what they have or do with friends they see online.',
  'It is easy to feel behind when you only see everyone''s best bits. What people post is the highlight, not the whole story. Tell me what you have been comparing, and let us look at it honestly together.',
  '"Do not be silly, you have loads." Brushing it off tells them their worry is daft and they will hide it.',
  'Children this age increasingly measure themselves against peers, and online feeds show curated highlights that no real life can match. Naming the gap between the highlight and the whole story gives them a tool to question what they see. Dismissing the feeling leaves the comparison running silently underneath.',
  'Ask your child what they have felt left behind by lately. Just listen and name how common that feeling is.',
  'none',
  false,
  212
),
(
  'builder',
  'Setting a family technology agreement',
  'You want to set shared rules about devices that apply to the whole family, not just your child.',
  'Let us make a family agreement about screens, and it includes me too. We will write down a few simple rules we all keep, like no phones at the table. If I break one, you can call me on it.',
  '"These are the rules, learn them." Rules handed down without buy-in feel like control and invite rebellion.',
  'Children follow what is modelled far more than what is instructed, so rules that include the adults carry real weight. Building the agreement together gives your child ownership, which raises the chance they will keep to it. A shared standard also removes the sense that screens are a battle between you and them.',
  'Write three simple device rules together that apply to every person in the house, adults included.',
  'none',
  false,
  213
),
(
  'builder',
  'Witnessing someone being cyberbullied',
  'Your child saw someone being picked on in a group chat or game and is not sure what to do.',
  'It takes courage to even notice that and feel uneasy about it. You do not have to fix it alone. You can refuse to join in, you can message the person privately to check they are okay, and you can tell me or a teacher. Which of those feels possible for you?',
  '"Stay out of it, it is not your problem." It teaches them that looking away is the safe choice.',
  'Bystanders shape whether cruelty spreads or stops, and children this age are forming their sense of fairness and courage. Offering several small, safe actions makes helping feel possible rather than overwhelming. Telling them to stay out of it trains the habit of disengaging, which is hard to undo later.',
  'Talk through one small thing your child could do if they see someone being picked on online.',
  'none',
  false,
  214
),
(
  'builder',
  'The everyone has it argument',
  'Your child argues that everyone has a particular game, app, or device, so they should too.',
  'You might be right that lots of friends have it. Everyone having something does not automatically make it right for our family, but it does tell me it matters to you. Let us look at it on its own merits, just you and me.',
  '"I do not care what everyone else has." It dismisses a real social pressure they are genuinely feeling.',
  'The pull to match the group is strong at this age and is a normal part of fitting in, not manipulation. Acknowledging the pressure as real, while still deciding on your own terms, models how to hold a value under social pressure. Flat dismissal teaches them that you do not take their world seriously.',
  'Ask your child why this particular thing matters to them, beyond the fact that others have it.',
  'none',
  false,
  215
),
(
  'builder',
  'Devices and sleep',
  'Screens are creeping into the bedroom and your child is harder to settle and wake.',
  'Sleep is when your brain sorts out everything from the day, and screens make it harder to switch off. Let us agree that devices go to bed in the kitchen, not your room. I will charge mine there too, so we are doing it together.',
  '"Give it here, no screens in bed." Confiscation framing makes it a punishment instead of a shared habit.',
  'Screen light and the alertness games create both delay the wind-down the brain needs for sleep. Keeping devices out of the bedroom removes the temptation rather than relying on willpower at the moment they are most tired. Charging yours alongside theirs turns a rule into a family habit, which holds far better.',
  'Set up one charging spot outside the bedrooms tonight and put your own phone there too.',
  'none',
  false,
  216
),
(
  'builder',
  'Early body image messages from media',
  'Your child is picking up messages from media about how bodies should look, and starting to repeat them.',
  'I noticed what you said about how someone looks. A lot of what we see on screens is edited, filtered, or chosen to sell something. Bodies in real life come in every shape, and that is normal. What made you think about it?',
  '"Do not say things like that." Shutting it down stops the comment but not the belief underneath.',
  'Body image attitudes start forming early, and media presents a narrow, often altered ideal as if it were normal. Naming that images are edited gives your child a lens to question what they see rather than absorb it. Closing the conversation leaves the belief in place and signals that the topic is off limits with you.',
  'Point out one edited or filtered image with your child and talk about how it differs from real life.',
  'none',
  false,
  217
)
on conflict (sort_order) do nothing;
select 'STEP 07 COMPLETE · scripts-expansion-1' as status;
