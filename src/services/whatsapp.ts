import { BusinessProfile, Order } from '../types';

export interface WhatsAppPayload {
  templateKey: 'booking_confirm' | 'trial_scheduled' | 'ready_collection' | 'alteration_update' | 'payment_receipt' | 'festival_greeting';
  customerName: string;
  phone: string;
  orderNumber: string;
  trackingCode: string;
  garmentName: string;
  trialDate?: string;
  deliveryDate?: string;
  advancePaid?: number;
  balanceDue?: number;
  totalAmount?: number;
}

export function generateWhatsAppMessage(
  payload: WhatsAppPayload,
  business: BusinessProfile,
  appUrl: string = window.location.origin
): string {
  const { customerName, orderNumber, trackingCode, garmentName, trialDate, deliveryDate, advancePaid, balanceDue, totalAmount } = payload;
  const curr = business.currencySymbol;
  const trackingLink = `${appUrl}?portal=true&code=${trackingCode}`;

  switch (payload.templateKey) {
    case 'booking_confirm':
      return (
        `✨ *Order Confirmation — ${business.name}*\n\n` +
        `Dear ${customerName},\n` +
        `Thank you for trusting us with your bespoke garment. Your order *#${orderNumber}* for *${garmentName}* has been booked successfully.\n\n` +
        `📋 *Order Summary:*\n` +
        `• Total Amount: ${curr}${totalAmount?.toLocaleString() ?? 0}\n` +
        `• Advance Received: ${curr}${advancePaid?.toLocaleString() ?? 0}\n` +
        `• Balance Due on Delivery: ${curr}${balanceDue?.toLocaleString() ?? 0}\n` +
        (trialDate ? `• Scheduled Trial Date: *${trialDate}*\n` : '') +
        `• Promised Delivery Date: *${deliveryDate}*\n\n` +
        `🔍 *Live Order & Stitching Tracker:*\n` +
        `View real-time workshop progress & your measurement sheet here:\n` +
        `${trackingLink}\n\n` +
        `Warm regards,\n` +
        `${business.name}\n` +
        `📞 ${business.phone}`
      );

    case 'trial_scheduled':
      return (
        `🪡 *Fitting Trial Appointment Reminder — ${business.name}*\n\n` +
        `Dear ${customerName},\n` +
        `Your bespoke *${garmentName}* (#${orderNumber}) is ready for its master fitting trial.\n\n` +
        `📅 *Appointment Date:* ${trialDate || 'Tomorrow'}\n` +
        `📍 *Location:* ${business.address}\n\n` +
        `Our Master Cutter will assist with shoulder balance, chest drape, and sleeve line adjustments.\n\n` +
        `Check live status: ${trackingLink}\n\n` +
        `Please confirm your preferred time slot by replying to this message.`
      );

    case 'ready_collection':
      return (
        `🎉 *Your Garment is Ready for Collection! — ${business.name}*\n\n` +
        `Dear ${customerName},\n` +
        `Great news! Handcrafted stitching and final hand-pressing for your *${garmentName}* (#${orderNumber}) have passed our 14-point Master Quality Inspection.\n\n` +
        `✨ *Collection Details:*\n` +
        `• Order No: #${orderNumber}\n` +
        `• Balance Payable: *${curr}${balanceDue?.toLocaleString() ?? 0}*\n` +
        `• Studio Address: ${business.address}\n\n` +
        `View your final digital invoice & job specs here:\n` +
        `${trackingLink}\n\n` +
        `We look forward to seeing you at the studio!`
      );

    case 'alteration_update':
      return (
        `✂️ *Alteration Update — ${business.name}*\n\n` +
        `Dear ${customerName},\n` +
        `Your fitting notes for order *#${orderNumber}* (${garmentName}) have been assigned to our master alteration craftsperson.\n\n` +
        `All requested refinements are underway. Expected ready date: *${deliveryDate}*.\n\n` +
        `Track progress in real-time: ${trackingLink}`
      );

    case 'payment_receipt':
      return (
        `🧾 *Payment Receipt Acknowledgement — ${business.name}*\n\n` +
        `Dear ${customerName},\n` +
        `We have received your payment of *${curr}${advancePaid?.toLocaleString() ?? 0}* against Order *#${orderNumber}* (${garmentName}).\n\n` +
        `• Outstanding Balance: ${curr}${balanceDue?.toLocaleString() ?? 0}\n\n` +
        `Download your formal Tax Invoice & Receipt:\n` +
        `${trackingLink}\n\n` +
        `Thank you for your valued patronage!`
      );

    case 'festival_greeting':
      return (
        `🌟 *Festive Season Greetings from ${business.name}!* 🌟\n\n` +
        `Dear ${customerName},\n` +
        `With wedding and festive celebrations around the corner, our bespoke cutting slots for hand-stitched suits, sherwanis, and couture bridal wear are opening.\n\n` +
        `As our valued patron, book your fitting this week to guarantee delivery ahead of the celebrations.\n\n` +
        `Explore fabric catalogs or book a slot: ${trackingLink}\n\n` +
        `Warm regards,\n` +
        `${business.name}`
      );
  }
}

export function openWhatsAppLink(phone: string, text: string): void {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
