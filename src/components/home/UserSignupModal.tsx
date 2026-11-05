import React, { useState } from 'react';
import {
  X,
  Scissors,
  CheckCircle2,
  Building2,
  Mail,
  Lock,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser, BusinessProfile } from '../../types';
import { StorageService } from '../../services/storage';

interface UserSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (user: AuthUser, business: BusinessProfile) => void;
  onSwitchToLogin: () => void;
}

export const UserSignupModal: React.FC<UserSignupModalProps> = ({
  isOpen,
  onClose,
  onSignupSuccess,
  onSwitchToLogin,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessType, setBusinessType] = useState<BusinessProfile['businessType']>('mens_tailoring');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [tailorCount, setTailorCount] = useState('1-5 artisans');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const newBizId = `biz_${Date.now()}`;
      const newBusiness: BusinessProfile = {
        id: newBizId,
        name: businessName.trim(),
        tagline: 'Bespoke Made-to-Measure & Haute Couture',
        branch: 'Flagship Atelier',
        address: 'Boutique Boulevard, Fashion District',
        phone: phone || '+91 98765 00000',
        whatsapp: phone || '+91 98765 00000',
        email: email.trim(),
        currencySymbol: currencySymbol,
        taxRatePercent: 5,
        taxLabel: currencySymbol === '₹' ? 'GST' : 'VAT',
        taxRegistrationNumber: 'GSTIN27AABCT0000Z',
        businessType: businessType,
        accentTheme: 'amber',
      };

      // Persist to storage
      const existing = StorageService.getBusinesses();
      StorageService.saveBusiness(newBusiness);
      StorageService.setCurrentBusinessId(newBizId);

      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        name: ownerName.trim(),
        email: email.trim(),
        role: 'admin',
        roleTitle: 'Proprietor & Master Atelier',
        isDemoUser: false,
      };

      onSignupSuccess(newUser, newBusiness);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand & Badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Scissors className="w-4 h-4 -rotate-45" />
            </div>
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Start Free 14-Day Trial
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
            Set Up Your Tailoring ERP
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
            Join 500+ suiting houses, bridal boutiques and custom tailors managing measurements, orders and billing.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Boutique Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300">
                  Boutique or Suiting House Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Savile &amp; Crown Bespoke Atelier"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Proprietor / Owner Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@savileandcrown.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Set Master Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Boutique Specialization
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                >
                  <option value="mens_tailoring">Men's Bespoke Suiting &amp; Tailoring</option>
                  <option value="ladies_boutique">Bridal Couture &amp; Ladies Boutique</option>
                  <option value="luxury_atelier">Luxury Atelier &amp; High Fashion</option>
                  <option value="alteration_studio">Alteration &amp; Fitting Studio</option>
                  <option value="uniform_factory">Uniform &amp; Bulk Garments</option>
                </select>
              </div>

              {/* Currency & Tailor Team */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Currency Symbol &amp; Workshop Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <option value="₹">₹ INR (India)</option>
                    <option value="$">$ USD (Global)</option>
                    <option value="£">£ GBP (UK)</option>
                    <option value="€">€ EUR (Europe)</option>
                    <option value="د.إ">د.إ AED (UAE)</option>
                  </select>

                  <select
                    value={tailorCount}
                    onChange={(e) => setTailorCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <option value="1-3">1-3 Artisans</option>
                    <option value="4-10">4-10 Tailors</option>
                    <option value="11-25">11-25 Cutters &amp; Tailors</option>
                    <option value="25+">25+ Staff</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trial Feature Highlights */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Included in your 14-day free trial:</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-5">
                ✓ Unlimited Measurement Book &bull; ✓ 8-Stage Workshop Kanban &bull; ✓ Fabric Bolt Stock Ledger &bull; ✓ GST Invoicing &bull; ✓ WhatsApp Alerts
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Provisioning Your Atelier...</span>
              ) : (
                <>
                  <span>Create My Atelier Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an active boutique account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Sign In to Atelier Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
