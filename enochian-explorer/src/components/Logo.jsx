import React from 'react';

const Logo = ({ size = 50, color = "#d4af37" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.4))' }}
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="1.5" opacity="0.6" />
      
      {/* Internal Grid representing the 4 Watchtowers */}
      <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="5" y1="50" x2="95" y2="50" stroke={color} strokeWidth="1" opacity="0.4" />
      
      {/* Minimalistic Enochian Symbol - Heptagram style lines */}
      <path 
        d="M50 15 L60 40 L85 40 L65 55 L75 80 L50 65 L25 80 L35 55 L15 40 L40 40 Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Center dot */}
      <circle cx="50" cy="50" r="2" fill={color} />
    </svg>
  );
};

export default Logo;
