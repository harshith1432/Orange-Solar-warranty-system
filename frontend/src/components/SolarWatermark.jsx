import React from 'react';
import OrangeSolarLogo from './OrangeSolarLogo';

export default function SolarWatermark({ 
  className = "opacity-[0.035]",
  variant = "logo", // "logo" | "sun" | "emblem"
  size = 400
}) {
  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {variant === "logo" && (
        <div style={{ width: `${size * 1.5}px`, maxWidth: '90vw' }}>
          <OrangeSolarLogo 
            variant="color" 
            className="w-full h-auto grayscale contrast-125" 
            showSubtext={true}
          />
        </div>
      )}

      {variant === "sun" && (
        <svg 
          viewBox="0 0 500 500" 
          width={size} 
          height={size} 
          className="text-orange-950 fill-current animate-spin-very-slow"
        >
          {/* Sun disc and rays */}
          <circle cx="250" cy="250" r="100" fill="currentColor" opacity="0.4" />
          <circle cx="250" cy="250" r="130" stroke="currentColor" strokeWidth="6" strokeDasharray="12 10" fill="none" opacity="0.6" />
          {/* Infinite radiant bands mimicking page 1 brochure */}
          <path d="M 250,50 Q 350,150 450,250 T 250,450" stroke="currentColor" strokeWidth="16" fill="none" opacity="0.3" />
          <path d="M 50,250 Q 150,350 250,450 T 450,250" stroke="currentColor" strokeWidth="16" fill="none" opacity="0.3" />
        </svg>
      )}

      {variant === "emblem" && (
        <div className="flex flex-col items-center text-center text-orange-950 font-sans">
          <div className="w-48 h-48 rounded-full border-4 border-dashed border-current flex items-center justify-center mb-2 p-4">
            <OrangeSolarLogo variant="color" className="w-full h-auto" />
          </div>
          <span className="text-xl font-black tracking-widest uppercase">
            SUN ZONE SOLAR SYSTEM
          </span>
          <span className="text-xs font-bold tracking-widest uppercase">
            OFFICIAL SECURITY SEAL • ISO 9001:2015
          </span>
        </div>
      )}
    </div>
  );
}
