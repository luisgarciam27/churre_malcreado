
import React, { useState } from 'react';
import { MenuItem, Category } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface AdminInventoryProps {
  menu: MenuItem[];
  categories: Category[];
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ menu, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price) return alert("Faltan datos.");
    setLoading(true);

    try {
      const payload = {
        name: editingItem.name,
        description: editingItem.description || "",
        price: parseFloat(editingItem.price.toString()),
        category: editingItem.category || categories[0]?.name,
        image: editingItem.image || "https://picsum.photos/seed/food/400/300",
        is_popular: editingItem.isPopular || false,
      };

      let error;
      if (editingItem.id) {
        const { error: err } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id);
        error = err;
      } else {
        const { error: err } = await supabase.from('menu_items').insert(payload);
        error = err;
      }

      if (!error) {
        alert("¡Actualizado!");
        window.location.reload();
      } else throw error;
    } catch (e: any) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Borrar plato?")) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) window.location.reload();
  };

  return (
    <div className="p-10 h-full overflow-y-auto bg-white custom-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-slate-800 brand-font">Carta de Productos</h3>
        <button 
          onClick={() => { setEditingItem({}); setIsModalOpen(true); }}
          className="bg-[#e91e63] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <div key={item.id} className="bg-slate-50 border border-slate-100 p-5 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
            <img src={item.image} className="w-20 h-20 rounded-[1.5rem] object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase text-[#e91e63]">{item.category}</p>
              <p className="font-bold text-slate-800 truncate">{item.name}</p>
              <p className="font-black text-slate-900 text-sm">S/ {item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2">
               <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-blue-500 border border-slate-200 flex items-center justify-center"><i className="fa-solid fa-pen text-xs"></i></button>
               <button onClick={() => deleteItem(item.id)} className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-red-500 border border-slate-200 flex items-center justify-center"><i className="fa-solid fa-trash text-xs"></i></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
           <form onSubmit={handleSave} className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-zoom-in">
              <h3 className="text-2xl font-black text-slate-800 mb-8 brand-font">Detalles del Plato</h3>
              <div className="space-y-4">
                 <input type="text" placeholder="Nombre" className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem!, name: e.target.value})} />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.1" placeholder="Precio" className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none outline-none" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem!, price: parseFloat(e.target.value)})} />
                    <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none" value={editingItem?.category || categories[0]?.name} onChange={e => setEditingItem({...editingItem!, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                 </div>
                 <textarea placeholder="Descripción" className="w-full bg-slate-50 p-4 rounded-2xl font-medium border-none outline-none h-24 resize-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem!, description: e.target.value})} />
                 <input type="text" placeholder="URL de Imagen (PostImages)" className="w-full bg-slate-50 p-4 rounded-2xl font-medium border-none outline-none text-xs" value={editingItem?.image || ''} onChange={e => setEditingItem({...editingItem!, image: e.target.value})} />
                 <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#e91e63]" checked={editingItem?.isPopular || false} onChange={e => setEditingItem({...editingItem!, isPopular: e.target.checked})} />
                    <span className="text-xs font-black uppercase text-slate-500">Marcar como popular</span>
                 </label>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Cerrar</button>
                    <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#e91e63] text-white rounded-2xl font-black uppercase text-[10px] shadow-lg">Guardar</button>
                 </div>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
