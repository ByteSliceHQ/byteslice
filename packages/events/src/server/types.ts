export interface EventProperties {
  userId?: string
  [key: string]: unknown
}

export interface PageParams {
  name?: string
  category?: string
  properties?: Record<string, unknown>
}

export interface Event {
  type: 'track' | 'page'
  user_id?: string
  client_id: string
  event?: string
  name?: string
  category?: string
  properties?: Record<string, unknown>
  created_at: string
}
