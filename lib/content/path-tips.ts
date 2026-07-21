// DiGi's little tips along the pathway. Short, warm nudges the child meets
// between the stones: how much to watch, how much to game, a lesson worth a
// look, and a better habit for their age. Written for the child in Justin's
// plain voice, DiGi speaking. No dashes anywhere. Two are woven into the
// trail each day, rotated so the path feels alive across the week.
//
// Keyed by stage id (1 foundation, 2 builder, 3 explorer, 4 shaper,
// 5 independent) so a young child never meets an older child's nudge. The
// helper picks the two for today off the day index.

export type PathTip = {
  key: string
  emoji: string
  // A short mono eyebrow: WATCH TIME, GAME TIME, GOOD HABIT, TRY THIS.
  tag: string
  title: string
  body: string
}

const TIPS: Record<number, PathTip[]> = {
  1: [
    { key: 'f_watch', emoji: '📺', tag: 'Watch time', title: 'A little and together', body: 'At your age a short watch with your grown up right beside you is the best kind. Snuggle up, watch one thing, then go and play.' },
    { key: 'f_game', emoji: '🧩', tag: 'Play time', title: 'Real toys win', body: 'Games on a screen are fun for a bit. Blocks, drawing and running about grow your brain even more. Ask your grown up to play too.' },
    { key: 'f_habit', emoji: '🌳', tag: 'Good habit', title: 'Screens off, world on', body: 'When the screen goes off, look for something to build, draw or find outside. Your grown up will love joining in.' },
    { key: 'f_safe', emoji: '🛟', tag: 'Stay safe', title: 'Always tell your grown up', body: 'If anything on a screen ever feels funny or scary, tell your grown up straight away. They will never be cross. That is the rule.' },
  ],
  2: [
    { key: 'b_watch', emoji: '📺', tag: 'Watch time', title: 'Pick before you tap', body: 'Choose what you are going to watch before you start, then stop when it ends. That way the screen does not choose for you.' },
    { key: 'b_game', emoji: '🎮', tag: 'Game time', title: 'Games earn their place', body: 'A good gap is a game, then a real world thing you love. Balance feels great, and you have more stars for the timer.' },
    { key: 'b_lesson', emoji: '🔍', tag: 'Try this', title: 'The lesson stones teach you loads', body: 'Tap a lesson stone when you reach it. Five minutes and you know something new about staying clever online. Then leap ahead.' },
    { key: 'b_safe', emoji: '🔒', tag: 'Good habit', title: 'Not everything is real', body: 'Some things online are made up to trick you. If it feels too good or too weird, check with your grown up before you tap.' },
  ],
  3: [
    { key: 'e_watch', emoji: '📺', tag: 'Watch time', title: 'Notice the autoplay pull', body: 'One more video turns into ten before you notice. Set a number in your head, or a timer, and be the one who decides.' },
    { key: 'e_game', emoji: '🎮', tag: 'Game time', title: 'Play, then move', body: 'A gaming session feels best with a proper break after. Get outside, kick a ball, stretch. Your eyes and your scores both thank you.' },
    { key: 'e_lesson', emoji: '🧠', tag: 'Try this', title: 'A lesson a fortnight', body: 'Your next safety lesson is on the path and on your home screen. Passing it stamps your passport and lands the tick on your grown up too.' },
    { key: 'e_safe', emoji: '🛡️', tag: 'Good habit', title: 'Your business stays yours', body: 'Real name, school, where you live, they stay off the internet. If someone you do not know asks, tell your grown up.' },
  ],
  4: [
    { key: 's_watch', emoji: '📺', tag: 'Watch time', title: 'What is it doing to your mood?', body: 'Some feeds leave you flat. Notice which ones lift you and which drag you down, and give your time to the ones that are good for you.' },
    { key: 's_game', emoji: '🎮', tag: 'Game time', title: 'Late nights cost you', body: 'Gaming past bedtime steals your sleep, and sleep is where your body and brain top up. Set a hard stop and stick to it.' },
    { key: 's_lesson', emoji: '🧭', tag: 'Try this', title: 'Know how you are nudged', body: 'The lesson stones show you the tricks apps use to keep you scrolling. Once you can see them, you are the one in charge.' },
    { key: 's_safe', emoji: '🔐', tag: 'Good habit', title: 'Think before you send', body: 'Anything you send can be saved and shared. If you would not want it seen by everyone, do not send it. Simple as that.' },
  ],
  5: [
    { key: 'i_watch', emoji: '📺', tag: 'Watch time', title: 'Your time, your call', body: 'You run your own screen time now. The skill is spotting when it stops serving you and choosing to close it. That is real strength.' },
    { key: 'i_game', emoji: '🎮', tag: 'Game time', title: 'Balance is the win', body: 'Gaming can be social, creative, even a career one day. Keep it next to sleep, people and moving, and it stays a good thing.' },
    { key: 'i_lesson', emoji: '🧭', tag: 'Try this', title: 'Finish your passport', body: 'You are close to a full digital literacy passport. Each lesson you pass is a stamp, and proof you can handle the online world well.' },
    { key: 'i_safe', emoji: '🔐', tag: 'Good habit', title: 'Look after your footprint', body: 'What is online about you follows you into jobs and life. Check your settings, tidy what you can, and post like a future boss might read it.' },
  ],
}

// Today's tips for a stage: two of them, rotated by the day so the path
// stays fresh across the week. Fewer than two defined falls back gracefully.
export function tipsForStage(stageId: number, dayIndex: number): PathTip[] {
  const all = TIPS[stageId] ?? TIPS[3]
  if (all.length <= 2) return all
  const a = dayIndex % all.length
  const b = (dayIndex + 2) % all.length
  const picked = [all[a]]
  if (b !== a) picked.push(all[b])
  return picked
}
