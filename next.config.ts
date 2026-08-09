import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared package ships as plain TypeScript (no build step), so Next
  // compiles it alongside the app. Both apps carry this same line.
  transpilePackages: ['@gc/shared'],
  // The schools product moved to its own app and domain at the split
  // cutover (plans/split-plan.md step 7). Old links keep working forever:
  // the marketing page, the educator workspace and the class showcase all
  // land on the schools site. 308s, so search engines move their index.
  async redirects() {
    const SCHOOLS = 'https://schools.guidedchildhood.com'
    return [
      { source: '/schools', destination: SCHOOLS, permanent: true },
      { source: '/educator', destination: SCHOOLS, permanent: true },
      { source: '/educator/:path*', destination: `${SCHOOLS}/:path*`, permanent: true },
      { source: '/class/:lessonId', destination: `${SCHOOLS}/class/:lessonId`, permanent: true },
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
