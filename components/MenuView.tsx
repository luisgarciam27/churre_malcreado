import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Category, MenuItem } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuViewProps {
  categories: Category[];
  menuItems: MenuItem[];
  activeCategory: string;
  onSelectCategory: (catName: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
  onToggleFavorite: (item: MenuItem) => void;
  isFavorite: (id: string) => boolean;
}

export const MenuView: React.FC<MenuViewProps> = ({
  categories,
  menuItems,
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  onSelectItem,
  onQuickAdd,
  onToggleFavorite,
  isFavorite
}) => {
  // Filtrar items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-28 animate-fade-fast">
      
      {/* Barra de Búsqueda */}
      <div className="px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar sánguche, chifles, jugo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-neutral-200/80 text-xs font-semibold text-neutral-900 placeholder-neutral-400 shadow-xs focus:outline-hidden focus:border-[#e51d5a] focus:ring-2 focus:ring-[#e51d5a]/10"
          />
        </div>
      </div>

      {/* Tabs de Categorías */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectCategory('Todos')}
            className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all shadow-xs ${
              activeCategory === 'Todos'
                ? 'bg-[#e51d5a] text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'
            }`}
          >
            🔥 Todos ({menuItems.length})
          </button>

          {categories.map(cat => {
            const count = menuItems.filter(i => i.category === cat.name).length;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wide whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#e51d5a] text-white shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultado del Conteo o Filtro */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <h3 className="brand-font text-sm font-bold text-neutral-900">
          {activeCategory === 'Todos' ? 'Toda la Carta' : activeCategory}
        </h3>
        <span className="text-[11px] text-neutral-400 font-medium">
          {filteredItems.length} {filteredItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Grid de Productos */}
      <div className="px-4 mt-3">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 bg-white rounded-3xl border border-neutral-200/80 mt-2">
            <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#e51d5a]" />
            <p className="text-xs font-bold text-neutral-700">No encontramos resultados</p>
            <p className="text-[11px] text-neutral-400 mt-1">Prueba buscando otro término o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelectItem={onSelectItem}
                onQuickAdd={onQuickAdd}
                onToggleFavorite={onToggleFavorite}
                isFavorite={isFavorite(item.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
