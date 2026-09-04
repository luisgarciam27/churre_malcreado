import React from 'react';
import { ArrowRight, Flame, Star, Sparkles, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { CATEGORIES } from '../data';
import { MenuItemCard } from './MenuItemCard';

interface HomeViewProps {
  onGoToMenu: () => void;
  featuredItem: MenuItem;
  popularItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onToggleFavorite: (item: MenuItem) => void;
  isFavorite: (id: string) => boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onGoToMenu,
  featuredItem,
  popularItems,
  onSelectItem,
  onToggleFavorite,
  isFavorite
}) => {
  return (
    <div className="pb-28 animate-fade-fast">
      
      {/* Banner / Hero Principal (Estilo Captura 1) */}
      <div className="px-4 pt-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1c0811] via-[#3d0f22] to-[#1c0811] text-white p-6 shadow-xl overflow-hidden border border-[#e51d5a]/30">
          <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-[#e51d5a]/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e51d5a]/30 border border-[#e51d5a]/50 text-[#fbbf24] text-[10px] font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Mercado 2 de Surquillo • Puesto 651</span>
            </div>

            <h2 className="brand-font text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
              El Auténtico <br />
              <span className="text-[#fbbf24]">Sabor Piurano</span> con Calle
            </h2>
            <p className="text-xs text-neutral-300 mb-5 max-w-xs leading-relaxed">
              Disfruta el legendario seco de res, chifles crocantes y los mejores sánguches artesanales de Lima.
            </p>

            <button
              id="hero-go-menu-btn"
              onClick={onGoToMenu}
              className="px-5 py-3 bg-[#e51d5a] hover:bg-[#cf154e] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-[#e51d5a]/30 transition-all flex items-center gap-2 active:scale-95 w-fit"
            >
              <span>Ver Menú Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categorías Destacadas (Grid estilo Captura 1) */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="brand-font text-base font-black text-neutral-900 flex items-center gap-1.5">
            <span>Categorías del Sabor</span>
          </h3>
          <button
            onClick={onGoToMenu}
            className="text-xs font-extrabold text-[#e51d5a] hover:underline"
          >
            Ver todas →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={onGoToMenu}
              className="bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-xs hover:border-[#e51d5a]/50 transition-all cursor-pointer text-center flex flex-col items-center group active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#fdf2f5] text-[#e51d5a] flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                {cat.emoji}
              </div>
              <h4 className="brand-font text-xs font-bold text-neutral-900 group-hover:text-[#e51d5a] transition-colors">
                {cat.name}
              </h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {cat.subtitle?.split('•')[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Producto Estrella Destacado (Banner Churre Malcriado) */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="brand-font text-base font-black text-neutral-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#e51d5a]" />
            <span>La Estrella de la Casa</span>
          </h3>
        </div>

        <div
          onClick={() => onSelectItem(featuredItem)}
          className="bg-gradient-to-r from-[#fdf2f5] to-white rounded-3xl p-4 border border-[#e51d5a]/25 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-sm relative">
            <img
              src={featuredItem.image}
              alt={featuredItem.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-black text-white px-2 py-0.5 rounded-md bg-[#e51d5a]">
              Top 1 ⭐
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#e51d5a] bg-white px-2 py-0.5 rounded-md border border-[#e51d5a]/20">
              Sánguche Estrella
            </span>
            <h4 className="brand-font text-base font-black text-neutral-900 truncate mt-1">
              {featuredItem.name}
            </h4>
            <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5">
              {featuredItem.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="brand-font text-lg font-black text-[#e51d5a]">
                S/ {featuredItem.price.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-neutral-700 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 group-hover:bg-[#e51d5a] group-hover:text-white group-hover:border-[#e51d5a] transition-all shadow-xs">
                Pedir Ahora →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Los Más Pedidos del Churre */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="brand-font text-base font-black text-neutral-900 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
            <span>Los Más Pedidos</span>
          </h3>
          <button
            onClick={onGoToMenu}
            className="text-xs font-extrabold text-[#e51d5a] hover:underline"
          >
            Ver menú →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {popularItems.slice(0, 4).map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelectItem={onSelectItem}
              onQuickAdd={(it, e) => {
                e.stopPropagation();
                onSelectItem(it);
              }}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Info rápida del Local */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#e51d5a]/10 text-[#e51d5a] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#e51d5a]">Ubicación Oficial</p>
              <p className="text-xs font-bold text-neutral-900">Mercado 2 de Surquillo • Puesto 651</p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 w-full" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#e51d5a]/10 text-[#e51d5a] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-[#e51d5a]">Horario</p>
              <p className="text-xs font-bold text-neutral-900">Martes a Domingo de 8:00 am a 5:00 pm</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
