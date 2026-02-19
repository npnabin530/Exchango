import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E0FF" />
          <stop offset="100%" stopColor="#0054FF" />
        </linearGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0, 163, 255, 0.4)" />
        </filter>
      </defs>
      
      <g filter="url(#dropShadow)">
        {/* Outer Ring - Top Arc */}
        <path 
          d="M256 64 C362 64 448 150 448 256 C448 300 433 340 408 372" 
          stroke="url(#logo_grad)" 
          strokeWidth="64" 
          strokeLinecap="round"
        />
        {/* Arrow Head Top Right */}
        <path 
          d="M448 64 L448 160 L352 160" 
          stroke="url(#logo_grad)" 
          strokeWidth="64" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          transform="rotate(-15 400 112)" 
        />
        
        {/* Outer Ring - Bottom Arc */}
        <path 
          d="M256 448 C150 448 64 362 64 256 C64 212 79 172 104 140" 
          stroke="url(#logo_grad)" 
          strokeWidth="64" 
          strokeLinecap="round"
        />
         {/* Arrow Head Bottom Left */}
         <path 
          d="M64 448 L64 352 L160 352" 
          stroke="url(#logo_grad)" 
          strokeWidth="64" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          transform="rotate(165 112 400)" 
        />
      </g>

      {/* Center Lines - The "Exchange" Symbol */}
      <rect x="156" y="210" width="200" height="42" rx="21" fill="url(#logo_grad)" />
      <rect x="156" y="280" width="140" height="42" rx="21" fill="url(#logo_grad)" opacity="0.9" />
    </svg>
  );
};