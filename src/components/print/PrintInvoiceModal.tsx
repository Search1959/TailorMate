import React from 'react';
import { Printer, X, Receipt, CheckCircle } from 'lucide-react';
import { BusinessProfile, Customer, Order } from '../../types';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  customer?: Customer;
  business: BusinessProfile;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  customer,
  business,
}) => {
  if (!isOpen) return null;

  const curr = business.currencySymbol;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6 my-6">
        {/* Modal Controls (No print) */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-700">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <h3 className="font-serif font-bold text-base">
              {business.taxLabel} Tax Invoice &amp; Receipt Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE BODY */}
        <div className="space-y-6 text-xs text-slate-900 font-sans border-2 border-slate-300 p-6 rounded-lg bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-slate-950">
                {business.name}
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">{business.branch}</p>
              <p className="text-[11px] text-slate-600">{business.address}</p>
              <p className="text-[11px] text-slate-600">Tel: {business.phone} · Email: {business.email}</p>
              <p className="text-[11px] font-mono text-slate-700 mt-1">
                {business.taxLabel} Reg: {business.taxRegistrationNumber}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                TAX INVOICE
              </span>
              <div className="font-mono text-base font-bold text-slate-950 mt-0.5">
                {order.orderNumber}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">
                Date: {order.bookingDate}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Tracking: {order.trackingCode}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Billed To Client:
              </span>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{order.customerName}</div>
              <div className="text-slate-600 font-mono">{order.customerPhone}</div>
              <div className="text-slate-600">{customer?.address || 'Client Address on File'}</div>
            </div>

            <div className="text-right space-y-1 text-[11px]">
              <div>
                <span className="text-slate-500">Delivery Due: </span>
                <span className="font-mono font-semibold">{order.deliveryDate}</span>
              </div>
              <div>
                <span className="text-slate-500">Fitting Trial: </span>
                <span className="font-mono">{order.trialDate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-700 font-bold">
                <th className="py-2">Garment Item &amp; Bespoke Styling</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Stitching</th>
                <th className="py-2 text-right">Fabric Charge</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="py-2.5">
                    <div className="font-bold text-slate-950">{it.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Fabric: {it.fabricName || 'Customer Fabric'} ({it.fabricMetersUsed || 0}m)
                    </div>
                  </td>
                  <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                  <td className="py-2.5 text-right font-mono">
                    {curr}{it.unitStitchingPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right font-mono">
                    {curr}{it.unitFabricPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-slate-950">
                    {curr}{it.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Calculation Totals */}
          <div className="pt-3 border-t-2 border-slate-800 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Stitching Subtotal:</span>
                <span className="font-mono">{curr}{order.pricing.stitchingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fabric Subtotal:</span>
                <span className="font-mono">{curr}{order.pricing.fabricTotal.toFixed(2)}</span>
              </div>
              {order.pricing.rushSurcharge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Rush Surcharge:</span>
                  <span className="font-mono">{curr}{order.pricing.rushSurcharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                <span>Taxable Amount:</span>
                <span className="font-mono">{curr}{order.pricing.taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{business.taxLabel} ({business.taxRatePercent}%):</span>
                <span className="font-mono">{curr}{order.pricing.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-950 pt-2 border-t-2 border-slate-800">
                <span>Invoice Grand Total:</span>
                <span className="font-mono">{curr}{order.pricing.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-semibold pt-1">
                <span>Advance Collected:</span>
                <span className="font-mono">-{curr}{order.pricing.advancePaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-300">
                <span className="text-amber-900">Balance Due at Handover:</span>
                <span className="font-mono text-amber-900">
                  {curr}{order.pricing.balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Receipts History */}
          {order.payments.length > 0 && (
            <div className="pt-3 border-t border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Recorded Payment Receipts:
              </span>
              {order.payments.map((p) => (
                <div key={p.id} className="text-[11px] font-mono text-slate-600 flex justify-between">
                  <span>{p.receiptNo} ({p.date}) · via {p.method.toUpperCase()}</span>
                  <span className="font-bold text-slate-900">+{curr}{p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer Terms */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-0.5">
            <p>1. Tailored garments are handcrafted to unique customer measurements.</p>
            <p>2. First basted trial is scheduled prior to final finishing. Free minor alterations within 14 days of delivery.</p>
            <p>3. Outstanding balances must be settled in full upon collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
