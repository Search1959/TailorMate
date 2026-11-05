import React, { useEffect, useState } from 'react';
import { AIBespokeStylistModal } from './components/ai/AIBespokeStylistModal';
import { BillingFinance } from './components/billing/BillingFinance';
import { CustomerCRM } from './components/customers/CustomerCRM';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { Header } from './components/Header';
import { FabricInventory } from './components/inventory/FabricInventory';
import { MeasurementBook } from './components/measurements/MeasurementBook';
import { NewOrderModal } from './components/orders/NewOrderModal';
import { OrderManagement } from './components/orders/OrderManagement';
import { CustomerPortalView } from './components/portal/CustomerPortalView';
import { PrintInvoiceModal } from './components/print/PrintInvoiceModal';
import { PrintJobCardModal } from './components/print/PrintJobCardModal';
import { Sidebar } from './components/Sidebar';
import { WhatsAppAutomationModal } from './components/whatsapp/WhatsAppAutomationModal';
import { WorkshopManagement } from './components/workshop/WorkshopManagement';
import { StorageService } from './services/storage';
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
} from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('stitchmate_dark_mode') === 'true';
  });

  // App navigation state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isCustomerPortalActive, setIsCustomerPortalActive] = useState<boolean>(false);
  const [portalInitialCode, setPortalInitialCode] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Domain data states
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementProfile[]>([]);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [haberdashery, setHaberdashery] = useState<HaberdasheryItem[]>([]);
  const [tailors, setTailors] = useState<TailorStaff[]>([]);

  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [whatsAppModalOrder, setWhatsAppModalOrder] = useState<Order | null>(null);
  const [whatsAppModalCustomer, setWhatsAppModalCustomer] = useState<Customer | null>(null);
  const [printJobCardOrder, setPrintJobCardOrder] = useState<Order | null>(null);
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState<Order | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stitchmate_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stitchmate_dark_mode', 'false');
    }
  }, [darkMode]);

  // Load initial data & URL query params
  useEffect(() => {
    const bizList = StorageService.getBusinesses();
    const curBiz = StorageService.getCurrentBusiness();
    const orderList = StorageService.getOrders();
    const custList = StorageService.getCustomers();
    const measList = StorageService.getMeasurements();
    const fabList = StorageService.getFabrics();
    const habList = StorageService.getHaberdashery();
    const tailorList = StorageService.getTailors();

    setBusinesses(bizList);
    setCurrentBusiness(curBiz);
    setOrders(orderList);
    setCustomers(custList);
    setMeasurements(measList);
    setFabrics(fabList);
    setHaberdashery(habList);
    setTailors(tailorList);

    // Asynchronously synchronize with Cloud SQL PostgreSQL backend
    StorageService.syncFromBackend().then((remoteData) => {
      if (remoteData.businesses) setBusinesses(remoteData.businesses);
      if (remoteData.customers) setCustomers(remoteData.customers);
      if (remoteData.measurements) setMeasurements(remoteData.measurements);
      if (remoteData.orders) setOrders(remoteData.orders);
      if (remoteData.fabrics) setFabrics(remoteData.fabrics);
      if (remoteData.haberdashery) setHaberdashery(remoteData.haberdashery);
      if (remoteData.tailors) setTailors(remoteData.tailors);
    });

    // Check URL parameters for customer tracking link e.g. ?portal=true&code=STM-8491
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portalParam = urlParams.get('portal');
      const codeParam = urlParams.get('code');
      if (portalParam === 'true' || codeParam) {
        setIsCustomerPortalActive(true);
        if (codeParam) {
          setPortalInitialCode(codeParam);
        }
      }
    } catch (err) {
      console.warn('URL parsing notice:', err);
    }
  }, []);

  // Business Switcher
  const handleSelectBusiness = (bizId: string) => {
    StorageService.setCurrentBusinessId(bizId);
    const chosen = businesses.find((b) => b.id === bizId) || businesses[0];
    setCurrentBusiness(chosen);
  };

  // Order Handlers
  const handleSaveOrder = (newOrder: Order) => {
    StorageService.saveOrder(newOrder);
    setOrders(StorageService.getOrders());
    setCustomers(StorageService.getCustomers());

    // Adjust reserved meterage on fabric if applicable
    const item = newOrder.items[0];
    if (item && item.fabricId && item.fabricMetersUsed) {
      const fab = fabrics.find((f) => f.id === item.fabricId);
      if (fab) {
        const updatedFab: Fabric = {
          ...fab,
          reservedMeters: Number((fab.reservedMeters + item.fabricMetersUsed).toFixed(2)),
        };
        StorageService.saveFabric(updatedFab);
        setFabrics(StorageService.getFabrics());
      }
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: ProductionStatus) => {
    StorageService.updateOrderStatus(orderId, status);
    setOrders(StorageService.getOrders());
  };

  const handleAddPayment = (orderId: string, payment: Omit<PaymentRecord, 'id'>) => {
    StorageService.addOrderPayment(orderId, payment);
    setOrders(StorageService.getOrders());
    setCustomers(StorageService.getCustomers());
  };

  // Customer Handlers
  const handleSaveCustomer = (customer: Customer) => {
    StorageService.saveCustomer(customer);
    setCustomers(StorageService.getCustomers());
  };

  // Measurements Handlers
  const handleSaveMeasurement = (profile: MeasurementProfile) => {
    StorageService.saveMeasurement(profile);
    setMeasurements(StorageService.getMeasurements());
  };

  // Fabric Handlers
  const handleSaveFabric = (fab: Fabric) => {
    StorageService.saveFabric(fab);
    setFabrics(StorageService.getFabrics());
  };

  const handleSaveHaberdashery = (item: HaberdasheryItem) => {
    StorageService.saveHaberdashery(item);
    setHaberdashery(StorageService.getHaberdashery());
  };

  // Tailor Handlers
  const handleSaveTailor = (tailor: TailorStaff) => {
    StorageService.saveTailor(tailor);
    setTailors(StorageService.getTailors());
  };

  const handleReassignOrder = (orderId: string, staffId: string, role: 'cutter' | 'tailor') => {
    const order = orders.find((o) => o.id === orderId);
    const staff = tailors.find((t) => t.id === staffId);
    if (!order || !staff) return;

    const updatedOrder: Order = {
      ...order,
      ...(role === 'cutter'
        ? { assignedCutterId: staff.id, assignedCutterName: staff.name }
        : { assignedTailorId: staff.id, assignedTailorName: staff.name }),
    };

    StorageService.saveOrder(updatedOrder);
    setOrders(StorageService.getOrders());
  };

  // Print Handlers
  const handlePrintMeasurementSheet = (profile: MeasurementProfile, cust: Customer) => {
    // Open Job Card modal with matching customer & profile
    const dummyOrder: Order = {
      id: `print_spec_${Date.now()}`,
      orderNumber: `SPEC-${Date.now().toString().slice(-4)}`,
      trackingCode: `SPEC-${Date.now().toString().slice(-4)}`,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerWhatsapp: cust.whatsapp,
      bookingDate: profile.dateRecorded,
      deliveryDate: 'As Scheduled',
      status: 'order_received',
      urgency: 'standard',
      items: [
        {
          id: 'item_dummy',
          garmentType: profile.garmentCategory,
          title: profile.profileName,
          quantity: 1,
          customerFabricProvided: true,
          measurementProfileId: profile.id,
          styleSpecs: {},
          unitStitchingPrice: 0,
          unitFabricPrice: 0,
          subtotal: 0,
        },
      ],
      pricing: {
        stitchingTotal: 0,
        fabricTotal: 0,
        rushSurcharge: 0,
        discountAmount: 0,
        taxableAmount: 0,
        taxAmount: 0,
        grandTotal: 0,
        advancePaid: 0,
        balanceDue: 0,
      },
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPrintJobCardOrder(dummyOrder);
  };

  if (!currentBusiness) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading atelier console...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Sidebar Panel */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentBusiness={currentBusiness}
        businesses={businesses}
        onSelectBusiness={handleSelectBusiness}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
        isCustomerPortalActive={isCustomerPortalActive}
        setIsCustomerPortalActive={setIsCustomerPortalActive}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        orderCount={orders.length}
      />

      {/* Main Workspace Frame (offset by left sidebar) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Contextual Header */}
        <Header
          currentTab={currentTab}
          currentBusiness={currentBusiness}
          isCustomerPortalActive={isCustomerPortalActive}
          setIsCustomerPortalActive={setIsCustomerPortalActive}
          onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
        />

        {/* Main Viewport Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* CUSTOMER PORTAL MODE */}
          {isCustomerPortalActive ? (
          <CustomerPortalView
            orders={orders}
            measurements={measurements}
            business={currentBusiness}
            initialTrackingCode={portalInitialCode}
            onExitPortal={() => setIsCustomerPortalActive(false)}
            onPrintInvoice={(order) => setPrintInvoiceOrder(order)}
            onPrintJobCard={(order) => setPrintJobCardOrder(order)}
          />
        ) : (
          /* ATELIER ERP CONSOLE TABS */
          <>
            {currentTab === 'dashboard' && (
              <DashboardOverview
                orders={orders}
                fabrics={fabrics}
                business={currentBusiness}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onSelectOrder={(order) => setCurrentTab('orders')}
                onOpenWhatsApp={(order) => {
                  setWhatsAppModalOrder(order);
                  setWhatsAppModalCustomer(null);
                }}
                onPrintJobCard={(order) => setPrintJobCardOrder(order)}
                onPrintInvoice={(order) => setPrintInvoiceOrder(order)}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
              />
            )}

            {currentTab === 'orders' && (
              <OrderManagement
                orders={orders}
                business={currentBusiness}
                onUpdateStatus={handleUpdateOrderStatus}
                onSelectOrder={(order) => {
                  // open details
                }}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
                onOpenWhatsApp={(order) => {
                  setWhatsAppModalOrder(order);
                  setWhatsAppModalCustomer(null);
                }}
                onPrintJobCard={(order) => setPrintJobCardOrder(order)}
                onPrintInvoice={(order) => setPrintInvoiceOrder(order)}
                onAddPayment={(order) => {
                  // Trigger payment
                }}
                onOpenPortalForOrder={(trackingCode) => {
                  setPortalInitialCode(trackingCode);
                  setIsCustomerPortalActive(true);
                }}
              />
            )}

            {currentTab === 'measurements' && (
              <MeasurementBook
                customers={customers}
                measurements={measurements}
                onSaveMeasurement={handleSaveMeasurement}
                onPrintMeasurementSheet={handlePrintMeasurementSheet}
              />
            )}

            {currentTab === 'inventory' && (
              <FabricInventory
                fabrics={fabrics}
                haberdashery={haberdashery}
                business={currentBusiness}
                onSaveFabric={handleSaveFabric}
                onSaveHaberdashery={handleSaveHaberdashery}
              />
            )}

            {currentTab === 'workshop' && (
              <WorkshopManagement
                tailors={tailors}
                orders={orders}
                business={currentBusiness}
                onSaveTailor={handleSaveTailor}
                onReassignOrder={handleReassignOrder}
              />
            )}

            {currentTab === 'customers' && (
              <CustomerCRM
                customers={customers}
                orders={orders}
                business={currentBusiness}
                onSaveCustomer={handleSaveCustomer}
                onOpenWhatsApp={(cust) => {
                  setWhatsAppModalCustomer(cust);
                  setWhatsAppModalOrder(null);
                }}
                onSelectCustomerMeasurements={(customerId) => {
                  setCurrentTab('measurements');
                }}
              />
            )}

            {currentTab === 'billing' && (
              <BillingFinance
                orders={orders}
                business={currentBusiness}
                onPrintInvoice={(order) => setPrintInvoiceOrder(order)}
                onOpenWhatsApp={(order) => {
                  setWhatsAppModalOrder(order);
                  setWhatsAppModalCustomer(null);
                }}
                onAddPayment={handleAddPayment}
              />
            )}
          </>
        )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        business={currentBusiness}
        customers={customers}
        fabrics={fabrics}
        tailors={tailors}
        measurements={measurements}
        onSaveOrder={handleSaveOrder}
        onQuickAddCustomer={handleSaveCustomer}
      />

      {/* 2. WhatsApp Automation Modal */}
      <WhatsAppAutomationModal
        isOpen={!!whatsAppModalOrder || !!whatsAppModalCustomer}
        onClose={() => {
          setWhatsAppModalOrder(null);
          setWhatsAppModalCustomer(null);
        }}
        order={whatsAppModalOrder || undefined}
        customer={whatsAppModalCustomer || undefined}
        business={currentBusiness}
      />

      {/* 3. Print Job Card Modal */}
      <PrintJobCardModal
        isOpen={!!printJobCardOrder}
        onClose={() => setPrintJobCardOrder(null)}
        order={printJobCardOrder!}
        customer={customers.find((c) => c.id === printJobCardOrder?.customerId)}
        measurementProfile={measurements.find(
          (m) =>
            m.id === printJobCardOrder?.items[0]?.measurementProfileId ||
            m.customerId === printJobCardOrder?.customerId
        )}
        business={currentBusiness}
      />

      {/* 4. Print Tax Invoice Modal */}
      <PrintInvoiceModal
        isOpen={!!printInvoiceOrder}
        onClose={() => setPrintInvoiceOrder(null)}
        order={printInvoiceOrder!}
        customer={customers.find((c) => c.id === printInvoiceOrder?.customerId)}
        business={currentBusiness}
      />

      {/* 5. AI Bespoke Stylist Modal */}
      <AIBespokeStylistModal
        isOpen={isAiStylistOpen}
        onClose={() => setIsAiStylistOpen(false)}
        business={currentBusiness}
      />
    </div>
  );
}
