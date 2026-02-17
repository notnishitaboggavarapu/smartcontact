
-- Businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active businesses" ON public.businesses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage their businesses" ON public.businesses
  FOR ALL USING (owner_id = auth.uid());

-- Products table
CREATE TABLE public.business_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_min NUMERIC(10,2),
  price_max NUMERIC(10,2),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products" ON public.business_products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Business owners can manage products" ON public.business_products
  FOR ALL USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = business_products.business_id AND businesses.owner_id = auth.uid()));

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Quote requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.business_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  customization_details TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their quote requests" ON public.quote_requests
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Business owners can view their quote requests" ON public.quote_requests
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = quote_requests.business_id AND businesses.owner_id = auth.uid()));

CREATE POLICY "Authenticated users can create quote requests" ON public.quote_requests
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their quote requests" ON public.quote_requests
  FOR UPDATE USING (customer_id = auth.uid());

CREATE POLICY "Business owners can update quote requests" ON public.quote_requests
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = quote_requests.business_id AND businesses.owner_id = auth.uid()));

-- Quote responses table
CREATE TABLE public.quote_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  price_estimate NUMERIC(10,2) NOT NULL,
  message TEXT,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view responses to their quotes" ON public.quote_responses
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.quote_requests WHERE quote_requests.id = quote_responses.quote_request_id AND quote_requests.customer_id = auth.uid()));

CREATE POLICY "Business owners can view their responses" ON public.quote_responses
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = quote_responses.business_id AND businesses.owner_id = auth.uid()));

CREATE POLICY "Business owners can create responses" ON public.quote_responses
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = quote_responses.business_id AND businesses.owner_id = auth.uid()));

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  quote_response_id UUID NOT NULL REFERENCES public.quote_responses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  final_price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their orders" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Business owners can view their orders" ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = orders.business_id AND businesses.owner_id = auth.uid()));

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Business owners can update orders" ON public.orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.businesses WHERE businesses.id = orders.business_id AND businesses.owner_id = auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed demo businesses (owner_id is nullable for demo data)
INSERT INTO public.businesses (name, description, category, address, city, state, latitude, longitude, phone, email) VALUES
  ('PrintMaster Pro', 'Premium printing services for all your business needs', 'Printing', '123 Main St', 'New York', 'NY', 40.7128, -74.0060, '555-0101', 'info@printmaster.com'),
  ('Urban Threads', 'Custom apparel and embroidery specialists', 'Apparel', '456 Fashion Ave', 'Los Angeles', 'CA', 34.0522, -118.2437, '555-0102', 'hello@urbanthreads.com'),
  ('SignCraft Studio', 'Professional signage and banner creation', 'Signage', '789 Design Blvd', 'Chicago', 'IL', 41.8781, -87.6298, '555-0103', 'orders@signcraft.com'),
  ('TeeTime Customs', 'Custom t-shirts and promotional merchandise', 'Apparel', '321 Commerce St', 'Houston', 'TX', 29.7604, -95.3698, '555-0104', 'sales@teetimecustoms.com'),
  ('Digital Press Co', 'High-quality digital and offset printing', 'Printing', '654 Print Lane', 'Phoenix', 'AZ', 33.4484, -112.0740, '555-0105', 'contact@digitalpress.com');

-- Seed products
INSERT INTO public.business_products (business_id, name, description, category, price_min, price_max) VALUES
  ((SELECT id FROM public.businesses WHERE name = 'PrintMaster Pro'), 'Business Cards', 'Premium quality business cards', 'Print', 25.00, 150.00),
  ((SELECT id FROM public.businesses WHERE name = 'PrintMaster Pro'), 'Flyers & Brochures', 'Full color marketing materials', 'Print', 50.00, 500.00),
  ((SELECT id FROM public.businesses WHERE name = 'PrintMaster Pro'), 'Banners', 'Large format banners', 'Print', 75.00, 300.00),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'Custom T-Shirts', 'Screen printed or embroidered t-shirts', 'Apparel', 10.00, 35.00),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'Custom Hoodies', 'Premium custom hoodies', 'Apparel', 25.00, 65.00),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'Embroidered Caps', 'Custom embroidered caps and hats', 'Apparel', 12.00, 30.00),
  ((SELECT id FROM public.businesses WHERE name = 'SignCraft Studio'), 'Vinyl Banners', 'Durable outdoor vinyl banners', 'Signage', 50.00, 400.00),
  ((SELECT id FROM public.businesses WHERE name = 'SignCraft Studio'), 'Vehicle Wraps', 'Full or partial vehicle wraps', 'Signage', 500.00, 3000.00),
  ((SELECT id FROM public.businesses WHERE name = 'TeeTime Customs'), 'Custom T-Shirts', 'Bulk custom t-shirt printing', 'Apparel', 8.00, 25.00),
  ((SELECT id FROM public.businesses WHERE name = 'TeeTime Customs'), 'Promotional Items', 'Mugs, pens, bags and more', 'Promo', 2.00, 50.00),
  ((SELECT id FROM public.businesses WHERE name = 'Digital Press Co'), 'Business Cards', 'Fast turnaround business cards', 'Print', 20.00, 120.00),
  ((SELECT id FROM public.businesses WHERE name = 'Digital Press Co'), 'Posters', 'High quality poster printing', 'Print', 15.00, 200.00);

-- Seed reviews
INSERT INTO public.reviews (business_id, customer_name, rating, comment) VALUES
  ((SELECT id FROM public.businesses WHERE name = 'PrintMaster Pro'), 'Sarah Johnson', 5, 'Excellent quality and fast turnaround!'),
  ((SELECT id FROM public.businesses WHERE name = 'PrintMaster Pro'), 'Mike Chen', 4, 'Great prints, slightly above average pricing'),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'Lisa Park', 5, 'Love the custom hoodies! Perfect for our team'),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'James Wilson', 4, 'Good quality embroidery work'),
  ((SELECT id FROM public.businesses WHERE name = 'Urban Threads'), 'Emma Davis', 5, 'Amazing t-shirt designs, will order again'),
  ((SELECT id FROM public.businesses WHERE name = 'SignCraft Studio'), 'Robert Taylor', 4, 'Professional signage, delivered on time'),
  ((SELECT id FROM public.businesses WHERE name = 'TeeTime Customs'), 'Amanda Brown', 5, 'Best bulk pricing for custom tees!'),
  ((SELECT id FROM public.businesses WHERE name = 'TeeTime Customs'), 'David Kim', 3, 'Decent quality, shipping was slow'),
  ((SELECT id FROM public.businesses WHERE name = 'Digital Press Co'), 'Nicole Martinez', 4, 'Fast digital printing service');
