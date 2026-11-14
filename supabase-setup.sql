-- ============================================================================
-- FS SHOP - SUPABASE DATABASE SETUP (supabase-setup.sql)
-- ============================================================================
-- How to run this file:
-- 1. Open your Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Copy and paste this entire file into the editor.
-- 3. Click "Run" to create the orders table and secure RLS policies.
-- ============================================================================

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

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Remove old policies if re-running this script
drop policy if exists "Allow validated public order inserts" on public.orders;
drop policy if exists "Allow customer order insert" on public.orders;

-- Secure INSERT policy for customer orders (anon & authenticated shoppers)
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

-- IMPORTANT SECURITY RULE:
-- No SELECT, UPDATE, or DELETE policies are created for the "anon" role.
-- This ensures anonymous website visitors CANNOT read other customers' names,
-- addresses, or phone numbers, and CANNOT modify or delete existing orders.
-- Store owner Fiza can view and manage all orders inside Supabase Table Editor.
