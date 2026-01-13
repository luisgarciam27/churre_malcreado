
import React, { useState, useMemo } from 'react';
import { MenuItem, Category, CashSession, CartItem, ItemVariant } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface POSCashierProps {
  menu: MenuItem[];
  categories: Category[];
  session: CashSession;
  onOrderComplete: () => void;
}

export const POSCashier: React.FC<POSCashierProps> = ({ menu, categories, session, onOrderComplete }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Yape' | 'Plin' | 'Tarjeta'>('Efectivo');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [itemForVariant, setItemForVariant] = useState<MenuItem | null>(null);
  
  // Estado del Recibo
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const addToCart = (item: MenuItem, variant?: ItemVariant) => {
    if (item.variants && item.variants.length > 0 && !variant) {
      setItemForVariant(item);
      return;
    }

    setCart(prev => {
      const variantId = variant?.id;
      const existing = prev.find(i => i.id === item.id && i.selectedVariant?.id === variantId);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.selectedVariant?.id === variantId) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, selectedVariant: variant }];
    });
    setItemForVariant(null);
  };

  const updateQty = (id: string, delta: number, variantId?: string) => {
    setCart(prev => prev.map(i => 
      (i.id === id && i.selectedVariant?.id === variantId) 
        ? { ...i, quantity: i.quantity + delta } 
        : i
    ).filter(i => i.quantity > 0));
  };

  const total = useMemo(() => cart.reduce((acc, curr) => {
    const price = curr.selectedVariant ? curr.selectedVariant.price : curr.price;
    return acc + (price * curr.quantity);
  }, 0), [cart]);

  const effectiveReceived = receivedAmount === '' ? total : parseFloat(receivedAmount);
  const changeAmount = paymentMethod === 'Efectivo' ? Math.max(0, effectiveReceived - total) : 0;

  const handleProcessOrder = async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    const orderData = {
      customer_name: "Venta Local",
      customer_phone: "POS",
      items: cart.map(i => ({ 
        name: i.name, 
        quantity: i.quantity, 
        price: i.selectedVariant ? i.selectedVariant.price : i.price,
        variant: i.selectedVariant?.name || null
      })),
      total: total,
      modality: 'pickup',
      address: 'Mostrador',
      status: 'Completado', 
      payment_method: paymentMethod,
      order_origin: 'Local',
      session_id: session.id
    };

    try {
      const { data, error } = await supabase.from('orders').insert(orderData).select().single();
      if (error) throw error;

      await supabase.rpc('increment_session_sales', { session_id: session.id, amount: total });
      
      const finalReceipt = {
        ...data,
        received: effectiveReceived,
        change: changeAmount,
        cashier: session.user_name
      };
      
      setReceiptData(finalReceipt);
      setShowReceiptModal(true);
      
      setCart([]);
      setReceivedAmount('');
      onOrderComplete();
    } catch (e: any) {
      alert("⚠️ Error: " + (e.message || "Problema al cobrar"));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMenu = menu.filter(m => 
    (activeCategory === 'Todos' || m.category === activeCategory) &&
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex overflow-hidden bg-slate-100 relative select-none">
      
      {/* 1. SECCIÓN PRODUCTOS (GRID XL) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <div className="h-20 bg-white border-b border-slate-100 flex items-center px-6 gap-6">
          <div className="relative w-80">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text" 
              placeholder="¿Qué busca el churre?" 
              className="w-full bg-slate-50 border-none px-10 py-3 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-pink-100 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1 py-2">
            <button 
              onClick={() => setActiveCategory('Todos')} 
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === 'Todos' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              Todos
            </button>
            {categories.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveCategory(c.name)} 
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c.name ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 content-start">
            {filteredMenu.map(item => (
              <button 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="group relative bg-white p-4 rounded-[2.5rem] flex flex-col items-center gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 border border-slate-100"
              >
                <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-slate-100">
                   <img src={item.image || "https://i.ibb.co/3mN9fL8/logo-churre.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center px-1">
                  <p className="text-xs font-black text-slate-800 uppercase leading-tight mb-1 line-clamp-2 h-8 flex items-center justify-center">{item.name}</p>
                  <p className="text-lg font-black text-[#e91e63] tracking-tighter brand-font">S/ {item.price.toFixed(2)}</p>
                </div>
                {item.variants && item.variants.length > 0 && (
                  <div className="absolute top-4 right-4 w-4 h-4 bg-pink-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PANEL DE COBRO (ANCLADO) */}
      <div className="w-[420px] flex flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Ticket Actual</h3>
          <button onClick={() => {if(confirm('¿Vaciar carrito?')) setCart([])}} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-all">Limpiar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
               <i className="fa-solid fa-shopping-basket text-8xl mb-6"></i>
               <p className="font-black text-xs uppercase tracking-widest">Esperando productos...</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedVariant?.id || idx}`} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center justify-between group animate-fade-in-up">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-black text-slate-800 text-xs uppercase truncate leading-none mb-1">{item.name}</p>
                  {item.selectedVariant && <p className="text-[9px] font-black text-[#e91e63] uppercase mb-1">{item.selectedVariant.name}</p>}
                  <p className="text-[10px] font-bold text-slate-400">S/ {(item.selectedVariant?.price || item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.id, -1, item.selectedVariant?.id)} className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i className="fa-solid fa-minus text-[10px]"></i></button>
                  <span className="w-6 text-center font-black text-slate-800 text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1, item.selectedVariant?.id)} className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i className="fa-solid fa-plus text-[10px]"></i></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel de Cobro Anclado */}
        <div className="p-8 bg-slate-50 border-t border-slate-200 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-4 gap-2">
            {['Efectivo', 'Yape', 'Plin', 'Tarjeta'].map(m => (
              <button 
                key={m} 
                onClick={() => setPaymentMethod(m as any)} 
                className={`py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${paymentMethod === m ? 'bg-pink-500 text-white shadow-xl shadow-pink-100' : 'bg-white text-slate-400 border border-slate-200 hover:border-pink-200'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-[9px] font-black uppercase text-slate-300">Paga con (S/)</span>
                <button onClick={() => setReceivedAmount('')} className="text-[8px] font-black text-pink-500 bg-pink-50 px-3 py-1.5 rounded-xl uppercase hover:bg-pink-100">S/ Exacto</button>
             </div>
             <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  placeholder={total.toFixed(2)}
                  className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl font-black text-slate-800 text-3xl outline-none"
                  value={receivedAmount}
                  onChange={e => setReceivedAmount(e.target.value)}
                />
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase">Vuelto</p>
                  <p className="text-xl font-black text-green-600">S/ {changeAmount.toFixed(2)}</p>
                </div>
             </div>
          </div>

          <div className="flex justify-between items-center px-2">
             <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Total</span>
             <span className="text-5xl font-black text-slate-900 tracking-tighter brand-font">S/ {total.toFixed(2)}</span>
          </div>

          <button 
            disabled={cart.length === 0 || isProcessing || (paymentMethod === 'Efectivo' && receivedAmount !== '' && parseFloat(receivedAmount) < total)}
            onClick={handleProcessOrder}
            className={`w-full py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${cart.length === 0 ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200 hover:shadow-slate-300'}`}
          >
            {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-bolt-lightning text-lg text-yellow-300"></i><span>COBRAR AHORA</span></>}
          </button>
        </div>
      </div>

      {/* MODAL RECIBO (VISIBILIDAD ABSOLUTA) */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[380px] rounded-[4rem] p-10 shadow-2xl animate-zoom-in my-auto">
            <div id="thermal-receipt" className="bg-white font-mono text-[10px] text-black p-8 border-2 border-slate-100 rounded-3xl leading-snug shadow-inner mb-8">
               <div className="text-center mb-8 space-y-1">
                  <h2 className="text-[16px] font-black uppercase tracking-tight">EL CHURRE MALCRIADO</h2>
                  <p className="text-[9px] font-bold opacity-60">Auténtica Sazón Piurana</p>
                  <div className="border-y border-dashed border-black/30 py-3 my-4">
                     <p className="font-black text-sm">ORDEN #000{receiptData.id}</p>
                     <p className="text-[8px] uppercase">{new Date(receiptData.created_at).toLocaleString('es-PE')}</p>
                  </div>
               </div>

               <div className="mb-8">
                  <div className="flex justify-between border-b border-dashed border-black/20 pb-2 mb-3 font-bold uppercase text-[9px]">
                     <span className="w-10">Cant</span>
                     <span className="flex-1 text-center">Descripción</span>
                     <span className="w-20 text-right">Total</span>
                  </div>
                  <div className="space-y-2">
                    {receiptData.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start">
                        <span className="w-10 font-bold">{it.quantity}</span>
                        <div className="flex-1 px-2 overflow-hidden">
                           <p className="truncate uppercase font-medium">{it.name}</p>
                           {it.variant && <p className="text-[8px] italic opacity-60">- {it.variant}</p>}
                        </div>
                        <span className="w-20 text-right font-black">S/ {(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="border-t border-dashed border-black/30 pt-4 space-y-2">
                  <div className="flex justify-between font-black text-[13px]">
                     <span>TOTAL PAGADO:</span>
                     <span>S/ {receiptData.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold opacity-60">
                     <span>FORMA DE PAGO:</span>
                     <span className="uppercase">{receiptData.payment_method}</span>
                  </div>
                  {receiptData.payment_method === 'Efectivo' && (
                    <div className="flex justify-between font-black text-[11px] border-t border-black/10 pt-2 mt-2">
                       <span>VUELTO:</span>
                       <span>S/ {parseFloat(receiptData.change || '0').toFixed(2)}</span>
                    </div>
                  )}
               </div>

               <div className="mt-10 text-center text-[8px] uppercase font-bold space-y-1 opacity-40">
                  <p>¡Gracias churre! Vuelve pronto.</p>
                  <p>Atendido por: {receiptData.cashier}</p>
               </div>
            </div>

            <div className="space-y-3 no-print">
               <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => window.print()} className="py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg">
                   <i className="fa-solid fa-print"></i>Imprimir
                 </button>
                 <button 
                  onClick={() => {
                    const msg = encodeURIComponent(`🔥 *EL CHURRE MALCRIADO*\nHola churre, aquí tu ticket #000${receiptData.id}\nTotal: S/ ${receiptData.total.toFixed(2)}\n¡Vuelve pronto! 🌶️`);
                    window.open(`https://wa.me/?text=${msg}`, '_blank');
                  }} 
                  className="py-5 bg-green-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-green-100"
                 >
                   <i className="fa-brands fa-whatsapp text-lg"></i>WhatsApp
                 </button>
               </div>
               <button 
                onClick={() => { setShowReceiptModal(false); setReceiptData(null); }}
                className="w-full py-6 bg-pink-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-pink-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
               >
                 NUEVA VENTA
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt, #thermal-receipt * { visibility: visible; }
          #thermal-receipt {
            position: fixed; left: 0; top: 0; width: 100%;
            border: none !important; box-shadow: none !important; margin: 0; padding: 0;
          }
          .no-print { display: none !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};
