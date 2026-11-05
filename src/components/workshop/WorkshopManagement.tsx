import React, { useState } from 'react';
import {
  Scissors,
  UserCheck,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Phone,
  Layers,
  Award,
} from 'lucide-react';
import { BusinessProfile, Order, TailorStaff } from '../../types';

interface WorkshopManagementProps {
  tailors: TailorStaff[];
  orders: Order[];
  business: BusinessProfile;
  onSaveTailor: (tailor: TailorStaff) => void;
  onReassignOrder: (orderId: string, tailorId: string, role: 'cutter' | 'tailor') => void;
}

export const WorkshopManagement: React.FC<WorkshopManagementProps> = ({
  tailors,
  orders,
  business,
  onSaveTailor,
  onReassignOrder,
}) => {
  const [selectedTailorId, setSelectedTailorId] = useState<string>(tailors[0]?.id || '');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // New staff state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<TailorStaff['role']>('coat_tailor');
  const [newPhone, setNewPhone] = useState('');
  const [newRate, setNewRate] = useState(120);

  const curr = business.currencySymbol;

  const totalActiveGarments = orders.filter(
    (o) => o.status === 'stitching_in_progress' || o.status === 'fabric_cutting' || o.status === 'alteration'
  ).length;

  const totalCompletedMonth = tailors.reduce((sum, t) => sum + t.completedThisMonth, 0);
  const totalEstimatedPayout = tailors.reduce((sum, t) => sum + t.completedThisMonth * t.ratePerPiece, 0);

  const activeTailor = tailors.find((t) => t.id === selectedTailorId) || tailors[0];
  const assignedOrders = orders.filter(
    (o) => o.assignedTailorId === activeTailor?.id || o.assignedCutterId === activeTailor?.id
  );

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: TailorStaff = {
      id: `staff_${Date.now()}`,
      name: newName,
      phone: newPhone || '+44 7700 900000',
      role: newRole,
      ratePerPiece: newRate,
      activeOrdersCount: 0,
      completedThisMonth: 0,
      rating: 5.0,
      status: 'available',
    };

    onSaveTailor(newStaff);
    setSelectedTailorId(newStaff.id);
    setIsAddStaffOpen(false);

    setNewName('');
    setNewPhone('');
  };

  const handleStatusToggle = (tailor: TailorStaff, newStatus: TailorStaff['status']) => {
    onSaveTailor({ ...tailor, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Workshop &amp; Tailor Performance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Workload distribution, piece-rate earnings ledger &amp; master cutter assignments
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Craftsperson</span>
        </button>
      </div>

      {/* Workshop Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Active Workshop Pieces</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalActiveGarments}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across cutting &amp; needlework</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Completed This Month</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {totalCompletedMonth}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Passed QC inspection</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Estimated Piece-Rate Payout</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-800 dark:text-amber-300">
            {curr}{totalEstimatedPayout.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Monthly artisan remuneration</div>
        </div>
      </div>

      {/* Roster & Workload Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Staff Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Artisans &amp; Specialists ({tailors.length})
          </div>

          <div className="space-y-2.5">
            {tailors.map((tailor) => {
              const isSelected = tailor.id === activeTailor?.id;
              return (
                <div
                  key={tailor.id}
                  onClick={() => setSelectedTailorId(tailor.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {tailor.name}
                        </span>
                        <span className="text-[10px] font-mono flex items-center text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          {tailor.rating.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 capitalize mt-0.5">
                        {tailor.role.replace(/_/g, ' ')}
                      </div>
                    </div>

                    <select
                      value={tailor.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusToggle(tailor, e.target.value as any)}
                      aria-label="Tailor availability status"
                      className={`text-[11px] font-medium rounded px-1.5 py-0.5 border ${
                        tailor.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : tailor.status === 'busy'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy Queue</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Rate: <strong className="text-slate-900 dark:text-white font-mono">{curr}{tailor.ratePerPiece}/pc</strong>
                    </span>
                    <span>
                      Active: <strong className="text-slate-900 dark:text-white font-mono">{tailor.activeOrdersCount}</strong>
                    </span>
                    <span>
                      Done: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{tailor.completedThisMonth}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Tailor Assigned Queue (7 cols) */}
        <div className="lg:col-span-7">
          {activeTailor ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                    {activeTailor.name}
                  </h2>
                  <p className="text-xs text-slate-500 capitalize">
                    {activeTailor.role.replace(/_/g, ' ')} · {activeTailor.phone}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Monthly Compensation</div>
                  <div className="text-base font-bold font-mono text-amber-800 dark:text-amber-300">
                    {curr}{(activeTailor.completedThisMonth * activeTailor.ratePerPiece).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Assigned Garments Queue */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Assigned Workbench Garments ({assignedOrders.length})
                </div>

                {assignedOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">
                    No active garments currently assigned to {activeTailor.name}.
                  </div>
                ) : (
                  assignedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            {order.orderNumber}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {order.customerName}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            ({order.status.replace(/_/g, ' ')})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate max-w-sm">
                          {order.items[0]?.title}
                        </div>
                      </div>

                      <div className="text-right font-mono text-[11px]">
                        <div className="text-slate-500">Promised Delivery</div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {order.deliveryDate}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Add Craftsperson to Workshop
              </h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Alessandro Rossi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Role / Specialization *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                >
                  <option value="master_cutter">Master Cutter &amp; Pattern Maker</option>
                  <option value="coat_tailor">Coat &amp; Jacket Tailor</option>
                  <option value="trouser_tailor">Trouser Tailor</option>
                  <option value="shirt_specialist">Shirt Specialist</option>
                  <option value="ladies_couturier">Ladies Couturier</option>
                  <option value="finisher_presser">Finisher &amp; Hand-Presser</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+44 7700 900222"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Rate Per Piece ({curr})</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-xs"
                >
                  Save Craftsperson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
