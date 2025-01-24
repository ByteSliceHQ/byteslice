type NextRewrites = {
  source: string
  destination: string
}

export const rewrites: NextRewrites[] = [
  {
    source: `/v1/projects/${process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_KEY}/settings`,
    destination: `https://cdp.customer.io/v1/projects/${process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_KEY}/settings`,
  },
  {
    source: '/v1/t',
    destination: 'https://cdp.customer.io/v1/t',
  },
  {
    source: '/v1/i',
    destination: 'https://cdp.customer.io/v1/i',
  },
]
