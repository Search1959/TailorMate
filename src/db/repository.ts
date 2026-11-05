import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import {
  businessProfiles,
  customers,
  fabrics,
  haberdashery,
  measurementProfiles,
  orders,
  tailorStaff,
  users,
} from './schema.ts';
import {
  INITIAL_BUSINESSES,
  INITIAL_CUSTOMERS,
  INITIAL_FABRICS,
  INITIAL_HABERDASHERY,
  INITIAL_MEASUREMENTS,
  INITIAL_ORDERS,
  INITIAL_TAILOR_STAFF,
} from '../data/mockData.ts';
import {
  BusinessProfile,
  Customer,
  Fabric,
  HaberdasheryItem,
  MeasurementProfile,
  Order,
  PaymentRecord,
  ProductionStatus,
  TailorStaff,
} from '../types/index.ts';

export async function seedInitialDataIfEmpty() {
  try {
    const existingBiz = await db.select().from(businessProfiles);
    if (existingBiz.length === 0) {
      console.log('Seeding initial atelier data into Cloud SQL database...');
      // 1. Businesses
      for (const b of INITIAL_BUSINESSES) {
        await db.insert(businessProfiles).values({
          id: b.id,
          name: b.name,
          tagline: b.tagline,
          branch: b.branch,
          address: b.address,
          phone: b.phone,
          whatsapp: b.whatsapp,
          email: b.email,
          currencySymbol: b.currencySymbol,
          taxRatePercent: b.taxRatePercent,
          taxLabel: b.taxLabel,
          taxRegistrationNumber: b.taxRegistrationNumber,
          businessType: b.businessType,
          accentTheme: b.accentTheme,
        }).onConflictDoNothing();
      }

      // 2. Customers
      for (const c of INITIAL_CUSTOMERS) {
        await db.insert(customers).values({
          id: c.id,
          name: c.name,
          phone: c.phone,
          whatsapp: c.whatsapp,
          email: c.email,
          address: c.address,
          avatarUrl: c.avatarUrl,
          birthDate: c.birthDate,
          anniversaryDate: c.anniversaryDate,
          fitPreference: c.fitPreference,
          postureNotes: c.postureNotes,
          vipStatus: c.vipStatus,
          tags: c.tags,
          totalOrdersCount: c.totalOrdersCount,
          totalSpent: c.totalSpent.toString(),
          outstandingBalance: c.outstandingBalance.toString(),
          createdAt: c.createdAt,
          notes: c.notes,
        }).onConflictDoNothing();
      }

      // 3. Fabrics
      for (const f of INITIAL_FABRICS) {
        await db.insert(fabrics).values({
          id: f.id,
          code: f.code,
          name: f.name,
          category: f.category,
          colorName: f.colorName,
          colorHex: f.colorHex,
          pattern: f.pattern,
          millOrBrand: f.millOrBrand,
          pricePerMeter: f.pricePerMeter.toString(),
          costPerMeter: f.costPerMeter.toString(),
          totalStockMeters: f.totalStockMeters.toString(),
          reservedMeters: f.reservedMeters.toString(),
          minStockThreshold: f.minStockThreshold.toString(),
          imageUrl: f.imageUrl,
          supplier: f.supplier,
        }).onConflictDoNothing();
      }

      // 4. Haberdashery
      for (const h of INITIAL_HABERDASHERY) {
        await db.insert(haberdashery).values({
          id: h.id,
          code: h.code,
          name: h.name,
          category: h.category,
          stockQty: h.stockQty.toString(),
          unit: h.unit,
          minThreshold: h.minThreshold.toString(),
          unitCost: h.unitCost.toString(),
        }).onConflictDoNothing();
      }

      // 5. Tailors
      for (const t of INITIAL_TAILOR_STAFF) {
        await db.insert(tailorStaff).values({
          id: t.id,
          name: t.name,
          phone: t.phone,
          role: t.role,
          ratePerPiece: t.ratePerPiece.toString(),
          activeOrdersCount: t.activeOrdersCount,
          completedThisMonth: t.completedThisMonth,
          rating: t.rating.toString(),
          status: t.status,
          avatarUrl: t.avatarUrl,
        }).onConflictDoNothing();
      }

      // 6. Measurements
      for (const m of INITIAL_MEASUREMENTS) {
        await db.insert(measurementProfiles).values({
          id: m.id,
          customerId: m.customerId,
          profileName: m.profileName,
          garmentCategory: m.garmentCategory,
          dateRecorded: m.dateRecorded,
          unit: m.unit,
          measurements: m.measurements,
          postureDetails: m.postureDetails,
          notes: m.notes,
        }).onConflictDoNothing();
      }

      // 7. Orders
      for (const o of INITIAL_ORDERS) {
        await db.insert(orders).values({
          id: o.id,
          orderNumber: o.orderNumber,
          trackingCode: o.trackingCode,
          customerId: o.customerId,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerWhatsapp: o.customerWhatsapp,
          bookingDate: o.bookingDate,
          trialDate: o.trialDate,
          deliveryDate: o.deliveryDate,
          status: o.status,
          urgency: o.urgency,
          items: o.items,
          assignedTailorId: o.assignedTailorId,
          assignedTailorName: o.assignedTailorName,
          assignedCutterId: o.assignedCutterId,
          assignedCutterName: o.assignedCutterName,
          trialFeedback: o.trialFeedback,
          alterationNotes: o.alterationNotes,
          qualityPassed: o.qualityPassed,
          pricing: o.pricing,
          payments: o.payments,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        }).onConflictDoNothing();
      }
      console.log('Seeding completed successfully.');
    }
  } catch (err) {
    console.warn('Seeding check note:', err);
  }
}

// Business Profiles
export async function getBusinessProfiles(): Promise<BusinessProfile[]> {
  try {
    const list = await db.select().from(businessProfiles);
    return list.map((b) => ({
      id: b.id,
      name: b.name,
      tagline: b.tagline || '',
      branch: b.branch || '',
      address: b.address || '',
      phone: b.phone || '',
      whatsapp: b.whatsapp || '',
      email: b.email || '',
      currencySymbol: b.currencySymbol || '₹',
      taxRatePercent: b.taxRatePercent || 12,
      taxLabel: b.taxLabel || 'GST',
      taxRegistrationNumber: b.taxRegistrationNumber || '',
      businessType: (b.businessType as any) || 'mens_tailoring',
      accentTheme: b.accentTheme || 'amber',
    }));
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    throw new Error('Failed to query businesses', { cause: error });
  }
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
  try {
    const list = await db.select().from(customers);
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      whatsapp: c.whatsapp || c.phone,
      email: c.email || '',
      address: c.address || '',
      avatarUrl: c.avatarUrl || undefined,
      birthDate: c.birthDate || undefined,
      anniversaryDate: c.anniversaryDate || undefined,
      fitPreference: (c.fitPreference as any) || 'Contemporary Tailored',
      postureNotes: c.postureNotes || undefined,
      vipStatus: c.vipStatus || false,
      tags: c.tags || [],
      totalOrdersCount: c.totalOrdersCount || 0,
      totalSpent: Number(c.totalSpent || 0),
      outstandingBalance: Number(c.outstandingBalance || 0),
      createdAt: c.createdAt || new Date().toISOString(),
      notes: c.notes || undefined,
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw new Error('Failed to query customers', { cause: error });
  }
}

export async function saveCustomer(c: Customer): Promise<void> {
  try {
    await db.insert(customers).values({
      id: c.id,
      name: c.name,
      phone: c.phone,
      whatsapp: c.whatsapp,
      email: c.email,
      address: c.address,
      avatarUrl: c.avatarUrl,
      birthDate: c.birthDate,
      anniversaryDate: c.anniversaryDate,
      fitPreference: c.fitPreference,
      postureNotes: c.postureNotes,
      vipStatus: c.vipStatus,
      tags: c.tags,
      totalOrdersCount: c.totalOrdersCount,
      totalSpent: c.totalSpent.toString(),
      outstandingBalance: c.outstandingBalance.toString(),
      notes: c.notes,
      createdAt: c.createdAt,
    }).onConflictDoUpdate({
      target: customers.id,
      set: {
        name: c.name,
        phone: c.phone,
        whatsapp: c.whatsapp,
        email: c.email,
        address: c.address,
        avatarUrl: c.avatarUrl,
        birthDate: c.birthDate,
        anniversaryDate: c.anniversaryDate,
        fitPreference: c.fitPreference,
        postureNotes: c.postureNotes,
        vipStatus: c.vipStatus,
        tags: c.tags,
        totalOrdersCount: c.totalOrdersCount,
        totalSpent: c.totalSpent.toString(),
        outstandingBalance: c.outstandingBalance.toString(),
        notes: c.notes,
      },
    });
  } catch (error) {
    console.error('Error saving customer:', error);
    throw new Error('Failed to save customer', { cause: error });
  }
}

// Measurement Profiles
export async function getMeasurements(): Promise<MeasurementProfile[]> {
  try {
    const list = await db.select().from(measurementProfiles);
    return list.map((m) => ({
      id: m.id,
      customerId: m.customerId,
      profileName: m.profileName,
      garmentCategory: m.garmentCategory as any,
      dateRecorded: m.dateRecorded,
      unit: (m.unit as any) || 'inches',
      measurements: m.measurements,
      postureDetails: m.postureDetails || undefined,
      notes: m.notes || undefined,
    }));
  } catch (error) {
    console.error('Error fetching measurements:', error);
    throw new Error('Failed to query measurements', { cause: error });
  }
}

export async function saveMeasurement(m: MeasurementProfile): Promise<void> {
  try {
    await db.insert(measurementProfiles).values({
      id: m.id,
      customerId: m.customerId,
      profileName: m.profileName,
      garmentCategory: m.garmentCategory,
      dateRecorded: m.dateRecorded,
      unit: m.unit,
      measurements: m.measurements,
      postureDetails: m.postureDetails,
      notes: m.notes,
    }).onConflictDoUpdate({
      target: measurementProfiles.id,
      set: {
        profileName: m.profileName,
        garmentCategory: m.garmentCategory,
        dateRecorded: m.dateRecorded,
        unit: m.unit,
        measurements: m.measurements,
        postureDetails: m.postureDetails,
        notes: m.notes,
      },
    });
  } catch (error) {
    console.error('Error saving measurement:', error);
    throw new Error('Failed to save measurement', { cause: error });
  }
}

// Orders
export async function getOrders(): Promise<Order[]> {
  try {
    const list = await db.select().from(orders);
    return list.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      trackingCode: o.trackingCode,
      customerId: o.customerId,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerWhatsapp: o.customerWhatsapp || o.customerPhone,
      bookingDate: o.bookingDate,
      trialDate: o.trialDate || undefined,
      deliveryDate: o.deliveryDate,
      status: o.status as ProductionStatus,
      urgency: (o.urgency as any) || 'standard',
      items: o.items as any,
      assignedTailorId: o.assignedTailorId || undefined,
      assignedTailorName: o.assignedTailorName || undefined,
      assignedCutterId: o.assignedCutterId || undefined,
      assignedCutterName: o.assignedCutterName || undefined,
      trialFeedback: o.trialFeedback || undefined,
      alterationNotes: o.alterationNotes || undefined,
      qualityPassed: o.qualityPassed || false,
      pricing: o.pricing as any,
      payments: o.payments as any,
      notes: o.notes || undefined,
      createdAt: o.createdAt || new Date().toISOString(),
      updatedAt: o.updatedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to query orders', { cause: error });
  }
}

export async function saveOrder(o: Order): Promise<void> {
  try {
    await db.insert(orders).values({
      id: o.id,
      orderNumber: o.orderNumber,
      trackingCode: o.trackingCode,
      customerId: o.customerId,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerWhatsapp: o.customerWhatsapp,
      bookingDate: o.bookingDate,
      trialDate: o.trialDate,
      deliveryDate: o.deliveryDate,
      status: o.status,
      urgency: o.urgency,
      items: o.items,
      assignedTailorId: o.assignedTailorId,
      assignedTailorName: o.assignedTailorName,
      assignedCutterId: o.assignedCutterId,
      assignedCutterName: o.assignedCutterName,
      trialFeedback: o.trialFeedback,
      alterationNotes: o.alterationNotes,
      qualityPassed: o.qualityPassed,
      pricing: o.pricing,
      payments: o.payments,
      notes: o.notes,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }).onConflictDoUpdate({
      target: orders.id,
      set: {
        status: o.status,
        urgency: o.urgency,
        items: o.items,
        assignedTailorId: o.assignedTailorId,
        assignedTailorName: o.assignedTailorName,
        assignedCutterId: o.assignedCutterId,
        assignedCutterName: o.assignedCutterName,
        trialDate: o.trialDate,
        deliveryDate: o.deliveryDate,
        trialFeedback: o.trialFeedback,
        alterationNotes: o.alterationNotes,
        qualityPassed: o.qualityPassed,
        pricing: o.pricing,
        payments: o.payments,
        notes: o.notes,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order', { cause: error });
  }
}

// Fabrics
export async function getFabrics(): Promise<Fabric[]> {
  try {
    const list = await db.select().from(fabrics);
    return list.map((f) => ({
      id: f.id,
      code: f.code,
      name: f.name,
      category: f.category as any,
      colorName: f.colorName,
      colorHex: f.colorHex,
      pattern: f.pattern as any,
      millOrBrand: f.millOrBrand || '',
      pricePerMeter: Number(f.pricePerMeter),
      costPerMeter: Number(f.costPerMeter),
      totalStockMeters: Number(f.totalStockMeters),
      reservedMeters: Number(f.reservedMeters || 0),
      minStockThreshold: Number(f.minStockThreshold || 10),
      imageUrl: f.imageUrl || undefined,
      supplier: f.supplier || '',
    }));
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    throw new Error('Failed to query fabrics', { cause: error });
  }
}

export async function saveFabric(f: Fabric): Promise<void> {
  try {
    await db.insert(fabrics).values({
      id: f.id,
      code: f.code,
      name: f.name,
      category: f.category,
      colorName: f.colorName,
      colorHex: f.colorHex,
      pattern: f.pattern,
      millOrBrand: f.millOrBrand,
      pricePerMeter: f.pricePerMeter.toString(),
      costPerMeter: f.costPerMeter.toString(),
      totalStockMeters: f.totalStockMeters.toString(),
      reservedMeters: f.reservedMeters.toString(),
      minStockThreshold: f.minStockThreshold.toString(),
      imageUrl: f.imageUrl,
      supplier: f.supplier,
    }).onConflictDoUpdate({
      target: fabrics.id,
      set: {
        name: f.name,
        category: f.category,
        colorName: f.colorName,
        colorHex: f.colorHex,
        pricePerMeter: f.pricePerMeter.toString(),
        costPerMeter: f.costPerMeter.toString(),
        totalStockMeters: f.totalStockMeters.toString(),
        reservedMeters: f.reservedMeters.toString(),
        minStockThreshold: f.minStockThreshold.toString(),
      },
    });
  } catch (error) {
    console.error('Error saving fabric:', error);
    throw new Error('Failed to save fabric', { cause: error });
  }
}

// Haberdashery
export async function getHaberdashery(): Promise<HaberdasheryItem[]> {
  try {
    const list = await db.select().from(haberdashery);
    return list.map((h) => ({
      id: h.id,
      code: h.code,
      name: h.name,
      category: h.category as any,
      stockQty: Number(h.stockQty),
      unit: h.unit || 'pcs',
      minThreshold: Number(h.minThreshold || 10),
      unitCost: Number(h.unitCost),
    }));
  } catch (error) {
    console.error('Error fetching haberdashery:', error);
    throw new Error('Failed to query haberdashery', { cause: error });
  }
}

export async function saveHaberdashery(h: HaberdasheryItem): Promise<void> {
  try {
    await db.insert(haberdashery).values({
      id: h.id,
      code: h.code,
      name: h.name,
      category: h.category,
      stockQty: h.stockQty.toString(),
      unit: h.unit,
      minThreshold: h.minThreshold.toString(),
      unitCost: h.unitCost.toString(),
    }).onConflictDoUpdate({
      target: haberdashery.id,
      set: {
        name: h.name,
        stockQty: h.stockQty.toString(),
        minThreshold: h.minThreshold.toString(),
        unitCost: h.unitCost.toString(),
      },
    });
  } catch (error) {
    console.error('Error saving haberdashery:', error);
    throw new Error('Failed to save haberdashery', { cause: error });
  }
}

// Tailors
export async function getTailorStaff(): Promise<TailorStaff[]> {
  try {
    const list = await db.select().from(tailorStaff);
    return list.map((t) => ({
      id: t.id,
      name: t.name,
      phone: t.phone || '',
      role: t.role as any,
      ratePerPiece: Number(t.ratePerPiece),
      activeOrdersCount: t.activeOrdersCount || 0,
      completedThisMonth: t.completedThisMonth || 0,
      rating: Number(t.rating || 5.0),
      status: (t.status as any) || 'available',
      avatarUrl: t.avatarUrl || undefined,
    }));
  } catch (error) {
    console.error('Error fetching tailors:', error);
    throw new Error('Failed to query tailors', { cause: error });
  }
}

export async function saveTailorStaff(t: TailorStaff): Promise<void> {
  try {
    await db.insert(tailorStaff).values({
      id: t.id,
      name: t.name,
      phone: t.phone,
      role: t.role,
      ratePerPiece: t.ratePerPiece.toString(),
      activeOrdersCount: t.activeOrdersCount,
      completedThisMonth: t.completedThisMonth,
      rating: t.rating.toString(),
      status: t.status,
      avatarUrl: t.avatarUrl,
    }).onConflictDoUpdate({
      target: tailorStaff.id,
      set: {
        name: t.name,
        phone: t.phone,
        role: t.role,
        ratePerPiece: t.ratePerPiece.toString(),
        activeOrdersCount: t.activeOrdersCount,
        completedThisMonth: t.completedThisMonth,
        status: t.status,
      },
    });
  } catch (error) {
    console.error('Error saving tailor staff:', error);
    throw new Error('Failed to save tailor staff', { cause: error });
  }
}
