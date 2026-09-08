import React, { useState } from 'react';
import { Sun, ShieldCheck, Zap, Flame, Building2 } from 'lucide-react';

export default function ProductPhoto({
  imageUrl,
  name,
  category,
  warrantyMonths,
  className = 'h-52',
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const months = warrantyMonths || 12;
  const periodLabel = months >= 12 && months % 12 === 0 ? `${months / 12} Years` : `${months} Months`;

  const getCategoryTheme = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('etc')) {
      return {
        icon: Sun,
        tag: 'ETC Evacuated Tubes',
        gradient: 'from-amber-600 via-orange-600 to-amber-700',
      };
    }
    if (c.includes('fpc')) {
      return {
        icon: Flame,
        tag: 'FPC Copper Collector',
        gradient: 'from-orange-600 via-amber-600 to-orange-700',
      };
    }
    if (c.includes('heat pump')) {
      return {
        icon: Zap,
        tag: 'Thermodynamic Heat Pump',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      };
    }
    if (c.includes('rooftop')) {
      return {
        icon: Sun,
        tag: 'Solar Rooftop Power Plant',
        gradient: 'from-blue-600 via-indigo-600 to-blue-800',
      };
    }
    if (c.includes('commercial')) {
      return {
        icon: Building2,
        tag: 'Commercial Solar System',
        gradient: 'from-slate-700 via-slate-800 to-slate-900',
      };
    }
    return {
      icon: Sun,
      tag: 'Solar Energy System',
      gradient: 'from-orange-500 via-amber-500 to-orange-600',
    };
  };

  const theme = getCategoryTheme(category);
  const FallbackIcon = theme.icon;

  const showImage = Boolean(imageUrl && !hasError);

  return (
    <div className={`relative w-full ${className} bg-slate-900 overflow-hidden select-none`}>
      {/* Fallback Graphic Banner if image fails, is offline, or missing */}
      {!showImage && (
        <div className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${theme.gradient} text-white relative`}>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-4 border-white/10 pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full border-2 border-white/10 pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-inner">
            <FallbackIcon className="w-9 h-9 text-white drop-shadow-sm" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/95 text-center px-4">
            {theme.tag}
          </span>
          <span className="text-[10px] text-white/70 font-medium mt-0.5">Orange Solar Official Equipment</span>
        </div>
      )}

      {/* Real Image Rendering with Smooth Fade & Zero Alt-Text Collision */}
      {showImage && (
        <>
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
            }`}
          />

          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <Sun className="w-8 h-8 text-orange-400 animate-spin" />
            </div>
          )}

          {/* High-contrast gradient overlay so badges NEVER clash with image colors */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/50 pointer-events-none" />
        </>
      )}

      {/* Badges: Placed with high-contrast pills so they never merge into anything */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/85 text-white backdrop-blur-md border border-white/15 shadow-md">
          {category || 'Solar System'}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wide bg-brand-500 text-white shadow-md shadow-brand-500/30 border border-brand-400/40">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>{periodLabel} Cover</span>
        </span>
      </div>
    </div>
  );
}

