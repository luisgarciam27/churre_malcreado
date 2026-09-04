import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { MenuItem, ItemVariant } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    selectedVariant: ItemVariant | undefined,
    quantity: number,
    selectedSauces: string[],
    instructions: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    if (item) {
      if (item.variants && item.variants.length > 0) {
        setSelectedVariant(item.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      if (item.availableSauces && item.availableSauces.length > 0) {
        setSelectedSauces(item.availableSauces.slice(0, 2));
      } else {
        setSelectedSauces(['Salsa Chimichurri Especial 🌿', 'Mayonesa al Ajo 🧄']);
      }
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [item]);

  if (!item) return null;

  const unitPrice = selectedVariant ? selectedVariant.price : item.price;
  const totalPrice = unitPrice * quantity;

  const toggleSauce = (sauce: string) => {
    setSelectedSauces(prev =>
      prev.includes(sauce) ? prev.filter(s => s !== sauce) : [...prev, sauce]
    );
  };

  const handleAdd = () => {
    onAddToCart(item, selectedVariant, quantity, selectedSauces, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm sm:max-w-md max-h-[88vh] rounded-2xl shadow-xl flex flex-col overflow-hidden z-10 animate-fade-fast border border-neutral-100">
        
        {/* Header / Imagen Superior */}
        <div className="relative aspect-[21/9] w-full shrink-0 bg-neutral-900 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 text-neutral-800 hover:text-black flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>

          {item.badge && (
            <div className="absolute bottom-2.5 left-3 bg-[#e51d5a] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span>{item.badge}</span>
            </div>
          )}
        </div>

        {/* Contenido Scrollable */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          
          <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
            <div>
              <h3 className="brand-font text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                {item.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="brand-font text-base sm:text-lg font-black text-[#e51d5a]">
                S/ {unitPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {item.variants && item.variants.length > 0 && (
            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                Tamaño / Porción:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {item.variants.map(variant => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#e51d5a] bg-[#fdf2f5] text-[#e51d5a] shadow-xs ring-1 ring-[#e51d5a]/20'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <span className="truncate pr-2">{variant.name}</span>
                      <span className="font-bold text-[#e51d5a] shrink-0">
                        S/ {variant.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {item.availableSauces && item.availableSauces.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                  Cremas y Salsas:
                </label>
                <span className="text-[10px] text-neutral-400 font-medium">Opcional</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.availableSauces.map(sauce => {
                  const isChecked = selectedSauces.includes(sauce);
                  return (
                    <button
                      key={sauce}
                      type="button"
                      onClick={() => toggleSauce(sauce)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#e51d5a] text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-transparent'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                      <span>{sauce}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                Instrucciones especiales:
              </label>
            </div>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ej. bien tostado, sin cebolla, cremas aparte..."
              className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-[#e51d5a] focus:ring-2 focus:ring-[#e51d5a]/10 resize-none bg-neutral-50/50"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Cantidad:
            </span>
            <div className="flex items-center gap-2.5 bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-200">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-full bg-white text-[#e51d5a] flex items-center justify-center hover:bg-neutral-50 active:scale-95 shadow-xs transition-transform"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-extrabold text-xs text-neutral-900 w-5 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-full bg-white text-[#e51d5a] flex items-center justify-center hover:bg-neutral-50 active:scale-95 shadow-xs transition-transform"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Botón Pegajoso "Agregar al Carrito" */}
        <div className="p-3.5 bg-white border-t border-neutral-100 shrink-0">
          <button
            id="add-to-cart-submit-btn"
            type="button"
            onClick={handleAdd}
            className="w-full py-3 px-4 bg-[#e51d5a] hover:bg-[#cf154e] text-white rounded-xl font-extrabold text-xs transition-all shadow-[0_4px_16px_rgba(229,29,90,0.25)] active:scale-98 flex items-center justify-between"
          >
            <span className="tracking-wide">Agregar al Carrito</span>
            <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-xs font-black">
              S/ {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
