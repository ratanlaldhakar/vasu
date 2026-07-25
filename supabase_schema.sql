-- ===================================================
-- Supabase Schema Setup Script
-- Open your Supabase Dashboard -> SQL Editor
-- Paste this script and click "Run" to create your tables
-- ===================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    gallery TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    problem TEXT,
    solution TEXT,
    tools TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to view projects
CREATE POLICY "Allow public read-only access to projects" ON public.projects
    FOR SELECT TO public USING (true);

-- Allow authenticated users (e.g. your admin account) to edit projects
CREATE POLICY "Allow all access to authenticated users on projects" ON public.projects
    FOR ALL TO authenticated USING (true);


-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_cents INTEGER,
    preview_images TEXT[] DEFAULT '{}',
    file_url TEXT,
    tags TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view products
CREATE POLICY "Allow public read-only access to products" ON public.products
    FOR SELECT TO public USING (true);

-- Allow authenticated users to edit products
CREATE POLICY "Allow all access to authenticated users on products" ON public.products
    FOR ALL TO authenticated USING (true);


-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT,
    buyer_email TEXT,
    stripe_session_id TEXT,
    status TEXT,
    download_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (e.g. from checkout handler)
CREATE POLICY "Allow insert access to public for orders" ON public.orders
    FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated admin to view orders
CREATE POLICY "Allow authenticated users to select orders" ON public.orders
    FOR SELECT TO authenticated USING (true);


-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to submit contact forms/bookings
CREATE POLICY "Allow insert access to public for messages" ON public.messages
    FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated admin to view messages
CREATE POLICY "Allow authenticated users to read messages" ON public.messages
    FOR SELECT TO authenticated USING (true);
