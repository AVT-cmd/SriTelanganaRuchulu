import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface LanguageToggleProps {
  variant?: 'header' | 'mobile' | 'footer';
  className?: string;
}

export const LanguageToggle = ({ variant = 'header', className = '' }: LanguageToggleProps) => {
  const { setLanguage, toggleLanguage, isTelugu } = useTranslation();

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
        <div className="flex items-center gap-2 text-white text-xs font-bold">
          <Globe size={16} className="text-amber-400" />
          <span>{isTelugu ? 'భాషను ఎంచుకోండి:' : 'Language / భాష:'}</span>
        </div>
        <div className="flex items-center bg-black/50 border border-white/15 rounded-full p-1">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !isTelugu
                ? 'bg-amber-400 text-[#2A0800] shadow-sm font-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('te')}
            className={`px-3 py-1 rounded-full text-xs font-bold font-telugu transition-all cursor-pointer ${
              isTelugu
                ? 'bg-amber-400 text-[#2A0800] shadow-sm font-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-xs ${className}`}>
        <Globe size={14} className="text-amber-400" />
        <span className="text-xs text-gray-400 font-medium">భాష:</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`text-xs px-2 py-0.5 rounded-full font-bold transition cursor-pointer ${
            !isTelugu ? 'bg-amber-400 text-[#2A0800]' : 'text-gray-300 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('te')}
          className={`text-xs px-2 py-0.5 rounded-full font-bold font-telugu transition cursor-pointer ${
            isTelugu ? 'bg-amber-400 text-[#2A0800]' : 'text-gray-300 hover:text-white'
          }`}
        >
          తెలుగు
        </button>
      </div>
    );
  }

  // Header toggle: compact 1-tap pill on mobile (<640px) + full segmented switch on desktop (>=640px)
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Mobile 1-Tap Quick Switch (< sm) */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-black/45 hover:bg-black/60 border border-amber-400/35 active:scale-95 transition-all text-xs font-extrabold text-amber-300 shadow-xs cursor-pointer select-none"
        aria-label={isTelugu ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
        title={isTelugu ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
      >
        <Globe size={12} className="text-amber-400 flex-shrink-0" />
        <span className={isTelugu ? 'font-telugu text-[10px] leading-none' : 'text-[10px] font-black leading-none'}>
          {isTelugu ? 'తెలుగు' : 'EN'}
        </span>
      </button>

      {/* Desktop Segmented Pill (>= sm) */}
      <div 
        className="hidden sm:inline-flex items-center bg-black/35 hover:bg-black/50 border border-white/20 hover:border-amber-400/50 rounded-full p-0.5 backdrop-blur-md shadow-xs transition-colors"
        title={isTelugu ? 'Switch to English' : 'తెలుగులోకి మార్చండి'}
      >
        <div className="pl-2 pr-1 text-amber-400 flex items-center">
          <Globe size={13} />
        </div>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`relative z-10 px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors cursor-pointer ${
            !isTelugu ? 'text-[#2A0800]' : 'text-gray-300 hover:text-white'
          }`}
        >
          {!isTelugu && (
            <motion.div
              layoutId="langPill"
              className="absolute inset-0 bg-amber-400 rounded-full shadow-2xs -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            />
          )}
          EN
        </button>

        <button
          type="button"
          onClick={() => setLanguage('te')}
          className={`relative z-10 px-2 py-0.5 text-[11px] font-bold font-telugu rounded-full transition-colors cursor-pointer ${
            isTelugu ? 'text-[#2A0800]' : 'text-gray-300 hover:text-white'
          }`}
        >
          {isTelugu && (
            <motion.div
              layoutId="langPill"
              className="absolute inset-0 bg-amber-400 rounded-full shadow-2xs -z-10"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            />
          )}
          తెలుగు
        </button>
      </div>
    </div>
  );
};
