-- GUIDED CHILDHOOD CATCH UP · STEP 10 · daily-moments-batch1
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

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
)
on conflict (sort_order) do nothing;

select 'STEP 10 COMPLETE · daily-moments-batch1' as status;
