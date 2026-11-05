import React from 'react';
import { Printer, X, Scissors, QrCode } from 'lucide-react';
import { BusinessProfile, Customer, MeasurementProfile, Order } from '../../types';

interface PrintJobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  customer?: Customer;
  measurementProfile?: MeasurementProfile;
  business: BusinessProfile;
}

export const PrintJobCardModal: React.FC<PrintJobCardModalProps> = ({
  isOpen,
  onClose,
  order,
  customer,
  measurementProfile,
  business,
}) => {
  if (!isOpen) return null;

  const item = order.items[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6 my-6">
        {/* Modal Controls (No print) */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-700">
            <Scissors className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif font-bold text-base">
              Master Cutter Job Spec Sheet Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Job Card</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE JOB CARD BODY */}
        <div className="space-y-5 text-xs text-slate-900 font-sans border-2 border-slate-800 p-5 rounded-lg bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                Workshop Cutting Card
              </div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-slate-950">
                {business.name}
              </h1>
              <p className="text-[11px] text-slate-600">{business.branch} · Tel: {business.phone}</p>
            </div>

            <div className="text-right">
              <div className="font-mono text-base font-bold bg-slate-100 border border-slate-300 px-2.5 py-1 rounded">
                {order.orderNumber}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Track: {order.trackingCode}
              </div>
            </div>
          </div>

          {/* Client & Timeline Meta */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Client Name</span>
              <span className="font-bold text-sm text-slate-950">{order.customerName}</span>
              <span className="text-[11px] text-slate-600 block font-mono">{order.customerPhone}</span>
              {customer?.fitPreference && (
                <span className="text-[11px] text-slate-700 block mt-0.5">
                  Preference: <strong>{customer.fitPreference}</strong>
                </span>
              )}
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500 text-[11px]">Booked: </span>
                <span className="font-mono font-semibold">{order.bookingDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Fitting Trial: </span>
                <span className="font-mono font-bold text-purple-900 bg-purple-50 px-1 rounded">
                  {order.trialDate || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">Delivery Due: </span>
                <span className="font-mono font-bold text-slate-950">
                  {order.deliveryDate}
                </span>
              </div>
            </div>
          </div>

          {/* Garment & Fabric Specification */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
            <div className="flex items-center justify-between font-bold text-xs">
              <span>{item?.title || 'Custom Garment'}</span>
              <span className="capitalize">{item?.garmentType}</span>
            </div>
            <div className="text-slate-700 text-[11px]">
              Fabric: <strong>{item?.fabricName || 'Client Fabric'}</strong> (Qty: {item?.fabricMetersUsed || 0}m)
            </div>
          </div>

          {/* Measurements Spec Grid */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Anatomical Measurement Specs ({measurementProfile?.unit || 'inches'})</span>
              <span className="text-[10px] font-normal text-slate-500">
                Profile: {measurementProfile?.profileName || 'Default Specs'}
              </span>
            </div>

            {measurementProfile?.measurements ? (
              <div className="grid grid-cols-4 gap-2 border border-slate-300 rounded p-2.5 bg-slate-50/50">
                {Object.entries(measurementProfile.measurements).map(([key, val]) => (
                  <div key={key} className="border-b border-slate-200 pb-1">
                    <span className="text-[10px] text-slate-500 uppercase block truncate">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-950">
                      {val}&quot;
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 border border-slate-200 rounded text-center text-slate-400 italic">
                Standard baseline pattern specs to be pulled from master ledger.
              </div>
            )}
          </div>

          {/* Posture & Styling Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 border border-slate-200 rounded space-y-1">
              <span className="font-bold text-slate-800 block text-[10px] uppercase">
                Style Specifications
              </span>
              {item?.styleSpecs?.lapelType && <div>Lapels: {item.styleSpecs.lapelType}</div>}
              {item?.styleSpecs?.collarType && <div>Collar: {item.styleSpecs.collarType}</div>}
              {item?.styleSpecs?.ventType && <div>Vents: {item.styleSpecs.ventType}</div>}
              {item?.styleSpecs?.monogramText && (
                <div className="font-bold text-amber-900">
                  Monogram: &quot;{item.styleSpecs.monogramText}&quot;
                </div>
              )}
            </div>

            <div className="p-2.5 border border-slate-200 rounded space-y-1">
              <span className="font-bold text-slate-800 block text-[10px] uppercase">
                Anatomical Posture Notes
              </span>
              <p className="text-slate-700 italic">
                {customer?.postureNotes || measurementProfile?.notes || 'Standard balanced erect posture.'}
              </p>
            </div>
          </div>

          {/* Workshop Signatures Slip */}
          <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-3 gap-4 text-center text-[10px] text-slate-600">
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1" />
              <span>Master Cutter Signature ({order.assignedCutterName || 'Cutter'})</span>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1" />
              <span>Tailor Needlework ({order.assignedTailorName || 'Tailor'})</span>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1" />
              <span>Master Quality Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
