-- ============================================================================
-- More Space — Backend schema (Supabase / PostgreSQL)
-- Modules: Property listing · Enquiry intake · Lead CRM · AI chat · Voice calls
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type listing_type     as enum ('apartment','villa','plot');
create type listing_stage    as enum ('ongoing','prelaunch','landlord_share','investor','resale','ready');
create type enquiry_source   as enum ('website_form','chatbot','whatsapp','phone','walk_in','referral','portal','campaign');
create type enquiry_status   as enum ('new','attempted','contacted','qualified','unqualified','converted','spam');
create type lead_stage       as enum ('new','contacted','qualified','visit_scheduled','negotiation','won','lost');
create type lead_temperature as enum ('cold','warm','hot');
create type activity_type    as enum ('note','call','email','whatsapp','meeting','site_visit','status_change','task','system');
create type task_status      as enum ('open','in_progress','done','cancelled');
create type task_priority    as enum ('low','medium','high','urgent');
create type chat_role        as enum ('system','user','assistant');
create type call_direction   as enum ('outbound','inbound');
create type call_status      as enum ('queued','ringing','in_progress','completed','failed','no_answer','voicemail','cancelled');
create type user_role        as enum ('admin','manager','agent');

-- ----------------------------------------------------------------------------
-- Shared helpers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ----------------------------------------------------------------------------
-- profiles  (CRM team members; linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  role        user_role not null default 'agent',
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- properties  (listing catalogue — featured + upcoming)
-- ----------------------------------------------------------------------------
create table public.properties (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique,
  name           text not null,
  type           listing_type not null,
  stage          listing_stage not null default 'ongoing',
  status         text not null default 'published',     -- published | draft | archived
  location       text,
  area_zone      text,                                  -- Kokapet, Narsingi, Tellapur...
  city           text not null default 'Hyderabad',
  config         text,                                  -- "2 & 3 BHK"
  size_range     text,
  size_min_sqft  integer,
  size_max_sqft  integer,
  price_label    text,                                  -- "₹1.10 – 2.43 Cr"
  price_min      numeric(14,2),                         -- INR
  price_max      numeric(14,2),
  price_per_sqft integer,
  possession     text,
  possession_on  date,
  land_area      text,
  scale          text,                                  -- "14 towers · 3,664 apts"
  rera           text,
  developer      text,
  highlights     text[] not null default '{}',
  amenities      text[] not null default '{}',
  image_url      text,
  gallery        text[] not null default '{}',
  is_featured    boolean not null default true,
  is_upcoming    boolean not null default false,
  display_order  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_properties_type       on public.properties(type);
create index idx_properties_stage      on public.properties(stage);
create index idx_properties_zone       on public.properties(area_zone);
create index idx_properties_upcoming   on public.properties(is_upcoming);
create index idx_properties_status     on public.properties(status);
create trigger trg_properties_updated before update on public.properties
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- contacts  (people)
-- ----------------------------------------------------------------------------
create table public.contacts (
  id          uuid primary key default gen_random_uuid(),
  full_name   text,
  phone       text,
  email       text,
  whatsapp    text,
  source      enquiry_source default 'website_form',
  tags        text[] not null default '{}',
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index idx_contacts_phone on public.contacts(phone);
create index idx_contacts_email on public.contacts(email);
create trigger trg_contacts_updated before update on public.contacts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- leads  (CRM opportunity / pipeline card)
-- ----------------------------------------------------------------------------
create table public.leads (
  id                 uuid primary key default gen_random_uuid(),
  contact_id         uuid references public.contacts(id) on delete set null,
  property_id        uuid references public.properties(id) on delete set null,
  title              text not null,
  stage              lead_stage not null default 'new',
  temperature        lead_temperature not null default 'warm',
  score              integer not null default 0,
  source             enquiry_source not null default 'website_form',
  budget_min         numeric(14,2),
  budget_max         numeric(14,2),
  preferred_config   text,
  preferred_location text,
  assigned_to        uuid references public.profiles(id) on delete set null,
  next_action        text,
  next_action_at     timestamptz,
  last_activity_at   timestamptz not null default now(),
  won_at             timestamptz,
  lost_at            timestamptz,
  lost_reason        text,
  meta               jsonb not null default '{}',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index idx_leads_stage     on public.leads(stage);
create index idx_leads_assigned  on public.leads(assigned_to);
create index idx_leads_temp      on public.leads(temperature);
create index idx_leads_next      on public.leads(next_action_at);
create index idx_leads_property  on public.leads(property_id);
create trigger trg_leads_updated before update on public.leads
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- enquiries  (raw inbound captures from form / chatbot / whatsapp)
-- ----------------------------------------------------------------------------
create table public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid references public.leads(id) on delete set null,
  contact_id   uuid references public.contacts(id) on delete set null,
  property_id  uuid references public.properties(id) on delete set null,
  name         text,
  phone        text,
  email        text,
  message      text,
  interest     text,
  source       enquiry_source not null default 'website_form',
  status       enquiry_status not null default 'new',
  page_url     text,
  meta         jsonb not null default '{}',
  created_at   timestamptz not null default now()
);
create index idx_enquiries_status   on public.enquiries(status);
create index idx_enquiries_created  on public.enquiries(created_at desc);
create index idx_enquiries_property on public.enquiries(property_id);

-- ----------------------------------------------------------------------------
-- activities  (lead timeline)
-- ----------------------------------------------------------------------------
create table public.activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads(id) on delete cascade,
  contact_id  uuid references public.contacts(id) on delete set null,
  type        activity_type not null default 'note',
  title       text,
  body        text,
  meta        jsonb not null default '{}',
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index idx_activities_lead on public.activities(lead_id, created_at desc);

create or replace function public.bump_lead_activity()
returns trigger language plpgsql as $$
begin
  if new.lead_id is not null then
    update public.leads set last_activity_at = now() where id = new.lead_id;
  end if;
  return new;
end; $$;
create trigger trg_activities_bump after insert on public.activities
  for each row execute function public.bump_lead_activity();

-- ----------------------------------------------------------------------------
-- tasks  (follow-ups; ClickUp-style)
-- ----------------------------------------------------------------------------
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid references public.leads(id) on delete cascade,
  title        text not null,
  description  text,
  status       task_status not null default 'open',
  priority     task_priority not null default 'medium',
  due_at       timestamptz,
  assigned_to  uuid references public.profiles(id) on delete set null,
  completed_at timestamptz,
  created_by   uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index idx_tasks_status   on public.tasks(status);
create index idx_tasks_due      on public.tasks(due_at);
create index idx_tasks_assigned on public.tasks(assigned_to);
create index idx_tasks_lead     on public.tasks(lead_id);
create trigger trg_tasks_updated before update on public.tasks
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- chat_conversations + chat_messages  (AI chatbot)
-- ----------------------------------------------------------------------------
create table public.chat_conversations (
  id              uuid primary key default gen_random_uuid(),
  session_id      text,
  lead_id         uuid references public.leads(id) on delete set null,
  contact_id      uuid references public.contacts(id) on delete set null,
  visitor_name    text,
  visitor_phone   text,
  page_url        text,
  status          text not null default 'open',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);
create index idx_chat_conv_session on public.chat_conversations(session_id);
create trigger trg_chatconv_updated before update on public.chat_conversations
  for each row execute function public.set_updated_at();

create table public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  role            chat_role not null,
  content         text not null,
  model           text,
  tokens          integer,
  meta            jsonb not null default '{}',
  created_at      timestamptz not null default now()
);
create index idx_chat_msg_conv on public.chat_messages(conversation_id, created_at);

create or replace function public.bump_chat_conversation()
returns trigger language plpgsql as $$
begin
  update public.chat_conversations set last_message_at = now() where id = new.conversation_id;
  return new;
end; $$;
create trigger trg_chatmsg_bump after insert on public.chat_messages
  for each row execute function public.bump_chat_conversation();

-- ----------------------------------------------------------------------------
-- call_logs  (ElevenLabs / voice — wired for later auto-calling)
-- ----------------------------------------------------------------------------
create table public.call_logs (
  id               uuid primary key default gen_random_uuid(),
  lead_id          uuid references public.leads(id) on delete set null,
  contact_id       uuid references public.contacts(id) on delete set null,
  direction        call_direction not null default 'outbound',
  status           call_status not null default 'queued',
  provider         text not null default 'elevenlabs',
  provider_call_id text,
  agent_id         text,
  to_number        text,
  from_number      text,
  duration_seconds integer,
  recording_url    text,
  transcript       text,
  summary          text,
  meta             jsonb not null default '{}',
  started_at       timestamptz,
  ended_at         timestamptz,
  created_at       timestamptz not null default now()
);
create index idx_calls_lead   on public.call_logs(lead_id);
create index idx_calls_status on public.call_logs(status);

-- ----------------------------------------------------------------------------
-- Pipeline summary view (for the CRM dashboard)
-- ----------------------------------------------------------------------------
create or replace view public.lead_pipeline_summary as
select stage,
       count(*)                              as total,
       count(*) filter (where temperature='hot')  as hot,
       coalesce(sum(budget_max),0)           as potential_value
from public.leads
where stage not in ('won','lost')
group by stage;

-- ============================================================================
-- Row Level Security
--   anon  : may READ published properties only (everything else is private)
--   authn : CRM team — full access
--   writes from the public site go through Edge Functions using the service
--           role key, which bypasses RLS. So the anon key can never read leads.
-- ============================================================================
alter table public.profiles            enable row level security;
alter table public.properties          enable row level security;
alter table public.contacts            enable row level security;
alter table public.leads               enable row level security;
alter table public.enquiries           enable row level security;
alter table public.activities          enable row level security;
alter table public.tasks               enable row level security;
alter table public.chat_conversations  enable row level security;
alter table public.chat_messages       enable row level security;
alter table public.call_logs           enable row level security;

-- Public read of published properties
create policy "properties public read"
  on public.properties for select
  to anon, authenticated
  using (status = 'published');

-- Authenticated CRM team: full access
create policy "properties admin write"  on public.properties         for all to authenticated using (true) with check (true);
create policy "profiles admin"           on public.profiles           for all to authenticated using (true) with check (true);
create policy "contacts admin"           on public.contacts           for all to authenticated using (true) with check (true);
create policy "leads admin"              on public.leads              for all to authenticated using (true) with check (true);
create policy "enquiries admin"          on public.enquiries          for all to authenticated using (true) with check (true);
create policy "activities admin"         on public.activities         for all to authenticated using (true) with check (true);
create policy "tasks admin"              on public.tasks              for all to authenticated using (true) with check (true);
create policy "chat_conv admin"          on public.chat_conversations for all to authenticated using (true) with check (true);
create policy "chat_msg admin"           on public.chat_messages      for all to authenticated using (true) with check (true);
create policy "calls admin"              on public.call_logs          for all to authenticated using (true) with check (true);
