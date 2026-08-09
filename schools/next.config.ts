import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared package ships as plain TypeScript; Next compiles it alongside
  // the app. Same line as the parents app.
  transpilePackages: ['@gc/shared'],
  images: {
    // DiGi the star is an SVG served through next/image (DigiCharacter), the
    // same reason as the parents app gives.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
      { protocol: 'https', hostname: 'd2ol7oe51mr4n9.cloudfront.net' },
    ],
  },
};

export default nextConfig;
