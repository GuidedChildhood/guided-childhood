import { NextResponse } from 'next/server'

// A tiny fingerprint of the running deploy. Vercel sets the commit SHA
// automatically, no config needed. This is what UpdateBanner polls to
// notice a new deploy has shipped underneath a PWA session that has
// been open for hours or days and would otherwise never find out.
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    version: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_DEPLOYMENT_ID ?? 'dev',
  })
}
