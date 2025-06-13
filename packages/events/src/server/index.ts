import { type Result, withResult } from '@byteslice/result'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import type { EventProperties, PageParams } from './types'

type LogLevel = 'info' | 'debug' | 'none'

const LOG_LEVEL = (process.env.BYTESLICE_LOG_LEVEL || 'none') as LogLevel

const logger = {
  info: (...args: unknown[]) => {
    if (LOG_LEVEL === 'info' || LOG_LEVEL === 'debug') {
      console.log('[Byteslice Events]', ...args)
    }
  },
  debug: (...args: unknown[]) => {
    if (LOG_LEVEL === 'debug') {
      console.debug('[Byteslice Events]', ...args)
    }
  },
}

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error('Missing Supabase configuration')
}

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing Resend API key')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const resend = new Resend(process.env.RESEND_API_KEY)

export function track(
  event: string,
  properties?: EventProperties,
): Promise<Result<{ id: string }, Error>> {
  return withResult(
    async () => {
      logger.info('Tracking event:', event)
      logger.debug('Event properties:', properties)

      const { data, error } = await supabase
        .from('events')
        .insert({
          type: 'track',
          user_id: properties?.userId,
          client_id: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_CLIENT,
          event,
          properties,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      logger.info('Event tracked:', data?.id)
      logger.debug('Event data:', data)

      if (error) {
        logger.debug('Error tracking event:', error)
        throw error
      }

      if (!data?.id) {
        throw new Error('No event ID returned from Supabase')
      }

      return { id: data.id }
    },
    (error) => error,
  )
}

// Server side page tracking requires the developer to build out the parameters themselves
// since there is no native browser API to gather page information.
export function page(
  params: PageParams,
): Promise<Result<{ id: string }, Error>> {
  return withResult(
    async () => {
      logger.info('Tracking page view')
      logger.debug('Page params:', params)

      const { data, error } = await supabase
        .from('events')
        .insert({
          type: 'page',
          client_id: process.env.NEXT_PUBLIC_BYTESLICE_EVENTS_CLIENT,
          ...params,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      logger.info('Page view tracked:', data?.id)
      logger.debug('Page view data:', data)

      if (error) {
        logger.debug('Error tracking page view:', error)
        throw error
      }

      if (!data?.id) {
        throw new Error('No event ID returned from Supabase')
      }

      return { id: data.id }
    },
    (error) => error,
  )
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(
  params: SendEmailParams,
): Promise<Result<{ id: string }, Error>> {
  return withResult(
    async () => {
      logger.info('Sending email to:', params.to)
      logger.debug('Email details:', {
        subject: params.subject,
        from: params.from,
      })

      const { data, error } = await resend.emails.send({
        from: params.from ?? 'transactions@byteslice.co',
        to: params.to,
        subject: params.subject,
        html: params.html,
      })

      logger.info('Email sent:', data?.id)
      logger.debug('Email data:', data)

      if (error) {
        logger.debug('Error sending email:', error)
        throw error
      }

      if (!data?.id) {
        throw new Error('No email ID returned from Resend')
      }

      return { id: data.id }
    },
    (error) => error,
  )
}
