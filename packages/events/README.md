# @byteslice/events

Events package for ByteSlice customers.

## Setup

1. Create a Supabase project and get your project URL and anon key
2. Create an `events` table in your Supabase database with the following schema:

```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('identify', 'track', 'page')),
  user_id text,
  client_id text not null,
  event text,
  name text,
  category text,
  properties jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index events_type_idx on events(type);
create index events_user_id_idx on events(user_id);
create index events_client_id_idx on events(client_id);
create index events_created_at_idx on events(created_at);
```

3. Set the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BYTESLICE_EVENTS_CLIENT=your_client_id
RESEND_API_KEY=your_resend_api_key
```

## Features

- Event tracking
- Page view tracking
- Email sending
- Type-safe error handling 

## API

```typescript
import { track, page, sendEmail } from '@byteslice/events/server'

// Track an event
const trackResult = await track('button_clicked', { buttonId: 'submit' })
if (!trackResult.failure) {
  console.log('Event tracked successfully:', trackResult.data.id)
} else {
  console.error('Failed to track event:', trackResult.failure)
}

// Track a page view
const pageResult = await page({ name: '/dashboard' })
if (!pageResult.failure) {
  console.log('Page view tracked successfully:', pageResult.data.id)
} else {
  console.error('Failed to track page view:', pageResult.failure)
}

// Send an email
const emailResult = await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to ByteSlice',
  html: '<p>Welcome to our platform!</p>',
  from: 'custom@yourdomain.com' // optional, defaults to transactions@byteslice.co
})

if (!emailResult.failure) {
  console.log('Email sent successfully:', emailResult.data.id)
} else {
  console.error('Failed to send email:', emailResult.failure)
}
```
