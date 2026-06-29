import { NextRequest, NextResponse } from 'next/server'

// Called by Vercel Cron — see vercel.json for schedule
// Three times daily: 7:30am, 3:30pm, 9:00pm UK time

const CHECK_INS = [
  {
    hour: 7,
    title: 'Morning check-in',
    body: 'How did the first screen moment go today? DiGi is ready with the words if you need them.',
  },
  {
    hour: 15,
    title: 'School is out',
    body: 'After-school screen time is one of the hardest moments. Your stage guide has the structure.',
  },
  {
    hour: 21,
    title: 'Evening wind-down',
    body: 'Bedtime and the phone — how did it go? Log the moment and DiGi will help you prepare for tomorrow.',
  },
]

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Work out which check-in to send based on UK time
  const ukHour = new Date(
    new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
  ).getHours()

  const checkin = CHECK_INS.find(c => c.hour === ukHour)
  if (!checkin) {
    return NextResponse.json({ skipped: true, hour: ukHour })
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('supabase.co', 'vercel.app') ?? ''
  const sendUrl = `${req.nextUrl.origin}/api/push/send`

  const res = await fetch(sendUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ title: checkin.title, body: checkin.body, url: '/dashboard' }),
  })

  const result = await res.json()
  return NextResponse.json({ checkin: checkin.title, ...result })
}
