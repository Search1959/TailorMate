import React from 'react';
import {
  LayoutDashboard,
  Scissors,
  Ruler,
  Layers,
  Users,
  UserCheck,
  Receipt,
  Plus,
  Sparkles,
  ExternalLink,
  Moon,
  Sun,
  Store,
  X,
  Shield,
  Briefcase,
  User,
  LogOut,
} from 'lucide-react';
import { AuthUser, BusinessProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentBusiness: BusinessProfile;
  businesses: BusinessProfile[];
  onSelectBusiness: (bizId: string) => void;
  onOpenNewOrder: () => void;
  onOpenAiStylist: () => void;
  isCustomerPortalActive: boolean;
  setIsCustomerPortalActive: (active: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  orderCount?: number;
  currentUser?: AuthUser | null;
  onOpenAuthDemo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentBusiness,
  businesses,
  onSelectBusiness,
  onOpenNewOrder,
  onOpenAiStylist,
  isCustomerPortalActive,
  setIsCustomerPortalActive,
  darkMode,
  setDarkMode,
  mobileOpen,
  setMobileOpen,
  orderCount = 8,
  currentUser,
  onOpenAuthDemo,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Production Orders', icon: Scissors, badge: orderCount },
    { id: 'measurements', label: 'Measurement Book', icon: Ruler },
    { id: 'inventory', label: 'Fabrics & Stock', icon: Layers },
    { id: 'workshop', label: 'Workshop & Tailors', icon: Users },
    { id: 'customers', label: 'Clients CRM', icon: UserCheck },
    { id: 'billing', label: 'Invoices & Billing', icon: Receipt },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand & Quick Action */}
        <div>
          {/* Brand Row */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsCustomerPortalActive(false);
                setCurrentTab('dashboard');
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-700/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-400 border border-amber-600/20 flex items-center justify-center transition-transform group-hover:scale-105">
                <Scissors className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <span className="font-serif text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                  StitchMate
                </span>
                <span className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                  {currentBusiness.branch.split('/')[0].trim()}
                </span>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Order CTA */}
          <div className="p-4 pb-2">
            <button
              onClick={() => {
                onOpenNewOrder();
                setMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Garment</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Atelier Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = !isCustomerPortalActive && currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsCustomerPortalActive(false);
                    setCurrentTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel: Utilities, Branch & Portal */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* AI Bespoke Stylist */}
          <button
            onClick={() => {
              onOpenAiStylist();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/60 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Bespoke Stylist</span>
            </div>
            <span className="text-[10px] font-semibold text-amber-600">Consult</span>
          </button>

          {/* Customer Portal Toggle */}
          <button
            onClick={() => {
              setIsCustomerPortalActive(!isCustomerPortalActive);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              isCustomerPortalActive
                ? 'bg-amber-600 text-white border-amber-700 font-semibold'
                : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <span className="text-[10px] uppercase font-mono">
              {isCustomerPortalActive ? 'Active' : 'View'}
            </span>
          </button>

          {/* Branch Switcher */}
          <div className="pt-1">
            <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
              Active Atelier Branch
            </label>
            <select
              value={currentBusiness.id}
              onChange={(e) => onSelectBusiness(e.target.value)}
              aria-label="Select Atelier Branch"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              {businesses.map((biz) => (
                <option key={biz.id} value={biz.id}>
                  {biz.name} ({biz.currencySymbol})
                </option>
              ))}
            </select>
          </div>

          {/* Active User Card & Demo Switcher */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-3.5 h-3.5" />
                    ) : currentUser.role === 'manager' ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : currentUser.role === 'tailor' ? (
                      <Scissors className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">
                      {currentUser.role}
                    </p>
                  </div>
                </div>

                {onOpenAuthDemo && (
                  <button
                    onClick={() => {
                      onOpenAuthDemo();
                      setMobileOpen(false);
                    }}
                    title="Switch Demo Persona or Sign Out"
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Theme & Profile Footer */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-mono">{businessTypeLabel(currentBusiness.businessType)}</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

function businessTypeLabel(type: string): string {
  switch (type) {
    case 'luxury_atelier':
      return 'Bespoke Atelier';
    case 'mens_tailoring':
      return 'Suiting House';
    case 'ladies_boutique':
      return 'Bridal Couture';
    default:
      return 'Tailoring ERP';
  }
}
