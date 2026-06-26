import { getFounderCount, FOUNDER_CAP } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const count = await getFounderCount()
    const remaining = Math.max(0, FOUNDER_CAP - count)
    return NextResponse.json(
      { count, remaining, sold_out: remaining === 0 },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } }
    )
  } catch {
    return NextResponse.json({ count: 0, remaining: FOUNDER_CAP, sold_out: false })
  }
}
