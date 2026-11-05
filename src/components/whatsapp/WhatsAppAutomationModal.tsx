import React, { useState } from 'react';
import {
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { generateWhatsAppMessage, openWhatsAppLink, WhatsAppPayload } from '../../services/whatsapp';
import { BusinessProfile, Customer, Order } from '../../types';

interface WhatsAppAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
  customer?: Customer;
  business: BusinessProfile;
}

export const WhatsAppAutomationModal: React.FC<WhatsAppAutomationModalProps> = ({
  isOpen,
  onClose,
  order,
  customer,
  business,
}) => {
  const [templateKey, setTemplateKey] = useState<WhatsAppPayload['templateKey']>(
    order?.status === 'ready_for_delivery'
      ? 'ready_collection'
      : order?.status === 'first_trial'
      ? 'trial_scheduled'
      : order?.status === 'alteration'
      ? 'alteration_update'
      : 'booking_confirm'
  );

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetCustomerName = order?.customerName || customer?.name || 'Valued Client';
  const targetPhone = order?.customerWhatsapp || order?.customerPhone || customer?.whatsapp || customer?.phone || '';
  const orderNumber = order?.orderNumber || 'ORD-8492';
  const trackingCode = order?.trackingCode || 'STM-8492';
  const garmentName = order?.items[0]?.title || 'Bespoke Garment';

  const payload: WhatsAppPayload = {
    templateKey,
    customerName: targetCustomerName,
    phone: targetPhone,
    orderNumber,
    trackingCode,
    garmentName,
    trialDate: order?.trialDate || 'Tomorrow 4:00 PM',
    deliveryDate: order?.deliveryDate || 'November 15, 2026',
    advancePaid: order?.pricing?.advancePaid || 250,
    balanceDue: order?.pricing?.balanceDue || 0,
    totalAmount: order?.pricing?.grandTotal || 450,
  };

  const messageText = generateWhatsAppMessage(payload, business);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSend = () => {
    openWhatsAppLink(targetPhone, messageText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-5 space-y-4 my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              WhatsApp Business Automation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Select Notification Purpose
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
            {[
              { key: 'booking_confirm', label: '1. Booking Confirm' },
              { key: 'trial_scheduled', label: '2. Trial Fitting' },
              { key: 'ready_collection', label: '3. Ready for Pick-Up' },
              { key: 'alteration_update', label: '4. Alteration Update' },
              { key: 'payment_receipt', label: '5. Payment Receipt' },
              { key: 'festival_greeting', label: '6. Festive Invitation' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTemplateKey(t.key as any)}
                className={`py-1.5 px-2 text-[11px] font-medium rounded-md text-left transition-colors truncate border ${
                  templateKey === t.key
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Details */}
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-slate-500">Recipient: </span>
            <strong className="text-slate-900 dark:text-white">{targetCustomerName}</strong>
          </div>
          <div className="font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{targetPhone || 'No phone recorded'}</span>
          </div>
        </div>

        {/* WhatsApp Preview Bubble */}
        <div className="bg-[#e5ddd5] dark:bg-[#111b21] p-4 rounded-xl border border-slate-300 dark:border-slate-800 max-h-60 overflow-y-auto shadow-inner text-xs">
          <div className="bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 p-3.5 rounded-lg shadow-xs max-w-md ml-auto whitespace-pre-wrap leading-relaxed">
            {messageText}
            <div className="text-[10px] text-slate-400 text-right mt-2 flex items-center justify-end gap-1">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="text-blue-500 font-bold">✓✓</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleSend}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via WhatsApp API</span>
          </button>
        </div>
      </div>
    </div>
  );
};
