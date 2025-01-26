import type {
  EventProperties,
  UserTraits,
} from '@customerio/cdp-analytics-browser'
import { Analytics, type PageParams } from '@customerio/cdp-analytics-node'

const analytics = new Analytics({
  writeKey: process.env.BYTESLICE_EVENTS_KEY,
})

export function identify(userId: string, traits?: UserTraits) {
  return analytics.identify({
    userId,
    traits: {
      ...traits,
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

// Server side page tracking requires the developer to build out the parameters themselves
// since there is no native browser API to gather page information.
export function page(params: PageParams) {
  return analytics.page(params)
}
