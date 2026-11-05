import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Sparkles,
  Shield,
  ArrowRight,
  Play,
  CheckCircle2,
  Ruler,
  Layers,
  Receipt,
  MessageSquare,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Sun,
  Moon,
  ChevronDown,
  Lock,
  Building,
  Check,
  Zap,
} from 'lucide-react';
import { AuthUser, BusinessProfile } from '../../types';

interface MarketingHomePageProps {
  onOpenDemo: (role?: 'admin' | 'manager' | 'tailor' | 'customer') => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  onEnterAppDirectly: () => void;
  business: BusinessProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const MarketingHomePage: React.FC<MarketingHomePageProps> = ({
  onOpenDemo,
  onOpenLogin,
  onOpenSignup,
  onEnterAppDirectly,
  business,
  darkMode,
  setDarkMode,
}) => {
  // Hero Dashboard Slide Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // ROI Calculator State
  const [monthlyOrders, setMonthlyOrders] = useState(60);
  const [avgPrice, setAvgPrice] = useState(4500); // INR or converted
  const [tailorCount, setTailorCount] = useState(4);

  // Slides configuration
  const slides = [
    {
      id: 'dashboard',
      title: 'Atelier Overview & Financial KPIs',
      tag: 'Executive Dashboard',
      description: 'Real-time sales tracking, production stage distribution, urgent delivery flags, and cashflow.',
      renderMockup: () => (
        <div className="p-5 space-y-4 bg-slate-900/90 text-white font-sans">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Savile &amp; Crown Bespoke Atelier
              </span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
              Live Cloud SQL Sync
            </span>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30">
              <span className="text-[10px] text-blue-300 font-medium block">Active Orders</span>
              <span className="text-xl font-bold font-serif text-white">18</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">↑ 4 booked this week</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30">
              <span className="text-[10px] text-amber-300 font-medium block">In Workshop</span>
              <span className="text-xl font-bold font-serif text-white">11</span>
              <span className="text-[9px] text-amber-300 block mt-0.5">3 in cutting &amp; stitch</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30">
              <span className="text-[10px] text-purple-300 font-medium block">First Trials</span>
              <span className="text-xl font-bold font-serif text-white">4</span>
              <span className="text-[9px] text-purple-300 block mt-0.5">2 trials due today</span>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 font-medium block">Pending Balance</span>
              <span className="text-xl font-bold font-serif text-white">₹64,500</span>
              <span className="text-[9px] text-emerald-300 block mt-0.5">85% advance received</span>
            </div>
          </div>

          {/* Urgent Orders Ticker */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-3.5 h-3.5" /> Urgent Deliveries Today
              </span>
              <span className="text-[10px] text-slate-400">2 Orders Flagged</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-semibold text-[11px]">STM-8491</span>
                  <span className="text-white font-medium">Bespoke 3-Piece Tuxedo</span>
                  <span className="text-slate-400 text-[10px]">(Vikram Singhania)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  Ready for Trial
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-400 font-semibold text-[11px]">STM-8493</span>
                  <span className="text-white font-medium">Handcrafted Silk Sherwani</span>
                  <span className="text-slate-400 text-[10px]">(Arjun Malhotra)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Stitching in Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'pipeline',
      title: '8-Stage Workshop Production Pipeline & Kanban',
      tag: 'Workshop Floor',
      description: 'Drag-and-drop orders across cutting, stitching, trial fitting, alteration tickets and quality check.',
      renderMockup: () => (
        <div className="p-5 space-y-3.5 bg-slate-900/90 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">Active Workshop Flow</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">8 Stages Automated</span>
          </div>

          {/* Kanban Stage Columns Preview */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Stage 1: Fabric Cutting */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-blue-400">
                <span>1. Fabric Cutting</span>
                <span className="bg-blue-500/20 px-1.5 py-0.2 rounded text-[10px]">2</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-amber-300">#STM-8495</span>
                  <span className="text-[9px] text-red-400 font-semibold">Rush</span>
                </div>
                <p className="font-medium text-white text-[11px] leading-tight">Double-Breasted Blazer</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Cutter: Rafiq</span>
                  <span className="text-emerald-400">Fabric cut</span>
                </div>
              </div>
            </div>

            {/* Stage 2: First Trial */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-400">
                <span>2. First Trial</span>
                <span className="bg-purple-500/20 px-1.5 py-0.2 rounded text-[10px]">3</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-amber-300">#STM-8491</span>
                  <span className="text-[9px] text-purple-300">Today 5 PM</span>
                </div>
                <p className="font-medium text-white text-[11px] leading-tight">Bespoke 3-Piece Tuxedo</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Tailor: Imran</span>
                  <span className="text-amber-400">Trial fitting ready</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Ready for Delivery */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                <span>3. Ready Delivery</span>
                <span className="bg-emerald-500/20 px-1.5 py-0.2 rounded text-[10px]">4</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-amber-300">#STM-8488</span>
                  <span className="text-[9px] text-emerald-400">QC Passed</span>
                </div>
                <p className="font-medium text-white text-[11px] leading-tight">Egyptian Cotton Shirt (x3)</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>WhatsApp Sent</span>
                  <span className="text-white font-mono">Bal: ₹2,400</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Thermal QR Job Cards automatically generated for cutters &amp; tailors</span>
            <span className="text-amber-400 font-medium">Scan to update status →</span>
          </div>
        </div>
      ),
    },
    {
      id: 'measurements',
      title: 'Digital Anatomical Measurement Book',
      tag: 'Precision Fit',
      description: 'Pre-configured anatomical profiles for Suits, Shirts, Trousers, Blazers, Kurtas & Couture.',
      renderMockup: () => (
        <div className="p-5 space-y-3.5 bg-slate-900/90 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-xs font-semibold text-white">Client: Vikramaditya Singhania</span>
              <p className="text-[10px] text-slate-400">Profile: Savile Row Slim Fit 2026 (Inches)</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Posture: Erect / Sloping Shoulder
            </span>
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Chest</span>
              <span className="text-sm font-bold font-mono text-white">40.5"</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Waist</span>
              <span className="text-sm font-bold font-mono text-white">34.0"</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Shoulder</span>
              <span className="text-sm font-bold font-mono text-white">18.5"</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Sleeve</span>
              <span className="text-sm font-bold font-mono text-white">25.5"</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Length</span>
              <span className="text-sm font-bold font-mono text-white">29.5"</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[9px] text-slate-400 uppercase block">Inseam</span>
              <span className="text-sm font-bold font-mono text-white">31.5"</span>
            </div>
          </div>

          {/* Style & Fit Specifications */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div>
              <span className="text-slate-500 block">Lapel Style:</span>
              <span className="font-semibold text-slate-200">Peak Lapel (3.75")</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vent Type:</span>
              <span className="font-semibold text-slate-200">Double Side Vents</span>
            </div>
            <div>
              <span className="text-slate-500 block">Button Stance:</span>
              <span className="font-semibold text-slate-200">2-Button Horn</span>
            </div>
            <div>
              <span className="text-slate-500 block">Trouser Pleats:</span>
              <span className="font-semibold text-slate-200">Flat Front + Side Adjusters</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'inventory',
      title: 'Fabric Bolts & Haberdashery Stock Ledger',
      tag: 'Warehouse Inventory',
      description: 'Track meterage consumption per garment, reserved bolts, and low-stock replenishment alerts.',
      renderMockup: () => (
        <div className="p-5 space-y-3.5 bg-slate-900/90 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-semibold text-white">Active Fabric Bolts in Stock</span>
            <span className="text-[10px] text-emerald-400">12 Bolts In Stock &bull; 2 Reserved</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                  WL
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[11px]">Super 130s Merino Midnight Blue</h4>
                  <p className="text-[10px] text-slate-400">Scabal UK &bull; Rack A-04 &bull; Code: SCB-130</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-white text-xs">38.5 m</span>
                <span className="text-[9px] text-amber-400 block">3.2m reserved for STM-8491</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center text-xs">
                  CT
                </div>
                <div>
                  <h4 className="font-semibold text-white text-[11px]">Egyptian Giza Twill White</h4>
                  <p className="text-[10px] text-slate-400">Albini Italy &bull; Shelf B-12 &bull; Code: ALB-092</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-white text-xs">54.0 m</span>
                <span className="text-[9px] text-emerald-400 block">Sufficient stock</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'portal',
      title: 'Customer Live Order Tracking Portal',
      tag: 'Client Experience',
      description: 'Your customers can track their garment progress in real-time, view trial dates & download invoices.',
      renderMockup: () => (
        <div className="p-5 space-y-3.5 bg-slate-900/90 text-white font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-xs font-semibold text-white">Client Self-Service View</span>
              <p className="text-[10px] text-slate-400">Live URL: stitchmate.app/track/STM-8491</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              No App Install Required
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">Order #STM-8491</span>
                <h4 className="font-serif font-bold text-white text-sm">Bespoke 3-Piece Tuxedo</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                First Trial Ready
              </span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium mb-1">
                <span className="text-emerald-400 font-semibold">1. Booked</span>
                <span className="text-emerald-400 font-semibold">2. Cutting</span>
                <span className="text-emerald-400 font-semibold">3. Stitching</span>
                <span className="text-amber-400 font-bold">4. Trial Fitting</span>
                <span>5. Ready</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full w-[70%]" />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
              <span>Trial Date: <strong>Today, 5:00 PM</strong></span>
              <span className="text-amber-400">View Invoice PDF →</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto-play timer for slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  // Dynamic ROI Calculations
  const monthlyRevenue = monthlyOrders * avgPrice;
  const hoursSavedWeekly = Math.round(monthlyOrders * 0.45); // ~27 hours saved from manual diaries
  const extraMonthlyProfit = Math.round(monthlyRevenue * 0.12); // 12% boost from fabric savings & zero re-stitching

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      {/* Top Marketing Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  Deinrim Boutique ERP
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                StitchMate Atelier OS &bull; Bespoke Suiting Suite
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Core Modules
            </a>
            <a href="#workflow" className="hover:text-amber-400 transition-colors">
              8-Stage Workflow
            </a>
            <a href="#roi" className="hover:text-amber-400 transition-colors">
              ROI Calculator
            </a>
            <a href="#comparison" className="hover:text-amber-400 transition-colors">
              Why Deinrim
            </a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">
              Pricing Plans
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Member Sign In Button */}
            <button
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            {/* Live Demo Access Button */}
            <button
              onClick={() => onOpenDemo('admin')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-lg transition-colors shadow-xs"
              title="Open Live Interactive Demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Demo</span>
            </button>

            {/* Start Free Trial (User Signup) */}
            <button
              onClick={onOpenSignup}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all font-sans"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION (2 PARTS: CONTENT & DASHBOARD SLIDES) */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 border-b border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* PART 1: MARKETING CONTENT (Left Column) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The #1 ERP for Tailors, Boutiques &amp; Made-to-Measure</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                Master the Journey From{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  Measurement to Delivery
                </span>
              </h1>

              {/* Sub-paragraph */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Replace unorganized paper measurement books and telephone chaos. Deinrim Boutique ERP unifies anatomical measurement cards, fabric roll reservation, 8-stage workshop kanban, first trial alterations, GST billing, and real-time WhatsApp order tracking in one beautiful platform.
              </p>

              {/* Key Bullet Feature Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-left max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Digital Measurement Book (6 Garment Types)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>8-Stage Cutting &amp; Stitching Kanban</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fabric Bolt Ledger &amp; Meterage Reservation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>GST Billing, Advance Receipts &amp; WhatsApp</span>
                </div>
              </div>

              {/* Hero Call-To-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
                {/* Primary Demo Button */}
                <button
                  onClick={() => onOpenDemo('admin')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all group"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                  <span>Explore Live Demo (Instant)</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Secondary Free Trial Button */}
                <button
                  onClick={onOpenSignup}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors"
                >
                  <span>Start Free 14-Day Trial</span>
                </button>
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400 text-xs">
                <div>
                  <span className="font-bold text-white font-mono text-base block">500+</span>
                  <span>Boutiques &amp; Tailoring Houses</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="font-bold text-emerald-400 font-mono text-base block">99.4%</span>
                  <span>First-Trial Fit Accuracy</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="font-bold text-amber-400 font-mono text-base block">45%</span>
                  <span>Faster Delivery Turnaround</span>
                </div>
              </div>
            </div>

            {/* PART 2: INTERACTIVE SLIDES OF IMPORTANT DASHBOARDS (Right Column) */}
            <div
              className="lg:col-span-6"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/40">
                {/* Slide Carousel Header Tabs */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 shrink-0">
                    {slides.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setCurrentSlide(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                          currentSlide === idx
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        {s.tag}
                      </button>
                    ))}
                  </div>

                  {/* Manual Carousel Next / Prev Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Active Slide Title Banner */}
                <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {slides[currentSlide].description}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenDemo('admin')}
                    className="shrink-0 hidden sm:flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <span>Test Live</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Render Selected Mockup */}
                <div className="relative min-h-[300px] flex flex-col justify-center">
                  {slides[currentSlide].renderMockup()}
                </div>

                {/* Slide Footer with Dots and Action */}
                <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          currentSlide === idx ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenDemo('admin')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                  >
                    <span>Launch this module in Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CORE MODULES SHOWCASE */}
      <section id="features" className="py-16 sm:py-20 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Complete Tailoring Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mt-2">
              Everything Your Atelier Needs to Flourish
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Designed hand-in-hand with bespoke tailors, master cutters, bridal boutiques and garment owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Digital Measurement Book</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save multi-garment anatomical specs for Suits, Shirts, Trousers, Blazers, Kurtas, and Couture. Compare old vs new measurements to see client body changes over time.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">8-Stage Workshop Kanban</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track each garment through Fabric Cutting, Stitching, 1st Trial Fitting, Alterations, Finishing Press, and Quality Check. Assign master cutters &amp; piece-rate tailors.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Fabric &amp; Trims Stock Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record wool, cotton, silk bolts with mill brand, cost per meter, and shelf locations. Automatically reserve meters when booking garments and trigger low-stock alerts.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">GST Invoicing &amp; Advance Receipts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collect advance booking deposits, record multiple partial payments, calculate GST/VAT taxes, and generate downloadable professional A4 and 80mm thermal receipts.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-green-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">1-Click WhatsApp Automation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Send pre-templated WhatsApp messages when garments are scheduled for trial fitting, when garments are ready for pick-up, or when a pending balance is due.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Live Customer Tracking Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Give your customers a branded web portal to view garment progress, trial appointment date, measurements sheet, and tax receipts without installing any app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE ROI & REVENUE CALCULATOR */}
      <section id="roi" className="py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Sliders */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Interactive Return on Investment
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    Calculate Your Boutique Growth
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    See how much time and money Deinrim Boutique ERP saves your business every month.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Slider 1: Monthly Garments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                      <span>Monthly Garments Booked:</span>
                      <span className="font-mono text-amber-400 font-bold text-sm">{monthlyOrders} Garments</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={250}
                      step={5}
                      value={monthlyOrders}
                      onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>10/mo</span>
                      <span>100/mo</span>
                      <span>250+/mo</span>
                    </div>
                  </div>

                  {/* Slider 2: Average Price */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                      <span>Average Order Value:</span>
                      <span className="font-mono text-amber-400 font-bold text-sm">₹{avgPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={35000}
                      step={500}
                      value={avgPrice}
                      onChange={(e) => setAvgPrice(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>₹1,000 (Shirts/Trousers)</span>
                      <span>₹15,000 (Suits)</span>
                      <span>₹35,000 (Bridal Couture)</span>
                    </div>
                  </div>

                  {/* Slider 3: Tailors Count */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                      <span>Artisans &amp; Tailors in Workshop:</span>
                      <span className="font-mono text-amber-400 font-bold text-sm">{tailorCount} Staff</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      step={1}
                      value={tailorCount}
                      onChange={(e) => setTailorCount(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Impact */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                  <span>Estimated Monthly ROI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    High Confidence
                  </span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Monthly Revenue Managed</span>
                    <span className="text-2xl font-bold font-serif text-white">
                      ₹{monthlyRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[11px] text-emerald-300 font-medium block">
                      Extra Monthly Profit from Reduced Waste &amp; Rework
                    </span>
                    <span className="text-2xl font-bold font-serif text-emerald-400">
                      +₹{extraMonthlyProfit.toLocaleString()} / mo
                    </span>
                    <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                      Zero lost measurement disputes &bull; Real-time yardage reservation
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30">
                    <span className="text-[11px] text-blue-300 font-medium block">
                      Hours Saved Weekly by Staff &amp; Tailors
                    </span>
                    <span className="text-2xl font-bold font-serif text-blue-400">
                      ~{hoursSavedWeekly} Hours / Week
                    </span>
                    <span className="text-[10px] text-blue-300/80 block mt-0.5">
                      No WhatsApp follow-ups &bull; Automated client trial notices
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenSignup}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                >
                  <span>Start Free 14-Day Trial Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE (Manual Registers vs Deinrim ERP) */}
      <section id="comparison" className="py-16 sm:py-20 bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Before &amp; After
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Why Traditional Tailors Upgrade to Deinrim
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 bg-slate-950 p-4 border-b border-slate-800 text-xs font-semibold">
              <div className="col-span-5 text-slate-400">Workflow Capability</div>
              <div className="col-span-3 text-red-400 text-center">Paper Registers</div>
              <div className="col-span-4 text-amber-400 text-center font-bold">Deinrim Boutique ERP</div>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="grid grid-cols-12 p-3.5 items-center">
                <div className="col-span-5 font-medium text-slate-200">Customer Measurement Records</div>
                <div className="col-span-3 text-slate-400 text-center">Lost notebooks, unreadable handwriting</div>
                <div className="col-span-4 text-emerald-400 text-center font-semibold">Digital book with 6 garment specs &amp; posture</div>
              </div>

              <div className="grid grid-cols-12 p-3.5 items-center bg-slate-900/50">
                <div className="col-span-5 font-medium text-slate-200">Workshop Production Tracking</div>
                <div className="col-span-3 text-slate-400 text-center">Yelling on workshop floor, missed trials</div>
                <div className="col-span-4 text-emerald-400 text-center font-semibold">8-Stage Kanban &amp; QR Job Cards</div>
              </div>

              <div className="grid grid-cols-12 p-3.5 items-center">
                <div className="col-span-5 font-medium text-slate-200">Fabric Meterage &amp; Wastage</div>
                <div className="col-span-3 text-slate-400 text-center">Manual guessing, over-ordering rolls</div>
                <div className="col-span-4 text-emerald-400 text-center font-semibold">Real-time meterage deduction &amp; low stock alerts</div>
              </div>

              <div className="grid grid-cols-12 p-3.5 items-center bg-slate-900/50">
                <div className="col-span-5 font-medium text-slate-200">Customer Trial &amp; Delivery Updates</div>
                <div className="col-span-3 text-slate-400 text-center">Constant incoming calls: "Is my suit ready?"</div>
                <div className="col-span-4 text-emerald-400 text-center font-semibold">Automated WhatsApp &amp; Live Tracking Portal</div>
              </div>

              <div className="grid grid-cols-12 p-3.5 items-center">
                <div className="col-span-5 font-medium text-slate-200">Advance &amp; Split Payment Tracking</div>
                <div className="col-span-3 text-slate-400 text-center">Disputed balance dues at delivery counter</div>
                <div className="col-span-4 text-emerald-400 text-center font-semibold">GST Invoices, advance receipts &amp; balance ledger</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: TRANSPARENT PRICING PLANS */}
      <section id="pricing" className="py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Choose the Right Plan for Your Atelier
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every plan includes a 14-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Starter */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Boutique Starter</span>
                <h3 className="text-xl font-bold text-white mt-1">Single Atelier</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">Perfect for boutique owners &amp; alteration studios.</p>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-3xl font-bold font-serif text-white">₹999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 50 active orders</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Digital Measurement Book</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 3 staff / tailor logins</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> WhatsApp notifications</li>
                </ul>
              </div>
              <button
                onClick={onOpenSignup}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 2: Pro (Most Popular) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/60 border-2 border-amber-500/80 flex flex-col justify-between relative shadow-2xl">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                Most Popular for Suiting Houses
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pro Bespoke</span>
                <h3 className="text-xl font-bold text-white mt-1">Boutique &amp; Suiting Pro</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">Complete ERP for growing made-to-measure brands.</p>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-3xl font-bold font-serif text-white">₹2,499</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Unlimited customer orders</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Full 8-stage Workshop Kanban</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Fabric Bolt &amp; Trims Stock Ledger</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Thermal QR Job Cards &amp; Invoices</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Customer Live Tracking Portal</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Cloud SQL Database Persistence</li>
                </ul>
              </div>
              <button
                onClick={onOpenSignup}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Enterprise Multi-Branch</span>
                <h3 className="text-xl font-bold text-white mt-1">Luxury Chain</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">For luxury chains with multi-branch ateliers.</p>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-3xl font-bold font-serif text-white">₹5,999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-branch studio support</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited master tailor logins</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom branding &amp; domain setup</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Account Manager &amp; SLA</li>
                </ul>
              </div>
              <button
                onClick={onOpenSignup}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section className="py-14 sm:py-16 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
            <Scissors className="w-6 h-6 -rotate-45" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white">
            Ready to Upgrade Your Atelier Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience the complete Deinrim Boutique ERP with live sample orders, or start your 14-day free trial in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenDemo('admin')}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Interactive Demo</span>
            </button>
            <button
              onClick={onOpenSignup}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-colors"
            >
              <span>Sign Up for Free Trial</span>
            </button>
            <button
              onClick={onEnterAppDirectly}
              className="w-full sm:w-auto px-5 py-3 text-slate-400 hover:text-white text-xs font-medium underline"
            >
              Skip to Atelier ERP Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 px-4 text-slate-500 text-xs border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Deinrim Solutions &bull; Boutique ERP</p>
              <p className="text-[11px] text-slate-500">Official website: deinrimapp.in</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button onClick={() => onOpenDemo('admin')} className="hover:text-amber-400">
              Admin Demo
            </button>
            <button onClick={() => onOpenDemo('manager')} className="hover:text-amber-400">
              Manager Demo
            </button>
            <button onClick={() => onOpenDemo('tailor')} className="hover:text-amber-400">
              Master Tailor Demo
            </button>
            <button onClick={() => onOpenDemo('customer')} className="hover:text-amber-400">
              Customer Portal Demo
            </button>
            <button onClick={onOpenSignup} className="hover:text-amber-400">
              User Signup
            </button>
            <button onClick={onOpenLogin} className="hover:text-amber-400">
              Member Sign In
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; 2026 Deinrim Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
