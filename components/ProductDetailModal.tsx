
import React, { useState, useEffect } from 'react';
import { MenuItem, ItemVariant } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, selectedVariant?: ItemVariant) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | undefined>(undefined);

  useEffect(() => {
    if (item && item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
  }, [item]);

  if (!item) return null;

  const currentPrice = selectedVariant ? selectedVariant.price : item.price;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-8 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-[#3d1a1a]/40 backdrop-blur-md"></div>
      
      <div 
        className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[85vh] md:rounded-[4rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-[210] w-12 h-12 bg-white text-[#e91e63] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="w-full md:w-1/2 h-[45vh] md:h-full bg-pink-50">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto">
          <div className="p-8 md:p-14 flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e91e63]/30 mb-4 block">Detalle Malcriado</span>
            <h2 className="brand-font text-4xl md:text-5xl font-bold text-[#3d1a1a] mb-6 leading-tight">
              {item.name}
            </h2>
            <div className="h-1 w-12 bg-[#fdd835] mb-8 rounded-full"></div>
            <p className="text-[#3d1a1a]/60 text-base md:text-lg leading-relaxed mb-10 font-medium italic">
              "{item.description}"
            </p>

            {item.variants && item.variants.length > 0 && (
              <div className="mb-10 space-y-4">
                <label className="text-[9px] font-black uppercase text-[#e91e63] tracking-widest ml-1">Selecciona el tamaño:</label>
                <div className="grid grid-cols-1 gap-3">
                  {item.variants.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)} 
                      className={`flex justify-between items-center p-5 rounded-[2rem] border-2 transition-all ${selectedVariant?.id === v.id ? 'border-[#e91e63] bg-pink-50' : 'border-[#f8eded] text-[#3d1a1a]/40 hover:border-pink-50'}`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest">{v.name}</span>
                      <span className="text-sm font-black">S/ {v.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {item.note && (
              <div className="p-4 bg-[#fdd835]/10 border border-[#fdd835]/30 rounded-2xl flex items-center gap-4 mb-8">
                 <i className="fa-solid fa-calendar-day text-[#fdd835] text-xl"></i>
                 <p className="text-[10px] font-black uppercase text-[#3d1a1a]/60">{item.note}</p>
              </div>
            )}
          </div>

          <div className="p-8 md:p-14 border-t border-[#f8eded] flex flex-col md:flex-row items-center gap-8 bg-[#f8eded]/30">
            <div className="flex flex-col text-center md:text-left">
              <span className="text-[#3d1a1a]/30 text-[9px] font-black uppercase tracking-widest">A pagar</span>
              <span className="text-4xl font-black text-[#e91e63] brand-font tracking-tighter">S/ {currentPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { onAddToCart(item, selectedVariant); onClose(); }} 
              className="flex-1 w-full md:w-auto bg-[#e91e63] text-white py-6 rounded-full brand-font font-bold uppercase tracking-widest shadow-2xl shadow-pink-200 active:scale-95 transition-all"
            >
              ¡Al Carro!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
