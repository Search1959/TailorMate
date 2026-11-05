import React from 'react';
import {
  X,
  Scissors,
  Calendar,
  Clock,
  Printer,
  FileText,
  MessageCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  User,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { BusinessProfile, Order, ProductionStatus } from '../../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  business: BusinessProfile;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onPrintJobCard: (order: Order) => void;
  onPrintInvoice: (order: Order) => void;
  onOpenWhatsApp: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: ProductionStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  business,
  onEdit,
  onDelete,
  onPrintJobCard,
  onPrintInvoice,
  onOpenWhatsApp,
  onUpdateStatus,
}) => {
  if (!isOpen || !order) return null;

  const item = order.items[0];
  const curr = business.currencySymbol;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                {order.orderNumber}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Track: {order.trackingCode}
              </span>
              {order.urgency === 'super_rush' && (
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                  Super Rush ⚡
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-1">
              {item?.title || 'Bespoke Garment Commission'}
            </h2>
            <p className="text-xs text-slate-500">
              Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onClose();
                onEdit(order);
              }}
              title="Edit Order"
              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(order);
              }}
              title="Delete Order"
              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Status Stage Switcher Row */}
          <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Current Production Stage:</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as ProductionStatus)}
              aria-label="Change order status"
              className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-1.5 px-3 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="order_received">1. Order Received</option>
              <option value="fabric_cutting">2. Fabric Cutting</option>
              <option value="stitching_in_progress">3. Stitching in Progress</option>
              <option value="first_trial">4. First Trial Fitting</option>
              <option value="alteration">5. Alteration &amp; Refinement</option>
              <option value="quality_check">6. Quality Check &amp; Press</option>
              <option value="ready_for_delivery">7. Ready for Collection</option>
              <option value="delivered">8. Delivered &amp; Closed</option>
            </select>
          </div>

          {/* Timeline & Staff Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Booking Date</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {order.bookingDate}
              </span>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-400 block text-[11px]">Fitting Trial</span>
              <span className="font-mono font-bold text-purple-900 dark:text-purple-300">
                {order.trialDate || 'Not scheduled'}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-600 dark:text-emerald-400 block text-[11px]">Delivery Date</span>
              <span className="font-mono font-bold text-emerald-900 dark:text-emerald-300">
                {order.deliveryDate}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">Assigned Craftsman</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {order.assignedTailorName || order.assignedCutterName || 'Workshop Queue'}
              </span>
            </div>
          </div>

          {/* Bespoke Styling Specifications */}
          {item && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Garment Styling &amp; Fabric Details
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <span className="text-slate-400 block text-[11px]">Fabric Selected</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {item.fabricName || 'Customer Provided'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Meterage</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {item.fabricMetersUsed || 0}m
                  </span>
                </div>
                {item.styleSpecs?.lapelType && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Lapel Architecture</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.styleSpecs.lapelType}
                    </span>
                  </div>
                )}
                {item.styleSpecs?.collarType && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Collar</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.styleSpecs.collarType}
                    </span>
                  </div>
                )}
                {item.styleSpecs?.monogramText && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Monogram</span>
                    <span className="font-bold text-amber-800 dark:text-amber-400">
                      &quot;{item.styleSpecs.monogramText}&quot;
                    </span>
                  </div>
                )}
                {item.styleSpecs?.buttonType && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Buttons</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.styleSpecs.buttonType}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing & Commercial Settlement */}
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-2">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[11px]">
              Financial Settlement
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60">
                <span className="text-[10px] text-slate-400 block">Grand Total</span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {curr}{order.pricing.grandTotal.toLocaleString()}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60">
                <span className="text-[10px] text-slate-400 block">Advance Collected</span>
                <span className="font-mono font-bold text-sm text-emerald-700 dark:text-emerald-400">
                  {curr}{order.pricing.advancePaid.toLocaleString()}
                </span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-amber-200/60">
                <span className="text-[10px] text-slate-400 block">Balance Payable</span>
                <span className="font-mono font-bold text-sm text-amber-800 dark:text-amber-300">
                  {curr}{order.pricing.balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPrintJobCard(order)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Job Card</span>
            </button>
            <button
              onClick={() => onPrintInvoice(order)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tax Invoice</span>
            </button>
            <button
              onClick={() => onOpenWhatsApp(order)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(order);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Order</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(order);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
