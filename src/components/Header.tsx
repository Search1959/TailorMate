import React from 'react';
import {
  Menu,
  Scissors,
  Plus,
  Moon,
  Sun,
  UserCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { AuthUser, BusinessProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  currentBusiness: BusinessProfile;
  isCustomerPortalActive: boolean;
  setIsCustomerPortalActive: (active: boolean) => void;
  onOpenNewOrder: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onToggleMobileMenu: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthDemo?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Dashboard Overview',
  orders: 'Production Orders & Workflow',
  measurements: 'Digital Measurement Book',
  inventory: 'Fabric Bolts & Haberdashery Stock',
  workshop: 'Workshop & Tailor Performance',
  customers: 'Client CRM & Preferences',
  billing: 'Invoices, Receipts & Cashflow',
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentBusiness,
  isCustomerPortalActive,
  setIsCustomerPortalActive,
  onOpenNewOrder,
  darkMode,
  setDarkMode,
  onToggleMobileMenu,
  currentUser,
  onOpenAuthDemo,
}) => {
  const pageTitle = isCustomerPortalActive
    ? 'Customer Tracking Portal'
    : TAB_TITLES[currentTab] || 'Atelier Console';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Left Zone: Mobile Menu Toggle + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              aria-label="Open sidebar navigation"
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <span>{currentBusiness.name}</span>
                <span aria-hidden="true">/</span>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">
                  {pageTitle}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold font-serif text-slate-900 dark:text-white leading-tight">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Zone: Contextual Controls & Quick CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isCustomerPortalActive ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800">
                  Client View Active
                </span>
                <button
                  onClick={() => setIsCustomerPortalActive(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors"
                >
                  Return to Atelier ERP
                </button>
              </div>
            ) : (
              <>
                {/* Deinrim Demo / Auth quick button */}
                {onOpenAuthDemo && (
                  <button
                    onClick={onOpenAuthDemo}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors whitespace-nowrap"
                    title="Switch Demo Role or View Deinrim Auth Page"
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="hidden sm:inline">Demo Portal</span>
                    <span className="sm:hidden">Demo</span>
                  </button>
                )}

                <button
                  onClick={() => setIsCustomerPortalActive(true)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Customer Portal</span>
                </button>

                <button
                  onClick={onOpenNewOrder}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Order</span>
                  <span className="sm:hidden">Order</span>
                </button>
              </>
            )}

            {/* Dark mode button on top bar */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
