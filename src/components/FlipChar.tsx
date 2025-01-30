import React, { useEffect, useState } from 'react';

interface FlipCharProps {
  char: string;
  delay?: number;
}

export function FlipChar({ char, delay = 0 }: FlipCharProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayChar, setDisplayChar] = useState(' ');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setDisplayChar(char);
        setIsFlipping(false);
      }, 150);
    }, delay);

    return () => clearTimeout(timer);
  }, [char, delay]);

  return (
    <div className="relative w-12 h-16 bg-black rounded-sm mx-[1px]">
      {/* Top shadow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />
      
      {/* Split line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black z-10" />
      
      {/* Character display */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
          isFlipping ? 'animate-flip-down' : ''
        }`}
      >
        <span className="font-mono text-3xl font-bold text-white">
          {displayChar}
        </span>
      </div>
      
      {/* 3D effect overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      
      {/* Side shadows */}
      <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-black/50" />
      <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-black/50" />
    </div>
  );
}