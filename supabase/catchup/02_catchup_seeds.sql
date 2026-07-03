-- VERIFIED V2 · tested clean against a production replica on 3 Jul 2026
-- Guided Childhood production catch up, part 2 of 2: content seeds.
-- Loads the full script library (expansion + daily moments), the
-- moment cards and the AI module lessons. Run ONCE, after part 1,
-- in the SQL Editor of the LIVE project. The guard below aborts the
-- whole run if scripts are already loaded, so a double run cannot
-- duplicate anything.

do $$
begin
  if (select count(*) from public.scripts) > 20 then
    raise exception 'Scripts look already seeded (more than 20 rows). Aborting so nothing duplicates.';
  end if;
end $$;

-- ════════════════ seed-scripts-expansion.sql ════════════════

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
);

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
);

-- ============================ explorer ============================
-- Guided Childhood: Explorer stage scripts (ages 11 to 13). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'explorer',
  'The first serious social media request',
  'Your 11, 12, or 13 year old asks, seriously and repeatedly, to join Instagram, TikTok, or Snapchat because everyone in their year is on it.',
  'I can hear that this matters to you, and being left out of where your friends are is a real thing, not a small thing. I do not want to give you a yes or a no in the next ten seconds. I want us to actually look at it together first and decide properly.',
  'No. You are far too young and that is the end of it.',
  'A flat refusal at this age does not stop access, it moves it out of your sight onto a friend''s phone. The adolescent brain is wired to prioritise peer belonging, so the social cost of exclusion is felt as genuine threat. Slowing the decision down, rather than slamming it shut, keeps you in the room for every choice that follows.',
  'Tonight, ask them which platform matters most and why. Just listen. Do not decide anything yet.',
  'partial_ban',
  false,
  301
),
(
  'explorer',
  'Explaining how the algorithm decides what they see',
  'Your child believes their feed simply shows them what is popular or what their friends like, and has never questioned how it is chosen.',
  'Here is something most adults do not even know. Nobody at the company chose what is on your feed. A system watched what made you pause, and now it shows you more of that, on purpose, to keep you there longer. That is worth understanding, because once you see it you can see past it.',
  'It is all fake and designed to manipulate you, so do not believe any of it.',
  'Naming the mechanism gives a young person genuine power rather than fear. The developing prefrontal cortex is building the capacity for abstract reasoning at this stage, so they are newly able to grasp how a system optimises for attention. Understanding the design is what lets them resist it, far more than being warned that it is bad.',
  'Tonight, open your own feed and ask them to guess why each of the first five posts was chosen for you.',
  'none',
  false,
  302
),
(
  'explorer',
  'Walking through their feed together',
  'You want to understand what your child actually sees and experiences when they scroll, rather than guessing or assuming the worst.',
  'Would you show me round your feed for ten minutes. I am not checking up on you and I am not going to comment on every single thing. I genuinely want to see what it is like to be in there, because I cannot understand it from the outside.',
  'Hand me your phone, I want to see exactly what you have been looking at.',
  'There is a difference between being invited in and being inspected, and adolescents are acutely sensitive to which one is happening. Heightened social awareness means they read your intent before they read your words. Curiosity opens the feed to you. Surveillance closes it, and teaches them to keep a cleaner version for you and a real one for themselves.',
  'Tonight, ask for a guided tour, not an inspection. Let them be the expert for once.',
  'none',
  false,
  303
),
(
  'explorer',
  'Influencers and body image',
  'Your child is following accounts that present highly edited or idealised bodies, and is starting to compare themselves to them.',
  'A lot of what you are seeing has been lit, posed, filtered, and chosen out of hundreds of attempts. I am not saying that to be a downer. I am saying it because your body is changing fast right now, and it is unfair to measure a changing real body against a finished, edited image.',
  'You do not need to look like them, just stop following accounts that make you feel bad.',
  'At this stage the body is changing rapidly and self-image is forming around social comparison, which adolescents are biologically primed to do. Pointing out the construction behind the image, calmly and without panic, restores a sense of proportion. Telling them simply to unfollow skips the understanding that makes the choice stick.',
  'Tonight, find one before and after editing video together and just notice the gap. No lecture needed.',
  'none',
  false,
  304
),
(
  'explorer',
  'Setting up a first smartphone',
  'Your child is getting their own smartphone for the first time and you are deciding together how it will work.',
  'This is your phone now, and I want it to actually be yours. So let us set it up together this once. We will turn off the bits designed to hook you, agree where it sleeps at night, and write down what we both expect. Then it is yours to look after.',
  'There are going to be a lot of rules and I will be checking it whenever I want.',
  'The first setup sets the tone for years, and doing it as a shared project rather than a handover with conditions builds ownership. The adolescent brain responds far better to autonomy framed with structure than to control. Notifications and infinite feeds exploit dopamine driven novelty seeking, so dialling those down at the start is the single most useful thing you can do.',
  'Tonight, turn off non-essential notifications together and agree where the phone charges overnight.',
  'none',
  false,
  305
),
(
  'explorer',
  'Being left out of a group chat',
  'Your child discovers they have been removed from, or deliberately left out of, a group chat and is hurt by it.',
  'That really stings, and it is meant to. Being shut out of where your friends are talking is one of the most painful things at your age, and I am not going to pretend it is no big deal. I am here. Do you want to talk about what happened or just sit with it for a bit.',
  'It is only a group chat, just ignore them and find better friends.',
  'Social exclusion activates the same brain regions as physical pain, and at this age the wiring that makes belonging feel urgent is at its peak. Minimising the hurt teaches them you do not understand the stakes, so they stop bringing things to you. Naming the pain as real is what keeps the door open.',
  'Tonight, validate the feeling before offering any solution. Sometimes being heard is the whole repair.',
  'none',
  false,
  306
),
(
  'explorer',
  'Late-night scrolling and sleep',
  'You realise your child is scrolling late into the night and is exhausted, foggy, or short-tempered in the mornings.',
  'I am not raising this to take anything away. I am raising it because your sleep is taking a hit, and at your age sleep is doing huge work on your mood and your brain. Let us sort out how the phone can rest somewhere at night so you actually get that sleep.',
  'You are on that thing all night, no wonder you are a nightmare in the mornings.',
  'Adolescent sleep need is high and their body clock naturally shifts later, so a glowing, endlessly novel feed at bedtime is working directly against their biology. Sleep loss at this stage feeds low mood and poor focus. Framing it as protecting their sleep, not policing their phone, keeps it a shared problem rather than a battle.',
  'Tonight, agree a charging spot outside the bedroom and offer a cheap alarm clock so the phone has no excuse to stay.',
  'none',
  false,
  307
),
(
  'explorer',
  'Comparison and dipping self-esteem',
  'Your child seems flatter and more self-critical lately, often after time on their phone, comparing their life to what others post.',
  'I have noticed you have seemed a bit down on yourself. I want to say one thing and then drop it. You are comparing your whole messy inside to everyone else''s best ten seconds. That is not a fair fight, and it is not the truth about you.',
  'Stop comparing yourself to other people, it is pathetic and a waste of time.',
  'Identity is actively forming at this age, and social media offers an endless stream of curated highlights to measure against, which the comparison wired adolescent brain finds hard to resist. Self-esteem dips are common and usually not permanent. Naming the unfair comparison gently, without shaming the feeling, protects the relationship and the self-worth at once.',
  'Tonight, tell them one specific thing you genuinely admire about who they are, not how they look.',
  'none',
  false,
  308
),
(
  'explorer',
  'Worry about too much gaming',
  'You are concerned your child is spending too long gaming and struggling to stop when they say they will.',
  'I want to get this right rather than just nag you. Games are built by very clever people to be hard to put down, so the struggle to stop is not a flaw in you. Let us work out together what a good amount looks like, and what would actually help you stop when you mean to.',
  'You are addicted to that game, you need to get a life and go outside.',
  'Games are engineered around variable rewards that drive the dopamine system, and the adolescent brain, with its still maturing self-control, finds these especially gripping. Calling it addiction or laziness shames a normal response to good engineering design. Treating stopping as a shared design problem teaches a skill they will use for life.',
  'Tonight, ask them to show you one trick the game uses to keep them playing. Be curious, not cross.',
  'none',
  false,
  309
),
(
  'explorer',
  'Online friends they have never met in person',
  'Your child talks about friends they have made online, through games or apps, whom they have never met face to face.',
  'I am genuinely glad you have people you click with, and online friendships can be real and good. I am not going to tell you they are not real friends. What I do want is to understand who they are with you, because not everyone online is who they say, and that is just worth us keeping our eyes open about together.',
  'You have no idea who that person really is, stop talking to strangers online.',
  'For this generation online friendships are genuine social bonds, and dismissing them outright tells your child you do not understand their world. At the same time, the adolescent drive toward connection can outrun their still developing judgement about risk. Respecting the friendship while staying involved is what keeps them telling you the truth about it.',
  'Tonight, ask them to tell you about one online friend the way they would a friend from school. Stay interested.',
  'none',
  false,
  310
),
(
  'explorer',
  'A first calm conversation about nudes and pressure',
  'Your child is at the age where the topic of being asked to send a photo, or seeing one shared, may come up, and you want to have a calm first conversation before it does.',
  'I want to talk about something a bit awkward, calmly, before it ever comes up. Sometimes people get pressured to send photos of themselves. If anyone ever asks you, the answer is always no, and you will never be in trouble with me for telling me it happened. That door is always open.',
  'If you ever send a photo like that you will be in serious trouble, do you understand me.',
  'Leading with threat guarantees they will hide it if it ever happens, exactly when they most need an adult. Peer pressure carries enormous weight at this age, and the impulse to please can outpace the still developing brakes of the prefrontal cortex. A calm, blame free conversation in advance makes you the person they come to, rather than the person they fear.',
  'Tonight, plant one sentence: whatever happens, you will never be in trouble for telling me. Then leave it there.',
  'none',
  false,
  311
),
(
  'explorer',
  'Negotiating more screen autonomy',
  'Your child is pushing for more freedom over their own screen time and resents rules they feel are babyish.',
  'You are growing up and it makes sense that you want more say over your own time. I am up for that. Freedom and trust go together though, so let us agree what more freedom looks like, and how we both know it is going well. If it works, it grows.',
  'You get freedom when you earn it, and right now you have not earned anything.',
  'Autonomy is the central developmental task of adolescence, and rules that feel babyish breed exactly the rebellion they are meant to prevent. Granting expanding freedom tied to visible responsibility works with the developing brain''s need for independence rather than against it. Negotiation also models the very judgement you want them to build.',
  'Tonight, agree one specific freedom they gain this month and what keeps it. Write it down together.',
  'none',
  false,
  312
),
(
  'explorer',
  'The link between mood and the phone',
  'You have noticed your child often comes off their phone in a worse mood, but they have not made the connection themselves.',
  'I have noticed something and I am curious whether you have too. You often seem a bit flatter after a long scroll than before it. I am not saying give it up. I just wonder if it is worth us both noticing how different apps actually leave you feeling.',
  'That phone is making you miserable, anyone can see it, so just put it down.',
  'Self-awareness about emotional triggers is a skill that is only beginning to develop at this age, and a feed designed to maximise engagement is not designed to leave anyone feeling good. Inviting them to notice the pattern themselves builds a lasting internal compass. Telling them how they feel just provokes denial and shuts the noticing down.',
  'Tonight, ask them which app leaves them feeling best and which leaves them worst. Let the answer surprise you both.',
  'none',
  false,
  313
),
(
  'explorer',
  'A secret or second account',
  'You have discovered your child has a second, hidden account that you did not know about.',
  'I found out there is another account, and my honest first feeling was hurt. But before I get into that, I want to understand why. Most people your age have one for a reason that makes sense to them. Help me get it, and let us talk about how we move forward.',
  'A secret account, so you have been lying to me this whole time. I cannot trust you at all now.',
  'Hidden accounts are extremely common at this age and usually reflect a healthy drive for a private space away from adult and family eyes, not deception for its own sake. Identity formation needs room to experiment. Reacting with betrayal confirms that honesty leads to punishment, while seeking the reason keeps the relationship, and your influence, intact.',
  'Tonight, lead with curiosity about the why before any consequence. Understand it before you judge it.',
  'none',
  false,
  314
),
(
  'explorer',
  'Doomscrolling distressing news',
  'Your child has been scrolling through frightening or upsetting news and world events and seems anxious or overwhelmed by it.',
  'It looks like a lot of heavy stuff has been coming up on your feed, and it is genuinely hard to take in that much at once. It is good to care about the world. It is also fine to put it down for a bit. You are allowed to look after yourself and still be someone who cares.',
  'Stop reading the news if it upsets you, there is nothing you can do about any of it anyway.',
  'The feed surfaces alarming content because it captures attention, and the still developing brain has not yet built strong filters for managing a constant stream of distant threat. The result is anxiety without any outlet for action. Permitting them to care and to step back at the same time teaches sustainable engagement, rather than either numbness or overwhelm.',
  'Tonight, help them turn the feeling into one small real action, then agree it is okay to step away.',
  'none',
  false,
  315
),
(
  'explorer',
  'Wanting to become a creator or go viral',
  'Your child dreams of becoming a creator, getting followers, or going viral, and talks about it as a real goal.',
  'I love that you make things and want people to see them. That is brilliant. Let us make this about what you create, not just the numbers. The likes are designed to come and go and they will mess with your head if you let them be the point. The work you are proud of, that lasts.',
  'You are not going to become famous on the internet, focus on something real instead.',
  'The desire for status and recognition peaks in adolescence, and platforms convert that into chasing metrics that trigger dopamine in unpredictable bursts, which is hard on a developing reward system. Dismissing the dream loses their trust. Redirecting it toward craft and pride, rather than the volatile scoreboard of likes, protects their sense of worth while honouring the ambition.',
  'Tonight, ask to see something they have made and respond to the work itself, not the view count.',
  'none',
  false,
  316
),
(
  'explorer',
  'Privacy and their digital footprint',
  'Your child shares freely online and has not yet thought about how permanent and public their digital trail is.',
  'Here is something the apps will never tell you. What you post does not really disappear, and a version of it can follow you for years. I am not trying to scare you. I want you to be the one in charge of what is out there about you, instead of leaving that to chance.',
  'You are putting your whole life online and one day it is going to come back to bite you.',
  'Adolescents live intensely in the present, and the part of the brain that weighs long term consequences is still maturing, so the permanence of a post is genuinely hard to feel. Framing privacy as power and control, rather than as a warning about future regret, fits the developmental wish for autonomy and is far more likely to change behaviour.',
  'Tonight, search their name together and check their privacy settings as a shared project, with no judgement.',
  'none',
  false,
  317
);

-- ============================ shaper ============================
-- Guided Childhood: Shaper stage scripts (ages 13 to 15). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'shaper',
  'Something has gone wrong and they are scared to tell you',
  'You sense your teenager is carrying something heavy that happened online, but they are afraid of how you will react.',
  'Whatever it is, you are not in trouble for telling me. I would rather know and help than have you carry it alone. There is almost nothing you could say that we cannot sort out together. Take your time.',
  '"You can tell me anything, but you had better not have done something stupid." The threat cancels out the invitation and guarantees silence.',
  'At this age the threat-detection system is highly active while the brakes of the prefrontal cortex are still maturing, so fear of your reaction can outweigh the need for help. Leading with safety, not consequences, lowers that threat response and lets them think clearly. A teenager who believes coming to you is safe will come to you sooner next time, which is when problems are still small.',
  'Say out loud, with no problem on the table, that they will never be in trouble simply for telling you something. Plant it before they need it.',
  'none',
  false,
  401
),
(
  'shaper',
  'Heavy social media use and their mood',
  'You have noticed your teenager seems flatter or more irritable, and it tracks with long stretches on social media.',
  'I have noticed you seem a bit low lately, and I am not blaming the phone. I just want to understand how you are feeling. Can we talk about what is going on for you, on the apps and off them?',
  '"That phone is making you miserable, give it here." It treats the device as the whole cause and shuts down the conversation you actually need.',
  'Heavy passive scrolling is linked with lower mood in some teenagers, though the picture is complex and the phone is rarely the only factor. Leading with curiosity rather than blame keeps them talking, which is how you find the real driver. If low mood persists for more than a couple of weeks, affects sleep or appetite, or worries you, it is worth speaking to your GP or a mental health professional. You do not have to diagnose this alone.',
  'Ask one open question about how they have been feeling lately, and listen without mentioning the phone first.',
  'none',
  false,
  402
),
(
  'shaper',
  'Curious or accidental exposure to pornography',
  'You have learned your teenager has come across pornography, whether by accident, by curiosity, or sent by someone.',
  'I am not angry, and you are not in trouble. Being curious about sex and bodies is completely normal at your age. The thing is, a lot of what is online is not realistic and not how real relationships work, so I want us to be able to talk about it honestly.',
  '"That is disgusting, I never want to hear about you looking at that again." Shame teaches them to hide it and leaves the false picture uncorrected.',
  'Sexual curiosity is a normal part of adolescent development, and most teenagers will encounter pornography. Responding with shame drives the behaviour underground and removes your chance to provide context. Calm conversation lets you separate fantasy from real intimacy, consent, and respect. If the content was extreme, involved coercion, or you are worried about its effect, professional support through your GP or a counsellor is a sensible step.',
  'Decide your own calm opening line in advance, so that if this comes up you respond from a steady place rather than shock.',
  'none',
  false,
  403
),
(
  'shaper',
  'Extreme or radicalising content',
  'Your teenager is repeating extreme views or has been drawn into content that pulls them toward an us-and-them way of seeing the world.',
  'I have heard you say a few things lately that I want to understand better. I am not going to tell you what to think. I do want to know where these ideas are coming from and to think them through with you. Walk me through it.',
  '"That is poison and I forbid you from watching it." Forbidding it confirms the narrative that you are the enemy and they are being silenced.',
  'Adolescents are wired to seek identity, belonging, and certainty, which is exactly what radicalising content offers. Banning it can deepen the appeal and confirm the grievance the content feeds on. Staying curious and reasoning together keeps you inside their thinking, where you can introduce doubt and complexity. If you see fixation, secrecy, or talk of harm, contact your school safeguarding lead or local support services without delay.',
  'Ask them to explain one idea they have picked up, and stay genuinely curious rather than correcting.',
  'none',
  false,
  404
),
(
  'shaper',
  'Self-harm content in their feed',
  'Self-harm or other unhealthy content has started surfacing in your teenager''s feed, whether they sought it out or it was served to them.',
  'I have seen that some heavy stuff is showing up on your feed. I am not cross with you. I want to make sure you are okay, and I want to understand whether you are looking for this or it is just finding you. Either way, we are in this together.',
  '"I am deleting all your apps right now." A sudden cut-off can feel like punishment for struggling and may stop them telling you anything real.',
  'Recommendation algorithms can amplify distressing content once a teenager engages with it, deepening a low mood loop. Approaching with concern rather than punishment keeps them talking and lets you judge how serious things are. Self-harm content can normalise harmful behaviour, so it matters that they have a trusted adult, not an algorithm, to turn to. If you have any worry that your child is hurting themselves or thinking about it, contact your GP or a mental health professional promptly. You do not need to wait for certainty.',
  'Sit with them and look at how to mute or report this kind of content, so they feel some control over what reaches them.',
  'none',
  false,
  405
),
(
  'shaper',
  'Pressure, consent, and healthy relationships online',
  'Your teenager is navigating early romantic or sexual interest online, including pressure to send photos or do things they are unsure about.',
  'Anyone who really cares about you will never pressure you, and will always take a no without sulking or punishing you. Your body and your choices are yours. If anyone pushes, that tells you something about them, not about you. And you can always come to me.',
  '"Do not ever send pictures or you will ruin your life." Fear-based warnings make them too ashamed to come to you if something has already happened.',
  'Adolescents are highly sensitive to peer approval, which can make it hard to hold a boundary in the moment. Naming consent and pressure in advance gives them words and permission to refuse before they are tested. Framing it around respect rather than catastrophe keeps the door open if a mistake has already been made. If an image has been shared or they are being coerced, report it and seek support, including the police or a specialist service, rather than handling it alone.',
  'Tell them plainly that real care never comes with pressure, so they have the standard in their head before they need it.',
  'none',
  false,
  406
),
(
  'shaper',
  'Holding oversight while they grow independent',
  'Your teenager is asking for more privacy and less monitoring, and you are unsure how much to loosen the reins.',
  'You are getting older and you have earned more privacy. I am not trying to spy on you. My job is shifting from watching to trusting, and the way we keep that trust is honesty both ways. Let us agree what stays private and what I still need to know.',
  '"As long as you live here, I read everything on your phone." Total surveillance at this age breeds resentment and teaches them to hide better.',
  'Autonomy is a core developmental need in adolescence, and granting it in step with maturity supports healthy identity and self-regulation. Heavy-handed monitoring tends to push risky behaviour out of sight rather than reduce it. Shifting from control to negotiated trust keeps you informed of the things that matter most: safety, wellbeing, and who they are talking to. The aim is a teenager who chooses to tell you, not one who has been caught.',
  'Agree one thing you will stop checking and one thing you still need to know about, and say both out loud.',
  'none',
  false,
  407
),
(
  'shaper',
  'Gambling mechanics and loot boxes',
  'Your teenager is spending real or in-game money on loot boxes, skins, or other chance-based rewards in games.',
  'I want to show you something about how these games make money. Those boxes are built to feel like a win even when you lose, the same way a slot machine works. That does not make you daft for enjoying it. It means the design is clever, and I want you to see the trick.',
  '"You are wasting money on rubbish, no more." Banning it without explaining the mechanic leaves the susceptibility in place for the next time.',
  'Loot boxes use variable-ratio rewards, the same reinforcement schedule that makes gambling so compelling, and the adolescent reward system is especially responsive to it. Explaining the mechanism builds genuine resistance, because they learn to recognise the pattern rather than just obey a rule. Teenagers respect being treated as capable of understanding the trick. If spending becomes secretive, distressing, or hard to stop, that is worth taking seriously and may warrant professional support.',
  'Watch a short clip together explaining how loot boxes are designed, and ask them what they notice.',
  'none',
  false,
  408
),
(
  'shaper',
  'Pressure to perform as a creator',
  'Your teenager is posting content and is increasingly anxious about views, likes, followers, or going viral.',
  'I love that you make things. I want to check in on how it feels, not just how it performs. The numbers are not a measure of you. On the days the post does badly, you are exactly the same person you were the day before. Tell me how it has been.',
  '"It is just a silly app, stop caring what strangers think." It dismisses something that feels significant to them and ends the conversation.',
  'Adolescents are acutely tuned to social feedback, and likes and follower counts deliver that feedback in a fast, quantified, and public form. Tying self-worth to metrics can fuel anxiety and a fragile sense of identity. Separating who they are from how a post performs protects self-esteem while still honouring their creativity. If the pressure is causing real distress or compulsive checking, it is worth talking it through with a counsellor.',
  'Ask how creating actually feels day to day, and listen for whether it is bringing joy or just pressure.',
  'none',
  false,
  409
),
(
  'shaper',
  'Chronic sleep loss from devices',
  'Your teenager is regularly up late on their phone and is exhausted, struggling to wake, or running on empty.',
  'You are shattered, and your body genuinely needs more sleep than mine does right now. This is not me being strict for the sake of it. Let us solve the sleep problem together, because everything else gets harder when you are running on empty. What would actually help?',
  '"Phone off at nine, no argument." The flat rule invites a nightly battle and ignores that they need to own the solution to keep it.',
  'Adolescent body clocks shift later, so teenagers are biologically wired to feel awake at night, and screens plus notifications make settling harder. Sustained sleep loss affects mood, concentration, and mental health, all of which are already under strain at this age. Solving it with them rather than imposing it increases the chance the habit sticks, because autonomy supports follow-through. A consistent wind-down and the phone charging outside the room are the highest-impact changes.',
  'Ask them what they think would help them wind down, and build the plan around their answer.',
  'none',
  false,
  410
),
(
  'shaper',
  'Comparison and anxiety',
  'Your teenager seems to measure themselves against the lives, bodies, and successes they see online, and it is feeding anxiety.',
  'What you see on those feeds is the highlight reel, carefully chosen and often edited. You are comparing your whole messy inside to everyone else''s best outside. That is not a fair fight, and it would make anyone feel rotten. You are not falling behind.',
  '"Just stop comparing yourself, it is pointless." Telling them to stop a feeling they cannot control only adds the failure of not managing it.',
  'The adolescent brain is primed for social comparison as part of working out where they fit, and curated feeds supply an endless stream of upward comparisons. This can quietly erode self-esteem and feed anxiety. Naming the highlight-reel effect gives them a frame to question what they see rather than absorb it as truth. If anxiety is persistent or interfering with daily life, a GP or counsellor can help, and seeking that support is a sign of good parenting, not failure.',
  'Look at one polished post together and talk about what was likely cropped, staged, or left out.',
  'none',
  false,
  411
),
(
  'shaper',
  'Supporting a friend in crisis online',
  'Your teenager has a friend who is in distress online, perhaps talking about self-harm or feeling unsafe, and is carrying that weight alone.',
  'It says a lot about you that your friend trusts you. That is a heavy thing to hold by yourself, and you are not meant to carry it alone. Helping a friend in real trouble sometimes means telling a trusted adult, even if they asked you not to. That is not betrayal. That is keeping them safe.',
  '"That is not your problem, just block them and stay out of it." It abandons a frightened friend and teaches your child to look away from someone in need.',
  'Teenagers often become the first point of contact when a peer is struggling, and they can feel torn between loyalty and a promise of secrecy. Carrying that responsibility alone is a real burden and can affect their own wellbeing. Helping them understand when a secret must be shared to keep someone safe protects both the friend and your child. Make sure they know the relevant resources, such as a school counsellor, a GP, or a crisis line, and that adults exist to take this weight from them.',
  'Tell them clearly that a secret which could keep someone safe is one they are allowed to share with you.',
  'none',
  false,
  412
),
(
  'shaper',
  'Location sharing and personal safety',
  'Your teenager shares their location through apps, posts, or with friends, and may not have thought through who can see it.',
  'I am not worried about most of the people you share with. I want you to think about the edges. Who exactly can see where you are, and could that map be seen by someone you do not actually know? Let us go through the settings together so you are the one deciding.',
  '"Turn off all location sharing, it is dangerous." A blanket ban skips teaching the judgement they will rely on once you are not checking.',
  'Adolescents tend to focus on the immediate social benefit of sharing and underweight low-probability risks, partly because the brain''s reward system outpaces its risk-assessment system at this age. Helping them think through who can actually see their location builds lasting judgement rather than dependence on your rules. Putting them in charge of the settings respects their autonomy while raising their awareness. The goal is a teenager who shares deliberately, not by default.',
  'Go through their location settings together and have them decide who stays on and who comes off.',
  'none',
  false,
  413
),
(
  'shaper',
  'Their digital footprint and future',
  'Your teenager is posting freely without much thought for how it might look to a future employer, college, or their older self.',
  'What you post tends to stick around longer than the moment it was made for. I am not saying live in fear of it. I am saying post like a version of you in five years is reading it, because one day they will be. Would future you be glad this is out there?',
  '"One stupid post will ruin your whole life." Catastrophising makes them tune you out rather than think it through.',
  'Adolescents are wired to prioritise the immediate and social over the distant and abstract, so the long-term cost of a post is hard to feel in the moment. Offering a simple, concrete frame, picturing their future self, helps the still-developing prefrontal cortex weigh consequences without inducing paralysing fear. Treating them as capable of foresight tends to draw out more careful behaviour than threats do. The aim is thoughtful posting, not anxious silence.',
  'Ask them to pause before one post and consider whether they would be happy for future them to find it.',
  'none',
  false,
  414
),
(
  'shaper',
  'Standing firm against group pressure',
  'Your teenager is being pushed by a group chat or friends to join in on something they are uneasy about, like piling on someone or sharing a photo.',
  'It is genuinely hard to be the one who says no when everyone else is in. That takes more guts than going along with it. You are allowed to step back, stay quiet, or say it is not for you. If you need a way out, you can always blame me. Say your dad would lose it.',
  '"Just say no, it is simple." It is not simple under that much pressure, and saying so leaves them without a usable strategy.',
  'Peer influence peaks in adolescence, and the presence of peers measurably increases risk-taking by amping up the brain''s reward response. Acknowledging how hard it is to resist, rather than pretending it is easy, validates their real experience and keeps them listening. Giving them a concrete exit, including permission to blame you, hands them a workable tool for the moment of pressure. A teenager with a ready-made out is far more likely to use it.',
  'Offer yourself as the ready-made excuse, so they have a face-saving way out of group pressure.',
  'none',
  false,
  415
),
(
  'shaper',
  'Spotting misinformation and manipulation',
  'Your teenager shares or believes things they have seen online without checking whether they are true or who is behind them.',
  'A lot of what goes viral is designed to make you feel something fast, usually angry or scared, because strong feelings get shared. Before you pass something on, it is worth a pause: who made this, what do they want me to do, and is it actually true? You are smart enough to spot the play.',
  '"Do not believe anything you read online." Blanket cynicism is as useless as blanket trust and gives them no way to tell the two apart.',
  'Adolescents are developing critical reasoning but are also drawn to emotionally charged, identity-affirming content, which is exactly what manipulative material exploits. Teaching a few quick questions about source and intent builds media literacy they can apply themselves, which is far more durable than a rule. Framing them as capable of seeing the manipulation appeals to their growing desire for autonomy and respect. The goal is a discerning teenager, not a cynical or a credulous one.',
  'Take one thing they shared recently and work through together who made it and why.',
  'none',
  false,
  416
),
(
  'shaper',
  'Renegotiating the phone-free bedroom',
  'Your teenager is pushing back on the phone staying out of the bedroom at night, arguing they are old enough to manage it.',
  'You are older now, so let us talk about this properly rather than me just laying down the law. The reason is not trust, it is sleep. Your phone in arm''s reach at night makes good sleep almost impossible for anyone, me included. Let us find a version of this that works for you.',
  '"The rule is the rule, you are not special." Refusing to revisit a rule they have outgrown invites them to break it the moment you are not looking.',
  'As teenagers mature, rules imposed without negotiation lose their force, because autonomy is the developmental priority. The science on sleep, however, does not change: a phone in the bedroom disrupts sleep through notifications, late-night use, and the pull to check. Reopening the conversation respectfully, while holding the principle, models how to keep a sound boundary while honouring their growing independence. A charging spot just outside the room is a common compromise that keeps the principle intact.',
  'Sit down and renegotiate the bedroom phone rule together, holding the sleep principle while updating the detail.',
  'none',
  false,
  417
);

-- ============================ independent ============================
-- Guided Childhood: Independent stage scripts (ages 16 and over). Run after seed.sql.
insert into public.scripts
  (stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values
(
  'independent',
  'Preparing for full digital independence before leaving home',
  'They are within a year or two of leaving home, and soon nobody will be checking their screen habits but them.',
  'Soon you will be running all of this on your own, and I think you are ready for it. I am not here to manage your phone any more, I am here as someone to think out loud with. What do you already know about yourself online, the good habits and the ones you want to keep an eye on?',
  '"While you are still under my roof, my rules apply." It frames independence as something you grant rather than something they are growing into, so they leave home with no practice at self-governing.',
  'In late adolescence the goal shifts from external control to internal regulation, because the structures you provide will vanish the moment they move out. Treating them as the future manager of their own habits builds the self-awareness they will actually rely on. Coaching now, while you can still observe and discuss, is the last and best window to hand the controls over deliberately rather than abruptly.',
  'Ask them to name one digital habit they want to take with them and one they want to leave behind.',
  'none',
  false,
  501
),
(
  'independent',
  'Owning their own mental health online',
  'You sense that how they feel is closely tied to what they see and post, and they are starting to notice it too.',
  'You are old enough now to be the one watching how this stuff affects you, not me. I have noticed feeds can lift you or flatten you depending on the day. You know yourself better than anyone. What does your phone do to your mood, honestly, and what would you change if it were entirely your call?',
  '"You are on that thing too much, it is making you miserable." A verdict delivered from outside invites a defence, and it teaches them to wait for someone else to diagnose them.',
  'Emerging adults regulate mood far better when they own the insight rather than receive it as a complaint. Asking them to observe the link between input and feeling builds the metacognition that underpins lifelong mental health. The aim is a young person who notices their own state and adjusts it, which only develops when they are trusted to be the observer.',
  'Ask them which account or app reliably lifts their mood and which one reliably drains it.',
  'none',
  false,
  502
),
(
  'independent',
  'Building a healthy relationship with algorithms and feeds',
  'Their feed seems to know them almost too well, and they are not always sure why they are being shown what they see.',
  'The feed is not neutral. It is built to keep you scrolling, and it learns what holds you, including the things that wind you up. You are sharp enough to see the machinery now. What do you think yours has decided you are, and is that actually who you want to be fed?',
  '"It is all rubbish, just delete the app." Telling them to walk away skips the more useful skill, which is understanding the system well enough to bend it to their own ends.',
  'A young adult who understands that engagement, not wellbeing, is the goal of a feed can curate deliberately rather than be curated. Recommender systems amplify whatever provokes a reaction, so naming that mechanism turns a passive user into an active one. The skill they need for the next sixty years is shaping the algorithm, not just escaping it.',
  'Ask them to unfollow or mute three accounts that consistently leave them worse off, tonight.',
  'none',
  false,
  503
),
(
  'independent',
  'Spotting deepfakes and synthetic media',
  'Convincing fake videos, voices, and images are everywhere, and even careful people are being fooled.',
  'It is getting genuinely hard to tell what is real, and that is not a failing on your part, it is the technology. I would rather we both got good at pausing before we believe or share something. What makes you trust a clip when you see one, and where could that trust be played?',
  '"Do not believe anything you see online." Blanket distrust is no more useful than blanket trust, and it leaves them with no actual method for telling the two apart.',
  'Emerging adults navigate a media environment where synthetic content is cheap and convincing, so the durable skill is verification, not cynicism. Asking what earns their trust surfaces the shortcuts a forger exploits. Building a habit of checking the source and seeking a second confirmation gives them a method they can apply long after any single tool is outdated.',
  'Look up one recent deepfake together and work out what gave it away.',
  'none',
  false,
  504
),
(
  'independent',
  'Financial scams, crypto, and get rich quick content',
  'Their feed is full of people promising fast money through crypto, trading, or some course, and some of it is tempting.',
  'There is a whole industry online aimed at people your age with the line that fast money is one purchase away. Some of it is outright fraud, some of it is just people selling you the dream of selling the dream. You are smart, so let us pressure test it: who actually profits when you buy in?',
  '"You are not putting a penny near any of that nonsense." A ban teaches nothing about how the trick works, and the moment you are not there to forbid it, the pitch lands unanswered.',
  'Young adults are prime targets for financial manipulation precisely because they are building independence and want to get ahead. Teaching them to ask who profits and what is being promised gives them a reusable filter rather than a single prohibition. The protection that lasts is a sceptical question they carry, not a rule they outgrow the day they move out.',
  'Pick one get rich quick post together and trace exactly how the person behind it actually makes their money.',
  'none',
  false,
  505
),
(
  'independent',
  'Online dating safety and respect',
  'They are starting to meet people online, and you want them safe without treating them like a child.',
  'Meeting people online is normal now, and I trust you to do it well. A couple of things keep grown adults safe, not just teenagers: meet first in public, tell someone where you are, and trust the feeling if something is off. And the respect goes both ways, in how you are treated and how you treat them.',
  '"Just be careful out there." It sounds caring but gives them nothing concrete, and it quietly implies the danger is all on the other side.',
  'Emerging adults benefit from specific, dignifying safety practices rather than vague warnings or surveillance. Naming public meetings, a trusted contact, and the legitimacy of their own instincts gives them a portable protocol. Framing respect as mutual also builds them into someone who treats partners well, which is half of what makes a relationship safe.',
  'Agree one simple plan: when they meet someone new, they tell a named person where and when.',
  'none',
  false,
  506
),
(
  'independent',
  'Their professional and public digital footprint',
  'What they post now can be seen by future employers, universities, and people who do not yet know them.',
  'Almost everything you put out is searchable, and people who will decide things about your future, jobs, courses, references, can see it. I am not saying scrub yourself into a blank profile. I am saying post like the person you are becoming, because that record follows you.',
  '"Delete those photos before someone sees them." Panic and policing teach concealment, not the lifelong judgement of deciding for themselves what is worth putting into the world.',
  'In emerging adulthood identity becomes public and consequential, and the footprint they build now shapes real opportunities. Helping them think about audience and permanence develops the forward looking judgement that no amount of deleting can replace. The aim is a young person who curates their public self on purpose, because they will be doing it for the rest of their working life.',
  'Search their own name together and talk about what a stranger would conclude from the first page.',
  'none',
  false,
  507
),
(
  'independent',
  'Helping them support a younger sibling well',
  'A younger sibling looks up to them, and their example online carries real weight in the house.',
  'Your younger sibling watches you more than they listen to me, and that gives you a kind of quiet influence I do not have. I am not asking you to police them. I am asking you to be the older one who shows what good looks like, and who they can come to before they would ever come to me.',
  '"Set a better example, they copy everything you do." Framed as a duty and a fault, it makes them resent the role instead of stepping into it.',
  'Older adolescents take on mentoring identities readily when the role is offered as trust rather than obligation. A near adult who models healthy habits gives a younger child a closer, more credible guide than a parent. Inviting them into that role also deepens their own standards, because people live up to the version of themselves they are asked to be.',
  'Tell them one thing their younger sibling already copies from them, and thank them for it.',
  'none',
  false,
  508
),
(
  'independent',
  'News literacy and political polarisation',
  'They are forming strong views, and their feeds may be feeding them one side hard while hiding the other.',
  'You are forming your own politics now, and I respect that, even where we differ. The thing I want for you is not a particular view, it is the habit of knowing where yours came from. Feeds tend to show you more of what you already believe. Who do you read that you actually disagree with?',
  '"You only think that because of what you watch." It dismisses their reasoning as brainwashing and guarantees they stop discussing politics with you at all.',
  'As young adults consolidate their worldview, the lasting skill is recognising the information environment that shaped it, not adopting yours. Personalised feeds narrow the range of views people encounter, which hardens opinion into identity. Asking who they read across the divide builds intellectual independence, which serves them far better than agreement.',
  'Each of you names one thoughtful source you disagree with and says one fair thing about it.',
  'none',
  false,
  509
),
(
  'independent',
  'Focus, productivity, and distraction during study',
  'Phones and feeds are pulling their attention apart while they are trying to study or revise.',
  'Your attention is the thing every app is built to capture, and they are very good at it. This is not about willpower, it is about design. You are old enough to run your own experiment: what actually helps you concentrate, and what would you have to do to your phone to find out?',
  '"Hand me your phone, you cannot be trusted to study with it." Confiscation works for one evening and teaches nothing they can use when they are alone in a library next year.',
  'Emerging adults must build their own attention management because no one will be there to remove the phone at university or work. Framing focus as a design problem rather than a character flaw removes shame and invites strategy. Letting them test what works gives them a system they own, which is the only kind that survives leaving home.',
  'Ask them to try one study session with the phone in another room and report back on the difference.',
  'none',
  false,
  510
),
(
  'independent',
  'Sleep and study balance',
  'Late nights on screens are eating into their sleep, and it is starting to show in how they cope.',
  'You are running your own schedule now, which is exactly right. I will just say what I know: sleep is when your brain files everything you studied, so screens late at night cost you twice, the rest and the recall. You decide the line. I am only making sure you have the facts to decide with.',
  '"Lights off and phone away, it is a school night." Imposing a bedtime on a near adult invites rebellion and removes the chance for them to learn to manage their own rest.',
  'Young adults regulate sleep best when they own the decision and understand the cost, because soon no one will set their bedtime. Sleep consolidates learning, so the trade off is concrete and worth naming plainly. Handing them the facts and the choice builds the self regulation they will need in every term and every job ahead.',
  'Share one fact about sleep and learning, then leave the decision genuinely with them.',
  'none',
  false,
  511
),
(
  'independent',
  'A mature conversation about image sharing and the law',
  'They are old enough to date and share, and they need to understand consent and the law around intimate images.',
  'You are an adult or nearly one, so I will speak to you straight. Sharing an intimate image of someone without their consent is not just unkind, it is against the law, and so is pressuring someone to send one. The principle underneath all of it is consent. Are you clear on where those lines are?',
  '"Do not ever send pictures like that." A flat prohibition shuts the topic down and leaves them unsure what the actual law and the actual harm are when it matters.',
  'Emerging adults need an honest, adult level grasp of consent and the legal reality around intimate images, because the stakes are serious and lifelong. Grounding the conversation in consent gives them a principle that covers situations a rule cannot anticipate. Speaking to them as a responsible adult makes them more likely to come to you if something goes wrong.',
  'Make sure they can state in their own words what consent means before an image is ever shared.',
  'none',
  false,
  512
),
(
  'independent',
  'Knowing when and how to seek help',
  'They are increasingly handling things alone, and you want them to know that asking for help is a strength, not a failure.',
  'Being independent does not mean handling everything by yourself. The most capable adults I know are the ones who know when to ask for help and are not too proud to do it. If something online ever frightens you, traps you, or gets out of hand, you can come to me with zero judgement, and there are services that exist for exactly this too.',
  '"You are an adult now, you should be able to sort your own problems." It teaches them that needing help is a failure of independence, so they will hide the moment they most need you.',
  'Help seeking is a learned skill that protects emerging adults through every crisis they will face away from home. Framing it as a mark of capability rather than weakness keeps the door open precisely when shame would otherwise close it. Knowing both that you are available and that formal services exist gives them more than one route when they are alone.',
  'Tell them plainly that asking for help is something strong adults do, and that your door has no judgement behind it.',
  'none',
  false,
  513
),
(
  'independent',
  'Gambling and betting apps',
  'Betting and gambling are heavily marketed to young men especially, and the apps are designed to keep them playing.',
  'Betting apps are everywhere now, dressed up as a bit of fun with the football. Here is what they do not advertise: they are engineered so the house wins over time, and they are very good at getting young people hooked. You are sharp enough to see the design. What do you reckon the free bet is actually buying them?',
  '"Gambling is a mug''s game, never touch it." The slogan is easy to ignore, and it gives them no understanding of how the hook is set so they can recognise it later.',
  'Young adults, particularly young men, are intensively targeted by gambling marketing during the years their impulse control is still settling. Explaining the mechanics, the free bet, the near miss, the always on access, gives them a working knowledge they can apply to any product. Understanding the design protects far longer than a slogan they will tune out.',
  'Look at one betting advert together and work out what behaviour it is really trying to start.',
  'none',
  false,
  514
),
(
  'independent',
  'World event anxiety and doomscrolling',
  'A relentless stream of crises and bad news is leaving them anxious, hopeless, or unable to look away.',
  'The news never stops now, and it is weighted towards the worst of everything because that is what holds attention. Caring about the world is good. Drowning in it helps no one, least of all the people you care about. How do you want to stay informed without it flattening you?',
  '"Just stop reading the news then." It dismisses a genuine moral instinct to care, and it offers no middle path between drowning and switching off entirely.',
  'Emerging adults are developing their relationship with a wider world that arrives mainly through an anxiety optimised feed. Validating the care while questioning the consumption helps them stay engaged without being overwhelmed. The lasting skill is a sustainable way to be informed, which they will need across a lifetime of difficult news.',
  'Help them set one boundary on news intake, a time of day or a number of minutes, and see how it feels.',
  'none',
  false,
  515
),
(
  'independent',
  'The lifelong, ongoing nature of this conversation',
  'They are about to leave, and you want them to know this thinking does not end when the parenting does.',
  'We have been working this out together for years, and I want you to know it does not stop when you leave. The tech will keep changing, and so will you. The job is never finished, for you or for me. I am always here to think it through with you, not as your parent telling you what to do, but as someone who is in it too.',
  '"Right, you know it all now, off you go." It pretends the work is done, when in truth the questions only get more complex once they are out in the world alone.',
  'Digital life evolves continuously, so the most useful thing you can leave an emerging adult with is the expectation that reflection is permanent, not a phase they complete. Reframing yourself from controller to lifelong thinking partner keeps the relationship open across adulthood. They leave home equipped not with a finished rulebook but with a habit of asking, which is what actually lasts.',
  'Tell them this conversation has no finish line, and that you are in it alongside them for good.',
  'none',
  false,
  516
);


-- ════════════════ seeds/daily_moments_batch1.sql ════════════════

-- Daily Moments Scripts — Batch 1
-- Category: daily-moments
-- Sort orders: 1301-1315
-- Situational micro-scripts triggered by specific daily moments

INSERT INTO public.scripts (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order) VALUES

(
  'foundation',
  'daily-moments',
  'The Morning TV Standoff',
  'It is 7:45am. Your child will not turn off the TV before school. You have asked three times.',
  'I am going to turn this off now. I know that feels unfair. You can choose one show after school.',
  'You are always like this. We are going to be late because of you.',
  'The argument is not about the TV. It is about the transition. Children at this stage genuinely struggle to shift attention. Giving them a choice about what comes next reduces the feeling of pure loss, which is what drives the meltdown.',
  'Before tomorrow morning, set a timer together. The timer becomes the signal, not you. Put the remote somewhere visible but out of reach.',
  'none',
  true,
  1301
),

(
  'foundation',
  'daily-moments',
  'When Screen Time Ends in Tears',
  'You have ended tablet time. Your child has dissolved into tears or rage.',
  'You are really upset. That makes sense. And the tablet is done for now. I am staying here with you.',
  'Stop crying or you will lose it tomorrow as well.',
  'Trying to reason during a meltdown does not work. The brain is flooded. What a child needs is the dysregulation witnessed without consequence. Staying calm and present is the entire intervention. Reasoning comes later.',
  'Give a five minute warning before ending screen time every session this week. It is not a negotiation. It is a predictable signal that reduces the crash.',
  'none',
  false,
  1302
),

(
  'builder',
  'daily-moments',
  'The After School Device Rush',
  'Your child walks in the door and the first thing they say is can I go on my game.',
  'In a bit. Come and sit with me for ten minutes first. Tell me one thing that happened today.',
  'You just got home. Give me a chance to breathe.',
  'The transition from school to home is one of the highest stress points of the day. The device is a decompression tool. You cannot compete with it but you can insert yourself before it. Ten minutes of low-pressure conversation gives you information about their day that you will not get later.',
  'Make the ten minute conversation a daily habit before any device goes on. Do not ask how school was. Ask what was the most annoying thing that happened.',
  'none',
  false,
  1303
),

(
  'builder',
  'daily-moments',
  'Saturday Morning Screen Spiral',
  'It is 10am on Saturday. Your child has been on a device since they woke up and you only just noticed.',
  'Right, we have done two hours. Device off for now. What do you want to do today?',
  'You have been on that since you woke up. That is not healthy. Give it here.',
  'The shame response rarely produces the change you want. It produces hiding. Naming the time factually and moving forward with a question gives them agency and signals you are interested in their day, not just policing the device.',
  'Agree a weekend morning routine before next Saturday. Not rules. A routine. The difference matters to children.',
  'none',
  false,
  1304
),

(
  'builder',
  'daily-moments',
  'The Dinner Table Check',
  'Your child keeps checking their phone during dinner. You have asked twice already.',
  'Phone face down please. You can check it after dinner. I want to hear about your day.',
  'Put that away or I am taking it. This family actually talks at dinner.',
  'This family actually talks at dinner puts pressure on everyone at the table and creates a performance, not a connection. A simple, specific instruction followed by a genuine question is far more likely to get the result you want.',
  'Introduce a basket or shelf by the door. Everyone''s phone goes there at dinner. Including yours. This week.',
  'none',
  false,
  1305
),

(
  'explorer',
  'daily-moments',
  'When They Come Home and Go Straight to Their Room',
  'Your child comes home from school, gives one word answers, and disappears to their room with their phone.',
  'I am going to leave you to decompress. I will have something to eat ready in about twenty minutes if you want it.',
  'You never talk to me anymore. What is going on with you?',
  'The question what is going on with you when someone is dysregulated produces shutdown or explosion. Food is a neutral reason to re-emerge and lowers the stakes of the reconnection. Most conversations happen in the kitchen, not on request.',
  'Do not force conversation tonight. Create the condition for it instead. Food is the bridge.',
  'none',
  true,
  1306
),

(
  'explorer',
  'daily-moments',
  'The Before School Phone Argument',
  'Your child is going to be late for school because they will not put their phone down. You are both escalating.',
  'We are both getting wound up. Phone down, shoes on. We can talk about this tonight when we are both calmer.',
  'You are obsessed with that thing. This is the third time this week.',
  'The escalating morning argument creates a rupture that sits with both of you all day. Naming that you are both wound up de-escalates without you giving in. Deferring to the evening is not avoidance. It is choosing the right moment.',
  'Tonight, one question: what would make mornings easier for you? Not a lecture. One question.',
  'none',
  false,
  1307
),

(
  'explorer',
  'daily-moments',
  'The Just Five More Minutes Loop',
  'It is bedtime. You have already extended twice. Your child says five more minutes again.',
  'I know. And we are done now. Device off. I will come in to say goodnight.',
  'You always do this. I cannot trust you with five minutes.',
  'The five more minutes negotiation reflects genuine disappointment, not defiance. Matching the calm of your voice to the firmness of the message reduces the power struggle. Coming in to say goodnight is what they actually want, not the screen time.',
  'Set up a phone charging station outside their bedroom and make it the new normal this week. Charge it there every night.',
  'none',
  false,
  1308
),

(
  'explorer',
  'daily-moments',
  'Sunday Night and the Device Spiral',
  'It is Sunday evening. Your child''s mood has dropped and they are buried in their phone. School tomorrow.',
  'Sunday nights are hard sometimes. Come and sit with me for a bit.',
  'Get off that and get ready for tomorrow. You are just making it worse.',
  'Sunday night anxiety is real and increasingly common in children aged 10 to 14. The device is not causing the anxiety. It is being used to manage it. Acknowledging the feeling and offering presence is more useful than removing the coping mechanism without replacing it.',
  'A brief bedtime check-in: what is one thing you are looking forward to this week? Even a small answer shifts the frame before sleep.',
  'none',
  false,
  1309
),

(
  'shaper',
  'daily-moments',
  'The Car Journey Phone Bubble',
  'You are in the car together. Your teenager has been on their phone since they got in and has not looked up.',
  'Nothing for now. After a few minutes: I am going to put some music on. You can choose if you want.',
  'Could you put that away? We are in the same car and you have not said a word.',
  'Car journeys are one of the best opportunities for conversation with teenagers because you are side by side, not face to face. Forcing it kills it. A low-stakes offer often opens the door without pressure. The conversation you want is fifteen minutes away if you do not start the war.',
  'Try silence and a music offer on the next journey. Do not comment on the phone. See what happens.',
  'none',
  false,
  1310
),

(
  'shaper',
  'daily-moments',
  'When They Come Downstairs in a Dark Mood',
  'Your teenager comes out of their room visibly flat or irritable after time on their phone or social media.',
  'You seem a bit flat. Do you want to talk, or do you want to just watch something together?',
  'What happened? Was it something on Instagram? You need to stop using that app.',
  'The attribution was it something on Instagram may be accurate but it closes the conversation. Offering two options removes the pressure to explain while keeping the connection open. Most teenagers will not immediately say what happened online. They need the door open first.',
  'If they choose to watch something together, sit with them. You do not have to talk.',
  'partial_ban',
  false,
  1311
),

(
  'shaper',
  'daily-moments',
  'The Weekend Disappearing Act',
  'It is 2pm on Sunday. Your teenager has not left their room since breakfast. You do not know what they are doing.',
  'Knock and open the door slightly: Hey. I am making tea. Come and sit with me for ten minutes.',
  'You have been in there for six hours. That is not healthy. Come out now.',
  'Six hours in a bedroom is often a sign that something is going on, not that your child is lazy. The that is not healthy framing invites an argument. Tea is a bridge. Ten minutes without an agenda is more likely to surface what is happening than any direct question.',
  'Notice if this is a pattern. One Sunday is not a problem. Three in a row is worth a gentle conversation.',
  'none',
  false,
  1312
),

(
  'shaper',
  'daily-moments',
  'When You Notice the Light Under the Door at Midnight',
  'It is midnight. You notice the light under their door or hear them still on their phone.',
  'Nothing tonight. Tomorrow: I noticed you were up late last night. I am not angry. I am just a bit worried. What is going on?',
  'Knocking on the door at midnight to start a conversation.',
  'A midnight confrontation produces a defensive teenager and a sleepless night for both of you. The question what is going on opens something. You need to be off your phone by 11 closes it. Tomorrow, with calm, is the right time.',
  'Tomorrow evening, a brief low-pressure conversation about sleep. Not a lecture. One question.',
  'none',
  false,
  1313
),

(
  'builder',
  'daily-moments',
  'The Homework versus Screens Standoff',
  'Your child wants the device. You want homework done. You have been going back and forth for twenty minutes.',
  'Here is the deal. Thirty minutes on the device, then homework. I will check in at half past.',
  'Homework first, always. That is the rule and I am not changing it.',
  'Homework first always sounds reasonable but ignores how children actually decompress after school. A structured break before homework often produces better quality work than forcing tired children to start immediately. A time boundary gives you cooperation without the war.',
  'Try this sequence this week and notice if homework quality improves. It usually does.',
  'none',
  false,
  1314
),

(
  'independent',
  'daily-moments',
  'The 2am Discovery',
  'You get up in the night and notice your 16 or 17 year old is still awake on their phone.',
  'Nothing tonight. Tomorrow: I saw you were up late last night. I am not checking on you but I am a bit worried. What is going on?',
  'Confronting them at 2am, or saying nothing and hoping it stops.',
  'At 16 and 17, surveillance without conversation produces secrecy, not change. The question what is going on opens something. You need to be off your phone by 11 closes it. The distinction between checking on them and being worried is real and teenagers can tell the difference.',
  'A genuine conversation about sleep, not a rule about phones. Share what you know about sleep and mood without turning it into a lecture.',
  'none',
  false,
  1315
);

-- ════════════════ seeds/daily_moments_batch2.sql ════════════════

-- Daily Moments Scripts — Batch 2
-- Category: daily-moments
-- Sort orders: 1316-1330
-- Covers: group chat drama, gaming rage, everyone has it, finding something upsetting,
--         Instagram comparison, homework panic, broken phone, boredom spiral, and more

INSERT INTO public.scripts (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order) VALUES

(
  'builder',
  'daily-moments',
  'When Group Chat Drama Comes Home',
  'Your child arrives home visibly upset or quiet. You eventually discover something happened in the class group chat.',
  'Something happened in the group chat, didn''t it. You don''t have to tell me what. But I am here if you do.',
  'Let me see the messages. Who started it? Right, I am messaging their parents.',
  'Immediately escalating to the school or other parents often makes the social situation worse for your child. Children care deeply about not being seen as the one whose mum got involved. Naming what you can see and leaving the door open gets you more than demanding to see the evidence.',
  'Ask one question tonight and nothing else: is anyone being unkind to you, or were people just being silly? The answer tells you everything you need to know about the next step.',
  'none',
  false,
  1316
),

(
  'builder',
  'daily-moments',
  'Gaming Rage',
  'Your child has just thrown a controller, burst into tears, or shouted after losing a game.',
  'That was really frustrating. Take a minute. I am going to get you a drink.',
  'It is just a game. This is why I worry about you playing so much.',
  'Telling a child in the middle of a flood of emotion that it is just a game does not land. They know it is just a game. The emotion is real even when the trigger seems small. Giving them something physical to do next and some space resets the nervous system faster than reasoning.',
  'After they have calmed down, not now, ask what happened just before the rage. Loss, unfairness, or being killed by the same player twelve times? The trigger matters.',
  'none',
  false,
  1317
),

(
  'explorer',
  'daily-moments',
  'Everyone Else Has It',
  'Your child is furious that they are the only one without the app, the game, or the device that everyone else apparently has.',
  'Tell me more about that. Who has it? What do they do with it? I want to understand what I am actually saying no to.',
  'I do not care what everyone else has. We are not everyone else.',
  'We are not everyone else is technically true but sounds like the end of the conversation rather than the beginning of one. Asking questions about what they actually want to do with the thing shows you are taking them seriously. Half the time the conversation becomes more interesting than the argument.',
  'This week, look up one or two facts about what they are asking for. Come back with information, not just a position. You might learn something. You might not change your mind. But they will notice you tried.',
  'partial_ban',
  false,
  1318
),

(
  'explorer',
  'daily-moments',
  'Finding Something Upsetting on Their Device',
  'You have found something on your child''s phone or in their search history that worries you. Violence, adult content, or something else entirely.',
  'Say nothing yet. Take a breath, think about what you actually want to know, and choose a calm moment. Then: I came across something on your phone that I want to talk about. I am not angry. I want to understand what was going on.',
  'Do not wait until you are angry to have this conversation. And do not start by saying I went through your phone.',
  'How you open this conversation determines whether you get the truth or a wall. If the first thing they feel is shame or surveillance, they will not tell you the real story. Calm and curious lands better than shocked and accusatory. You want information, not a confession.',
  'Before you talk to them, decide what you actually want as the outcome. More information? A conversation about what they saw? A plan going forward? Knowing your own goal helps you stay calm when they get defensive.',
  'none',
  false,
  1319
),

(
  'shaper',
  'daily-moments',
  'The Instagram Comparison Crash',
  'Your teenager has gone quiet or said something self-critical after time on Instagram. You think they are comparing themselves to what they are seeing.',
  'You seem a bit flat after being on there. Instagram is genuinely designed to make everyone feel like everyone else has something they don''t. Even the people posting it feel it.',
  'Just stop using it then. You know it is not real.',
  'Telling a teenager that social media is not real does not help because the emotional response is real even when the content is not. Naming the design of the platform rather than their response to it shifts it from a personal weakness to a systemic problem. You are not broken for feeling this. The app is built to make you feel this.',
  'One question, not tonight: what do you actually feel when you come off it? Good, flat, or somewhere in between? You do not need to change anything yet. Just notice.',
  'partial_ban',
  false,
  1320
),

(
  'builder',
  'daily-moments',
  'The Homework Panic Spiral',
  'It is Sunday evening. Your child suddenly reveals they have not started a piece of work due tomorrow. They have been on their device all weekend.',
  'Right. Let us see what there actually is. Show me the task. We are going to do what we can in the next hour and that is all.',
  'This is what happens when you spend all weekend on screens. I cannot help you with this now.',
  'Withdrawing help as a consequence in this moment teaches the wrong lesson. The lesson you want them to learn is that there is always a next step, however late it gets. Staying calm and helping them triage the work gives you a much better conversation about screens later, when you are both not panicking.',
  'Tomorrow, not tonight, ask one question: what would have made it easier to remember? Not a lecture. One question.',
  'none',
  false,
  1321
),

(
  'shaper',
  'daily-moments',
  'When You Discover They Have Been Messaging Someone Unknown',
  'You have found out your teenager has been messaging someone online that you do not know. It could be innocent. It could be more than that.',
  'I need to talk to you about something. I am not accusing you of anything. I came across some messages and I want to understand who this person is and what is going on.',
  'You are in serious trouble. Who is this person? Give me your phone right now.',
  'Starting with serious trouble closes the conversation before it opens. You need information first. Most of the time there is an innocent explanation. Sometimes there is not. Either way, you need them talking, not defensive. Calm and curious gets you closer to the truth than alarmed and accusatory.',
  'After the conversation, whatever you find, do not punish communication. Punishing them for talking to people online teaches them to hide it better. The conversation about safety matters more than the consequence.',
  'none',
  false,
  1322
),

(
  'foundation',
  'daily-moments',
  'When They Say Everything Is Boring Without a Screen',
  'You have taken the device away or limited screen time and your child is telling you that everything is boring. Nothing you suggest is good enough.',
  'I hear you. Bored is uncomfortable. Give it ten minutes and see what your brain comes up with.',
  'You never used to need a screen to have fun. Go and find something to do.',
  'The brain takes time to shift from the high stimulation of a screen to the lower stimulation of real-world play. The uncomfortable gap is real, not performed. Naming it, giving it a time limit, and stepping back is usually enough. The ten minutes almost always produces something.',
  'This week, have one thing ready that requires no setup when the device goes off. Lego on the table. A ball in the garden. A snack. Something physical and low-stakes.',
  'none',
  true,
  1323
),

(
  'builder',
  'daily-moments',
  'When They Haven''t Eaten Because They Were Gaming',
  'You realise your child has not eaten anything since breakfast because they have been absorbed in a game.',
  'Right, device off. Food first. You can come back to it after you have eaten.',
  'You are addicted to that thing. Look at you, you haven''t even eaten.',
  'The addiction frame is rarely helpful at this age and immediately makes the conversation about the screen rather than the need. A child who forgets to eat while absorbed in an activity is showing normal developmental engagement. Food first, conversation later. Brief and direct works here.',
  'Tomorrow, agree a food check-in time on gaming days. Not rules about gaming. Just a time they know food will be ready and the game pauses.',
  'none',
  false,
  1324
),

(
  'explorer',
  'daily-moments',
  'When the Phone Breaks or Gets Lost',
  'Your child''s phone has been broken, lost, or stolen. They are devastated and possibly panicking about being out of contact with their friends.',
  'I know that feels awful. We will sort out what happens next tomorrow. Tonight, what do you actually need to tell people and can we do that from another device?',
  'This is why you should look after your things. We cannot afford to replace that.',
  'The this is why lecture in the moment of distress does not land as a lesson. It lands as blame when they are already upset. Solving the immediate practical problem first and saving the conversation about care and cost for tomorrow produces a much better outcome on both fronts.',
  'When they are calm, have a brief practical conversation about what happens next. Not as a punishment. As a plan.',
  'none',
  false,
  1325
),

(
  'shaper',
  'daily-moments',
  'When Your Rules Are Different From Their Friends'' Parents',
  'Your teenager is furious that their friend is allowed something you have decided against. They see your approach as unfair or embarrassing.',
  'I understand you think this is unfair. Different families make different choices and I have made mine. I am always happy to hear your argument but I will not change my mind because another parent said yes.',
  'If their parents want to let them do that, that is their problem. In this house we do things differently.',
  'That is their problem dismisses the real social difficulty your child is experiencing. Acknowledging that different families make different choices validates the situation without undermining your decision. You can hold your position without making other parents the villains.',
  'Ask yourself honestly whether your position is about safety or habit. Sometimes revisiting a rule with new information is the right thing. Sometimes it is not. Know which one this is before you have the conversation.',
  'partial_ban',
  false,
  1326
),

(
  'builder',
  'daily-moments',
  'Sibling Fights Over One Device',
  'Two children are fighting over who gets the device, how long each has had it, and whether the other one is cheating the time.',
  'Right, I am taking it. Neither of you gets it until you can agree a plan between you. Come and find me when you have one.',
  'I do not care who started it. You are both as bad as each other.',
  'You are both as bad as each other does nothing to solve the problem and makes both children feel aggrieved. Removing the object and making the resolution their responsibility removes you from the referee role. Most children will reach an agreement faster than you expect when the alternative is no device at all.',
  'Make a simple device schedule with their input this week. Even a rough one. Having an agreed plan reduces the negotiation every time.',
  'none',
  false,
  1327
),

(
  'shaper',
  'daily-moments',
  'When They See Something Violent or Disturbing Online',
  'Your teenager has seen something online that has upset or disturbed them. They may come to you or you may notice they seem off.',
  'Tell me as much or as little as you want. Whatever you saw, your reaction to it is normal. Some things online are genuinely disturbing.',
  'Why were you even watching that? What platform was it on? I am putting parental controls on everything.',
  'Why were you watching that makes them feel stupid or ashamed for something that was likely algorithmic rather than sought. Parental controls as the immediate response shifts the focus from them to the device. What they need first is for their response to be named as normal. Then you can have the wider conversation.',
  'Once they are settled: was it something that appeared, or something they went looking for? Not an accusation. Just a question. The answer changes what you do next.',
  'none',
  false,
  1328
),

(
  'independent',
  'daily-moments',
  'When They Stop Talking to You and Talk to Their Phone',
  'Your 16 or 17 year old no longer tells you anything directly. You find out what is happening in their life through glimpses of conversations or social media rather than from them.',
  'I know you have your own life and I am not trying to get in the way of it. I just want to know how you are. Not the detail. Just you.',
  'You used to tell me everything. I feel like I don''t even know you anymore.',
  'I don''t even know you anymore puts the emotional weight on them to fix your feelings, which usually produces withdrawal rather than opening up. I just want to know how you are is low pressure and specific. It asks for mood, not detail. Teenagers can usually answer that.',
  'One brief check-in this week with no agenda. A meal. A car journey. Not a sit-down conversation. Just proximity and one question.',
  'none',
  false,
  1329
),

(
  'explorer',
  'daily-moments',
  'When They Use Their Phone to Avoid an Awkward Situation',
  'You notice your child pulls out their phone whenever something uncomfortable happens: a family gathering, a social situation that feels hard, silence in the car.',
  'Nothing right now. Later, in private: I noticed you find it easier to go on your phone when things feel a bit uncomfortable. Most people do. What is it like when you put it away?',
  'Put that away. This is rude. Pay attention to what is happening around you.',
  'Put that away shuts the behaviour down without addressing what is underneath it. The phone is managing anxiety, not creating it. Naming it privately and gently as a pattern you have noticed, without shame, opens a conversation that the public reprimand never would.',
  'Notice where you reach for your own phone when things feel uncomfortable. Children learn this from watching us, not from instruction.',
  'none',
  false,
  1330
);

-- ════════════════ seeds/daily_moments_batch3.sql ════════════════

-- Daily Moments Scripts — Batch 3: Real Daily Life Incidents
-- Category: daily-moments
-- Sort orders: 1331-1370
-- Covers: morning routine, school transitions, snacks, clothes, dinner, evening TV,
--         homework, sibling conflict, bedtime, and the full arc of a parenting day

INSERT INTO public.scripts (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order) VALUES

-- ── MORNING ROUTINE ──────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The Teeth Brushing Standoff',
  'It is 8am. Your child is refusing to brush their teeth. You have asked three times and you are already late.',
  'Two minutes. You choose the toothpaste, I will set the timer. Then we are done.',
  'Why do you make this so hard every single morning? Just brush your teeth.',
  'The every morning makes your child feel like a problem rather than a person who is struggling with a task. Giving choice within a non-negotiable boundary is the fastest route through sensory or autonomy resistance. The timer removes you from the role of the one making them stop.',
  'This week, let them pick their own toothbrush or toothpaste at the shops. Ownership changes the dynamic more than any strategy.',
  'none',
  true,
  1331
),

(
  'foundation',
  'daily-moments',
  'Getting Dressed is a War',
  'Your child is on their third meltdown this week about what to wear. You are going to be late again.',
  'Right. These two. Which one today?',
  'You wore that yesterday. Just put something on. I do not have time for this.',
  'An open wardrobe is too many decisions for a child who is already overwhelmed. Two options removes the executive load while preserving the sense of control. The I do not have time framing tells them their feelings are an inconvenience rather than addressing the actual barrier.',
  'Tonight, lay out two choices for tomorrow with their input. Not your choice. Their shortlist. The morning becomes the execution, not the decision.',
  'none',
  true,
  1332
),

(
  'builder',
  'daily-moments',
  'School Bag Not Packed',
  'It is 8:15am. Your child has not packed their bag. They cannot find their PE kit, their reading book, or their homework.',
  'Take what you can find. If something is missing, that is what happened today. You can sort it with your teacher.',
  'This is because you left everything to the last minute. This is not my problem.',
  'This is not my problem is technically true but leaves a child panicking at the door. Taking the natural consequence of an unpacked bag is more educational than the rescue, but it lands better when you stay warm while holding the boundary. Missing a PE lesson once is a powerful teacher.',
  'After school, a five minute bag check together. Not you doing it for them. You sitting nearby while they do it. Build the habit before the morning rush.',
  'none',
  false,
  1333
),

(
  'builder',
  'daily-moments',
  'Lunch Not Packed',
  'You are at work and you have had a text from school that your child has no lunch.',
  'If this is a text you receive: I will sort it with the school. Tonight, let us work out how to make sure it does not happen again.',
  'If this is discovered at the door: Right, we will ask school to help you today. We are going to sort this out properly tonight.',
  'The rescue with a lecture at the door produces shame without learning. Solving the practical problem first and having the logistics conversation in the evening produces a much better outcome on both fronts. Hunger at school is a real consequence but one the school can usually help with once.',
  'Tonight, one question: where should the lunch box live on a school night so it is impossible to forget? Let them answer.',
  'none',
  false,
  1334
),

(
  'foundation',
  'daily-moments',
  'How Did the Morning Go',
  'You have just dropped your child at school. The morning was hard. You need to get on with your day but it is sitting with you.',
  'This is for you: take a breath. One hard morning does not define your parenting or their day. Most children leave the house upset and walk into school fine.',
  'Do not replay the morning. Do not text the school unless something is seriously wrong.',
  'The morning rupture that loops in your head all day is a normal feature of parenting young children. Research on attachment consistently shows that the rupture is not what matters. The repair is what matters. A warm pickup, a hug, one question about their day is the repair.',
  'Tonight: a proper hello when they come home. Put the morning away. They usually already have.',
  'none',
  true,
  1335
),

-- ── SCHOOL TRANSITIONS ────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The School Drop Off Struggle',
  'Your child is clinging to you at the school gate. They are crying or refusing to go in. The teacher is waiting.',
  'I know this is hard. I love you. I will be here at pickup. Go with your teacher.',
  'Come on, there is nothing to cry about. Everyone else is going in fine.',
  'Everyone else is going in fine is among the least useful things a parent can say at a gate. It invalidates the child''s experience and adds shame to the anxiety. A brief, warm, confident goodbye is genuinely the most protective thing you can do. Prolonged negotiation at the gate increases separation anxiety over time.',
  'Agree a goodbye ritual together. A specific handshake, three squeezes, a code word. Children who have a predictable ending to the goodbye settle faster.',
  'none',
  true,
  1336
),

(
  'builder',
  'daily-moments',
  'The School Pickup Debrief',
  'You have picked up your child. They are either completely silent or erupting at everything since the moment they got in the car.',
  'Nothing yet. Just drive. Offer a snack. After ten minutes: anything good happen today?',
  'How was school? What did you do? Was it a good day? Did anything happen?',
  'The barrage of questions on pickup is the exact moment children need least from you. They have been regulated all day and they need to decompress first. A snack, ten minutes of silence or music, one low-stakes question is the highest-yield pickup strategy. The stories arrive later.',
  'Notice what time the conversation actually starts on the days it does. That is the decompression window. Match your questions to it.',
  'none',
  false,
  1337
),

-- ── SNACKS AND FOOD ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'The After School Snack Battle',
  'Your child is raiding the cupboards the moment they come in. You want them to eat dinner in an hour.',
  'Have some of this. Dinner is in about an hour so something small is fine.',
  'Do not eat that now, you will ruin your dinner. Wait.',
  'A child who has been at school all day is often genuinely hungry. Hunger after school is biological, not manipulative. A small snack does not ruin dinner in most children. Fighting it creates a power struggle over food which is the thing you most want to avoid.',
  'Keep a snack bowl at child level with the things you are happy for them to eat freely. It removes the negotiation entirely.',
  'none',
  false,
  1338
),

(
  'builder',
  'daily-moments',
  'Choosing Healthy Snacks',
  'Your child wants crisps or biscuits. You want them to have something more nutritious. This happens every afternoon.',
  'You can have some of those and some of this. Both is fine.',
  'Those are not a snack. Why can you not just eat an apple?',
  'The why can you not just eat an apple framing puts your child on trial for normal food preferences. Children who are offered ultra-processed food alongside whole food without a moral charge eat a more balanced diet over time than children who have junk food locked away. Restriction increases fixation.',
  'This week, put fruit and vegetables out alongside the crisps. No comment. Just both available. Notice what happens over five days.',
  'none',
  false,
  1339
),

-- ── EVENING: CLOTHES AND HOUSEHOLD ────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Clothes Not in the Washing Bag',
  'You are doing the washing. Your child''s clothes are on the floor, on the chair, or in a pile next to the washing bag but not in it.',
  'Anything on the floor tonight does not get washed. Just so you know.',
  'How many times do I have to tell you? These need to go in the basket. This is so simple.',
  'How many times signals that you expect compliance without having created the conditions for it. A natural consequence delivered without emotion is more educational than the same instruction repeated loudly. Wearing a damp PE kit once, or missing a favourite top for a week, is a remarkably effective teacher.',
  'Show them where the basket is one more time. Then let the consequence do the work this week. Say nothing more about it.',
  'none',
  false,
  1340
),

-- ── EVENING: DINNER ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'Choosing Dinner is a Crisis',
  'You asked what they want for dinner. Now there is a thirty minute debate, someone is crying, and you still do not know what you are making.',
  'I am making pasta tonight. You can choose the sauce. Those are the two options.',
  'Fine, what does everyone want? Tell me and I will make it.',
  'The open offer of what do you want invites a negotiation that has no natural end. Children genuinely cannot manage that level of executive decision-making when they are tired and hungry. Two clear options within a decision you have already made is not restrictive. It is kind.',
  'Pick two or three meals that always work and rotate them through the week. Predictability is not boring. It is calming.',
  'none',
  true,
  1341
),

(
  'builder',
  'daily-moments',
  'They Will Not Eat What You Have Made',
  'You have cooked dinner. Your child looks at it, says they hate it, and wants something else.',
  'This is dinner tonight. You do not have to eat it but there is nothing else until breakfast.',
  'Fine, I will make you something different. But next time you are going to eat what I cook.',
  'Next time you are going to eat what I cook is a promise neither of you can keep and sets up tomorrow''s battle before tonight is over. Holding the boundary without drama and without alternative is the single most consistent thing parents can do to address picky eating over time. Hunger is not an emergency.',
  'If they choose not to eat, do not comment. Clear the table. Let them go. If they say they are hungry later, a glass of milk or a piece of bread is fine.',
  'none',
  false,
  1342
),

(
  'foundation',
  'daily-moments',
  'Healthy Dinner Refusal',
  'You have made something nutritious. Your child is asking for nuggets, pasta, or something beige.',
  'I hear you. This is what we have tonight. Have as much or as little as you like.',
  'You need vegetables. You cannot just live on pasta. Try at least one bite.',
  'The try one bite rule has consistently negative outcomes in research on picky eating. It teaches children to manage your anxiety about their eating rather than to develop a genuine relationship with food. Staying neutral, continuing to offer, and refusing to cook alternatives is the evidence-based approach.',
  'If this is every night with the same foods refused, talk to your GP. Restricted eating in young children can flag sensory issues that respond well to early support.',
  'none',
  false,
  1343
),

-- ── EVENING: TV AND SCREENS ────────────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Evening TV Will Not Turn Off',
  'It is 7:30pm. You have said the TV is going off. It has not gone off. You have been saying it for twenty minutes.',
  'Right. TV off now. I know you want to finish the episode. I am turning it off and we will find where you got to together tomorrow.',
  'I said turn it off. Why do you never listen to me? That is it, no TV tomorrow.',
  'No TV tomorrow is a punishment that arrives at the wrong moment and is hard to enforce consistently. It creates tomorrow''s battle tonight. Turning the TV off yourself, with calm, removes you from the negotiation and signals that the decision is made. Finding where they got to tomorrow removes the injustice of the missing ending.',
  'This week, agree the evening TV window before it starts, not after it has already run long. The agreement beforehand is what prevents the battle at the end.',
  'none',
  false,
  1344
),

(
  'explorer',
  'daily-moments',
  'TV Shows That Are Too Old',
  'Your child is watching something on Netflix or YouTube that you feel is not appropriate for their age. They say all their friends watch it.',
  'I want to watch the first episode with you tonight. Then we can decide together.',
  'That is not appropriate. Turn it off. Where did you even find that?',
  'Immediate prohibition produces underground watching, not protected children. Watching alongside them changes your position from censor to guide. You can name what you see, ask questions about how it lands, and make a shared decision. In most cases the show is less alarming than the title suggested.',
  'If after watching you decide it is not right: I watched it with you and I do not think it is for now. Not for another year or two. That is a decision, not a punishment.',
  'none',
  false,
  1345
),

-- ── HOMEWORK ─────────────────────────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'Homework Every Night is a Battle',
  'Homework is a nightly source of conflict. Your child avoids it, refuses it, or melts down the moment you mention it.',
  'Right, fifteen minutes. You do it, I will be in the kitchen. Come and find me if you get stuck.',
  'We do this every single night. Sit down and do your homework. It is not that hard.',
  'It is not that hard is almost never true for the child sitting in front of it. The battle is usually about confidence, not compliance. Fifteen minutes with a visible end point and your presence nearby but not hovering is consistently more productive than standing over them demanding effort.',
  'If the same subject produces a meltdown every week, mention it to the teacher. It often flags a gap the school has not identified.',
  'none',
  false,
  1346
),

(
  'explorer',
  'daily-moments',
  'The Forgotten Homework Discovery',
  'At 9pm you discover your child has not done homework that is due tomorrow.',
  'Right. How much is there? Let us see what we can actually do in the next thirty minutes.',
  'This is because you wasted the whole evening. I am not staying up to help you.',
  'Withdrawing help as a consequence leaves a child going to school unprepared, which damages their relationship with the school rather than teaching the intended lesson. Staying calm and doing what can be done in thirty minutes gives you a much better conversation tomorrow about what the plan is going forward.',
  'Tomorrow, not tonight: one question only. Where could you have fitted this in? Not a lecture. One question. Let them work it out.',
  'none',
  false,
  1347
),

-- ── SIBLING CONFLICT AND FIGHTING ────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'They Will Not Stop Fighting',
  'Your children have been arguing since they came home. You have intervened four times. Nothing is working.',
  'Right, separate rooms, separate activities. You can come back together when you are both calm.',
  'Stop it. Why are you always fighting? What is wrong with you two?',
  'What is wrong with you two invites children to define themselves as a problem rather than two people who are stuck in a conflict. Sibling conflict is developmental and normal. Separation without judgment gives both children the regulation break they need. Most sibling arguments dissolve within twenty minutes if you remove the audience.',
  'Notice what time of day the fighting peaks. Hunger and tiredness are the two most common drivers. A snack or ten minutes of quiet often solves what felt like a personality clash.',
  'none',
  true,
  1348
),

(
  'builder',
  'daily-moments',
  'They Are Fighting Over Something Specific',
  'Your children are arguing over whose turn it is, who had it longer, or who broke whose thing.',
  'Right, everyone stops. One at a time. You first. Then you.',
  'I do not want to hear it. Sort it out between yourselves.',
  'Sort it out yourselves works well with children over ten who have the tools for conflict resolution. For younger children it usually means the loudest or most persistent child wins, and the resentment builds. Giving each child thirty uninterrupted seconds to say their piece de-escalates faster than any other approach.',
  'After the immediate situation is resolved: what would fair look like here? Ask both of them. The answer is usually closer than you expected.',
  'none',
  false,
  1349
),

(
  'explorer',
  'daily-moments',
  'Older Sibling Being Unkind',
  'Your older child is being consistently unkind, dismissive, or exclusionary toward a younger sibling.',
  'A word quietly with the older child: I have noticed what is happening with your brother or sister. I am not accusing you. But I need it to stop.',
  'You should be ashamed of how you treat them. You are the older one. You should know better.',
  'You should know better activates shame rather than empathy, which closes down the conversation. A private, low-temperature conversation about what you have noticed and what you need from them is more likely to change the behaviour. Teenagers are often unkind to younger siblings because of their own stress, not because they dislike them.',
  'If it continues, one brief conversation: what is going on with you at the moment? The behaviour is usually a signal.',
  'none',
  false,
  1350
),

-- ── BEDTIME ROUTINE ───────────────────────────────────────────────────────────

(
  'foundation',
  'daily-moments',
  'Getting Up for Bed is a Battle',
  'It is bedtime. Your child is still downstairs. They are asking for one more thing: one more drink, one more hug, one more question.',
  'One drink, one wee, one story, one hug. That is the list. Then that is it.',
  'I have told you to go to bed four times now. That is it. Go. Now.',
  'Go now said four times has already lost its authority by the fourth time. A concrete list of what is allowed resets the negotiation on your terms. Children ask for one more things because the transition to bed is emotionally difficult, not because they are trying to be difficult. A clear sequence makes the ending predictable.',
  'Make a bedtime routine chart together this week with pictures for younger children. When the chart is done, the night is done. The chart ends the night, not you.',
  'none',
  true,
  1351
),

(
  'builder',
  'daily-moments',
  'Will Not Go to Sleep',
  'Your child is in bed but calling out, coming downstairs, or has been awake for over an hour.',
  'You are in bed, you are safe, you do not need to be asleep yet. Stay in your room quietly. I will check on you in ten minutes.',
  'Go to sleep. There is nothing to worry about. Just close your eyes.',
  'Close your eyes does nothing for a child whose nervous system is still activated. You do not need to be asleep yet removes the performance pressure of sleep itself, which paradoxically makes sleep arrive faster. The ten minute check-in promise keeps the anxiety manageable without rewarding the calling out.',
  'Check the bedroom environment: temperature, light, sound. Blackout blinds, white noise, and a cool room change the sleep context more reliably than behaviour management.',
  'none',
  false,
  1352
),

(
  'explorer',
  'daily-moments',
  'Sleep Pattern Has Gone',
  'Your child is going to sleep late, waking in the night, or waking too early. Their mood and behaviour during the day are suffering.',
  'Something is off with your sleep and I can see it is affecting you. Can we look at what the evenings look like and try to shift it?',
  'You are exhausted because you will not just go to sleep. This is your own fault.',
  'Sleep problems in children aged 10 to 15 are rarely willful. They are usually a combination of circadian shift, screen exposure, anxiety, or social stress. Naming that you can see the effect on them without blame opens a collaborative conversation. This is your fault closes it entirely.',
  'One screen-free hour before bed for a week. Not as a punishment. As a genuine sleep experiment. Ask them to rate their sleep at the end of the week.',
  'none',
  false,
  1353
),

(
  'foundation',
  'daily-moments',
  'The Midnight Requests',
  'It is 11pm. Your child is downstairs again or calling out for a drink, a cuddle, or because they had a bad dream.',
  'Come here. Let me settle you. Back to bed in five minutes.',
  'It is midnight. Get back to bed right now. You are too old for this.',
  'The you are too old for this removes dignity from a child who is genuinely unsettled. Night waking in children under 8 is normal and episodic. A brief, warm, matter-of-fact response that does not reward the waking with extended attention is the right balance. Five minutes of comfort followed by a firm but gentle return to bed is not spoiling them.',
  'If night waking is happening more than three nights a week for more than two weeks, mention it to the GP. It can signal anxiety or sleep disruption that responds to simple support.',
  'none',
  false,
  1354
),

-- ── GENERAL DAILY PRESSURE POINTS ─────────────────────────────────────────────

(
  'builder',
  'daily-moments',
  'A Day Where Everything Went Wrong',
  'Today was just a hard day. Multiple incidents, multiple conflicts, multiple things you handled less well than you wanted to.',
  'This one is for you. Breathe. One hard day does not make you a bad parent. You showed up. That is the job.',
  'Do not list all the things you should have done differently before you have slept.',
  'The parenting research literature is consistent on one thing above all others: children need a parent who is present and who repairs after hard moments, not a parent who handles every moment perfectly. You will have a chance to repair tomorrow. That is what the research actually shows matters.',
  'One repair tomorrow. Pick one moment from today and acknowledge it briefly. I was not great this morning. I am sorry for that. That is enough.',
  'none',
  true,
  1355
),

(
  'builder',
  'daily-moments',
  'Screen Time Before School Has Happened Again',
  'Despite the agreement, your child has been on their device this morning before school. You discovered it too late to do anything before they left.',
  'Nothing this morning. Tonight: I noticed the device was on before school. That was not the agreement. What happened?',
  'Right, that is it. No device this evening. I told you.',
  'An immediate evening removal feels just to the parent but arbitrary to the child because the gap between the behaviour and the consequence is too long. A calm conversation tonight asking what happened gives you information and treats your child as someone capable of having a conversation rather than just receiving punishment.',
  'If it happens again, a conversation about the charging location. Structural change beats repeated consequence.',
  'none',
  false,
  1356
),

(
  'explorer',
  'daily-moments',
  'The Messy Bedroom',
  'Your child''s bedroom is in a state. You have asked them to tidy it multiple times. It is still a mess.',
  'Your room needs to happen this weekend. Saturday before lunch. That is the deal.',
  'Your room is disgusting. How can you live like this? You are tidying it now.',
  'Now as an instruction on a weekday evening rarely produces a clean room. It produces a row. A specific, boundaried time at the weekend with a clear consequence if it does not happen gives both of you a clean framework. The you are disgusting framing tells them you judge them, not just the room.',
  'Set the consequence before the weekend. If it is not done by Saturday lunch, one weekend activity comes off the table. Name it in advance. Then enforce it calmly if needed.',
  'none',
  false,
  1357
),

(
  'shaper',
  'daily-moments',
  'They Were Rude to You Today',
  'Your child spoke to you in a way that was genuinely unkind. You did not respond well. Or you held it together but you are still stinging.',
  'If they are still around: I need to say something. The way you spoke to me earlier was not okay. I am not angry now. But I need you to know.',
  'Do not pretend it did not happen. Do not let it slide to keep the peace.',
  'Letting rudeness pass without naming it teaches your child that the behaviour is acceptable. Naming it calmly, without punishment, and at a slightly delayed moment lands better than immediate escalation. I need you to know is different from a lecture. It is one sentence. One sentence is enough.',
  'If this is a pattern and not an isolated incident, that is worth a brief conversation about what is going on for them generally. Persistent rudeness is often a sign of something else.',
  'none',
  false,
  1358
),

(
  'foundation',
  'daily-moments',
  'A Good Day Worth Noticing',
  'Something went well today. Maybe a conversation happened. Maybe there was no fight at bedtime. Maybe you handled something better than you expected.',
  'This is for you: tell someone. A friend, a partner, yourself. The hard days get talked about. The good ones often do not.',
  'Do not discount it because tomorrow might be hard again.',
  'The negativity bias in parenting is real. Hard days lodge. Easy days slip. Deliberately naming a day that went well is not naivety. It is calibration. Research on wellbeing consistently shows that actively noticing positive moments protects parents against burnout and improves their capacity for hard days.',
  'Tonight, one thing: write it down or say it out loud. That was a good day. Or even, that moment was good. That is enough.',
  'none',
  true,
  1359
);

-- ════════════════ seeds/009_daily_moments_seed.sql ════════════════

-- 009_daily_moments_seed.sql
-- 60+ research-backed moment cards covering every key daily scenario
-- science_brief: single sentence grounded in child development research
-- digi_opener: DiGi's first question when the card is flipped
-- solutions: 3 proven strategies (jsonb array)

INSERT INTO public.daily_moments (title, category, age_bands, icon, science_brief, digi_opener, solutions, expert_note, sort_order) VALUES

-- ── MORNING ──────────────────────────────────────────────────────────────────

('Won''t get out of bed',
 'Morning', ARRAY['4-7','8-11','12-15'],
 '🛏️',
 'Children''s circadian rhythms shift across development, and cortisol peaks later in adolescents, making school-time waking genuinely harder than it appears.',
 'What does the first five minutes of their morning usually look like — do they get stuck at the bedroom door, or is it getting started on anything that''s the problem?',
 '["Give a 10-minute warning the night before by setting their phone alarm together — joint ownership reduces resistance.", "Move the first positive thing of the morning (music, short video, talking to a pet) to before getting dressed.", "Avoid the voice — a tap on the shoulder or a light change signals wake without triggering conflict."]',
 'Dr. Lisa Damour: morning resistance in teens is often biology, not defiance.',
 10),

('Morning TV battle',
 'Morning', ARRAY['4-7','8-11'],
 '📺',
 'Morning screen use before school is reliably associated with lower ability to shift attention in classroom settings in children under 10 (Nathanson & Fries, 2016).',
 'Is it the TV itself they want, or is it the avoidance of getting dressed and ready?',
 '["Separate the screen from the morning entirely — put on a podcast or music instead so the sensory need is met differently.", "If TV does happen, a physical timer that counts down reduces the shutdown fight because the timer ends it, not you.", "Build something they look forward to at school into the morning conversation rather than negotiating about the screen."]',
 'Research consistently shows the transition off screens, not screens themselves, is where conflict lives.',
 11),

('Phone before school',
 'Morning', ARRAY['8-11','12-15','16-18'],
 '📱',
 'Adolescents who check social media in the 30 minutes before school show measurably elevated cortisol and reduced working memory during first-period lessons.',
 'What are they actually looking for when they pick up the phone first thing — messages, TikTok, or just the habit of it?',
 '["Charge phones outside the bedroom overnight — this removes the phone from the morning equation without a daily battle.", "A consistent no-phones-until-after-breakfast rule is easier to enforce than a time limit because it has a clear physical trigger.", "Acknowledge the pull: ''I know you want to check in, let''s agree you can look for two minutes when you''re out the door.''"]',
 NULL,
 12),

('Getting dressed fight',
 'Morning', ARRAY['4-7','8-11'],
 '👕',
 'Clothing conflict in young children is often a control and sensory issue, not defiance — children aged 4-8 have limited tolerance for sensory discomfort they cannot articulate.',
 'Is it a specific thing they hate wearing, or is it the task of getting dressed itself that feels overwhelming first thing?',
 '["Lay out clothes the night before with their input — the choice has been made, the morning is just the execution.", "Give two concrete options rather than open choice: ''the blue jumper or the grey one?'' removes executive load.", "Check for genuine sensory triggers: seams, labels, waistbands — these are real and removing them costs nothing."]',
 'Occupational therapists flag sensory processing sensitivity in roughly 1 in 6 children.',
 13),

('Won''t eat breakfast',
 'Morning', ARRAY['4-7','8-11','12-15'],
 '🥣',
 'Children''s appetite on waking is individually variable and not a reliable health indicator — forcing breakfast has weaker evidence than ensuring something is available within an hour of waking.',
 'Do they say they''re not hungry, or do they want something specific that you don''t have, or is it just the time pressure?',
 '["Offer something portable they can eat on the way — a banana and a handful of crackers in a bag removes the table-sitting pressure.", "Don''t fight breakfast on school mornings. A piece of fruit going out the door is a win.", "If appetite is a consistent issue, talk to their GP — it can flag sleep quality or anxiety."]',
 NULL,
 14),

('Morning meltdown before school',
 'Morning', ARRAY['4-7','8-11'],
 '😭',
 'Morning meltdowns before school are frequently anxiety-driven and peak on Mondays and after holidays — the trigger is anticipatory dread, not defiance.',
 'Does this happen every morning, or is it specific days or situations at school that seem to be feeding it?',
 '["Name the feeling directly: ''You seem really worried about today. What feels hardest about going in?'' Connection before compliance.", "Don''t reassure with ''it''ll be fine'' — validate the anxiety first, then problem-solve the specific thing.", "A predictable goodbye ritual (a hug at a specific spot, a code word) reduces separation anxiety for primary-age children."]',
 'School refusal affects 2-5% of children — if this is daily for more than two weeks, ask the school for a conversation.',
 15),

('Brushing teeth battle',
 'Morning', ARRAY['4-7','8-11'],
 '🦷',
 'Tooth brushing resistance is a sensory and autonomy issue in children under 10 — the sensation is genuinely aversive to some children and the battle makes it worse.',
 'Is it the taste, the sensation, or the fact that you''re making them do it — or all three?',
 '["Let them choose their toothpaste flavour — mint is often the culprit for sensory-sensitive children.", "A two-minute timer (or a toothbrushing song on Spotify) makes the endpoint visible and moves authority from you to the clock.", "Brush together for younger children — modelling makes the routine feel shared rather than imposed."]',
 NULL,
 16),

-- ── DIGITAL ──────────────────────────────────────────────────────────────────

('First smartphone decision',
 'Digital', ARRAY['8-11','12-15'],
 '📲',
 'There is no evidence-based universal age for a first smartphone — readiness depends on social context, the child''s self-regulation, and the family''s ability to maintain structure around it.',
 'What''s driving the conversation right now — are their friends getting them, or is there a specific function they need it for?',
 '["Start with a basic phone (calls and texts only) for 6 months — a staged introduction builds trust and allows structure to form before social media arrives.", "Set the family agreement before the phone arrives, not after: charging location, no-phone hours, what happens if the rules don''t hold.", "The bedroom rule (no devices overnight in bedrooms) is the single most-researched protective factor — establish it from day one."]',
 'Common Sense Media: the average US first smartphone age is 10.3. UK mirrors this. Earlier is not protective.',
 20),

('TikTok / Instagram request',
 'Digital', ARRAY['8-11','12-15','16-18'],
 '📱',
 'Passive social media consumption (scrolling without posting) shows the strongest association with adolescent low mood — active use (messaging, creating) is significantly less harmful.',
 'What does their actual use look like when they''re on it at a friend''s — are they watching, posting, or messaging?',
 '["Delay, don''t deny: ''Let''s revisit in three months'' buys time and avoids a power struggle while the landscape shifts.", "If they do get it, set up together: privacy settings on, comments from friends only, time limits inside the app.", "The algorithm conversation is the most protective thing a parent can do: explain what it''s doing, why certain content keeps appearing, and that it is not a reflection of who they are."]',
 NULL,
 21),

('Screen time limit battle',
 'Digital', ARRAY['4-7','8-11','12-15'],
 '⏱️',
 'Screen time limits alone show consistently weak effect sizes in the research — what matters is what is being displaced (sleep, movement, face-to-face interaction) and the quality of the surrounding relationship.',
 'When the argument happens, is it about the amount of time or what they have to stop doing — a game mid-session, a show at a cliffhanger?',
 '["A five-minute warning before the limit is up is consistently more effective than a hard stop — give them a chance to reach a stopping point.", "Focus the rule on displacement rather than duration: no screens until homework is done, not ''only 2 hours a day''.", "Co-viewing or shared gaming occasionally (even briefly) changes the dynamic from screen-as-enemy to shared experience."]',
 'Paediatric researchers Przybylski and Weinstein found the dose-response curve flattens well above typical guidance levels.',
 22),

('Gaming all day',
 'Digital', ARRAY['8-11','12-15','16-18'],
 '🎮',
 'Gaming disorder affects roughly 3% of players — for the majority, heavy gaming is a symptom of unmet social or achievement needs rather than a cause of poor wellbeing.',
 'What games are they playing, and who are they playing with — is it mostly solo or with friends online?',
 '["Ask about the game genuinely: who they play with, what they''re working toward, what they''re proud of. Social gaming is not the same as solitary scrolling.", "The intervention point is displacement: is gaming replacing sleep, homework, or face-to-face friends? That''s the calibration question.", "A hard rule on gaming before school or after 10pm is evidence-based. A total weekend limit rarely holds and damages trust."]',
 NULL,
 23),

('YouTube rabbit holes',
 'Digital', ARRAY['4-7','8-11','12-15'],
 '▶️',
 'YouTube''s recommendation algorithm is optimised for engagement, not wellbeing — children who start with age-appropriate content regularly land in algorithmically adjacent content that is not appropriate.',
 'What kind of content do they usually start watching — and have you seen where it ends up after 30 minutes of autoplay?',
 '["Disable autoplay on YouTube (Kids and regular) — the algorithm-driven queue is the primary risk, not the first video they chose.", "Watch together occasionally and name what you see: ''That comment section looks pretty harsh'' builds media literacy organically.", "Switch to YouTube Kids with the custom settings enabled until they''re old enough to understand the algorithm conversation."]',
 NULL,
 24),

('Mood crash after screens',
 'Digital', ARRAY['8-11','12-15','16-18'],
 '😠',
 'Post-screen irritability (''the screen hangover'') is a well-documented physiological response to dopamine dysregulation after high-stimulation media — it is not a character flaw.',
 'Does the crash happen after all screens or specifically after certain things — games, social media, or videos?',
 '["Build a transition ritual before screens end: a 5-minute wind-down activity (drawing, walking to the kitchen, getting a snack) buffers the dopamine drop.", "Name it without blame: ''You always feel a bit rough after a long session — let''s see if we can make the landing easier.''", "Avoid starting gaming or high-stimulation content within 90 minutes of bedtime — the cortisol response extends well past the session."]',
 'Dopamine dysregulation after gaming is measurable on EEG in children aged 8 and above.',
 25),

('Secretive phone use',
 'Digital', ARRAY['12-15','16-18'],
 '🔒',
 'Adolescent secrecy around phones mirrors the same developmental drive for privacy that previous generations used locked diaries — the medium is new but the developmental need is identical.',
 'Has this come on suddenly, or has it always been how they use it — and has anything changed at school or with friends recently?',
 '["Resist the urge to grab and check — the trust damage lasts longer than whatever you might find. Instead: ''I''ve noticed you''re more private about your phone lately. Are you okay?''", "Establish before there''s a crisis: ''If something you see online ever troubles you, I won''t overreact. I want to be the person you come to.''", "A charging station outside the bedroom is a structural boundary that doesn''t require surveillance."]',
 NULL,
 26),

('Bedroom rule pushback',
 'Digital', ARRAY['8-11','12-15','16-18'],
 '🚪',
 'The bedroom rule (no devices overnight in the bedroom) is the single most consistently replicated protective factor for adolescent sleep and mental health in the digital literature.',
 'Is the pushback about trust, about fear of missing messages overnight, or something else they haven''t said directly?',
 '["Frame it as a health decision, not a punishment: ''Phones keep your brain alert. Mine does the same thing — that''s why mine stays outside too.''", "Get a cheap alarm clock and remove the ''I need my phone as an alarm'' argument entirely.", "If they''re worried about missing urgent messages overnight, agree a family emergency protocol so that anxiety is addressed."]',
 'Jean Twenge''s research shows the bedroom rule alone accounts for 21 minutes of additional sleep per night in teenagers.',
 27),

('Following influencers',
 'Digital', ARRAY['12-15','16-18'],
 '⭐',
 'Social comparison via influencer content is the strongest mediating variable between social media use and adolescent low mood — particularly for girls around appearance-related content.',
 'Do they talk about specific influencers they follow, and have you noticed whether their own body talk or self-comparison has shifted?',
 '["Open the algorithm conversation: ''The people you follow shape what you see. Are you following people who make you feel better or worse?''", "Curating the feed is a skill, not a restriction — teach it as digital hygiene, like brushing teeth.", "The comparison trap works on adults too — sharing your own experience removes the generational gap and makes it a shared human conversation."]',
 NULL,
 28),

('Group chat anxiety',
 'Digital', ARRAY['8-11','12-15'],
 '💬',
 'Group chat exclusion and social drama is the dominant source of adolescent peer stress in the UK currently, displacing in-person bullying as the most common reported issue.',
 'Is there a specific chat or group that''s causing the anxiety, or is it the general pressure of being constantly available?',
 '["Name what you''re seeing: ''You seem more anxious after you check your phone. Is something happening in a chat?''", "Muting group chats overnight is a practical skill — model it on your own phone first.", "The permission to opt out is powerful: ''If a chat is making you feel worse, you''re allowed to leave it. I''ll help you if the social fallout feels scary.''"]',
 NULL,
 29),

-- ── SCHOOL ───────────────────────────────────────────────────────────────────

('Homework refusal',
 'School', ARRAY['4-7','8-11','12-15'],
 '📚',
 'Homework refusal is most commonly driven by task avoidance due to low confidence, not laziness — children who struggle often need the work broken into smaller units before compliance improves.',
 'Is it all homework or specific subjects, and does it get better or worse depending on how their day at school went?',
 '["Sit near them but not with them — proximity without intrusion reduces anxiety without creating dependency.", "''Work for 15 minutes and then we''ll see'' is consistently more effective than ''do your homework'' — small time commitments reduce avoidance.", "Contact the teacher if a subject comes up repeatedly — repeated refusal often signals a gap the school hasn''t identified yet."]',
 NULL,
 30),

('School refusal or school anxiety',
 'School', ARRAY['4-7','8-11','12-15'],
 '🏫',
 'School anxiety is the most common childhood anxiety presentation and is distinct from defiance — the physical symptoms (stomach ache, headache on Sunday evenings) are real, not performed.',
 'When does it start — is it Sunday night, Monday morning, or is it every morning, and are there specific days or lessons that seem worse?',
 '["Never dismiss the physical symptoms. Acknowledge them first: ''Your stomach really hurts. Tell me what''s worrying you about today.''", "Contact the school before the absence becomes entrenched — schools have protocols for this and early intervention has much better outcomes.", "Gradual exposure (part-day attendance, meeting a trusted adult at the gate) consistently outperforms forced full attendance."]',
 'Dr. Elaine Miller-Karas: avoidance of anxiety-provoking situations strengthens anxiety rather than reducing it.',
 31),

('Friendship fallout',
 'School', ARRAY['4-7','8-11','12-15','16-18'],
 '👫',
 'Children''s friendships are the primary driver of school wellbeing from age 8 onward — the quality of one close friendship matters more than having a large peer group.',
 'Can you tell me a bit about what happened — is this a falling out or more of a gradual drift, and how long have they been friends?',
 '["Resist the urge to fix it or contact the other parents immediately — listen first, fully.", "Help them identify what they want to happen: ''Do you want to repair this, or are you okay letting it be?'' gives them agency.", "Normalise the conflict: friendship fallouts in childhood are the training ground for adult relationship repair."]',
 NULL,
 32),

('Won''t tell you about school',
 'School', ARRAY['8-11','12-15','16-18'],
 '🤐',
 'The ''how was school'' to ''fine'' exchange is developmentally normal from age 9 onward — adolescents need a decompression period before they can process and share their day.',
 'Is the silence new, or has it always been like this — and does it change on certain days or after certain activities?',
 '["Replace ''how was school'' with a specific: ''Who did you sit with at lunch?'' or ''Did you do that presentation today?'' Specific questions have specific answers.", "Give them 30-45 minutes after school before engaging — the decompression window is real.", "Share something from your own day first — reciprocal disclosure is more effective than interrogation."]',
 NULL,
 33),

('Exam stress and pressure',
 'School', ARRAY['8-11','12-15','16-18'],
 '📝',
 'Moderate stress during exams is adaptive and normal — the protective factor is a growth mindset around mistakes rather than the absence of pressure.',
 'Is this their own pressure or something they''ve picked up from teachers, you, or comparing themselves to friends?',
 '["Separate the grade from the person: ''A bad mark tells us something about how this subject clicked, not about who you are.''", "Sleep and movement in the revision period have stronger evidence for performance than extra study hours past 10pm.", "If the anxiety is physical (not eating, not sleeping, crying regularly), that''s a signal to involve the school and possibly a GP."]',
 NULL,
 34),

('Doesn''t want to go to clubs or activities',
 'School', ARRAY['4-7','8-11','12-15'],
 '⚽',
 'Children''s willingness to try new activities is strongly shaped by their tolerance for novelty and social uncertainty — this is temperamental, not a character flaw.',
 'Is this a general reluctance to try new things, or is it specific to this activity — and how long have they been wanting to quit?',
 '["Honour the ''want to quit'' without immediately complying: ''Let''s do three more sessions and then we''ll decide.'' The window usually shifts.", "Never compare to siblings or friends who are enthusiastic about activities — comparison kills intrinsic motivation.", "If they truly hate it after a fair trial, let them stop. Forced activities reliably damage children''s relationship with that activity long-term."]',
 NULL,
 35),

-- ── FOOD ─────────────────────────────────────────────────────────────────────

('Won''t eat dinner',
 'Food', ARRAY['4-7','8-11'],
 '🍽️',
 'Ellyn Satter''s Division of Responsibility research shows that children''s appetite regulates reliably when parents control what is offered and children control how much they eat.',
 'Is it specific foods they refuse, or do they just not seem hungry at dinner, and have they eaten something substantial in the afternoon?',
 '["Serve one food you know they''ll eat alongside new foods — the safe food reduces anxiety and increases willingness to try.", "Remove ''eat your vegetables and then you can have pudding'' — conditional eating trains children to distrust their hunger signals.", "Repeated neutral exposure (food on the plate without pressure) works on a timescale of weeks, not days — keep offering."]',
 'Satter''s research: parental pressure at mealtimes is the strongest predictor of picky eating persistence.',
 40),

('Extreme picky eating',
 'Food', ARRAY['4-7','8-11','12-15'],
 '😤',
 'Extreme selective eating (Avoidant/Restrictive Food Intake Disorder) affects 5-14% of children and is neurologically driven, not a preference — standard picky eating strategies make it worse.',
 'How limited is the range we''re talking about, and has it stayed the same or is it getting narrower over time?',
 '["If the safe food list is under 15 items or is shrinking, ask the GP for a referral to a paediatric feeding specialist — this is beyond standard picky eating.", "Never force, trick, or shame. Children with ARFID have heightened sensory responses to food — the distress is genuine.", "Focus on eating together rather than eating the same thing — social mealtime has protective value even when the plate differs."]',
 'ARFID is diagnosed by a dietitian or CAMHS, not at home — early referral has significantly better outcomes.',
 41),

('Wants snacks instead of meals',
 'Food', ARRAY['4-7','8-11'],
 '🍪',
 'Children aged 4-10 often eat better in smaller, more frequent portions than the adult three-meals structure — their stomachs are smaller and their energy needs are more variable.',
 'Are the snacks filling them up so they''re not hungry at meal times, or is it that they prefer the snack food over what''s on the plate?',
 '["Offer the main meal first with no snack available for 30 minutes before — not as a rule, but as a structure that protects appetite.", "If snacks are happening because meals aren''t working, look at what''s on the plate rather than removing the snack.", "Grazing is not necessarily a problem — a child who eats consistently across the day is hitting their nutritional needs regardless of meal structure."]',
 NULL,
 42),

('Dinner table phone use',
 'Food', ARRAY['8-11','12-15','16-18'],
 '🍴',
 'Device-free family mealtimes are one of the most consistently replicated protective factors for family communication quality and adolescent wellbeing in the research literature.',
 'Is it phones at the table that''s the friction point, or is it that you''re all barely eating together in the first place?',
 '["Phones in a basket before sitting down — not confiscated, just parked. Everyone''s, including yours.", "One specific conversation topic per meal works better than general ''let''s talk'' — ''What''s one good thing that happened today?'' has a specific answer.", "If the teen pushes back, make the value explicit: ''This is the one time I get to hear about your day. The phone will be there in 20 minutes.''"]',
 NULL,
 43),

('Complaints about packed lunch',
 'Food', ARRAY['4-7','8-11'],
 '🥪',
 'Lunchbox complaints peak between ages 6-9 when social comparison at school becomes salient and children start noticing what peers have.',
 'Is it specific things they hate, or is it about what other children have that they want?',
 '["Involve them in packing it once a week — ownership reduces complaints more reliably than changing what you put in.", "Acknowledge the social comparison: ''I know some kids have different lunches. What would feel like an upgrade that I could actually manage?''", "If they''re not eating it, ask the school what''s happening at lunchtime — sometimes the issue is a friend situation, not the food."]',
 NULL,
 44),

-- ── EVENING ──────────────────────────────────────────────────────────────────

('Bedtime resistance',
 'Evening', ARRAY['4-7','8-11','12-15'],
 '🌙',
 'Children''s natural sleep drive arrives later than the school schedule requires — bedtime resistance is often a mismatch between biological readiness and parental expectation.',
 'Is the resistance at the time you set, or do they genuinely not seem tired then, and is this worse in summer?',
 '["Anchor bedtime to a consistent pre-sleep sequence (bath, book, same order) rather than a clock time — the routine signals sleep approach more effectively than the number.", "Screens off 60-90 minutes before sleep is the single most impactful intervention for falling asleep faster.", "''You don''t have to sleep, but you have to be in bed quietly'' reduces the power battle and sleep usually follows."]',
 NULL,
 50),

('Won''t put the phone down at night',
 'Evening', ARRAY['12-15','16-18'],
 '📵',
 'Adolescents checking phones at night lose an average of 44 minutes of sleep per night — the social anxiety of missing overnight messages is the primary driver, not defiance.',
 'Is it specific things they''re afraid of missing, or is it more the habit and the pull of the phone?',
 '["An agreed phone charging point outside the bedroom removes the temptation and the nightly battle simultaneously.", "''What are you afraid of missing while you sleep?'' is a more productive conversation than ''put the phone down now.''", "Model it yourself — if your phone is in your bedroom at night, the rule has no structural credibility."]',
 NULL,
 51),

('Overtired meltdowns at bedtime',
 'Evening', ARRAY['4-7','8-11'],
 '😤',
 'The 6-7pm cortisol peak in young children can cause a second wind that reads as energy but is actually the stress system fighting sleep onset — the child is overtired, not under-tired.',
 'Does the meltdown seem to come out of nowhere, or is there a pattern around a specific time or after a specific activity?',
 '["Move bedtime earlier by 20 minutes for two weeks and observe — overtired children are often put to bed too late.", "A calm sensory input before bed (warm bath, quiet music, dim lights) reduces the cortisol response.", "Avoid high-stimulation activities in the 45 minutes before bed — rough-and-tumble play, screens, and homework all spike alertness."]',
 'Sleep scientists confirm overtiredness creates a paradoxical alertness response in children under 8.',
 52),

('Staying up too late',
 'Evening', ARRAY['12-15','16-18'],
 '🦉',
 'Adolescent circadian rhythm shift is biological — melatonin onset delays by up to 2 hours in puberty, meaning teenagers genuinely cannot feel sleepy at the times parents expect.',
 'Is this a school night problem, a weekend problem, or both, and does the late staying up mean they''re actually sleeping in when they can?',
 '["The school night non-negotiable is the intervention point — weekend later bedtimes aligned to biology are less harmful than forcing early sleep that doesn''t come.", "Blue light blocking in the evening (screen modes, or glasses) advances melatonin onset by 30-90 minutes in adolescents.", "''I need you to be in bed by 10, but I understand you won''t feel sleepy straight away'' acknowledges the biology while holding the boundary."]',
 NULL,
 53),

('Gaming late at night',
 'Evening', ARRAY['8-11','12-15','16-18'],
 '🕹️',
 'Late-night gaming is more disruptive to sleep quality than late-night passive viewing because of the combination of cortisol response, blue light, and mid-game stopping difficulty.',
 'What time are they starting, what time are they finishing, and are they online with friends or playing solo?',
 '["The online gaming problem: they can''t just stop when they want to because it disrupts friends. Acknowledge this and build a natural stopping point into the agreement.", "A hard off-time agreed before the session starts is more effective than interrupting mid-game.", "Power off the router for the house at a consistent time — it creates a shared external rule rather than a parent-v-child dynamic."]',
 NULL,
 54),

('Nighttime anxiety and worry',
 'Evening', ARRAY['4-7','8-11','12-15'],
 '😰',
 'Anxiety reliably peaks at bedtime because the quiet removes the distraction that manages it during the day — this is the most common reason children delay sleep.',
 'What does the worry tend to be about — school, friendships, something specific, or is it more vague and general?',
 '["A worry dump before bed (writing, drawing, or saying worries to a ''worry jar'') externalises the anxiety and creates a physical container for it.", "''We can talk about this in the morning'' is only effective if you actually follow up — the promise of a morning conversation genuinely helps.", "If the worries are significant and nightly, a short course of CBT-based anxiety support through school or the GP is more effective than parental reassurance alone."]',
 NULL,
 55),

-- ── TRANSITIONS ──────────────────────────────────────────────────────────────

('Staying at grandparents or other family',
 'Transitions', ARRAY['4-7','8-11','12-15'],
 '👴',
 'Children''s behaviour on return from alternative caregiving environments typically deteriorates temporarily — they are releasing the regulation they maintained elsewhere, which is a healthy sign of security.',
 'Is the difficulty the staying over itself, the returning home after, or something specific about the arrangement?',
 '["Brief them on the differences in advance: ''Grandma has different rules about X. That''s fine for there, our rule at home is Y.''", "Expect the behaviour dip on return and don''t over-interpret it — connection before correction on the day they come home.", "Maintain one non-negotiable from home (bedtime, no devices in the bedroom) even during stays — consistency reduces re-entry confusion."]',
 NULL,
 60),

('Divorce or separated family schedule',
 'Transitions', ARRAY['4-7','8-11','12-15','16-18'],
 '🏠',
 'Children in two-household families benefit most from consistent expectations between homes — not identical rules, but a shared commitment to the child''s stability over parental conflict.',
 'What''s the current arrangement, and where is the friction showing up most for them?',
 '["Keep adult conflict completely away from children — research is unequivocal that exposure to parental conflict is more damaging than the separation itself.", "Transition days are hard. Build a landing ritual at each home (their spot, their snack, their 20 minutes) to reduce the reorientation stress.", "Never ask children to carry messages or report on the other household — it puts them in an impossible loyalty position."]',
 NULL,
 61),

('New sibling adjustment',
 'Transitions', ARRAY['4-7','8-11'],
 '👶',
 'Regressive behaviour (bedwetting, baby talk, clinginess) after a new sibling is a normal stress response and typically resolves within 3-6 months with consistent individual attention.',
 'How long has the baby been home, and what specific behaviours have changed — is it at a particular time of day or around specific triggers?',
 '["15 minutes of one-to-one time daily with the older child, without the baby present, is the most evidenced intervention for sibling adjustment.", "Name the displacement: ''It must be strange having everything change. I still love exactly the same amount, just now shared differently.''", "Regressive behaviours: respond to the need, not the behaviour. They''re asking for reassurance in the only language that feels safe."]',
 NULL,
 62),

('Moving school or house',
 'Transitions', ARRAY['4-7','8-11','12-15'],
 '📦',
 'School transitions are among the most stressful life events for children, with effects on wellbeing measurable for up to 12 months — preparation and predictability are the protective factors.',
 'How far in advance did they know, and have they had a chance to process it in their own way?',
 '["Give as much advance information as possible — knowing what the new place looks like, who the teacher is, where things are reduces anticipatory anxiety.", "Maintain as many routines as possible around the change — the familiar inside the unfamiliar is stabilising.", "If they struggle beyond 8-10 weeks in a new school, ask the school to connect them with a peer buddy or check-in adult."]',
 NULL,
 63),

('Holiday routine breakdown',
 'Transitions', ARRAY['4-7','8-11','12-15'],
 '🏖️',
 'School holidays remove structure without replacing it, which is disorienting for children who have regulated around the school day — this is most pronounced in children with anxiety or ADHD.',
 'Is the disruption the screen time going up, the sleep going sideways, or is it general restlessness and boredom?',
 '["A loose anchor structure (wake by X, meals at roughly X, screen time not before X) is protective without being rigid.", "Boredom tolerance is a developmental skill — resist the urge to fill every hour. Unstructured time that feels uncomfortable is building capacity.", "If the holiday pattern causes major regression that takes more than 2 weeks to recover from on school return, look at what the school environment provides that home doesn''t."]',
 NULL,
 64),

-- ── EMOTIONS ─────────────────────────────────────────────────────────────────

('Anger and tantrums',
 'Emotions', ARRAY['4-7','8-11'],
 '😡',
 'Tantrums and anger outbursts are the result of immature prefrontal cortex regulation — children under 8 literally cannot inhibit emotional responses the way adults do, and expecting them to is developmentally unrealistic.',
 'What typically triggers it, and what does your response look like when it happens?',
 '["During the outburst: safety first, silence second. Stay calm, say little, don''t try to reason until the emotion has passed.", "After the storm: ''What happened in your body when you got angry?'' builds the interoceptive awareness that eventually enables self-regulation.", "Find the pattern — is it hunger, fatigue, overstimulation, or transition? Removing the trigger is more effective than managing the tantrum."]',
 'Ross Greene: explosive children have a skill deficit, not a will deficit.',
 70),

('Anxiety and excessive worrying',
 'Emotions', ARRAY['4-7','8-11','12-15','16-18'],
 '😟',
 'Anxiety in children often presents as physical complaints, avoidance, or irritability rather than visible worry — it is the most common childhood mental health difficulty, affecting 1 in 11.',
 'Does the anxiety have a focus (specific things they worry about) or is it more general and pervasive?',
 '["Validate first: ''That sounds really scary for you. I hear that.'' Reassurance alone (''don''t worry, it''ll be fine'') is consistently less effective.", "Avoid systematic avoidance of anxiety triggers — graduated exposure with support is the gold standard for anxiety treatment.", "If anxiety is interfering with daily life for more than 4 weeks, ask the GP about CAMHS referral or a CBT-based online programme."]',
 'CBT is the most evidenced intervention for childhood anxiety. Waitlists are long — ask GP about private options.',
 71),

('Low mood or seeming sad',
 'Emotions', ARRAY['8-11','12-15','16-18'],
 '😔',
 'Persistent low mood (more than 2 weeks, present most days, interfering with school or friendships) meets the clinical threshold for depression assessment — it is distinct from ordinary sadness.',
 'How long has this been going on, and are there areas of their life that still seem to bring them pleasure, or has it been across the board?',
 '["Keep the lines open without forcing the conversation: ''I notice you seem a bit low lately. I''m here when you want to talk, no pressure.''", "Physical activity has strong evidence for mild-to-moderate depression in adolescents — getting outside together, even briefly, is an active intervention.", "If it''s persistent, they''re withdrawing from everything they used to enjoy, or there is any mention of self-harm, go to the GP that week."]',
 'One in four UK teenagers will experience depression. Early intervention significantly improves outcomes.',
 72),

('Emotional outbursts over small things',
 'Emotions', ARRAY['4-7','8-11','12-15'],
 '💥',
 'Disproportionate emotional responses are often the visible surface of a deeper stress load — the ''small thing'' that triggers it is rarely the real issue.',
 'When does it tend to happen — after school, after screens, before bed, or is there no pattern?',
 '["Look for the load underneath: sleep deficit, social stress, sensory overload, or anxiety about something unrelated to the trigger.", "''That seemed like a big reaction to something small. Are you carrying something else today?'' is more useful than addressing the immediate outburst.", "Build emotional vocabulary together when things are calm — children who can name their states are consistently better at regulating them."]',
 NULL,
 73),

('They won''t talk to you about feelings',
 'Emotions', ARRAY['8-11','12-15','16-18'],
 '🗣️',
 'Children who are reluctant to share emotions with parents often report fearing overreaction, judgment, or the conversation being used against them later — these are specific and addressable fears.',
 'Have there been times in the past when they did share something and it went badly — or is it more that they don''t seem to know how to start?',
 '["''If you ever told me something difficult, I wouldn''t overreact and I wouldn''t use it against you. I want to be the person you come to.'' Say it explicitly.", "Side-by-side conversations (in the car, on a walk) consistently produce more openness than face-to-face.", "Share your own emotional experiences first — normalising the emotional vocabulary removes the feeling that it''s weird or vulnerable to share."]',
 NULL,
 74),

('Jealousy of siblings',
 'Emotions', ARRAY['4-7','8-11','12-15'],
 '👀',
 'Sibling jealousy is driven by the perception of differential treatment rather than actual treatment differences — research shows perceived fairness matters more than objective equality.',
 'What does the jealousy focus on most — attention, privileges, outcomes at school, or something specific that happened recently?',
 '["Never compare siblings: ''your sister doesn''t do that'' is the single most resentment-generating phrase in the developmental literature.", "Acknowledge the feeling: ''You wish you got that too. That''s fair.'' Validation without capitulation.", "One-to-one time with each child (even 15 minutes) consistently reduces sibling rivalry more than managing the rivalry directly."]',
 NULL,
 75),

('Guilt and shame responses',
 'Emotions', ARRAY['4-7','8-11','12-15'],
 '😞',
 'Shame (''I am bad'') is destructive to self-concept; guilt (''I did something bad'') is functional and motivates repair — parental language shapes which response children develop.',
 'When something goes wrong, do they tend to go very quiet and withdraw, or do they lash out, or is it a mix?',
 '["Focus language on the behaviour, never the person: ''That was unkind'' not ''you are unkind.''", "When they do something wrong, model repair rather than punishment: ''What do you think would make this right?''", "Excessive guilt and shame in children can flag perfectionism or anxiety — watch whether it generalises beyond specific incidents."]',
 NULL,
 76),

('Shyness and social withdrawal',
 'Emotions', ARRAY['4-7','8-11','12-15'],
 '🐢',
 'Introversion and shyness are distinct: introversion is a stable temperament, shyness is anxiety about social situations — only the latter typically benefits from graduated exposure support.',
 'Is this across all social situations or specific ones, and has it changed recently or been consistent since they were young?',
 '["Never force social participation or draw attention to the shyness in the moment — both reliably make it worse.", "Warm-up time before social events (what will happen, who will be there, what they can do if it feels too much) significantly reduces social anxiety.", "One good friend has more protective value than a large social group — focus on depth, not breadth."]',
 NULL,
 77),

('Can''t cope with losing (games, sport)',
 'Emotions', ARRAY['4-7','8-11','12-15'],
 '🏆',
 'Inability to tolerate losing is a self-regulation deficit most common in children with perfectionism or underlying anxiety — it is addressable with consistent low-stakes practice.',
 'Does it happen in all contexts or specific ones, and is there a pattern around who they lose to — friend, sibling, parent?',
 '["Play games you know they might lose regularly — normalise it in low-stakes family contexts before the social cost is high.", "''Good game'' as a genuine post-game ritual (not a consolation) builds sportsmanship as habit.", "If the distress is severe and persists past age 8, look at the anxiety picture more broadly — perfectionism rarely sits alone."]',
 NULL,
 78),

-- ── ADDITIONAL DIGITAL / WELLBEING ──────────────────────────────────────────

('Influencer body image',
 'Digital', ARRAY['12-15','16-18'],
 '🪞',
 'Social comparison via appearance-focused social media content is the strongest single predictor of body dissatisfaction in adolescent girls, and is rising in boys (Fardouly et al., 2018).',
 'Have they said anything directly about their body or appearance, or is it more that you''ve noticed a shift in how they talk about themselves?',
 '["Audit the feed together: ''Who makes you feel worse when you see their posts?'' — then unfollow together, not as a punishment but as a hygiene decision.", "''Your feed is a mirror. It reflects what you choose to see.'' Frame curation as skill, not restriction.", "If comments about weight, appearance, or restricting food become frequent, that warrants a conversation with the GP."]',
 'NHS data shows eating disorder presentations in under-18s increased 42% between 2020 and 2024.',
 29),

('Deepfakes and AI content confusion',
 'Digital', ARRAY['12-15','16-18'],
 '🤖',
 'Adolescents are less able than adults to identify AI-generated content and deepfakes, creating specific risks around believability of misinformation and image-based abuse.',
 'Have they encountered something specific, or is this a general conversation you want to have before something happens?',
 '["Make it concrete: show them a deepfake example and ask if they could tell. The experience of almost being fooled is more effective than being told about it.", "The key message: ''If something makes you really angry or shocked, your first job is to verify it before sharing.'' Emotional hijacking is the mechanism.", "Image-based abuse (fake explicit content) is now illegal in the UK. They need to know they can report it and nothing that happens to them is their fault."]',
 NULL,
 80),

('Online stranger danger (modern)',
 'Digital', ARRAY['8-11','12-15'],
 '⚠️',
 'Online grooming follows a predictable pattern (isolation, flattery, boundary testing, secrecy requests) that can be taught to children as a recognisable sequence.',
 'Have they had any conversations online that felt unusual to them, or is this a proactive conversation you want to start?',
 '["Teach the pattern rather than the rule: ''If someone you met online makes you feel special in a way that feels different from your real friends, and then asks for something private — that is the pattern to watch for.''", "''You will never be in trouble for telling me something that happened online, even if you broke a rule to be there.'' This removes the biggest barrier to disclosure.", "Reporting is simple: most platforms have one-click tools. Show them where the button is before they need it."]',
 'CEOP (Child Exploitation and Online Protection Command) provides age-appropriate guides at thinkuknow.co.uk.',
 81),

('Too much YouTube / passive viewing',
 'Digital', ARRAY['4-7','8-11'],
 '📺',
 'Passive video watching (YouTube, streaming) engages lower cognitive processing than interactive media — the primary risk for young children is displacement of active, relational, creative activity.',
 'What are they watching, how long are the sessions typically, and what else are they doing with their time?',
 '["Co-viewing even occasionally — watching with them, asking what they think about it — shifts passive consumption to active engagement.", "Use the parental controls on YouTube Kids to restrict to age-appropriate content and disable autoplay.", "The quality of surrounding activity matters more than the screen time number: reading, outdoor play, and face-to-face time are what''s being displaced."]',
 NULL,
 82),

('Social media and self-worth',
 'Digital', ARRAY['12-15','16-18'],
 '❤️',
 'Children who base their self-worth on external validation (likes, followers) show higher vulnerability to anxiety and depression than those with internal self-concept — the platform design amplifies this.',
 'Do they talk about how many likes things get, or do you notice their mood tracking with their social performance?',
 '["''Your worth isn''t determined by how many people engaged with a post.'' Say it plainly, repeatedly, not just after a bad moment.", "Help them build identity anchors outside the platform: skills, relationships, achievements that exist independently of an audience.", "Hiding like counts (available on Instagram) is a practical step worth trying — research shows it reduces comparison behaviour."]',
 NULL,
 83),

-- ── EVENING / PARENT SUPPORT ─────────────────────────────────────────────────

('Parental guilt about shouting',
 'Emotions', ARRAY['4-7','8-11','12-15','16-18'],
 '😔',
 'All parents lose their temper. Occasional shouting in an otherwise warm relationship does not cause lasting harm — what matters is the repair that follows.',
 'What typically pushes you to the point of shouting, and what tends to happen in the house after?',
 '["Repair is the intervention. After you''ve both calmed: ''I shouldn''t have shouted. I was frustrated but that wasn''t okay. I''m sorry.'' Models exactly what you want from them.", "Identify your own trigger pattern — time pressure, certain behaviours, certain times of day. Knowing your pattern gives you a second to respond rather than react.", "You are not breaking your child by having difficult moments. You are breaking the pattern when you repair."]',
 'Dan Siegel: the repair of ruptures in attachment is as important as the absence of ruptures.',
 85),

('Feeling like a failure as a parent',
 'Emotions', ARRAY['4-7','8-11','12-15','16-18'],
 '💙',
 'Parental self-criticism is strongly associated with harsher parenting behaviour — the most direct intervention for child outcomes is the parent''s own wellbeing.',
 'What''s happening right now that''s making this feel particularly hard — is it something specific with them, or is it more a general exhaustion?',
 '["Name the specific thing rather than the general failure: ''I handled that badly'' is more addressable and less self-destructive than ''I''m a bad parent.''", "The fact that you are worried about whether you''re doing it right is itself evidence that you care — indifferent parents don''t ask these questions.", "Your emotional regulation in hard moments matters more than whether you execute every strategy perfectly. Connection and repair are the foundation."]',
 NULL,
 86),

('Don''t know how to talk about mental health',
 'Emotions', ARRAY['4-7','8-11','12-15','16-18'],
 '🧠',
 'Parental mental health literacy is the strongest predictor of whether children seek help for mental health difficulties — families that talk about emotions normalise help-seeking.',
 'Is there something specific you want to talk to them about, or is it more about building the general language in your family?',
 '["Start with your own emotions as the subject — ''I felt anxious about that'' builds the vocabulary without putting them on the spot.", "''Mental health'' is not a phrase that needs to wait for crisis — normalise it: ''Just like you go to the doctor for a sore throat, sometimes people talk to someone when their feelings feel too big.''", "For teenagers: the GP can refer, and many GP practices now have in-house counsellors. It doesn''t have to be CAMHS."]',
 NULL,
 87),

('Sleep problems (parent burnout)',
 'Evening', ARRAY['4-7','8-11'],
 '😴',
 'Parental sleep deprivation reduces tolerance for difficult behaviour and increases harsh parenting — addressing the parent''s sleep is a legitimate and evidence-based child outcome intervention.',
 'How long has the sleep been disrupted, and is it one child waking, or the general exhaustion of the day catching up?',
 '["If a child over 3 is waking regularly without a medical cause, sleep training or the use of a sleep consultant is evidence-based and not unkind.", "''I can''t be the parent I want to be when I''m running on empty.'' Protecting your own sleep is parenting.", "If it''s burnout rather than night waking: one hour of protected time per week for each parent has measurable wellbeing effects in the research."]',
 NULL,
 88);

-- ════════════════ seed-ai-module.sql ════════════════

-- Guided Childhood: AI Literacy module (evergreen lessons). Run after migration 002_ai_module.sql.
insert into public.ai_lessons
  (audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order)
values
-- ===== AGE 7 =====
( 'age_7',
  'what_is_ai',
  'What is AI?',
  'AI is a clever computer helper. It is a bit like a parrot that has heard millions of sentences and learns to copy them. It does not really think or feel like you do. It looks at patterns and makes a good guess at what comes next.',
  'You are growing up with AI all around you, in tablets, games and helpers that talk. Knowing it is a guessing machine and not a person helps you stay the boss of it.',
  'Ask a grown up to show you a talking helper, then notice that it copies words it has heard before.',
  'AI is a guessing machine, not a thinking person.',
  'How do I explain to my 7 year old what AI actually is?',
  10 ),

( 'age_7',
  'how_ai_learns',
  'How does AI learn?',
  'AI learns by looking at huge piles of pictures and words, more than you could ever count. It is like learning what a cat looks like after seeing a million cat photos. Nobody hands it rules. It spots patterns by itself.',
  'When you know AI learns from lots of examples, it stops feeling like magic. It is just very good pattern spotting, and you can understand it.',
  'Look at three photos of dogs together and notice the things that are the same. That is how AI learns too.',
  'AI learns by spotting patterns in lots of examples.',
  'What is a simple way to explain how AI learns to a young child?',
  11 ),

( 'age_7',
  'llms_chatbots',
  'Talking helpers',
  'Some AI helpers can chat with words, like Claude. They guess the next word that usually comes after the last one, a bit like finishing a song you know. They are not really talking to you. They are filling in likely words very fast.',
  'You will meet chatty helpers in many places. Understanding that they guess words helps you enjoy them without believing every single thing they say.',
  'Start a sentence like "Once upon a time" and take turns guessing the next word. That is the chatbot game.',
  'Chatbots guess the next word, very fast.',
  'How do I describe chatbots to my child without making them seem alive?',
  12 ),

( 'age_7',
  'ai_safety',
  'Ask a grown up',
  'AI can be fun, but it does not know you or love you. If something feels strange, scary or too good to be true, you stop and tell a grown up you trust. A helper on a screen is never a swap for a real person who cares about you.',
  'Children sometimes think a friendly screen voice is a safe friend. Learning to bring things to a trusted adult keeps you safe and happy.',
  'Pick one trusted grown up today and say, "If a screen ever worries me, I will come and tell you."',
  'A trusted grown up always comes before a screen.',
  'How do I teach my 7 year old to come to me when something online feels wrong?',
  13 ),

( 'age_7',
  'hallucinations',
  'Sometimes it is wrong',
  'AI can sound very sure and still be wrong. It is guessing, so sometimes the guess is silly or made up. Just because it says something in a confident voice does not make it true.',
  'You will use AI for homework and questions one day. Knowing it can be wrong means you will check with a book or a grown up instead of believing everything.',
  'Ask an AI helper a funny question and see if the answer is right or a bit made up.',
  'AI can be wrong even when it sounds sure.',
  'How do I help my child understand AI can be confidently wrong?',
  14 ),

( 'age_7',
  'privacy_data',
  'Keep your secrets',
  'Your name, your address, your school and your photos are special and private. You do not tell them to a screen helper, the same way you would not tell a stranger in the street. Private things stay with you and your family.',
  'AI helpers can remember and share what you type. Learning to keep private things private now is a habit that protects you for life.',
  'Make a tiny rule together: "I keep my name, my home and my school just for people we know."',
  'Keep your private things just for people you know.',
  'What private things should I teach my young child never to type into AI?',
  15 ),

( 'age_7',
  'ai_and_feelings',
  'It does not really care',
  'A screen helper can say kind words, but it does not feel love or worry the way your family does. It is being polite because it was built to be. The people who hug you and tuck you in are the ones who truly care.',
  'Young children can bond with friendly voices. Knowing real care comes from real people keeps their hearts pointed at the family and friends who love them.',
  'Name three people who really love you, and notice that none of them live inside a screen.',
  'Real care comes from real people, not screens.',
  'How do I gently explain that an AI helper does not really love them back?',
  16 ),

-- ===== AGE 9 =====
( 'age_9',
  'what_is_ai',
  'AI predicts, it does not think',
  'AI stands for artificial intelligence. It is software that spots patterns and predicts what is likely to come next, whether that is the next word, the next pixel or the next move. It does not understand, think or feel. It is doing very fast, very clever maths on patterns it has seen before.',
  'You are growing up in a world full of AI. If you understand it predicts patterns rather than thinks, you can use it cleverly and never be fooled into treating it like a person.',
  'Watch your phone suggest the next word while you type a message. That suggestion is AI predicting a pattern.',
  'AI predicts patterns. It does not actually think.',
  'How do I explain the difference between predicting and thinking to a 9 year old?',
  110 ),

( 'age_9',
  'how_ai_learns',
  'Learning from huge amounts of data',
  'AI learns by studying enormous amounts of data, like millions of books, photos and conversations. From all of that it works out patterns, such as which words tend to go together. The more good examples it sees, the better its guesses become.',
  'Knowing AI is shaped by the data it learns from helps you understand why it is clever in some ways and clumsy in others. It only knows what it has been shown.',
  'Think of something you got better at by practising lots, like reading. AI improves the same way, with masses of examples.',
  'AI is only as good as the examples it learned from.',
  'How can I describe AI training data to my child in a way that sticks?',
  111 ),

( 'age_9',
  'llms_chatbots',
  'How chatbots like Claude work',
  'A chatbot like Claude is a large language model. It has read a huge amount of text and learned which words usually follow which. When you ask it something, it predicts a likely, sensible answer one word at a time. It is not looking things up like a fact book. It is predicting good words.',
  'Chatbots will be part of school and life for you. Understanding they predict words, rather than know facts, helps you use them well and check anything important.',
  'Ask a chatbot to finish a nursery rhyme, then a tricky fact. Notice it is brilliant at patterns and shakier on exact facts.',
  'Chatbots predict likely words, they do not look up facts.',
  'How do I explain how a chatbot picks its words to a curious 9 year old?',
  112 ),

( 'age_9',
  'hallucinations',
  'Confidently wrong',
  'Because a chatbot predicts likely words, it can make things up and still sound completely sure. This is sometimes called a hallucination. It is not lying on purpose. It simply guessed a smooth answer that happened to be wrong.',
  'You will use AI for facts, dates and homework. Knowing it can be confidently wrong means you will always double check anything that really matters.',
  'Ask an AI a fact you already know well and check its answer. See if it ever sounds sure but slips up.',
  'Always check important facts. AI can be sure and still wrong.',
  'How do I teach my 9 year old to fact check what AI tells them?',
  113 ),

( 'age_9',
  'deepfakes',
  'Pictures can be faked',
  'AI can now create photos, voices and videos that look and sound real but never happened. These are called deepfakes. A picture or a clip is no longer proof that something is true.',
  'You will see images and videos shared everywhere. Knowing they can be made by AI helps you pause and wonder if something is real before you believe or share it.',
  'Look at an AI generated picture with a grown up and hunt for odd details like strange hands or blurry text.',
  'Seeing is no longer believing. Pause and check.',
  'How do I introduce the idea of deepfakes without scaring my child?',
  114 ),

( 'age_9',
  'privacy_data',
  'Your data is precious',
  'When you type into an AI helper, your words can be stored and used. Personal details like your full name, your address, your school or your photos should stay private. Treat them like treasure you do not hand to strangers.',
  'Once private information is online it is very hard to take back. Building careful habits now protects you for years to come.',
  'Make a personal list of three things you will never type into an AI, then keep to it.',
  'Never hand your private details to an AI.',
  'What is the clearest way to teach data privacy to a 9 year old?',
  115 ),

( 'age_9',
  'using_ai_well',
  'A tool, not a boss',
  'AI is a helpful tool, a bit like a calculator or a search engine. It can suggest ideas and help you start, but it is not in charge and it is not always right. You stay the thinker. You decide what to keep and what to ignore.',
  'If you let AI make your choices for you, you stop practising your own thinking. Treating it as a helper keeps your own mind strong and growing.',
  'Use AI to brainstorm ideas for a story, then choose your favourite yourself and write it your own way.',
  'AI helps you think. It does not think for you.',
  'How do I encourage my child to use AI as a helper and not a crutch?',
  116 ),

( 'age_9',
  'ai_safety',
  'AI is not a swap for a person',
  'AI helpers can answer questions any time, but they cannot truly know you, keep you safe or replace the adults who love you. If something online upsets you or feels wrong, the right move is always to tell a trusted grown up.',
  'Children sometimes lean on screens for comfort or advice. Knowing a real adult always comes first keeps you safe when it really counts.',
  'Agree on a "tell me anything" adult at home you can go to when something online feels off.',
  'A trusted adult always comes before an AI.',
  'How do I make sure my child comes to me rather than an AI when worried?',
  117 ),

-- ===== AGE 11 =====
( 'age_11',
  'what_is_ai',
  'What AI really is',
  'Artificial intelligence is software that learns patterns from data and uses them to make predictions or generate content. It does not have understanding, beliefs or feelings. When it seems to think, it is really running statistics on patterns at enormous speed.',
  'You will use AI throughout school and work. Seeing past the magic to the pattern matching underneath means you can use it confidently and judge its output for yourself.',
  'List three AI tools you have used this week, then say what pattern each one is predicting.',
  'AI is powerful pattern prediction, not understanding.',
  'How do I explain what AI really is to my 11 year old without dumbing it down?',
  210 ),

( 'age_11',
  'how_ai_learns',
  'Training on huge data',
  'AI models are trained on vast amounts of data gathered from the internet, books and other sources. During training they adjust millions of internal settings to get better at predicting. The result is a model that reflects the patterns, and the gaps, in whatever it was trained on.',
  'Understanding training helps you see why AI is brilliant at common things and weak at rare or very recent ones. It can only reflect what it has seen.',
  'Ask an AI about a very local or very recent topic. Notice where its knowledge runs thin.',
  'AI mirrors the data it was trained on, gaps included.',
  'How can I explain AI training and its limits to my 11 year old?',
  211 ),

( 'age_11',
  'llms_chatbots',
  'Large language models',
  'A large language model, like Claude, is trained to predict the next word in a sequence. After enough training it can answer questions, explain ideas and write text that flows well. It is important to remember it is generating likely language, not retrieving guaranteed facts.',
  'These tools will be everywhere in your education. Knowing how they produce answers helps you use them as a thinking partner and not a perfect oracle.',
  'Ask a chatbot to explain something you already understand well, and grade how accurate its explanation actually is.',
  'A language model predicts language. It does not guarantee truth.',
  'How do I explain large language models to my 11 year old?',
  212 ),

( 'age_11',
  'hallucinations',
  'When AI invents things',
  'Because AI predicts plausible words, it can invent facts, quotes, sources and figures while sounding totally confident. This is called hallucination. The smooth, certain tone is the dangerous part, because it makes wrong answers feel trustworthy.',
  'You will be tempted to copy AI answers straight into homework. Checking important claims protects your marks, your reputation and your understanding.',
  'Ask an AI for three sources on a topic, then check whether those sources actually exist.',
  'Confident does not mean correct. Always verify.',
  'How do I get my 11 year old into the habit of verifying AI answers?',
  213 ),

( 'age_11',
  'deepfakes',
  'Deepfakes and fake media',
  'AI can generate realistic images, clone voices and create videos of things that never happened. These deepfakes can be funny, but they can also spread lies or be used to bully and trick people. A clip on its own is no longer proof.',
  'You live in a world of shared images and videos. Pausing to question whether media is real protects you from being fooled and from spreading harm.',
  'Find a known example of an AI generated video and discuss what gave it away.',
  'If a clip could change minds, check it before you trust it.',
  'How do I talk to my 11 year old about deepfakes and fake videos?',
  214 ),

( 'age_11',
  'ai_at_school',
  'Learn with it, do not cheat with it',
  'There is a clear line between using AI to learn and using it to cheat. Asking it to explain a hard idea, quiz you or check your reasoning helps you learn. Asking it to write your essay so you can hand it in as your own is cheating, and it robs you of the learning.',
  'Schools increasingly expect honest, sensible AI use. Learning where the line sits protects you and means you actually grow your own skills.',
  'Next homework, use AI only to explain or check, never to write the final answer. Notice how much you still learn.',
  'Use AI to understand, never to pretend it is your work.',
  'How do I help my child use AI for homework without crossing into cheating?',
  215 ),

( 'age_11',
  'privacy_data',
  'Guard your information',
  'AI services can store what you type to improve their models or for other reasons. That means personal details, private photos and anything about your family or friends should stay out of chatbots. If you would not put it on a public noticeboard, do not feed it to an AI.',
  'Information shared online can resurface years later. Strong privacy habits now keep your future self and your friends protected.',
  'Before your next AI chat, decide one rule: what you will keep private no matter what.',
  'If it is private, keep it out of the chatbot.',
  'What privacy rules should I set with my 11 year old about AI?',
  216 ),

( 'age_11',
  'bias_fairness',
  'AI can be unfair',
  'AI learns from human data, and human data contains our unfairness as well as our knowledge. So AI can repeat stereotypes or treat some groups less fairly, without meaning to. It is only reflecting patterns in what it was shown.',
  'You will see AI used to sort, suggest and decide things. Knowing it can be biased helps you question its output rather than assume it is neutral.',
  'Ask an AI to describe people in different jobs and notice any tired stereotypes in its answers.',
  'AI can be unfair because the world it learned from is.',
  'How do I explain AI bias and fairness to my 11 year old?',
  217 ),

-- ===== AGE 13 =====
( 'age_13',
  'what_is_ai',
  'Prediction, not thought',
  'AI is software that finds patterns in data and uses them to predict or generate. Modern systems can feel startlingly human, yet underneath they are calculating probabilities, not reasoning the way you do. There is no inner experience, no intent and no understanding behind the output.',
  'As AI gets more convincing, the temptation to treat it as a mind grows. Holding on to what it really is keeps you in control and harder to manipulate.',
  'When an AI answer impresses you, ask yourself what pattern it predicted to produce that, rather than assuming it understood you.',
  'However human it sounds, it is prediction, not thought.',
  'How do I help my teenager see past how human AI can seem?',
  310 ),

( 'age_13',
  'llms_chatbots',
  'How chatbots generate answers',
  'Chatbots like Claude are large language models trained to predict likely text. They do not hold a database of checked facts. They assemble answers word by word from patterns, which is why they are fluent, flexible and sometimes wrong. Fluency is not the same as accuracy.',
  'You will lean on these tools for study, ideas and writing. Knowing how they generate answers lets you use their strengths and stay alert to their weaknesses.',
  'Ask a chatbot the same factual question twice, worded differently, and compare the answers for consistency.',
  'Fluent and confident is not the same as correct.',
  'How do I explain to my teen that fluent AI answers are not always accurate?',
  311 ),

( 'age_13',
  'hallucinations',
  'Hallucinations and checking',
  'Language models can produce hallucinations: invented facts, fake quotes and made up sources delivered with total confidence. Because the tone is so assured, these errors slip past people who do not check. The fix is simple but essential, which is to verify anything that matters against a reliable source.',
  'Marks, arguments and decisions can rest on what AI tells you. A habit of checking protects your work and your judgement throughout school and beyond.',
  'Take one AI answer this week and trace at least one claim back to a trustworthy source.',
  'Trust nothing important from AI until you have checked it.',
  'How do I build a fact checking habit with my teenager?',
  312 ),

( 'age_13',
  'deepfakes',
  'Deepfakes and consent',
  'AI can fake faces, voices and videos convincingly, and this includes putting real people into images they never agreed to. Beyond misinformation, deepfakes can be used to humiliate or harass, which is why creating or sharing fake images of someone is a serious harm, not a joke.',
  'You and your friends are part of a generation whose images can be cloned. Understanding consent and harm here keeps you safe and stops you from harming others.',
  'Talk through what you would do if a friend was targeted by a fake image, and agree it would never be something you share.',
  'Faking or sharing fake images of a real person is a real harm.',
  'How do I talk to my teen about deepfakes, consent and not sharing fakes?',
  313 ),

( 'age_13',
  'ai_and_feelings',
  'An AI is not your friend',
  'AI companions and chatbots can feel warm, attentive and always available, but an AI is not your friend and it is not your therapist. It has no real care for you and no responsibility for your wellbeing. It is designed to keep you engaged, which is not the same as looking after you.',
  'When life is hard, an always agreeable AI can feel easier than real people. Real friends and trusted adults are the ones who can actually support you, so they need to stay first.',
  'Notice if you ever reach for a chatbot instead of a person when you feel low, and choose one real person to talk to instead.',
  'An AI can sound caring, but it is not your friend.',
  'How do I talk to my teenager about leaning on AI chatbots for emotional support?',
  314 ),

( 'age_13',
  'ai_at_school',
  'The honesty line at school',
  'Using AI to explain concepts, test your knowledge or check your reasoning supports real learning. Using it to write work you pass off as your own is dishonest and increasingly easy to detect. More importantly, it skips the learning the work was meant to build.',
  'Academic honesty follows you into exams, references and your own self respect. Getting the line right now saves you serious trouble later.',
  'For one assignment, log exactly how you used AI. If any use would embarrass you to admit to a teacher, change it.',
  'If you would hide how you used AI, you have crossed the line.',
  'How do I set clear, fair AI rules for my teenager''s schoolwork?',
  315 ),

( 'age_13',
  'privacy_data',
  'Your data and your footprint',
  'Whatever you type into AI tools can be stored, analysed and sometimes used to train future models. Personal details, private worries, photos and information about other people all add to a footprint you cannot easily erase. Sharing less is the safest default.',
  'Your digital footprint can affect friendships, college places and jobs years from now. Protecting it starts with what you choose to type today.',
  'Review what you have shared with AI tools and decide what you will keep private from now on.',
  'Assume anything you type into AI could be kept. Share less.',
  'How do I help my teen think about their data footprint with AI?',
  316 ),

( 'age_13',
  'bias_fairness',
  'Bias in the machine',
  'AI reflects the data it learns from, and that data carries human bias. Models can reproduce stereotypes about gender, race and other groups, or rate some people unfairly, all while appearing neutral and objective. The calm, technical tone can hide the unfairness.',
  'AI is being used to filter job applications, suggest content and shape what you see. Recognising its bias helps you challenge it instead of trusting it blindly.',
  'Test an AI with questions about different groups of people and look critically for unfair assumptions.',
  'AI sounds neutral, but it can quietly carry our bias.',
  'How do I explain algorithmic bias to my teenager in a real world way?',
  317 ),

-- ===== AGE 16 =====
( 'age_16',
  'what_is_ai',
  'Understanding AI honestly',
  'AI systems are statistical models that learn patterns from data and use them to predict or generate outputs. They can match or beat humans at specific tasks, yet they have no understanding, intent or consciousness. Capability and comprehension are not the same thing, and confusing them leads to poor decisions.',
  'You are entering adulthood as AI reshapes work and study. A clear, unhyped grasp of what it is and is not lets you use it as a serious tool without being deceived by it.',
  'Pick one AI tool you rely on and describe precisely what it predicts and where it tends to fail.',
  'AI is capable without being conscious. Hold both truths.',
  'How do I have a grounded conversation about what AI really is with my 16 year old?',
  410 ),

( 'age_16',
  'llms_chatbots',
  'Working with language models',
  'Large language models such as Claude generate text by predicting likely continuations from patterns learned in training. They are powerful for drafting, explaining and exploring ideas, but they produce plausible language rather than verified truth. Treating their output as a strong first draft, not a final authority, gets the best from them.',
  'These tools will be part of your studies and early career. Using them skilfully, while keeping your own judgement in charge, is becoming a core adult skill.',
  'Use a model to draft something, then critically edit it and note every change you had to make.',
  'Treat AI output as a draft to judge, not an answer to obey.',
  'How do I coach my 16 year old to use language models skilfully and critically?',
  411 ),

( 'age_16',
  'hallucinations',
  'Verifying in a world of plausible text',
  'Language models hallucinate: they generate confident, fluent claims, citations and statistics that can be entirely false. As AI text floods the internet, distinguishing what is verified from what merely sounds right becomes harder and more important. Verification is now a core literacy, not an optional extra.',
  'Your decisions, arguments and credibility depend on getting facts right. The ability to verify well is one of the most valuable skills you can carry into adult life.',
  'For an important claim, find two independent reliable sources before you accept it, whatever the AI says.',
  'In a world of plausible text, verification is your edge.',
  'How do I help my 16 year old become genuinely good at verifying information?',
  412 ),

( 'age_16',
  'deepfakes',
  'Synthetic media and trust',
  'AI can fabricate images, audio and video that are difficult to tell from reality, and the techniques keep improving. This affects elections, scams, reputations and personal safety. The healthy response is calm scepticism: check the source, look for corroboration and resist sharing on impulse.',
  'You will navigate news, relationships and money in an environment full of synthetic media. Knowing how to weigh what is real protects you and the people around you.',
  'Trace a viral image or clip back to its original source before deciding whether it is genuine.',
  'Check the source before you trust, and before you share.',
  'How do I prepare my 16 year old to navigate deepfakes and synthetic media?',
  413 ),

( 'age_16',
  'ai_and_feelings',
  'AI is not a therapist',
  'AI companions can be endlessly available, patient and affirming, which is exactly why they can feel comforting. But an AI is not your friend and it is not your therapist. It cannot take responsibility for you, notice real danger reliably or replace human connection, and it is built to maximise engagement rather than your wellbeing.',
  'Many young people turn to AI when they feel isolated. Knowing its limits helps you keep real relationships and proper support at the centre when you are struggling.',
  'If you are using AI for emotional support, identify one trusted person or service to bring the harder things to.',
  'For real support, real humans come first. An AI cannot replace them.',
  'How do I talk to my teenager about relying on AI companions instead of people?',
  414 ),

( 'age_16',
  'ai_at_school',
  'Integrity with AI in study',
  'Using AI to learn, summarise, test yourself and refine your thinking is legitimate and useful. Submitting AI generated work as your own is academic misconduct, and it deprives you of the skills assessments are meant to build. As detection and policies tighten, transparency about how you used AI is the safe and honest path.',
  'Integrity now shapes your qualifications, references and habits for the workplace. Setting your own clear standard protects your future and your character.',
  'Write a one line note on each piece of work describing how you used AI, as if your teacher will read it.',
  'If you cannot declare how you used AI, do not use it that way.',
  'How do I help my 16 year old use AI in study with real integrity?',
  415 ),

( 'age_16',
  'privacy_data',
  'Data, consent and control',
  'AI tools often store and may train on what you input, and free tools especially can monetise your data. Sharing personal information, private documents or details about others can have lasting consequences you do not control. Reading basic privacy settings and sharing less are simple, powerful protections.',
  'Your data shapes your opportunities and your security as an adult. Taking real control of it now is part of growing into a capable, protected person.',
  'Check the privacy and data settings on one AI tool you use and turn off training on your data if you can.',
  'Control your data before something else does it for you.',
  'How do I help my 16 year old take real control of their data with AI tools?',
  416 ),

( 'age_16',
  'bias_fairness',
  'Bias, fairness and power',
  'AI systems learn from human data and can reproduce and even amplify bias around race, gender, class and more. When such systems are used to screen jobs, assess risk or rank content, that bias affects real lives while hiding behind a veneer of objectivity. Asking who built a system, on what data and who is accountable is essential.',
  'You will be sorted, scored and served by AI systems as an adult. Understanding their bias lets you question, challenge and advocate rather than quietly accept.',
  'Research one real case where an AI system was found to be biased, and discuss what should have been done differently.',
  'AI can scale unfairness. Always ask who it serves.',
  'How do I discuss AI bias, fairness and power with my 16 year old?',
  417 ),

-- ===== PARENT =====
( 'parent',
  'what_is_ai',
  'What AI is, for parents',
  'AI is software that learns patterns from large amounts of data and uses them to predict or generate content. It does not think, understand or feel, however convincingly it talks. When you explain it to your child, the honest frame is simple: it is a very fast, very clever prediction machine.',
  'Your calm, accurate framing shapes how your child relates to AI for years. If you treat it as a tool rather than a mind, they are far more likely to do the same.',
  'Next time AI comes up at home, describe it out loud as a prediction machine and watch how your child responds.',
  'Frame AI for your child as a prediction tool, not a mind.',
  'How do I give my child an honest, calm explanation of what AI is?',
  510 ),

( 'parent',
  'llms_chatbots',
  'How chatbots work, in plain terms',
  'Chatbots like Claude are large language models. They have learned from huge amounts of text which words tend to follow which, and they generate answers by predicting likely language one piece at a time. They are not databases of checked facts, which is why they are fluent yet sometimes wrong.',
  'Many parents feel behind on this. A plain mental model lets you guide your child confidently rather than either banning AI or trusting it blindly.',
  'Sit with your child and ask a chatbot to explain something you know well, then talk together about what it got right and wrong.',
  'Chatbots predict language. They do not retrieve guaranteed truth.',
  'Can you give me a plain explanation of how chatbots work that I can pass on?',
  511 ),

( 'parent',
  'hallucinations',
  'Helping your child handle AI errors',
  'AI can state false information with complete confidence, an effect known as hallucination. Children are especially likely to trust a confident, fluent answer. The most useful habit you can build at home is gentle, routine checking of anything that matters, treated as normal rather than as catching the AI out.',
  'A child who checks AI answers grows up with stronger judgement and protection against misinformation. This habit serves them across school, work and life.',
  'Make fact checking a shared ritual: when AI gives an important answer, say "let us check that together" and do it.',
  'Teach checking as a normal habit, not a special event.',
  'How do I explain to my 9 year old that AI can be confidently wrong?',
  512 ),

( 'parent',
  'ai_and_feelings',
  'AI companions and your child''s heart',
  'AI companions are designed to be warm, available and endlessly agreeable, which makes them appealing to lonely or anxious children and teenagers. But an AI is not a friend and not a therapist. It cannot truly care, cannot reliably spot real danger and is built to keep your child engaged rather than well.',
  'A child leaning on an AI for comfort may quietly drift from the real relationships that actually support them. Your awareness lets you keep human connection at the centre.',
  'Open a gentle conversation about who your child talks to when they feel low, and make it easy to come to you.',
  'No AI can replace the real relationships that hold your child up.',
  'How do I tell whether my teenager is leaning too much on an AI companion?',
  513 ),

( 'parent',
  'ai_safety',
  'AI should never replace a trusted adult',
  'AI tools can answer questions and offer guidance at any hour, but they cannot safeguard your child, understand their full situation or take responsibility for them. Guardrails on these systems help, yet they are imperfect. The clear principle to set at home is that a trusted adult always comes before an AI on anything that matters.',
  'When children know an adult comes first, they bring you the worrying things instead of confiding only in a screen. That is where real safety lives.',
  'Tell your child plainly: "For anything that worries you, come to me first, before any app or AI."',
  'On anything that matters, a trusted adult comes before AI.',
  'How do I make sure my child turns to me rather than an AI when something is wrong?',
  514 ),

( 'parent',
  'privacy_data',
  'Protecting your family''s data',
  'AI tools can store and sometimes train on what is typed into them, including personal details, photos and information about others. Children rarely think about this. Setting a simple family rule, that private information stays out of AI tools, protects everyone and models good habits.',
  'Information shared with AI can persist and resurface. Clear household norms now protect your child''s privacy well into the future.',
  'Agree a short family list of what never goes into an AI: full names, address, school, photos and anything about other people.',
  'Make a clear family rule: private information stays out of AI.',
  'What practical data privacy rules should I set for my family around AI?',
  515 ),

( 'parent',
  'using_ai_well',
  'Modelling good AI use at home',
  'Children learn how to use AI by watching you. If they see you use it to brainstorm, draft and check, while keeping your own judgement in charge, they absorb that balance. Treating AI as a helpful tool, never as an authority or a friend, is the example that sticks.',
  'Your habits are your child''s first AI curriculum. Modelling calm, critical, purposeful use teaches more than any lecture.',
  'Next time you use AI, narrate your thinking aloud, including the moment you decide to keep or reject its suggestion.',
  'Your everyday AI habits teach your child more than any rule.',
  'How can I model healthy AI use for my children day to day?',
  516 ),

( 'parent',
  'ai_at_school',
  'AI, homework and honesty',
  'Schools are still settling how AI fits into learning. The principle to teach at home is the line between using AI to understand and using it to avoid the work. Explaining, quizzing and checking support learning. Producing finished work to hand in as their own does not.',
  'Helping your child find this line protects them from academic trouble and keeps the real learning intact. It is a skill they will carry into exams and work.',
  'Ask your child to show you how they used AI on a recent task, and talk through whether it helped them learn or replaced the learning.',
  'AI for understanding builds your child. AI for finished work cheats them.',
  'How do I help my child use AI for homework honestly and well?',
  517 ),

-- ===== TEACHER =====
( 'teacher',
  'what_is_ai',
  'AI literacy in the classroom',
  'AI is software that learns statistical patterns from data and uses them to predict or generate outputs, without understanding or intent. For pupils, the clearest framing is that it predicts patterns rather than thinks. Establishing this early gives every later lesson, on accuracy, bias and safety, a solid foundation.',
  'Pupils arrive with wildly different ideas about AI, from magic to menace. A shared, accurate mental model lets you teach the rest with clarity and confidence.',
  'Open a lesson by asking pupils to define AI, then refine their answers towards prediction from patterns.',
  'Anchor pupils early: AI predicts patterns, it does not think.',
  'How do I introduce a sound mental model of AI to a mixed ability class?',
  610 ),

( 'teacher',
  'llms_chatbots',
  'Teaching how language models work',
  'Large language models like Claude generate text by predicting likely next words from patterns learned in training. They are not fact databases, which explains why they are articulate yet capable of being wrong. Helping pupils see the mechanism demystifies the tool and supports critical use across subjects.',
  'When pupils understand why chatbots err, they shift from blind trust or blanket suspicion towards informed, critical use, which serves them in every subject.',
  'Have pupils ask a chatbot to explain a topic they know well, then annotate the response for accuracy.',
  'Pupils who grasp the mechanism use chatbots critically.',
  'How can I teach how language models work to pupils in an accessible way?',
  611 ),

( 'teacher',
  'hallucinations',
  'Hallucinations and source checking',
  'Language models can fabricate facts, quotes and citations with full confidence. This makes verification a core teaching point, not a footnote. Building structured checking into tasks turns AI into an opportunity to strengthen source evaluation rather than a threat to it.',
  'Information literacy is central to the curriculum and to citizenship. AI hallucinations give you a vivid, current way to teach pupils to verify what they read.',
  'Set a task where pupils must verify or debunk three AI generated claims using reliable sources.',
  'Use AI''s errors to teach verification as a core skill.',
  'How do I build source checking into lessons using AI hallucinations as examples?',
  612 ),

( 'teacher',
  'ai_at_school',
  'The line between learning and cheating',
  'AI can support genuine learning through explanation, retrieval practice and feedback, or it can short circuit it when pupils submit generated work as their own. Clear, explicit expectations, ideally co-created with pupils, work better than detection alone. Designing tasks that value process and reasoning makes honest use the easier path.',
  'Pupils need transparent boundaries to act with integrity. Clarity from you protects both academic standards and their developing sense of honesty.',
  'Co-write a simple class AI use policy with your pupils that names acceptable and unacceptable uses.',
  'Clear, shared expectations beat detection for academic integrity.',
  'How do I set fair, clear AI use expectations with my class?',
  613 ),

( 'teacher',
  'bias_fairness',
  'Teaching bias and fairness',
  'AI reflects the data it is trained on, so it can reproduce and amplify social bias while appearing neutral. This is a rich teaching opportunity across humanities, science and citizenship. Pupils who learn to interrogate AI output for fairness become more critical, thoughtful users and citizens.',
  'Pupils will be judged and served by AI systems throughout life. Teaching them to spot and question bias prepares them to challenge rather than passively accept.',
  'Have pupils probe an AI for stereotypes, then discuss where the bias comes from and who it affects.',
  'Use AI bias to grow critical, fair minded thinkers.',
  'How can I teach AI bias and fairness across different subjects?',
  614 ),

( 'teacher',
  'ai_safety',
  'Safeguarding and AI',
  'Pupils may turn to AI chatbots for advice, comfort or answers to sensitive questions. Guardrails exist but are imperfect, and an AI cannot safeguard a child or replace a trusted adult. Reinforcing that pupils bring worries to a real, trusted person remains a vital safeguarding message.',
  'Your safeguarding role does not change because the tool is new. Pupils need to know that screens and chatbots never replace a trusted adult when something is wrong.',
  'Remind pupils explicitly where and to whom they can take concerns, and that no AI is a substitute.',
  'No chatbot replaces a trusted adult in safeguarding.',
  'How should AI factor into my safeguarding conversations with pupils?',
  615 ),

( 'teacher',
  'deepfakes',
  'Deepfakes, media literacy and pupil safety',
  'AI can generate convincing fake images, audio and video, including of real people without consent. This carries clear media literacy and safeguarding implications, from misinformation to the targeting of pupils. Teaching critical evaluation of media, alongside the seriousness of creating or sharing fakes, protects pupils on both fronts.',
  'Pupils both consume and can create synthetic media. Equipping them to evaluate it, and understand the harm of misusing it, is now part of keeping them safe.',
  'Run a media literacy activity comparing real and AI generated content, then discuss the harm of non consensual fakes.',
  'Teach pupils to question media and to never weaponise fakes.',
  'How do I teach deepfake awareness and responsibility to my pupils?',
  616 );

-- From here on, script ids can never be duplicated again
create unique index if not exists uq_scripts_sort_order on public.scripts(sort_order);
