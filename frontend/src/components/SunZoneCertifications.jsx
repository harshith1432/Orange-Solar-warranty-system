import React from 'react';

export default function SunZoneCertifications({ className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-4 bg-white/80 backdrop-blur-xs border border-orange-100 rounded-2xl shadow-2xs ${className}`}>
      {/* 20 Year Guarantee Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
          20Y
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-orange-950 uppercase leading-none">20 Year</div>
          <div className="text-[9px] font-bold text-orange-600 uppercase">Guarantee*</div>
        </div>
      </div>

      {/* Make in India */}
      <div className="flex items-center gap-1.5 text-slate-700">
        <span className="text-base">🇮🇳</span>
        <div className="text-left">
          <div className="text-[10px] font-black uppercase text-slate-900 leading-none">Make In India</div>
          <div className="text-[9px] text-slate-500 font-medium">Domestic Mfg</div>
        </div>
      </div>

      {/* MNRE Approved */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
        <div className="text-left">
          <div className="text-[10px] font-black uppercase leading-none">MNRE Approved</div>
          <div className="text-[8px] text-emerald-600 font-bold">Channel Partner</div>
        </div>
      </div>

      {/* ISO 9001:2015 */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
        <span className="text-[10px] font-black">ISO</span>
        <div className="text-left">
          <div className="text-[10px] font-bold leading-none">9001:2015</div>
          <div className="text-[8px] text-blue-600 font-medium">Certified Co.</div>
        </div>
      </div>

      {/* ISI Marked */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
        <span className="text-[11px] font-black">ISI</span>
        <span className="text-[9px] font-bold text-amber-800">IS 16544</span>
      </div>

      {/* Since 1997 */}
      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider hidden md:block">
        Trusted Since 1997
      </div>
    </div>
  );
}
