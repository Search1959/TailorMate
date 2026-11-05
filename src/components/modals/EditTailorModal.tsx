import React, { useState, useEffect } from 'react';
import { X, Save, Users, Scissors, DollarSign } from 'lucide-react';
import { TailorStaff, BusinessProfile } from '../../types';

interface EditTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailor: TailorStaff | null;
  business: BusinessProfile;
  onSave: (updatedTailor: TailorStaff) => void;
}

export const EditTailorModal: React.FC<EditTailorModalProps> = ({
  isOpen,
  onClose,
  tailor,
  business,
  onSave,
}) => {
  if (!isOpen || !tailor) return null;

  const [name, setName] = useState(tailor.name);
  const [phone, setPhone] = useState(tailor.phone);
  const [email, setEmail] = useState(tailor.email || '');
  const [role, setRole] = useState(tailor.role);
  const [ratePerPiece, setRatePerPiece] = useState(tailor.ratePerPiece);
  const [status, setStatus] = useState(tailor.status);
  const [specialization, setSpecialization] = useState(
    tailor.specialization ? tailor.specialization.join(', ') : ''
  );
  const [emergencyContact, setEmergencyContact] = useState(tailor.emergencyContact || '');

  useEffect(() => {
    if (tailor) {
      setName(tailor.name);
      setPhone(tailor.phone);
      setEmail(tailor.email || '');
      setRole(tailor.role);
      setRatePerPiece(tailor.ratePerPiece);
      setStatus(tailor.status);
      setSpecialization(tailor.specialization ? tailor.specialization.join(', ') : '');
      setEmergencyContact(tailor.emergencyContact || '');
    }
  }, [tailor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = specialization
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);

    const updated: TailorStaff = {
      ...tailor,
      name,
      phone,
      email: email || undefined,
      role: role as any,
      ratePerPiece: Number(ratePerPiece) || 0,
      status: status as any,
      specialization: specs.length ? specs : ['Bespoke Tailoring'],
      emergencyContact: emergencyContact || undefined,
    };

    onSave(updated);
    onClose();
  };

  const curr = business.currencySymbol;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Edit Workshop Artisan
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-bold uppercase">
                  {tailor.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">{tailor.name} • Workshop Team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Artisan Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Workshop Craft Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="master_tailor">Master Tailor & Cutter</option>
                <option value="cutter">Fabric Cutter</option>
                <option value="coat_maker">Coat / Jacket Maker</option>
                <option value="trouser_maker">Trouser Specialist</option>
                <option value="finisher">Finisher & Presser</option>
                <option value="alteration_specialist">Alterations Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Staff Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="active">Active & Present</option>
                <option value="on_leave">On Leave / Vacation</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Stitching Commission Rate ({curr})
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={ratePerPiece}
                onChange={(e) => setRatePerPiece(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & contact phone"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Garment Specializations (comma separated)
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Dinner Jackets, Peak Lapels, Double Breasted, Linen"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Artisan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
