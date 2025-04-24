import { pgTable, serial, text, boolean, timestamp, integer, numeric } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  categoryId: integer('category_id').references(() => categories.id),
  isCombo: boolean('is_combo').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryMethod: text('delivery_method').notNull(), // 'delivery' or 'pickup'
  address: text('address'),
  items: text('items').notNull(), // JSON stringified array of products with quantity
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending'), // 'pending', 'preparing', 'ready', 'delivered', 'cancelled'
  whatsappSent: boolean('whatsapp_sent').default(false),
  printed: boolean('printed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});