
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { supabase } from '../services/supabaseClient';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string, variantId?: string) => void;
  onUpdateQuantity: (id: string, delta: number, variantId?: string) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onToggle: () => void;
  initialModality: 'delivery' | 'pickup';
  whatsappNumber: string;
  paymentQr?: string;
  paymentName?: string;
}

type OrderType = 'delivery' | 'pickup';

export const Cart: React.FC<CartProps> = ({ 
  items, onRemove, onUpdateQuantity, onClearCart, isOpen, onToggle, 
  initialModality, whatsappNumber, paymentQr, paymentName 
}) => {
  const [orderType, setOrderType] = useState<OrderType>(initialModality);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const STORE_ADDRESS = "Mercado 2 de Surquillo, Puesto 651";

  useEffect(() => {
    setOrderType(initialModality);
  }, [initialModality, isOpen]);

  const total = items.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.price;
    return sum + price * item.quantity;
  }, 0);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = async () => {
    if (!customerName || !customerPhone || (orderType === 'delivery' && !address)) {
      alert("¡Habla sobrino! Completa todos los datos para llevarte tu pedido.");
      return;
    }

    setIsSaving(true);
    try {
      await supabase.from('orders').insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items.map(i => ({ 
          name: i.name, 
          quantity: i.quantity, 
          price: i.selectedVariant ? i.selectedVariant.price : i.price,
          variant: i.selectedVariant?.name || null
        })),
        total: total,
        modality: orderType,
        address: orderType === 'delivery' ? address : 'Tienda Principal',
        status: 'Pendiente',
        order_origin: 'Web'
      });
    } catch (e) { console.error(e); }

    const message = encodeURIComponent(
      `*PEDIDO MALCRIADO - WEB*\n\n` +
      `🔥 *Cliente:* ${customerName}\n` +
      `📞 *Teléfono:* ${customerPhone}\n` +
      `📍 *Modo:* ${orderType === 'delivery' ? '🚀 Delivery' : '🏪 Recojo en Tienda'}\n` +
      (orderType === 'delivery' ? `🏠 *Dirección:* ${address}\n` : `🏢 *Punto:* ${STORE_ADDRESS}\n`) +
      `\n*DETALLE DEL BANQUETE:*\n` +
      items.map(i => `• ${i.quantity}x ${i.name} ${i.selectedVariant ? `(${i.selectedVariant.name})` : ''} - S/ ${((i.selectedVariant?.price || i.price) * i.quantity).toFixed(2)}`).join('\n') +
      `\n\n*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n` +
      `\n--------------------------------\n` +
      `_¡Churre, confírmame el pedido para prender el fuego!_ 🌶️`
    );

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    setIsSaving(false);
  };

  if (!isOpen) {
    if (totalItems === 0) return null;
    return (
      <button 
        onClick={onToggle} 
        className="fixed bottom-10 right-10 bg-[#e91e63] text-white w-20 h-20 rounded-full shadow-[0_15px_30px_rgba(233,30,99,0.4)] z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-bounce-slow"
      >
        <i className="fa-solid fa-basket-shopping text-2xl"></i>
        <span className="absolute -top-1 -right-1 bg-[#fdd835] text-black text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-md">{totalItems}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end animate-fade-in">
      <div className="absolute inset-0 bg-[#3d1a1a]/40 backdrop-blur-md" onClick={onToggle}></div>
      
      <div className="relative bg-[#f8eded] w-full max-w-lg h-full shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-[#e91e63]/10 flex justify-between items-center bg-white">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e91e63]/40 block mb-1">Resumen de Selección</span>
            <h2 className="text-3xl font-bold brand-font text-[#3d1a1a]">Su Carrito</h2>
          </div>
          <button 
            onClick={onToggle} 
            className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-[#e91e63] transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-inner mb-6">
                <i className="fa-solid fa-cart-arrow-down text-3xl opacity-20"></i>
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-center">¡Habla churre! <br/> No has pedido nada aún.</p>
              <button 
                onClick={onToggle}
                className="mt-6 text-[10px] font-black uppercase text-[#e91e63] border-b-2 border-[#e91e63] pb-1 hover:brightness-110"
              >
                Volver a la carta
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                 <h4 className="text-[11px] font-black uppercase text-[#3d1a1a]/30 tracking-widest">Tus antojos ({totalItems})</h4>
                 <button onClick={onToggle} className="text-[10px] font-black text-[#e91e63] uppercase bg-pink-50 px-4 py-2 rounded-xl border border-[#e91e63]/10 hover:bg-pink-100 transition-all">Seguir Pidiendo</button>
              </div>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-[#e91e63]/5 shadow-sm flex items-center gap-4 animate-fade-in-up">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-[#3d1a1a] uppercase truncate">{item.name}</p>
                      {item.selectedVariant && <p className="text-[9px] font-black text-[#e91e63] uppercase">{item.selectedVariant.name}</p>}
                      <div className="flex items-center gap-4 mt-2">
                         <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                           <button onClick={() => onUpdateQuantity(item.id, -1, item.selectedVariant?.id)} className="text-slate-300 hover:text-[#e91e63] transition-colors"><i className="fa-solid fa-minus text-[10px]"></i></button>
                           <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                           <button onClick={() => onUpdateQuantity(item.id, 1, item.selectedVariant?.id)} className="text-slate-300 hover:text-[#e91e63] transition-colors"><i className="fa-solid fa-plus text-[10px]"></i></button>
                         </div>
                         <button onClick={() => onRemove(item.id, item.selectedVariant?.id)} className="text-slate-200 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-[#3d1a1a]">S/ {((item.selectedVariant?.price || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Checkout Form */}
        <div className="p-8 md:p-10 bg-white border-t border-[#e91e63]/10 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          <div className="space-y-5 mb-8">
            <div className="flex bg-[#f8eded] p-1.5 rounded-[1.5rem] gap-1.5 border border-[#e91e63]/10">
              <button 
                onClick={() => setOrderType('pickup')} 
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${orderType === 'pickup' ? 'bg-[#e91e63] text-white shadow-lg shadow-pink-100' : 'text-[#e91e63]/40 hover:bg-white'}`}
              >
                <i className="fa-solid fa-shop"></i> RECOJO
              </button>
              <button 
                onClick={() => setOrderType('delivery')} 
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${orderType === 'delivery' ? 'bg-[#e91e63] text-white shadow-lg shadow-pink-100' : 'text-[#e91e63]/40 hover:bg-white'}`}
              >
                <i className="fa-solid fa-motorcycle"></i> DELIVERY
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-[#e91e63]/20"></i>
                <input 
                  type="text" 
                  placeholder="TU NOMBRE COMPLETO" 
                  className="w-full bg-[#f8eded] border-none py-4 pl-12 pr-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                />
              </div>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-[#e91e63]/20"></i>
                <input 
                  type="tel" 
                  placeholder="NÚMERO DE TELÉFONO" 
                  className="w-full bg-[#f8eded] border-none py-4 pl-12 pr-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest" 
                  value={customerPhone} 
                  onChange={e => setCustomerPhone(e.target.value)} 
                />
              </div>
              
              {orderType === 'delivery' ? (
                <div className="relative animate-fade-in-up">
                  <i className="fa-solid fa-location-dot absolute left-5 top-1/2 -translate-y-1/2 text-[#e91e63]/20"></i>
                  <input 
                    type="text" 
                    placeholder="DIRECCIÓN DE ENTREGA" 
                    className="w-full bg-[#f8eded] border-none py-4 pl-12 pr-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                  />
                </div>
              ) : (
                <div className="bg-[#fdd835]/10 border border-[#fdd835]/30 p-4 rounded-2xl flex items-center gap-4 animate-fade-in-up">
                  <div className="w-10 h-10 bg-[#fdd835] rounded-xl flex items-center justify-center text-black shadow-sm">
                    <i className="fa-solid fa-location-pin"></i>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-[#3d1a1a]/40 uppercase tracking-widest">Recoges en:</p>
                    <p className="text-[10px] font-black text-[#3d1a1a] uppercase">{STORE_ADDRESS}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <span className="text-[10px] font-black text-[#e91e63]/40 uppercase tracking-widest block mb-1">Inversión Total</span>
              <span className="text-4xl font-black text-[#e91e63] brand-font tracking-tighter">S/ {total.toFixed(2)}</span>
            </div>
            <span className="text-[10px] font-black text-[#3d1a1a]/20 uppercase tracking-[0.3em]">Incluye Sazón</span>
          </div>

          <button 
            disabled={!customerName || !customerPhone || (orderType === 'delivery' && !address) || items.length === 0 || isSaving} 
            onClick={handleWhatsAppOrder}
            className="w-full bg-[#e91e63] text-white py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-pink-200 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-4"
          >
            {isSaving ? (
              <i className="fa-solid fa-spinner fa-spin text-lg"></i>
            ) : (
              <>
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>CONFIRMAR PEDIDO</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
