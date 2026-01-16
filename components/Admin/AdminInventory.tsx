
import React, { useState, useRef } from 'react';
import { MenuItem, Category, ItemVariant } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface AdminInventoryProps {
  menu: MenuItem[];
  categories: Category[];
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ menu, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSqlHelp, setShowSqlHelp] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastError, setLastError] = useState<{message: string, code?: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const FULL_SQL_FIX = `-- 1. PERMISOS PARA LA CARTA (MENU_ITEMS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir todo a anon" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

-- 2. PERMISOS PARA IMÁGENES (STORAGE)
-- Ejecuta esto en el SQL Editor para poder subir fotos
CREATE POLICY "Acceso Publico" ON storage.objects FOR ALL USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

-- 3. FUNCIONES DE CAJA (RPC) - ¡MUY IMPORTANTE!
-- Estas funciones permiten que el POS sume dinero a la sesión de caja
CREATE OR REPLACE FUNCTION increment_session_sales(session_id int8, amount float8)
RETURNS void AS $$
BEGIN
  UPDATE cash_sessions SET total_sales = total_sales + amount WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_session_entry(session_id int8, amount float8)
RETURNS void AS $$
BEGIN
  UPDATE cash_sessions SET total_entry = total_entry + amount WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_session_exit(session_id int8, amount float8)
RETURNS void AS $$
BEGIN
  UPDATE cash_sessions SET total_exit = total_exit + amount WHERE id = session_id;
END;
$$ LANGUAGE plpgsql;`;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setLastError(null);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setEditingItem(prev => ({ ...prev!, image: publicUrl }));
      alert("¡Imagen subida! 📸");
    } catch (error: any) {
      console.error("Error al subir:", error);
      setLastError({ message: "Error de permisos: No se pudo subir la imagen. Usa el botón 'Ayuda SQL'." });
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Deseas eliminar este plato definitivamente?")) return;
    
    setLoading(true);
    try {
      // Intentamos eliminar directamente por ID
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error al eliminar:", error);
        if (error.message.includes('row-level security')) {
          alert("❌ BLOQUEADO POR SEGURIDAD: Debes activar la política de borrado en Supabase usando el botón 'Ayuda SQL'.");
        } else {
          alert("❌ Error: " + error.message);
        }
      } else {
        alert("¡Plato eliminado!");
        window.location.reload();
      }
    } catch (e: any) {
      alert("Error inesperado: " + e.message);
    } finally {
      setLoading(false);
    }
  };

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
        image: editingItem.image || "https://i.ibb.co/3mN9fL8/logo-churre.png",
        is_popular: editingItem.isPopular || false,
        variants: editingItem.variants || [],
      };

      const { error } = editingItem.id 
        ? await supabase.from('menu_items').update(payload).eq('id', editingItem.id)
        : await supabase.from('menu_items').insert({ ...payload, id: `it-${Date.now()}` });

      if (error) throw error;
      window.location.reload();
    } catch (e: any) { alert("Error al guardar: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-10 h-full overflow-y-auto bg-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-800 brand-font">Gestión de Carta</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control de inventario malcriado</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSqlHelp(!showSqlHelp)}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
          >
            <i className="fa-solid fa-screwdriver-wrench"></i> Reparar Base de Datos (SQL)
          </button>
          <button 
            onClick={() => { setEditingItem({ variants: [] }); setIsModalOpen(true); }}
            className="bg-[#e91e63] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-plus"></i> Nuevo Plato
          </button>
        </div>
      </div>

      {showSqlHelp && (
        <div className="mb-10 p-8 bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-300 animate-fade-in">
           <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black uppercase text-slate-800 tracking-widest">Script de Reparación Supabase</h4>
              <button onClick={() => setShowSqlHelp(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark"></i></button>
           </div>
           <p className="text-[10px] text-slate-500 mb-6 font-bold leading-relaxed">
              Copia este código y pégalo en el <b>SQL Editor</b> de tu panel de Supabase. Esto habilitará el borrado, la subida de fotos y el sistema de caja.
           </p>
           <div className="relative">
              <pre className="bg-slate-800 text-green-400 p-6 rounded-2xl text-[9px] font-mono overflow-x-auto border border-black/10">
                {FULL_SQL_FIX}
              </pre>
              <button 
                onClick={() => { navigator.clipboard.writeText(FULL_SQL_FIX); alert("¡Script copiado! Pégalo en el SQL Editor de Supabase y dale a RUN."); }}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white"
              >
                <i className="fa-solid fa-copy"></i> Copiar Código
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <div key={item.id} className="bg-slate-50 border border-slate-100 p-5 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
            <img src={item.image} className="w-20 h-20 rounded-[1.5rem] object-cover bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase text-[#e91e63] mb-1">{item.category}</p>
              <p className="font-bold text-slate-800 truncate text-sm">{item.name}</p>
              <p className="font-black text-slate-900 text-xs">S/ {item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="w-9 h-9 rounded-xl bg-white text-slate-400 hover:text-blue-500 border border-slate-200 flex items-center justify-center shadow-sm"><i className="fa-solid fa-pen text-xs"></i></button>
               <button onClick={() => deleteItem(item.id)} className="w-9 h-9 rounded-xl bg-white text-slate-400 hover:text-red-500 border border-slate-200 flex items-center justify-center shadow-sm"><i className="fa-solid fa-trash text-xs"></i></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
           <form onSubmit={handleSave} className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 shadow-2xl animate-zoom-in max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-black text-slate-800 brand-font">{editingItem?.id ? 'Editar Plato' : 'Nuevo Plato'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Foto del Plato</label>
                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                       <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 overflow-hidden shrink-0 shadow-sm">
                          <img src={editingItem?.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 space-y-3">
                          <button 
                            type="button" 
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:border-[#e91e63] hover:text-[#e91e63] transition-all flex items-center justify-center gap-2"
                          >
                            {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-camera"></i>}
                            {uploading ? 'Subiendo...' : 'Cambiar Foto'}
                          </button>
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Nombre</label>
                    <input type="text" required className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem!, name: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Precio S/</label>
                       <input type="number" step="0.1" required className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem!, price: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Categoría</label>
                       <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.category || categories[0]?.name} onChange={e => setEditingItem({...editingItem!, category: e.target.value})}>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                    <button type="submit" disabled={loading || uploading} className="flex-1 py-5 bg-[#e91e63] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-pink-100 active:scale-95 transition-all">
                       {loading ? 'Guardando...' : 'Guardar Plato'}
                    </button>
                 </div>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
