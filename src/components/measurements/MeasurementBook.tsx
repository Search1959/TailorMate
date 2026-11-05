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
  Eye,
  Edit3,
  Trash2,
} from 'lucide-react';
import { GARMENT_TEMPLATES } from '../../data/garmentTemplates';
import { Customer, GarmentCategory, MeasurementProfile } from '../../types';

interface MeasurementBookProps {
  customers: Customer[];
  measurements: MeasurementProfile[];
  onSaveMeasurement: (profile: MeasurementProfile) => void;
  onEditMeasurement?: (profile: MeasurementProfile) => void;
  onDeleteMeasurement?: (profile: MeasurementProfile) => void;
  onPrintMeasurementSheet: (profile: MeasurementProfile, customer: Customer) => void;
}

export const MeasurementBook: React.FC<MeasurementBookProps> = ({
  customers,
  measurements,
  onSaveMeasurement,
  onEditMeasurement,
  onDeleteMeasurement,
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

  const getCategoryColor = (cat: GarmentCategory) => {
    switch (cat) {
      case 'suit':
        return 'border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300';
      case 'shirt':
        return 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300';
      case 'trouser':
        return 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300';
      case 'blazer':
        return 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300';
      case 'kurta':
        return 'border-orange-300 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300';
      default:
        return 'border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Digital Measurement Book &amp; Anatomical Specs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-profile fit repository, posture compensation &amp; historical comparisons
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
              isCompareMode
                ? 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompareMode ? 'Exit Comparison' : 'Compare Old vs New'}</span>
          </button>

          <button
            onClick={handleOpenNewProfile}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
              <span>Selected Bespoke Client</span>
              <User className="w-3.5 h-3.5" />
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setSelectedProfileId('');
                setCompareProfileId('');
              }}
              aria-label="Select Customer"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
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
                  <span className="text-slate-500">Fit Silhouette:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeCustomer.fitPreference}
                  </span>
                </div>
                {activeCustomer.postureNotes && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-xl p-2.5 text-[11px] text-amber-950 dark:text-amber-200">
                    <strong>Posture Profile:</strong> {activeCustomer.postureNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer's Saved Measurement Profiles with Colorful Cards & View/Edit/Delete */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Fit Profiles ({customerProfiles.length})
              </div>
              <button
                onClick={handleOpenNewProfile}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                + New Profile
              </button>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
              {customerProfiles.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-6 text-center">
                  No measurement profiles saved yet for this customer.
                </div>
              ) : (
                customerProfiles.map((prof) => {
                  const isSelected = prof.id === activeProfile?.id;
                  const isCompared = prof.id === compareProfileId;
                  const catTheme = getCategoryColor(prof.garmentCategory);

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
                      className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all shadow-xs ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-transparent border-emerald-500 shadow-sm'
                          : isCompared
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700'
                          : `${catTheme} hover:border-slate-400`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {prof.profileName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                          {prof.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold capitalize text-emerald-700 dark:text-emerald-400">
                          {prof.garmentCategory.replace(/_/g, ' ')}
                        </span>
                        <span>{prof.dateRecorded}</span>
                      </div>

                      {/* INLINE VIEW / EDIT / DELETE ACTION BUTTONS */}
                      <div
                        className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedProfileId(prof.id)}
                            title="View Specs"
                            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors border border-blue-200 dark:border-blue-900"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => onEditMeasurement && onEditMeasurement(prof)}
                            title="Edit Measurements"
                            className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md transition-colors border border-amber-200 dark:border-amber-900"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteMeasurement && onDeleteMeasurement(prof)}
                            title="Delete Profile"
                            className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors border border-rose-200 dark:border-rose-900"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            ● Active
                          </span>
                        )}
                      </div>
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
              {/* Profile Bar with Edit / Delete / Print Buttons */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      {activeProfile.garmentCategory.replace(/_/g, ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Recorded {activeProfile.dateRecorded}</span>
                  </div>
                  <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-1">
                    {activeProfile.profileName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditMeasurement && onEditMeasurement(activeProfile)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Specs</span>
                  </button>

                  <button
                    onClick={() => onDeleteMeasurement && onDeleteMeasurement(activeProfile)}
                    className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
                    title="Delete Measurement Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {activeCustomer && (
                    <button
                      onClick={() => onPrintMeasurementSheet(activeProfile, activeCustomer)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Spec Sheet</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Compare Mode Selector Bar */}
              {isCompareMode && (
                <div className="bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Comparing Against:
                    </span>{' '}
                    <span className="text-blue-800 dark:text-blue-300 font-semibold">
                      {compareProfile ? `${compareProfile.profileName} (${compareProfile.dateRecorded})` : 'Select another profile on the left'}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-blue-400 font-mono">
                    Delta indicator shows difference in {activeProfile.unit}
                  </div>
                </div>
              )}

              {/* Anatomical Specs Grid with Colorful Dimension Cards */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Body Measurements &amp; Allowances ({activeProfile.unit})
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(activeProfile.measurements).map(([key, val]) => {
                    const compareVal = compareProfile?.measurements?.[key];
                    const hasDiff = compareVal !== undefined;
                    const delta = hasDiff ? Number((val - compareVal).toFixed(2)) : 0;

                    const template = GARMENT_TEMPLATES[activeProfile.garmentCategory];
                    const fieldDef = template?.fields.find((f) => f.key === key);
                    const fieldLabel = fieldDef ? fieldDef.label.split('(')[0].trim() : key.replace(/_/g, ' ');

                    return (
                      <div
                        key={key}
                        className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-emerald-400 transition-all shadow-2xs"
                      >
                        <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate capitalize">
                          {fieldLabel}
                        </div>
                        <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                          {val}
                          <span className="text-xs font-normal text-slate-400 ml-1">
                            {activeProfile.unit === 'inches' ? '"' : 'cm'}
                          </span>
                        </div>

                        {/* Comparison delta pill */}
                        {isCompareMode && hasDiff && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono tabular-nums font-bold">
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fitter Notes */}
              {activeProfile.notes && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-emerald-200">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>Fitter &amp; Tailor Special Instructions:</span>
                  </div>
                  <p>{activeProfile.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 italic">
              No active measurement profile selected. Click Record New Specs to start.
            </div>
          )}
        </div>
      </div>

      {/* Record New Profile Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Record New Anatomical Specs
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client: {activeCustomer?.name} ({activeCustomer?.phone})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewProfile} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profile Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Garment Category
                  </label>
                  <select
                    value={newGarmentType}
                    onChange={(e) => handleGarmentTypeChange(e.target.value as GarmentCategory)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="suit">Bespoke Suit</option>
                    <option value="shirt">Custom Dress Shirt</option>
                    <option value="trouser">Tailored Trouser</option>
                    <option value="blazer">Sport Coat / Blazer</option>
                    <option value="kurta">Traditional Kurta</option>
                    <option value="ladies_wear">Ladies Wear</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Body Measurements ({newUnit})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {GARMENT_TEMPLATES[newGarmentType]?.fields.map((field) => (
                    <div
                      key={field.key}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    >
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                        {field.label}
                      </label>
                      <div className="mt-1 flex items-baseline gap-1">
                        <input
                          type="number"
                          step="0.25"
                          value={newFieldValues[field.key] ?? field.defaultValue ?? 0}
                          onChange={(e) =>
                            setNewFieldValues({
                              ...newFieldValues,
                              [field.key]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1 text-xs font-mono font-bold rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {newUnit === 'inches' ? '"' : 'cm'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Posture &amp; Fitter Instructions
                </label>
                <textarea
                  rows={2}
                  value={newPostureNotes}
                  onChange={(e) => setNewPostureNotes(e.target.value)}
                  placeholder="e.g. Erect chest, leave 1.5 in seam allowance for waist adjustment"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
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
