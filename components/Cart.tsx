import React, { useState } from 'react';
import { X, Trash2, Minus, Plus, Copy, Check, Bike, Store, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onClearCart: () => void;
  modality: 'delivery' | 'pickup';
  onToggleModality: (m: 'delivery' | 'pickup') => void;
  whatsappNumber: string;
}

export const Cart: React.FC<CartProps> = ({
  items,
  isOpen,
  onClose,
  onRemove,
  onUpdateQuantity,
  onClearCart,
  modality,
  onToggleModality,
  whatsappNumber
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [hasCopiedPayment, setHasCopiedPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => {
    const unitPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');

  const handleCopyPayment = () => {
    navigator.clipboard.writeText(cleanWhatsappNumber);
    setHasCopiedPayment(true);
    setTimeout(() => setHasCopiedPayment(false), 4000);
  };

  const handleSendOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono para procesar tu pedido.');
      return;
    }

    if (modality === 'delivery' && !address.trim()) {
      alert('Por favor indica tu dirección de entrega.');
      return;
    }

    let msg = `*¡HOLA CHURRE MALCRIADO! DESEO REALIZAR UN PEDIDO:* 🔥\n\n`;
    msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    msg += `📱 *Teléfono:* ${customerPhone.trim()}\n`;
    msg += `📍 *Modalidad:* ${modality === 'delivery' ? '🛵 Delivery' : '🏬 Retiro en Local (Mercado 2 de Surquillo Puesto 651)'}\n`;
    if (modality === 'delivery') {
      msg += `🏠 *Dirección:* ${address.trim()}${reference ? ` (Ref: ${reference.trim()})` : ''}\n`;
    }
    msg += `\n*DETALLE DE TU BANQUETE:*\n`;
    items.forEach((item) => {
      const price = item.selectedVariant ? item.selectedVariant.price : item.price;
      msg += `• ${item.quantity}x ${item.name}`;
      if (item.selectedVariant) {
        msg += ` [${item.selectedVariant.name}]`;
      }
      msg += ` - S/ ${(price * item.quantity).toFixed(2)}\n`;
      if (item.selectedSauces && item.selectedSauces.length > 0) {
        msg += `   └ Salsas: ${item.selectedSauces.join(', ')}\n`;
      }
      if (item.specialInstructions) {
        msg += `   └ Nota: "${item.specialInstructions}"\n`;
      }
    });

    msg += `\n*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n\n`;
    msg += `_Adjuntaré el comprobante de Yape/Plin a este chat._ 🌶️`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${cleanWhatsappNumber}?text=${encoded}`, '_blank');
    setIsSuccess(true);
  };

  const handleResetAfterOrder = () => {
    setIsSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col z-10 animate-fade-fast">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#fdf2f5] text-[#e51d5a] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="brand-font text-base font-bold text-slate-900">
                Tu Carrito ({totalItemsCount})
              </h3>
              <p className="text-[11px] text-slate-500">
                {modality === 'delivery' ? 'Delivery a Domicilio' : 'Retiro en Local'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Pantalla de Éxito */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="brand-font text-2xl font-black text-slate-900">
              ¡Pedido Enviado, Churre!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mt-2 leading-relaxed">
              Tu mensaje se abrió en WhatsApp. Envía el mensaje con tu comprobante de Yape o Plin para empezar a cocinar tu banquete de inmediato.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#fdf2f5] border border-[#e51d5a]/25 text-left w-full text-xs text-[#e51d5a]">
              <p className="font-bold">Total a Transferir:</p>
              <p className="text-2xl font-black mt-0.5">S/ {total.toFixed(2)}</p>
              <p className="text-[11px] opacity-80 mt-1">Yape / Plin: {cleanWhatsappNumber}</p>
            </div>

            <button
              onClick={handleResetAfterOrder}
              className="mt-8 w-full py-3.5 bg-[#e51d5a] text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-md hover:bg-[#cf154e]"
            >
              Hacer otro pedido
            </button>
          </div>
        ) : (
          /* Flujo del Carrito */
          <>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              
              {/* Modalidad de entrega */}
              <div className="bg-[#fdf2f5] p-1 rounded-2xl flex items-center border border-[#e51d5a]/25">
                <button
                  type="button"
                  onClick={() => onToggleModality('delivery')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modality === 'delivery'
                      ? 'bg-[#e51d5a] text-white shadow-xs'
                      : 'text-[#e51d5a]/80 hover:text-[#e51d5a]'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleModality('pickup')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    modality === 'pickup'
                      ? 'bg-[#e51d5a] text-white shadow-xs'
                      : 'text-[#e51d5a]/80 hover:text-[#e51d5a]'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Retiro en Local</span>
                </button>
              </div>

              {/* Lista de Items */}
              {items.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-bold">Tu carrito está vacío</p>
                  <p className="text-[11px] mt-1">Agrega tus sánguches y combos favoritos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => {
                    const price = item.selectedVariant ? item.selectedVariant.price : item.price;
                    return (
                      <div
                        key={item.cartItemId}
                        className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex gap-3 relative"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 bg-neutral-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[10px] font-semibold text-[#e51d5a]">
                              {item.selectedVariant.name}
                            </p>
                          )}
                          {item.selectedSauces && item.selectedSauces.length > 0 && (
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {item.selectedSauces.join(', ')}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-[10px] text-slate-400 italic truncate">
                              "{item.specialInstructions}"
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-black text-[#e51d5a]">
                              S/ {(price * item.quantity).toFixed(2)}
                            </span>

                            {/* Controles de Cantidad */}
                            <div className="flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              <button
                                onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                                className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                                className="w-5 h-5 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemove(item.cartItemId)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formulario de Entrega */}
              {items.length > 0 && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 mt-4">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    Datos del Pedido
                  </span>

                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre completo *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#e51d5a]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Número de celular WhatsApp *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#e51d5a]"
                    />
                  </div>

                  {modality === 'delivery' && (
                    <>
                      <div>
                        <input
                          type="text"
                          placeholder="Dirección de entrega *"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#e51d5a]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Referencia (ej. frente al parque, portón blanco)"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#e51d5a]"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Pago Yape / Plin */}
              {items.length > 0 && (
                <div className="bg-[#fdf2f5] p-3.5 rounded-2xl border border-[#e51d5a]/25 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-[#e51d5a]">
                      Paga Fácil con Yape o Plin
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      Aceptado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Toca para copiar el número y realiza tu pago:
                  </p>
                  <button
                    onClick={handleCopyPayment}
                    className="w-full py-2.5 px-3 bg-white rounded-xl border border-[#e51d5a]/25 flex items-center justify-between text-[#e51d5a] font-black text-sm hover:bg-[#fdf2f5] active:scale-98 transition-all"
                  >
                    <span>{cleanWhatsappNumber}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                      {hasCopiedPayment ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              )}

            </div>

            {/* Footer con Resumen y Botón de Enviar Pedido */}
            {items.length > 0 && (
              <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-100">
                    <span>Total a Pagar</span>
                    <span className="text-[#e51d5a]">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="checkout-whatsapp-btn"
                  onClick={handleSendOrder}
                  className="w-full py-3.5 px-5 bg-[#e51d5a] hover:bg-[#cf154e] text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>Enviar Pedido por WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
