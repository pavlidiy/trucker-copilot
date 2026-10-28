-- Drivers, loads, stops. Only the Edge Function (service role) touches these tables,
-- so RLS is on with no policies: the public anon key can read nothing.

create table drivers (
  wa_id text primary key,              -- WhatsApp phone id of the driver
  lang text,                           -- null until chosen
  onboarding_step text not null default 'language', -- language | name | company | email | disclaimer | done
  name text,
  company text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table loads (
  id uuid primary key default gen_random_uuid(),
  wa_id text not null references drivers (wa_id) on delete cascade,
  load_number text not null,
  broker text,
  broker_email text,
  pickup jsonb,                        -- { name, city }
  delivery jsonb,
  rate_cents integer,
  miles integer,
  stage text not null default 'checked',
  analysis jsonb,                      -- Muse Spark structured output, as returned
  detention_rate_cents integer not null default 5000,
  free_minutes integer not null default 120,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index loads_driver_recent on loads (wa_id, created_at desc);

create table stops (
  id uuid primary key default gen_random_uuid(),
  load_id uuid not null references loads (id) on delete cascade,
  kind text not null check (kind in ('pickup', 'delivery')),
  place_name text,
  lat double precision,
  lng double precision,
  time_zone text not null,
  arrived_at timestamptz not null,
  left_at timestamptz,
  free_time_notified_at timestamptz,
  created_at timestamptz not null default now()
);
create index stops_open on stops (load_id) where left_at is null;

-- Meta retries webhooks; each message id is handled once.
create table processed_messages (
  wamid text primary key,
  received_at timestamptz not null default now()
);

alter table drivers enable row level security;
alter table loads enable row level security;
alter table stops enable row level security;
alter table processed_messages enable row level security;
