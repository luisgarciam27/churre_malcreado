
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Category, MenuItem, CartItem, AppConfig, ItemVariant } from './types';
import { MENU_ITEMS as DEFAULT_MENU } from './data';
import { MenuItemCard } from './components/MenuItemCard';
import { Cart } from './components/Cart';
import { ProductDetailModal } from './components/ProductDetailModal';
import { getRecommendation } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { AdminManager } from './components/Admin/AdminManager';

const DEFAULT_CONFIG: AppConfig = {
  menu: DEFAULT_MENU,
  images: {
    logo: "https://i.ibb.co/3mN9fL8/logo-churre.png",
    menuLogo: "https://i.ibb.co/3mN9fL8/logo-churre.png",
    selectorLogo: "https://i.ibb.co/3mN9fL8/logo-churre.png",
    aiAvatar: "https://i.ibb.co/3mN9fL8/logo-churre.png",
    slideBackgrounds: [
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=60&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=60&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=60&w=1600&auto=format&fit=crop"
    ],
    menuBackground: ""
  },
  whatsappNumber: "51936494711",
  socialMedia: { facebook: "", instagram: "https://instagram.com/churremalcriado", tiktok: "https://tiktok.com/@churremalcriado" },
  paymentQr: "https://i.ibb.co/7Xk7x3M/qr-mock.png",
  paymentName: "Churre Malcriado"
};

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'SANGUCHES' },
    { id: 2, name: 'PLATOS' },
    { id: 3, name: 'BEBIDAS' },
    { id: 4, name: 'EXTRAS' }
  ]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'menu' | 'admin'>('landing');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [displayedAiText, setDisplayedAiText] = useState<string>("");
  const [userInput, setUserInput] = useState("");
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);

  useEffect(() => {
    if (view === 'landing' && config.images.slideBackgrounds.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % config.images.slideBackgrounds.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [view, config.images.slideBackgrounds]);

  const loadData = useCallback(async () => {
    try {
      const [menuRes, catRes, configRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('app_config').select('*').eq('id', 1).maybeSingle()
      ]);

      if (configRes.data) {
        setConfig(prev => ({
          ...prev,
          images: configRes.data.images || prev.images,
          whatsappNumber: configRes.data.whatsapp_number || prev.whatsappNumber,
          socialMedia: configRes.data.social_media || prev.socialMedia,
          paymentQr: configRes.data.payment_qr || prev.paymentQr,
          paymentName: configRes.data.payment_name || prev.paymentName
        }));
      }

      if (menuRes.data && menuRes.data.length > 0) {
        const mapped = menuRes.data.map((item: any) => ({
          ...item,
          isPopular: item.is_popular,
          isCombo: item.is_combo,
          variants: item.variants || [], // Aseguramos que las variantes se carguen
          image: item.image || 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=60&w=800'
        }));
        setConfig(prev => ({ ...prev, menu: mapped }));
      }
      if (catRes.data && catRes.data.length > 0) setCategories(catRes.data);
    } catch (e) { console.warn("Error cargando datos:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadData();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowPasswordModal(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadData]);

  const handleAdminAccess = () => {
    if (adminPassword === 'admin123') {
      setView('admin');
      setShowPasswordModal(false);
      setAdminPassword('');
    } else {
      alert("⚠️ ¡Habla sobrino! Esa clave no es la malcriada.");
      setAdminPassword('');
    }
  };

  const addToCart = useCallback((item: MenuItem, variant?: ItemVariant) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant?.id === variant?.id);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.selectedVariant?.id === variant?.id) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, selectedVariant: variant }];
    });
  }, []);

  const handleAskAi = async () => {
    if (!userInput.trim() || isAskingAi) return;
    setIsAskingAi(true);
    setDisplayedAiText("... El Churre está buscando en la cocina ...");
    try {
      const response = await getRecommendation(userInput, config.menu);
      setRecommendedIds(response.suggestedItemIds);
      setDisplayedAiText(response.recommendationText);
    } catch (e) { setDisplayedAiText("¡Habla churre! Se me quemó el arroz, pídeme de nuevo."); }
    finally { setIsAskingAi(false); setUserInput(""); }
  };

  const filteredMenu = useMemo(() => {
    return config.menu.filter(item => {
      const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchesSearch = (item.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAi = recommendedIds.length === 0 || recommendedIds.includes(item.id);
      return matchesCategory && matchesSearch && matchesAi;
    });
  }, [config.menu, activeCategory, searchTerm, recommendedIds]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f8eded]">
      <div className="loader-pink mb-4"></div>
      <p className="brand-font font-bold text-[#e91e63] animate-pulse">Sazonando la carta...</p>
    </div>
  );

  if (view === 'admin') {
    return <AdminManager menu={config.menu} categories={categories} config={config} />;
  }

  return (
    <div className="min-h-screen bg-[#f8eded]">
      
      {/* Hero / Landing - Tonos Rosa Malcriado Profundo */}
      {view === 'landing' && (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-[#4a041c]">
          {config.images.slideBackgrounds.map((bg, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${currentSlide === index ? 'opacity-40' : 'opacity-0'}`}
              style={{ zIndex: currentSlide === index ? 1 : 0 }}
            >
              <img 
                src={bg} 
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${currentSlide === index ? 'scale-110' : 'scale-100'}`} 
              />
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a041c] via-[#e91e63]/20 to-[#4a041c]/90 z-10"></div>

          <div className="relative z-20 text-center px-6 max-w-4xl animate-market">
            <img src={config.images.logo} className="w-48 md:w-64 mx-auto mb-10 drop-shadow-[0_0_50px_rgba(233,30,99,0.7)]" />
            <h1 className="brand-font text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              Churre <span className="text-[#fdd835]">Malcriado</span>
            </h1>
            <p className="text-white font-medium text-xl md:text-2xl mb-14 opacity-90 brand-font tracking-wide">
              EL VERDADERO SABOR CASERO DE PIURA.
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setView('menu')}
                className="px-16 py-6 bg-[#e91e63] text-white rounded-full brand-font font-bold text-2xl shadow-[0_20px_40px_rgba(233,30,99,0.5)] hover:scale-110 active:scale-95 transition-all uppercase tracking-[0.2em] border-2 border-[#e91e63] flex items-center gap-4 group"
              >
                <span>Ver la Carta</span>
                <i className="fa-solid fa-arrow-right text-lg group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
              {config.images.slideBackgrounds.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-10 bg-[#fdd835]' : 'w-3 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'menu' && (
        <div className="animate-market">
          <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'glass-header py-3 shadow-md' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('landing')}>
                <img src={config.images.logo} className={`transition-all duration-300 ${scrolled ? 'w-10' : 'w-16'}`} />
                <span className={`brand-font font-bold text-[#e91e63] ${scrolled ? 'text-lg' : 'text-2xl'}`}>CHURRE</span>
              </div>
              
              <button onClick={() => setIsCartOpen(true)} className="relative group">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-[#e91e63] text-[#e91e63] rounded-2xl flex items-center justify-center hover:bg-[#e91e63] hover:text-white transition-all shadow-lg">
                    <i className="fa-solid fa-basket-shopping text-xl"></i>
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#fdd835] text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{cart.reduce((a,b) => a+b.quantity, 0)}</span>}
                 </div>
              </button>
            </div>
          </header>

          <main className="pt-32 pb-32 max-w-7xl mx-auto px-6 md:px-12">
            {/* AI Advisor */}
            <section className="mb-16">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] border-2 border-[#e91e63]/10 shadow-xl relative overflow-hidden">
                <div className="relative z-10 grid md:grid-cols-5 gap-8 items-center">
                  <div className="md:col-span-2">
                    <h3 className="brand-font text-3xl text-[#e91e63] font-bold mb-4">¡Habla sobrino!</h3>
                    <p className="text-[#3d1a1a]/60 text-sm mb-6">Dime qué tienes hambre y el Churre te recomienda lo mejor del Mercado.</p>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Quiero algo con chifles..." 
                        className="w-full bg-[#f8eded] border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-[#e91e63]/20 transition-all font-medium text-sm"
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAskAi()}
                      />
                      <button onClick={handleAskAi} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#e91e63] text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                        <i className={`fa-solid ${isAskingAi ? 'fa-spinner fa-spin' : 'fa-wand-sparkles'}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-3 min-h-[80px] flex items-center bg-[#fdd835]/10 p-6 rounded-3xl border border-[#fdd835]/20">
                    {displayedAiText ? (
                      <p className="text-[#3d1a1a] text-lg italic brand-font animate-fade-in leading-relaxed">
                        "{displayedAiText}"
                      </p>
                    ) : (
                      <p className="text-[#3d1a1a]/40 text-xs font-bold uppercase tracking-widest text-center w-full">Asesoría Gastronómica Piurana Activa</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Categorías y Filtros */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button 
                  onClick={() => { setActiveCategory('Todos'); setRecommendedIds([]); }} 
                  className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === 'Todos' && recommendedIds.length === 0 ? 'bg-[#e91e63] text-white border-[#e91e63]' : 'bg-white text-[#e91e63] border-white hover:border-[#e91e63]/20 shadow-sm'}`}
                >
                  Toda la Carta
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => { setActiveCategory(cat.name); setRecommendedIds([]); }} 
                    className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === cat.name && recommendedIds.length === 0 ? 'bg-[#e91e63] text-white border-[#e91e63]' : 'bg-white text-[#e91e63] border-white hover:border-[#e91e63]/20 shadow-sm'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-[#e91e63]/30"></i>
                <input 
                  type="text" 
                  placeholder="BUSCAR PLATO..." 
                  className="w-full bg-white border-none py-4 pl-12 pr-6 rounded-full text-xs font-bold uppercase tracking-widest outline-none shadow-sm focus:ring-2 focus:ring-[#e91e63]/10 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {filteredMenu.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={(it) => addToCart(it)} 
                  onShowDetails={() => setSelectedItem(item)} 
                />
              ))}
            </div>
          </main>
          
          <footer className="bg-white py-20 px-6 border-t border-[#e91e63]/5">
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-center text-center md:text-left">
               <div>
                  <img src={config.images.logo} className="w-24 mx-auto md:mx-0 mb-6 grayscale opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#3d1a1a]/40">Mercado 2 de Surquillo <br/> Puesto 651 | 7am a 7pm</p>
               </div>
               <div className="flex flex-col gap-4">
                  <h4 className="brand-font font-bold text-[#e91e63] text-lg uppercase tracking-widest">Síguenos</h4>
                  <div className="flex justify-center md:justify-start gap-6">
                    <a href={config.socialMedia.instagram} target="_blank" className="text-2xl text-[#3d1a1a]/20 hover:text-[#e91e63] transition-colors"><i className="fa-brands fa-instagram"></i></a>
                    <a href={config.socialMedia.tiktok} target="_blank" className="text-2xl text-[#3d1a1a]/20 hover:text-[#e91e63] transition-colors"><i className="fa-brands fa-tiktok"></i></a>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-[#e91e63]/40 hover:text-[#e91e63] transition-all mt-4 border border-dashed border-[#e91e63]/20 px-4 py-2 rounded-lg"
                  >
                    Acceso Administración
                  </button>
               </div>
               <div className="text-[10px] font-bold text-[#3d1a1a]/20 uppercase tracking-[0.3em] md:text-right">
                  Llegamos a Lima para quedarnos. <br/> © 2025 Churre Malcriado.
               </div>
            </div>
          </footer>
        </div>
      )}

      {/* Modal de Password Admin */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#4a041c]/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-zoom-in text-center">
            <div className="w-20 h-20 bg-pink-50 text-[#e91e63] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <i className="fa-solid fa-lock text-3xl"></i>
            </div>
            <h3 className="brand-font text-2xl font-bold text-slate-800 mb-2">Acceso Reservado</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Solo personal malcriado</p>
            
            <input 
              autoFocus
              type="password" 
              placeholder="Contraseña"
              className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-black text-center text-xl outline-none focus:border-[#e91e63]/20 transition-all mb-6"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdminAccess()}
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdminAccess}
                className="flex-1 py-4 bg-[#e91e63] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-pink-100 active:scale-95 transition-all"
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <ProductDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onAddToCart={(item, variant) => { addToCart(item, variant); setSelectedItem(null); }} 
        />
      )}

      <Cart 
        items={cart} 
        isOpen={isCartOpen} 
        onToggle={() => setIsCartOpen(!isCartOpen)} 
        onRemove={(id, vId) => setCart(prev => prev.filter(i => !(i.id === id && i.selectedVariant?.id === vId)))} 
        onUpdateQuantity={(id, delta, vId) => { setCart(prev => prev.map(i => (i.id === id && i.selectedVariant?.id === vId) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)); }} 
        onClearCart={() => setCart([])} 
        initialModality={'pickup'} 
        whatsappNumber={config.whatsappNumber} 
        paymentQr={config.paymentQr} 
        paymentName={config.paymentName} 
      />
    </div>
  );
};

export default App;
