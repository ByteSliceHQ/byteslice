import {
  AnalyticsBrowser,
  type EventProperties,
} from '@customerio/cdp-analytics-browser'

const analytics = AnalyticsBrowser.load(
  {
    writeKey: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_KEY,
    cdnURL: `${process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_PROTOCOL}://${process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_HOST}/`,
  },
  {
    integrations: {
      'Customer.io Data Pipelines': {
        apiHost: `${process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_HOST}/v1`,
        protocol: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_PROTOCOL,
      },
    },
  },
)

export function identify(userId: string) {
  return analytics.identify(userId, {
    objectId: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_CLIENT,
  })
}

export function track(event: string, properties?: EventProperties) {
  return analytics.track(event, properties)
}
