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
} from 'lucide-react';
import { BusinessProfile, Order, PaymentRecord } from '../../types';

interface BillingFinanceProps {
  orders: Order[];
  business: BusinessProfile;
  onPrintInvoice: (order: Order) => void;
  onOpenWhatsApp: (order: Order) => void;
  onAddPayment: (orderId: string, payment: Omit<PaymentRecord, 'id'>) => void;
}

export const BillingFinance: React.FC<BillingFinanceProps> = ({
  orders,
  business,
  onPrintInvoice,
  onOpenWhatsApp,
  onAddPayment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);

  // Payment dialog state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentRecord['method']>('upi');
  const [payNotes, setPayNotes] = useState('');

  const curr = business.currencySymbol;

  const totalInvoiced = orders.reduce((sum, o) => sum + o.pricing.grandTotal, 0);
  const totalCollected = orders.reduce((sum, o) => sum + o.pricing.advancePaid, 0);
  const totalOutstanding = orders.reduce((sum, o) => sum + o.pricing.balanceDue, 0);

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
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Billing, Invoicing &amp; Cashflow
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {business.taxLabel} Tax invoices, advance receipts, balance settlements and collection audit
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Total Invoiced Revenue</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {curr}{totalInvoiced.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {orders.length} commissions</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Total Collections Received</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {curr}{totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Bank, card &amp; cash advances</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Outstanding Dues to Collect</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-800 dark:text-amber-400">
            {curr}{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Pending collection upon garment delivery</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice by order #, client name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterDueOnly}
              onChange={(e) => setFilterDueOnly(e.target.checked)}
              className="rounded text-amber-600"
            />
            <span>Show Outstanding Dues Only</span>
          </label>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-medium">Invoice #</th>
                <th className="py-2.5 px-3 font-medium">Customer</th>
                <th className="py-2.5 px-3 font-medium">Booking Date</th>
                <th className="py-2.5 px-3 font-medium text-right">Taxable</th>
                <th className="py-2.5 px-3 font-medium text-right">{business.taxLabel}</th>
                <th className="py-2.5 px-3 font-medium text-right">Grand Total</th>
                <th className="py-2.5 px-3 font-medium text-right">Collected</th>
                <th className="py-2.5 px-3 font-medium text-right">Balance Due</th>
                <th className="py-2.5 px-3 font-medium text-center">Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order) => {
                const isPaid = order.pricing.balanceDue <= 0;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {order.bookingDate}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      {curr}{order.pricing.taxableAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {curr}{order.pricing.taxAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {curr}{order.pricing.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {curr}{order.pricing.advancePaid.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {order.pricing.balanceDue > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400">
                          {curr}{order.pricing.balanceDue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isPaid ? (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          Paid Full
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          Balance Due
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isPaid && (
                          <button
                            onClick={() => handleOpenPaymentModal(order)}
                            className="px-2 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-amber-700 dark:bg-slate-700 dark:hover:bg-amber-600 rounded transition-colors whitespace-nowrap"
                          >
                            + Pay
                          </button>
                        )}
                        <button
                          onClick={() => onPrintInvoice(order)}
                          title="Print Tax Invoice"
                          className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenWhatsApp(order)}
                          title="WhatsApp Receipt"
                          className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded"
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

      {/* RECORD PAYMENT MODAL */}
      {payingOrderId && activePayingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Record Payment — {activePayingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setPayingOrderId(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activePayingOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grand Total:</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {curr}{activePayingOrder.pricing.grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Outstanding:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    {curr}{activePayingOrder.pricing.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Payment Amount to Collect ({curr}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-emerald-700 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Payment Instrument / Channel
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                >
                  <option value="upi">UPI / Instant QR Payment</option>
                  <option value="card">Card Terminal / POS</option>
                  <option value="cash">Cash In Hand</option>
                  <option value="bank_transfer">Direct Bank / Wire Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingOrderId(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs"
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
