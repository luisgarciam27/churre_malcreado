import React from 'react';
import { Plus, Heart } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  onToggleFavorite: (item: MenuItem) => void;
  isFavorite: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onSelectItem,
  onQuickAdd,
  onToggleFavorite,
  isFavorite
}) => {
  return (
    <div
      onClick={() => onSelectItem(item)}
      className="group bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative active:scale-[0.98]"
    >
      {/* Imagen & Badges */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge superior si existe */}
        {item.badge && (
          <div className="absolute top-2.5 left-2.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
            {item.badge}
          </div>
        )}

        {/* Botón de Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 shadow-sm ${
            isFavorite
              ? 'bg-[#e51d5a] text-white'
              : 'bg-white/80 text-neutral-600 hover:text-[#e51d5a]'
          }`}
          title="Favorito"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="brand-font text-sm font-bold text-neutral-900 group-hover:text-[#e51d5a] transition-colors line-clamp-1">
            {item.name}
          </h4>
          <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Precio & Botón Agregar */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 block uppercase">Precio</span>
            <span className="brand-font text-base font-black text-[#e51d5a]">
              S/ {item.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={(e) => onQuickAdd(item, e)}
            className="w-8 h-8 rounded-2xl bg-[#fdf2f5] hover:bg-[#e51d5a] text-[#e51d5a] hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-90"
            title="Agregar"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
