namespace NodeJS {
  interface ProcessEnv {
    BYTESLICE_SUPABASE_URL: string
    BYTESLICE_SUPABASE_ANON_KEY: string
    BYTESLICE_EVENTS_CLIENT: string
    BYTESLICE_RESEND_API_KEY: string
    BYTESLICE_LOG_LEVEL: 'info' | 'debug' | 'none'
  }
}
