-- ============================================================================
-- More Space — Security hardening (clears Supabase advisor findings)
--  • pin search_path on trigger functions
--  • make the dashboard view run with the caller's RLS (security_invoker)
--  • add is_staff() + auto-provision profiles for auth users
--  • replace "any authenticated = full access" policies with staff-scoped ones
-- ============================================================================

-- 1) Pin search_path on helper functions
alter function public.set_updated_at()        set search_path = public;
alter function public.bump_lead_activity()     set search_path = public;
alter function public.bump_chat_conversation() set search_path = public;

-- 2) Dashboard view respects the querying user's RLS
alter view public.lead_pipeline_summary set (security_invoker = on);

-- 3) Staff guard (security definer → can read profiles without RLS recursion)
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_active);
$$;

-- 4) Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Replace permissive policies with staff-scoped policies
do $$
declare
  t text;
  oldp text;
  tables text[] := array['profiles','contacts','leads','enquiries','activities','tasks','chat_conversations','chat_messages','call_logs'];
  olds  text[] := array['profiles admin','contacts admin','leads admin','enquiries admin','activities admin','tasks admin','chat_conv admin','chat_msg admin','calls admin'];
begin
  for i in 1 .. array_length(tables,1) loop
    t := tables[i]; oldp := olds[i];
    execute format('drop policy if exists %I on public.%I', oldp, t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())', t || ' staff', t);
  end loop;
end $$;

-- properties: keep public read; swap the write policy for a staff-scoped one
drop policy if exists "properties admin write" on public.properties;
create policy "properties staff write" on public.properties
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
