import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Scissors,
  CheckCircle,
  ExternalLink,
  Gift,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { BusinessProfile, Customer, Order } from '../../types';

interface CustomerCRMProps {
  customers: Customer[];
  orders: Order[];
  business: BusinessProfile;
  onSaveCustomer: (customer: Customer) => void;
  onOpenWhatsApp: (customer: Customer) => void;
  onSelectCustomerMeasurements: (customerId: string) => void;
}

export const CustomerCRM: React.FC<CustomerCRMProps> = ({
  customers,
  orders,
  business,
  onSaveCustomer,
  onOpenWhatsApp,
  onSelectCustomerMeasurements,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fitFilter, setFitFilter] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newFitPreference, setNewFitPreference] = useState<Customer['fitPreference']>('Contemporary Tailored');
  const [newPostureNotes, setNewPostureNotes] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newAnniversaryDate, setNewAnniversaryDate] = useState('');
  const [isVip, setIsVip] = useState(false);

  const curr = business.currencySymbol;

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFit = fitFilter === 'all' || c.fitPreference === fitFilter;
    return matchesSearch && matchesFit;
  });

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerOrders = orders.filter((o) => o.customerId === activeCustomer?.id);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: newName,
      phone: newPhone,
      whatsapp: newWhatsapp || newPhone,
      email: newEmail,
      address: newAddress,
      fitPreference: newFitPreference,
      postureNotes: newPostureNotes,
      birthDate: newBirthDate || undefined,
      anniversaryDate: newAnniversaryDate || undefined,
      vipStatus: isVip,
      tags: isVip ? ['VIP Patron', 'New Member'] : ['New Client'],
      totalOrdersCount: 0,
      totalSpent: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveCustomer(newCustomer);
    setSelectedCustomerId(newCustomer.id);
    setIsAddModalOpen(false);

    // reset
    setNewName('');
    setNewPhone('');
    setNewWhatsapp('');
    setNewEmail('');
    setNewAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Client Directory &amp; CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Profiles, bespoke fit preferences, festival reminders and lifetime purchase history
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Main Grid: Directory Left (5 cols) + Client Detail Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients by name, phone or VIP tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={fitFilter}
                onChange={(e) => setFitFilter(e.target.value)}
                aria-label="Filter by fit preference"
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2 text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Fit Preferences</option>
                <option value="Super Slim">Super Slim</option>
                <option value="Slim Fit">Slim Fit</option>
                <option value="Contemporary Tailored">Contemporary Tailored</option>
                <option value="Classic Regular">Classic Regular</option>
                <option value="Relaxed Draped">Relaxed Draped</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === activeCustomer?.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {cust.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{cust.name}</span>
                          {cust.vipStatus && (
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-950/70 px-1 rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{cust.phone}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Total Spent</div>
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {curr}{cust.totalSpent.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{cust.fitPreference}</span>
                    {cust.outstandingBalance > 0 ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold font-mono">
                        Due: {curr}{cust.outstandingBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">No Dues</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Deep Profile */}
        <div className="lg:col-span-7">
          {activeCustomer ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-700/10 text-amber-800 dark:text-amber-300 font-serif font-bold text-lg flex items-center justify-center border border-amber-600/20">
                    {activeCustomer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white">
                        {activeCustomer.name}
                      </h2>
                      {activeCustomer.vipStatus && (
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          VIP Patron
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Client since {activeCustomer.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeCustomer.totalOrdersCount} Bespoke Commissions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWhatsApp(activeCustomer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onSelectCustomerMeasurements(activeCustomer.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>View Measurements</span>
                  </button>
                </div>
              </div>

              {/* Contact & Fitting Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Contact Details</div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="font-mono">{activeCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{activeCustomer.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{activeCustomer.address}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Fit &amp; Celebrations</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Fit Preference: <strong>{activeCustomer.fitPreference}</strong>
                  </div>
                  {activeCustomer.birthDate && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Gift className="w-3.5 h-3.5 text-purple-600" />
                      <span>Birthday: {activeCustomer.birthDate}</span>
                    </div>
                  )}
                  {activeCustomer.anniversaryDate && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Heart className="w-3.5 h-3.5 text-rose-600" />
                      <span>Anniversary: {activeCustomer.anniversaryDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Posture & Fitting Notes */}
              {activeCustomer.postureNotes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-950 dark:text-amber-200">
                  <div className="font-semibold mb-1">Tailor Posture &amp; Anatomical Notes:</div>
                  <p>{activeCustomer.postureNotes}</p>
                </div>
              )}

              {/* Commission Order History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span>Commission Order History ({customerOrders.length})</span>
                  <span className="font-mono text-slate-500">
                    Outstanding: {curr}{activeCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  {customerOrders.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-4 text-center">
                      No orders logged for this client yet.
                    </div>
                  ) : (
                    customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-500 capitalize">
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                            {order.items[0]?.title}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-semibold text-slate-900 dark:text-white">
                            {curr}{order.pricing.grandTotal.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Del: {order.deliveryDate}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500">
              Select a client to view their bespoke profile
            </div>
          )}
        </div>
      </div>

      {/* ADD NEW CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Add New Client Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Alexander Hamilton"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+44 7700 900142"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Same as phone or custom"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="client@bespoke.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Belgrave Square, London"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Fit Preference</label>
                  <select
                    value={newFitPreference}
                    onChange={(e) => setNewFitPreference(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="Contemporary Tailored">Contemporary Tailored</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Super Slim">Super Slim</option>
                    <option value="Classic Regular">Classic Regular</option>
                    <option value="Relaxed Draped">Relaxed Draped</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={isVip}
                      onChange={(e) => setIsVip(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Mark as VIP Patron</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">
                  Posture &amp; Fit Allowance Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Right shoulder lower by 0.5 inches; prefers watch cuff allowance on left wrist..."
                  value={newPostureNotes}
                  onChange={(e) => setNewPostureNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
