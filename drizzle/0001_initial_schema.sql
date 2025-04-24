CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" NUMERIC(10, 2) NOT NULL,
  "image_url" TEXT,
  "category_id" INTEGER REFERENCES "categories"("id"),
  "is_combo" BOOLEAN DEFAULT FALSE,
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "customer_name" TEXT NOT NULL,
  "customer_phone" TEXT NOT NULL,
  "delivery_method" TEXT NOT NULL, -- 'delivery' or 'pickup'
  "address" TEXT,
  "items" TEXT NOT NULL, -- JSON stringified array of products with quantity
  "total_amount" NUMERIC(10, 2) NOT NULL,
  "status" TEXT DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'delivered', 'cancelled'
  "whatsapp_sent" BOOLEAN DEFAULT FALSE,
  "printed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO "categories" ("name") VALUES 
  ('Hambúrgueres'), 
  ('Combos'),
  ('Acompanhamentos'),
  ('Bebidas') 
ON CONFLICT DO NOTHING;