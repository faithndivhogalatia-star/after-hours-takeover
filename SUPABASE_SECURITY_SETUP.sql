-- AFTER HOURS: private ticket data
-- Run this in the Supabase SQL Editor. Replace the admin email below with your own login email.
-- Do not publish this file with your admin password or banking details.

alter table public.tickets enable row level security;

-- Remove broad policies if they exist, then create authenticated-admin-only policies.
drop policy if exists "tickets_public_insert" on public.tickets;
drop policy if exists "tickets_admin_select" on public.tickets;
drop policy if exists "tickets_admin_update" on public.tickets;

create policy "tickets_public_insert" on public.tickets
for insert to anon, authenticated
with check (true);

create policy "tickets_admin_select" on public.tickets
for select to authenticated
using (auth.jwt() ->> 'email' = 'REPLACE_WITH_YOUR_ADMIN_EMAIL');

create policy "tickets_admin_update" on public.tickets
for update to authenticated
using (auth.jwt() ->> 'email' = 'REPLACE_WITH_YOUR_ADMIN_EMAIL')
with check (auth.jwt() ->> 'email' = 'REPLACE_WITH_YOUR_ADMIN_EMAIL');
