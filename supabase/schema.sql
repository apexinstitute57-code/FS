-- Keep in sync with /supabase-setup.sql
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(trim(customer_name)) >= 2),
  delivery_address text not null check (char_length(trim(delivery_address)) >= 5),
  contact_number text not null check (char_length(trim(contact_number)) >= 7),
  product_name text not null check (char_length(trim(product_name)) >= 1),
  product_brand text not null check (char_length(trim(product_brand)) >= 1),
  product_category text not null check (char_length(trim(product_category)) >= 1),
  product_price integer not null check (product_price > 0),
  quantity integer not null default 1 check (quantity >= 1 and quantity <= 50),
  total_price integer not null check (total_price > 0),
  order_status text not null default 'Pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Allow validated public order inserts" on public.orders;
drop policy if exists "Allow customer order insert" on public.orders;

create policy "Allow customer order insert"
  on public.orders
  for insert
  to anon, authenticated
  with check (
    char_length(trim(customer_name)) >= 2
    and char_length(trim(delivery_address)) >= 5
    and char_length(trim(contact_number)) >= 7
    and char_length(trim(product_name)) >= 1
    and char_length(trim(product_brand)) >= 1
    and char_length(trim(product_category)) >= 1
    and product_price > 0
    and quantity >= 1
    and quantity <= 50
    and total_price = product_price * quantity
    and order_status = 'Pending'
  );

create table if not exists public.catalog_products (
  id text primary key,
  kind text not null check (kind in ('laptop', 'accessory')),
  category text not null,
  sub_type text,
  brand text not null,
  model text,
  name text not null check (char_length(trim(name)) >= 2),
  price_pkr integer not null check (price_pkr > 0),
  original_price_pkr integer check (original_price_pkr is null or original_price_pkr >= 0),
  availability text not null default 'Available · Confirm Stock on Order',
  image_url text,
  description text not null default '',
  specs jsonb,
  highlights jsonb,
  collections jsonb,
  is_custom boolean not null default false,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.catalog_products enable row level security;

drop policy if exists "Public read catalog_products" on public.catalog_products;
drop policy if exists "Public insert catalog_products" on public.catalog_products;
drop policy if exists "Public update catalog_products" on public.catalog_products;
drop policy if exists "Public delete catalog_products" on public.catalog_products;

create policy "Public read catalog_products"
  on public.catalog_products
  for select
  to anon, authenticated
  using (true);

create policy "Public insert catalog_products"
  on public.catalog_products
  for insert
  to anon, authenticated
  with check (
    char_length(trim(id)) >= 2
    and char_length(trim(name)) >= 2
    and price_pkr > 0
  );

create policy "Public update catalog_products"
  on public.catalog_products
  for update
  to anon, authenticated
  using (true)
  with check (
    char_length(trim(name)) >= 2
    and price_pkr > 0
  );

create policy "Public delete catalog_products"
  on public.catalog_products
  for delete
  to anon, authenticated
  using (true);
