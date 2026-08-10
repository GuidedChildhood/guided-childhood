import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared package ships as plain TypeScript (no build step), so Next
  // compiles it alongside the app. Both apps carry this same line.
  transpilePackages: ['@gc/shared'],
  // The schools product moved to its own app at the split cutover
  // (plans/split-plan.md step 7). Old links land on the schools site.
  //
  // HOLDING PATTERN until launch: JP is not attaching
  // schools.guidedchildhood.com until the whole platform is built, so the
  // destination comes from SCHOOLS_SITE_URL (set it on the Vercel project
  // to the schools app's own vercel.app URL), and the redirects are
  // TEMPORARY 307s so no browser or crawler caches the interim address.
  // At launch: set SCHOOLS_SITE_URL to https://schools.guidedchildhood.com
  // and flip permanent to true, so search engines move their index then,
  // and only then.
  async redirects() {
    const SCHOOLS = process.env.SCHOOLS_SITE_URL || 'https://guided-childhood-schools.vercel.app'
    return [
      { source: '/schools', destination: SCHOOLS, permanent: false },
      { source: '/educator', destination: SCHOOLS, permanent: false },
      { source: '/educator/:path*', destination: `${SCHOOLS}/:path*`, permanent: false },
      { source: '/class/:lessonId', destination: `${SCHOOLS}/class/:lessonId`, permanent: false },
    ]
  },
  images: {
    // DiGi the star is an SVG served through next/image (DigiCharacter). The
    // image optimizer refuses to serve SVGs unless this is set, which was
    // leaving DiGi as a broken image on the road to 16, the daily strip and
    // anywhere else DigiCharacter appears. Safe here: the SVG is our own
    // trusted asset, and the attachment + sandbox CSP are the recommended
    // guards so an SVG can never run script in the image context.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd8j0ntlcm91z4.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd2ol7oe51mr4n9.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
