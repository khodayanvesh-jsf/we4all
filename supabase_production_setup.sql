-- ============================================================================
-- WE4ALL PRODUCTION SUPABASE SQL SCHEMA (https://rjwxsjdayublcmcciuww.supabase.co)
-- Includes PostGIS, Core Marketplace Tables, User Telemetry & OS Push Queue
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.categories (
  category_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  badge VARCHAR(100),
  image_url TEXT,
  flow_type VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.merchants (
  merchant_id SERIAL PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  category_id VARCHAR(50) REFERENCES public.categories(category_id),
  mandal VARCHAR(80) DEFAULT 'Adilabad',
  esign_hash TEXT NOT NULL,
  approval_status VARCHAR(20) DEFAULT 'pending',
  is_active BOOLEAN DEFAULT TRUE,
  location GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brand_products (
  product_id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES public.categories(category_id),
  sub_category_brand VARCHAR(150) NOT NULL,
  shop_name VARCHAR(150) NOT NULL,
  distance_km DECIMAL(5,2) NOT NULL,
  image_url TEXT,
  approval_status VARCHAR(20) DEFAULT 'pending',
  rejection_reason TEXT,
  rejection_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  order_id VARCHAR(40) PRIMARY KEY,
  user_id UUID,
  category_id VARCHAR(50),
  customer_name VARCHAR(120),
  address TEXT,
  grand_total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'PAID_PACKING_STARTED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_telemetry_recommendations (
  telemetry_id SERIAL PRIMARY KEY,
  user_phone VARCHAR(20),
  preferred_category VARCHAR(50),
  last_search_query TEXT,
  gps_lat DECIMAL(9,6),
  gps_lng DECIMAL(9,6),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.push_notifications_queue (
  notification_id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  target_zone VARCHAR(60) DEFAULT 'ALL_INDIA',
  is_compulsory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_status ON public.brand_products (category_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchants_mandal_active ON public.merchants (mandal, is_active) WHERE is_active = true;