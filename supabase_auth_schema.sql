-- ===================================================
-- Supabase Schema Script: Client Portal Integration
-- Paste this script into your SQL Editor and run it
-- ===================================================

-- Drop existing tables to avoid column mismatch errors from older schemas
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.files CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- 1. Create Profiles Table (Linked to Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    business_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profile" ON public.profiles
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow individual update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger to automatically sync profiles with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, business_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'business_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone),
    business_name = COALESCE(NULLIF(EXCLUDED.business_name, ''), public.profiles.business_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    plan_name TEXT, -- Starter, Professional, Business, Custom
    status TEXT DEFAULT 'Planning', -- Planning, Design, Development, Testing, Completed
    progress_percent INTEGER DEFAULT 20,
    timeline TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to read own projects" ON public.projects
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin (service_role)" ON public.projects
    FOR ALL TO service_role USING (true);


-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    booking_date TIMESTAMPTZ DEFAULT now(),
    price TEXT,
    payment_status TEXT DEFAULT 'Pending', -- Pending, Paid
    project_status TEXT DEFAULT 'Planning',
    estimated_delivery TEXT
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own bookings" ON public.bookings
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on bookings" ON public.bookings
    FOR ALL TO service_role USING (true);


-- 4. Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_id TEXT UNIQUE, -- Razorpay Payment ID
    order_id TEXT, -- Razorpay Order ID
    status TEXT DEFAULT 'success',
    invoice_url TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own payments" ON public.payments
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on payments" ON public.payments
    FOR ALL TO service_role USING (true);


-- 5. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_from_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own messages" ON public.messages
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow clients to send messages" ON public.messages
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on messages" ON public.messages
    FOR ALL TO service_role USING (true);


-- 6. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own notifications" ON public.notifications
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow clients to update read status" ON public.notifications
    FOR UPDATE TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on notifications" ON public.notifications
    FOR ALL TO service_role USING (true);


-- 7. Create Files Table
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- Invoice, Receipt, Contract, Design, ZIP
    size_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own files" ON public.files
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on files" ON public.files
    FOR ALL TO service_role USING (true);


-- 8. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow clients to view own log" ON public.activity_logs
    FOR SELECT TO authenticated USING (auth.uid() = client_id);

CREATE POLICY "Allow clients to insert activity" ON public.activity_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Allow all access to admin on activity" ON public.activity_logs
    FOR ALL TO service_role USING (true);
