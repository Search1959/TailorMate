import React, { useState } from 'react';
import {
  Scissors,
  Shield,
  Briefcase,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Ruler,
  Layers,
  Receipt,
  MessageSquare,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Info,
  Sun,
  Moon,
} from 'lucide-react';
import { AuthUser, BusinessProfile } from '../../types';

interface BoutiqueAuthPageProps {
  initialTab?: 'demo' | 'login';
  onLogin: (user: AuthUser) => void;
  onResetData: () => void;
  business: BusinessProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const BoutiqueAuthPage: React.FC<BoutiqueAuthPageProps> = ({
  initialTab = 'demo',
  onLogin,
  onResetData,
  business,
  darkMode,
  setDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'login'>(initialTab);

  // Form states for standard login
  const [email, setEmail] = useState('admin@deinrimapp.in');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Standard login submission handler
  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanEmail = email.trim().toLowerCase();

      if (cleanEmail === 'admin@deinrimapp.in' || cleanEmail.includes('admin')) {
        onLogin({
          id: 'user_admin',
          name: 'Devendra Kumar (Proprietor)',
          email: 'admin@deinrimapp.in',
          role: 'admin',
          roleTitle: 'Boutique Administrator & Owner',
          isDemoUser: false,
        });
      } else if (cleanEmail === 'manager@deinrimapp.in' || cleanEmail.includes('manager')) {
        onLogin({
          id: 'user_manager',
          name: 'Priya Sharma (Store Head)',
          email: 'manager@deinrimapp.in',
          role: 'manager',
          roleTitle: 'Boutique Store Manager',
          isDemoUser: false,
        });
      } else if (cleanEmail === 'tailor@deinrimapp.in' || cleanEmail.includes('tailor')) {
        onLogin({
          id: 'user_tailor',
          name: 'Master Rafiq (Head Cutter)',
          email: 'tailor@deinrimapp.in',
          role: 'tailor',
          roleTitle: 'Master Tailor & Cutter',
          isDemoUser: false,
        });
      } else {
        // Fallback admin login for custom email
        onLogin({
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: 'admin',
          roleTitle: 'Boutique Administrator',
          isDemoUser: false,
        });
      }
    }, 400);
  };

  // 1-Click Role Login Handlers
  const handleRoleSelect = (role: 'admin' | 'manager' | 'tailor' | 'customer') => {
    if (role === 'admin') {
      onLogin({
        id: 'demo_admin',
        name: 'Devendra Kumar (Proprietor)',
        email: 'admin@deinrimapp.in',
        role: 'admin',
        roleTitle: 'Boutique Administrator & Owner',
        isDemoUser: true,
      });
    } else if (role === 'manager') {
      onLogin({
        id: 'demo_manager',
        name: 'Priya Sharma (Store Head)',
        email: 'manager@deinrimapp.in',
        role: 'manager',
        roleTitle: 'Boutique Store Manager',
        isDemoUser: true,
      });
    } else if (role === 'tailor') {
      onLogin({
        id: 'demo_tailor',
        name: 'Master Rafiq (Head Cutter)',
        email: 'tailor@deinrimapp.in',
        role: 'tailor',
        roleTitle: 'Master Tailor & Workshop Cutter',
        isDemoUser: true,
      });
    } else if (role === 'customer') {
      onLogin({
        id: 'demo_customer',
        name: 'Vikramaditya Singhania',
        email: 'singhania.v@example.com',
        role: 'customer',
        roleTitle: 'Customer Live Portal Tracker',
        isDemoUser: true,
        customerTrackingCode: 'STM-8491',
      });
    }
  };

  const handleResetDataClick = () => {
    if (window.confirm('Reset all demo orders, measurements and fabric bolts to default factory state?')) {
      onResetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Deinrim Boutique ERP
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v3.4 Live Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Complete Tailoring, Suiting & Garment Production Management
              </p>
            </div>
          </div>

          {/* Right Header Status & Theme */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloud SQL Database Online</span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Value, Highlights & Credentials */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Live Demo Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                The Bespoke Tailoring &amp; Boutique ERP
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Seamlessly manage the entire tailoring cycle—from customer anatomical measurements to fabric reservation, cutting, stitching workshop stages, first trial alterations, and GST billing.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-xs mb-1">
                  <Ruler className="w-4 h-4" />
                  <span>Digital Measurement Book</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pre-configured anatomical templates for Suits, Shirts, Trousers, Kurtas &amp; Ladies Couture.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-xs mb-1">
                  <Scissors className="w-4 h-4" />
                  <span>8-Stage Workshop Kanban</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Track fabric cutting, stitching, trial fitting, alteration tickets and final quality check.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-xs mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Fabric &amp; Trims Stock</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Automatic meterage reservation per garment, bolt shelf location and low-stock alerts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-2.5 text-purple-400 font-semibold text-xs mb-1">
                  <Receipt className="w-4 h-4" />
                  <span>GST Billing &amp; Receipts</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Advance booking receipts, split payments, balance tracking, and thermal tailor job cards.
                </p>
              </div>
            </div>

            {/* Live Demo Instructions banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Live Demonstration Database</h4>
                  <p className="text-[11px] text-slate-400">
                    Test orders, clients &amp; bolts are loaded. Feel free to create or edit records.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetDataClick}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Reset test data"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetSuccess ? 'text-emerald-400 animate-spin' : ''}`} />
                <span>{resetSuccess ? 'Reset Done' : 'Reset Data'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Deinrim Auth & Live Demo Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              {/* Subtle gold decorative glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Card Tabs: "Live Demo Access" and "Standard Login" */}
              <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'demo'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Demo Access</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 bg-amber-400/20 text-amber-200 text-[10px] rounded">
                    1-Click
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'login'
                      ? 'bg-slate-800 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Member Sign In</span>
                </button>
              </div>

              {/* TAB 1: LIVE DEMO ACCESS (Active by default matching deinrimapp.in/boutique/index.php?r=auth/login&tab=demo) */}
              {activeTab === 'demo' && (
                <div className="space-y-4">
                  <div className="text-center sm:text-left mb-2">
                    <h3 className="text-base font-semibold text-white">Select a Persona to Test</h3>
                    <p className="text-xs text-slate-400">
                      Experience the ERP tailored to each role with real sample data.
                    </p>
                  </div>

                  {/* 1. Admin Role */}
                  <div
                    onClick={() => handleRoleSelect('admin')}
                    className="group cursor-pointer p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-950 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                              Boutique Owner / Administrator
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Full Access
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            admin@deinrimapp.in • P&amp;L reports, master inventory, staff, CRM &amp; billing
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Manager Role */}
                  <div
                    onClick={() => handleRoleSelect('manager')}
                    className="group cursor-pointer p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-950 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                              Boutique Store Manager
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              Front Desk
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            manager@deinrimapp.in • Book garments, fabric reservations, client trials &amp; cashflow
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* 3. Tailor / Cutter Role */}
                  <div
                    onClick={() => handleRoleSelect('tailor')}
                    className="group cursor-pointer p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-950 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              Master Tailor &amp; Workshop Cutter
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Workshop
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            tailor@deinrimapp.in • Job cards, anatomy specifications &amp; piece-rate ledger
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* 4. Customer Portal Role */}
                  <div
                    onClick={() => handleRoleSelect('customer')}
                    className="group cursor-pointer p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-950 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                              Client Order Tracking Portal
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              Customer View
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Track order STM-8491 live without logging in, view trial dates &amp; invoices
                          </p>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Credentials Info Box */}
                  <div className="mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <div>
                      <span className="text-slate-300 font-medium">Demo Password: </span>
                      <code className="text-amber-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">demo123</code>
                    </div>
                    <button
                      onClick={() => {
                        setEmail('admin@deinrimapp.in');
                        setPassword('demo123');
                        setActiveTab('login');
                      }}
                      className="text-amber-400 hover:underline text-[11px]"
                    >
                      Fill into Login Form →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: STANDARD MEMBER SIGN IN */}
              {activeTab === 'login' && (
                <form onSubmit={handleStandardLogin} className="space-y-4">
                  <div className="text-center sm:text-left mb-2">
                    <h3 className="text-base font-semibold text-white">Sign In to Atelier Console</h3>
                    <p className="text-xs text-slate-400">
                      Enter your authorized Deinrim Boutique credentials to proceed.
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-200">
                      {loginError}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Email Address or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@deinrimapp.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('For demo access, please use password: demo123, or use the 1-Click Live Demo tab.')}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                      />
                      <span>Keep me signed in</span>
                    </label>

                    <span className="text-[11px] text-slate-500">256-bit SSL Encrypted</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Sign In to ERP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('demo')}
                      className="text-xs text-amber-400 hover:underline flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prefer instant 1-click test access? Switch to Live Demo</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Deinrim Solutions</span>
            <span>•</span>
            <span>Boutique &amp; Suiting ERP (deinrimapp.in)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Cloud SQL PostgreSQL Enabled</span>
            <span>•</span>
            <span>WhatsApp &amp; Thermal Print Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
