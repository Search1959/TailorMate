import React, { useState } from 'react';
import { Sparkles, X, Check, Copy, ArrowRight, Scissors } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface AIBespokeStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  onApplyRecommendation?: (specs: any) => void;
}

export const AIBespokeStylistModal: React.FC<AIBespokeStylistModalProps> = ({
  isOpen,
  onClose,
  business,
  onApplyRecommendation,
}) => {
  const [occasion, setOccasion] = useState('black_tie');
  const [garment, setGarment] = useState('tuxedo');
  const [build, setBuild] = useState('athletic');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Sartorial rules recommendation engine
  const getRecommendation = () => {
    if (occasion === 'black_tie') {
      return {
        title: 'Savile Black Tie Grand Gala Spec',
        fabric: 'Scabal Super 150s Merino Wool (Midnight Navy / Barathea Black, 320g/m)',
        lapels: 'Wide Peak Lapel (3.75") with Pure Silk Satin Facing',
        shoulder: 'Con Rollino (Subtle roped sleevehead with light padding)',
        canvas: 'Traditional Full Floating Horsehair Canvas Chest Piece',
        lining: 'Bemberg Cupro Jacquard in Midnight Blue with Contrast Hand-Stitched Piping',
        trouser: 'High-waisted flat front with 25mm pure satin side braiding, side adjusters, no belt loops',
        buttons: 'Single button stance, satin silk covered buttons with working cuffs',
        shirtMatch: 'Marcella Piqué bib front with English spread collar and double French cuffs',
        tailorAdvice: 'For athletic postures, cut high armscye (+0.75" comfort) to eliminate sleeve drag.',
      };
    } else if (occasion === 'summer_wedding') {
      return {
        title: 'Bespoke Mediterranean Summer Nuptials',
        fabric: 'Baird McNutt Irish Pure Linen (280g/m in Warm Oat / Sage Mélange)',
        lapels: 'Notch Lapel (3.25") with soft rolling 3-roll-2 button stance',
        shoulder: 'Spalla Camicia (Neapolitan shirt-shoulder with gentle waterfall shirring)',
        canvas: 'Half-Canvas with featherweight unconstructed butterfly lining',
        lining: 'Quarter-lined breathable cotton voile',
        trouser: 'Gurkha extended tab waistband with double forward pleats and 2" cuffs',
        buttons: 'Matte Australian Mother-of-Pearl buttons',
        shirtMatch: 'Garment-washed poplin or lightweight linen band-collar shirt',
        tailorAdvice: 'Allow 0.5" extra ease in thigh and seat for natural linen expansion in heat.',
      };
    } else if (occasion === 'festive_reception') {
      return {
        title: 'Imperial Royal Festive Ensemble',
        fabric: 'Pure Varanasi Katan Silk with Hand-Woven Antique Gold Zari Boota',
        lapels: 'Mandarin Band Collar with Hand-Embroidered Bullion Cord Detailing',
        shoulder: 'Structured regal shoulder with inner soft canvas reinforcement',
        canvas: 'Full interlining to prevent zari distortion',
        lining: 'Ultra-soft Mulberry Habotai Silk lining',
        trouser: 'Churidar or tailored straight Italian wool-silk trousers in ivory',
        buttons: 'Handcrafted silver potli thread buttons with concealed placket snap buttons',
        shirtMatch: 'Matching hand-spun silk kurta with gold zari thread edging',
        tailorAdvice: 'Anchor chest apex precisely to avoid front gaping during celebratory movements.',
      };
    } else {
      return {
        title: 'Executive Boardroom Power Suit',
        fabric: 'Loro Piana Super 150s Merino Wool (Dormeuil Charcoal Pinstripe, 300g/m)',
        lapels: 'Notch Lapel (3.25") with Milanese hand-sewn lapel buttonhole',
        shoulder: 'Clean British Roman shoulder with medium shoulder pad',
        canvas: 'Full Floating English Horsehair Canvas',
        lining: 'Full Bemberg Silk lining in subtle tonal charcoal',
        trouser: 'Single reverse pleat with slanted pockets and horn side adjusters',
        buttons: 'Genuine Dark Brown Buffalo Horn buttons (4 stacked working cuff buttons)',
        shirtMatch: 'Thomas Mason Giza 87 Egyptian Cotton Poplin with English Semi-Spread collar',
        tailorAdvice: 'Cut sleeve length to expose precisely 0.5 inches of shirt cuff.',
      };
    }
  };

  const rec = getRecommendation();

  const handleCopySpec = () => {
    const text = `${rec.title}\n• Fabric: ${rec.fabric}\n• Lapels: ${rec.lapels}\n• Shoulder: ${rec.shoulder}\n• Canvas: ${rec.canvas}\n• Lining: ${rec.lining}\n• Trouser: ${rec.trouser}\n• Buttons: ${rec.buttons}\n• Tailor Advice: ${rec.tailorAdvice}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-xl w-full p-5 space-y-4 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              AI Bespoke Sartorial Stylist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">Occasion / Event</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1.5 font-medium"
            >
              <option value="black_tie">Black Tie Gala</option>
              <option value="summer_wedding">Summer Wedding</option>
              <option value="festive_reception">Festive / Bridal</option>
              <option value="boardroom">Executive Boardroom</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Garment Type</label>
            <select
              value={garment}
              onChange={(e) => setGarment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1.5 font-medium"
            >
              <option value="tuxedo">Tuxedo / Dinner Suit</option>
              <option value="suit">2-Piece / 3-Piece Suit</option>
              <option value="blazer">Neapolitan Blazer</option>
              <option value="sherwani">Sherwani / Bandhgala</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Client Stance / Build</label>
            <select
              value={build}
              onChange={(e) => setBuild(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-1.5 font-medium"
            >
              <option value="athletic">Athletic V-Taper</option>
              <option value="slender">Slender / Lean</option>
              <option value="stout">Portly / Stout</option>
              <option value="broad">Tall &amp; Square</option>
            </select>
          </div>
        </div>

        {/* AI Recommendation Output Card */}
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/80 dark:border-amber-900/60">
            <h4 className="font-serif font-bold text-sm text-amber-950 dark:text-amber-200">
              {rec.title}
            </h4>
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              Curated Spec
            </span>
          </div>

          <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
            <div>
              <strong className="text-slate-900 dark:text-white">Recommended Fabric:</strong> {rec.fabric}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Lapel Architecture:</strong> {rec.lapels}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Shoulder &amp; Sleevehead:</strong> {rec.shoulder}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Canvas &amp; Lining:</strong> {rec.canvas} · {rec.lining}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Trouser Cut:</strong> {rec.trouser}
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Buttons:</strong> {rec.buttons}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 italic">
            <strong>Master Tailor Advice:</strong> {rec.tailorAdvice}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopySpec}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Specs!' : 'Copy Job Specs'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
