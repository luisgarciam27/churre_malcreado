import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MenuItem, ItemVariant, CartItem } from './types';
import { MENU_ITEMS, CATEGORIES } from './data';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { FavoritesView } from './components/FavoritesView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';

const WHATSAPP_NUMBER = '51936494711';

export const App: React.FC = () => {
  // Navigation tabs: 'inicio' | 'menu' | 'favoritos'
  const [activeTab, setActiveTab] = useState<'inicio' | 'menu' | 'favoritos'>('inicio');

  // Modality: 'delivery' | 'pickup'
  const [modality, setModality] = useState<'delivery' | 'pickup'>('delivery');

  // Search & Categories for Menu
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Item for Detail Modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('churre_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Favorites State (Persisted in localStorage)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('churre_favs');
      return saved ? JSON.parse(saved) : ['sg-churre-malcriado', 'sg-pan-con-chicharron'];
    } catch {
      return ['sg-churre-malcriado', 'sg-pan-con-chicharron'];
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('churre_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Error saving cart:', e);
    }
  }, [cart]);

  // Save Favorites to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('churre_favs', JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn('Error saving favorites:', e);
    }
  }, [favoriteIds]);

  // Featured & Popular items
  const featuredItem = useMemo(() => {
    return MENU_ITEMS.find(i => i.id === 'sg-churre-malcriado') || MENU_ITEMS[0];
  }, []);

  const popularItems = useMemo(() => {
    return MENU_ITEMS.filter(i => i.isPopular);
  }, []);

  const favoriteItems = useMemo(() => {
    return MENU_ITEMS.filter(item => favoriteIds.includes(item.id));
  }, [favoriteIds]);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((item: MenuItem) => {
    setFavoriteIds(prev =>
      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  // Add to Cart from Detail Modal
  const handleAddToCart = useCallback(
    (
      item: MenuItem,
      selectedVariant: ItemVariant | undefined,
      quantity: number,
      selectedSauces: string[],
      instructions: string
    ) => {
      const cartItemId = `${item.id}_${selectedVariant?.id || 'default'}_${selectedSauces.sort().join('_')}_${instructions.trim()}`;

      setCart(prev => {
        const existingIndex = prev.findIndex(i => i.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        }
        return [
          ...prev,
          {
            ...item,
            cartItemId,
            quantity,
            selectedVariant,
            selectedSauces,
            specialInstructions: instructions
          }
        ];
      });

      setIsCartOpen(true);
    },
    []
  );

  // Quick Add from Grid Cards
  const handleQuickAdd = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
  }, []);

  // Cart actions
  const handleRemoveFromCart = useCallback((cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, []);

  const handleUpdateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#faf6f7] text-[#1a1115] flex flex-col font-sans selection:bg-pink-100 selection:text-[#e51d5a]">
      
      {/* Encabezado Superior con Selector de Zona y Modalidad */}
      <TopHeader
        modality={modality}
        onToggleModality={setModality}
        showModalityToggle={activeTab !== 'inicio'}
      />

      {/* Contenido Principal según Tab */}
      <main className="flex-1 w-full max-w-2xl mx-auto">
        {activeTab === 'inicio' && (
          <HomeView
            onGoToMenu={() => setActiveTab('menu')}
            featuredItem={featuredItem}
            popularItems={popularItems}
            onSelectItem={setSelectedItem}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {activeTab === 'menu' && (
          <MenuView
            categories={CATEGORIES}
            menuItems={MENU_ITEMS}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectItem={setSelectedItem}
            onQuickAdd={handleQuickAdd}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        )}

        {activeTab === 'favoritos' && (
          <FavoritesView
            favoriteItems={favoriteItems}
            onSelectItem={setSelectedItem}
            onQuickAdd={handleQuickAdd}
            onToggleFavorite={handleToggleFavorite}
            onGoToMenu={() => setActiveTab('menu')}
          />
        )}

        {/* Pie de página oficial con Información de Local, Horarios y WhatsApp */}
        <Footer />
      </main>

      {/* Barra de Navegación Inferior Flotante */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favoriteIds.length}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modal de Detalle del Producto */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Carrito de Compras Lateral & Checkout WhatsApp */}
      <Cart
        items={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        modality={modality}
        onToggleModality={setModality}
        whatsappNumber={WHATSAPP_NUMBER}
      />

    </div>
  );
};

export default App;
