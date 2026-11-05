import React, { useState } from 'react';
import {
  Search,
  Filter,
  Columns3,
  List,
  Plus,
  ArrowRight,
  MessageCircle,
  FileText,
  Printer,
  Calendar,
  CheckCircle,
  User,
  Scissors,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { BusinessProfile, Order, ProductionStatus } from '../../types';

interface OrderManagementProps {
  orders: Order[];
  business: BusinessProfile;
  onUpdateStatus: (orderId: string, status: ProductionStatus) => void;
  onSelectOrder: (order: Order) => void;
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
  onOpenNewOrder: () => void;
  onOpenWhatsApp: (order: Order) => void;
  onPrintJobCard: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onAddPayment: (order: Order) => void;
  onOpenPortalForOrder: (trackingCode: string) => void;
}

const STAGES: {
  key: ProductionStatus;
  title: string;
  step: number;
  description: string;
  headerTheme: string;
  cardBorder: string;
  accentColor: string;
}[] = [
  {
    key: 'order_received',
    title: 'Order Received',
    step: 1,
    description: 'Booking confirmed & advance logged',
    headerTheme: 'bg-gradient-to-r from-blue-600/15 via-blue-500/10 to-transparent border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    cardBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
    accentColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    key: 'fabric_cutting',
    title: 'Fabric Cutting',
    step: 2,
    description: 'Fabric allocated & shears in action',
    headerTheme: 'bg-gradient-to-r from-amber-600/15 via-amber-500/10 to-transparent border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    cardBorder: 'hover:border-amber-400 dark:hover:border-amber-500',
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'stitching_in_progress',
    title: 'Stitching in Progress',
    step: 3,
    description: 'Artisan tailor assembly & sewing',
    headerTheme: 'bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-transparent border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-200',
    cardBorder: 'hover:border-purple-400 dark:hover:border-purple-500',
    accentColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    key: 'first_trial',
    title: 'Ready for Trial',
    step: 4,
    description: 'Basted fitting with customer',
    headerTheme: 'bg-gradient-to-r from-cyan-600/15 via-cyan-500/10 to-transparent border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200',
    cardBorder: 'hover:border-cyan-400 dark:hover:border-cyan-500',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    key: 'alteration',
    title: 'Alterations Underway',
    step: 5,
    description: 'Post-fitting precision adjustments',
    headerTheme: 'bg-gradient-to-r from-rose-600/15 via-rose-500/10 to-transparent border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
    cardBorder: 'hover:border-rose-400 dark:hover:border-rose-500',
    accentColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    key: 'quality_check',
    title: 'Quality Check & Press',
    step: 6,
    description: '14-point inspection & steam press',
    headerTheme: 'bg-gradient-to-r from-yellow-600/15 via-yellow-500/10 to-transparent border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200',
    cardBorder: 'hover:border-yellow-400 dark:hover:border-yellow-500',
    accentColor: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    key: 'ready_for_delivery',
    title: 'Ready for Collection',
    step: 7,
    description: 'Customer notified on WhatsApp',
    headerTheme: 'bg-gradient-to-r from-emerald-600/15 via-emerald-500/10 to-transparent border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
    cardBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'delivered',
    title: 'Delivered & Settled',
    step: 8,
    description: 'Balance collected & handed over',
    headerTheme: 'bg-gradient-to-r from-slate-600/15 via-slate-500/10 to-transparent border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200',
    cardBorder: 'hover:border-slate-400 dark:hover:border-slate-500',
    accentColor: 'text-slate-600 dark:text-slate-400',
  },
];

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  business,
  onUpdateStatus,
  onSelectOrder,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onOpenNewOrder,
  onOpenWhatsApp,
  onPrintJobCard,
  onPrintInvoice,
  onAddPayment,
  onOpenPortalForOrder,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  const curr = business.currencySymbol;

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.items.some((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = stageFilter === 'all' || order.status === stageFilter;
    const matchesUrgency = urgencyFilter === 'all' || order.urgency === urgencyFilter;

    return matchesSearch && matchesStage && matchesUrgency;
  });

  const getNextStage = (current: ProductionStatus): ProductionStatus | null => {
    // Normalization check for legacy keys
    const norm = current === ('stitching_in_progress' as any) ? 'stitching' : current === ('first_trial' as any) ? 'trial_ready' : current === ('ready_for_delivery' as any) ? 'ready_delivery' : current;
    const index = STAGES.findIndex((s) => s.key === norm);
    if (index >= 0 && index < STAGES.length - 1) {
      return STAGES[index + 1].key;
    }
    return null;
  };

  const getPrevStage = (current: ProductionStatus): ProductionStatus | null => {
    const norm = current === ('stitching_in_progress' as any) ? 'stitching' : current === ('first_trial' as any) ? 'trial_ready' : current === ('ready_for_delivery' as any) ? 'ready_delivery' : current;
    const index = STAGES.findIndex((s) => s.key === norm);
    if (index > 0) {
      return STAGES[index - 1].key;
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            Production &amp; Stitching Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time pipeline across fabric cutting, tailoring assembly, fittings, and deliveries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'kanban'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Pipeline View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by number, client, phone or garment title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Stages ({orders.length})</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title}
              </option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Urgency</option>
            <option value="standard">Standard</option>
            <option value="rush">Rush</option>
            <option value="super_rush">Super Rush VIP ⚡</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        /* COLORFUL KANBAN PIPELINE VIEW */
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 min-w-full items-start">
            {STAGES.map((stage) => {
              const stageOrders = filteredOrders.filter((o) => o.status === stage.key);

              return (
                <div
                  key={stage.key}
                  className="w-80 shrink-0 bg-slate-100/70 dark:bg-slate-900/60 border-2 border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col max-h-[calc(100vh-230px)] shadow-xs"
                >
                  {/* Column Header with distinctive gradient */}
                  <div
                    className={`p-3.5 border-b rounded-t-2xl flex items-center justify-between ${stage.headerTheme}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/80 dark:bg-slate-900/80 text-[11px] font-bold flex items-center justify-center shadow-2xs font-mono">
                        {stage.step}
                      </span>
                      <div>
                        <h3 className="text-xs font-bold leading-tight">{stage.title}</h3>
                        <p className="text-[10px] opacity-80 truncate">{stage.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xs">
                      {stageOrders.length}
                    </span>
                  </div>

                  {/* Column Body Cards */}
                  <div className="p-2.5 space-y-3 overflow-y-auto flex-1">
                    {stageOrders.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-600 italic">
                        No garments in this queue
                      </div>
                    ) : (
                      stageOrders.map((order) => {
                        const nextStage = getNextStage(order.status);
                        const prevStage = getPrevStage(order.status);
                        const item = order.items[0];

                        return (
                          <div
                            key={order.id}
                            className={`bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 shadow-xs transition-all space-y-2.5 hover:shadow-md ${stage.cardBorder}`}
                          >
                            {/* Card Top: Order Number & Urgency Badge */}
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                                {order.orderNumber}
                              </span>
                              {order.urgency === 'super_rush' && (
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-800 flex items-center gap-0.5">
                                  Super Rush ⚡
                                </span>
                              )}
                              {order.urgency === 'express' && (
                                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded-full border border-orange-300 dark:border-orange-800">
                                  Express (+15%)
                                </span>
                              )}
                            </div>

                            {/* Client & Item Details */}
                            <div>
                              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                                <span className="truncate">{order.customerName}</span>
                                <span className="text-[10px] text-slate-400 font-mono font-normal">
                                  {order.customerPhone}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1 mt-0.5">
                                {item?.title || 'Bespoke Garment Commission'}
                              </div>
                            </div>

                            {/* Schedule & Artisan */}
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                              <span className="truncate">
                                {order.assignedTailorName
                                  ? `Tailor: ${order.assignedTailorName.split(' ')[0]}`
                                  : order.assignedCutterName
                                  ? `Cutter: ${order.assignedCutterName.split(' ')[0]}`
                                  : 'Artisan: Unassigned'}
                              </span>
                              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 shrink-0 font-semibold">
                                Del: {order.deliveryDate.slice(5)}
                              </span>
                            </div>

                            {/* Pricing & Balance Due */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block leading-tight">Total</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                  {curr}{order.pricing.grandTotal.toLocaleString()}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block leading-tight">Balance</span>
                                <span
                                  className={`font-mono font-bold ${
                                    order.pricing.balanceDue > 0
                                      ? 'text-amber-700 dark:text-amber-400'
                                      : 'text-emerald-700 dark:text-emerald-400'
                                  }`}
                                >
                                  {order.pricing.balanceDue > 0
                                    ? `${curr}${order.pricing.balanceDue.toLocaleString()}`
                                    : 'Paid Full'}
                                </span>
                              </div>
                            </div>

                            {/* PROMINENT VIEW / EDIT / DELETE ACTION BUTTONS ROW */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleView(order)}
                                  title="View Full Order"
                                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 dark:border-blue-900"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View</span>
                                </button>
                                <button
                                  onClick={() => handleEdit(order)}
                                  title="Edit Order"
                                  className="p-1 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md transition-colors border border-amber-200 dark:border-amber-900"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDelete(order)}
                                  title="Delete Order"
                                  className="p-1 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-md transition-colors border border-rose-200 dark:border-rose-900"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onOpenWhatsApp(order)}
                                  title="WhatsApp Client Update"
                                  className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                {nextStage && (
                                  <button
                                    onClick={() => onUpdateStatus(order.id, nextStage)}
                                    title={`Advance to ${nextStage.replace(/_/g, ' ')}`}
                                    className="px-2 py-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-amber-600 dark:bg-slate-700 dark:hover:bg-amber-600 rounded-md flex items-center gap-1 transition-colors shadow-2xs"
                                  >
                                    <span>Advance</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* COLORFUL LIST VIEW WITH VIEW, EDIT, DELETE BUTTONS */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3 font-semibold">Order / Code</th>
                  <th className="py-3 px-3 font-semibold">Customer</th>
                  <th className="py-3 px-3 font-semibold">Garment Title</th>
                  <th className="py-3 px-3 font-semibold">Staff Assigned</th>
                  <th className="py-3 px-3 font-semibold">Trial Date</th>
                  <th className="py-3 px-3 font-semibold">Delivery Date</th>
                  <th className="py-3 px-3 font-semibold">Status Stage</th>
                  <th className="py-3 px-3 font-semibold text-right">Balance Due</th>
                  <th className="py-3 px-3 font-semibold text-center">Manage &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => {
                  const item = order.items[0];
                  const nextStage = getNextStage(order.status);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                          {order.orderNumber}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{order.trackingCode}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate font-medium">
                        {item?.title || 'Bespoke Garment'}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                        {order.assignedTailorName || order.assignedCutterName || 'Unassigned'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {order.trialDate || '—'}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        {order.deliveryDate}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 capitalize">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {order.pricing.balanceDue > 0 ? (
                          <span className="text-amber-700 dark:text-amber-400 font-bold">
                            {curr}{order.pricing.balanceDue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Paid</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
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
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-900"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(order)}
                            title="Delete Order"
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintJobCard(order)}
                            title="Print Spec Card"
                            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenWhatsApp(order)}
                            title="WhatsApp Update"
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
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
      )}
    </div>
  );
};
