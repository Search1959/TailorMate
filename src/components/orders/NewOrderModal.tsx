import React, { useState } from 'react';
import {
  X,
  Scissors,
  User,
  Calendar,
  Sparkles,
  CreditCard,
  Layers,
  Ruler,
  AlertCircle,
} from 'lucide-react';
import { GARMENT_TEMPLATES } from '../../data/garmentTemplates';
import {
  BusinessProfile,
  Customer,
  Fabric,
  GarmentCategory,
  MeasurementProfile,
  Order,
  OrderItem,
  TailorStaff,
} from '../../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  customers: Customer[];
  fabrics: Fabric[];
  tailors: TailorStaff[];
  measurements: MeasurementProfile[];
  onSaveOrder: (order: Order) => void;
  onQuickAddCustomer: (customer: Customer) => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  business,
  customers,
  fabrics,
  tailors,
  measurements,
  onSaveOrder,
  onQuickAddCustomer,
}) => {
  const curr = business.currencySymbol;

  // Selected Customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [isQuickAddCustomer, setIsQuickAddCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // Garment & Fabric
  const [garmentType, setGarmentType] = useState<GarmentCategory>('suit');
  const [garmentTitle, setGarmentTitle] = useState('Bespoke 2-Piece Suit');
  const [quantity, setQuantity] = useState(1);
  const [customerFabricProvided, setCustomerFabricProvided] = useState(false);
  const [selectedFabricId, setSelectedFabricId] = useState<string>(fabrics[0]?.id || '');
  const [metersUsed, setMetersUsed] = useState(GARMENT_TEMPLATES['suit'].typicalMetersRequired);

  // Measurement Profile
  const [selectedMeasId, setSelectedMeasId] = useState<string>('');

  // Style Specs
  const [collarType, setCollarType] = useState('');
  const [lapelType, setLapelType] = useState('');
  const [ventType, setVentType] = useState('');
  const [pocketType, setPocketType] = useState('');
  const [liningType, setLiningType] = useState('');
  const [buttonType, setButtonType] = useState('');
  const [monogramText, setMonogramText] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Dates & Staff
  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [trialDate, setTrialDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [urgency, setUrgency] = useState<'standard' | 'express' | 'super_rush'>('standard');
  const [assignedCutterId, setAssignedCutterId] = useState(
    tailors.find((t) => t.role === 'master_cutter')?.id || ''
  );
  const [assignedTailorId, setAssignedTailorId] = useState(
    tailors.find((t) => t.role === 'coat_tailor')?.id || ''
  );

  // Pricing
  const [unitStitchingPrice, setUnitStitchingPrice] = useState(450);
  const [advancePaid, setAdvancePaid] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'bank_transfer'>('card');

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerMeasurements = measurements.filter((m) => m.customerId === currentCustomer?.id);
  const selectedFabric = fabrics.find((f) => f.id === selectedFabricId);

  // Auto update garment defaults
  const handleGarmentChange = (type: GarmentCategory) => {
    setGarmentType(type);
    const template = GARMENT_TEMPLATES[type];
    setGarmentTitle(`Bespoke ${template.label}`);
    setMetersUsed(template.typicalMetersRequired);

    if (type === 'suit') setUnitStitchingPrice(550);
    else if (type === 'shirt') setUnitStitchingPrice(80);
    else if (type === 'trouser') setUnitStitchingPrice(95);
    else if (type === 'blazer') setUnitStitchingPrice(380);
    else if (type === 'kurta') setUnitStitchingPrice(240);
    else if (type === 'ladies_blouse') setUnitStitchingPrice(160);
    else if (type === 'ladies_lehenga') setUnitStitchingPrice(650);
    else if (type === 'alteration') setUnitStitchingPrice(45);
    else setUnitStitchingPrice(150);
  };

  // Pricing calculations
  const fabricUnitPrice = customerFabricProvided
    ? 0
    : (selectedFabric ? selectedFabric.pricePerMeter * metersUsed : 0);
  const stitchingTotal = unitStitchingPrice * quantity;
  const fabricTotal = fabricUnitPrice * quantity;
  const rushSurcharge = urgency === 'super_rush' ? 100 : urgency === 'express' ? 40 : 0;
  const taxableAmount = stitchingTotal + fabricTotal + rushSurcharge;
  const taxAmount = Number(((taxableAmount * business.taxRatePercent) / 100).toFixed(2));
  const grandTotal = taxableAmount + taxAmount;
  const balanceDue = Math.max(0, grandTotal - advancePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCustomerId = selectedCustomerId;
    let finalCustomerName = currentCustomer?.name || 'Customer';
    let finalCustomerPhone = currentCustomer?.phone || '';
    let finalCustomerWhatsapp = currentCustomer?.whatsapp || currentCustomer?.phone || '';

    // Quick add customer if toggled
    if (isQuickAddCustomer && newCustName.trim()) {
      const newCust: Customer = {
        id: `cust_${Date.now()}`,
        name: newCustName.trim(),
        phone: newCustPhone.trim() || '+44 7700 900000',
        whatsapp: newCustPhone.trim() || '+44 7700 900000',
        email: newCustEmail.trim() || 'client@example.com',
        address: 'Bespoke Client Address',
        fitPreference: 'Contemporary Tailored',
        vipStatus: false,
        tags: ['New Client'],
        totalOrdersCount: 1,
        totalSpent: grandTotal,
        outstandingBalance: balanceDue,
        createdAt: todayStr,
      };
      onQuickAddCustomer(newCust);
      finalCustomerId = newCust.id;
      finalCustomerName = newCust.name;
      finalCustomerPhone = newCust.phone;
      finalCustomerWhatsapp = newCust.whatsapp;
    }

    const orderNumCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${orderNumCode}`;
    const trackingCode = `STM-${orderNumCode}`;

    const orderItem: OrderItem = {
      id: `item_${Date.now()}`,
      garmentType,
      title: garmentTitle,
      quantity,
      fabricId: customerFabricProvided ? undefined : selectedFabric?.id,
      fabricName: customerFabricProvided ? 'Client Provided Fabric' : selectedFabric?.name,
      fabricMetersUsed: metersUsed * quantity,
      customerFabricProvided,
      measurementProfileId: selectedMeasId || undefined,
      styleSpecs: {
        collarType: collarType || undefined,
        lapelType: lapelType || undefined,
        ventType: ventType || undefined,
        pocketType: pocketType || undefined,
        liningType: liningType || undefined,
        buttonType: buttonType || undefined,
        monogramText: monogramText || undefined,
        customNotes: customNotes || undefined,
      },
      unitStitchingPrice,
      unitFabricPrice: fabricUnitPrice,
      subtotal: stitchingTotal + fabricTotal,
    };

    const assignedCutter = tailors.find((t) => t.id === assignedCutterId);
    const assignedTailor = tailors.find((t) => t.id === assignedTailorId);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      trackingCode,
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      customerWhatsapp: finalCustomerWhatsapp,
      bookingDate,
      trialDate: trialDate || undefined,
      deliveryDate: deliveryDate || todayStr,
      status: 'order_received',
      urgency,
      items: [orderItem],
      assignedCutterId: assignedCutter?.id,
      assignedCutterName: assignedCutter?.name,
      assignedTailorId: assignedTailor?.id,
      assignedTailorName: assignedTailor?.name,
      pricing: {
        stitchingTotal,
        fabricTotal,
        rushSurcharge,
        discountAmount: 0,
        taxableAmount,
        taxAmount,
        grandTotal,
        advancePaid,
        balanceDue,
      },
      payments:
        advancePaid > 0
          ? [
              {
                id: `pay_${Date.now()}`,
                date: bookingDate,
                amount: advancePaid,
                method: paymentMethod,
                receiptNo: `REC-${new Date().getFullYear()}-${orderNumCode}`,
                notes: 'Booking advance payment',
              },
            ]
          : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveOrder(newOrder);
    onClose();
  };

  const styleOpts = GARMENT_TEMPLATES[garmentType].styleOptions;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col my-6">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400 flex items-center justify-center border border-amber-600/20">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                Book Bespoke Garment Order
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate cutting job card, calculate fabric roll allocation and log initial advance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* SECTION 1: Client Selection */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                1. Client Selection
              </span>
              <button
                type="button"
                onClick={() => setIsQuickAddCustomer(!isQuickAddCustomer)}
                className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
              >
                {isQuickAddCustomer ? '← Select Existing Client' : '+ Quick Add New Client'}
              </button>
            </div>

            {!isQuickAddCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Select Client
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.phone} {c.vipStatus ? '★ VIP' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Digital Measurement Spec
                  </label>
                  <select
                    value={selectedMeasId}
                    onChange={(e) => setSelectedMeasId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                  >
                    <option value="">Select or use latest specs</option>
                    {customerMeasurements.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.profileName} ({m.dateRecorded})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Alexander Hamilton"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+44 7700 900111"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@luxury.co.uk"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Garment & Fabric Specification */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg space-y-3">
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
              2. Garment &amp; Fabric Specification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Garment Category
                </label>
                <select
                  value={garmentType}
                  onChange={(e) => handleGarmentChange(e.target.value as GarmentCategory)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                >
                  <option value="suit">Bespoke 2-Pc/3-Pc Suit</option>
                  <option value="shirt">Custom Dress Shirt</option>
                  <option value="trouser">Custom Trouser / Chino</option>
                  <option value="blazer">Tailored Blazer</option>
                  <option value="kurta">Kurta / Sherwani</option>
                  <option value="ladies_blouse">Couture Saree Blouse</option>
                  <option value="ladies_lehenga">Bridal Lehenga</option>
                  <option value="ladies_dress">Bespoke Evening Gown</option>
                  <option value="waistcoat">Bespoke Waistcoat</option>
                  <option value="alteration">Alteration &amp; Repair</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Garment Description
                </label>
                <input
                  type="text"
                  value={garmentTitle}
                  onChange={(e) => setGarmentTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-600 dark:text-slate-400">Fabric Source</label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={customerFabricProvided}
                      onChange={(e) => setCustomerFabricProvided(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Client provided fabric</span>
                  </label>
                </div>

                {!customerFabricProvided ? (
                  <select
                    value={selectedFabricId}
                    onChange={(e) => setSelectedFabricId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                  >
                    {fabrics.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.code}) — {curr}{f.pricePerMeter}/m ({f.totalStockMeters - f.reservedMeters}m avail)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Note client fabric characteristics (e.g. Silk brocade with gold border)..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Fabric Meterage Required
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={metersUsed}
                  onChange={(e) => setMetersUsed(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Tailoring Style Specifications */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg space-y-3">
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
              3. Bespoke Style Detailing
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {styleOpts.lapels && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Lapel Style</label>
                  <select
                    value={lapelType}
                    onChange={(e) => setLapelType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="">Default Lapel</option>
                    {styleOpts.lapels.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {styleOpts.collars && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Collar / Neck</label>
                  <select
                    value={collarType}
                    onChange={(e) => setCollarType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="">Standard Collar</option>
                    {styleOpts.collars.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {styleOpts.vents && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Vents / Waistband</label>
                  <select
                    value={ventType}
                    onChange={(e) => setVentType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="">Standard</option>
                    {styleOpts.vents.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {styleOpts.pockets && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Pockets</label>
                  <select
                    value={pocketType}
                    onChange={(e) => setPocketType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="">Standard Pockets</option>
                    {styleOpts.pockets.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {styleOpts.buttons && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Buttons</label>
                  <select
                    value={buttonType}
                    onChange={(e) => setButtonType(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="">Standard Buttons</option>
                    {styleOpts.buttons.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Monogram / Embroidery
                </label>
                <input
                  type="text"
                  placeholder="e.g. Initials 'A.W.' on cuff"
                  value={monogramText}
                  onChange={(e) => setMonogramText(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Production Timeline & Workshop Assignment */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 rounded-lg space-y-3">
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
              4. Workshop Schedule &amp; Staff Assignment
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Booking Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">First Trial Date</label>
                <input
                  type="date"
                  value={trialDate}
                  onChange={(e) => setTrialDate(e.target.value)}
                  className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-medium"
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express (+{curr}40)</option>
                  <option value="super_rush">Super Rush (+{curr}100)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Master Cutter
                </label>
                <select
                  value={assignedCutterId}
                  onChange={(e) => setAssignedCutterId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                >
                  <option value="">Unassigned</option>
                  {tailors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role.replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Stitching Tailor
                </label>
                <select
                  value={assignedTailorId}
                  onChange={(e) => setAssignedTailorId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
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
          </div>

          {/* SECTION 5: Commercial Breakdown & Advance Receipt */}
          <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg space-y-3">
            <span className="font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[11px] block">
              5. Commercial Quotation &amp; Advance Payment
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Stitching Labor ({curr})
                </label>
                <input
                  type="number"
                  value={unitStitchingPrice}
                  onChange={(e) => setUnitStitchingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Fabric Total ({curr})
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${curr}${fabricTotal.toFixed(2)}`}
                  className="w-full font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-600 dark:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Advance Paid ({curr})
                </label>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-bold text-emerald-700 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                >
                  <option value="card">Card Terminal</option>
                  <option value="upi">UPI / QR Scan</option>
                  <option value="cash">Cash in Hand</option>
                  <option value="bank_transfer">Wire / Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Calculations Banner */}
            <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60 flex items-center justify-between text-xs">
              <div className="text-slate-600 dark:text-slate-400">
                Taxable: <span className="font-mono">{curr}{taxableAmount.toFixed(2)}</span> + {business.taxLabel} ({business.taxRatePercent}%):{' '}
                <span className="font-mono">{curr}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white mr-4">
                  Grand Total: <span className="font-mono">{curr}{grandTotal.toFixed(2)}</span>
                </span>
                <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
                  Balance Due: <span className="font-mono">{curr}{balanceDue.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors"
            >
              Confirm &amp; Generate Job Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
