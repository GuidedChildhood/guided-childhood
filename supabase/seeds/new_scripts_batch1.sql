-- Guided Childhood — New Scripts (74 scripts across 8 categories)
-- Run AFTER 001_initial.sql and 002_add_category.sql
-- Categories: cyberbullying, mental-health, body-image, identity, ai-technology, family-rules, school, relationships

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values

(
  'explorer',
  'cyberbullying',
  'They are being bullied online',
  'Your child tells you someone is being cruel to them online, either in messages, comments, or posts.',
  'I am really glad you told me. That sounds genuinely awful, and it makes complete sense that you are upset. Can you show me what has been happening so I understand the full picture?',
  'Just ignore it and they will stop.',
  'Starting with validation before solutions tells your child their feelings are the priority, not the fix. Asking to see it together signals you are a safe person to come to, which matters far more than any single conversation. Children who feel heard are far more likely to keep talking.',
  'Sit beside them and look at the messages together without reacting with shock, then screenshot and save everything before you decide on next steps.',
  'none',
  false,
  501
),

(
  'explorer',
  'cyberbullying',
  'Screenshots of group chat exclusion',
  'Your child sees screenshots showing they were deliberately left out of a group chat or plan.',
  'Seeing that must have stung badly, and it makes sense you feel hurt. Being left out on purpose is a real thing, and you are not imagining it. Let us talk about what you want to do next.',
  'It is probably not personal, I am sure they just forgot to add you.',
  'Dismissing the exclusion as accidental when the evidence says otherwise teaches children to distrust their own perception. Naming the experience honestly and then moving toward agency gives your child both validation and a forward step. That combination builds resilience.',
  'Ask your child to tell you about one person in their life who does make them feel included, and spend ten minutes talking about that friendship.',
  'none',
  false,
  502
),

(
  'shaper',
  'cyberbullying',
  'Someone is spreading rumours',
  'Your child has found out someone is spreading false or embarrassing stories about them online or in group chats.',
  'That is a horrible thing to go through, and the fact that it is not true makes it even more frustrating. The people who matter will figure out what is real. For now, let us think together about who you trust and what, if anything, you want to do about it.',
  'You need to publicly clear your name right away.',
  'Urging a public response often escalates the situation and gives the rumour more oxygen. Helping your child identify their trusted circle first grounds them in what is real before making any decisions. Giving them agency in choosing next steps restores a sense of control at a time when they feel powerless.',
  'Help your child write down exactly what happened, who said what, and where, so you both have a clear record if the school or parents need to be involved later.',
  'none',
  false,
  503
),

(
  'explorer',
  'cyberbullying',
  'They are the one doing the bullying',
  'You discover your child has been sending cruel messages or taking part in targeting another child online.',
  'I need us to talk about something serious. I have seen these messages and I want to understand what was going on for you when you sent them, because this is not who I know you to be.',
  'I cannot believe you would do this, you are in serious trouble.',
  'Leading with punishment before understanding closes the conversation down instantly. Expressing belief in your child''s character while still being clear this was wrong creates the conditions for genuine accountability rather than just shame. Children who feel seen even in their worst moments are more likely to make it right.',
  'Have your child sit with you and put themselves in the other child''s position, describing out loud how each message might have felt to receive, then talk about what making it right could look like.',
  'none',
  false,
  504
),

(
  'shaper',
  'cyberbullying',
  'Pile-on in a group chat',
  'Your child was targeted by multiple people at once in a group chat, making them feel ganged up on.',
  'When a group all turns on one person it feels completely overwhelming, and it is supposed to feel that way because it is genuinely unfair. None of that reflects your worth. Let us look at what happened and who was involved.',
  'Just leave the group, that will sort it.',
  'Leaving a group can feel like defeat or social exile to a teenager, and the behaviour often follows them elsewhere. Helping your child understand the group dynamic as a system rather than a personal verdict is what builds lasting confidence. Knowing you will look at it together, rather than dismiss it, keeps communication open.',
  'Screenshot the relevant messages, mute the group so no new notifications land tonight, and agree on whether to sleep on the decision before any action is taken.',
  'none',
  false,
  505
),

(
  'shaper',
  'cyberbullying',
  'Revenge posting and screenshot sharing',
  'Your child is thinking about or has already shared screenshots or posts to get back at someone who hurt them.',
  'I understand why it feels satisfying to fight back that way. And I need to talk with you honestly about what usually happens next, because I want to protect you as much as the other person.',
  'Delete it right now, that is so immature.',
  'Shaming the impulse without addressing the hurt behind it misses the whole point. Framing the conversation around your child''s protection, not just the other person''s rights, keeps them in the centre of the story. That shift opens the door to an honest conversation about how retaliation tends to escalate.',
  'Look up your local school policy on sharing private messages together so your child understands the concrete consequences, and talk through what they actually want the outcome to be.',
  'none',
  false,
  506
),

(
  'explorer',
  'cyberbullying',
  'The bully is a friend in real life',
  'The child being cruel to your child online is someone they consider a friend at school.',
  'That is one of the most confusing kinds of hurt there is, when someone who is your friend in person treats you badly online. It does not mean you were wrong about the friendship, and it does not mean you have to accept this either.',
  'That person is clearly not your real friend, just cut them off.',
  'Relationships at this age are genuinely complex and cutting someone off may not be realistic or even what your child wants. Holding space for the contradiction, that someone can be a real friend and still behave badly, is more honest and more helpful. It models nuanced thinking about relationships your child will need for life.',
  'Ask your child to tell you two things they value about this friendship and one thing they need to change, so they can approach the friend from a clear place.',
  'none',
  false,
  507
),

(
  'explorer',
  'cyberbullying',
  'They do not want to report it',
  'Your child has been bullied online but is refusing to report it to the school or to the platform.',
  'I hear you, and I am not going to force you to do anything. Can you help me understand what worries you most about reporting it? I want to make sure we are thinking this through together.',
  'You have to report it, that is the only way it stops.',
  'Forcing a report without understanding the fear behind the refusal often makes the child feel more powerless, not less. The worry is usually about retaliation or social fallout, both of which deserve a real conversation. Understanding their concern first means any plan you make together will actually account for what your child needs.',
  'Write down the key details of what happened together and save them somewhere private, so the option to report remains open even if you do not act tonight.',
  'none',
  false,
  508
),

(
  'shaper',
  'cyberbullying',
  'The school is involved',
  'The bullying has been reported and the school is now investigating or managing the situation.',
  'I know it might not feel like it right now, but the school being involved is a good step. Your job is not to manage this process, that is ours to do together. What would help you most to feel supported at school this week?',
  'I am going to call the principal and make sure they deal with this properly.',
  'Taking over completely can undermine your child''s sense of agency at the exact moment they need to feel capable. Expressing confidence in the process while asking what support looks like to them centres your child rather than the institution. It also gives you practical information about what they actually need from you.',
  'Talk through what your child wants to happen as an outcome, not just what they want to stop, so you can communicate that clearly to the school.',
  'none',
  false,
  509
),

(
  'shaper',
  'cyberbullying',
  'It has escalated to threats',
  'The bullying now involves threats of physical harm or serious content that has moved beyond unkindness into something that feels dangerous.',
  'Thank you for telling me. I want you to know I am taking this seriously and we are going to handle it together. You do not have to carry this alone for another minute.',
  'Kids say things online they do not mean, I would not worry too much.',
  'Minimising a threat, even with good intentions, tells your child their judgment cannot be trusted and can stop them from coming to you in the future. Taking it seriously and expressing shared ownership of the response is both the safest and the most relationship-preserving move. Threats that are dismissed have a way of escalating further.',
  'Screenshot everything, do not delete any messages, and contact the school and if necessary local police or the platform''s safety team before bed so there is a formal record.',
  'none',
  false,
  510
),

(
  'explorer',
  'mental-health',
  'Mood drops after phone use',
  'You notice your child consistently comes away from their phone in a worse mood than when they picked it up.',
  'I have noticed you sometimes seem a bit down after you have been on your phone for a while. I am curious about that, not to take your phone away, but because I think you might have noticed it too.',
  'That phone is making you miserable, it needs to go.',
  'Naming an observation without an accusation invites your child into reflection rather than defence. The reassurance that your motive is curiosity not punishment significantly increases the chance they will engage honestly. When children feel observed rather than surveilled, they are much more willing to explore the question themselves.',
  'Try a simple experiment together: notice what your child is doing before, during, and after phone use for one evening, and just share what you each notice without judgment.',
  'none',
  false,
  601
),

(
  'shaper',
  'mental-health',
  'Anxiety triggered by online news',
  'Your child is visibly anxious or distressed after seeing upsetting news, world events, or scary content online.',
  'It makes complete sense that what you saw is sitting heavily with you. Caring about what happens in the world is actually a strength, and part of growing up is learning how to hold that without it swallowing you whole. Let us talk about what you saw.',
  'Just stop reading the news, it is all negative anyway.',
  'Telling a young person to disengage from the world can read as telling them their concern does not matter. Framing their anxiety as the result of real empathy gives them something to be proud of even while feeling overwhelmed. The follow-up conversation then becomes about building a sustainable relationship with difficult information rather than avoiding it.',
  'Help your child identify one thing they can actually do, however small, in response to something that distressed them, because agency is the single most effective antidote to anxiety.',
  'none',
  false,
  602
),

(
  'explorer',
  'mental-health',
  'They cannot sleep because of their phone',
  'Your child is staying up late on their phone and struggling to sleep, affecting their mood and concentration the next day.',
  'I know it probably does not feel like the phone is the problem, it feels more like you just cannot wind down. That is actually true, your brain really does stay activated after screens. Can we figure out something that works for both of us?',
  'Hand over the phone at nine every night, end of conversation.',
  'Dictating a rule without any shared reasoning creates something to fight against rather than something to follow. Explaining the actual neuroscience in plain terms, that screens genuinely delay the onset of sleep, gives your child a real reason rather than an arbitrary one. Inviting them to co-create the solution dramatically increases compliance.',
  'Agree on a specific phone-away time just for this week and frame it as an experiment rather than a permanent rule, then check in together in seven days.',
  'none',
  false,
  603
),

(
  'shaper',
  'mental-health',
  'Comparing their life to influencers',
  'Your child is feeling like their life is boring or inadequate after spending time watching influencer content.',
  'What you are feeling is one of the most normal things about being online right now, and it is designed to feel that way. Influencers are showing you maybe three minutes of their best week, and they have a lighting rig and a ring light and four takes to get it right.',
  'Those people are fake, their lives are nothing like that really.',
  'Simply saying someone is fake does not change the emotional impact of consuming their content, and it can come across as dismissive. Walking your child through the actual production reality of influencer content is more concrete and more believable. It reframes the comparison not as a moral failing but as a designed experience your child can start to see through.',
  'Watch a minute of one of their favourite influencers together and play a game of spotting every deliberate choice in the video: lighting, angle, caption, music and what mood it is trying to create.',
  'none',
  false,
  604
),

(
  'shaper',
  'mental-health',
  'Social media is making them feel lonely',
  'Your child is spending more time on social media but reporting feeling more isolated and like everyone else has a fuller social life.',
  'That feeling of everyone else being at a party you were not invited to is one of the strangest things about social media, because you can be connected to hundreds of people and still feel completely alone. A lot of adults feel it too. You are not missing something other people have figured out.',
  'If you are lonely, just put the phone down and go see someone in real life.',
  'The instruction to simply go offline ignores the social reality of being a teenager, where social life increasingly flows through these platforms. Normalising the paradox of connected loneliness removes shame and opens a real conversation about what connection actually feels like versus what it looks like online. That distinction is the whole work.',
  'Ask your child to name one person they actually felt good after spending time with recently, online or offline, and think about how to have more of that kind of contact this week.',
  'none',
  false,
  605
),

(
  'shaper',
  'mental-health',
  'They want a digital detox but cannot stick to it',
  'Your child has said they want to use their phone less but keeps picking it back up within minutes.',
  'The fact that you keep going back is not a weakness, it is what these apps are literally built to do to your brain. You are not failing at having willpower, you are up against an algorithm with a billion-dollar budget for keeping you on the screen.',
  'You clearly just do not want it badly enough.',
  'Framing repeated failure as a character flaw makes the next attempt feel impossible before it starts. Explaining the design mechanics of engagement loops gives your child a genuine external frame for what is happening, which paradoxically makes change more achievable. They stop fighting themselves and start thinking strategically.',
  'Help your child pick one specific friction strategy, like putting the phone in a different room, turning off notifications, or using grayscale mode, and try it for just one evening as an experiment.',
  'none',
  false,
  606
),

(
  'shaper',
  'mental-health',
  'They seem addicted to notifications',
  'Your child checks their phone compulsively every few minutes and gets visibly anxious when they cannot.',
  'The way notifications work is genuinely designed to feel urgent and to feel like something bad might happen if you miss them. That is not in your head. The question is whether you are choosing when to look, or whether the phone is choosing for you.',
  'You are addicted to that thing, it is not normal.',
  'The word addicted can feel dramatic and shameful, and it shuts down reflection rather than opening it. The question of who is in control reframes compulsive checking as a solvable relationship problem rather than a character flaw. That framing gives your child somewhere useful to go with it.',
  'Together, go through their notification settings and turn off every non-essential alert, then observe whether the pull to check the phone changes at all by the end of the evening.',
  'none',
  false,
  607
),

(
  'shaper',
  'mental-health',
  'Online rejection affecting real-world mood',
  'Your child received no likes, was ignored in a group chat, or had a post land badly, and their whole day has been affected.',
  'Being ignored online actually activates the same part of the brain as physical pain, so what you are feeling is not an overreaction. It genuinely hurts. And I want to talk about what happened because you matter a lot more than the numbers do.',
  'It is just a like, it does not mean anything in real life.',
  'Telling a child their online pain does not count in real life is factually inaccurate and emotionally dismissive. Validating the neuroscience behind social rejection gives them a real explanation and removes the shame of caring so much. Moving from validation into a direct expression of their value then gives them something solid to hold onto.',
  'Find one way tonight to express specific appreciation for who your child is, not what they did, just who they are.',
  'none',
  false,
  608
),

(
  'independent',
  'mental-health',
  'Doomscrolling conversation',
  'Your older child or teenager has fallen into a pattern of scrolling through upsetting content late at night and cannot seem to stop.',
  'There is a name for what you are describing and it is doomscrolling, and it happens to almost everyone. Your brain is wired to scan for threats, and the algorithm knows that, so it feeds you more of what got your attention. The loop is not your fault and you can interrupt it.',
  'Just put it down, it is not that hard.',
  'Naming doomscrolling as a recognised pattern removes the sense of being uniquely weak or broken. Explaining the threat-detection loop connects it to real biology rather than personal failure. Ending with the idea that it can be interrupted, rather than just stopped, gives your child an action they can take from exactly where they are.',
  'Agree on a concrete exit ramp together: a specific thing to do for five minutes when they notice the loop starting, whether that is texting you, putting on a specific playlist, or doing something physical.',
  'none',
  false,
  609
),

(
  'foundation',
  'mental-health',
  'When to seek professional help',
  'You are noticing signs in your child that feel beyond what a conversation at home can address, and you are wondering whether to seek professional support.',
  'You are not overreacting by considering this. Getting professional support does not mean something is terribly wrong, it means you are taking your child seriously. The threshold is simpler than most parents think: if it is affecting sleep, school, friendships, or eating for more than two weeks, it is worth a conversation with your GP or a child therapist.',
  'Let us give it a bit more time and see if they come out of it on their own.',
  'Most parents wait too long, not because they do not care but because they do not have a clear threshold to act on. Giving a concrete and time-based criterion removes the guesswork and makes the decision feel manageable rather than dramatic. Framing professional help as a sign of being taken seriously shifts it from stigma to strength.',
  'Write down three things you have noticed in your child over the past month that concern you, then read them back as if a friend had described them to you about their own child.',
  'none',
  false,
  610
),

(
  'explorer',
  'body-image',
  'Filters and edited photos',
  'Your child is spending time on platforms where heavily filtered and edited images are the norm and is starting to compare themselves to these images.',
  'Almost every single photo you see on these apps has been through at least one filter, and a lot of them have been altered in ways that are actually physically impossible in real life. Your face is not the problem, the images are just not real.',
  'You look beautiful, stop being so silly about it.',
  'Dismissing the comparison without addressing why it feels real misses the mark entirely. Walking your child through the specific technical reality of image editing makes the problem concrete and external rather than something they need to feel better about. It builds genuine media literacy rather than just patching their self-esteem for the evening.',
  'Look up a before and after image editing comparison together, there are plenty available, and spend a few minutes just talking about what was changed and why.',
  'none',
  false,
  701
),

(
  'shaper',
  'body-image',
  'Comparing bodies to influencers',
  'Your child is making comments about their own body that are clearly influenced by the body types they are seeing in social media content.',
  'What you are seeing online is genuinely not a normal sample of human bodies. The bodies that get amplified by the algorithm are a very specific and very narrow type, and they take a level of time, money, and often medical intervention that nobody talks about openly. You are comparing yourself to an edited highlight of a tiny percentage.',
  'Every body is beautiful, do not compare yourself to anyone.',
  'The well-meaning positive message lands hollow when your child does not actually believe it. Addressing the systemic distortion of body representation on social media gives them an analytical frame they can actually use. Understanding that the comparison is structurally rigged, not just emotionally difficult, is genuinely empowering.',
  'Ask your child to name one thing their body can do that they are glad it can do, however simple, and let that be the end of the conversation without pushing for more.',
  'none',
  false,
  702
),

(
  'shaper',
  'body-image',
  'Boys and gaming physique content',
  'Your son is watching gaming or fitness content featuring extremely muscular or idealised male physiques and making comments about his own body in comparison.',
  'A lot of the body types you see in gaming and fitness content are the result of years of extreme training, very specific diets, and often things like steroids that nobody mentions. The gap between what those guys look like and what a healthy body looks like is much bigger than it appears.',
  'Do not be ridiculous, you look fine.',
  'Body image pressure on boys is chronically under-discussed, which means boys often carry it silently. Normalising the conversation by taking it seriously is itself the most important move. Being specific about what produces those physiques, rather than just saying they are unrealistic, gives your son information he can actually think with.',
  'Ask your son who he admires most, not for how they look but for what they do, and let the conversation go wherever it goes from there.',
  'none',
  false,
  703
),

(
  'shaper',
  'body-image',
  'Eating less after what I eat in a day content',
  'Your child has started eating noticeably less or commenting on their food intake after watching what I eat in a day or similar content.',
  'I have noticed you seem to be eating less lately and I want to talk about it gently, not to make it a big deal, but because I love you and I want to understand what is going on. Have you been watching a lot of food content online?',
  'You need to eat more, those videos are dangerous.',
  'Immediately labelling the content as dangerous can feel like an attack and close the conversation down. Opening with a simple observation and a direct expression of care keeps the door open. Making the connection to content a genuine question rather than an accusation invites your child to reflect rather than defend.',
  'Sit and eat something together, not as a strategy but just as a connection, and let the conversation happen naturally if it does.',
  'none',
  false,
  704
),

(
  'shaper',
  'body-image',
  'They are editing their own photos before posting',
  'You discover your child is routinely using editing apps to change their appearance in photos before sharing them online.',
  'I get why you do it, everyone wants to look their best and those apps are right there. I am more curious about how it feels after you post an edited version versus a real one. Because I wonder if the edited one actually feels better, or just safer.',
  'You are beautiful as you are, you do not need to change anything.',
  'The positive affirmation, while well-meant, does not address the actual dynamic of why editing feels necessary. Asking how it feels rather than whether it is wrong or right invites genuine reflection without triggering defensiveness. The distinction between feeling better and feeling safer is a genuinely useful one that many adults have not thought through either.',
  'Without making it an event, try posting one unedited photo yourself this week and share that choice with your child.',
  'none',
  false,
  705
),

(
  'shaper',
  'body-image',
  'Diet culture content on their feed',
  'Your child''s social media feed is full of diet tips, detox content, and before and after transformation posts.',
  'A lot of what gets pushed into feeds about food and bodies is diet culture, and it is designed to make you feel like you need fixing. The people selling it need you to feel that way. Your body is not a project to be optimised.',
  'That is all rubbish, just ignore it.',
  'Saying to ignore something your child is already engaging with emotionally is not a realistic instruction. Naming the commercial incentive behind diet culture content gives your child a critical lens rather than just a dismissal. The phrase your body is not a project to be optimised is one worth leaving with them because it reframes the entire premise of the content.',
  'Help your child unfollow or mute three accounts that regularly post diet or transformation content, and look for one account together that talks about food in a genuinely joyful or neutral way.',
  'none',
  false,
  706
),

(
  'shaper',
  'body-image',
  'Body image and the camera on calls',
  'Your child is becoming self-conscious about how they look on video calls and is either refusing to turn their camera on or is obsessively checking their own image.',
  'Camera distortion is a real thing. The front camera of a phone and the webcam on a laptop are both wide angle lenses at close range, which is one of the most unflattering ways a human face can be captured. What you see on a call is not what people see when they look at you in real life.',
  'Just turn the camera on, nobody is looking at you.',
  'Brushing off the concern without addressing it leaves your child feeling dismissed and still anxious about the camera. Explaining the actual optics of camera distortion is both true and genuinely reassuring in a way that empty reassurance is not. It gives your child something factual to hold onto rather than having to just trust that they look fine.',
  'Show your child how different they look on a front camera close-up versus a photo taken from arm''s length, so they can see the distortion directly.',
  'none',
  false,
  707
),

(
  'independent',
  'body-image',
  'Helping them curate a healthier feed',
  'Your older child is open to doing something about the content they are consuming and wants help making their feed feel better.',
  'The good news is that the algorithm learns fast. You do not have to overhaul everything at once. Start by following a few accounts that make you feel curious or capable rather than inadequate, and over a couple of weeks the whole feel of the feed shifts.',
  'Just follow body positivity accounts instead.',
  'Swapping one type of body-focused content for another keeps the focus on bodies, which is often not what a young person needs. Broadening the frame toward content that makes them feel curious or capable shifts the whole premise of what a feed is for. Giving a concrete timeline of a couple of weeks sets a realistic expectation and makes the experiment feel achievable.',
  'Sit with your child for ten minutes and follow five accounts together in areas they are genuinely interested in that have nothing to do with appearance, and note how the feed looks after three days.',
  'none',
  false,
  708
),

(
  'explorer',
  'identity',
  'Starting a YouTube channel',
  'Your child announces they want to start their own YouTube channel.',
  'I love that you want to make something. Let us figure out together what you would film and how we keep your name and our home private while you do it.',
  'Absolutely not, the internet is full of creeps and you are far too young.',
  'Meeting their excitement with a yes keeps you on the same team instead of on opposite sides. By making privacy the shared project rather than the reason to refuse, you teach the real skill without crushing the spark.',
  'Sit beside them and watch one creator they admire, then talk about what that person chooses to show and what they keep back.',
  'none',
  false,
  801
),

(
  'shaper',
  'identity',
  'Posting opinions publicly',
  'Your child wants to post their personal opinions where anyone can read them.',
  'Having a view and sharing it is a real strength. Before you post, picture the person who disagrees most reading it back to you, and ask if you would still stand behind it.',
  'Keep your opinions to yourself, you will only start arguments and embarrass us.',
  'Teenagers are testing who they are out loud, and silencing that pushes it somewhere you cannot see. Asking them to imagine a real reader builds the pause that protects them far better than a ban ever could.',
  'Ask them to tell you one opinion they feel strongly about and talk through how they would word it for a stranger.',
  'none',
  false,
  802
),

(
  'shaper',
  'identity',
  'Your digital footprint',
  'Your child does not yet understand that what they post online tends to stay there.',
  'Think of everything you post as a trail of footprints. Most lead somewhere good, but they all stay in the ground, so it is worth choosing where you step.',
  'One stupid post and your whole future is ruined, so think before you do anything online.',
  'Fear makes the topic too big to act on, so they tune it out. A simple picture they can hold gives them a way to make small good choices every day without feeling doomed.',
  'Search your own name together and talk about what shows up and how it got there.',
  'none',
  false,
  803
),

(
  'shaper',
  'identity',
  'Online self and real self',
  'Your child seems to be becoming a different person in how they act online.',
  'The version of you online and the version sitting here are both you. I just want them to feel like the same person, because the real one is pretty great.',
  'You are so fake online, that is not who you actually are at all.',
  'Calling them fake makes them defensive and hides the gap you want to talk about. Naming both versions as them, with warmth, invites honesty about the parts that feel like performance.',
  'Ask what feels different about being online versus being at home, and just listen.',
  'none',
  false,
  804
),

(
  'shaper',
  'identity',
  'Building a following',
  'Your child is gaining followers and clearly loves the attention.',
  'It feels amazing when numbers go up, and that is real. Let us also make sure your worth is not riding on it, because you mattered just as much before any of this.',
  'Those followers are not real friends and none of this means anything.',
  'Dismissing the attention they crave makes you someone they cannot talk to about it. Validating the rush while gently separating it from their value keeps you in the conversation as the numbers swing.',
  'Name three things you love about them that have nothing to do with any screen.',
  'none',
  false,
  805
),

(
  'shaper',
  'identity',
  'A post got nasty comments',
  'Something your child posted attracted a wave of negative comments.',
  'That stings and I am sorry it happened. You do not have to read every comment, and a stranger having a bad day does not get to decide how you feel about yourself.',
  'Well, that is what you get for putting yourself out there in the first place.',
  'Blame in a raw moment teaches them to hide the next hit instead of bringing it to you. Comfort first, then a gentle reframe, helps them keep a sense of proportion about anonymous noise.',
  'Sit with them while they mute or turn off comments on that post if they want to.',
  'none',
  false,
  806
),

(
  'shaper',
  'identity',
  'They deleted their account',
  'After a bad experience your child has deleted their account entirely.',
  'Stepping away when something hurts is actually a strong, healthy thing to do. There is no rush to go back, and whenever you do, we will do it on your terms.',
  'See, I told you that whole thing was a mistake from the start.',
  'I told you so turns their pain into your point and shuts down trust. Praising the boundary they set teaches them that walking away is a skill, not a failure.',
  'Ask what felt like the final straw, so you understand it from their side.',
  'none',
  false,
  807
),

(
  'shaper',
  'identity',
  'Using an anonymous account',
  'You discover your child is using a fake name or anonymous account.',
  'I get wanting a space where nobody knows you, that makes sense. Help me understand what this account lets you do, because I want to know it is safe rather than secret.',
  'Why are you hiding, only people up to no good use fake names.',
  'Treating anonymity as automatic guilt guarantees they stop telling you anything. Curiosity uncovers the real need, which is often privacy or freedom, and lets you guide it safely.',
  'Ask what they can do on the anonymous account that they cannot do as themselves.',
  'none',
  false,
  808
),

(
  'shaper',
  'identity',
  'Their content got stolen',
  'Someone has copied or reposted your child''s content as their own.',
  'That is genuinely frustrating, and the fact someone copied it tells you it was good. Let us look at what we can do, and also at how you can mark your work as yours next time.',
  'That is just how the internet works, so there is nothing you can do, get over it.',
  'Brushing it off ignores a real sense of unfairness and a chance to learn. Naming the feeling and turning to practical steps shows them problems have responses, not just shrugs.',
  'Help them report the stolen post and add a simple watermark or signature to future work.',
  'none',
  false,
  809
),

(
  'independent',
  'identity',
  'Your reputation over time',
  'Your nearly grown child is starting to think about how the world sees them long term.',
  'Your reputation is just the sum of lots of small choices, made over years. You cannot control everything people think, but you can keep being someone you would be proud to read about.',
  'You need to delete everything embarrassing now before a university or employer finds it.',
  'Panic cleaning frames their past as a threat rather than a story they are still writing. Focusing on consistent character gives them something steady to steer by as they step into adult life.',
  'Ask how they would want a stranger to describe them after a week of watching their posts.',
  'none',
  false,
  810
),

(
  'shaper',
  'ai-technology',
  'AI wrote their homework',
  'You find out your child used AI to write a piece of homework.',
  'I am not angry, I am curious. Tell me what you handed in and what you actually understand, because the grade matters less to me than whether the learning happened.',
  'That is cheating, plain and simple, and you are grounded for it.',
  'Leading with punishment makes them hide the next shortcut and learn nothing. Separating the tool from the learning lets you teach where AI helps and where it quietly robs them.',
  'Ask them to explain the topic to you in their own words, with the screen closed.',
  'none',
  false,
  901
),

(
  'explorer',
  'ai-technology',
  'What AI actually is',
  'Your child asks you what AI is and how it works.',
  'Think of it as a very clever guesser. It has read a huge amount of writing and learned to predict what words usually come next, so it sounds sure even when it is wrong.',
  'It is basically a robot brain that knows everything, do not worry about the details.',
  'A plain, honest picture beats either magic or fear and gives them a way to think critically. Knowing it guesses helps them treat its answers as a starting point, not the final word.',
  'Ask an AI tool one question together that you already know the answer to and see what it gets right and wrong.',
  'none',
  false,
  902
),

(
  'shaper',
  'ai-technology',
  'An AI chatbot as a friend',
  'Your child is talking to an AI chatbot as though it is a close friend.',
  'It makes sense that it feels good to talk to, it never gets tired or judges you. I just want you to remember it cannot actually care back, even when it sounds like it does.',
  'That thing is not your friend, it is a computer, stop being so weird about it.',
  'Mocking the comfort they have found makes them defensive and lonelier. Honouring why it appeals, while naming the limit, keeps real human connection as the goal without shaming them.',
  'Plan one face to face thing they enjoy with a real person this week.',
  'none',
  false,
  903
),

(
  'shaper',
  'ai-technology',
  'Deepfakes of classmates',
  'Fake AI images of classmates are being made or shared in your child''s world.',
  'Making or sharing a fake image of a real person can cause serious harm and serious trouble, even as a joke. If you see one, do not pass it on, come and tell me.',
  'You had better not be involved in any of that, end of discussion.',
  'A flat threat ends the talk before they can tell you what they have already seen. Being clear about harm while staying open keeps you as the person they turn to when it lands in their feed.',
  'Agree a simple plan together for what they do the moment they see a fake image of someone.',
  'partial_ban',
  false,
  904
),

(
  'shaper',
  'ai-technology',
  'Knowing what is real',
  'Your child cannot always tell which images online are AI generated.',
  'Lots of what you scroll past now was never photographed at all. A good habit is to pause and ask who made this and why, before you believe it or share it.',
  'You cannot trust anything online anymore, it is all fake now.',
  'Saying everything is fake leaves them cynical and unsure what to do with it. A repeatable question gives them an active skill, so they stay curious rather than just suspicious.',
  'Look at a few striking images together and guess which are real, then check.',
  'none',
  false,
  905
),

(
  'explorer',
  'ai-technology',
  'Spotting misinformation',
  'Your child shares something online that turns out to be untrue.',
  'Easy mistake, it looked convincing. Before we share next time, let us see if we can find the same thing in two places we trust, because true things usually show up more than once.',
  'How could you believe that, it is obviously rubbish.',
  'Making them feel stupid teaches them to share quietly and never check with you. A simple two source habit gives them a calm, doable test they can use on their own.',
  'Take one surprising claim and try to find it from two reliable sources together.',
  'none',
  false,
  906
),

(
  'shaper',
  'ai-technology',
  'AI and creative work',
  'Your child is unsure whether using AI in their art or writing counts as cheating.',
  'Good question, and there is no shame in asking it. A fair rule of thumb is whether the idea and the choices are still yours, or whether you have handed those over too.',
  'If a machine did it, then it is not really your work, simple as that.',
  'A blanket rule misses the genuine grey area they are wrestling with. Giving them a principle about ownership of ideas helps them judge each case rather than memorise a verdict.',
  'Look at one piece they made and talk about which parts were truly theirs.',
  'none',
  false,
  907
),

(
  'shaper',
  'ai-technology',
  'Voice cloning and scams',
  'You want your child to understand that voices can now be faked to trick people.',
  'Scammers can now copy a voice well enough to sound like family in trouble. So if anyone ever calls asking for money or secrets in a panic, we will use a family password to check it is really us.',
  'Just never answer the phone to anyone you do not know and you will be fine.',
  'Avoiding all calls is neither realistic nor the actual risk, which is trusted voices. A shared password gives them a concrete defence and a calm response when a call feels urgent and frightening.',
  'Choose a family password together that only you would know and agree when to use it.',
  'partial_ban',
  false,
  908
),

(
  'shaper',
  'ai-technology',
  'AI and your private data',
  'Your child is feeding personal information into AI tools without thinking.',
  'Anything you type into these tools can be stored and used to train them. A good habit is to never tell an AI something you would not want printed on a poster.',
  'Never use those apps, they are stealing all your information.',
  'A ban they will ignore protects nothing, because these tools are everywhere now. A clear personal line, the poster test, lets them use AI while keeping the truly private things to themselves.',
  'Go through one app''s privacy settings together and turn off what you can.',
  'none',
  false,
  909
),

(
  'independent',
  'ai-technology',
  'AI in their future',
  'Your nearly grown child wonders what AI means for their studies and career.',
  'AI will change a lot of jobs, and that is genuinely uncertain. The people who do well will be the ones who stay curious, keep thinking for themselves, and use it as a tool rather than a crutch.',
  'AI is going to take all the jobs, so honestly who knows what the point is anymore.',
  'Doom drains their motivation right when they need to be building skills. Naming the uncertainty while pointing to durable human strengths gives them something hopeful and active to do with it.',
  'Ask what they would love to do regardless of AI, and what skills sit underneath it.',
  'none',
  false,
  910
),

(
  'builder',
  'family-rules',
  'Starting a family agreement',
  'You want to introduce a shared agreement about how your family uses devices.',
  'I want us to make a few screen agreements together, rather than me just handing down rules. You get a real say, because you are more likely to keep something you helped build.',
  'Here are the new phone rules, and there is no point arguing about them.',
  'Rules dropped from above invite quiet rebellion and feel like something to dodge. Building them together gives children ownership, so the agreement becomes ours rather than yours to break.',
  'Write down just three agreements you both genuinely accept and stick them on the fridge.',
  'none',
  false,
  1001
),

(
  'explorer',
  'family-rules',
  'They broke the agreement',
  'Your child has broken a digital agreement you made together.',
  'We had a deal and it got broken, so let us talk about what happened rather than just hand out a punishment. What got in the way of sticking to it?',
  'You broke the rule, so that is your phone gone for a week, no discussion.',
  'Pure punishment teaches them to avoid getting caught, not to keep their word. Talking about what went wrong keeps the agreement alive and treats a slip as something to learn from.',
  'Ask what would make the agreement easier to keep, then adjust it together.',
  'none',
  false,
  1002
),

(
  'shaper',
  'family-rules',
  'Updating the rules',
  'Your growing child has outgrown rules that suited a younger version of them.',
  'You are older now and some of our old rules do not fit anymore, you are right about that. Let us update them together to match where you actually are.',
  'The rules are the rules and they are not changing just because you are older.',
  'Frozen rules feel like a sign you do not see them growing, and that breeds resentment. Updating openly shows that more maturity earns more freedom, which is exactly the lesson you want to teach.',
  'Pick one rule that no longer fits and renegotiate it together tonight.',
  'none',
  false,
  1003
),

(
  'explorer',
  'family-rules',
  'When rules feel unfair',
  'Your child complains that their friends are allowed far more than they are.',
  'I believe you that your friends have different rules, and that does feel unfair. Every family decides what works for them, and I am happy to explain the why behind ours.',
  'I do not care what your friends are allowed to do, you are not them.',
  'Dismissing the comparison ends a chance to share your reasoning and your values. Acknowledging the unfair feeling while standing by your why teaches them rules can have reasons, not just power.',
  'Pick one rule they think is unfair and walk them through the reason behind it.',
  'none',
  false,
  1004
),

(
  'builder',
  'family-rules',
  'Talking about parental controls',
  'You want to set up parental controls without your child feeling spied on.',
  'I am going to put some safety settings on your device, and I want to be straight with you about it rather than sneaky. Think of it like stabilisers, they come off as you show you do not need them.',
  'I am putting controls on and I do not need to tell you what they do.',
  'Secret monitoring, once discovered, destroys trust and teaches them to hide. Being open and framing controls as temporary support keeps the relationship honest and gives them a path to earn more freedom.',
  'Show them exactly what the controls do and what they do not see.',
  'none',
  false,
  1005
),

(
  'shaper',
  'family-rules',
  'Checking their phone',
  'You are tempted to check your child''s phone without asking them first.',
  'If I am ever worried enough to look at your phone, I will tell you and we will look together. I would rather you trust me than feel watched behind your back.',
  'I pay for that phone, so I will read it whenever I feel like it.',
  'Secret searches, once found, end the openness you actually need to keep them safe. Promising transparency, even about checking, makes you the parent they bring problems to instead of hiding them.',
  'Agree out loud what would have to happen for a phone check to be fair.',
  'none',
  false,
  1006
),

(
  'builder',
  'family-rules',
  'Device free zones and times',
  'You want some spaces and moments in the day to be free of screens.',
  'Let us keep a couple of times screen free for all of us, like dinner and the hour before bed. This one is for me too, not just you, because I want us to actually see each other.',
  'No phones at the table, now go and put that away this instant.',
  'A rule that only binds the child feels like control rather than care. Making it shared, and including yourself, turns it into a family value about presence instead of a punishment.',
  'Choose one screen free time everyone agrees to and start it at dinner tonight.',
  'none',
  false,
  1007
),

(
  'explorer',
  'family-rules',
  'Screen time on holidays',
  'Your child expects the usual screen limits to vanish on holiday.',
  'Holidays can be more relaxed, that is fair, and a bit more screen time is fine. Let us just agree it does not swallow the whole trip, because we came here to do things together.',
  'We are on holiday so do whatever you want, I do not have the energy to police it.',
  'Total surrender now makes the return to normal feel like a punishment and starts a fight. Agreeing a relaxed but real limit up front keeps the holiday peaceful and protects the time you came for.',
  'Before the trip, agree together what relaxed holiday screen time actually looks like.',
  'none',
  false,
  1008
),

(
  'explorer',
  'family-rules',
  'When one parent is stricter',
  'You and your parenting partner enforce screen rules very differently.',
  'Your dad and I do not always agree on screen rules, and that is something we are sorting out between us. It is not your job to play us off each other, and we will get on the same page.',
  'Well your mother is just too strict, so do not worry about her rules.',
  'Undermining the other parent teaches children to exploit the gap and trust neither of you. Owning the difference as a grown up problem to fix keeps the child out of the middle and the rules consistent.',
  'Talk privately with your partner and agree one rule you will both back.',
  'none',
  false,
  1009
),

(
  'shaper',
  'family-rules',
  'Removing restrictions',
  'Your child has shown they can be trusted and you want to loosen the rules.',
  'You have shown me real responsibility lately, so I am taking some of the limits off. This is you earning my trust, and I want you to feel that.',
  'Fine, I will take the controls off, but I am watching you closely.',
  'Loosening rules grudgingly steals the reward and keeps them feeling distrusted. Naming the freedom as something they earned makes responsibility feel worth it and motivates the next good choice.',
  'Tell them one specific thing they did that earned this new freedom.',
  'none',
  false,
  1010
),

(
  'explorer',
  'school',
  'Phone during homework',
  'Your child keeps their phone beside them while doing homework.',
  'Your brain cannot really focus and check your phone at the same time, even though it feels like it can. Let us park it in another room for half an hour and see how much quicker the work goes.',
  'Give me that phone right now, you will never get anything done with it.',
  'Snatching the phone starts a power struggle instead of building a habit they own. Explaining how attention actually works, then testing it, lets them feel the difference for themselves.',
  'Try one homework session with the phone in another room and ask how it felt.',
  'none',
  false,
  1101
),

(
  'shaper',
  'school',
  'The school phone ban',
  'Your child is upset about a new phone ban at school.',
  'I get why that feels annoying, having it taken away all day. Schools usually do this so people actually talk and focus, so let us see whether it changes anything good before we decide it is terrible.',
  'Good, schools should have done that years ago, end of story.',
  'Siding instantly with the school dismisses a real frustration and ends the chat. Validating the annoyance while staying curious about the upside keeps them thinking rather than just resentful.',
  'After a week, ask what is different at school now, good or bad.',
  'none',
  false,
  1102
),

(
  'explorer',
  'school',
  'Copying homework online',
  'You catch your child copying homework answers straight from the internet.',
  'I get it, you wanted it done and the answer was right there. The trouble is the homework was the practice, so copying just means you owe yourself the learning later. Let us do this one properly together.',
  'That is lazy and dishonest, do it again and do it on your own.',
  'Calling them lazy shames the child without explaining why the shortcut costs them. Framing homework as practice they are skipping helps them see copying as cheating themselves, which actually changes behaviour.',
  'Sit with them and work through one problem the slow, honest way.',
  'none',
  false,
  1103
),

(
  'shaper',
  'school',
  'Online drama at school',
  'Online drama is spilling over and affecting your child at school.',
  'What happens on the screen does not stay there, it walks into class with you, and that is exhausting. Tell me what is going on, and we will work out how to take some heat out of it.',
  'Just stay off your phone and the drama will sort itself out.',
  'Telling them to log off ignores that the conflict follows them in person. Acknowledging how draining it is, then problem solving together, gives them support instead of a slogan.',
  'Ask them to walk you through who is involved and how it started.',
  'none',
  false,
  1104
),

(
  'shaper',
  'school',
  'A teacher got in touch',
  'A teacher has contacted you about your child''s behaviour online.',
  'A teacher mentioned something about you online and I want to hear your side before I jump to anything. Walk me through what actually happened.',
  'Your teacher called about your behaviour, so you are in serious trouble now.',
  'Leading with the verdict makes them defensive and desperate to minimise. Asking for their version first shows fairness, gets you the truth faster, and keeps you their ally rather than another judge.',
  'Hear their full account calmly before you decide what happens next.',
  'none',
  false,
  1105
),

(
  'explorer',
  'school',
  'Distracted by notifications',
  'Your child is constantly pulled out of class by notifications.',
  'Every buzz yanks your attention away, and it takes ages to get it back, so you are working twice as hard for half the result. Let us turn off the notifications that are not urgent and protect your focus.',
  'Stop being so addicted to your phone and pay attention in class.',
  'Calling them addicted shames them and ignores that apps are built to interrupt. Explaining the real cost of each interruption, then fixing the settings, gives them a practical win they can feel.',
  'Go through their phone together and switch off every notification that is not urgent.',
  'none',
  false,
  1106
),

(
  'shaper',
  'school',
  'AI for coursework',
  'Your child is using AI to help with marked coursework.',
  'AI can be a brilliant study partner, like a tutor who explains things. Where it goes wrong is when it does the thinking that is meant to be yours, so let us be clear about which side of that line each task sits.',
  'Using AI on coursework is cheating, so you are banned from it completely.',
  'A total ban they will ignore teaches nothing about the real judgement they need. Drawing a clear line between help and handing over the thinking gives them a rule they can actually apply.',
  'Take one assignment and agree where AI can help and where it cannot.',
  'none',
  false,
  1107
),

(
  'shaper',
  'school',
  'Grades and screen time',
  'Your child''s grades are slipping as their screen time climbs.',
  'I have noticed school is getting harder while screens are getting more time, and I do not think that is a coincidence. I am not here to blame you, I want to help you find the balance back.',
  'Your grades are dropping because you are glued to that screen, so it is going away.',
  'Confiscation framed as blame makes them shut down and fight you. Naming the pattern gently and offering to help keeps them open and makes fixing it a shared goal rather than a sentence.',
  'Look at the week together and find one screen habit to swap for study time.',
  'none',
  false,
  1108
),

(
  'explorer',
  'relationships',
  'Online friends never met',
  'Your child has online friends they have never met in person.',
  'Online friendships can be real and they can matter, I get that. I just need to understand who these people are, because not everyone online is who they say, and that is the part I worry about.',
  'Those are not real friends, they could be anyone, so stop talking to them.',
  'Dismissing the friendships as fake makes them hide the very details you need. Honouring the connection while staying alert to risk keeps them telling you who they talk to and how.',
  'Ask them to introduce you to one of their online friends by telling you about them.',
  'none',
  false,
  1201
),

(
  'explorer',
  'relationships',
  'A friend from a game',
  'Your child met someone in a game and wants to keep in touch off the platform.',
  'It is great that you clicked with someone, that is half the fun of playing. Before you move chats somewhere more private, let us talk about how you keep your real details safe.',
  'No, you have no idea who that person really is, so the answer is no.',
  'A flat no without reasons just teaches them to do it without telling you. Supporting the friendship while teaching the safety step gives them a habit that protects them long after this one chat.',
  'Agree together what personal details stay private, like school, address and surname.',
  'none',
  false,
  1202
),

(
  'shaper',
  'relationships',
  'An online romance',
  'Your child has developed a romantic interest in someone they met online.',
  'Liking someone is exciting, and I am glad you told me. With someone you have only met online, I want us to go slowly and make sure they really are who they say before things get serious.',
  'You cannot date someone off the internet, that is ridiculous and dangerous.',
  'Ridicule guarantees they stop sharing and pursue it in secret, which is the real danger. Taking the feeling seriously while setting a careful pace keeps you in the loop where you can actually protect them.',
  'Ask what they know about this person and how they came to know it.',
  'none',
  false,
  1203
),

(
  'shaper',
  'relationships',
  'More online than in person',
  'Your child is spending far more time with online friends than face to face ones.',
  'Online friends count, and I am not knocking them. I have just noticed you are not seeing your mates in person much lately, and I want to check that is a choice and not something easier to hide behind.',
  'You need to get off that screen and go and see some real friends.',
  'Ordering them outside dismisses real bonds and makes them defensive. Naming the shift with curiosity helps you find out whether something offline got hard, which is often the real story.',
  'Ask gently whether anything has made seeing friends in person feel harder lately.',
  'none',
  false,
  1204
),

(
  'shaper',
  'relationships',
  'Friend group drama online',
  'Drama within your child''s friend group is playing out in group chats.',
  'Group chats can turn into a pressure cooker fast, with everyone watching. You do not have to reply to everything the second it lands, and stepping back for a bit is allowed.',
  'Just leave the group chat, problem solved.',
  'Telling them to leave ignores the social cost of vanishing from their circle. Giving them permission to slow down, without quitting, hands them a realistic way to lower the heat and keep their place.',
  'Talk through one message they feel pressure to answer and whether it actually needs a reply.',
  'none',
  false,
  1205
),

(
  'shaper',
  'relationships',
  'Closer to online friends',
  'Your child says they feel closer to online friends than to friends at school.',
  'It makes sense, online you often find people who get the exact thing you are into. That closeness is real, and it does not have to compete with the friends right in front of you, you can have both.',
  'That is not real closeness, you barely know those people.',
  'Denying the closeness makes them feel unseen and pushes them further online. Validating why online friends fit so well, while keeping room for local ones, removes the either or pressure they feel.',
  'Ask what their online friends understand about them that feels hard to find at school.',
  'none',
  false,
  1206
),

(
  'shaper',
  'relationships',
  'A friendship ended by a post',
  'A friendship has broken down over something that was posted.',
  'Losing a friend over a post really hurts, and I am sorry. Whether you posted it or they did, let us untangle what happened, because there is usually a way through if you want one.',
  'Well, this is exactly why you should be careful what you post.',
  'A lecture in the moment of loss adds shame to hurt and closes them off. Leading with comfort, then gently exploring repair, helps them learn how online words land without feeling judged.',
  'Ask whether they want to mend it, and if so, help them plan what to say in person.',
  'none',
  false,
  1207
),

(
  'independent',
  'relationships',
  'A long distance friendship',
  'Your nearly grown child is keeping a meaningful friendship alive across distance online.',
  'Keeping a friendship going across distance takes real effort, and the fact you do it says a lot about you. Tools make it possible, but it is your care that keeps it alive.',
  'You cannot really stay close to someone you never actually see.',
  'Doubting the friendship dismisses a genuine skill they are building for adult life. Praising the effort behind it affirms that connection is something they tend, not just something proximity hands them.',
  'Ask what they do to keep that friendship strong, and tell them it impresses you.',
  'none',
  false,
  1208
)

;