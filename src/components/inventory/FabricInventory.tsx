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
} from 'lucide-react';
import { BusinessProfile, Fabric, HaberdasheryItem } from '../../types';

interface FabricInventoryProps {
  fabrics: Fabric[];
  haberdashery: HaberdasheryItem[];
  business: BusinessProfile;
  onSaveFabric: (fabric: Fabric) => void;
  onSaveHaberdashery: (item: HaberdasheryItem) => void;
}

export const FabricInventory: React.FC<FabricInventoryProps> = ({
  fabrics,
  haberdashery,
  business,
  onSaveFabric,
  onSaveHaberdashery,
}) => {
  const [activeTab, setActiveTab] = useState<'fabrics' | 'haberdashery'>('fabrics');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddFabricOpen, setIsAddFabricOpen] = useState(false);

  // New Fabric Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Fabric['category']>('wool');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1e293b');
  const [newMill, setNewMill] = useState('');
  const [newPrice, setNewPrice] = useState(120);
  const [newCost, setNewCost] = useState(70);
  const [newStockMeters, setNewStockMeters] = useState(30);
  const [newThreshold, setNewThreshold] = useState(10);
  const [newSupplier, setNewSupplier] = useState('');

  const curr = business.currencySymbol;

  const filteredFabrics = fabrics.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.millOrBrand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = fabrics.filter((f) => f.totalStockMeters - f.reservedMeters <= f.minStockThreshold).length;

  const handleAddFabric = (e: React.FormEvent) => {
    e.preventDefault();
    const newFab: Fabric = {
      id: `fab_${Date.now()}`,
      code: newCode.trim().toUpperCase() || `FAB-${Date.now().toString().slice(-4)}`,
      name: newName,
      category: newCategory,
      colorName: newColorName || 'Mélange',
      colorHex: newColorHex,
      pattern: 'solid',
      millOrBrand: newMill || 'Artisan Mill',
      pricePerMeter: newPrice,
      costPerMeter: newCost,
      totalStockMeters: newStockMeters,
      reservedMeters: 0,
      minStockThreshold: newThreshold,
      imageUrl: '/src/assets/images/luxury_fabric_swatches_1793847773732.jpg',
      supplier: newSupplier || 'Textile Supplier Ltd',
    };

    onSaveFabric(newFab);
    setIsAddFabricOpen(false);

    // reset
    setNewCode('');
    setNewName('');
    setNewColorName('');
    setNewMill('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">
            Fabric Bolts &amp; Haberdashery Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time yardage tracking, reservation against cutting orders &amp; haberdashery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('fabrics')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === 'fabrics'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Fabric Rolls ({fabrics.length})
            </button>
            <button
              onClick={() => setActiveTab('haberdashery')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === 'haberdashery'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Haberdashery ({haberdashery.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddFabricOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fabric Roll</span>
          </button>
        </div>
      </div>

      {/* Low stock notice banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Inventory Notice:</strong> {lowStockCount} fabric bolt{lowStockCount > 1 ? 's' : ''} has reached reorder threshold after order reservations.
            </span>
          </div>
          <span className="font-semibold text-amber-800 dark:text-amber-300">
            Supplier purchase orders pending
          </span>
        </div>
      )}

      {/* FABRIC BOLTS TAB */}
      {activeTab === 'fabrics' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search fabric name, code, mill (e.g. Scabal, Loro Piana)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter fabrics by composition"
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Compositions</option>
              <option value="wool">Wool &amp; Worsteds</option>
              <option value="cotton">Egyptian &amp; Giza Cottons</option>
              <option value="linen">Irish Linens</option>
              <option value="silk">Mulberry &amp; Katan Silk</option>
              <option value="tweed">Scottish Tweeds</option>
            </select>
          </div>

          {/* Fabrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFabrics.map((fab) => {
              const availableMeters = Number((fab.totalStockMeters - fab.reservedMeters).toFixed(1));
              const isLowStock = availableMeters <= fab.minStockThreshold;

              return (
                <div
                  key={fab.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all space-y-3"
                >
                  <div>
                    {/* Top Row: Code & Category */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {fab.code}
                      </span>
                      <span className="text-[11px] font-medium capitalize text-slate-700 dark:text-slate-300">
                        {fab.category}
                      </span>
                    </div>

                    {/* Name & Mill */}
                    <div className="mt-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {fab.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {fab.millOrBrand}
                      </p>
                    </div>

                    {/* Swatch & Color Info */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: fab.colorHex }}
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {fab.colorName}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="capitalize text-slate-500">{fab.pattern}</span>
                    </div>
                  </div>

                  {/* Meterage Breakdown */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                      <div>
                        <div className="text-[10px] text-slate-400">Total Bolt</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {fab.totalStockMeters}m
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Reserved</div>
                        <div className="font-mono font-bold text-amber-700 dark:text-amber-400">
                          {fab.reservedMeters}m
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Available</div>
                        <div
                          className={`font-mono font-bold ${
                            isLowStock
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-700 dark:text-emerald-400'
                          }`}
                        >
                          {availableMeters}m
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">Retail / Meter:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {curr}{fab.pricePerMeter}/m
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* HABERDASHERY TAB */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-medium">SKU Code</th>
                  <th className="py-2.5 px-3 font-medium">Haberdashery Item</th>
                  <th className="py-2.5 px-3 font-medium">Category</th>
                  <th className="py-2.5 px-3 font-medium text-right">In Stock</th>
                  <th className="py-2.5 px-3 font-medium text-right">Min Threshold</th>
                  <th className="py-2.5 px-3 font-medium text-right">Unit Cost</th>
                  <th className="py-2.5 px-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {haberdashery.map((item) => {
                  const isLow = item.stockQty <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                        {item.code}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-500">{item.category}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {item.stockQty} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {item.minThreshold} {item.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white">
                        {curr}{item.unitCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isLow ? (
                          <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                            Reorder
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            Adequate
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD FABRIC MODAL */}
      {isAddFabricOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-lg w-full p-5 space-y-4 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Add Fabric Bolt to Inventory
              </h3>
              <button
                onClick={() => setIsAddFabricOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFabric} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Fabric Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCB-150-NVY"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Composition *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  >
                    <option value="wool">Super Wool / Cashmere</option>
                    <option value="cotton">Giza / Egyptian Cotton</option>
                    <option value="linen">Irish Linen</option>
                    <option value="silk">Pure Mulberry Silk</option>
                    <option value="tweed">Heritage Tweed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Fabric Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holland & Sherry Super 160s Target Worsted"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Mill / Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Loro Piana"
                    value={newMill}
                    onChange={(e) => setNewMill(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Navy"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Roll Stock (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newStockMeters}
                    onChange={(e) => setNewStockMeters(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Retail / m ({curr})</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Reorder Alert (m)</label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFabricOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-xs"
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
