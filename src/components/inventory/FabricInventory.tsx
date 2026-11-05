import React, { useState } from 'react';
import {
  Layers,
  Plus,
  AlertTriangle,
  Search,
  Package,
  Scissors,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { BusinessProfile, Fabric, HaberdasheryItem } from '../../types';

interface FabricInventoryProps {
  fabrics: Fabric[];
  haberdashery: HaberdasheryItem[];
  business: BusinessProfile;
  onSaveFabric: (fabric: Fabric) => void;
  onEditFabric?: (fabric: Fabric) => void;
  onDeleteFabric?: (fabric: Fabric) => void;
  onSaveHaberdashery: (item: HaberdasheryItem) => void;
  onDeleteHaberdashery?: (item: HaberdasheryItem) => void;
}

export const FabricInventory: React.FC<FabricInventoryProps> = ({
  fabrics,
  haberdashery,
  business,
  onSaveFabric,
  onEditFabric,
  onDeleteFabric,
  onSaveHaberdashery,
  onDeleteHaberdashery,
}) => {
  const [activeTab, setActiveTab] = useState<'fabrics' | 'haberdashery'>('fabrics');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddFabricOpen, setIsAddFabricOpen] = useState(false);
  const [viewingFabric, setViewingFabric] = useState<Fabric | null>(null);

  // New Fabric Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('Scabal Ltd');
  const [newCategory, setNewCategory] = useState<string>('wool');
  const [newColor, setNewColor] = useState('Midnight Navy');
  const [newMill, setNewMill] = useState('');
  const [newPrice, setNewPrice] = useState(120);
  const [newStockMeters, setNewStockMeters] = useState(30);
  const [newThreshold, setNewThreshold] = useState(10);
  const [newSupplier, setNewSupplier] = useState('');

  const curr = business.currencySymbol;

  const filteredFabrics = fabrics.filter((f) => {
    const code = f.code || f.fabricCode || '';
    const brand = f.millOrBrand || f.brand || '';
    const mill = f.mill || '';
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' ||
      f.category === categoryFilter ||
      brand.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = fabrics.filter((f) => f.totalStockMeters - f.reservedMeters <= f.minStockThreshold).length;

  const handleAddFabric = (e: React.FormEvent) => {
    e.preventDefault();
    const fabCode = newCode.trim().toUpperCase() || `FAB-${Date.now().toString().slice(-4)}`;
    const newFab: Fabric = {
      id: `fab_${Date.now()}`,
      code: fabCode,
      fabricCode: fabCode,
      name: newName,
      category: 'wool',
      brand: newBrand,
      millOrBrand: newBrand,
      mill: newMill || 'Artisan Mill, Yorkshire',
      colorName: newColor || 'Navy Blue',
      colorHex: '#1e293b',
      color: newColor || 'Navy Blue',
      pattern: 'solid',
      composition: '100% Super 130s Wool',
      pricePerMeter: newPrice,
      costPerMeter: 60,
      totalStockMeters: newStockMeters,
      reservedMeters: 0,
      minStockThreshold: newThreshold,
      supplier: newSupplier || 'Merchant Imports Ltd',
      supplierName: newSupplier || 'Merchant Imports Ltd',
    };

    onSaveFabric(newFab);
    setIsAddFabricOpen(false);

    // reset
    setNewCode('');
    setNewName('');
    setNewColor('');
    setNewMill('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            Fabric Bolts &amp; Haberdashery Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time yardage tracking, reservation against cutting orders &amp; haberdashery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('fabrics')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'fabrics'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Fabric Rolls ({fabrics.length})
            </button>
            <button
              onClick={() => setActiveTab('haberdashery')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'haberdashery'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Haberdashery ({haberdashery.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddFabricOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fabric Roll</span>
          </button>
        </div>
      </div>

      {/* Low stock notice banner */}
      {lowStockCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 dark:from-amber-950/40 dark:to-rose-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Reorder Alert:</strong> {lowStockCount} fabric bolt(s) are at or below safety stock threshold.
            </span>
          </div>
          <span className="font-bold text-amber-800 dark:text-amber-300 font-mono">
            {lowStockCount} Bolt(s) Low
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fabrics by code, brand, mill or color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {activeTab === 'fabrics' && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Brands &amp; Mills</option>
            <option value="scabal">Scabal</option>
            <option value="loropiana">Loro Piana</option>
            <option value="dormeuil">Dormeuil</option>
            <option value="holland">Holland &amp; Sherry</option>
            <option value="zegna">Ermenegildo Zegna</option>
          </select>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'fabrics' ? (
        /* COLORFUL FABRIC BOLT CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFabrics.map((fab) => {
            const availableMeters = Number((fab.totalStockMeters - fab.reservedMeters).toFixed(1));
            const isLowStock = availableMeters <= fab.minStockThreshold;
            const stockPct = Math.min(100, Math.max(0, (availableMeters / fab.totalStockMeters) * 100));

            return (
              <div
                key={fab.id}
                className={`bg-white dark:bg-slate-900 border-2 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all space-y-3 ${
                  isLowStock
                    ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600'
                }`}
              >
                <div>
                  {/* Top Row: Code & Brand Tag */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      {fab.code || fab.fabricCode}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {fab.millOrBrand || fab.brand}
                    </span>
                  </div>

                  {/* Name & Mill */}
                  <div className="mt-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {fab.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {fab.mill || fab.millOrBrand || 'Mayfair Atelier Stock'}
                    </p>
                  </div>

                  {/* Color & Pattern Info */}
                  <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 border border-slate-300 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{fab.colorName || fab.color}</span>
                    </div>
                    <span className="text-slate-500 capitalize">{fab.pattern || 'Solid'}</span>
                  </div>
                </div>

                {/* Meterage Breakdown & Stock Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {/* Stock Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Stock Availability:</span>
                      <span
                        className={`font-bold font-mono ${
                          isLowStock ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {availableMeters}m / {fab.totalStockMeters}m
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Retail Price:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {curr}{fab.pricePerMeter}/meter
                    </span>
                  </div>

                  {/* ACTION BUTTONS: VIEW, EDIT, DELETE */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingFabric(fab)}
                        title="View Fabric Specs"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-900"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => onEditFabric && onEditFabric(fab)}
                        title="Edit Bolt"
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 dark:border-amber-900"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteFabric && onDeleteFabric(fab)}
                        title="Delete Bolt"
                        className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {fab.rollLocation || 'Rack A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* HABERDASHERY TAB WITH VIEW, EDIT, DELETE BUTTONS */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-3">SKU Code</th>
                  <th className="py-3 px-3">Haberdashery Item</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">In Stock</th>
                  <th className="py-3 px-3 text-right">Min Threshold</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {haberdashery.map((item) => {
                  const isLow = item.stockQty <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-purple-50/30 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-purple-700 dark:text-purple-400">
                        {item.sku}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600 dark:text-slate-400 font-medium">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {item.stockQty} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {item.minThreshold} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {curr}{item.costPerUnit}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Adequate
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              // Quick restock prompt
                              const addAmount = prompt(`Add stock to ${item.name}:`, '50');
                              if (addAmount && !isNaN(Number(addAmount))) {
                                onSaveHaberdashery({
                                  ...item,
                                  stockQty: item.stockQty + Number(addAmount),
                                });
                              }
                            }}
                            title="Restock / Edit Stock"
                            className="px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-md border border-amber-200 dark:border-amber-900"
                          >
                            + Restock
                          </button>
                          <button
                            onClick={() => onDeleteHaberdashery && onDeleteHaberdashery(item)}
                            title="Delete Item"
                            className="p-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Fabric Details Quick Modal */}
      {viewingFabric && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  {viewingFabric.code || viewingFabric.fabricCode}
                </span>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  {viewingFabric.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingFabric(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Brand / Merchant:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingFabric.millOrBrand || viewingFabric.brand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Mill Origin:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingFabric.mill || viewingFabric.millOrBrand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Color Shade:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingFabric.colorName || viewingFabric.color}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Pattern &amp; Category:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {viewingFabric.pattern} · {viewingFabric.category}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Stock Bolt:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {viewingFabric.totalStockMeters} Meters
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Allocated to Orders:</span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                  {viewingFabric.reservedMeters} Meters
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Current Net Available:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {Number((viewingFabric.totalStockMeters - viewingFabric.reservedMeters).toFixed(1))} Meters
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Price / Meter:</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-400 text-sm">
                  {curr}{viewingFabric.pricePerMeter}/m
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewingFabric(null);
                  if (onEditFabric) onEditFabric(viewingFabric);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 hover:bg-amber-200 rounded-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bolt</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingFabric(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Fabric Modal */}
      {isAddFabricOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col my-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Add Fabric Bolt to Inventory
                  </h3>
                  <p className="text-xs text-slate-500">Record weaver brand, yardage and price</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddFabricOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFabric} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fabric Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Royal Merino Super 130s"
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
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="SCB-7042"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Weaver
                  </label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Scabal / Loro Piana"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Color Shade
                  </label>
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Midnight Navy / Charcoal"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price / Metre ({curr})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock (M)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newStockMeters}
                    onChange={(e) => setNewStockMeters(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Alert (M)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFabricOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors"
                >
                  Save Fabric Bolt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
