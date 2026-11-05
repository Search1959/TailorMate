import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageCircle,
  Search,
  Receipt,
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { BusinessProfile, Order, PaymentRecord } from '../../types';

interface BillingFinanceProps {
  orders: Order[];
  business: BusinessProfile;
  onPrintInvoice: (order: Order) => void;
  onOpenWhatsApp: (order: Order) => void;
  onAddPayment: (orderId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
}

export const BillingFinance: React.FC<BillingFinanceProps> = ({
  orders,
  business,
  onPrintInvoice,
  onOpenWhatsApp,
  onAddPayment,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  // Payment dialog state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentRecord['method']>('upi');
  const [payNotes, setPayNotes] = useState('');

  const curr = business.currencySymbol;

  const totalInvoiced = orders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
  const totalCollected = orders.reduce((sum, o) => sum + (o.pricing?.advancePaid || 0), 0);
  const totalOutstanding = orders.reduce((sum, o) => sum + (o.pricing?.balanceDue || 0), 0);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);

    const matchesDue = filterDueOnly ? o.pricing.balanceDue > 0 : true;
    return matchesSearch && matchesDue;
  });

  const activePayingOrder = orders.find((o) => o.id === payingOrderId);

  const handleOpenPaymentModal = (order: Order) => {
    setPayingOrderId(order.id);
    setPayAmount(order.pricing.balanceDue);
    setPayNotes(`Balance settlement for ${order.orderNumber}`);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePayingOrder || payAmount <= 0) return;

    onAddPayment(activePayingOrder.id, {
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      method: payMethod,
      receiptNo: `REC-${Date.now().toString().slice(-6)}`,
      notes: payNotes,
    });

    setPayingOrderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Billing, Invoicing &amp; Cashflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {business.taxLabel} Tax invoices, advance receipts, balance settlements and collection audit
          </p>
        </div>
      </div>

      {/* Colorful KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-white dark:to-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Total Invoiced Revenue</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-blue-950 dark:text-blue-100">
            {curr}{totalInvoiced.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">Across {orders.length} bespoke commissions</div>
        </div>

        <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-white dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Collections Received</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-emerald-950 dark:text-emerald-100">
            {curr}{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">Bank, card &amp; cash settlements</div>
        </div>

        <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Outstanding Dues to Collect</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-amber-950 dark:text-amber-100">
            {curr}{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">Pending collection upon delivery</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice by order #, client name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              checked={filterDueOnly}
              onChange={(e) => setFilterDueOnly(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>Show Outstanding Dues Only</span>
          </label>
        </div>
      </div>

      {/* Invoices Ledger Table with View, Edit/Settle, Delete Action Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 font-semibold">Invoice #</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Booking Date</th>
                <th className="py-3 px-3 font-semibold text-right">Taxable</th>
                <th className="py-3 px-3 font-semibold text-right">{business.taxLabel}</th>
                <th className="py-3 px-3 font-semibold text-right">Grand Total</th>
                <th className="py-3 px-3 font-semibold text-right">Collected</th>
                <th className="py-3 px-3 font-semibold text-right">Balance Due</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-3 font-semibold text-center">Manage &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order) => {
                const isPaid = order.pricing.balanceDue <= 0;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {order.bookingDate}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      {curr}{order.pricing.taxableAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-500">
                      {curr}{order.pricing.taxAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {curr}{order.pricing.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {curr}{order.pricing.advancePaid.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold">
                      {order.pricing.balanceDue > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400">
                          {curr}{order.pricing.balanceDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400">Paid Full</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {isPaid ? (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                          Settled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                          Balance Due
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewOrder && onViewOrder(order)}
                          title="View Invoice & Order"
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {!isPaid ? (
                          <button
                            onClick={() => handleOpenPaymentModal(order)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
                          >
                            + Settle
                          </button>
                        ) : (
                          <button
                            onClick={() => onEditOrder && onEditOrder(order)}
                            title="Edit Invoice/Order"
                            className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg border border-amber-200 dark:border-amber-900 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteOrder && onDeleteOrder(order)}
                          title="Delete Invoice"
                          className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onPrintInvoice(order)}
                          title="Print Tax Invoice"
                          className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenWhatsApp(order)}
                          title="WhatsApp Receipt"
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

      {/* Quick Settlement Modal */}
      {payingOrderId && activePayingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Record Payment / Settle Balance
              </h3>
              <button
                onClick={() => setPayingOrderId(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3">
              <div>
                <span className="text-xs text-slate-500">Commission Order:</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {activePayingOrder.orderNumber} · {activePayingOrder.customerName}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 font-mono font-bold mt-0.5">
                  Remaining Balance: {curr}{activePayingOrder.pricing.balanceDue.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Settlement Amount ({curr}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={activePayingOrder.pricing.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Instrument *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="upi">UPI / Instant Bank Pay</option>
                  <option value="credit_card">Credit / Debit Card (POS)</option>
                  <option value="cash">Cash In Hand</option>
                  <option value="bank_transfer">Wire / Direct Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Receipt Note
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingOrderId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  Confirm &amp; Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
