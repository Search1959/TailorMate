import { boolean, integer, jsonb, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const businessProfiles = pgTable('business_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  branch: text('branch'),
  address: text('address'),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  email: text('email'),
  currencySymbol: text('currency_symbol').default('₹'),
  taxRatePercent: integer('tax_rate_percent').default(12),
  taxLabel: text('tax_label').default('GST'),
  taxRegistrationNumber: text('tax_registration_number'),
  businessType: text('business_type').default('mens_tailoring'),
  accentTheme: text('accent_theme').default('amber'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp'),
  email: text('email'),
  address: text('address'),
  avatarUrl: text('avatar_url'),
  birthDate: text('birth_date'),
  anniversaryDate: text('anniversary_date'),
  fitPreference: text('fit_preference').default('Contemporary Tailored'),
  postureNotes: text('posture_notes'),
  vipStatus: boolean('vip_status').default(false),
  tags: jsonb('tags').$type<string[]>().default([]),
  totalOrdersCount: integer('total_orders_count').default(0),
  totalSpent: numeric('total_spent').default('0'),
  outstandingBalance: numeric('outstanding_balance').default('0'),
  notes: text('notes'),
  createdAt: text('created_at'),
});

export const measurementProfiles = pgTable('measurement_profiles', {
  id: text('id').primaryKey(),
  customerId: text('customer_id').notNull(),
  profileName: text('profile_name').notNull(),
  garmentCategory: text('garment_category').notNull(),
  dateRecorded: text('date_recorded').notNull(),
  unit: text('unit').default('inches'),
  measurements: jsonb('measurements').$type<Record<string, number>>().notNull(),
  postureDetails: jsonb('posture_details').$type<Record<string, string>>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  trackingCode: text('tracking_code').notNull().unique(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerWhatsapp: text('customer_whatsapp'),
  bookingDate: text('booking_date').notNull(),
  trialDate: text('trial_date'),
  deliveryDate: text('delivery_date').notNull(),
  status: text('status').notNull(),
  urgency: text('urgency').default('standard'),
  items: jsonb('items').notNull(),
  assignedTailorId: text('assigned_tailor_id'),
  assignedTailorName: text('assigned_tailor_name'),
  assignedCutterId: text('assigned_cutter_id'),
  assignedCutterName: text('assigned_cutter_name'),
  trialFeedback: text('trial_feedback'),
  alterationNotes: text('alteration_notes'),
  qualityPassed: boolean('quality_passed').default(false),
  pricing: jsonb('pricing').notNull(),
  payments: jsonb('payments').notNull(),
  notes: text('notes'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});

export const fabrics = pgTable('fabrics', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  colorName: text('color_name').notNull(),
  colorHex: text('color_hex').notNull(),
  pattern: text('pattern').default('solid'),
  millOrBrand: text('mill_or_brand'),
  pricePerMeter: numeric('price_per_meter').notNull(),
  costPerMeter: numeric('cost_per_meter').notNull(),
  totalStockMeters: numeric('total_stock_meters').notNull(),
  reservedMeters: numeric('reserved_meters').default('0'),
  minStockThreshold: numeric('min_stock_threshold').default('10'),
  imageUrl: text('image_url'),
  supplier: text('supplier'),
});

export const haberdashery = pgTable('haberdashery', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  stockQty: numeric('stock_qty').notNull(),
  unit: text('unit').default('pcs'),
  minThreshold: numeric('min_threshold').default('10'),
  unitCost: numeric('unit_cost').notNull(),
});

export const tailorStaff = pgTable('tailor_staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  role: text('role').notNull(),
  ratePerPiece: numeric('rate_per_piece').notNull(),
  activeOrdersCount: integer('active_orders_count').default(0),
  completedThisMonth: integer('completed_this_month').default(0),
  rating: numeric('rating').default('5.0'),
  status: text('status').default('available'),
  avatarUrl: text('avatar_url'),
});
