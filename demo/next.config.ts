import type { NextConfig } from 'next';
import path from 'node:path';

interface RemotePattern {
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
}

function parseOrigin(raw: string): RemotePattern | null {
  try {
    const url = new URL(raw);
    const protocol = url.protocol.replace(':', '');
    if (protocol !== 'http' && protocol !== 'https') return null;
    return {
      protocol,
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
    };
  } catch {
    return null;
  }
}

const rawOrigins = [
  process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3333',
  ...(process.env.NEXT_PUBLIC_MEDIA_ORIGINS ?? 'http://127.0.0.1:9000,http://localhost:9000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
];

const remotePatterns: RemotePattern[] = rawOrigins
  .map(parseOrigin)
  .filter((p): p is RemotePattern => p !== null);

const nextConfig: NextConfig = {
  // Корень monorepo — общий предок для demo/ и для .pnpm/-симлинков next/react.
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  // @minecms/sdk экспортирует TS-исходники из workspace.
  transpilePackages: ['@minecms/sdk'],
  images: {
    remotePatterns,
  },
};

export default nextConfig;
