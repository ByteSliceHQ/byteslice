'use client'

import { track, identify } from '@byteslice/events/client'

export function ClientTracking() {
  identify('development2@byteslice.co')

  return (
    <button type="button" onClick={() => track('button-click')}>
      Track a button click
    </button>
  )
}
