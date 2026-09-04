import React from 'react';

interface ChurreLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  variant?: 'solid' | 'transparent';
}

export const ChurreLogo: React.FC<ChurreLogoProps> = ({
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-1">
      <div className={`flex flex-col items-center leading-none ${sizeClasses[size]}`}>
        <span className="font-black tracking-tight text-[#e51d5a] drop-shadow-sm font-sans" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '0.05em' }}>
          CHURRE MALCRIADO
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-700 mt-1">
          SANGUCHES CON CALLE
        </span>
      </div>
    </div>
  );
};
