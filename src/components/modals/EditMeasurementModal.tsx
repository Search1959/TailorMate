import React, { useState, useEffect } from 'react';
import { X, Save, Ruler, CheckCircle2 } from 'lucide-react';
import { MeasurementProfile, Customer, GarmentCategory } from '../../types';
import { GARMENT_TEMPLATES } from '../../data/garmentTemplates';

interface EditMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurement: MeasurementProfile | null;
  customer?: Customer;
  onSave: (updatedProfile: MeasurementProfile) => void;
}

export const EditMeasurementModal: React.FC<EditMeasurementModalProps> = ({
  isOpen,
  onClose,
  measurement,
  customer,
  onSave,
}) => {
  if (!isOpen || !measurement) return null;

  const [profileName, setProfileName] = useState(measurement.profileName);
  const [unit, setUnit] = useState<'inches' | 'cm'>(measurement.unit);
  const [postureNotes, setPostureNotes] = useState(measurement.notes || '');
  const [measurements, setMeasurements] = useState<Record<string, number>>(measurement.measurements || {});

  useEffect(() => {
    if (measurement) {
      setProfileName(measurement.profileName);
      setUnit(measurement.unit);
      setPostureNotes(measurement.notes || '');
      setMeasurements(measurement.measurements || {});
    }
  }, [measurement]);

  const template = GARMENT_TEMPLATES[measurement.garmentCategory] || Object.values(GARMENT_TEMPLATES)[0];

  const handleValueChange = (fieldKey: string, val: string) => {
    const num = parseFloat(val);
    setMeasurements((prev) => ({
      ...prev,
      [fieldKey]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MeasurementProfile = {
      ...measurement,
      profileName,
      unit,
      notes: postureNotes || undefined,
      measurements,
      dateRecorded: new Date().toISOString().split('T')[0],
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Edit Measurement Profile
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                  {measurement.garmentCategory}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {customer?.name || 'Customer'} • Recorded {measurement.dateRecorded}
              </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profile Title / Garment Style *
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Measurement Unit
              </label>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setUnit('inches')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    unit === 'inches'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    unit === 'cm'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Posture & Alignment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'normal', label: 'Normal / Standard' },
                { id: 'erect', label: 'Erect (Military)' },
                { id: 'stooped', label: 'Stooped (Forward)' },
                { id: 'sloping_shoulders', label: 'Sloping Shoulders' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPostureNotes((prev) => (prev ? `${prev}, Posture: ${p.label}` : `Posture: ${p.label}`))}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400 text-left transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Fields Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Body Measurements ({unit})
              </span>
              <span className="text-[11px] text-slate-400">Click any field to adjust</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {template.fields.map((field) => {
                const curVal = measurements[field.key] ?? field.defaultValue;
                return (
                  <div
                    key={field.key}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:border-emerald-400 transition-colors"
                  >
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                      {field.label}
                    </label>
                    <div className="mt-1 flex items-baseline gap-1">
                      <input
                        type="number"
                        step="0.25"
                        value={curVal || ''}
                        onChange={(e) => handleValueChange(field.key, e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono font-bold rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fitter Notes & Allowance Directives
            </label>
            <textarea
              rows={2}
              value={postureNotes}
              onChange={(e) => setPostureNotes(e.target.value)}
              placeholder="e.g. Leave +1.5 inches at waist for seasonal change. Double pleat ease."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Measurements</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
