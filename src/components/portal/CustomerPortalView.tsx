import React, { useState } from 'react';
import {
  Scissors,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  Printer,
  MessageCircle,
  Search,
  Ruler,
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  MapPin,
  ChevronRight,
  Send,
} from 'lucide-react';
import { BusinessProfile, Customer, MeasurementProfile, Order, ProductionStatus } from '../../types';

interface CustomerPortalViewProps {
  orders: Order[];
  measurements: MeasurementProfile[];
  business: BusinessProfile;
  initialTrackingCode?: string;
  onExitPortal: () => void;
  onPrintInvoice: (order: Order) => void;
  onPrintJobCard: (order: Order) => void;
}

const STAGES: { key: ProductionStatus; title: string; step: number; desc: string }[] = [
  { key: 'order_received', title: 'Order Booked', step: 1, desc: 'Pattern drafted & specifications locked' },
  { key: 'fabric_cutting', title: 'Fabric Cutting', step: 2, desc: 'Master cutter hand-shearing bolt' },
  { key: 'stitching_in_progress', title: 'Stitching in Progress', step: 3, desc: 'Canvas structure & needlework assembly' },
  { key: 'first_trial', title: 'First Fitting Trial', step: 4, desc: 'Basted fitting appointment with cutter' },
  { key: 'alteration', title: 'Alteration & Refinement', step: 5, desc: 'Hand adjustments & contour fine-tuning' },
  { key: 'quality_check', title: 'Quality Check & Press', step: 6, desc: '14-point inspection & steam finishing' },
  { key: 'ready_for_delivery', title: 'Ready for Collection', step: 7, desc: 'Garment packed in dust garment bag' },
  { key: 'delivered', title: 'Delivered', step: 8, desc: 'Final fitting approved & handed over' },
];

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  orders,
  measurements,
  business,
  initialTrackingCode,
  onExitPortal,
  onPrintInvoice,
  onPrintJobCard,
}) => {
  const [trackingInput, setTrackingInput] = useState(initialTrackingCode || orders[2]?.trackingCode || 'STM-8482');
  const [selectedOrderCode, setSelectedOrderCode] = useState(trackingInput);
  const [activeTab, setActiveTab] = useState<'tracker' | 'measurements' | 'alteration_request'>('tracker');

  // Alteration Request State
  const [alterationNote, setAlterationNote] = useState('');
  const [alterationSubmitted, setAlterationSubmitted] = useState(false);

  const curr = business.currencySymbol;

  // Find order
  const activeOrder =
    orders.find(
      (o) =>
        o.trackingCode.toLowerCase() === selectedOrderCode.toLowerCase() ||
        o.orderNumber.toLowerCase() === selectedOrderCode.toLowerCase()
    ) || orders[0];

  const orderItem = activeOrder?.items[0];
  const orderMeasurement = measurements.find(
    (m) => m.id === orderItem?.measurementProfileId || m.customerId === activeOrder?.customerId
  );

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeOrder?.status);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedOrderCode(trackingInput.trim());
  };

  const handleAlterationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlterationSubmitted(true);
    setTimeout(() => {
      setAlterationSubmitted(false);
      setAlterationNote('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Customer Portal Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 mb-1">
              <span>{business.name}</span>
              <span aria-hidden="true">·</span>
              <span>Client Concierge Tracking</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
              Bespoke Garment &amp; Stitching Tracker
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Live updates from our master cutting workshop, fitting schedule and anatomical measurement book.
            </p>
          </div>

          <button
            onClick={onExitPortal}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            ← Exit to Atelier ERP
          </button>
        </div>
      </div>

      {/* Tracking Code Search Input & Quick Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your Order # or Tracking Code (e.g. STM-8482)..."
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 rounded-lg shadow-xs transition-colors shrink-0"
          >
            Track Garment
          </button>
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500 pt-1">
          <span className="shrink-0 text-[11px]">Sample Client Orders:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setTrackingInput(o.trackingCode);
                setSelectedOrderCode(o.trackingCode);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono shrink-0 transition-colors ${
                o.trackingCode === activeOrder?.trackingCode
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
              }`}
            >
              {o.orderNumber} ({o.customerName.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {activeOrder ? (
        <div className="space-y-6">
          {/* Order Header Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>Tracking: {activeOrder.trackingCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>Order: {activeOrder.orderNumber}</span>
                </div>
                <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-0.5">
                  {orderItem?.title || 'Custom Tailored Garment'}
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Commissioned by <strong>{activeOrder.customerName}</strong> on {activeOrder.bookingDate}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintInvoice(activeOrder)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <a
                  href={`https://api.whatsapp.com/send?phone=${business.whatsapp.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Hello ${business.name}, I'm checking regarding my order #${activeOrder.orderNumber} (${orderItem?.title}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Atelier Concierge</span>
                </a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 text-[11px]">Fitting Trial</div>
                <div className="font-semibold text-purple-700 dark:text-purple-400 mt-0.5">
                  {activeOrder.trialDate || 'Pending Schedule'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 text-[11px]">Promised Delivery</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {activeOrder.deliveryDate}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 text-[11px]">Total Commission</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {curr}{activeOrder.pricing.grandTotal.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <div className="text-slate-500 text-[11px]">Balance on Handover</div>
                <div className="font-semibold text-amber-700 dark:text-amber-400 mt-0.5 font-mono">
                  {activeOrder.pricing.balanceDue > 0
                    ? `${curr}${activeOrder.pricing.balanceDue.toLocaleString()}`
                    : 'Fully Settled ✓'}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'tracker'
                  ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Live Stitching Progress
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'measurements'
                  ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              My Tailored Measurements
            </button>
            <button
              onClick={() => setActiveTab('alteration_request')}
              className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'alteration_request'
                  ? 'border-amber-700 text-amber-800 dark:border-amber-400 dark:text-amber-300 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Request Alteration / Fitting Note
            </button>
          </div>

          {/* TAB 1: Live 8-Stage Progress Stepper */}
          {activeTab === 'tracker' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                Bespoke Craftsmanship Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {STAGES.map((stage, idx) => {
                  const isDone = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isUpcoming = idx > currentStageIndex;

                  return (
                    <div key={stage.key} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white dark:ring-slate-900 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : stage.step}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-amber-800 dark:text-amber-400'
                                : isDone
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {stage.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200">
                              Active Stage Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bespoke Garment Specifications Details */}
              {orderItem && (
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Custom Styling &amp; Details
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {orderItem.fabricName && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-slate-500 block text-[11px]">Selected Fabric</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {orderItem.fabricName}
                        </span>
                      </div>
                    )}
                    {orderItem.styleSpecs?.lapelType && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-slate-500 block text-[11px]">Lapel Style</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {orderItem.styleSpecs.lapelType}
                        </span>
                      </div>
                    )}
                    {orderItem.styleSpecs?.collarType && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-slate-500 block text-[11px]">Collar</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {orderItem.styleSpecs.collarType}
                        </span>
                      </div>
                    )}
                    {orderItem.styleSpecs?.monogramText && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-slate-500 block text-[11px]">Custom Monogram</span>
                        <span className="font-semibold text-amber-800 dark:text-amber-400">
                          &quot;{orderItem.styleSpecs.monogramText}&quot;
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Digital Measurement Spec */}
          {activeTab === 'measurements' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    {orderMeasurement?.profileName || 'Bespoke Measurements'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recorded on {orderMeasurement?.dateRecorded || activeOrder.bookingDate} (in {orderMeasurement?.unit || 'inches'})
                  </p>
                </div>
              </div>

              {orderMeasurement?.measurements ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(orderMeasurement.measurements).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-[11px] text-slate-500 capitalize block truncate">
                        {k.replace(/_/g, ' ')}
                      </span>
                      <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {v}&quot;
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic py-6 text-center">
                  Measurement specs are in cutting room archives.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Request Alteration */}
          {activeTab === 'alteration_request' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                  Request Fitting Adjustment or Alteration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Need a tweak to your sleeve length, waist taper, or neck depth? Let our cutter know directly.
                </p>
              </div>

              {alterationSubmitted ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Your alteration notes have been transmitted directly to our Master Cutter. We will confirm via WhatsApp within 2 hours.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleAlterationSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">
                      Adjustment Details *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Please shorten trouser length by 0.5 inches; waist feels slightly snug when seated..."
                      value={alterationNote}
                      onChange={(e) => setAlterationNote(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Standard alteration turn-around is 24–48 hours.
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Fitting Notes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500">
          No order found for tracking code &quot;{trackingInput}&quot;. Please check the receipt or select from sample orders above.
        </div>
      )}
    </div>
  );
};
