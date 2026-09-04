import React from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface FavoritesViewProps {
  favoriteItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  onToggleFavorite: (item: MenuItem) => void;
  onGoToMenu: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteItems,
  onSelectItem,
  onQuickAdd,
  onToggleFavorite,
  onGoToMenu
}) => {
  return (
    <div className="pb-28 animate-fade-fast">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="brand-font text-lg font-black text-neutral-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#e51d5a] fill-[#e51d5a]" />
              <span>Tus Favoritos</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Guarda tus antojos favoritos para pedirlos al toque
            </p>
          </div>
          <span className="text-xs font-black bg-[#e51d5a]/10 text-[#e51d5a] px-3 py-1 rounded-full">
            {favoriteItems.length} {favoriteItems.length === 1 ? 'favorito' : 'favoritos'}
          </span>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs mt-4">
            <div className="w-16 h-16 rounded-full bg-[#fdf2f5] text-[#e51d5a] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Heart className="w-8 h-8" />
            </div>
            <h4 className="brand-font text-base font-bold text-neutral-900 mb-1">
              Aún no tienes favoritos
            </h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
              Toca el ícono de corazón en cualquier sánguche o bebida del menú para agregarlos aquí.
            </p>
            <button
              onClick={onGoToMenu}
              className="px-5 py-3 bg-[#e51d5a] text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:bg-[#cf154e] transition-all inline-flex items-center gap-2"
            >
              <span>Explorar Menú</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {favoriteItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelectItem={onSelectItem}
                onQuickAdd={onQuickAdd}
                onToggleFavorite={onToggleFavorite}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
