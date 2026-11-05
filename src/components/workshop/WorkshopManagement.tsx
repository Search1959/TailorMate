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
  Eye,
  Edit3,
  Trash2,
  Calendar,
} from 'lucide-react';
import { BusinessProfile, Order, TailorStaff } from '../../types';

interface WorkshopManagementProps {
  tailors: TailorStaff[];
  orders: Order[];
  business: BusinessProfile;
  onSaveTailor: (tailor: TailorStaff) => void;
  onEditTailor?: (tailor: TailorStaff) => void;
  onDeleteTailor?: (tailor: TailorStaff) => void;
  onViewOrder?: (order: Order) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (order: Order) => void;
  onReassignOrder: (orderId: string, tailorId: string, role: 'cutter' | 'tailor') => void;
}

export const WorkshopManagement: React.FC<WorkshopManagementProps> = ({
  tailors,
  orders,
  business,
  onSaveTailor,
  onEditTailor,
  onDeleteTailor,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onReassignOrder,
}) => {
  const [selectedTailorId, setSelectedTailorId] = useState<string>(tailors[0]?.id || '');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [viewingTailor, setViewingTailor] = useState<TailorStaff | null>(null);

  // New staff state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<TailorStaff['role']>('coat_maker' as any);
  const [newPhone, setNewPhone] = useState('');
  const [newRate, setNewRate] = useState(120);

  const curr = business.currencySymbol;

  const totalActiveGarments = orders.filter(
    (o) =>
      o.status === 'stitching_in_progress' ||
      o.status === 'fabric_cutting' ||
      o.status === 'alteration'
  ).length;

  const totalCompletedMonth = tailors.reduce((sum, t) => sum + (t.completedThisMonth || 0), 0);
  const totalEstimatedPayout = tailors.reduce(
    (sum, t) => sum + (t.completedThisMonth || 0) * t.ratePerPiece,
    0
  );

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
      status: 'active' as any,
      specialization: ['Bespoke Construction'],
    };

    onSaveTailor(newStaff);
    setSelectedTailorId(newStaff.id);
    setIsAddStaffOpen(false);

    setNewName('');
    setNewPhone('');
  };

  const handleStatusToggle = (tailor: TailorStaff, newStatus: any) => {
    onSaveTailor({ ...tailor, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            Workshop &amp; Tailor Performance Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Workload distribution, piece-rate earnings ledger &amp; master cutter assignments
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Craftsperson</span>
        </button>
      </div>

      {/* Workshop Summary Colorful KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-white dark:to-slate-900 border-2 border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">Active Workshop Pieces</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-blue-950 dark:text-blue-100">
            {totalActiveGarments}
          </div>
          <div className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1 font-medium">Across cutting &amp; needlework</div>
        </div>

        <div className="bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-white dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Completed This Month</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-emerald-950 dark:text-emerald-100">
            {totalCompletedMonth}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">Passed 14-point QC inspection</div>
        </div>

        <div className="bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:to-slate-900 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Piece-Rate Compensation Pool</div>
          <div className="text-3xl font-bold font-mono tabular-nums text-amber-950 dark:text-amber-100">
            {curr}{totalEstimatedPayout.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1 font-medium">Monthly artisan remuneration</div>
        </div>
      </div>

      {/* Roster & Workload Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Staff Cards (5 cols) with colorful styling & View/Edit/Delete */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Artisans &amp; Specialists ({tailors.length})</span>
            <Scissors className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {tailors.map((tailor) => {
              const isSelected = tailor.id === activeTailor?.id;
              return (
                <div
                  key={tailor.id}
                  onClick={() => setSelectedTailorId(tailor.id)}
                  className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500/15 via-amber-500/5 to-transparent border-orange-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {tailor.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded border border-amber-300 dark:border-amber-800">
                          <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                          {tailor.rating ? tailor.rating.toFixed(1) : '5.0'}
                        </span>
                      </div>
                      <div className="text-[11px] text-orange-700 dark:text-orange-400 font-semibold capitalize mt-0.5">
                        {tailor.role.replace(/_/g, ' ')}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${
                        tailor.status === 'active' || (tailor.status as string) === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {tailor.status}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Rate: <strong className="text-slate-900 dark:text-white font-mono font-bold">{curr}{tailor.ratePerPiece}/pc</strong>
                    </span>
                    <span>
                      Active: <strong className="text-orange-700 dark:text-orange-400 font-mono font-bold">{tailor.activeOrdersCount || 0}</strong>
                    </span>
                    <span>
                      Done: <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{tailor.completedThisMonth || 0}</strong>
                    </span>
                  </div>

                  {/* INLINE VIEW / EDIT / DELETE BUTTONS ON ARTISAN CARD */}
                  <div
                    className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedTailorId(tailor.id)}
                        title="View Artisan Queue"
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 dark:border-blue-900"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onEditTailor && onEditTailor(tailor)}
                        title="Edit Craftsperson"
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md transition-colors border border-amber-200 dark:border-amber-900"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteTailor && onDeleteTailor(tailor)}
                        title="Delete Artisan"
                        className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors border border-rose-200 dark:border-rose-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">{tailor.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Tailor Assigned Queue (7 cols) */}
        <div className="lg:col-span-7">
          {activeTailor ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-2 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold font-serif text-slate-900 dark:text-white">
                    {activeTailor.name}
                  </h2>
                  <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold capitalize">
                    {activeTailor.role.replace(/_/g, ' ')} · {activeTailor.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditTailor && onEditTailor(activeTailor)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 dark:border-amber-800"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => onDeleteTailor && onDeleteTailor(activeTailor)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 dark:border-rose-900"
                    title="Delete Artisan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Assigned Garments Queue with View / Edit / Delete */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Assigned Workbench Garments ({assignedOrders.length})
                </div>

                {assignedOrders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    No active garments currently assigned to {activeTailor.name}.
                  </div>
                ) : (
                  assignedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-orange-400 transition-all bg-white dark:bg-slate-900 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.2 rounded border border-amber-300 dark:border-amber-800">
                            {order.orderNumber}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {order.customerName}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.2 rounded">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 truncate max-w-sm font-medium">
                          {order.items[0]?.title}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right font-mono text-[11px] mr-2">
                          <div className="text-slate-400 text-[10px]">Promised Delivery</div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {order.deliveryDate}
                          </div>
                        </div>

                        <button
                          onClick={() => onViewOrder && onViewOrder(order)}
                          title="View Order"
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditOrder && onEditOrder(order)}
                          title="Edit Order"
                          className="p-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder && onDeleteOrder(order)}
                          title="Delete Order"
                          className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 italic">Select an artisan from the left.</div>
          )}
        </div>
      </div>

      {/* Add New Craftsperson Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Add Craftsperson to Workshop
              </h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Master Giovanni Rossellini"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Craft Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                >
                  <option value="master_tailor">Master Tailor & Cutter</option>
                  <option value="cutter">Master Cutter</option>
                  <option value="coat_maker">Coat / Jacket Specialist</option>
                  <option value="trouser_maker">Trouser Specialist</option>
                  <option value="finisher">Finisher & Hand Presser</option>
                  <option value="alteration_specialist">Alterations Specialist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stitching Piece-Rate ({curr})
                </label>
                <input
                  type="number"
                  min="1"
                  value={newRate}
                  onChange={(e) => setNewRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
                >
                  Register Artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
