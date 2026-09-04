import React from 'react';
import { Home, UtensilsCrossed, Heart, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'inicio' | 'menu' | 'favoritos';
  onSelectTab: (tab: 'inicio' | 'menu' | 'favoritos') => void;
  favoritesCount: number;
  cartCount: number;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  cartCount,
  onOpenCart
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-around">
        
        {/* Tab Inicio */}
        <button
          id="nav-tab-inicio"
          onClick={() => onSelectTab('inicio')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'inicio'
              ? 'text-[#e51d5a] font-black scale-105'
              : 'text-neutral-400 hover:text-neutral-700 font-bold'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Inicio</span>
        </button>

        {/* Tab Menú */}
        <button
          id="nav-tab-menu"
          onClick={() => onSelectTab('menu')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'menu'
              ? 'text-[#e51d5a] font-black scale-105'
              : 'text-neutral-400 hover:text-neutral-700 font-bold'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Menú</span>
        </button>

        {/* Tab Favoritos */}
        <button
          id="nav-tab-favoritos"
          onClick={() => onSelectTab('favoritos')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
            activeTab === 'favoritos'
              ? 'text-[#e51d5a] font-black scale-105'
              : 'text-neutral-400 hover:text-neutral-700 font-bold'
          }`}
        >
          <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#e51d5a]/20' : ''}`} />
          <span className="text-[10px] tracking-tight">Favoritos</span>
          {favoritesCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#e51d5a] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Botón Carrito Flotante Inferior */}
        <button
          id="open-cart-floating-btn"
          onClick={onOpenCart}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e51d5a] hover:bg-[#cf154e] text-white rounded-2xl shadow-md transition-all active:scale-95 font-black text-xs"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[#fbbf24] text-neutral-900 text-[9px] font-black flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Carrito</span>
        </button>

      </div>
    </div>
  );
};
