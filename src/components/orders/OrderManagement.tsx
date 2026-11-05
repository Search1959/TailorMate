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
} from 'lucide-react';
import { BusinessProfile, Order, ProductionStatus } from '../../types';

interface OrderManagementProps {
  orders: Order[];
  business: BusinessProfile;
  onUpdateStatus: (orderId: string, status: ProductionStatus) => void;
  onSelectOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
  onOpenWhatsApp: (order: Order) => void;
  onPrintJobCard: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onAddPayment: (order: Order) => void;
  onOpenPortalForOrder: (trackingCode: string) => void;
}

const STAGES: { key: ProductionStatus; title: string; step: number; description: string }[] = [
  { key: 'order_received', title: 'Order Received', step: 1, description: 'Booking confirmed & advance logged' },
  { key: 'fabric_cutting', title: 'Fabric Cutting', step: 2, description: 'Fabric allocated & master cutter assigned' },
  { key: 'stitching_in_progress', title: 'Stitching in Progress', step: 3, description: 'Tailor assembly & sewing' },
  { key: 'first_trial', title: 'First Trial / Fitting', step: 4, description: 'Basted fitting with customer' },
  { key: 'alteration', title: 'Alteration & Refinement', step: 5, description: 'Post-fitting tweaks & adjustments' },
  { key: 'quality_check', title: 'Quality Check & Press', step: 6, description: '14-point inspection & steam press' },
  { key: 'ready_for_delivery', title: 'Ready for Collection', step: 7, description: 'Customer notified on WhatsApp' },
  { key: 'delivered', title: 'Delivered & Closed', step: 8, description: 'Balance settled & garment handed over' },
];

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  business,
  onUpdateStatus,
  onSelectOrder,
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
    const index = STAGES.findIndex((s) => s.key === current);
    if (index >= 0 && index < STAGES.length - 1) {
      return STAGES[index + 1].key;
    }
    return null;
  };

  const getPrevStage = (current: ProductionStatus): ProductionStatus | null => {
    const index = STAGES.findIndex((s) => s.key === current);
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
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Production &amp; Stitching Workflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time tracking from cutting shears to final fitting delivery
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, client name, mobile or garment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            aria-label="Filter by production stage"
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-2.5 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Stages ({orders.length})</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.step}. {s.title}
              </option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            aria-label="Filter by urgency"
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-2.5 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Urgency</option>
            <option value="standard">Standard</option>
            <option value="express">Express Priority</option>
            <option value="super_rush">Super Rush ⚡</option>
          </select>
        </div>
      </div>

      {/* KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-3.5 min-w-full items-start">
            {STAGES.map((stage) => {
              const stageOrders = filteredOrders.filter((o) => o.status === stage.key);
              return (
                <div
                  key={stage.key}
                  className="w-72 shrink-0 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col max-h-[calc(100vh-250px)]"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-850/60 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center">
                          {stage.step}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                          {stage.title}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        {stageOrders.length}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {stage.description}
                    </div>
                  </div>

                  {/* Column Body Cards */}
                  <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                    {stageOrders.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-600 italic">
                        No orders in this stage
                      </div>
                    ) : (
                      stageOrders.map((order) => {
                        const nextStage = getNextStage(order.status);
                        const prevStage = getPrevStage(order.status);
                        const item = order.items[0];

                        return (
                          <div
                            key={order.id}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all space-y-2.5"
                          >
                            {/* Card Top: Order Number & Urgency */}
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {order.orderNumber}
                              </span>
                              {order.urgency === 'super_rush' && (
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                                  Rush ⚡
                                </span>
                              )}
                              {order.urgency === 'express' && (
                                <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                                  Express
                                </span>
                              )}
                            </div>

                            {/* Client & Item Details */}
                            <div>
                              <div className="font-semibold text-xs text-slate-900 dark:text-white">
                                {order.customerName}
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
                                {item?.title || 'Custom Garment'}
                              </div>
                            </div>

                            {/* Tailor / Cutter Assignment */}
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                              <span>
                                {order.assignedTailorName ? `Tailor: ${order.assignedTailorName.split(' ')[0]}` : order.assignedCutterName ? `Cutter: ${order.assignedCutterName.split(' ')[0]}` : 'Unassigned'}
                              </span>
                              <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                                Del: {order.deliveryDate.slice(5)}
                              </span>
                            </div>

                            {/* Pricing & Balance Due */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block leading-tight">Total</span>
                                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                  {curr}{order.pricing.grandTotal.toLocaleString()}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block leading-tight">Balance</span>
                                <span
                                  className={`font-mono font-semibold ${
                                    order.pricing.balanceDue > 0
                                      ? 'text-amber-700 dark:text-amber-400'
                                      : 'text-emerald-700 dark:text-emerald-400'
                                  }`}
                                >
                                  {order.pricing.balanceDue > 0
                                    ? `${curr}${order.pricing.balanceDue.toLocaleString()}`
                                    : 'Paid'}
                                </span>
                              </div>
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => onOpenWhatsApp(order)}
                                  title="Send WhatsApp update"
                                  className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onPrintJobCard(order)}
                                  title="Print Tailor Spec Card"
                                  className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onOpenPortalForOrder(order.trackingCode)}
                                  title="Open in Customer Portal"
                                  className="p-1 text-slate-500 hover:text-amber-600 rounded transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                {nextStage && (
                                  <button
                                    onClick={() => onUpdateStatus(order.id, nextStage)}
                                    title={`Advance to ${nextStage.replace(/_/g, ' ')}`}
                                    className="px-2 py-0.5 text-[11px] font-semibold text-white bg-slate-900 hover:bg-amber-700 dark:bg-slate-700 dark:hover:bg-amber-600 rounded flex items-center gap-0.5 transition-colors"
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
        /* HIGH DENSITY LIST VIEW */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Order / Code</th>
                  <th className="py-2.5 px-3 font-medium">Customer</th>
                  <th className="py-2.5 px-3 font-medium">Garments &amp; Fabric</th>
                  <th className="py-2.5 px-3 font-medium">Staff Assigned</th>
                  <th className="py-2.5 px-3 font-medium">Trial Date</th>
                  <th className="py-2.5 px-3 font-medium">Delivery Date</th>
                  <th className="py-2.5 px-3 font-medium">Status Stage</th>
                  <th className="py-2.5 px-3 font-medium text-right">Balance Due</th>
                  <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => {
                  const item = order.items[0];
                  const nextStage = getNextStage(order.status);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono font-semibold text-slate-900 dark:text-white">
                          {order.orderNumber}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {order.trackingCode}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {item?.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item?.fabricName || 'Customer Fabric'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {order.assignedTailorName || order.assignedCutterName || '—'}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {order.trialDate || '—'}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {order.deliveryDate}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value as ProductionStatus)}
                          aria-label="Change status"
                          className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.step}. {s.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {order.pricing.balanceDue > 0 ? (
                          <div>
                            <span className="font-semibold text-amber-700 dark:text-amber-400">
                              {curr}{order.pricing.balanceDue.toLocaleString()}
                            </span>
                            <button
                              onClick={() => onAddPayment(order)}
                              className="block text-[10px] text-blue-600 dark:text-blue-400 hover:underline ml-auto"
                            >
                              + Pay
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">Settled</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintJobCard(order)}
                            title="Print Tailor Spec Job Card"
                            className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintInvoice(order)}
                            title="Print Tax Invoice"
                            className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenWhatsApp(order)}
                            title="Send WhatsApp"
                            className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectOrder(order)}
                            className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
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
      )}
    </div>
  );
};
