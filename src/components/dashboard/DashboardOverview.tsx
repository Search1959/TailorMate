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
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { BusinessProfile, Fabric, Order, ProductionStatus } from '../../types';

interface DashboardOverviewProps {
  orders: Order[];
  fabrics: Fabric[];
  business: BusinessProfile;
  onNavigateToTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
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
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onOpenWhatsApp,
  onPrintJobCard,
  onPrintInvoice,
  onOpenNewOrder,
}) => {
  const curr = business.currencySymbol;

  // View fallback
  const handleView = (order: Order) => {
    if (onViewOrder) onViewOrder(order);
    else onSelectOrder(order);
  };

  const handleEdit = (order: Order) => {
    if (onEditOrder) onEditOrder(order);
    else onSelectOrder(order);
  };

  const handleDelete = (order: Order) => {
    if (onDeleteOrder) onDeleteOrder(order);
  };

  // Metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysBookings = orders.filter(
    (o) => o.bookingDate.startsWith('2026-11-0') || o.bookingDate === todayDateStr
  ).length;
  const pendingStitching = orders.filter(
    (o) =>
      o.status === 'stitching_in_progress' ||
      o.status === 'fabric_cutting' ||
      o.status === 'order_received'
  ).length;
  const todaysTrials = orders.filter(
    (o) => o.status === 'first_trial' || o.trialDate?.includes('2026-11')
  ).length;
  const readyForDelivery = orders.filter((o) => o.status === 'ready_for_delivery').length;
  const overdueOrders = orders.filter((o) => {
    if (o.status === 'delivered') return false;
    return new Date(o.deliveryDate) < new Date('2026-11-04');
  }).length;
  const totalOutstanding = orders.reduce((sum, o) => sum + (o.pricing?.balanceDue || 0), 0);
  const monthlyRevenue = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);

  // Low stock fabrics
  const lowStockFabrics = fabrics.filter(
    (f) => f.totalStockMeters - f.reservedMeters <= f.minStockThreshold
  );

  // 8 stages with vivid color schemes
  const STAGES: {
    key: ProductionStatus;
    label: string;
    count: number;
    colorClasses: string;
    bgPill: string;
  }[] = [
    {
      key: 'order_received',
      label: '1. Received',
      count: orders.filter((o) => o.status === 'order_received').length,
      colorClasses: 'border-blue-400 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
      bgPill: 'bg-blue-600 text-white',
    },
    {
      key: 'fabric_cutting',
      label: '2. Cutting',
      count: orders.filter((o) => o.status === 'fabric_cutting').length,
      colorClasses: 'border-amber-400 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
      bgPill: 'bg-amber-600 text-white',
    },
    {
      key: 'stitching_in_progress',
      label: '3. Stitching',
      count: orders.filter((o) => o.status === 'stitching_in_progress').length,
      colorClasses: 'border-purple-400 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
      bgPill: 'bg-purple-600 text-white',
    },
    {
      key: 'first_trial',
      label: '4. Trial',
      count: orders.filter((o) => o.status === 'first_trial').length,
      colorClasses: 'border-cyan-400 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300',
      bgPill: 'bg-cyan-600 text-white',
    },
    {
      key: 'alteration',
      label: '5. Alteration',
      count: orders.filter((o) => o.status === 'alteration').length,
      colorClasses: 'border-rose-400 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
      bgPill: 'bg-rose-600 text-white',
    },
    {
      key: 'quality_check',
      label: '6. QC Check',
      count: orders.filter((o) => o.status === 'quality_check').length,
      colorClasses: 'border-yellow-400 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300',
      bgPill: 'bg-yellow-600 text-white',
    },
    {
      key: 'ready_for_delivery',
      label: '7. Ready',
      count: orders.filter((o) => o.status === 'ready_for_delivery').length,
      colorClasses: 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
      bgPill: 'bg-emerald-600 text-white',
    },
    {
      key: 'delivered',
      label: '8. Delivered',
      count: orders.filter((o) => o.status === 'delivered').length,
      colorClasses: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300',
      bgPill: 'bg-slate-600 text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Banner with rich gold-amber gradient */}
      <div className="bg-gradient-to-r from-amber-600/15 via-orange-500/10 to-amber-500/5 dark:from-amber-950/50 dark:via-orange-950/30 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-800/70 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <span className="bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                {business.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{business.branch}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-950 dark:text-white tracking-tight">
              Atelier Production &amp; Stitching Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Manage client measurements, cutting queues, basted fittings, alterations, and deliveries in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToTab('measurements')}
              className="px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 rounded-xl transition-all shadow-xs whitespace-nowrap"
            >
              Measurement Book
            </button>
            <button
              onClick={onOpenNewOrder}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md transition-all whitespace-nowrap"
            >
              + Book New Garment
            </button>
          </div>
        </div>
      </div>

      {/* 7 Colorful Dashboard Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. New Bookings (Blue Gradient) */}
        <div className="bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-white dark:to-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 shadow-xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-1.5">
            <span className="text-xs font-bold">New Bookings</span>
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-blue-950 dark:text-blue-100">
            {todaysBookings}
          </div>
          <div className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">This month / week</div>
        </div>

        {/* 2. Pending Stitching (Amber Gradient) */}
        <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 shadow-xs hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-1.5">
            <span className="text-xs font-bold">Pending Stitching</span>
            <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-950 dark:text-amber-100">
            {pendingStitching}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">Workshop active</div>
        </div>

        {/* 3. Fittings & Trials (Purple Gradient) */}
        <div className="bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-white dark:to-slate-900 border-2 border-purple-200 dark:border-purple-900/60 rounded-xl p-3.5 shadow-xs hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 mb-1.5">
            <span className="text-xs font-bold">Fittings &amp; Trials</span>
            <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-purple-950 dark:text-purple-100">
            {todaysTrials}
          </div>
          <div className="text-[11px] text-purple-600/80 dark:text-purple-400/80 mt-1 font-medium">Scheduled trials</div>
        </div>

        {/* 4. Ready for Delivery (Emerald Gradient) */}
        <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-white dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-xl p-3.5 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 mb-1.5">
            <span className="text-xs font-bold">Ready Delivery</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-950 dark:text-emerald-100">
            {readyForDelivery}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">QC passed &amp; ready</div>
        </div>

        {/* 5. Overdue Orders (Rose Gradient) */}
        <div className="bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-white dark:to-slate-900 border-2 border-rose-200 dark:border-rose-900/60 rounded-xl p-3.5 shadow-xs hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400 mb-1.5">
            <span className="text-xs font-bold">Overdue Orders</span>
            <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-950 dark:text-rose-100">
            {overdueOrders}
          </div>
          <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1 font-medium">Rush follow-up</div>
        </div>

        {/* 6. Outstanding Dues (Orange Gradient) */}
        <div className="bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-white dark:to-slate-900 border-2 border-orange-200 dark:border-orange-900/60 rounded-xl p-3.5 shadow-xs hover:border-orange-400 transition-all">
          <div className="flex items-center justify-between text-orange-700 dark:text-orange-400 mb-1.5">
            <span className="text-xs font-bold">Outstanding</span>
            <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-orange-950 dark:text-orange-100">
            {curr}{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-orange-600/80 dark:text-orange-400/80 mt-1 font-medium">To collect at delivery</div>
        </div>

        {/* 7. Monthly Revenue (Violet Gradient) */}
        <div className="bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-white dark:to-slate-900 border-2 border-violet-200 dark:border-violet-900/60 rounded-xl p-3.5 shadow-xs hover:border-violet-400 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-violet-700 dark:text-violet-400 mb-1.5">
            <span className="text-xs font-bold">Total Revenue</span>
            <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-violet-950 dark:text-violet-100">
            {curr}{monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-violet-600/80 dark:text-violet-400/80 mt-1 font-medium">Active order book</div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockFabrics.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-rose-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Inventory Notice:</strong> {lowStockFabrics[0].name} ({lowStockFabrics[0].fabricCode}) has only{' '}
              <span className="font-mono font-bold">{lowStockFabrics[0].totalStockMeters - lowStockFabrics[0].reservedMeters}m</span> available (below threshold of {lowStockFabrics[0].minStockThreshold}m).
            </span>
          </div>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs transition-colors shrink-0"
          >
            Manage Fabric Stock
          </button>
        </div>
      )}

      {/* 8-Stage Interactive Production Pipeline Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Stitching &amp; Production Journey Pipeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status across cutting, assembly, trials, alterations and delivery
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Open Full Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {STAGES.map((stg) => (
            <button
              key={stg.key}
              onClick={() => onNavigateToTab('orders')}
              className={`text-left p-3 rounded-xl border-2 transition-all hover:scale-[1.02] shadow-2xs group ${stg.colorClasses}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold truncate">{stg.label}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${stg.bgPill}`}>
                  {stg.count}
                </span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums mt-1.5">
                {stg.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Trials & Ready for Delivery with Colorful Cards & View/Edit/Delete */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Fittings & Trials */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upcoming Fitting Trials
                </h2>
                <p className="text-[11px] text-slate-500">Scheduled basted fitting sessions</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
              Active Trials
            </span>
          </div>

          <div className="space-y-3">
            {orders
              .filter(
                (o) =>
                  o.status === 'first_trial' ||
                  (o.trialDate && o.trialDate.includes('2026-11'))
              )
              .slice(0, 4)
              .map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border-2 border-purple-100 dark:border-purple-950/80 bg-gradient-to-r from-purple-500/5 to-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-purple-700 dark:text-purple-400 font-mono font-bold bg-purple-100 dark:bg-purple-950/80 px-1.5 py-0.2 rounded">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {order.items[0]?.title || 'Bespoke Garment'}
                    </div>
                    <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Trial Date: {order.trialDate || 'Pending confirmation'}</span>
                    </div>
                  </div>

                  {/* Actions: View, Edit, Delete, WhatsApp */}
                  <div className="flex items-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-100 dark:border-purple-950">
                    <button
                      onClick={() => handleView(order)}
                      title="View Details"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(order)}
                      title="Edit Order"
                      className="p-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      title="Delete Order"
                      className="p-1.5 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenWhatsApp(order)}
                      title="Send WhatsApp trial reminder"
                      className="p-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-900"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Ready for Delivery & Collection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Ready for Customer Pick-Up
                </h2>
                <p className="text-[11px] text-slate-500">QC inspected &amp; steam pressed</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('billing')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
            >
              Collection Register →
            </button>
          </div>

          <div className="space-y-3">
            {orders
              .filter((o) => o.status === 'ready_for_delivery')
              .slice(0, 4)
              .map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border-2 border-emerald-100 dark:border-emerald-950/80 bg-gradient-to-r from-emerald-500/5 to-transparent hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                      {order.items[0]?.title}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-1">
                      Balance Due:{' '}
                      <strong className="text-amber-700 dark:text-amber-400 font-bold">
                        {curr}{order.pricing.balanceDue.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Actions: View, Edit, Delete, Invoice, Notify */}
                  <div className="flex items-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-100 dark:border-emerald-950">
                    <button
                      onClick={() => handleView(order)}
                      title="View Details"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(order)}
                      title="Edit Order"
                      className="p-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-900"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      title="Delete Order"
                      className="p-1.5 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenWhatsApp(order)}
                      title="Send collection ready notice on WhatsApp"
                      className="px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors border border-emerald-300 dark:border-emerald-800"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Notify</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Orders High Density Table with View, Edit, Delete Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Bespoke &amp; Custom Orders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct access to View, Edit, Delete, cutting job cards, and client communication
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Orders ({orders.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="py-2.5 px-3 font-semibold">Order #</th>
                <th className="py-2.5 px-3 font-semibold">Customer</th>
                <th className="py-2.5 px-3 font-semibold">Garment Description</th>
                <th className="py-2.5 px-3 font-semibold">Delivery Date</th>
                <th className="py-2.5 px-3 font-semibold">Stage</th>
                <th className="py-2.5 px-3 font-semibold text-right">Grand Total</th>
                <th className="py-2.5 px-3 font-semibold text-right">Balance Due</th>
                <th className="py-2.5 px-3 font-semibold text-center">Manage &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
              {orders.slice(0, 8).map((order) => {
                const item = order.items[0];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {item ? item.title : 'Custom Garment'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
                      {order.deliveryDate}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 capitalize">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {curr}{order.pricing.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                      {order.pricing.balanceDue > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400 font-bold">
                          {curr}{order.pricing.balanceDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Paid</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleView(order)}
                          title="View Order"
                          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          title="Edit Order"
                          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-900"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(order)}
                          title="Delete Order"
                          className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onPrintJobCard(order)}
                          title="Print Job Card"
                          className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenWhatsApp(order)}
                          title="WhatsApp Update"
                          className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
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
