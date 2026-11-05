import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Briefcase,
  Scissors,
  User,
  RotateCcw,
  LogOut,
  ChevronDown,
  Check,
} from 'lucide-react';
import { AuthUser } from '../../types';

interface LiveDemoBarProps {
  currentUser: AuthUser;
  onSwitchRole: (role: 'admin' | 'manager' | 'tailor' | 'customer') => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const LiveDemoBar: React.FC<LiveDemoBarProps> = ({
  currentUser,
  onSwitchRole,
  onResetData,
  onLogout,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const roles = [
    {
      id: 'admin' as const,
      label: 'Boutique Administrator',
      email: 'admin@deinrimapp.in',
      icon: Shield,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Full ERP access, billing, analytics & staff control',
    },
    {
      id: 'manager' as const,
      label: 'Store Manager',
      email: 'manager@deinrimapp.in',
      icon: Briefcase,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      description: 'Client CRM, fabric booking, invoices & trial dates',
    },
    {
      id: 'tailor' as const,
      label: 'Master Tailor & Cutter',
      email: 'tailor@deinrimapp.in',
      icon: Scissors,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Workshop cutting queue, anatomy specs & piece ledger',
    },
    {
      id: 'customer' as const,
      label: 'Client Tracking View',
      email: 'tracking@stm-8491',
      icon: User,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      description: 'Live order status for STM-8491 as seen by clients',
    },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentUser.role) || roles[0];
  const CurrentIcon = currentRoleObj.icon;

  const handleResetClick = () => {
    if (window.confirm('Reset all demo orders, fabric rolls, customers and measurements to initial state?')) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <aside aria-label="Demo mode control bar" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs border-b border-indigo-900/60 shadow-inner px-4 py-1.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Live Demo Indicator & System Identity */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-semibold text-[11px] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DEINRIM BOUTIQUE ERP • LIVE DEMO</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span>Active Session:</span>
            <span className="font-medium text-white">{currentUser.name}</span>
            <span className="text-slate-400 text-[10px]">({currentUser.email})</span>
          </div>
        </div>

        {/* Center / Right: Quick Role Switcher + Utilities */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${currentRoleObj.badgeColor} hover:brightness-110`}
              title="Click to switch demo role instantly"
            >
              <CurrentIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">{currentRoleObj.label}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-slate-300" />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Demo Persona
                  </div>
                  {roles.map((r) => {
                    const RoleIcon = r.icon;
                    const isSelected = currentUser.role === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSwitchRole(r.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-800/80 transition-colors ${
                          isSelected ? 'bg-indigo-950/60 text-amber-300' : 'text-slate-200'
                        }`}
                      >
                        <RoleIcon
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isSelected ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white">
                              {r.label}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight truncate">
                            {r.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={handleResetClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              resetSuccess
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Reset sample orders, fabrics & customers back to factory demo defaults"
          >
            <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
            <span>{resetSuccess ? 'Data Reset!' : 'Reset Demo'}</span>
          </button>

          {/* Exit Demo / Sign Out */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 transition-colors"
            title="Exit demo session and return to Deinrim Auth & Live Demo Portal"
          >
            <LogOut className="w-3 h-3 text-red-300" />
            <span className="hidden sm:inline">Exit Demo</span>
            <span className="sm:hidden">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
