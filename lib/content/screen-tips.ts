// Age related screen advice for the timer, one small tip while the countdown
// runs. Three kinds, rotating by day: good content worth choosing (safe,
// public directories like the BBC children's services), the why in kid words
// (brains, sleep, mood, grounded in the balance research), and what to steer
// around (autoplay holes, endless feeds, loot boxes). Never a lecture, one
// line at a time, matched to the age band.

export type ScreenTip = { emoji: string; text: string }

const TIPS: Record<string, ScreenTip[]> = {
  '4-7': [
    { emoji: '🌟', text: 'Good pick: CBeebies has shows made just for your age, with no adverts at all.' },
    { emoji: '🧠', text: 'One show, then done, helps your brain settle. Autoplay just keeps rolling, so tap stop when it ends.' },
    { emoji: '👀', text: 'Watching WITH a grown up is the best kind. Ask them to watch this one with you.' },
    { emoji: '🌙', text: 'Screens before bed make sleep harder. Daytime screens are the happy kind.' },
    { emoji: '🎨', text: 'Shows that make you want to build, draw or sing are the best ones. Pick a maker show today.' },
    { emoji: '🛑', text: 'If something feels scary or strange, pause it and tell a grown up. That is always the right move.' },
  ],
  '8-10': [
    { emoji: '🌟', text: 'Good picks: BBC Newsround for what is happening, BBC Bitesize for school stuff made fun.' },
    { emoji: '🧠', text: 'Choosing WHAT to watch beats letting autoplay choose for you. You are the boss of the next video, not the app.' },
    { emoji: '🎮', text: 'Games you play WITH friends beat games that just want you back every day. Watch out for daily streak tricks.' },
    { emoji: '🌙', text: 'Screens off about an hour before bed means better sleep, and better sleep means better everything.' },
    { emoji: '💰', text: 'Loot boxes and surprise chests in games are designed like gambling. Real treasure is the game itself.' },
    { emoji: '🔍', text: 'If a video makes you feel worried or weird, stop it and tell your grown up. You never get in trouble for telling.' },
  ],
  '11-13': [
    { emoji: '🌟', text: 'Worth your minutes: creators who teach you something you can DO, making, coding, cooking, sport.' },
    { emoji: '🧠', text: 'The feed is built to keep you scrolling, not to make you happy. Decide what you came to watch, watch it, done.' },
    { emoji: '🌙', text: 'Phones out of the bedroom at night is the single biggest thing for sleep, and sleep runs your mood.' },
    { emoji: '⚖️', text: 'Notice how you FEEL after watching. Great after making or learning something, flat after an hour of shorts. Your brain is telling you something.' },
    { emoji: '🔍', text: 'Half of what trends is made up or cut to mislead. Ask who made this and why before you believe it.' },
    { emoji: '💬', text: 'Group chats can turn fast. You can always leave one, and telling someone at home is strength, not snitching.' },
  ],
  '13-15': [
    { emoji: '🧠', text: 'Comparison is the feed’s favourite trick: everyone posts their highlights, nobody posts their Tuesday. You are comparing your inside to their outside.' },
    { emoji: '🌟', text: 'Follow people who make you want to make things. Unfollow anyone who reliably makes you feel worse. That one edit changes the whole feed.' },
    { emoji: '🌙', text: 'The hour before sleep is when the scroll costs most. Park the phone and your morning self will thank you.' },
    { emoji: '⚖️', text: 'Endless shorts train your attention to want a new hit every twenty seconds. Longer videos and games actually respect your brain more.' },
    { emoji: '🔍', text: 'Algorithms push whatever keeps you watching, including things that wind you up on purpose. Feeling angry at your feed is a design choice, theirs.' },
    { emoji: '💬', text: 'Anything that would hurt if it got screenshotted, do not send it. The internet has a long memory.' },
  ],
  '16+': [
    { emoji: '🧠', text: 'You know how the feed works now. The only question left is whether this half hour is yours or the algorithm’s.' },
    { emoji: '🌙', text: 'Sleep is still the foundation. The phone charging outside the bedroom remains the best habit there is.' },
    { emoji: '⚖️', text: 'Audit your follows now and then: keep what teaches or genuinely entertains you, cut what just fills time.' },
  ],
}

export function screenTipFor(ageBand: string | null, dayIndex: number): ScreenTip {
  const bank = TIPS[ageBand ?? '8-10'] ?? TIPS['8-10']
  return bank[dayIndex % bank.length]
}
