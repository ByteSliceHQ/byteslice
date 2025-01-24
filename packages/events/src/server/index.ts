import type { EventProperties } from '@customerio/cdp-analytics-browser'
import { Analytics } from '@customerio/cdp-analytics-node'

const analytics = new Analytics({
  writeKey: process.env.BYTESLICE_EVENTS_KEY,
})

export function identify(userId: string) {
  return analytics.identify({
    userId,
    traits: {
      objectId: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_CLIENT,
    },
  })
}

export function track(event: string, properties?: EventProperties) {
  return analytics.track({
    userId: properties?.userId,
    event,
    properties,
  })
}
