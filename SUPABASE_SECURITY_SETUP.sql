-- AFTER HOURS TAKEOVER — PAYMENT REFLECTION / SECURITY SETUP
-- Run this entire file once in Supabase SQL Editor.
-- Replace REPLACE_WITH_YOUR_ADMIN_EMAIL with the exact email used for the admin login.

alter table public.tickets enable row level security;

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

-- The public site uses this function to show the number of event tickets remaining.
-- Re-entry does not consume the 230-ticket event capacity.
create or replace function public.tickets_remaining()
returns integer
language sql
security definer
set search_path = public
as $$
  select greatest(
    0,
    230 - coalesce(sum(quantity), 0)::integer
  )
  from public.tickets
  where ticket_type <> 'Re-entry'
    and payment_status in (
      'awaiting_payment',
      'awaiting_cash',
      'paid_online',
      'paid_cash',
      'paid',
      'cash_paid'
    );
$$;

grant execute on function public.tickets_remaining() to anon, authenticated;

-- Public ticket-status checker.
-- It requires BOTH ticket number and phone number, and returns only safe ticket fields.
create or replace function public.check_ticket_status(
  p_ticket_number text,
  p_phone text
)
returns table (
  ticket_number text,
  full_name text,
  ticket_type text,
  quantity integer,
  payment_method text,
  payment_status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    t.ticket_number,
    t.full_name,
    t.ticket_type,
    t.quantity,
    t.payment_method,
    t.payment_status,
    t.created_at
  from public.tickets t
  where upper(trim(t.ticket_number)) = upper(trim(p_ticket_number))
    and regexp_replace(coalesce(t.phone,''), '[^0-9]', '', 'g')
        = regexp_replace(coalesce(p_phone,''), '[^0-9]', '', 'g')
  limit 1;
$$;

grant execute on function public.check_ticket_status(text, text) to anon, authenticated;

-- If your project already uses Supabase Realtime, this makes ticket inserts/updates available.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tickets'
  ) then
    alter publication supabase_realtime add table public.tickets;
  end if;
exception when others then
  raise notice 'Realtime publication could not be changed automatically: %', SQLERRM;
end $$;

-- IMPORTANT:
-- 1. Create your admin user in Supabase Authentication > Users.
-- 2. Replace REPLACE_WITH_YOUR_ADMIN_EMAIL above with that exact email and run this file.
-- 3. The site NEVER marks an EFT paid because a proof-of-payment image was uploaded.
-- 4. The admin marks PAID ONLINE only after the money is visible/verified in the bank.
