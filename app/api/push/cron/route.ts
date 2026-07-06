import { NextRequest, NextResponse } from 'next/server'

// Called by Vercel Cron — see vercel.json for schedule.
// Three times daily, aimed at 7:30am, 3:30pm and 9:00pm UK time.
//
// Vercel cron schedules run in UTC while these check ins are defined in UK
// hours, and UK time is UTC+1 all summer. The old exact hour match meant
// every firing missed its check in from late March to late October and
// silently sent nothing. The check in is now picked by NEAREST hour, so
// whichever side of a clock change we are on, the right message goes out.

const CHECK_INS = [
  {
    hour: 7,
    title: 'Morning check in',
    body: 'How did the first screen moment go today? DiGi is ready with the words if you need them.',
  },
  {
    hour: 15,
    title: 'School is out',
    body: 'After school screen time is one of the hardest moments. Your stage guide has the structure.',
  },
  {
    hour: 21,
    title: 'Evening wind down',
    body: 'Bedtime and the phone, how did it go? Log the moment and DiGi will help you prepare for tomorrow.',
  },
]

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ukHour = new Date(
    new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
  ).getHours()

  const checkin = CHECK_INS.reduce((best, c) =>
    Math.abs(c.hour - ukHour) < Math.abs(best.hour - ukHour) ? c : best
  )

  const res = await fetch(`${req.nextUrl.origin}/api/push/send`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ title: checkin.title, body: checkin.body, url: '/dashboard' }),
  })

  const result = await res.json()
  return NextResponse.json({ checkin: checkin.title, ukHour, ...result })
}
