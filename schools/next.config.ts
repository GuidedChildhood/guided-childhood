import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The shared package ships as plain TypeScript; Next compiles it alongside
  // the app. Same line as the parents app.
  transpilePackages: ['@gc/shared'],
  // The workspace root, stated rather than inferred. Dependencies are
  // hoisted to the repo root by npm workspaces, so the root must be up
  // there for next itself to resolve; the price of that root is that
  // Turbopack also discovers middleware there, which is why this app
  // carries its own explicit no op proxy.ts: without it the PARENT app's
  // middleware.ts gets compiled into the schools build (caught when that
  // file grew an import the schools tsconfig cannot resolve).
  turbopack: { root: path.join(__dirname, '..') },
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
