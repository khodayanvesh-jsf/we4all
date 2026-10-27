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

CREATE TABLE IF NOT EXISTS public.product_measurement_variants (
  variant_id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES public.brand_products(product_id) ON DELETE CASCADE,
  measurement_label VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2),
  weight_grams INT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  order_id VARCHAR(40) PRIMARY KEY,
  user_id UUID,
  category_id VARCHAR(50),
  customer_name VARCHAR(120),
  address TEXT,
  grand_total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'ORDER_PLACED_MERCHANT_POPUP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.event_escrow_bookings (
  booking_id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  total_agreed_price DECIMAL(10,2) NOT NULL,
  advance_percentage INT CHECK (advance_percentage IN (35, 85)),
  advance_paid_amount DECIMAL(10,2) NOT NULL,
  remaining_15_or_65_due_5hrs_prior DECIMAL(10,2) NOT NULL,
  status VARCHAR(40) DEFAULT 'ADVANCE_LOCKED_IN_ESCROW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-Traffic Composite B-Tree & Partial Indexes (Sub-5ms Lookups at 1M+ Rows)
CREATE INDEX IF NOT EXISTS idx_products_category_status ON public.brand_products (category_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_merchants_mandal_active ON public.merchants (mandal, is_active) WHERE is_active = true;

-- High-Speed Cached initPlan RLS Policy
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);