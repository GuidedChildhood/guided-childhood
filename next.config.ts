import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
