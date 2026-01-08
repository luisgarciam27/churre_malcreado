
import React from 'react';
import { MenuItem } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, event: React.MouseEvent) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      
      <div 
        className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(233,30,99,0.3)] animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Imagen de Impacto */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
          </div>

          {/* Contenido Detallado */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-[#e91e63] text-[10px] font-black uppercase tracking-[0.3em] bg-pink-50 px-3 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 brand-font mb-4 leading-none">
              {item.name}
            </h2>

            <div className="flex gap-2 mb-6 flex-wrap">
              <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-3 py-1 rounded-lg uppercase">
                <i className="fa-solid fa-fire-flame-curved mr-1 text-orange-500"></i> Calientito
              </span>
              <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-3 py-1 rounded-lg uppercase">
                <i className="fa-solid fa-heart mr-1 text-pink-500"></i> Artesanal
              </span>
              {item.isPopular && (
                <span className="bg-[#fdd835]/20 text-[#e91e63] text-[9px] font-black px-3 py-1 rounded-lg uppercase">
                  ⭐ El más pedido
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              {item.description}
            </p>

            {item.note && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-xl">
                <p className="text-blue-600 text-xs font-bold italic">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  {item.note}
                </p>
              </div>
            )}

            <div className="mt-auto flex items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Precio</span>
                <span className="text-3xl font-black text-[#e91e63]">S/ {item.price.toFixed(2)}</span>
              </div>

              <button 
                onClick={(e) => {
                  onAddToCart(item, e);
                  onClose();
                }}
                className="bg-[#e91e63] hover:bg-[#c2185b] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-pink-200 transition-all transform active:scale-90 flex items-center gap-3"
              >
                <i className="fa-solid fa-cart-plus"></i>
                ¡Lo quiero!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
