import React from 'react';

export default function OrangeSolarLogo({ 
  className = "h-9 w-auto", 
  variant = "color", // "color" | "white"
  showSubtext = true,
  showTagline = false 
}) {
  const isWhite = variant === "white";
  const logoSrc = isWhite ? "/orange-solar-logo-white.png" : "/orange-solar-logo.png";

  return (
    <div className="inline-flex flex-col items-center select-none">
      <img
        src={logoSrc}
        alt="Orange Solar - A Sun Zone Product"
        className={`${className} object-contain transition-transform duration-200`}
        loading="eager"
      />
      {showTagline && (
        <span className={`text-[10px] font-black tracking-widest uppercase mt-1 ${isWhite ? 'text-amber-300' : 'text-orange-600'}`}>
          Powering Infinity
        </span>
      )}
    </div>
  );
}
