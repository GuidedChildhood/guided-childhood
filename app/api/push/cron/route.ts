import { withHeartbeat } from '@/lib/ops/heartbeat'
import { londonNow } from '@/lib/time/london'
import { isSchoolDay } from '@/lib/quests/job-time'
import { NextRequest, NextResponse } from 'next/server'
import { sendPush } from '@/lib/push/send'

// Called by Vercel Cron every 30 minutes — see vercel.json. Vercel cron
// schedules are fixed UTC, but the promise shown in Settings is a UK
// WALL CLOCK time (7:30am, 3:30pm, 9pm), and UK time is UTC+1 all
// summer. A fixed UTC schedule drifts an hour off its own promise for
// more than half the year. So instead of firing at a few exact UTC
// moments, this runs every half hour and only actually sends when the
// UK LOCAL clock, computed fresh each run, is within the window below
// of one of the three targets. No seasonal edits, ever: the correct
// side of the clock change is worked out live on every single run.

const WINDOW_MINUTES = 10

const CHECK_INS = [
  {
    slot: 'morning',
    hour: 7, minute: 30,
    title: 'Morning check in',
    body: 'How did the first screen moment go today? DiGi is ready with the words if you need them.',
  },
  {
    slot: 'afternoon',
    hour: 15, minute: 30,
    title: 'School is out',
    body: 'After school screen time is one of the hardest moments. Your stage guide has the structure.',
    // Saturday 1 August, and every parent got "School is out". True in the
    // narrowest sense and obviously wrong to anyone reading it, which is the
    // kind of wrong that teaches people the notifications are automated noise.
    // The moment is real in the holidays too, the mid afternoon stretch is
    // arguably harder, so the slot stays and only the words change.
    offSchool: {
      title: 'The afternoon stretch',
      body: 'The long middle of the day is one of the hardest moments for screens. Your stage guide has the structure.',
    },
  },
  {
    slot: 'evening',
    hour: 21, minute: 0,
    title: 'Evening wind down',
    body: 'Bedtime and the phone, how did it go? Log the moment and DiGi will help you prepare for tomorrow.',
  },
]

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // This used to read the hour off an Invalid Date, so ukHour was NaN and
  // nowMinutes with it, which is why the reply carried "ukHour": null.
  //
  // Read the guard below carefully, because the failure is the opposite of the
  // obvious one. distanceMinutes was also NaN, and NaN > WINDOW_MINUTES is
  // false, so it never skipped. It fell through and sent on every single run:
  // a check in every thirty minutes, forty eight times a day, instead of three.
  // The live runs prove it, replying with a checkin name rather than the
  // skipped shape.
  //
  // Nobody was buried in notifications only because the send was 401ing on the
  // protected deployment host and every one of them was thrown away. Fixing
  // NEXT_PUBLIC_APP_URL without fixing this would have turned a silent failure
  // into forty eight pushes a day to every parent.
  const uk = londonNow()
  const ukHour = uk.hour
  const nowMinutes = ukHour * 60 + uk.minute

  const checkin = CHECK_INS.reduce((best, c) => {
    const dist = Math.abs(c.hour * 60 + c.minute - nowMinutes)
    const bestDist = Math.abs(best.hour * 60 + best.minute - nowMinutes)
    return dist < bestDist ? c : best
  })
  const distanceMinutes = Math.abs(checkin.hour * 60 + checkin.minute - nowMinutes)

  if (distanceMinutes > WINDOW_MINUTES) {
    return NextResponse.json({ skipped: true, reason: 'outside check in window', ukHour, nowMinutes })
  }

  // Sent in process, so there is no host to get wrong any more.
  //
  // This used to post to `${origin}/api/push/send`, and Vercel Cron invokes the
  // function on the deployment specific host, which sits behind Deployment
  // Protection. So the call answered 401 "Protected deployment", not a single
  // push went out, and this route still replied 200 with the failure tucked
  // inside its body. It ran broken for weeks without anybody knowing. The fix
  // at the time was an environment variable pointing at an unprotected alias.
  // Calling the function directly means there is nothing left to point wrong.
  const result = await sendPush({
    ...(!isSchoolDay(new Date()) && checkin.offSchool ? checkin.offSchool : { title: checkin.title, body: checkin.body }),
    url: '/dashboard',
    slot: checkin.slot,
  })

  // Kid quest reminders ride the morning and after school slots only,
  // never the evening one: no buzzing children at bedtime.
  //
  // This is a BROADCAST, one message to every child at once, so it cannot use a
  // family's own school region the way the job reminders do. It assumes the
  // England and Wales calendar, which is right for almost everyone here and
  // will be a few days out for Scotland at the start and end of summer. Worth
  // saying rather than leaving as a silent assumption: the fix, if it ever
  // matters, is to send this per family instead of to everyone.
  const schoolDay = isSchoolDay(new Date())
  const KID_NUDGES: Record<number, { title: string; body: string }> = {
    7: schoolDay
      ? { title: 'Your quests are ready ⭐', body: 'Tick them off today and stack your stars.' }
      : { title: 'Your quests are ready ⭐', body: 'No rush today. Tick them off whenever and stack your stars.' },
    15: schoolDay
      ? { title: 'After school quests ⭐', body: 'A few ticks now and the screen minutes are yours.' }
      : { title: 'Afternoon quests ⭐', body: 'A few ticks now and the screen minutes are yours.' },
  }
  const kidNudge = KID_NUDGES[checkin.hour]
  let kidResult = null
  if (kidNudge) {
    // sendPush never throws, so no try needed. A failure comes back in the
    // result and rides out in the reply, where the heartbeat can see it.
    kidResult = await sendPush({ title: kidNudge.title, body: kidNudge.body, url: '/', audience: 'kids' })
  }

  return NextResponse.json({ checkin: checkin.title, ukHour, ...result, kids: kidResult })
}

export const GET = withHeartbeat('/api/push/cron', handler)
