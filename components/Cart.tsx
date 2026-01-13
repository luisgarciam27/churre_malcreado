
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
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrderType(initialModality);
    if (!isOpen) setStep(1);
  }, [initialModality, isOpen]);

  const total = items.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.price;
    return sum + price * item.quantity;
  }, 0);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = async () => {
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
      `*PEDIDO FORMAL - EL CHURRE MALCRIADO*\n\n` +
      `Cliente: ${customerName}\n` +
      `Modo: ${orderType.toUpperCase()}\n` +
      (orderType === 'delivery' ? `Ubicación: ${address}\n` : '') +
      `--------------------------------\n` +
      items.map(i => `• ${i.quantity}x ${i.name} ${i.selectedVariant ? `[${i.selectedVariant.name}]` : ''}`).join('\n') +
      `\n\nTotal: S/ ${total.toFixed(2)}\n` +
      `--------------------------------\n` +
      `Solicito confirmación de recepción.`
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
        className="fixed bottom-10 right-10 bg-[#121212] text-white w-16 h-16 rounded-full shadow-2xl z-50 flex items-center justify-center transition-transform active:scale-95"
      >
        <i className="fa-solid fa-shopping-bag text-xl"></i>
        <span className="absolute -top-1 -right-1 bg-[#a88a4d] text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{totalItems}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onToggle}></div>
      
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Resumen de Selección</span>
            <h2 className="text-2xl font-bold serif-font">Su Carrito</h2>
          </div>
          <button onClick={onToggle} className="text-gray-400 hover:text-black transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <i className="fa-solid fa-bag-shopping text-4xl mb-4 opacity-20"></i>
              <p className="text-[10px] uppercase font-bold tracking-widest">No hay selecciones</p>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start group">
                  <div className="flex-1 pr-6">
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tight">{item.name}</p>
                    {item.selectedVariant && <p className="text-[9px] font-bold text-[#a88a4d] uppercase mt-1">{item.selectedVariant.name}</p>}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => onUpdateQuantity(item.id, -1, item.selectedVariant?.id)} className="text-gray-300 hover:text-black"><i className="fa-solid fa-minus text-[10px]"></i></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1, item.selectedVariant?.id)} className="text-gray-300 hover:text-black"><i className="fa-solid fa-plus text-[10px]"></i></button>
                      </div>
                      <button onClick={() => onRemove(item.id, item.selectedVariant?.id)} className="text-gray-200 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can text-[10px]"></i></button>
                    </div>
                  </div>
                  <span className="text-sm font-bold">S/ {((item.selectedVariant?.price || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <div className="space-y-4 mb-8">
            <input type="text" placeholder="NOMBRE COMPLETO" className="w-full bg-white border-b border-gray-200 py-3 text-[10px] font-bold outline-none focus:border-black uppercase tracking-widest" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            <input type="tel" placeholder="NÚMERO DE TELÉFONO" className="w-full bg-white border-b border-gray-200 py-3 text-[10px] font-bold outline-none focus:border-black uppercase tracking-widest" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            <div className="flex gap-4 pt-2">
              <button onClick={() => setOrderType('pickup')} className={`flex-1 py-3 text-[9px] font-bold border transition-all ${orderType === 'pickup' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-100'}`}>RECOJO</button>
              <button onClick={() => setOrderType('delivery')} className={`flex-1 py-3 text-[9px] font-bold border transition-all ${orderType === 'delivery' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-400 border-gray-100'}`}>DELIVERY</button>
            </div>
            {orderType === 'delivery' && (
              <input type="text" placeholder="DIRECCIÓN DE ENTREGA" className="w-full bg-white border-b border-gray-200 py-3 text-[10px] font-bold outline-none focus:border-black uppercase tracking-widest" value={address} onChange={e => setAddress(e.target.value)} />
            )}
          </div>

          <div className="flex justify-between items-end mb-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inversión Total</span>
            <span className="text-3xl font-bold serif-font">S/ {total.toFixed(2)}</span>
          </div>

          <button 
            disabled={!customerName || !customerPhone || items.length === 0} 
            onClick={handleWhatsAppOrder}
            className="w-full bg-black text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#a88a4d] transition-all disabled:opacity-20"
          >
            {isSaving ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
          </button>
        </div>
      </div>
    </div>
  );
};
