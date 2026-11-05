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
  Eye,
  Edit3,
  Trash2,
  Star,
  FileText,
} from 'lucide-react';
import { BusinessProfile, Customer, Order } from '../../types';

interface CustomerCRMProps {
  customers: Customer[];
  orders: Order[];
  business: BusinessProfile;
  onSaveCustomer: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
  onOpenWhatsApp: (customer: Customer) => void;
  onSelectCustomerMeasurements: (customerId: string) => void;
}

export const CustomerCRM: React.FC<CustomerCRMProps> = ({
  customers,
  orders,
  business,
  onSaveCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
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
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

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
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            Client Directory &amp; CRM
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Profiles, bespoke fit preferences, festival reminders, and lifetime commissions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Main Grid: Directory Left (5 cols) + Client Detail Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients by name, phone or VIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={fitFilter}
                onChange={(e) => setFitFilter(e.target.value)}
                aria-label="Filter by fit preference"
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2.5 text-slate-700 dark:text-slate-300 font-medium"
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

          {/* COLORFUL CLIENT CARDS LIST */}
          <div className="space-y-2.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === activeCustomer?.id;
              const isVipClient = cust.vipStatus;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-400 dark:border-amber-600 shadow-sm'
                      : isVipClient
                      ? 'bg-gradient-to-r from-amber-500/5 to-transparent border-amber-200/80 dark:border-amber-900/50 hover:border-amber-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                          isVipClient
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300'
                        }`}
                      >
                        {cust.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{cust.name}</span>
                          {cust.vipStatus && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-800">
                              <Star className="w-2.5 h-2.5 fill-amber-500" /> VIP
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{cust.phone}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Total Spent</div>
                      <div className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {curr}{cust.totalSpent.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">
                      {cust.fitPreference}
                    </span>
                    {cust.outstandingBalance > 0 ? (
                      <span className="text-amber-700 dark:text-amber-400 font-bold font-mono">
                        Due: {curr}{cust.outstandingBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Paid Full</span>
                    )}
                  </div>

                  {/* INLINE VIEW / EDIT / DELETE BUTTONS ON CUSTOMER CARD */}
                  <div
                    className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedCustomerId(cust.id)}
                        title="View Profile"
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 dark:border-blue-900"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onEditCustomer && onEditCustomer(cust)}
                        title="Edit Client"
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md transition-colors border border-amber-200 dark:border-amber-900"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteCustomer && onDeleteCustomer(cust)}
                        title="Delete Client"
                        className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors border border-rose-200 dark:border-rose-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenWhatsApp(cust)}
                      title="WhatsApp Client"
                      className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Deep Profile */}
        <div className="lg:col-span-7">
          {activeCustomer ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
              {/* Profile Card Header with Rich Gradients & Edit/Delete Action Triggers */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-amber-500/5 to-transparent border-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-serif font-bold text-xl flex items-center justify-center shadow-sm">
                    {activeCustomer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white">
                        {activeCustomer.name}
                      </h2>
                      {activeCustomer.vipStatus && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                          <Star className="w-3 h-3 fill-amber-500" /> VIP Patron
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Registered since {activeCustomer.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {activeCustomer.totalOrdersCount} Bespoke Commissions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditCustomer && onEditCustomer(activeCustomer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => onDeleteCustomer && onDeleteCustomer(activeCustomer)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
                    title="Delete Client Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenWhatsApp(activeCustomer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Contact & Fitting Metadata Cards with colorful accents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200/80 dark:border-blue-900/60 space-y-2">
                  <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
                    <span>Contact Information</span>
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold">{activeCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeCustomer.email || 'No email registered'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <span>{activeCustomer.address || 'Address on file with atelier'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-200/80 dark:border-purple-900/60 space-y-2">
                  <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                    <span>Fit &amp; Milestones</span>
                    <Gift className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    Silhouette: <strong className="font-bold text-purple-950 dark:text-purple-100">{activeCustomer.fitPreference}</strong>
                  </div>
                  {activeCustomer.birthDate && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Gift className="w-3.5 h-3.5 text-purple-600" />
                      <span>Birthday: {activeCustomer.birthDate}</span>
                    </div>
                  )}
                  {activeCustomer.anniversaryDate && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Heart className="w-3.5 h-3.5 text-rose-600" />
                      <span>Anniversary: {activeCustomer.anniversaryDate}</span>
                    </div>
                  )}
                  <button
                    onClick={() => onSelectCustomerMeasurements(activeCustomer.id)}
                    className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/80 rounded-lg transition-colors border border-purple-300 dark:border-purple-800"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Open Anatomical Measurement Book</span>
                  </button>
                </div>
              </div>

              {/* Posture & Fitting Notes */}
              {activeCustomer.postureNotes && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800/80 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Master Cutter Anatomical Notes &amp; Posture Adjustment:</span>
                  </div>
                  <p>{activeCustomer.postureNotes}</p>
                </div>
              )}

              {/* Commission Order History with View, Edit, Delete for each order */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span>Commission Order History ({customerOrders.length})</span>
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                    Outstanding Due: {curr}{activeCustomer.outstandingBalance.toLocaleString()}
                  </span>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    No garment commissions booked for this client yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Order #</th>
                          <th className="py-2.5 px-3">Garment</th>
                          <th className="py-2.5 px-3">Delivery Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Grand Total</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {customerOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                              {ord.orderNumber}
                            </td>
                            <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                              {ord.items[0]?.title || 'Bespoke Item'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                              {ord.deliveryDate}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 capitalize">
                                {ord.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {curr}{ord.pricing.grandTotal.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onViewOrder && onViewOrder(ord)}
                                  title="View Order"
                                  className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onEditOrder && onEditOrder(ord)}
                                  title="Edit Order"
                                  className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteOrder && onDeleteOrder(ord)}
                                  title="Delete Order"
                                  className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 italic">Select a customer from the left.</div>
          )}
        </div>
      </div>

      {/* Add New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Add New Bespoke Client
                  </h3>
                  <p className="text-xs text-slate-500">Record profile, fit preferences and contact details</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Lord Alistair Vance"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+44 7700 900888"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="Defaults to phone if empty"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@mayfair.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fit Silhouette
                  </label>
                  <select
                    value={newFitPreference}
                    onChange={(e) => setNewFitPreference(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Super Slim">Super Slim</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Contemporary Tailored">Contemporary Tailored</option>
                    <option value="Classic Regular">Classic Regular</option>
                    <option value="Relaxed Draped">Relaxed Draped</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isVip}
                      onChange={(e) => setIsVip(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Flag as VIP Priority Client</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="34 Savile Row, Mayfair, London"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Posture &amp; Anatomical Notes (Cutter reference)
                </label>
                <input
                  type="text"
                  value={newPostureNotes}
                  onChange={(e) => setNewPostureNotes(e.target.value)}
                  placeholder="e.g. Erect military posture, low right shoulder (-0.5 in)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
