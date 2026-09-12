import React from 'react';

export default function OrangeSolarLogo({ 
  className = "h-9 w-auto", 
  variant = "color", // "color" | "white" | "monochrome"
  showSubtext = true,
  showTagline = false 
}) {
  const isWhite = variant === "white";
  const textColor = isWhite ? "#ffffff" : "#0f172a";
  const subtextColor = isWhite ? "#cbd5e1" : "#1e293b";
  const orange1 = isWhite ? "#ff9a3d" : "#ff7a00";
  const orange2 = isWhite ? "#fb923c" : "#f5821f";
  const orange3 = isWhite ? "#f97316" : "#d95b00";
  const leaf1 = isWhite ? "#4ade80" : "#22c55e";
  const leaf2 = isWhite ? "#22c55e" : "#16a34a";
  const leafVein = isWhite ? "#166534" : "#15803d";
  const tmColor = isWhite ? "#94a3b8" : "#64748b";

  return (
    <div className="inline-flex flex-col select-none">
      <svg
        viewBox="0 0 330 112"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`orangeGrad_${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={orange1} />
            <stop offset="50%" stopColor={orange2} />
            <stop offset="100%" stopColor={orange3} />
          </linearGradient>
          <linearGradient id={`leafGrad_${variant}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={leaf1} />
            <stop offset="100%" stopColor={leaf2} />
          </linearGradient>
          <filter id={`dropShad_${variant}`} x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#ea580c" floodOpacity={isWhite ? "0" : "0.22"} />
          </filter>
        </defs>

        {showSubtext && (
          <text
            x="176"
            y="23"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="11.5"
            fontWeight="800"
            letterSpacing="2.6"
            fill={subtextColor}
          >
            A SUN ZONE PRODUCT
          </text>
        )}

        {/* Leaf atop 'O' */}
        <g transform="translate(48, 12) rotate(-8)">
          <path
            d="M 0,22 C 2,10 12,2 26,0 C 26,14 18,24 4,25 Z"
            fill={`url(#leafGrad_${variant})`}
          />
          <path
            d="M 2,21 Q 12,12 24,2"
            stroke={leafVein}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* 'Orange' Typography */}
        <g filter={`url(#dropShad_${variant})`}>
          {/* Capital O */}
          <path
            d="M 52,38 C 28,38 10,54 10,74 C 10,94 28,104 52,104 C 76,104 94,94 94,74 C 94,54 76,38 52,38 Z M 52,53 C 65,53 74,62 74,74 C 74,86 65,89 52,89 C 39,89 30,86 30,74 C 30,62 39,53 52,53 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
          {/* r */}
          <path
            d="M 98,54 L 115,54 L 115,62 C 119,56 125,53 133,54 L 131,70 C 124,69 117,72 115,77 L 115,103 L 98,103 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
          {/* a */}
          <path
            d="M 163,54 L 180,54 L 180,103 L 165,103 L 165,96 C 160,101 153,105 144,105 C 132,105 122,96 122,83 C 122,69 133,62 147,61 C 153,61 159,62 163,64 L 163,62 C 163,56 157,52 149,52 C 141,52 135,55 131,58 L 126,46 C 133,40 144,38 155,38 C 163,38 168,40 172,44 C 177,48 179,54 179,62 Z M 163,77 C 159,75 154,74 149,74 C 142,74 138,77 138,83 C 138,89 143,92 149,92 C 156,92 161,87 163,81 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
          {/* n */}
          <path
            d="M 189,54 L 206,54 L 206,62 C 211,56 218,53 228,53 C 241,53 248,61 248,75 L 248,103 L 231,103 L 231,78 C 231,70 227,66 220,66 C 213,66 208,70 206,77 L 206,103 L 189,103 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
          {/* g */}
          <path
            d="M 283,54 L 283,96 C 283,111 272,120 256,120 C 244,120 234,115 229,108 L 239,97 C 243,102 249,106 256,106 C 263,106 267,101 267,93 L 267,87 C 263,92 256,96 248,96 C 234,96 225,85 225,74 C 225,60 235,53 248,53 C 256,53 263,57 267,62 L 267,54 Z M 267,74 C 267,68 262,64 256,64 C 249,64 244,68 244,74 C 244,81 249,85 256,85 C 262,85 267,81 267,74 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
          {/* e */}
          <path
            d="M 315,75 L 290,75 C 291,66 296,62 303,62 C 309,62 313,65 315,69 L 327,61 C 322,53 313,48 302,48 C 287,48 275,59 275,76 C 275,93 287,104 303,104 C 318,104 328,94 328,79 L 328,75 Z M 290,83 C 292,89 297,93 303,93 C 310,93 314,89 316,83 Z"
            fill={`url(#orangeGrad_${variant})`}
          />
        </g>

        {/* SOLAR subtext */}
        <text
          x="180"
          y="107"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="14"
          fontWeight="900"
          letterSpacing="5.5"
          fill={textColor}
        >
          SOLAR
        </text>

        {/* TM mark */}
        <text
          x="323"
          y="54"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="8"
          fontWeight="700"
          fill={tmColor}
        >
          TM
        </text>
      </svg>
      {showTagline && (
        <span className={`text-[10px] font-black tracking-widest uppercase mt-1 ${isWhite ? 'text-amber-300' : 'text-orange-600'}`}>
          Powering Infinity
        </span>
      )}
    </div>
  );
}
