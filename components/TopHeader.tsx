import React from 'react';
import { Bike, Store, Share2 } from 'lucide-react';
import { ChurreLogo } from './ChurreLogo';

interface TopHeaderProps {
  modality: 'delivery' | 'pickup';
  onToggleModality: (modality: 'delivery' | 'pickup') => void;
  showModalityToggle?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  modality,
  onToggleModality,
  showModalityToggle = true
}) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Churre Malcriado - Sabor Piurano con Calle',
      text: '¡Prueba los mejores chicharrones y antojitos piuranos en el Mercado 2 de Surquillo!',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace del menú copiado al portapapeles!');
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.04)] text-neutral-900">
      {/* Top Bar with Location and Share Button */}
      <div className="max-w-2xl mx-auto px-4 pt-2.5 flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#e51d5a] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e51d5a] animate-pulse"></span>
          <span>Surquillo • Lima</span>
        </div>

        <button
          id="share-menu-top-btn"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#e51d5a]/10 hover:bg-[#e51d5a]/20 text-[#e51d5a] transition-all active:scale-95 shadow-xs"
          title="Compartir Menú"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir Menú</span>
        </button>
      </div>

      {/* Brand Header */}
      <div className="px-4 py-2 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <ChurreLogo size="sm" showSubtitle={true} variant="transparent" />

        {/* Toggle Delivery / Retiro en Local */}
        {showModalityToggle && (
          <div className="mt-2.5 w-full max-w-xs p-1 rounded-2xl flex items-center bg-neutral-100 border border-neutral-200 shadow-inner">
            <button
              id="delivery-tab-btn"
              onClick={() => onToggleModality('delivery')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                modality === 'delivery'
                  ? 'bg-[#e51d5a] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>
            <button
              id="pickup-tab-btn"
              onClick={() => onToggleModality('pickup')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                modality === 'pickup'
                  ? 'bg-[#e51d5a] text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Retiro en Local</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
