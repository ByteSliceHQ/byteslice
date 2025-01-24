import type { NextConfig } from 'next'
import { rewrites } from '@byteslice/events'

const nextConfig: NextConfig = {
  // biome-ignore lint/suspicious/useAwait: Does not apply here.
  async rewrites() {
    return rewrites
  },
}

export default nextConfig
