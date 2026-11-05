import {
  INITIAL_BUSINESSES,
  INITIAL_CUSTOMERS,
  INITIAL_FABRICS,
  INITIAL_HABERDASHERY,
  INITIAL_MEASUREMENTS,
  INITIAL_ORDERS,
  INITIAL_TAILOR_STAFF,
} from '../data/mockData';
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
} from '../types';

const STORAGE_KEYS = {
  BUSINESSES: 'stitchmate_businesses_v1',
  CURRENT_BIZ_ID: 'stitchmate_current_biz_id_v1',
  CUSTOMERS: 'stitchmate_customers_v1',
  MEASUREMENTS: 'stitchmate_measurements_v1',
  ORDERS: 'stitchmate_orders_v1',
  FABRICS: 'stitchmate_fabrics_v1',
  HABERDASHERY: 'stitchmate_haberdashery_v1',
  TAILORS: 'stitchmate_tailors_v1',
  DARK_MODE: 'stitchmate_dark_mode_v1',
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing key ${key} to localStorage:`, err);
  }
}

async function apiPost(endpoint: string, data: any) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn(`Background API sync to ${endpoint} failed, cached locally:`, err);
  }
}

export const StorageService = {
  // Sync remote PostgreSQL database data into client cache
  async syncFromBackend(): Promise<{
    businesses?: BusinessProfile[];
    customers?: Customer[];
    measurements?: MeasurementProfile[];
    orders?: Order[];
    fabrics?: Fabric[];
    haberdashery?: HaberdasheryItem[];
    tailors?: TailorStaff[];
  }> {
    try {
      const [bizRes, custRes, measRes, ordRes, fabRes, habRes, tailRes] = await Promise.allSettled([
        fetch('/api/businesses').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/measurements').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/fabrics').then((r) => r.json()),
        fetch('/api/haberdashery').then((r) => r.json()),
        fetch('/api/tailors').then((r) => r.json()),
      ]);

      const result: any = {};
      if (bizRes.status === 'fulfilled' && Array.isArray(bizRes.value) && bizRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.BUSINESSES, bizRes.value);
        result.businesses = bizRes.value;
      }
      if (custRes.status === 'fulfilled' && Array.isArray(custRes.value) && custRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.CUSTOMERS, custRes.value);
        result.customers = custRes.value;
      }
      if (measRes.status === 'fulfilled' && Array.isArray(measRes.value) && measRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.MEASUREMENTS, measRes.value);
        result.measurements = measRes.value;
      }
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value) && ordRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.ORDERS, ordRes.value);
        result.orders = ordRes.value;
      }
      if (fabRes.status === 'fulfilled' && Array.isArray(fabRes.value) && fabRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.FABRICS, fabRes.value);
        result.fabrics = fabRes.value;
      }
      if (habRes.status === 'fulfilled' && Array.isArray(habRes.value) && habRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.HABERDASHERY, habRes.value);
        result.haberdashery = habRes.value;
      }
      if (tailRes.status === 'fulfilled' && Array.isArray(tailRes.value) && tailRes.value.length > 0) {
        setStorageItem(STORAGE_KEYS.TAILORS, tailRes.value);
        result.tailors = tailRes.value;
      }

      return result;
    } catch (err) {
      console.warn('Backend sync note:', err);
      return {};
    }
  },

  // Businesses
  getBusinesses(): BusinessProfile[] {
    return getStorageItem<BusinessProfile[]>(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  },
  getCurrentBusiness(): BusinessProfile {
    const businesses = this.getBusinesses();
    const currentId = getStorageItem<string>(STORAGE_KEYS.CURRENT_BIZ_ID, INITIAL_BUSINESSES[0].id);
    return businesses.find((b) => b.id === currentId) || businesses[0];
  },
  setCurrentBusinessId(id: string): void {
    setStorageItem(STORAGE_KEYS.CURRENT_BIZ_ID, id);
  },
  updateBusiness(updated: BusinessProfile): void {
    const list = this.getBusinesses().map((b) => (b.id === updated.id ? updated : b));
    setStorageItem(STORAGE_KEYS.BUSINESSES, list);
  },

  // Customers
  getCustomers(): Customer[] {
    return getStorageItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  },
  saveCustomer(customer: Customer): void {
    const list = this.getCustomers();
    const index = list.findIndex((c) => c.id === customer.id);
    if (index >= 0) {
      list[index] = customer;
    } else {
      list.unshift(customer);
    }
    setStorageItem(STORAGE_KEYS.CUSTOMERS, list);
    apiPost('/api/customers', customer);
  },

  // Measurements
  getMeasurements(): MeasurementProfile[] {
    return getStorageItem<MeasurementProfile[]>(STORAGE_KEYS.MEASUREMENTS, INITIAL_MEASUREMENTS);
  },
  getMeasurementsByCustomer(customerId: string): MeasurementProfile[] {
    return this.getMeasurements().filter((m) => m.customerId === customerId);
  },
  saveMeasurement(profile: MeasurementProfile): void {
    const list = this.getMeasurements();
    const index = list.findIndex((m) => m.id === profile.id);
    if (index >= 0) {
      list[index] = profile;
    } else {
      list.unshift(profile);
    }
    setStorageItem(STORAGE_KEYS.MEASUREMENTS, list);
    apiPost('/api/measurements', profile);
  },

  // Orders
  getOrders(): Order[] {
    return getStorageItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(
      (o) =>
        o.id === id ||
        o.trackingCode.toLowerCase() === id.toLowerCase() ||
        o.orderNumber.toLowerCase() === id.toLowerCase()
    );
  },
  saveOrder(order: Order): void {
    const list = this.getOrders();
    const index = list.findIndex((o) => o.id === order.id);
    const updated = { ...order, updatedAt: new Date().toISOString() };
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    setStorageItem(STORAGE_KEYS.ORDERS, list);
    apiPost('/api/orders', updated);

    // Update customer stats
    this.recalculateCustomerStats(order.customerId);
  },
  updateOrderStatus(orderId: string, status: ProductionStatus): Order | undefined {
    const list = this.getOrders();
    const index = list.findIndex((o) => o.id === orderId);
    if (index >= 0) {
      const updated = {
        ...list[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      list[index] = updated;
      setStorageItem(STORAGE_KEYS.ORDERS, list);
      apiPost('/api/orders', updated);
      return updated;
    }
    return undefined;
  },
  addOrderPayment(orderId: string, payment: Omit<PaymentRecord, 'id'>): Order | undefined {
    const list = this.getOrders();
    const index = list.findIndex((o) => o.id === orderId);
    if (index >= 0) {
      const order = list[index];
      const newPayment: PaymentRecord = {
        ...payment,
        id: `pay_${Date.now()}`,
      };
      const updatedPayments = [...order.payments, newPayment];
      const totalAdvance = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      const newBalance = Math.max(0, order.pricing.grandTotal - totalAdvance);

      const updatedOrder: Order = {
        ...order,
        payments: updatedPayments,
        pricing: {
          ...order.pricing,
          advancePaid: totalAdvance,
          balanceDue: newBalance,
        },
        updatedAt: new Date().toISOString(),
      };

      list[index] = updatedOrder;
      setStorageItem(STORAGE_KEYS.ORDERS, list);
      apiPost('/api/orders', updatedOrder);
      this.recalculateCustomerStats(order.customerId);
      return updatedOrder;
    }
    return undefined;
  },

  recalculateCustomerStats(customerId: string): void {
    const orders = this.getOrders().filter((o) => o.customerId === customerId);
    const totalOrdersCount = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.pricing.grandTotal, 0);
    const outstandingBalance = orders.reduce((sum, o) => sum + o.pricing.balanceDue, 0);

    const customer = this.getCustomerById(customerId);
    if (customer) {
      this.saveCustomer({
        ...customer,
        totalOrdersCount,
        totalSpent,
        outstandingBalance,
      });
    }
  },

  // Fabrics & Haberdashery
  getFabrics(): Fabric[] {
    return getStorageItem<Fabric[]>(STORAGE_KEYS.FABRICS, INITIAL_FABRICS);
  },
  saveFabric(fabric: Fabric): void {
    const list = this.getFabrics();
    const index = list.findIndex((f) => f.id === fabric.id);
    if (index >= 0) {
      list[index] = fabric;
    } else {
      list.unshift(fabric);
    }
    setStorageItem(STORAGE_KEYS.FABRICS, list);
    apiPost('/api/fabrics', fabric);
  },
  getHaberdashery(): HaberdasheryItem[] {
    return getStorageItem<HaberdasheryItem[]>(STORAGE_KEYS.HABERDASHERY, INITIAL_HABERDASHERY);
  },
  saveHaberdashery(item: HaberdasheryItem): void {
    const list = this.getHaberdashery();
    const index = list.findIndex((h) => h.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    setStorageItem(STORAGE_KEYS.HABERDASHERY, list);
    apiPost('/api/haberdashery', item);
  },

  // Tailors
  getTailors(): TailorStaff[] {
    return getStorageItem<TailorStaff[]>(STORAGE_KEYS.TAILORS, INITIAL_TAILOR_STAFF);
  },
  saveTailor(tailor: TailorStaff): void {
    const list = this.getTailors();
    const index = list.findIndex((t) => t.id === tailor.id);
    if (index >= 0) {
      list[index] = tailor;
    } else {
      list.unshift(tailor);
    }
    setStorageItem(STORAGE_KEYS.TAILORS, list);
    apiPost('/api/tailors', tailor);
  },

  // Reset to demo defaults
  resetAllToDefaults(): void {
    setStorageItem(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
    setStorageItem(STORAGE_KEYS.CURRENT_BIZ_ID, INITIAL_BUSINESSES[0].id);
    setStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStorageItem(STORAGE_KEYS.MEASUREMENTS, INITIAL_MEASUREMENTS);
    setStorageItem(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStorageItem(STORAGE_KEYS.FABRICS, INITIAL_FABRICS);
    setStorageItem(STORAGE_KEYS.HABERDASHERY, INITIAL_HABERDASHERY);
    setStorageItem(STORAGE_KEYS.TAILORS, INITIAL_TAILOR_STAFF);
  },
};
