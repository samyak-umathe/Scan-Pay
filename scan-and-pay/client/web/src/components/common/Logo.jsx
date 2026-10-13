import React from 'react';

const Logo = ({ size = 28 }) => {
  return (
    <svg 
      width={size} 
      height={size * 1.5} 
      viewBox="0 0 100 150" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width="100" height="150" rx="30" fill="#eb2525" />
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="central" 
        textAnchor="middle" 
        fill="white" 
        fontSize="100px" 
        fontWeight="800" 
        fontFamily="Inter, sans-serif"
        letterSpacing="-2px"
      >
        B
      </text>
    </svg>
  );
};

export default Logo;
