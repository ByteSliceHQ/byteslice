import { rewrites } from '@byteslice/events'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // biome-ignore lint/suspicious/useAwait: Does not apply here.
  async rewrites() {
    return rewrites
  },
}

export default nextConfig
