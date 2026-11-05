import React, { useState, useEffect } from 'react';
import { X, Save, Layers, DollarSign } from 'lucide-react';
import { Fabric, BusinessProfile } from '../../types';

interface EditFabricModalProps {
  isOpen: boolean;
  onClose: () => void;
  fabric: Fabric | null;
  business: BusinessProfile;
  onSave: (updatedFabric: Fabric) => void;
}

export const EditFabricModal: React.FC<EditFabricModalProps> = ({
  isOpen,
  onClose,
  fabric,
  business,
  onSave,
}) => {
  if (!isOpen || !fabric) return null;

  const [name, setName] = useState(fabric.name);
  const [fabricCode, setFabricCode] = useState(fabric.code || fabric.fabricCode || '');
  const [brand, setBrand] = useState(fabric.millOrBrand || fabric.brand || '');
  const [mill, setMill] = useState(fabric.mill || '');
  const [color, setColor] = useState(fabric.colorName || fabric.color || '');
  const [pattern, setPattern] = useState(fabric.pattern || 'solid');
  const [composition, setComposition] = useState(fabric.composition || '');
  const [pricePerMeter, setPricePerMeter] = useState(fabric.pricePerMeter);
  const [totalStockMeters, setTotalStockMeters] = useState(fabric.totalStockMeters);
  const [reservedMeters, setReservedMeters] = useState(fabric.reservedMeters);
  const [minStockThreshold, setMinStockThreshold] = useState(fabric.minStockThreshold);
  const [rollLocation, setRollLocation] = useState(fabric.rollLocation || '');
  const [supplierName, setSupplierName] = useState(fabric.supplier || fabric.supplierName || '');

  useEffect(() => {
    if (fabric) {
      setName(fabric.name);
      setFabricCode(fabric.code || fabric.fabricCode || '');
      setBrand(fabric.millOrBrand || fabric.brand || '');
      setMill(fabric.mill || '');
      setColor(fabric.colorName || fabric.color || '');
      setPattern(fabric.pattern || 'solid');
      setComposition(fabric.composition || '');
      setPricePerMeter(fabric.pricePerMeter);
      setTotalStockMeters(fabric.totalStockMeters);
      setReservedMeters(fabric.reservedMeters);
      setMinStockThreshold(fabric.minStockThreshold);
      setRollLocation(fabric.rollLocation || '');
      setSupplierName(fabric.supplier || fabric.supplierName || '');
    }
  }, [fabric]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Fabric = {
      ...fabric,
      name,
      code: fabricCode || fabric.code,
      fabricCode: fabricCode || fabric.code,
      brand,
      millOrBrand: brand,
      mill: mill || undefined,
      color,
      colorName: color,
      pattern: (pattern as any) || 'solid',
      composition: composition || undefined,
      pricePerMeter: Number(pricePerMeter) || 0,
      totalStockMeters: Number(totalStockMeters) || 0,
      reservedMeters: Number(reservedMeters) || 0,
      minStockThreshold: Number(minStockThreshold) || 5,
      rollLocation: rollLocation || undefined,
      supplier: supplierName || fabric.supplier,
      supplierName: supplierName || fabric.supplier,
    };
    onSave(updated);
    onClose();
  };

  const curr = business.currencySymbol;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Edit Fabric Bolt #{fabric.fabricCode}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {fabric.brand} • {fabric.color}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fabric Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fabric Code *
              </label>
              <input
                type="text"
                required
                value={fabricCode}
                onChange={(e) => setFabricCode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brand / Weaver *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mill Origin
              </label>
              <input
                type="text"
                value={mill}
                onChange={(e) => setMill(e.target.value)}
                placeholder="e.g. Biella, Italy / Yorkshire, UK"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Color Shade *
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pattern
              </label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              >
                <option value="solid">Solid</option>
                <option value="pinstripe">Pinstripe</option>
                <option value="glen_plaid">Glen Plaid</option>
                <option value="herringbone">Herringbone</option>
                <option value="jacquard">Jacquard</option>
                <option value="check">Check / Houndstooth</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Composition
              </label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                placeholder="100% Super 130s Wool"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Stock & Metres */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-900/60">
            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Price / Metre ({curr}) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={pricePerMeter}
                onChange={(e) => setPricePerMeter(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Total Stock (M) *
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                value={totalStockMeters}
                onChange={(e) => setTotalStockMeters(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">
                Min Reorder Alert (M)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Warehouse / Rack Location
              </label>
              <input
                type="text"
                value={rollLocation}
                onChange={(e) => setRollLocation(e.target.value)}
                placeholder="e.g. Rack A-12, Upper Tier"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supplier / Merchant
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. Scabal Ltd"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
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
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Fabric</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
