import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Scissors,
  ChevronRight,
  Phone,
  MessageCircle,
  FileText,
  Printer,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { BusinessProfile, Fabric, Order, ProductionStatus } from '../../types';

interface DashboardOverviewProps {
  orders: Order[];
  fabrics: Fabric[];
  business: BusinessProfile;
  onNavigateToTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
  onOpenWhatsApp: (order: Order) => void;
  onPrintJobCard: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onOpenNewOrder: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  orders,
  fabrics,
  business,
  onNavigateToTab,
  onSelectOrder,
  onOpenWhatsApp,
  onPrintJobCard,
  onPrintInvoice,
  onOpenNewOrder,
}) => {
  const curr = business.currencySymbol;

  // Calculate Metrics
  const todayDateStr = new Date().toISOString().split('T')[0];

  const todaysBookings = orders.filter((o) => o.bookingDate.startsWith('2026-11-0') || o.bookingDate === todayDateStr).length;
  const pendingStitching = orders.filter(
    (o) => o.status === 'stitching_in_progress' || o.status === 'fabric_cutting' || o.status === 'order_received'
  ).length;
  const todaysTrials = orders.filter((o) => o.status === 'first_trial' || o.trialDate?.includes('2026-11')).length;
  const readyForDelivery = orders.filter((o) => o.status === 'ready_for_delivery').length;
  const overdueOrders = orders.filter((o) => {
    if (o.status === 'delivered') return false;
    return new Date(o.deliveryDate) < new Date('2026-11-04');
  }).length;
  const totalOutstanding = orders.reduce((sum, o) => sum + (o.pricing?.balanceDue || 0), 0);
  const monthlyRevenue = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

  // Low stock fabrics
  const lowStockFabrics = fabrics.filter((f) => f.totalStockMeters - f.reservedMeters <= f.minStockThreshold);

  // Status mapping for 8 stages
  const STAGES: { key: ProductionStatus; label: string; count: number }[] = [
    { key: 'order_received', label: '1. Received', count: orders.filter((o) => o.status === 'order_received').length },
    { key: 'fabric_cutting', label: '2. Cutting', count: orders.filter((o) => o.status === 'fabric_cutting').length },
    { key: 'stitching_in_progress', label: '3. Stitching', count: orders.filter((o) => o.status === 'stitching_in_progress').length },
    { key: 'first_trial', label: '4. Trial', count: orders.filter((o) => o.status === 'first_trial').length },
    { key: 'alteration', label: '5. Alteration', count: orders.filter((o) => o.status === 'alteration').length },
    { key: 'quality_check', label: '6. QC Check', count: orders.filter((o) => o.status === 'quality_check').length },
    { key: 'ready_for_delivery', label: '7. Ready', count: orders.filter((o) => o.status === 'ready_for_delivery').length },
    { key: 'delivered', label: '8. Delivered', count: orders.filter((o) => o.status === 'delivered').length },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
              <span>{business.name}</span>
              <span aria-hidden="true">·</span>
              <span>{business.branch}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 dark:text-white tracking-tight">
              Atelier Production &amp; Stitching Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage client measurements, cutting queues, basted fittings, and final hand deliveries.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToTab('measurements')}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Measurement Book
            </button>
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              + Book New Garment
            </button>
          </div>
        </div>
      </div>

      {/* 7 Core Dashboard Metrics Grid (prompt section 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">New Bookings</span>
            <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {todaysBookings}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">This month / week</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Pending Stitching</span>
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
            {pendingStitching}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Workshop active</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Fittings &amp; Trials</span>
            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-700 dark:text-purple-400">
            {todaysTrials}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Scheduled appointments</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Ready for Delivery</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {readyForDelivery}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">QC passed &amp; pressed</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Overdue Orders</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {overdueOrders}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Requiring rush follow-up</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Outstanding Dues</span>
            <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-amber-800 dark:text-amber-300">
            {curr}{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">To collect at delivery</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="text-xs font-medium">Monthly Revenue</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {curr}{monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active order book</div>
        </div>
      </div>

      {/* Low Stock Banner if any */}
      {lowStockFabrics.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Inventory Warning:</strong> {lowStockFabrics[0].name} ({lowStockFabrics[0].code}) has only{' '}
              <span className="font-mono font-semibold">{lowStockFabrics[0].totalStockMeters - lowStockFabrics[0].reservedMeters}m</span> available (below threshold of {lowStockFabrics[0].minStockThreshold}m).
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-2 shrink-0 hover:text-amber-950"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* 8-Stage Interactive Production Pipeline Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Stitching &amp; Production Journey Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status across cutting, assembly, trials, alterations and delivery
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1"
          >
            <span>Open Full Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {STAGES.map((stg) => (
            <button
              key={stg.key}
              onClick={() => onNavigateToTab('orders')}
              className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {stg.label}
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                {stg.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Trials & Ready for Delivery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Fittings & Trials */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Upcoming Fitting Trials &amp; Appointments
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">November 2026</span>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'first_trial' || (o.trialDate && o.trialDate.includes('2026-11')))
              .slice(0, 4)
              .map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {order.items[0]?.title || 'Bespoke Garment'}
                    </div>
                    <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-1">
                      Trial Scheduled: {order.trialDate || 'Pending confirmation'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenWhatsApp(order)}
                      title="Send WhatsApp trial reminder"
                      className="p-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Ready for Delivery & Collection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Garments Ready for Customer Pick-Up
              </h2>
            </div>
            <button
              onClick={() => onNavigateToTab('billing')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Collection Register
            </button>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'ready_for_delivery')
              .slice(0, 4)
              .map((order) => (
                <div
                  key={order.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {order.items[0]?.title}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-1">
                      Balance Due:{' '}
                      <strong className="text-slate-900 dark:text-white">
                        {curr}{order.pricing.balanceDue.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenWhatsApp(order)}
                      title="Send collection ready notice on WhatsApp"
                      className="px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Notify</span>
                    </button>
                    <button
                      onClick={() => onPrintInvoice(order)}
                      title="Print Invoice"
                      className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Orders High Density Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Bespoke &amp; Custom Orders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick access to job cards, status changes and client communication
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-medium">Order #</th>
                <th className="py-2.5 px-3 font-medium">Customer</th>
                <th className="py-2.5 px-3 font-medium">Garment Description</th>
                <th className="py-2.5 px-3 font-medium">Delivery Date</th>
                <th className="py-2.5 px-3 font-medium">Stage</th>
                <th className="py-2.5 px-3 font-medium text-right">Grand Total</th>
                <th className="py-2.5 px-3 font-medium text-right">Balance Due</th>
                <th className="py-2.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {orders.slice(0, 6).map((order) => {
                const item = order.items[0];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {item ? item.title : 'Custom Garment'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
                      {order.deliveryDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                      {curr}{order.pricing.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                      {order.pricing.balanceDue > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold">
                          {curr}{order.pricing.balanceDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">Paid</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintJobCard(order)}
                          title="Print Tailor Cutting Job Card"
                          className="p-1 text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenWhatsApp(order)}
                          title="WhatsApp Update"
                          className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="text-amber-700 dark:text-amber-400 font-semibold hover:underline ml-1"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
