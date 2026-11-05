import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, AlertCircle, Scissors, DollarSign } from 'lucide-react';
import { Order, ProductionStatus, TailorStaff, BusinessProfile } from '../../types';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  tailors: TailorStaff[];
  business: BusinessProfile;
  onSave: (updatedOrder: Order) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  tailors,
  business,
  onSave,
}) => {
  if (!isOpen || !order) return null;

  const [customerName, setCustomerName] = useState(order.customerName);
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone);
  const [customerWhatsapp, setCustomerWhatsapp] = useState(order.customerWhatsapp || '');
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate || '');
  const [trialDate, setTrialDate] = useState(order.trialDate || '');
  const [status, setStatus] = useState<ProductionStatus>(order.status);
  const [urgency, setUrgency] = useState(order.urgency);
  const [assignedTailorId, setAssignedTailorId] = useState(order.assignedTailorId || '');
  const [assignedCutterId, setAssignedCutterId] = useState(order.assignedCutterId || '');
  const [itemTitle, setItemTitle] = useState(order.items[0]?.title || '');
  const [specialInstructions, setSpecialInstructions] = useState(
    order.items[0]?.specialInstructions || ''
  );
  const [grandTotal, setGrandTotal] = useState(order.pricing.grandTotal);
  const [advancePaid, setAdvancePaid] = useState(order.pricing.advancePaid);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerPhone(order.customerPhone);
      setCustomerWhatsapp(order.customerWhatsapp || '');
      setDeliveryDate(order.deliveryDate || '');
      setTrialDate(order.trialDate || '');
      setStatus(order.status);
      setUrgency(order.urgency);
      setAssignedTailorId(order.assignedTailorId || '');
      setAssignedCutterId(order.assignedCutterId || '');
      setItemTitle(order.items[0]?.title || '');
      setSpecialInstructions(order.items[0]?.specialInstructions || '');
      setGrandTotal(order.pricing.grandTotal);
      setAdvancePaid(order.pricing.advancePaid);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTailor = tailors.find((t) => t.id === assignedTailorId);
    const selectedCutter = tailors.find((t) => t.id === assignedCutterId);

    const updatedItems = [...order.items];
    if (updatedItems[0]) {
      updatedItems[0] = {
        ...updatedItems[0],
        title: itemTitle,
        specialInstructions: specialInstructions,
      };
    }

    const newGrandTotal = Number(grandTotal) || 0;
    const newAdvancePaid = Number(advancePaid) || 0;
    const newBalanceDue = Math.max(0, newGrandTotal - newAdvancePaid);

    const updated: Order = {
      ...order,
      customerName,
      customerPhone,
      customerWhatsapp: customerWhatsapp || customerPhone,
      deliveryDate,
      trialDate: trialDate || undefined,
      status,
      urgency,
      assignedTailorId: assignedTailorId || undefined,
      assignedTailorName: selectedTailor?.name || order.assignedTailorName,
      assignedCutterId: assignedCutterId || undefined,
      assignedCutterName: selectedCutter?.name || order.assignedCutterName,
      items: updatedItems,
      pricing: {
        ...order.pricing,
        grandTotal: newGrandTotal,
        advancePaid: newAdvancePaid,
        balanceDue: newBalanceDue,
      },
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  const curr = business.currencySymbol;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Edit Order #{order.orderNumber}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {order.trackingCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">Update order details, schedules, and assignments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Contact
              </label>
              <input
                type="text"
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(e.target.value)}
                placeholder="Optional, defaults to phone"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Garment Title / Description
              </label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="e.g. Navy 3-Piece Tuxedo"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductionStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="order_received">1. Order Received</option>
                <option value="fabric_cutting">2. Fabric Cutting</option>
                <option value="stitching">3. Stitching in Progress</option>
                <option value="trial_ready">4. Ready for Trial</option>
                <option value="alteration">5. Alterations Underway</option>
                <option value="quality_check">6. Quality Inspection</option>
                <option value="ready_delivery">7. Ready for Collection</option>
                <option value="delivered">8. Completed & Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urgency Priority
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="standard">Standard Order</option>
                <option value="express">Express Commission (+15%)</option>
                <option value="super_rush">Super Rush VIP (+30%)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trial Fitting Date
              </label>
              <input
                type="date"
                value={trialDate}
                onChange={(e) => setTrialDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Master Cutter
              </label>
              <select
                value={assignedCutterId}
                onChange={(e) => setAssignedCutterId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Unassigned</option>
                {tailors
                  .filter((t) => t.role.includes('cutter') || t.role.includes('tailor') || t.role.includes('master'))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role.replace(/_/g, ' ')})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Stitching Tailor
              </label>
              <select
                value={assignedTailorId}
                onChange={(e) => setAssignedTailorId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Unassigned</option>
                {tailors.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.role.replace(/_/g, ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grand Total ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={grandTotal}
                onChange={(e) => setGrandTotal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Advance Paid ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tailor Special Notes & Cutting Notes
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra 1.5 inch seam allowance, pick stitch lapels"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
