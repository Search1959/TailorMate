import React, { useState } from 'react';
import {
  Ruler,
  Plus,
  GitCompare,
  FileText,
  Printer,
  History,
  User,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
  Check,
  Calendar,
} from 'lucide-react';
import { GARMENT_TEMPLATES } from '../../data/garmentTemplates';
import { Customer, GarmentCategory, MeasurementProfile } from '../../types';

interface MeasurementBookProps {
  customers: Customer[];
  measurements: MeasurementProfile[];
  onSaveMeasurement: (profile: MeasurementProfile) => void;
  onPrintMeasurementSheet: (profile: MeasurementProfile, customer: Customer) => void;
}

export const MeasurementBook: React.FC<MeasurementBookProps> = ({
  customers,
  measurements,
  onSaveMeasurement,
  onPrintMeasurementSheet,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [compareProfileId, setCompareProfileId] = useState<string>('');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // New Profile Form State
  const [newProfileName, setNewProfileName] = useState('');
  const [newGarmentType, setNewGarmentType] = useState<GarmentCategory>('suit');
  const [newUnit, setNewUnit] = useState<'inches' | 'cm'>('inches');
  const [newFieldValues, setNewFieldValues] = useState<Record<string, number>>({});
  const [newPostureNotes, setNewPostureNotes] = useState('');

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const customerProfiles = measurements.filter((m) => m.customerId === activeCustomer?.id);

  // Set default active profile
  const activeProfile =
    customerProfiles.find((p) => p.id === selectedProfileId) || customerProfiles[0];

  const compareProfile = customerProfiles.find((p) => p.id === compareProfileId);

  // Handle open new modal with defaults
  const handleOpenNewProfile = () => {
    const template = GARMENT_TEMPLATES[newGarmentType];
    const initialVals: Record<string, number> = {};
    template.fields.forEach((f) => {
      initialVals[f.key] = f.defaultValue || 0;
    });
    setNewFieldValues(initialVals);
    setNewProfileName(`Bespoke ${template.label} (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`);
    setIsNewModalOpen(true);
  };

  const handleGarmentTypeChange = (type: GarmentCategory) => {
    setNewGarmentType(type);
    const template = GARMENT_TEMPLATES[type];
    const initialVals: Record<string, number> = {};
    template.fields.forEach((f) => {
      initialVals[f.key] = f.defaultValue || 0;
    });
    setNewFieldValues(initialVals);
    setNewProfileName(`Bespoke ${template.label} (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`);
  };

  const handleSaveNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer) return;

    const newProfile: MeasurementProfile = {
      id: `meas_${Date.now()}`,
      customerId: activeCustomer.id,
      profileName: newProfileName || `Bespoke Measurement`,
      garmentCategory: newGarmentType,
      dateRecorded: new Date().toISOString().split('T')[0],
      unit: newUnit,
      measurements: newFieldValues,
      notes: newPostureNotes,
    };

    onSaveMeasurement(newProfile);
    setIsNewModalOpen(false);
    setSelectedProfileId(newProfile.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Digital Measurement Book &amp; Anatomical Specs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-profile fit repository, posture compensation &amp; historical comparisons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isCompareMode
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompareMode ? 'Exit Comparison' : 'Compare Old vs New'}</span>
          </button>

          <button
            onClick={handleOpenNewProfile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Specs</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Customer Selector + Measurement Book */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Selector & Profile List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Customer Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Client
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setSelectedProfileId('');
                setCompareProfileId('');
              }}
              aria-label="Select Customer"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>

            {activeCustomer && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Fit Preference:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activeCustomer.fitPreference}
                  </span>
                </div>
                {activeCustomer.postureNotes && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 rounded-md p-2 text-[11px] text-amber-900 dark:text-amber-200">
                    <strong>Posture Profile:</strong> {activeCustomer.postureNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer's Saved Measurement Profiles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fit Profiles ({customerProfiles.length})
              </div>
              <button
                onClick={handleOpenNewProfile}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                + Add Profile
              </button>
            </div>

            <div className="space-y-2">
              {customerProfiles.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-4 text-center">
                  No measurement profiles saved yet.
                </div>
              ) : (
                customerProfiles.map((prof) => {
                  const isSelected = prof.id === activeProfile?.id;
                  const isCompared = prof.id === compareProfileId;

                  return (
                    <div
                      key={prof.id}
                      onClick={() => {
                        if (isCompareMode && prof.id !== activeProfile?.id) {
                          setCompareProfileId(prof.id);
                        } else {
                          setSelectedProfileId(prof.id);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700'
                          : isCompared
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {prof.profileName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {prof.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="capitalize">{prof.garmentCategory.replace(/_/g, ' ')}</span>
                        <span>{prof.dateRecorded}</span>
                      </div>
                      {isSelected && (
                        <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-1">
                          ● Active Profile
                        </div>
                      )}
                      {isCompared && (
                        <div className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 mt-1">
                          ● Comparison Base
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Spec Sheet Details / Compare View (8 cols) */}
        <div className="lg:col-span-8">
          {activeProfile ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
              {/* Profile Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {activeProfile.garmentCategory.replace(/_/g, ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3 h-3" />
                    <span>Recorded {activeProfile.dateRecorded}</span>
                  </div>
                  <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-0.5">
                    {activeProfile.profileName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {activeCustomer && (
                    <button
                      onClick={() => onPrintMeasurementSheet(activeProfile, activeCustomer)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Cutting Spec Sheet</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Compare Mode Selector Bar */}
              {isCompareMode && (
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      Comparing Against:
                    </span>{' '}
                    <span className="text-blue-800 dark:text-blue-300">
                      {compareProfile ? `${compareProfile.profileName} (${compareProfile.dateRecorded})` : 'Select another profile on the left'}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-blue-400">
                    Delta indicator shows difference in {activeProfile.unit}
                  </div>
                </div>
              )}

              {/* Anatomical Specs Grid */}
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Measurement Specifications ({activeProfile.unit})
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(activeProfile.measurements).map(([key, val]) => {
                    const compareVal = compareProfile?.measurements?.[key];
                    const hasDiff = compareVal !== undefined;
                    const delta = hasDiff ? Number((val - compareVal).toFixed(2)) : 0;

                    // Label lookup
                    const template = GARMENT_TEMPLATES[activeProfile.garmentCategory];
                    const fieldDef = template?.fields.find((f) => f.key === key);
                    const fieldLabel = fieldDef ? fieldDef.label.split('(')[0].trim() : key.replace(/_/g, ' ');

                    return (
                      <div
                        key={key}
                        className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:border-amber-400 transition-colors"
                      >
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate capitalize">
                          {fieldLabel}
                        </div>
                        <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                          {val}
                          <span className="text-xs font-normal text-slate-400 ml-0.5">
                            {activeProfile.unit === 'inches' ? '"' : 'cm'}
                          </span>
                        </div>

                        {/* Comparison delta pill */}
                        {isCompareMode && hasDiff && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono tabular-nums font-semibold">
                            {delta > 0 && (
                              <span className="text-amber-700 dark:text-amber-400 flex items-center">
                                <TrendingUp className="w-3 h-3 mr-0.5" /> +{delta}&quot;
                              </span>
                            )}
                            {delta < 0 && (
                              <span className="text-blue-700 dark:text-blue-400 flex items-center">
                                <TrendingDown className="w-3 h-3 mr-0.5" /> {delta}&quot;
                              </span>
                            )}
                            {delta === 0 && (
                              <span className="text-slate-400 flex items-center">
                                <Minus className="w-3 h-3 mr-0.5" /> 0.0&quot;
                              </span>
                            )}
                            <span className="text-slate-400 text-[10px] ml-auto">
                              (was {compareVal}&quot;)
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Posture & Fitting Notes */}
              {(activeProfile.postureDetails || activeProfile.notes) && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Bespoke Tailor Cutting Notes &amp; Anatomical Posture
                  </div>

                  {activeProfile.postureDetails && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeProfile.postureDetails).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                          <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="font-semibold text-slate-900 dark:text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeProfile.notes && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                      <strong>Cutter Instructions:</strong> {activeProfile.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-xs">
              <Ruler className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Profile Selected
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select a client and fit profile on the left or create a new set of measurement specifications.
              </p>
              <button
                onClick={handleOpenNewProfile}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
              >
                + Record New Measurements
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RECORD NEW MEASUREMENT MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col my-8">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif">
                  Record Measurements — {activeCustomer?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Save a digital measurement profile for cutting, trial, and repeat orders
                </p>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewProfile} className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Garment Category
                  </label>
                  <select
                    value={newGarmentType}
                    onChange={(e) => handleGarmentTypeChange(e.target.value as GarmentCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white"
                  >
                    <option value="suit">Bespoke 2-Pc/3-Pc Suit</option>
                    <option value="shirt">Custom Dress Shirt</option>
                    <option value="trouser">Custom Trouser</option>
                    <option value="blazer">Tailored Blazer</option>
                    <option value="kurta">Kurta / Sherwani</option>
                    <option value="ladies_blouse">Ladies Saree Blouse</option>
                    <option value="ladies_lehenga">Bridal Lehenga</option>
                    <option value="ladies_dress">Ladies Gown / Dress</option>
                    <option value="waistcoat">Waistcoat / Vest</option>
                    <option value="alteration">Alteration Specs</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Profile Label
                  </label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    required
                    placeholder="e.g. Formal Suit 2026"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as 'inches' | 'cm')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white"
                  >
                    <option value="inches">Inches (&quot;)</option>
                    <option value="cm">Centimeters (cm)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Field Inputs based on garment template */}
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Key Anatomical Dimensions ({newUnit})
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {GARMENT_TEMPLATES[newGarmentType].fields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate mb-1">
                        {f.label}
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={newFieldValues[f.key] ?? ''}
                        onChange={(e) =>
                          setNewFieldValues({
                            ...newFieldValues,
                            [f.key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder={f.hint}
                        className="w-full font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Master Cutter Posture Notes &amp; Fit Allowance
                </label>
                <textarea
                  rows={2}
                  value={newPostureNotes}
                  onChange={(e) => setNewPostureNotes(e.target.value)}
                  placeholder="e.g. Left shoulder low by 0.5 inches; athletic chest; watch cuff clearance +0.75..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 rounded-md shadow-xs"
                >
                  Save Measurement Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
