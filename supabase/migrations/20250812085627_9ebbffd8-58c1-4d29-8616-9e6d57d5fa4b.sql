
-- 1) FX settings: single-row table to store the system base currency
create table if not exists public.fx_settings (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);

-- Enforce "single row" via unique index on a constant expression
create unique index if not exists fx_settings_one_row on public.fx_settings ((true));

-- Enable RLS
alter table public.fx_settings enable row level security;

-- RLS: authenticated users can read settings
create policy if not exists "Authenticated users can read fx_settings"
on public.fx_settings
for select
to authenticated
using (auth.role() = 'authenticated');

-- RLS: admins can manage settings
create policy if not exists "Admins can manage fx_settings"
on public.fx_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 2) FX rates: pairwise rates with effective date
create table if not exists public.fx_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency text not null,
  to_currency text not null,
  rate numeric not null,
  effective_date date not null,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fx_rates_positive_rate check (rate > 0)
);

-- Uniqueness to prevent duplicates for same pair and date
create unique index if not exists fx_rates_unique_pair_date
on public.fx_rates (from_currency, to_currency, effective_date);

-- Helpful index for date queries
create index if not exists fx_rates_pair_effective_date_idx
on public.fx_rates (from_currency, to_currency, effective_date desc);

-- Enable RLS
alter table public.fx_rates enable row level security;

-- RLS: authenticated users can read rates
create policy if not exists "Authenticated users can read fx_rates"
on public.fx_rates
for select
to authenticated
using (auth.role() = 'authenticated');

-- RLS: admins can manage rates
create policy if not exists "Admins can manage fx_rates"
on public.fx_rates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- 3) Add columns to existing business objects

-- Invoices: add currency + base_amount and the exchange rate applied
alter table public.invoices
add column if not exists currency text not null default 'USD',
add column if not exists base_amount numeric,
add column if not exists exchange_rate numeric,
add column if not exists exchange_rate_date date;

-- Quotes: store base_total and exchange rate used; currency already exists with default 'USD'
alter table public.quotes
add column if not exists base_total numeric,
add column if not exists exchange_rate numeric,
add column if not exists exchange_rate_date date;

-- Orders: record currency and base_total for consistency in reporting
alter table public.orders
add column if not exists currency text not null default 'USD',
add column if not exists base_total numeric,
add column if not exists exchange_rate numeric,
add column if not exists exchange_rate_date date;

-- 4) Updated-at triggers for fx tables (reuse existing function)
-- Create triggers only if they don't exist
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'fx_rates_set_updated_at'
  ) then
    create trigger fx_rates_set_updated_at
    before update on public.fx_rates
    for each row
    execute function public.update_updated_at_column();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'fx_settings_set_updated_at'
  ) then
    create trigger fx_settings_set_updated_at
    before update on public.fx_settings
    for each row
    execute function public.update_updated_at_column();
  end if;
end
$$;
