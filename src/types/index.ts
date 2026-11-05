export type ProductionStatus =
  | 'order_received'
  | 'fabric_cutting'
  | 'stitching_in_progress'
  | 'first_trial'
  | 'alteration'
  | 'quality_check'
  | 'ready_for_delivery'
  | 'delivered';

export type GarmentCategory =
  | 'suit'
  | 'shirt'
  | 'trouser'
  | 'blazer'
  | 'kurta'
  | 'ladies_blouse'
  | 'ladies_lehenga'
  | 'ladies_dress'
  | 'waistcoat'
  | 'alteration';

export type FitPreference =
  | 'Super Slim'
  | 'Slim Fit'
  | 'Contemporary Tailored'
  | 'Classic Regular'
  | 'Relaxed Draped';

export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  branch: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  currencySymbol: string;
  taxRatePercent: number; // e.g. 5% or 18%
  taxLabel: string; // GST, VAT, Sales Tax
  taxRegistrationNumber: string; // e.g. GSTIN
  businessType: 'mens_tailoring' | 'ladies_boutique' | 'alteration_studio' | 'uniform_factory' | 'luxury_atelier';
  accentTheme: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city?: string;
  avatarUrl?: string;
  birthDate?: string;
  anniversaryDate?: string;
  fitPreference: FitPreference;
  postureNotes?: string;
  vipStatus: boolean;
  tags: string[];
  totalOrdersCount: number;
  totalSpent: number;
  outstandingBalance: number;
  createdAt: string;
  notes?: string;
}

export interface MeasurementField {
  key: string;
  label: string;
  hint: string;
  defaultValue?: number;
  unit: 'inches' | 'cm';
}

export interface MeasurementProfile {
  id: string;
  customerId: string;
  profileName: string; // e.g. "Formal Tuxedo Fit 2026"
  garmentCategory: GarmentCategory;
  dateRecorded: string;
  unit: 'inches' | 'cm';
  measurements: Record<string, number>;
  postureDetails?: {
    shoulderSlope?: string;
    stomachType?: string;
    stance?: string;
    armAdjustment?: string;
  };
  notes?: string;
}

export interface StyleSpecifications {
  collarType?: string; // French spread, Cutaway, Band, Button-down
  collars?: string;
  cuffType?: string; // Double French, Single barrel, Neapolitan
  lapelType?: string; // Notch, Peak, Shawl, Mandarin
  ventType?: string; // Double side vents, Center vent, No vent
  vents?: string;
  pocketType?: string; // Flap, Jetted, Patch, Ticket pocket
  pockets?: string;
  liningType?: string; // Full Cupro, Half-lined, Unconstructed, Silk contrast
  linings?: string;
  buttonType?: string; // Genuine horn, Mother of pearl, Corozo, Metal blazer
  buttons?: string;
  monogramText?: string;
  customNotes?: string;
}

export interface OrderItem {
  id: string;
  garmentType: GarmentCategory;
  title: string;
  quantity: number;
  fabricId?: string;
  fabricName?: string;
  fabricMetersUsed?: number;
  customerFabricProvided: boolean;
  measurementProfileId?: string;
  styleSpecs: StyleSpecifications;
  unitStitchingPrice: number;
  unitFabricPrice: number;
  subtotal: number;
  referenceImageUrl?: string;
  specialInstructions?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'upi' | 'card' | 'bank_transfer';
  receiptNo: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ORD-8492"
  trackingCode: string; // e.g. "STM-8492"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  bookingDate: string;
  trialDate?: string;
  deliveryDate: string;
  status: ProductionStatus;
  urgency: 'standard' | 'express' | 'super_rush';
  items: OrderItem[];
  assignedTailorId?: string;
  assignedTailorName?: string;
  assignedCutterId?: string;
  assignedCutterName?: string;
  trialFeedback?: string;
  alterationNotes?: string;
  qualityPassed?: boolean;
  notes?: string;
  pricing: {
    stitchingTotal: number;
    fabricTotal: number;
    rushSurcharge: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    grandTotal: number;
    advancePaid: number;
    balanceDue: number;
  };
  payments: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface Fabric {
  id: string;
  code: string; // e.g. "FAB-WOL-102"
  fabricCode?: string;
  name: string;
  category: 'wool' | 'cotton' | 'linen' | 'silk' | 'tweed' | 'velvet' | 'brocade';
  type?: string;
  brand?: string;
  colorName: string;
  colorHex: string;
  color?: string;
  pattern: 'solid' | 'pinstripe' | 'glen_plaid' | 'herringbone' | 'jacquard' | 'check';
  millOrBrand: string;
  mill?: string;
  composition?: string;
  pricePerMeter: number;
  costPerMeter: number;
  totalStockMeters: number;
  reservedMeters: number;
  minStockThreshold: number;
  rollLocation?: string;
  imageUrl?: string;
  supplier: string;
  supplierName?: string;
}

export interface HaberdasheryItem {
  id: string;
  code: string;
  sku?: string;
  name: string;
  category: 'buttons' | 'zippers' | 'linings' | 'threads' | 'canvas' | 'shoulder_pads';
  stockQty: number;
  unit: string;
  minThreshold: number;
  unitCost: number;
  costPerUnit?: number;
}

export interface TailorStaff {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'master_cutter' | 'coat_tailor' | 'trouser_tailor' | 'shirt_specialist' | 'ladies_couturier' | 'finisher_presser' | 'master_tailor' | 'cutter' | 'coat_maker' | 'trouser_maker' | 'finisher' | 'alteration_specialist';
  ratePerPiece: number;
  activeOrdersCount: number;
  completedThisMonth: number;
  rating: number;
  status: 'available' | 'busy' | 'on_leave' | 'active' | 'inactive';
  avatarUrl?: string;
  specialization?: string[];
  emergencyContact?: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  purpose: string;
  messageContent: (params: {
    customerName: string;
    orderNumber: string;
    garment: string;
    date?: string;
    balance?: number;
    shopName: string;
    trackingUrl: string;
  }) => string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'tailor' | 'customer';
  roleTitle: string;
  avatarUrl?: string;
  isDemoUser: boolean;
  tailorStaffId?: string;
  customerTrackingCode?: string;
}
