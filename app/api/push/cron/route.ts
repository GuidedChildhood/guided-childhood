import { NextRequest, NextResponse } from 'next/server'

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
  },
  {
    slot: 'evening',
    hour: 21, minute: 0,
    title: 'Evening wind down',
    body: 'Bedtime and the phone, how did it go? Log the moment and DiGi will help you prepare for tomorrow.',
  },
]

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ukNow = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  const ukHour = ukNow.getHours()
  const nowMinutes = ukHour * 60 + ukNow.getMinutes()

  const checkin = CHECK_INS.reduce((best, c) => {
    const dist = Math.abs(c.hour * 60 + c.minute - nowMinutes)
    const bestDist = Math.abs(best.hour * 60 + best.minute - nowMinutes)
    return dist < bestDist ? c : best
  })
  const distanceMinutes = Math.abs(checkin.hour * 60 + checkin.minute - nowMinutes)

  if (distanceMinutes > WINDOW_MINUTES) {
    return NextResponse.json({ skipped: true, reason: 'outside check in window', ukHour, nowMinutes })
  }

  const res = await fetch(`${req.nextUrl.origin}/api/push/send`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ title: checkin.title, body: checkin.body, url: '/dashboard', slot: checkin.slot }),
  })

  const result = await res.json()

  // Kid quest reminders ride the morning and after school slots only,
  // never the evening one: no buzzing children at bedtime.
  const KID_NUDGES: Record<number, { title: string; body: string }> = {
    7: { title: 'Your quests are ready ⭐', body: 'Tick them off today and stack your stars.' },
    15: { title: 'After school quests ⭐', body: 'A few ticks now and the screen minutes are yours.' },
  }
  const kidNudge = KID_NUDGES[checkin.hour]
  let kidResult = null
  if (kidNudge) {
    try {
      const kidRes = await fetch(`${req.nextUrl.origin}/api/push/send`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ title: kidNudge.title, body: kidNudge.body, url: '/', audience: 'kids' }),
      })
      kidResult = await kidRes.json()
    } catch { /* kid nudges are best effort */ }
  }

  return NextResponse.json({ checkin: checkin.title, ukHour, ...result, kids: kidResult })
}
